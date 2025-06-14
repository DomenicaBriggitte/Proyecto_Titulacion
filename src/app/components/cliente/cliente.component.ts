import { Component } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent {
  clientes = [
    { cedula: '0887654321', nombre: 'Cliente 1', tipo: 'Fijo', telefono: '0987654321', correo: 'cliente1@gmail.com' },
    { cedula: '1212345678', nombre: 'Cliente 2', tipo: 'Ocasional', telefono: '0912345678', correo: 'cliente2@gmail.com' },
    { cedula: '1413578642', nombre: 'Cliente 3', tipo: 'Fijo', telefono: '0913578642', correo: 'cliente3@gmail.com' },
    { cedula: '0912345678', nombre: 'Cliente 4', tipo: 'Ocasional', telefono: '0924687531', correo: 'cliente4@gmail.com' }
  ];

  selectedCliente = { cedula: '', nombre: '', tipo: '', telefono: '', correo: '' };

  editCliente(cliente: any) {
    this.selectedCliente = { ...cliente }; // Copiar la información del cliente seleccionado
    const modalElement = document.getElementById('editClientModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show(); // Abrir el modal para editar el cliente
    }
  }

  updateCliente() {
    // Aquí se guardan los cambios, se puede agregar lógica para actualizar la base de datos
    const index = this.clientes.findIndex(cliente => cliente.cedula === this.selectedCliente.cedula);
    if (index !== -1) {
      this.clientes[index] = { ...this.selectedCliente }; // Actualizar el cliente en la lista
    }

    // Cerrar el modal de editar
    const editModalElement = document.getElementById('editClientModal');
    if (editModalElement) {
      const modal = new bootstrap.Modal(editModalElement);
      modal.hide(); // Cerrar el modal de editar
    }

    // Mostrar el modal de éxito
    const successModalElement = document.getElementById('successModal');
    if (successModalElement) {
      const successModal = new bootstrap.Modal(successModalElement);
      successModal.show(); // Mostrar modal de éxito
      successModal.hide();
    }

      // Asegurarse de que el backdrop se elimine al cerrar el modal
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove(); // Eliminar la capa oscura
      }

      // Abrir de nuevo el modal de edición, por si el usuario necesita editar otro cliente
      const newEditModalElement = document.getElementById('editClientModal');
      if (newEditModalElement) {
        const newEditModal = new bootstrap.Modal(newEditModalElement);
        newEditModal.show();
      }
  }
}
