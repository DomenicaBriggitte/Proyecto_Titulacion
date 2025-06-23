import { Component } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.css']
})
export class MaterialesComponent {
  materiales = [
    { codigo: '001', nombre: 'TRANSPORTE DE 8M', costoSinIva: 50.00, tipo: 'Transporte' },
    { codigo: '002', nombre: 'TRANSPORTE DE 12M', costoSinIva: 50.00, tipo: 'Transporte' },
    { codigo: '003', nombre: 'TRANSPORTE DE ARENA DE 12M', costoSinIva: 130.00, tipo: 'Transporte' },
    { codigo: '004', nombre: 'TRANSPORTE DE RIPIO DE 12M', costoSinIva: 140.00, tipo: 'Transporte' },
    { codigo: '005', nombre: 'TRANSPORTE DE RIPIO DE 8M', costoSinIva: 105.00, tipo: 'Transporte' },
    { codigo: '006', nombre: 'TRANSPORTE DE ARENA DE 8M', costoSinIva: 95.00, tipo: 'Transporte' },
    { codigo: '007', nombre: 'TRANSPORTE DE 4M', costoSinIva: 30.00, tipo: 'Transporte' },
    { codigo: '008', nombre: 'TRANSPORTE DE CASCAJO DE 12M', costoSinIva: 80.00, tipo: 'Transporte' },
    { codigo: '009', nombre: 'TRANSPORTE DE PIEDRA BASE DE 8M', costoSinIva: 105.00, tipo: 'Transporte' },
    { codigo: '010', nombre: 'TRANSPORTE DE PIEDRA 3/4 de 8M', costoSinIva: 160.00, tipo: 'Transporte' },
    { codigo: '011', nombre: 'TRANSPORTE DE PIEDRA 3/4 DE 12M', costoSinIva: 215.00, tipo: 'Transporte' },
    { codigo: '012', nombre: 'TRANSPORTE DE CISCO 8M', costoSinIva: 140.00, tipo: 'Transporte' },
    { codigo: '013', nombre: 'TRANSPORTE DE PIEDRA CHISPA DE 12 METROS', costoSinIva: 226.00, tipo: 'Transporte' },
    { codigo: '1', nombre: 'ARENA HOMOGUENIZADA DE 8M', costoSinIva: 123.81, tipo: 'Arena' },
    { codigo: '1001', nombre: 'ARENA 8M', costoSinIva: 61.90, tipo: 'Arena' },
    { codigo: '1002', nombre: 'ARENA DE 12M', costoSinIva: 80.00, tipo: 'Arena' },
    { codigo: '1003', nombre: 'ARENA DE 4M', costoSinIva: 33.33, tipo: 'Arena' },
    { codigo: '1004', nombre: 'ARENA GRUESA DE 8M', costoSinIva: 80.95, tipo: 'Arena' },
    { codigo: '1005', nombre: 'ARENA HOMOGENIZADA 12m', costoSinIva: 125.00, tipo: 'Arena' },
    { codigo: '1006', nombre: 'ARENA 10M', costoSinIva: 125.00, tipo: 'Arena' },
    { codigo: '1007', nombre: 'Arena 6M', costoSinIva: 47.62, tipo: 'Arena' },
    { codigo: '1008', nombre: 'Arena gruesa 4M', costoSinIva: 42.86, tipo: 'Arena' },
    { codigo: '2001', nombre: 'RIPIO DE 8m', costoSinIva: 80.95, tipo: 'Ripio' },
    { codigo: '2002', nombre: 'RIPIO DE 12M', costoSinIva: 90.48, tipo: 'Ripio' },
    { codigo: '2003', nombre: 'RIPIO DE 4M', costoSinIva: 42.86, tipo: 'Ripio' },
    { codigo: '3001', nombre: 'CASCAJO DE 12M', costoSinIva: 76.19, tipo: 'Cascajo' },
    { codigo: '3002', nombre: 'CASCAJO DE 8M', costoSinIva: 57.14, tipo: 'Cascajo' },
    { codigo: '4001', nombre: 'PIEDRA 3/4 8m', costoSinIva: 100.00, tipo: 'Piedra 3/4' },
    { codigo: '4002', nombre: 'PIEDRA 3/4 12M', costoSinIva: 160.00, tipo: 'Piedra 3/4' },
    { codigo: '4003', nombre: 'CALIZA PIEDRA #4', costoSinIva: 80.35, tipo: 'Piedra 3/4' },
    { codigo: '4004', nombre: 'PIEDRA 3/4', costoSinIva: 100.00, tipo: 'Piedra 3/4' },
    { codigo: '4005', nombre: 'PIEDRA 3/4 de 6M', costoSinIva: 85.71, tipo: 'Piedra 3/4' },
    { codigo: '4006', nombre: 'PIEDRA 3/4 DE 4M', costoSinIva: 49.11, tipo: 'Piedra 3/4' },
    { codigo: '4009', nombre: 'PIEDRA 3/4 10M', costoSinIva: 178.57, tipo: 'Piedra 3/4' },
    { codigo: '4010', nombre: 'PIEDRA 3/8 8METROS', costoSinIva: 142.86, tipo: 'Piedra 3/4' },
    { codigo: '5001', nombre: 'PIEDRA CHISPA DE 8M', costoSinIva: 142.86, tipo: 'Piedra Chispa' },
    { codigo: '5002', nombre: 'CALIZA PIEDRA #67 (5 - 19 MM) GYE', costoSinIva: 110.00, tipo: 'Piedra Chispa' },
    { codigo: '5003', nombre: 'PIEDRA CHISPA DE 12M', costoSinIva: 171.43, tipo: 'Piedra Chispa' },
    { codigo: '5004', nombre: 'PIEDRA 3/8', costoSinIva: 100.00, tipo: 'Piedra Chispa' },
    { codigo: '5005', nombre: 'PIEDRA CHISPA de 4m', costoSinIva: 85.71, tipo: 'Piedra Chispa' },
    { codigo: '6001', nombre: 'CISCO DE 8M', costoSinIva: 80.36, tipo: 'Cisco' },
    { codigo: '6002', nombre: 'CISCO', costoSinIva: 44.64, tipo: 'Cisco' },
    { codigo: '6003', nombre: 'CISCO DE 4M', costoSinIva: 44.64, tipo: 'Cisco' },
    { codigo: '8001', nombre: 'PIEDRA BASE DE 8M', costoSinIva: 62.50, tipo: 'Piedra Base' },
    { codigo: '8002', nombre: 'PIEDRA BASE DE 12M', costoSinIva: 150.00, tipo: 'Piedra Base' },
    { codigo: '8003', nombre: 'PIEDRA BASE 4M', costoSinIva: 66.66, tipo: 'Piedra Base' },
    { codigo: '9001', nombre: 'Lavada de carro pequeño', costoSinIva: 15.18, tipo: 'Lavado de Carro' },
    { codigo: '1001', nombre: 'RUL.RUED.DEL.EXT.1924/OF1730/MAS', costoSinIva: 26.79, tipo: 'Respuesto para Volqueta' },
    { codigo: '1002', nombre: 'MANTENIMIENTO VEHICULOS', costoSinIva: 0.00, tipo: 'Respuesto para Volqueta' },
    { codigo: '1003', nombre: 'PLANCH.COMPR.90 FE.WF.C/LAIN.OM355.5/6', costoSinIva: 46.43, tipo: 'Respuesto para Volqueta' },
    { codigo: '1004', nombre: 'TUER.PUNT.FRONT.1', costoSinIva: 13.39, tipo: 'Respuesto para Volqueta' },
    { codigo: '10005', nombre: 'RUL.RUED.DEL.INT/CONO AL PIÑ. Ø300', costoSinIva: 60.71, tipo: 'Respuesto para Volqueta' },
    { codigo: '11001', nombre: 'GASOLINA', costoSinIva: 0.00, tipo: 'Combustible' },
    { codigo: '12001', nombre: 'ARCILLA DE 4m', costoSinIva: 31.25, tipo: 'Arcilla' },
    { codigo: '12002', nombre: 'ARCILLA DE 8 METROS', costoSinIva: 50.00, tipo: 'Arcilla' },
    { codigo: '13001', nombre: 'SUB BASE DE 8 METROS', costoSinIva: 100.00, tipo: 'Sub Base' }
  ];


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
