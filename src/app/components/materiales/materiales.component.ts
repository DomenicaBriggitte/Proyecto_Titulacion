import { Component } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { MaterialesService } from '../../services/materiales.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.css']
})
export class MaterialesComponent {
  materiales: any[] = [];
    
  constructor(private materialesService: MaterialesService) {
    this.materiales = this.materialesService.getMateriales();
    this.filteredMateriales = [...this.materiales];
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
    if (form.invalid || !this.isValidCurrency(String(this.nuevoMateriales.costoSinIva))) {
      return;
    }

    this.materiales.push({ ...this.nuevoMateriales });
    this.filteredMateriales = [...this.materiales];
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
    const index = this.materiales.findIndex((materiales) => materiales.codigo === this.selectedMateriales.codigo);
    if (index !== -1) {
      this.materiales[index] = { ...this.selectedMateriales };
      this.filteredMateriales = [...this.materiales];
    }

    // Cerrar el modal de editar material
    const editMaterialesModalElement = document.getElementById('editMaterialesModal');
    if (editMaterialesModalElement) {
      const modal = new bootstrap.Modal(editMaterialesModalElement);
      modal.hide();
    }

    // Mostrar el modal de éxito
    const successModalElement = document.getElementById('successModal');
    if (successModalElement) {
      const successModal = new bootstrap.Modal(successModalElement);
      successModal.show(); // Mostrar el modal de éxito
      successModal.hide();
    }

    // Asegurarse de que el backdrop se elimine al cerrar el modal
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }

    // Abrir de nuevo el modal de edición, por si el usuario necesita editar otro material
    const newEditModalElement = document.getElementById('editMaterialesModal');
    if (newEditModalElement) {
      const newEditModal = new bootstrap.Modal(newEditModalElement);
      newEditModal.show();
    }
  }

  materialParaEliminar: any = null;  // Nueva implementación: para guardar el material temporalmente

// Muestra el modal de confirmación
showDeleteConfirmationModal(material: any) {
  this.materialParaEliminar = material;
  const modalElement = document.getElementById('deleteConfirmationModal');
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

// Elimina el material después de confirmar
confirmDeleteMaterial() {
  const index = this.materiales.findIndex(m => m.codigo === this.materialParaEliminar.codigo);
  if (index !== -1) {
    this.materiales.splice(index, 1);
    this.filteredMateriales = [...this.materiales];
  }

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
}


  deleteMateriales(materiales: any) {
    const index = this.materiales.findIndex((m) => m.codigo === materiales.codigo);
    if (index !== -1) {
      this.materiales.splice(index, 1);
      this.filteredMateriales = [...this.materiales];  // Actualizar la lista filtrada para mostrar los cambios
    }

    // Mostrar el modal de éxito
    const deleteModalElement = document.getElementById('deleteModal');
    if (deleteModalElement) {
      const deleteModal = new bootstrap.Modal(deleteModalElement);
      deleteModal.show(); // Mostrar modal de éxito
      deleteModal.hide();
    }
  
    // Asegurarse de que el backdrop se elimine al cerrar el modal
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove(); // Eliminar la capa oscura
    }
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
