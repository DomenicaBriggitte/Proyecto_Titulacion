import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ClienteService } from 'src/app/services/cliente.service';
import { MaterialesService } from 'src/app/services/materiales.service';
import { CotizacionService, Cotizacion } from 'src/app/services/cotizacion.service';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css']
})
export class CotizacionComponent implements OnInit {
  cotizaciones: Cotizacion[] = [];
  cotizacionesFiltradas: Cotizacion[] = [];
  cotizacionNuevo: any = this.resetearCotizacion();
  cotizacionEdit: any = this.resetearCotizacion();
  indiceEditando: number = -1;
  deleteIndex: number | null = null;
  searchQuery: string = '';
  clientes: any[] = [];
  materiales: any[] = [];
  startDateFilter: string = '';
  endDateFilter: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  validationMessage: string = '';
  todayDate: string = ''; //Propiedad para almacenar la fecha actual

  constructor(
    private clienteService: ClienteService,
    private materialesService: MaterialesService,
    private cotizacionService: CotizacionService
  ) {}

  ngOnInit(): void {
    this.todayDate = this.getLocalDateString(); //obtener fecha actual zona horaia local
    this.cotizacionService.getCotizaciones().subscribe(data => {
      this.cotizaciones = data;
      this.cotizacionesFiltradas = [...data];
    });
    this.clienteService.getClientes().subscribe(data => this.clientes = data);
    this.materialesService.getMateriales().subscribe(data => this.materiales = data);
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;

    let start = current - 1;
    let end = current + 1;

    if (start < 1) {
      start = 1;
      end = Math.min(2, total);
    } else if (end > total) {
      end = total;
      start = Math.max(1, total - 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  getLocalDateString(): string { //Obtener fecha local Ecuador
    const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  resetearCotizacion() {
    return {
      numeroCot: this.generarNumeroCotizacion(),
      cliente: null,
      fecha: this.todayDate,
      materiales: [],
      subTotal: 0,
      iva: 0,
      total: 0
    };
  }

  generarNumeroCotizacion(): string {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 900000 + 100000);
    return `COT_${anio}${mes}${dia}${random}`;
  }
    tieneMaterialesInvalidos(cot: any): boolean {
    return cot.materiales.some((m: any) => !m.material || !m.material.codigo);
  }

  getValidationMessage(): string {
    if (!this.esClienteValido(this.cotizacionNuevo.cliente)) {
      return "*Debe seleccionar un cliente válido.";
    }
    if (this.cotizacionNuevo.materiales.length === 0 || this.tieneMaterialesInvalidos(this.cotizacionNuevo)) {
      return "*Debe seleccionar al menos un material válido para cotizar.";
    }
    return ""; // No hay mensaje si todo es válido
  }

  agregarMaterial(cot: any): void {
    cot.materiales.push({ material: null, cantidad: 1, precioUnitario: 0, subtotal: 0 });
  }

  eliminarMaterial(cot: any, index: number): void {
    cot.materiales.splice(index, 1);
    this.calcularTotales(cot);
  }

  calcularTotales(cot: any): void {
    cot.materiales.forEach((m: any) => {
      m.subtotal = (m.cantidad || 0) * (m.precioUnitario || 0);
    });
    cot.subTotal = cot.materiales.reduce((sum: number, m: any) => sum + (m.subtotal || 0), 0);
    cot.iva = cot.subTotal * 0.15;
    cot.total = cot.subTotal + cot.iva;
  }

  convertirADecimal(valor: string): number {
    if (typeof valor === 'string') {
      return parseFloat(valor.replace(',', '.'));
    }
    return valor;
  }

  nombreClienteFormatter = (c: any) => c?.nombre || c;
  nombreMaterialFormatter = (m: any) => m?.nombre || m;

  searchClientes = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 1 ? [] :
        this.clientes.filter(c => c.nombre.toLowerCase().includes(term.toLowerCase())).slice(0, 10)
      )
    );

  searchMateriales = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 1 ? [] :
        this.materiales.filter(m => m.nombre.toLowerCase().includes(term.toLowerCase())).slice(0, 10)
      )
    );

  onSelectCliente(event: any, modo: 'nuevo' | 'editar') {
    if (modo === 'nuevo') this.cotizacionNuevo.cliente = event.item;
    else this.cotizacionEdit.cliente = event.item;
  }

