import { Component } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { MaterialesService } from '../../services/materiales.service';

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

  addMateriales() {
    // Agregar un nuevo material al arreglo
    this.materiales.push({ ...this.nuevoMateriales });
    this.filteredMateriales = [...this.materiales];
    this.nuevoMateriales = { codigo: '', nombre: '', costoSinIva: 0, tipo: '' };

    // Cerrar el modal de agregar material
    const nuevoMaterialesModalElement = document.getElementById('newMaterialesModal');
    if (nuevoMaterialesModalElement) {
      const modal = new bootstrap.Modal(nuevoMaterialesModalElement);
      modal.hide();
    }

    // Mostrar el modal de éxito
    const successModalElement = document.getElementById('successModal');
    if (successModalElement) {
      const successModal = new bootstrap.Modal(successModalElement);
      successModal.show(); // Mostrar el modal de éxito

      // backdrop
      setTimeout(() => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove(); // Eliminar capa oscura
        }
      }, 300); //
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
