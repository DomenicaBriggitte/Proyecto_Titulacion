import { Component } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { MaterialesService } from '../../services/materiales.service';
import { NgForm } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.css']
})
export class MaterialesComponent {
  materiales: any[] = [];
   mensajeError: string = '';  
  errorMaterialExistente: boolean = false;  
    
  ngOnInit() {
    this.materialesService.getMateriales().subscribe(data => {
      this.materiales = data;
    });
  }
  constructor(private materialesService: MaterialesService) {
      this.materialesService.getMateriales().subscribe((materiales: any[]) => {
        this.materiales = materiales;
        this.filteredMateriales = [...this.materiales];
      });
    }

  nuevoMateriales = { codigo: '', nombre: '', costoSinIva: 0, tipo: '' };
  selectedMateriales = { codigo: '', nombre: '', costoSinIva: 0, tipo: '' };

  filteredMateriales = [...this.materiales];  // Inicializar la lista filtrada con todos los materiales
  searchQuery: string = '';  // Propiedad para almacenar lo que el usuario escribe en el campo de búsqueda

  filterMateriales() {
    // Filtrar los materiales por cédula o nombre
    this.filteredMateriales = this.materiales.filter(materiales => 
      materiales.codigo.includes(this.searchQuery) || 
      materiales.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      materiales.tipo.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
 //Paginación
currentPage: number = 1;
itemsPerPage: number = 10;

get paginatedMateriales(): any[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.filteredMateriales.slice(startIndex, endIndex);
}

get totalPages(): number {
  return Math.ceil(this.filteredMateriales.length / this.itemsPerPage);
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



exportarAExcel(): void {
  const worksheet = XLSX.utils.json_to_sheet(this.filteredMateriales.map(mat => ({
    Código: mat.codigo,
    Nombre: mat.nombre,
    'Costo sin IVA': mat.costoSinIva,
    Tipo: mat.tipo
  })));

  const workbook = { Sheets: { 'Materiales': worksheet }, SheetNames: ['Materiales'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  FileSaver.saveAs(data, 'materiales.xlsx');
}


    validateCodigo(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const regex = /^[0-9]$/;

    if (allowedKeys.includes(event.key)) return;
    if (!regex.test(event.key)) event.preventDefault();
  }

    validateCosto(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const regex = /^[0-9.]$/;

    if (allowedKeys.includes(event.key)) return;
    if (!regex.test(event.key)) event.preventDefault();
  }
    isValidCurrency(value: string): boolean {
    return /^\d+(\.\d{1,2})?$/.test(value);
  }

addMateriales(form: NgForm) {
  if (form.invalid) return;

  this.materialesService.addMaterial(this.nuevoMateriales).subscribe({
    next: () => {
      this.materialesService.getMateriales().subscribe((materiales: any[]) => {
        this.materiales = materiales;
        this.filteredMateriales = [...this.materiales];
      });
      this.nuevoMateriales = { codigo: '', nombre: '', costoSinIva: 0, tipo: '' };

      const modalEl = document.getElementById('nuevoMaterialesModal');
      if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();
      }

      const successModalEl = document.getElementById('successModal');
      if (successModalEl) {
        const successModal = new bootstrap.Modal(successModalEl);
        successModal.show();
        setTimeout(() => {
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove();
        }, 300);
      }
    },
    error: (err) => {
      if (err.status === 409) {
        // Si el error es un 409, significa que el material ya existe
        this.mensajeError = err.error.message || "Este material ya está registrado.";
        this.errorMaterialExistente = true;
      } else {
        alert('Error al agregar material: ' + (err.error?.message || err.message));
      }
    }
  });
}


  // Editar material
  editMateriales(materiales: any) {
    this.selectedMateriales = { ...materiales };
    const modalElement = document.getElementById('editMaterialesModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

updateMateriales() {
  this.materialesService.updateMaterial(this.selectedMateriales).subscribe({
    next: () => {
      // Actualiza la lista de materiales después de la actualización
      this.materialesService.getMateriales().subscribe((materiales: any[]) => {
        this.materiales = materiales;
        this.filteredMateriales = [...this.materiales];
      });

      // Cerrar el modal de edición
      const editMaterialesModalElement = document.getElementById('editMaterialesModal');
      if (editMaterialesModalElement) {
        const modal = bootstrap.Modal.getInstance(editMaterialesModalElement);
        modal?.hide(); // Cierra el modal
      }

      // Mostrar el modal de éxito
      const successModalElement = document.getElementById('successModal');
      if (successModalElement) {
        const successModal = new bootstrap.Modal(successModalElement);
        successModal.show(); // Muestra el modal de éxito
        successModal.hide();
      }

      // Asegurarse de que el backdrop se elimine al cerrar el modal
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    },
    error: (err) => {
      alert('Error al actualizar materiales: ' + (err.error?.message || err.message));
    }
  });
}


materialParaEliminar: any = null;  // Nueva implementación: para guardar el material temporalmente
deleteMateriales(materiales: any) {
    this.materialParaEliminar = materiales;
      const confirmModalElement = document.getElementById('deleteConfirmationModal');
      if (confirmModalElement) {
        const confirmModal = new bootstrap.Modal(confirmModalElement);
        confirmModal.show();
        confirmModal.hide();
      }
  
    // Asegurarse de que el backdrop se elimine al cerrar el modal
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove(); // Eliminar la capa oscura
    }
  }

// Elimina el material después de confirmar
confirmDeleteMaterial() {
  this.materialesService.deleteMaterial(this.materialParaEliminar.codigo).subscribe({
    next: () => {
      this.materialesService.getMateriales().subscribe((materiales: any[]) => {
        this.materiales = materiales;
        this.filteredMateriales = [...this.materiales];
      });
      this.materialParaEliminar = null;

      // Cierra el modal de confirmación
      const confirmModalElement = document.getElementById('deleteConfirmationModal');
      if (confirmModalElement) {
        const modal = bootstrap.Modal.getInstance(confirmModalElement);
        modal?.hide();
      }

      // Muestra el modal de éxito
      const deleteModalElement = document.getElementById('deleteModal');
      if (deleteModalElement) {
        const deleteModal = new bootstrap.Modal(deleteModalElement);
        deleteModal.show();
      }

      // Limpia la variable
      this.materialParaEliminar = null;
    },
    error: (err) => {
      alert('Error al eliminar material: ' + (err.error?.message || err.message));
    }
  });
}

  // Función para cerrar un modal y eliminar el backdrop
  closeModalAndRemoveBackdrop(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.hide();  // Cerrar el modal

      // Eliminar el backdrop
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();  // Eliminar la capa oscura
      }
    }
  }
}