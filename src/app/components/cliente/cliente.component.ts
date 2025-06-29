import { Component } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { ClienteService } from '../../services/cliente.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent {
  clientes: any[] = [];
  
  constructor(private clienteService: ClienteService) {
    this.clientes = this.clienteService.getClientes();
    this.filteredClientes = [...this.clientes];
  }

  nuevoCliente = { cedula: '', nombre: '', tipo: '', telefono: '', correo: '' };
  selectedCliente = { cedula: '', nombre: '', tipo: '', telefono: '', correo: '' };

  filteredClientes = [...this.clientes];  // Inicializar la lista filtrada con todos los clientes
  searchQuery: string = '';  // Propiedad para almacenar lo que el usuario escribe en el campo de búsqueda

  filterClientes() {
    // Filtrar los clientes por cédula o nombre
    this.filteredClientes = this.clientes.filter(cliente => 
      cliente.cedula.includes(this.searchQuery) || 
      cliente.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  // Validación de la cédula para asegurarse de que solo contiene números
  validateCedula(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const regex = /^[0-9]*$/; // Solo números

    // Permitir teclas de control como Backspace, Tab, y las flechas
    if (allowedKeys.indexOf(event.key) !== -1) {
      return; // Permite teclas de control
    }

    // Si la tecla presionada no es un número, evitar que el valor se agregue
    if (!regex.test(event.key)) {
      event.preventDefault(); // Bloquear la tecla no permitida
    }
  }


    // Validación del nombre para asegurarse de que solo contenga letras y puntos
    validateName(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]*$/; // Solo letras, espacios y puntos

    // Permitir teclas de control como Backspace, Tab, y las flechas
    if (allowedKeys.indexOf(event.key) !== -1) {
      return; // Permite teclas de control
    }

    // Si la tecla presionada no es un carácter permitido, evitar que el valor se agregue
    if (!regex.test(event.key)) {
      event.preventDefault(); // Bloquear la tecla no permitida
    }
  }

  //Validación teléfono
  validatePhone(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const regex = /^[0-9]*$/; // Solo números

    // Permitir teclas de control como Backspace, Tab, y las flechas
    if (allowedKeys.indexOf(event.key) !== -1) {
      return; // Permite teclas de control
    }
    if (!regex.test(event.key)) {
      event.preventDefault(); // Bloquear la tecla no permitida
    }
  }

  
validateEmail(event: KeyboardEvent) {
  const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
  const regex = /^[a-zA-Z0-9._%+-@.]*$/; // Solo caracteres válidos

  // Bloquear espacio
  if (event.key === ' ') {
    event.preventDefault();
    return;
  }

  if (allowedKeys.includes(event.key)) {
    return; // Permitir teclas de control
  }

  if (!regex.test(event.key)) {
    event.preventDefault(); // Bloquear teclas inválidas
  }
}

errorClienteExistente: boolean = false;
  // Agregar nuevo cliente
  addClient(form: NgForm) {

      if (form.invalid) {
    return; // Detiene la ejecución si el formulario no es válido
  }
    this.clientes.push({ ...this.nuevoCliente });
    this.filteredClientes = [...this.clientes];
    this.nuevoCliente = { cedula: '', nombre: '', tipo: '', telefono: '', correo: '' };

    // Cerrar el modal de agregar cliente
    const nuevoClienteModalElement = document.getElementById('newClientModal');
    if (nuevoClienteModalElement) {
      const modal = new bootstrap.Modal(nuevoClienteModalElement);
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
      this.filteredClientes = [...this.clientes];  // Actualizar la lista filtrada para mostrar los cambios
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
      backdrop.remove();
    }

    // Abrir de nuevo el modal de edición, por si el usuario necesita editar otro cliente
    const newEditModalElement = document.getElementById('editClientModal');
    if (newEditModalElement) {
      const newEditModal = new bootstrap.Modal(newEditModalElement);
      newEditModal.show();
    }
  }
  clienteParaEliminar: any = null;
deleteCliente(cliente: any) {
  this.clienteParaEliminar = cliente;
  const confirmModalElement = document.getElementById('confirmDeleteModal');
  if (confirmModalElement) {
    const confirmModal = new bootstrap.Modal(confirmModalElement);
    confirmModal.show();
  }
      // Asegurarse de que el backdrop se elimine al cerrar el modal
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove(); // Eliminar la capa oscura
    }
}
confirmDelete() {
  const index = this.clientes.findIndex(c => c.cedula === this.clienteParaEliminar.cedula);
  if (index !== -1) {
    this.clientes.splice(index, 1);
    this.filteredClientes = [...this.clientes];
  }

  this.clienteParaEliminar = null;

  // Cierra el modal de confirmación
  const confirmModalElement = document.getElementById('confirmDeleteModal');
  if (confirmModalElement) {
    const confirmModal = bootstrap.Modal.getInstance(confirmModalElement);
    confirmModal?.hide();
  }

  // Muestra el modal de éxito
  const deleteModalElement = document.getElementById('deleteModal');
  if (deleteModalElement) {
    const deleteModal = new bootstrap.Modal(deleteModalElement);
    deleteModal.show();
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
