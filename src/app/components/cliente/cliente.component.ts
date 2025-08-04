import { Component } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { ClienteService, Cliente } from '../../services/cliente.service';
import { NgForm } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
 selector: 'app-cliente',
 templateUrl: './cliente.component.html',
 styleUrls: ['./cliente.component.css']
})
export class ClienteComponent {
 clientes: Cliente[] = [];
 filteredClientes: any[] = [];
 filtroTipo: string = '';
 searchQuery: string = '';
 currentPage: number = 1;
 mensajeError: string = ''; 
 errorClienteExistente: boolean = false; // Variable para activar el mensaje de error

 ngOnInit() {
  this.cargarClientes();
 }

 constructor(private clienteService: ClienteService) {}

 // Nuevo método para cargar clientes, que se puede reutilizar
 cargarClientes(): void {
  this.clienteService.getClientes().subscribe(data => {
   this.clientes = data;
   this.filteredClientes = [...this.clientes];
   this.currentPage = 1; // Esto es importante para paginar
  });
 }

 abs(value: number): number {
  return Math.abs(value);
 }
 
 nuevoCliente = { cedula: '', nombre: '', tipo: '', telefono: '', correo: '' };
 selectedCliente = { cedula: '', nombre: '', tipo: '', telefono: '', correo: '' };


 filterClientes() {
  const tipo = this.filtroTipo;
  this.filteredClientes = this.clientes.filter(cliente => {
   const coincideTipo = tipo ? cliente.tipo === tipo : true;
   const coincideBusqueda = 
   cliente.cedula.includes(this.searchQuery) || 
   cliente.nombre.toLowerCase().includes(this.searchQuery.toLowerCase());

   return coincideTipo && coincideBusqueda;
  });
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

 // Agregar nuevo cliente
// Agregar nuevo cliente
addClient(form: NgForm) {
  if (form.invalid) return;

  this.clienteService.addCliente(this.nuevoCliente).subscribe({
    next: () => {
      this.cargarClientes(); 
      this.nuevoCliente = { cedula: '', nombre: '', tipo: '', telefono: '', correo: '' };

      const nuevoClienteModalElement = document.getElementById('nuevoClienteModal');
      if (nuevoClienteModalElement) {
        const modal = bootstrap.Modal.getInstance(nuevoClienteModalElement);
        modal?.hide();

        // Cuando se cierre el modal, mostramos el de éxito
        nuevoClienteModalElement.addEventListener('hidden.bs.modal', () => {
          const successModalElement = document.getElementById('successModal');
          if (successModalElement) {
            const successModal = new bootstrap.Modal(successModalElement);
            successModal.show();

            // Cierra automáticamente después de 1.5 seg
            setTimeout(() => {
              successModal.hide();

              // 🔹 Limpiar cualquier backdrop residual
              document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            }, 1500);
          }
        }, { once: true }); // Solo ejecutar una vez
      }
    },
    error: (err) => {
      if (err.status === 409) {
        this.errorClienteExistente = true;
        this.mensajeError = err.error.message || "Este cliente ya está registrado.";
      } else {
        alert('Error al agregar cliente: ' + (err.error?.message || err.message));
      }
    }
  });
}

 // Función para editar un cliente
 editCliente(cliente: any) {
  this.selectedCliente = { ...cliente }; 
  const modalElement = document.getElementById('editClientModal');
  if (modalElement) {
   const modal = new bootstrap.Modal(modalElement);
   modal.show();
   modal.hide();
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
  
    // Cierra el modal de edición y espera a que se oculte por completo
    const editClientModalElement = document.getElementById('editClientModal');
    if (editClientModalElement) {
     const modal = bootstrap.Modal.getInstance(editClientModalElement);
     modal?.hide();

     // Después de que el modal se oculte, muestra el modal de éxito
     editClientModalElement.addEventListener('hidden.bs.modal', () => {
      const successModalElement = document.getElementById('successModal');
      if (successModalElement) {
       const successModal = new bootstrap.Modal(successModalElement);
       successModal.show();
       // Cierra el modal de éxito automáticamente después de 2 segundos
       setTimeout(() => {
        successModal.hide();
       }, 1000);
      }
     }, { once: true }); // Usar { once: true } para que el evento se elimine automáticamente
    }
   },
   error: (err) => {
    alert('Error al actualizar cliente: ' + (err.error?.message || err.message));
   }
  });
 }

 get clientesNaturales(): Cliente[] {
  return this.clientes.filter(c => c.tipo === 'Natural');
 }

 get clientesJuridicos(): Cliente[] {
  return this.clientes.filter(c => c.tipo === 'Jurídica');
 }

 filtrarPorTipo(tipo: string): void{
  this.filtroTipo = tipo;
  this.filterClientes();
  this.currentPage = 1;
 }

 clienteParaEliminar: any = null;
 deleteCliente(cliente: any) {
  this.clienteParaEliminar = cliente;
  const confirmModalElement = document.getElementById('confirmDeleteModal');
  if (confirmModalElement) {
   const confirmModal = new bootstrap.Modal(confirmModalElement);
   confirmModal.show();
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
    
    // Cierra el modal de confirmación y espera a que se oculte por completo
    const confirmModalElement = document.getElementById('confirmDeleteModal');
    if (confirmModalElement) {
     const modal = bootstrap.Modal.getInstance(confirmModalElement);
     modal?.hide();

     // Después de que el modal se oculte, muestra el modal de eliminación exitosa
     confirmModalElement.addEventListener('hidden.bs.modal', () => {
      const deleteModalElement = document.getElementById('deleteModal');
      if (deleteModalElement) {
       const deleteModal = new bootstrap.Modal(deleteModalElement);
       deleteModal.show();
       // Cierra el modal de éxito automáticamente después de 2 segundos
       setTimeout(() => {
        deleteModal.hide();
       }, 2000);
      }
     }, { once: true });
    }
    
    // Limpia la variable
    this.clienteParaEliminar = null;
    
   },
   error: (err) => {
    alert('Error al eliminar cliente: ' + (err.error?.message || err.message));
   }
  });
 }

 // Función para cerrar un modal
 closeModalAndRemoveBackdrop(modalId: string) {
  const modalElement = document.getElementById(modalId);
  if (modalElement) {
   const modal = bootstrap.Modal.getInstance(modalElement);
   modal?.hide();
  }
 }
}