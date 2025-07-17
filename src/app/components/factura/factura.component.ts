import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { FacturaService, Factura } from 'src/app/services/factura.service';
import { PedidoService, Pedido } from 'src/app/services/pedido.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {
  facturas: Factura[] = [];
  facturasFiltradas: Factura[] = [];
  pedidos: Pedido[] = [];
  clientes: any[] = [];
  filtroEstado: string = '';
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [5, 10, 15];

  nuevoFactura: Factura = this.resetFactura();
  facturaEdit: Factura = this.resetFactura();
  facturaParaEliminar: Factura | null = null;

  pedidoSeleccionado: Pedido | null = null;
  pedidoSeleccionadoEdit: Pedido | null = null;
  clienteSeleccionado: any | null = null;
  selectedFile: File | null = null;
  selectedFileEdit: File | null = null;

  constructor(
    private facturaService: FacturaService,
    private pedidoService: PedidoService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.facturaService.getFacturas().subscribe(data => {
      this.facturas = data;
      this.facturasFiltradas = [...data];
    });
    this.pedidoService.getPedidos().subscribe(data => this.pedidos = data);
    this.clienteService.getClientes().subscribe(data => this.clientes = data);
  }

  resetFactura(): Factura {
    return {
      numeroFactura: this.generarNumeroFacturaTemporal(), 
      fecha: new Date().toISOString().substring(0, 10),
      pedidoId: 0, 
      clienteCedula: '',
      estadoPago: 'Pendiente',
      archivo: null,
      observaciones: ''
    };
  }

  generarNumeroFacturaTemporal(): string {
    const fecha = new Date();
    const yyyy = fecha.getFullYear();
    const mm = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dd = fecha.getDate().toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `FAC${yyyy}${mm}${dd}${random}`;
  }

  abrirModalNuevo(): void {
    this.nuevoFactura = this.resetFactura();
    this.pedidoSeleccionado = null;
    this.clienteSeleccionado = null;
    this.selectedFile = null;
    const modal = new bootstrap.Modal(document.getElementById('nuevoFacturaModal')!);
    modal.show();
  }

  abrirModalEditar(factura: Factura): void {
    this.facturaEdit = { ...factura };
    if (this.facturaEdit.fecha) {
      this.facturaEdit.fecha = new Date(this.facturaEdit.fecha).toISOString().substring(0, 10);
    }

    this.pedidoSeleccionadoEdit = this.pedidos.find(p => p.pedidoId === factura.pedidoId) || null;
    this.clienteSeleccionado = this.clientes.find(c => c.cedula === factura.clienteCedula) || null;
    this.selectedFileEdit = null;
    const modal = new bootstrap.Modal(document.getElementById('editarFacturaModal')!);
    modal.show();
  }

  abrirModalEliminar(factura: Factura): void {
    this.facturaParaEliminar = factura;
    const modalEl = document.getElementById('confirmarEliminarFacturaModal');
    if (modalEl) new bootstrap.Modal(modalEl).show();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.nuevoFactura.archivo = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onFileSelectedEdit(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFileEdit = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.facturaEdit.archivo = e.target.result; 
      };
      reader.readAsDataURL(file);
    }
  }

  guardarFactura(): void {
    if (!this.nuevoFactura.pedidoId) {
      console.error('Debe seleccionar un pedido para la factura.');
      return;
    }

    this.facturaService.addFactura(this.nuevoFactura).subscribe(() => {
      this.cargarDatos();
      bootstrap.Modal.getInstance(document.getElementById('nuevoFacturaModal')!)?.hide();
      new bootstrap.Modal(document.getElementById('facturaGuardadaModal')!).show();
    }, error => {
      console.error('Error al guardar la factura:', error);
    });
  }

  actualizarFactura(): void {
    if (!this.facturaEdit.idFactura) return;

    this.facturaService.updateFactura(this.facturaEdit.idFactura, this.facturaEdit).subscribe(() => {
      this.cargarDatos();
      bootstrap.Modal.getInstance(document.getElementById('editarFacturaModal')!)?.hide();
      new bootstrap.Modal(document.getElementById('facturaGuardadaModal')!).show();
    }, error => {
      console.error('Error al actualizar la factura:', error);
    });
  }

  eliminarFactura(factura: Factura): void {
    this.facturaParaEliminar = factura;
    const modalEl = document.getElementById('confirmarEliminarFacturaModal');
    if (modalEl) new bootstrap.Modal(modalEl).show();
  }

  confirmarEliminarFactura(): void {
    if (!this.facturaParaEliminar?.idFactura) return;

    this.facturaService.deleteFactura(this.facturaParaEliminar.idFactura).subscribe(() => {
      this.cargarDatos();
      this.facturaParaEliminar = null;

      const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmarEliminarFacturaModal')!);
      confirmModal?.hide();

      setTimeout(() => {
        const modal = new bootstrap.Modal(document.getElementById('facturaEliminadaModal')!);
        modal.show();
      }, 300);
    }, error => {
      console.error('Error al eliminar la factura:', error);
    });
  }

  filterFacturas(): void {
    const estado = this.filtroEstado;
    const texto = this.searchQuery.toLowerCase();

    this.facturasFiltradas = this.facturas.filter(f => {
      const coincideEstado = estado ? f.estadoPago === estado : true;
      const cliente = this.clientes.find(c => c.cedula === f.clienteCedula);
      const pedido = this.pedidos.find(p => p.pedidoId === f.pedidoId);

      const coincideBusqueda =
        f.numeroFactura.toLowerCase().includes(texto) ||
        cliente?.nombre?.toLowerCase().includes(texto) ||
        pedido?.numeroPedido?.toLowerCase().includes(texto);

      return coincideEstado && coincideBusqueda;
    });

    this.currentPage = 1;
  }

  get paginatedFacturas(): Factura[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.facturasFiltradas.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.facturasFiltradas.length / this.itemsPerPage);
  }

  cambiarPagina(page: number): void {
    this.currentPage = page;
  }

  getNombreCliente(cedula: string): string {
    const cliente = this.clientes.find(c => c.cedula === cedula);
    return cliente ? cliente.nombre : '';
  }

  getNumeroPedido(pedidoId: number): string {
    const pedido = this.pedidos.find(p => p.pedidoId === pedidoId);
    return pedido ? pedido.numeroPedido : '';
  }

  get facturasPagadas(): Factura[] {
    return this.facturas.filter(f => f.estadoPago === 'Cancelado');
  }

  get facturasPendientes(): Factura[] {
    return this.facturas.filter(f => f.estadoPago === 'Pendiente');
  }

  filtrarPorEstado(estado: string): void {
    this.filtroEstado = estado;
    this.filterFacturas();
    this.currentPage = 1;
  }

  buscarPedidos = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? [] :
        this.pedidos.filter(p =>
          p.numeroPedido.toLowerCase().includes(term.toLowerCase()) ||
          this.getNombreCliente(p.clienteCedula).toLowerCase().includes(term.toLowerCase())
        ).slice(0, 10))
    );

  formatearPedido = (p: Pedido) => p.numeroPedido || '';

  onSeleccionPedido(event: any, type: 'nuevo' | 'editar'): void {
    const selectedPedido: Pedido = event.item;
    const targetFactura = type === 'nuevo' ? this.nuevoFactura : this.facturaEdit;
    const targetPedidoSeleccionado = type === 'nuevo' ? 'pedidoSeleccionado' : 'pedidoSeleccionadoEdit';

    this[targetPedidoSeleccionado] = selectedPedido;
    targetFactura.pedidoId = selectedPedido.pedidoId!;
    targetFactura.clienteCedula = selectedPedido.clienteCedula;

    if (selectedPedido.fecha) {
      targetFactura.fecha = new Date(selectedPedido.fecha).toISOString().substring(0, 10);
    } else {
      targetFactura.fecha = new Date().toISOString().substring(0, 10);
    }

    targetFactura.estadoPago = selectedPedido.estadoPago;

    this.clienteSeleccionado = this.clientes.find(c => c.cedula === selectedPedido.clienteCedula) || null;
  }

  getFileName(base64String: string | null | undefined): string {
    if (!base64String) return 'No archivo';
    return base64String.split(';')[0].split(':')[1] || 'archivo_adjunto';
  }

  openFile(base64String: string | null | undefined): void {
    if (base64String) {
      const link = document.createElement('a');
      link.href = base64String;
      link.target = '_blank';
      link.download = 'archivo_adjunto';
      link.click();
    }
  }
}