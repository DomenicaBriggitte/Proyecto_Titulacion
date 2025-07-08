// reporte-diario.component.ts
import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ClienteService } from 'src/app/services/cliente.service';
import { RegistroVolquetaService } from 'src/app/services/registro-volqueta.service';
import { ReporteDiarioService, ReporteDiario } from 'src/app/services/reporte-diario.service';

@Component({
  selector: 'app-reporte-diario',
  templateUrl: './reporte-diario.component.html',
  styleUrls: ['./reporte-diario.component.css']
})
export class ReporteDiarioComponent implements OnInit {
  reportes: ReporteDiario[] = [];
  reportesFiltrados: ReporteDiario[] = [];
  reporteNuevo: any = this.resetearReporte();
  reporteEdit: any = this.resetearReporte();
  indiceEditando: number = -1;
  deleteIndex: number | null = null;
  searchQuery: string = '';
  clientes: any[] = [];
  volquetas: any[] = [];

  constructor(
    private clienteService: ClienteService,
    private volquetaService: RegistroVolquetaService,
    private reporteService: ReporteDiarioService
  ) {}

  ngOnInit(): void {
    this.reporteService.getReportes().subscribe((data) => {
      this.reportes = data;
      this.reportesFiltrados = [...data];
    });
    this.clienteService.getClientes().subscribe((data: any[]) => {
      this.clientes = data;
    });
    this.volquetaService.getAll().subscribe((data: any[]) => {
      this.volquetas = data;
    });
  }

  nombreFormatter = (c: any) => c?.nombre || c;
  placaFormatter = (v: any) => v?.placa || v;

  searchClientes = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 2 ? [] :
        this.clientes.filter(c => c.nombre.toLowerCase().includes(term.toLowerCase())).slice(0, 10)
      )
    );

  searchVolquetas = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 2 ? [] :
        this.volquetas.filter(v => v.placa.toLowerCase().includes(term.toLowerCase())).slice(0, 10)
      )
    );

  bloquearCaracteresInvalidos(event: KeyboardEvent): void {
    const regex = /^[A-Za-zÀ-ſ\s]+$/;
    const inputChar = event.key;
    if (!regex.test(inputChar)) {
      event.preventDefault();
    }
  }

  validarClienteSeleccionado(modo: 'nuevo' | 'editar'): void {
    const cliente = modo === 'nuevo' ? this.reporteNuevo.cliente : this.reporteEdit.cliente;
    if (typeof cliente === 'string') {
      if (modo === 'nuevo') this.reporteNuevo.cliente = null;
      else this.reporteEdit.cliente = null;
    }
  }

  validarVolquetaSeleccionada(modo: 'nuevo' | 'editar'): void {
    const volqueta = modo === 'nuevo' ? this.reporteNuevo.volqueta : this.reporteEdit.volqueta;
    if (typeof volqueta === 'string') {
      if (modo === 'nuevo') this.reporteNuevo.volqueta = null;
      else this.reporteEdit.volqueta = null;
    }
  }

  onSelectCliente(event: any, modo: 'nuevo' | 'editar') {
    if (modo === 'nuevo') this.reporteNuevo.cliente = event.item;
    else this.reporteEdit.cliente = event.item;
  }

  onSelectVolqueta(event: any, modo: 'nuevo' | 'editar') {
    if (modo === 'nuevo') this.reporteNuevo.volqueta = event.item;
    else this.reporteEdit.volqueta = event.item;
  }

  obtenerNombreCliente(cedula: string): string {
    const cliente = this.clientes.find(c => c.cedula === cedula);
    return cliente ? cliente.nombre : cedula;
  }

  obtenerPlaca(volquetaId: number): string {
    const volqueta = this.volquetas.find(v => v.id === volquetaId);
    return volqueta ? volqueta.placa : volquetaId.toString();
  }

  resetearReporte() {
    return {
      fecha: '',
      cliente: null,
      responsable: '',
      volqueta: null,
      detalles: []
    };
  }

  agregarItem(reporte: any): void {
    reporte.detalles.push({ descripcion: '', total: 0 });
  }

  eliminarItem(reporte: any, index: number): void {
    reporte.detalles.splice(index, 1);
  }

  guardarNuevoReporte(): void {
    if (!this.reporteNuevo.cliente?.cedula || !this.reporteNuevo.volqueta?.id) return;
    this.reporteNuevo.detalles.forEach((item: any) => {
      if (!item.observacion) item.observacion = '';
    });
    const nuevo: ReporteDiario = {
      fecha: this.reporteNuevo.fecha,

      clienteCedula: this.reporteNuevo.cliente.cedula,
      volquetaId: this.reporteNuevo.volqueta.id,
      responsable: this.reporteNuevo.responsable,
      detalles: this.reporteNuevo.detalles.map((item: any) => ({
        descripcion: item.descripcion,
        observacion: item.observacion,
        total: +item.total
      }))
    };
    this.reporteService.createReporte(nuevo).subscribe(() => {
      this.reporteService.getReportes().subscribe((data) => {
        this.reportes = data;
        this.reportesFiltrados = [...data];
      });
      this.cerrarModal('nuevoReporteModal');
      this.mostrarModal('successModal');
      this.reporteNuevo = this.resetearReporte();
    });
  }

  abrirModalNuevo(): void {
    this.reporteNuevo = this.resetearReporte();
    this.reporteNuevo.detalles = [{ descripcion: '', total: 0 }];
    this.mostrarModal('nuevoReporteModal');
  }

