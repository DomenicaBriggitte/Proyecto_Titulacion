import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import * as XLSX from 'xlsx';
import { RegistroVolquetaService } from 'src/app/services/registro-volqueta.service';


interface Volqueta {
  id?: number;
  placa: string;
  tipo: string;
  capacidad: string;  
  estado: string;
}

@Component({
  selector: 'app-registro-volqueta',
  templateUrl: './registro-volqueta.component.html',
  styleUrls: ['./registro-volqueta.component.css']
})
export class RegistroVolquetaComponent implements OnInit {
  volquetas: Volqueta[] = [];
  filteredVolquetas: Volqueta[] = [];
   capacidades = ['1 m3', '2 m3', '3 m3', '4 m3', '5 m3', '6 m3', '7 m3', '8 m3', '9 m3', '10 m3'];
  searchQuery: string = '';
  mensajeError: string = '';

  nuevaVolqueta: Volqueta = { placa: '', tipo: '', capacidad: '', estado: '' };
  selectedVolqueta: Volqueta = { placa: '', tipo: '', capacidad: '', estado: '' };

  deleteVolquetaObj: Volqueta | null = null;

  constructor(private volquetaService: RegistroVolquetaService) {}

  ngOnInit(): void {
    this.getVolquetas();
  }

  getVolquetas(): void {
    this.volquetaService.getAll().subscribe(volquetas => {
      this.volquetas = volquetas;
      this.filteredVolquetas = [...this.volquetas];
    });
  }
onPlacaInput(): void {
  this.mensajeError = '';
}

agregarVolqueta(form: NgForm): void {
  if (form.invalid) return;

  const placaExistente = this.volquetas.some(
    v => v.placa.toLowerCase() === this.nuevaVolqueta.placa.toLowerCase()
  );

  if (placaExistente) {
    this.mensajeError = 'La volqueta ya está registrada con esa placa.';
    return;
  }

  // Proceder si no existe
  this.volquetaService.create(this.nuevaVolqueta).subscribe(() => {
    this.getVolquetas();
    form.resetForm();
    this.mensajeError = ''; // limpia el mensaje de error
    this.closeModal('nuevoVolquetaModal');
    this.mostrarModal('successModal');
  });
}

  editVolqueta(volqueta: Volqueta): void {
    this.selectedVolqueta = { ...volqueta };
    this.closeModal('nuevoVolquetaModal');
    this.mostrarModal('editVolquetaModal');
    
  }

  updateVolqueta(): void {
    this.volquetaService.update(this.selectedVolqueta).subscribe(() => {
      this.getVolquetas();
      this.closeModal('editVolquetaModal');
      this.mostrarModal('successModal');
    });
  }

  deleteVolqueta(volqueta: Volqueta): void {
    this.deleteVolquetaObj = volqueta;
    this.mostrarModal('deleteConfirmationModal');
  }

confirmDeleteVolqueta(): void {
  if (this.deleteVolquetaObj) {
    this.volquetaService.delete(this.deleteVolquetaObj.id!).subscribe({
      next: () => {
        this.getVolquetas();
        this.closeModal('deleteConfirmationModal');
        this.mostrarModal('deleteModal');
      },
      error: (error) => {
        this.closeModal('deleteConfirmationModal'); // Se cierra primero

        // Espera un poco antes de mostrar el modal de error para evitar conflicto de modales
        setTimeout(() => {
          const mensaje = error?.error || "No se pudo eliminar la volqueta.";
          this.mostrarAlertaModal("No se puede eliminar", mensaje);
        }, 300); // ligero retardo para garantizar el cierre anterior
      }
    });
  }
}

mostrarAlertaModal(titulo: string, mensaje: string): void {
  const modalEl = document.getElementById('alertModal');
  if (modalEl) {
    // Cambiar el contenido dinámicamente
    const titleEl = modalEl.querySelector('#alertModalTitle');
    const messageEl = modalEl.querySelector('#alertModalMessage');

    if (titleEl) titleEl.textContent = titulo;
    if (messageEl) messageEl.textContent = mensaje;

    // Mostrar el modal
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  } else {
    console.warn('No se encontró el modal de alerta en el DOM.');
  }
}




  filtrarVolquetas(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredVolquetas = this.volquetas.filter(v =>
      v.placa.toLowerCase().includes(query) || v.tipo.toLowerCase().includes(query)
    );
  }
  exportarXLS(): void {
  const worksheet = XLSX.utils.json_to_sheet(this.volquetas.map(v => ({
    Placa: v.placa,
    Tipo: v.tipo,
    Capacidad: v.capacidad,
    Estado: v.estado
  })));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Volquetas');
  XLSX.writeFile(workbook, 'volquetas.xlsx');
}
// Pagianción
pageSize = 10;              
currentPage = 1;               

get paginatedVolquetas() {
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  return this.filteredVolquetas.slice(start, end);
}

get totalPages() {
  return Math.ceil(this.filteredVolquetas.length / this.pageSize);
}

cambiarPagina(nuevaPagina: number) {
  this.currentPage = nuevaPagina;
}

cambiarPageSize(nuevoTamaño: number) {
  this.pageSize = nuevoTamaño;
  this.currentPage = 1; // reinicia a la página 1
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

mostrarModal(id: string): void {
  const modalEl = document.getElementById(id);
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}
abrirNuevoModal(): void {
  this.nuevaVolqueta = { placa: '', tipo: '', capacidad: '', estado: '' };
  this.mensajeError = '';
  this.mostrarModal('nuevoVolquetaModal');
}


closeModal(id: string): void {
  const modalEl = document.getElementById(id);
  if (modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }

  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) backdrop.remove();
}
}
