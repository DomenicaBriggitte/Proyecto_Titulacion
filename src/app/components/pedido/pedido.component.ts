import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { PedidoService, Pedido } from 'src/app/services/pedido.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { CotizacionService } from 'src/app/services/cotizacion.service';
import { FacturaService } from 'src/app/services/factura.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  clientes: any[] = [];
  cotizaciones: any[] = [];
  facturas: any[] = [];
  filtroEstado: string = '';
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  itemsPerPageOptions: number[] = [5, 10, 15];

  nuevoPedido: Pedido = this.resetPedido();
  pedidoEdit: Pedido = this.resetPedido();
  pedidoParaEliminar: Pedido | null = null;

  cotizacionSeleccionada: any = null;
  cotizacionSeleccionadaEdit: any = null;
  clienteSeleccionado: any = null;
  materialesCotizacion: any[] = [];
  materialesCotizacionEdit: any[] = [];

  constructor(
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private cotizacionService: CotizacionService,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.pedidoService.getPedidos().subscribe(data => {
      this.pedidos = data;
      this.pedidosFiltrados = [...data];
    });
    this.clienteService.getClientes().subscribe(data => this.clientes = data);
    this.cotizacionService.getCotizaciones().subscribe(data => this.cotizaciones = data);
    this.facturaService.getFacturas().subscribe(data => this.facturas = data);
  }

  resetPedido(): Pedido {
    return {
      numeroPedido: this.generarNumeroPedido(),
      fecha: '',
      cotizacionId: '',
      clienteCedula: '',
      estadoEntrega: 'Pendiente',
      estadoPago: 'Pendiente',
      estadoPedido: 'Abierto',
      facturaId: null,
      observaciones: ''
    };
  }

  generarNumeroPedido(): string {
    const fecha = new Date();
    const yyyy = fecha.getFullYear();
    const mm = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dd = fecha.getDate().toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `PED${yyyy}${mm}${dd}${random}`;
  }

  abrirModalNuevo(): void {
    this.nuevoPedido = this.resetPedido();
    this.cotizacionSeleccionada = null;
    this.clienteSeleccionado = null;
    this.materialesCotizacion = [];
    const modal = new bootstrap.Modal(document.getElementById('nuevoPedidoModal')!);
    modal.show();
  }

  abrirModalEditar(pedido: Pedido): void {
    this.pedidoEdit = { ...pedido };
    this.cotizacionSeleccionada = this.cotizaciones.find(c => c.cotizacionId === pedido.cotizacionId);
    this.clienteSeleccionado = this.clientes.find(c => c.cedula === pedido.clienteCedula);
    this.materialesCotizacionEdit = this.cotizacionSeleccionada?.materiales || [];
    this.cotizacionSeleccionadaEdit = this.cotizaciones.find(c => c.cotizacionId === pedido.cotizacionId);
    this.materialesCotizacionEdit = this.cotizacionSeleccionadaEdit?.materiales || [];
    const modal = new bootstrap.Modal(document.getElementById('editarPedidoModal')!);
    modal.show();
  }

  abrirModalEliminar(pedido: Pedido): void {
    this.pedidoParaEliminar = pedido;
    const modalEl = document.getElementById('confirmarEliminarPedidoModal');
    if (modalEl) new bootstrap.Modal(modalEl).show();
  }

  guardarPedido(): void {
    this.pedidoService.addPedido(this.nuevoPedido).subscribe(() => {
      this.cargarDatos();
      bootstrap.Modal.getInstance(document.getElementById('nuevoPedidoModal')!)?.hide();
      new bootstrap.Modal(document.getElementById('pedidoGuardadoModal')!).show();
    });
  }

  actualizarPedido(): void {
    if (!this.pedidoEdit.pedidoId) return;
    this.pedidoService.updatePedido(this.pedidoEdit.pedidoId, this.pedidoEdit).subscribe(() => {
      this.cargarDatos();
      bootstrap.Modal.getInstance(document.getElementById('editarPedidoModal')!)?.hide();
      new bootstrap.Modal(document.getElementById('pedidoGuardadoModal')!).show();
    });
  }

  eliminarPedido(pedido: Pedido): void {
    this.pedidoParaEliminar = pedido;
    const modalEl = document.getElementById('confirmarEliminarPedidoModal');
    if (modalEl) new bootstrap.Modal(modalEl).show();
  }

  confirmarEliminarPedido(): void {
    if (!this.pedidoParaEliminar?.pedidoId) return;

    this.pedidoService.deletePedido(this.pedidoParaEliminar.pedidoId).subscribe(() => {
      this.cargarDatos();
      this.pedidoParaEliminar = null;

      const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmarEliminarPedidoModal')!);
      confirmModal?.hide();

      setTimeout(() => {
        const modal = new bootstrap.Modal(document.getElementById('pedidoEliminadoModal')!);
        modal.show();
      }, 300);
    });
  }

  filterPedidos(): void {
    const estado = this.filtroEstado;
    const texto = this.searchQuery.toLowerCase();

    this.pedidosFiltrados = this.pedidos.filter(p => {
      const coincideEstado = estado ? p.estadoPedido === estado : true;
      const cliente = this.clientes.find(c => c.cedula === p.clienteCedula);
      const coincideBusqueda =
        p.numeroPedido.toLowerCase().includes(texto) ||
        cliente?.nombre?.toLowerCase().includes(texto);

      return coincideEstado && coincideBusqueda;
    });

    this.currentPage = 1;
  }

  get paginatedPedidos(): Pedido[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.pedidosFiltrados.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.pedidosFiltrados.length / this.itemsPerPage);
  }

  cambiarPagina(page: number): void {
    this.currentPage = page;
  }

  getNombreCliente(cedula: string): string {
    const cliente = this.clientes.find(c => c.cedula === cedula);
    return cliente ? cliente.nombre : '';
  }

  getNumeroCotizacion(id: string): string {
    const cot = this.cotizaciones.find(c => c.cotizacionId == id);
    return cot ? cot.numeroCot : '';
  }

  getNumeroFactura(id: string | null): string {
    if (!id) return '';
    const factura = this.facturas.find(f => f.idFactura === id);
    return factura ? factura.numeroFactura : '';
  }

  actualizarEstadoPago(tipo: 'nuevo' | 'editar'): void {
    const facturaId = tipo === 'nuevo' ? this.nuevoPedido.facturaId : this.pedidoEdit.facturaId;
    const factura = this.facturas.find(f => f.idFactura == facturaId);
    const estado = factura?.estadoPago || 'Pendiente';

    if (tipo === 'nuevo') {
      this.nuevoPedido.estadoPago = estado;
    } else {
      this.pedidoEdit.estadoPago = estado;
    }

    this.verificarEstadoPedido(tipo);
  }

  verificarEstadoPedido(tipo: 'nuevo' | 'editar'): void {
    const pedido = tipo === 'nuevo' ? this.nuevoPedido : this.pedidoEdit;

    if (pedido.estadoEntrega === 'Entregado' && pedido.estadoPago === 'Cancelado') {
      pedido.estadoPedido = 'Cerrado';
    } else if (pedido.estadoEntrega === 'Cancelado') {
      pedido.estadoPedido = 'Cerrado';
    } else {
      pedido.estadoPedido = 'Abierto';
    }
  }

  get pedidosCerrados(): Pedido[] {
    return this.pedidos.filter(p => p.estadoPedido === 'Cerrado');
  }

  get pedidosAbiertos(): Pedido[] {
    return this.pedidos.filter(p => p.estadoPedido === 'Abierto');
  }

  filtrarPorEstado(estado: string): void {
    this.filtroEstado = estado;
    this.filterPedidos();
    this.currentPage = 1;
  }

  getMensajeEstado(p: Pedido): string {
    const entregado = p.estadoEntrega === 'Entregado';
    const cancelado = p.estadoPago === 'Cancelado';

    if (!entregado && !cancelado) {
      return 'Pedido debe ser Entregado Factura debe ser Cancelada';
    }
    if (!entregado) {
      return 'Pedido debe ser Entregado';
    }
    if (!cancelado) {
      return 'Factura debe ser Cancelada';
    }

    return '';
  }

  getIconoColor(p: Pedido): string {
    const entregado = p.estadoEntrega === 'Entregado';
    const cancelado = p.estadoPago === 'Cancelado';

    if (!entregado && !cancelado) {
      return 'text-danger';
    }
    if (!entregado || !cancelado) {
      return 'text-warning';
    }
    return 'text-secondary';
  }

  buscarCotizaciones = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? [] :
        this.cotizaciones.filter(c =>
          c.numeroCot.toLowerCase().includes(term.toLowerCase())
        ).slice(0, 10))
    );

  formatearCotizacion = (c: any) => c.numeroCot || '';

  onSeleccionCotizacion(event: any): void {
    this.cotizacionSeleccionada = event.item;
    this.nuevoPedido.cotizacionId = this.cotizacionSeleccionada.cotizacionId;

    const cliente = this.clientes.find(c => c.cedula === this.cotizacionSeleccionada.clienteCedula);
    if (cliente) {
      this.clienteSeleccionado = cliente;
      this.nuevoPedido.clienteCedula = cliente.cedula;
    }

    this.materialesCotizacion = this.cotizacionSeleccionada.materiales || [];
  }

  onCotizacionSeleccionada(tipo: 'nuevo' | 'editar'): void {
  const cotizacionId = tipo === 'nuevo' ? this.nuevoPedido.cotizacionId : this.pedidoEdit.cotizacionId;
  const cotizacion = this.cotizaciones.find(c => c.cotizacionId === cotizacionId);

  if (cotizacion) {
    if (tipo === 'nuevo') {
      this.nuevoPedido.clienteCedula = cotizacion.clienteCedula;
    } else {
      this.pedidoEdit.clienteCedula = cotizacion.clienteCedula;
    }
  }
}

  buscarClientes = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? [] :
        this.clientes.filter(c =>
          c.nombre.toLowerCase().includes(term.toLowerCase()) ||
          c.cedula.includes(term)
        ).slice(0, 10))
    );

  formatearCliente = (c: any) => c?.nombre || '';

  onSeleccionCliente(event: any): void {
    this.clienteSeleccionado = event.item;
    this.nuevoPedido.clienteCedula = this.clienteSeleccionado.cedula;
  }
}
