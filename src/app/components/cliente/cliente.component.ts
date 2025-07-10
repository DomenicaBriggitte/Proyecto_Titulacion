import { Component } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { ClienteService } from '../../services/cliente.service';
import { NgForm } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent {
clientes: any[] = [];
filteredClientes: any[] = [];
searchQuery: string = '';
currentPage: number = 1;

ngOnInit() {
  this.clienteService.getClientes().subscribe(data => {
    this.clientes = data;
    this.filteredClientes = [...this.clientes]; 
    this.currentPage = 1// Esto es importante para paginar
  });
}

constructor(private clienteService: ClienteService) {}

  abs(value: number): number {
  return Math.abs(value);
}
  

  nuevoCliente = { cedula: '', nombre: '', tipo: '', telefono: '', correo: '' };
  selectedCliente = { cedula: '', nombre: '', tipo: '', telefono: '', correo: '' };


filterClientes() {
  this.filteredClientes = this.clientes.filter(cliente => 
    cliente.cedula.includes(this.searchQuery) || 
    cliente.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
  );
  this.currentPage = 1; // importante para evitar mostrar más registros de los que debe
}


  // Paginación
itemsPerPage: number = 10;

get totalPages(): number {
  return Math.ceil(this.filteredClientes.length / this.itemsPerPage);
}

get paginatedClientes(): any[] {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.filteredClientes.slice(start, end);
}




// Para mostrar solo 3 botones de página
get paginationRange(): number[] {
  const total = this.totalPages;
  let start = Math.max(1, this.currentPage - 1);
  let end = Math.min(total, start + 1); 

  if (end - start < 1) {
    start = Math.max(1, end - 1);
  }

  const range: number[] = [];
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
}

// Función para cambiar de página
onItemsPerPageChange(): void {
  this.currentPage = 1;
}

exportarExcel() {
  const worksheet = XLSX.utils.json_to_sheet(this.filteredClientes);
  const workbook = {
    Sheets: { 'Clientes': worksheet },
    SheetNames: ['Clientes']
  };
  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  FileSaver.saveAs(blob, 'Clientes.xlsx');
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
  if (form.invalid) return;
  this.clienteService.addCliente(this.nuevoCliente).subscribe({
    next: () => {
      // Vuelve a cargar la lista desde la API
      this.clienteService.getClientes().subscribe((clientes: any[]) => {
        this.clientes = clientes;
        this.filteredClientes = [...this.clientes];
        this.currentPage = 1
      });
      this.nuevoCliente = { cedula: '', nombre: '', tipo: '', telefono: '', correo: '' };
      
      // Cierra el modal y muestra éxito
      const nuevoClienteModalElement = document.getElementById('nuevoClienteModal');
      if (nuevoClienteModalElement) {
        const modal = bootstrap.Modal.getInstance(nuevoClienteModalElement) || new bootstrap.Modal(nuevoClienteModalElement);
        modal.hide();
      }
      const successModalElement = document.getElementById('successModal');
      if (successModalElement) {
        const successModal = new bootstrap.Modal(successModalElement);
        successModal.show();
        setTimeout(() => {
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove();
        }, 300);
      }
    },
    error: (err) => {
      alert('Error al agregar cliente: ' + (err.error?.message || err.message));
    }
  });
}
  

// Función para editar un cliente
editCliente(cliente: any) {
  // Copiar los datos del cliente seleccionado en selectedCliente
  this.selectedCliente = { ...cliente }; 
  // Abrir el modal de edición
  const modalElement = document.getElementById('editClientModal');
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show(); // Mostrar el modal
  }
}


// Actualizar cliente
updateCliente() {
  this.clienteService.updateCliente(this.selectedCliente).subscribe({
    next: () => {
      const index = this.clientes.findIndex(c => c.cedula === this.selectedCliente.cedula);
      if (index !== -1) {
        this.clientes[index] = { ...this.selectedCliente };
        this.filteredClientes = [...this.clientes];
        this.currentPage = 1
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
  },
    error: (err) => {
      alert('Error al actualizar cliente: ' + (err.error?.message || err.message));
    }
  });
}

clienteParaEliminar: any = null;
deleteCliente(cliente: any) {
  this.clienteParaEliminar = cliente;
  const confirmModalElement = document.getElementById('confirmDeleteModal');
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

// Eliminar cliente
confirmDelete() {
  this.clienteService.deleteCliente(this.clienteParaEliminar.cedula).subscribe({
    next: () => {
      const index = this.clientes.findIndex(c => c.cedula === this.clienteParaEliminar.cedula);
      if (index !== -1) {
        this.clientes.splice(index, 1);
        this.filteredClientes = [...this.clientes];
        this.currentPage = 1
      }
      this.clienteParaEliminar = null;
      // Cierra el modal de confirmación
        const confirmModalElement = document.getElementById('confirmDeleteModal');
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
        this.clienteParaEliminar = null;
        
    },
    error: (err) => {
      alert('Error al eliminar cliente: ' + (err.error?.message || err.message));
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