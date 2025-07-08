import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { FacturaService } from 'src/app/services/factura.service';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {
  facturas: any[] = [];
  clientes: any[] = [];
  searchQuery = '';
  facturasFiltradas: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;

  nuevaFactura = {
    fecha: '',
    clienteCedula: '',
    estadoPago: 'Pendiente',
    archivo: null
  };

  facturaEdit = {
    idFactura: 0,
    fecha: '',
    clienteCedula: '',
    estadoPago: '',
    archivo: null,
    archivoUrl: '',
    archivoNombre: ''
  };

  facturaParaEliminar: any = null;

  constructor(private facturaService: FacturaService, private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.facturaService.getFacturas().subscribe(data => {
      this.facturas = data;
      this.facturasFiltradas = [...this.facturas];
    });
    this.clienteService.getClientes().subscribe(data => {
      this.clientes = data;
    });
  }

  filterFacturas() {
    const q = this.searchQuery.toLowerCase();
    this.facturasFiltradas = this.facturas.filter(f =>
      f.cliente?.nombre?.toLowerCase().includes(q) ||
      f.estadoPago.toLowerCase().includes(q)
    );
  }

  onFileSelected(event: any, tipo: 'nuevo' | 'editar') {
    const archivo = event.target.files[0];
    if (tipo === 'nuevo') {
      this.nuevaFactura.archivo = archivo;
    } else {
      this.facturaEdit.archivo = archivo;
    }
  }

  abrirModalNuevo() {
    const modal = new bootstrap.Modal(document.getElementById('nuevoFacturaModal')!);
    modal.show();
  }

  abrirModalEditar(factura: any) {
    this.facturaEdit = {
      idFactura: factura.idFactura,
      fecha: factura.fecha?.substring(0, 10),
      clienteCedula: factura.clienteCedula,
      estadoPago: factura.estadoPago,
      archivo: null,
      archivoUrl: factura.archivo,
      archivoNombre: factura.archivo ? factura.archivo.split('/').pop() : null      
    };
    this.facturaEdit.archivoUrl = factura.archivo;
    this.facturaEdit.archivoNombre = factura.archivo?.split('/').pop(); // nombre del archivo
    const modal = new bootstrap.Modal(document.getElementById('editarFacturaModal')!);
    modal.show();
  }

  abrirModalEliminar(factura: any) {
    this.facturaParaEliminar = factura;
    const modal = new bootstrap.Modal(document.getElementById('confirmarEliminacionFacturaModal')!);
    modal.show();
  }

  guardarFactura() {
    const formData = new FormData();
    formData.append('fecha', this.nuevaFactura.fecha);
    formData.append('clienteCedula', this.nuevaFactura.clienteCedula);
    formData.append('estadoPago', this.nuevaFactura.estadoPago);
    if (this.nuevaFactura.archivo) {
      formData.append('archivo', this.nuevaFactura.archivo);
    }

    this.facturaService.addFactura(formData).subscribe(() => {
      this.cargarDatos();
      this.nuevaFactura = { fecha: '', clienteCedula: '', estadoPago: 'Pendiente', archivo: null };
      bootstrap.Modal.getInstance(document.getElementById('nuevoFacturaModal')!)?.hide();
      const success = new bootstrap.Modal(document.getElementById('facturaGuardadaModal')!);
      success.show();
    });
  }

  actualizarFactura() {
    const formData = new FormData();
    formData.append('idFactura', this.facturaEdit.idFactura.toString());
    formData.append('fecha', this.facturaEdit.fecha);
    formData.append('clienteCedula', this.facturaEdit.clienteCedula);
    formData.append('estadoPago', this.facturaEdit.estadoPago);
    if (this.facturaEdit.archivo) {
      formData.append('archivo', this.facturaEdit.archivo);
    }

    this.facturaService.updateFactura(this.facturaEdit.idFactura, formData).subscribe(() => {
      this.cargarDatos();
      bootstrap.Modal.getInstance(document.getElementById('editarFacturaModal')!)?.hide();
      const success = new bootstrap.Modal(document.getElementById('facturaGuardadaModal')!);
      success.show();
    });
  }

  confirmarEliminarFactura() {
    this.facturaService.deleteFactura(this.facturaParaEliminar.idFactura).subscribe(() => {
      this.facturas = this.facturas.filter(f => f.idFactura !== this.facturaParaEliminar.idFactura);
      this.facturasFiltradas = [...this.facturas];
      bootstrap.Modal.getInstance(document.getElementById('confirmarEliminacionFacturaModal')!)?.hide();
      const modal = new bootstrap.Modal(document.getElementById('facturaEliminadaModal')!);
      modal.show();
    });
  }

  exportarAExcel() {
    alert('Funcionalidad de exportación aún no implementada. Puedes usar XLSX o ngx-export-as');
  }

  cambiarPagina(page: number) {
    this.currentPage = page;
  }
}