onSelectMaterial(event: any, index: number, modo: 'nuevo' | 'editar') {
  const materialSeleccionado = event.item;
  const target = modo === 'nuevo' ? this.cotizacionNuevo : this.cotizacionEdit;

  target.materiales[index].material = materialSeleccionado;
  target.materiales[index].precioUnitario = materialSeleccionado.costoSinIva;
  target.materiales[index].subtotal = materialSeleccionado.costoSinIva * (target.materiales[index].cantidad || 1);

  this.calcularTotales(target);
}


  guardarNuevaCotizacion(): void {
    const nueva: Cotizacion = {
      numeroCot: this.cotizacionNuevo.numeroCot,
      clienteCedula: this.cotizacionNuevo.cliente.cedula,
      fecha: this.cotizacionNuevo.fecha,
      materiales: this.cotizacionNuevo.materiales.map((m: any) => ({
        materialCodigo: m.material.codigo,
        cantidad: m.cantidad,
        precioUnitario: m.precioUnitario,
        subtotal: m.subtotal
      })),
      subTotal: this.cotizacionNuevo.subTotal,
      iva: this.cotizacionNuevo.iva,
      total: this.cotizacionNuevo.total
    };

    this.cotizacionService.addCotizacion(nueva).subscribe(() => {
      this.cotizacionService.getCotizaciones().subscribe(data => {
        this.cotizaciones = data;
        this.cotizacionesFiltradas = [...data];
      });
      this.cerrarModal('nuevoCotModal');
      this.mostrarModal('successModal');
      this.cotizacionNuevo = this.resetearCotizacion();
    });
  }