abrirModalEditar(index: number): void {
const realIndex = (this.currentPage - 1) * this.itemsPerPage + index;
  this.indiceEditando = realIndex;
  const original = this.reportesFiltrados[realIndex]; // ← usar filtrados, si aplicas búsqueda
  this.reporteEdit = {
    fecha: new Date(original.fecha).toISOString().split('T')[0],
    cliente: this.clientes.find(c => c.cedula === original.clienteCedula),
    volqueta: this.volquetas.find(v => v.id === original.volquetaId),
    responsable: original.responsable,
    detalles: JSON.parse(JSON.stringify(original.detalles))
  };

  if (!this.reporteEdit.cliente || !this.reporteEdit.volqueta) {
    console.error('Cliente o Volqueta no encontrados para el reporte.');
    return;
  }

  this.mostrarModal('editarReporteModal');
}



actualizarReporte(): void {
  if (this.indiceEditando !== -1 && this.reporteEdit.cliente?.cedula && this.reporteEdit.volqueta?.id) {
    this.reportes[this.indiceEditando] = {
      ...this.reporteEdit,
      fecha: this.reporteEdit.fecha, 
      clienteCedula: this.reporteEdit.cliente.cedula,
      volquetaId: this.reporteEdit.volqueta.id
    };

    this.filtrarReportes();
    this.indiceEditando = -1;
    this.cerrarModal('editarReporteModal');
    this.mostrarModal('successModal');
  }
}


  eliminarReporte(index: number): void {
    this.deleteIndex = index;
    this.mostrarModal('deleteConfirmationModal');
  }

  confirmDeleteReporte(): void {
    if (this.deleteIndex !== null && this.deleteIndex > -1) {
      const id = this.reportes[this.deleteIndex].reporteDiario_Id!;
      this.reporteService.deleteReporte(id).subscribe(() => {
        this.reportes.splice(this.deleteIndex!, 1);
        this.reportesFiltrados = [...this.reportes];
        this.deleteIndex = null;
        this.cerrarModal('deleteConfirmationModal');
        this.mostrarModal('deleteModal');
      });
    }
  }

  calcularTotal(detalles: any[]): number {
    return detalles.reduce((sum, item) => sum + (item.total || 0), 0);
  }

  actualizarTotal(modo: 'nuevo' | 'editar'): void {
    if (modo === 'nuevo') {
      this.reporteNuevo.detalles = [...this.reporteNuevo.detalles];
    } else {
      this.reporteEdit.detalles = [...this.reporteEdit.detalles];
    }
  }
convertirADecimal(valor: string): number {
  if (typeof valor === 'string') {
    return parseFloat(valor.replace(',', '.'));
  }
  return valor;
}

  filtrarReportes(): void {
   const query = (this.searchQuery || '').toLowerCase();
    this.reportesFiltrados = this.reportes.filter(r => {
      const cliente = this.clientes.find(c => c.cedula === r.clienteCedula);
      const volqueta = this.volquetas.find(v => v.id === r.volquetaId);
      return (
        r.clienteCedula.toLowerCase().includes(query) ||
        cliente?.nombre?.toLowerCase().includes(query) ||
        r.responsable.toLowerCase().includes(query) ||
        volqueta?.placa?.toLowerCase().includes(query)
      );
    });
  }

  currentPage: number = 1;
  itemsPerPage: number = 5;
  itemsPerPageOptions: number[] = [5, 10, 15];
  

  get paginatedReportes(): ReporteDiario[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.reportesFiltrados.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.reportesFiltrados.length / this.itemsPerPage);
  }
  

  mostrarModal(id: string): void {
    const modalEl = document.getElementById(id);
    if (modalEl) new bootstrap.Modal(modalEl).show();
  }

  cerrarModal(id: string): void {
    const modalEl = document.getElementById(id);
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
  }

  descargarPDF(reporteData: any): void {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Reporte Diario de Volqueta', 70, 15);
    doc.setFontSize(12);
    doc.text(`Fecha: ${reporteData.fecha}`, 10, 30);
    doc.text(`Cliente: ${reporteData.clienteCedula}`, 10, 40);
    doc.text(`Responsable: ${reporteData.responsable}`, 10, 50);
    doc.text(`Volqueta ID: ${reporteData.volquetaId}`, 10, 60);
    const data = (reporteData.detalles || []).map((item: any) => [
      item.descripcion,
      item.observacion || '',
      `$${item.total.toFixed(2)}`
    ]);
    let finalY = 70;
    if (data.length > 0) {
      autoTable(doc, {
        startY: finalY,
        head: [['Descripción', 'Observación', 'Total ($)']],
        body: data,
        headStyles: {
          fillColor: [255, 123, 0],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        didDrawPage: (data) => {
          finalY = data.cursor?.y ?? finalY;
        }
      });
    }
    const total = this.calcularTotal(reporteData.detalles).toFixed(2);
    doc.text(`Total Diario: $${total}`, 140, finalY + 10);
    const nombreArchivo = `Reporte_${reporteData.fecha?.replace(/-/g, '') || 'sin_fecha'}.pdf`;
    doc.save(nombreArchivo);
  }
}