abrirModalEditar(index: number): void {
  const realIndex = (this.currentPage - 1) * this.itemsPerPage + index;
  this.indiceEditando = realIndex;
  const original = this.cotizacionesFiltradas[realIndex];

  this.cotizacionEdit = {
    numeroCot: original.numeroCot,
    fecha: new Date(original.fecha).toISOString().split('T')[0],
    cliente: this.clientes.find(c => c.cedula === original.clienteCedula),
    materiales: original.materiales.map((m: any) => {
      const matEncontrado = this.materiales.find(mat => mat.codigo === m.materialCodigo);
      return {
        material: matEncontrado || null,
        cantidad: m.cantidad,
        precioUnitario: m.precioUnitario,
        subtotal: m.subtotal
      };
    }),
    subTotal: original.subTotal,
    iva: original.iva,
    total: original.total
  };

  this.mostrarModal('editarCotModal');
}

  actualizarCotizacion(): void {
  if (this.indiceEditando !== -1 && this.cotizacionEdit.cliente?.cedula) {
    const actualizada: Cotizacion = {
      numeroCot: this.cotizacionEdit.numeroCot,
      clienteCedula: this.cotizacionEdit.cliente.cedula,
      fecha: this.cotizacionEdit.fecha,
      materiales: this.cotizacionEdit.materiales.map((m: any) => ({
        materialCodigo: m.material.codigo,
        cantidad: m.cantidad,
        precioUnitario: m.precioUnitario,
        subtotal: m.subtotal
      })),
      subTotal: this.cotizacionEdit.subTotal,
      iva: this.cotizacionEdit.iva,
      total: this.cotizacionEdit.total
    };

    const id = this.cotizaciones[this.indiceEditando].cotizacionId;
    if (!id) return;

    this.cotizacionService.updateCotizacion(id, actualizada).subscribe(() => {
      this.cotizacionService.getCotizaciones().subscribe(data => {
        this.cotizaciones = data;
        this.cotizacionesFiltradas = [...data];
      });
      this.indiceEditando = -1;
      this.cerrarModal('editarCotModal');
      this.mostrarModal('successModal');
    });
  }
}

  abrirModalNuevo(): void {
    this.cotizacionNuevo = this.resetearCotizacion();
    this.agregarMaterial(this.cotizacionNuevo);
    this.mostrarModal('nuevoCotModal');
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

  obtenerNombreCliente(cedula: string): string {
    const cliente = this.clientes.find(c => c.cedula === cedula);
    return cliente ? cliente.nombre : cedula;
  }
  esClienteValido(cliente: any): boolean {
  return cliente && typeof cliente === 'object' && 'cedula' in cliente;
}

  eliminarCotizacion(index: number): void {
    this.deleteIndex = index;
    this.mostrarModal('deleteConfirmationModal');
  }

  confirmDeleteCotizacion(): void {
    if (this.deleteIndex !== null && this.deleteIndex > -1) {
      const id = this.cotizaciones[this.deleteIndex].cotizacionId!;
      this.cotizacionService.deleteCotizacion(id).subscribe(() => {
        this.cotizaciones.splice(this.deleteIndex!, 1);
        this.cotizacionesFiltradas = [...this.cotizaciones];
        this.deleteIndex = null;
        this.cerrarModal('deleteConfirmationModal');
        this.mostrarModal('deleteModal');
      });
    }
  }

  enviarPorWhatsapp(cot: Cotizacion): void {
    const doc = new jsPDF();
    const img = new Image();
    img.src = 'assets/images/Logo/empresa.png';
    doc.addImage(img, 'PNG', 10, 12, 40, 35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Patricio Rivera Rivera', 105, 20, { align: 'center' });
    doc.setFontSize(11);
    doc.text('Guayas / Guayaquil / Tarqui', 105, 26, { align: 'center' });
    doc.text('Telf. 0999606125', 105, 32, { align: 'center' });
    doc.text('correo: LILIANAZAMBRANO_7@HOTMAIL.COM', 105, 38, { align: 'center' });
    doc.line(10, 45, 200, 45);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'italic');
    doc.text('Cotización', 105, 52, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Número: ${cot.numeroCot}`, 10, 60);
    doc.text(`Fecha: ${cot.fecha}`, 10, 68);
    doc.text(`Cliente: ${this.obtenerNombreCliente(cot.clienteCedula)}`, 10, 76);
    const data = (cot.materiales || []).map((item: any) => {
      const mat = this.materiales.find(m => m.codigo === item.materialCodigo);
      return [
        item.materialCodigo,
        mat ? mat.nombre : '',
        item.cantidad,
        `$${item.precioUnitario.toFixed(2)}`,
        `$${item.subtotal.toFixed(2)}`
      ];
    });

    let finalY = 82;

    if (data.length > 0) {
      autoTable(doc, {
        startY: finalY,
        head: [['Código', 'Material', 'Cantidad', 'Precio Unitario', 'Subtotal']],
        body: data,
        headStyles: {
          fillColor: [255, 123, 0],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          3: { halign: 'right' },
          4: { halign: 'right' }
        },
        didDrawPage: (data) => {
          finalY = data.cursor?.y ?? finalY;
        }
      });
    }

    doc.text('Subtotal:', 180, finalY + 10, { align: 'right' });
    doc.text(`$${cot.subTotal.toFixed(2)}`, 200, finalY + 10, { align: 'right' });
    doc.text('IVA 15%:', 180, finalY + 20, { align: 'right' });
    doc.text(`$${cot.iva.toFixed(2)}`, 200, finalY + 20, { align: 'right' });
    doc.text('Total:', 180, finalY + 30, { align: 'right' });
    doc.text(`$${cot.total.toFixed(2)}`, 200, finalY + 30, { align: 'right' });

    const pdfBlob = doc.output('blob');
    const file = new File([pdfBlob], `Cotizacion_${cot.numeroCot}.pdf`, { type: 'application/pdf' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        title: 'Cotización',
        text: `Revisa esta cotización: ${cot.numeroCot}`,
        files: [file]
      }).catch(err => console.log('No se pudo compartir:', err));
    } else {
      const mensaje = encodeURIComponent(`Hola, te comparto la cotización número ${cot.numeroCot} con total de $${cot.total.toFixed(2)}.`);
      const url = `https://wa.me/?text=${mensaje}`;
      window.open(url, '_blank');
    }
  }

  descargarPDF(cot: Cotizacion): void {
    const doc = new jsPDF();
    const img = new Image();
    img.src = 'assets/images/Logo/empresa.png';
    doc.addImage(img, 'PNG', 10, 12, 40, 35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Patricio Rivera Rivera', 105, 20, { align: 'center' });
    doc.setFontSize(11);
    doc.text('Guayas / Guayaquil / Tarqui', 105, 26, { align: 'center' });
    doc.text('Telf. 0999606125', 105, 32, { align: 'center' });
    doc.text('correo: LILIANAZAMBRANO_7@HOTMAIL.COM', 105, 38, { align: 'center' });
    doc.line(10, 45, 200, 45);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'italic');
    doc.text('Cotización', 105, 52, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Número: ${cot.numeroCot}`, 10, 60);
    doc.text(`Fecha: ${cot.fecha}`, 10, 68);
    doc.text(`Cliente: ${this.obtenerNombreCliente(cot.clienteCedula)}`, 10, 76);
    const data = (cot.materiales || []).map((item: any) => {
    const mat = this.materiales.find(m => m.codigo === item.materialCodigo);
      return [
        item.materialCodigo,
        mat ? mat.nombre : '',
        item.cantidad,
        `$${item.precioUnitario.toFixed(2)}`,
        `$${item.subtotal.toFixed(2)}`
      ];
    });

    let finalY = 82;

    if (data.length > 0) {
      autoTable(doc, {
        startY: finalY,
        head: [['Código', 'Material', 'Cantidad', 'Precio Unitario', 'Subtotal']],
        body: data,
        headStyles: {
          fillColor: [255, 123, 0],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          3: { halign: 'right' },
          4: { halign: 'right' }
        },
        didDrawPage: (data) => {
          finalY = data.cursor?.y ?? finalY;
        }
      });
    }

    doc.text('Subtotal:', 180, finalY + 10, { align: 'right' });
    doc.text(`$${cot.subTotal.toFixed(2)}`, 200, finalY + 10, { align: 'right' });
    doc.text('IVA 15%:', 180, finalY + 20, { align: 'right' });
    doc.text(`$${cot.iva.toFixed(2)}`, 200, finalY + 20, { align: 'right' });
    doc.text('Total:', 180, finalY + 30, { align: 'right' });
    doc.text(`$${cot.total.toFixed(2)}`, 200, finalY + 30, { align: 'right' });

    doc.save(`Cotizacion_${cot.numeroCot}.pdf`);
  }

  filtrarCotizaciones(): void {
    const query = (this.searchQuery || '').toLowerCase();
    const start = this.startDateFilter ? new Date(this.startDateFilter) : null;
    const end = this.endDateFilter ? new Date(this.endDateFilter) : null;

    this.cotizacionesFiltradas = this.cotizaciones.filter(c => {
      const cliente = this.clientes.find(cl => cl.cedula === c.clienteCedula);
      const fechaCotizacion = new Date(c.fecha);

      const matchesText = (
        c.numeroCot.toLowerCase().includes(query) ||
        cliente?.nombre?.toLowerCase().includes(query)
      );

      const matchesDate = (!start || fechaCotizacion >= start) && (!end || fechaCotizacion <= end);

      return matchesText && matchesDate;
    });

    // Resetear a la primera página después de filtrar
    this.currentPage = 1;
  }

  get paginatedCotizaciones(): Cotizacion[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.cotizacionesFiltradas.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.cotizacionesFiltradas.length / this.itemsPerPage);
  }
}
