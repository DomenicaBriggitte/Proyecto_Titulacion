import { Component } from '@angular/core';
import { ClienteComponent } from '../cliente/cliente.component';  // Para obtener la lista de clientes
import { MaterialesComponent } from '../materiales/materiales.component';  // Para obtener la lista de materiales
import * as bootstrap from 'bootstrap';

// Define la interfaz para los materiales seleccionados
interface MaterialSeleccionado {
  codigo: string;
  nombre: string;
  costoSinIva: number;
  cantidad: number;
  iva: number;
  total: number;
}

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css']
})
export class CotizacionComponent {
  // Clientes y materiales
  clientes = [
    { cedula: '0993192686001', nombre: 'ABC MOTOR ABCM S.A.' },
    { cedula: '0992768193001', nombre: 'ACERCORP S. A.' }
    // Agrega la lista de clientes aquí, puede venir de un servicio
  ];

  materiales = [
    { codigo: '001', nombre: 'TRANSPORTE DE 8M', costoSinIva: 50.00 },
    { codigo: '002', nombre: 'TRANSPORTE DE 12M', costoSinIva: 50.00 }
    // Agrega la lista de materiales aquí, puede venir de un servicio
  ];

  // Variables para la cotización
  nuevaCotizacion = {
    cliente: '',
    numeroCotizacion: '',
    materialesSeleccionados: [] as MaterialSeleccionado[],  // Array de materiales seleccionados con la interfaz
    fecha: '',
    subtotal: 0,
    iva: 0,
    total: 0
  };

  cotizacionCount = 1;  // Se debe gestionar de alguna manera, podría ser un contador en el servicio

  // Método para seleccionar los materiales
  seleccionarMaterial(material: any) {
    this.nuevaCotizacion.materialesSeleccionados.push({
      codigo: material.codigo,
      nombre: material.nombre,
      costoSinIva: material.costoSinIva,
      cantidad: 1,
      iva: material.costoSinIva * 0.12,  // Ejemplo: 12% IVA
      total: material.costoSinIva * 1.12 // Precio con IVA
    });
    this.calcularTotales();
  }

  // Método para calcular los totales
  calcularTotales() {
    this.nuevaCotizacion.subtotal = this.nuevaCotizacion.materialesSeleccionados.reduce((acc, material) => acc + (material.costoSinIva * material.cantidad), 0);
    this.nuevaCotizacion.iva = this.nuevaCotizacion.subtotal * 0.12; // Ejemplo de IVA 12%
    this.nuevaCotizacion.total = this.nuevaCotizacion.subtotal + this.nuevaCotizacion.iva;
  }

  // Método para guardar la cotización
  guardarCotizacion() {
    // Aquí se guardan los datos en la base de datos o en un arreglo
    console.log(this.nuevaCotizacion); // Solo para verificar los datos
    // Agregar la cotización a la lista o base de datos

    // Cerrar el modal
    const modalElement = document.getElementById('cotizacionModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.hide();
    }

    // Mostrar el modal de éxito
    const successModalElement = document.getElementById('successModal');
    if (successModalElement) {
      const successModal = new bootstrap.Modal(successModalElement);
      successModal.show();
    }

    // Resetear formulario después de guardar
    this.nuevaCotizacion = {
      cliente: '',
      numeroCotizacion: '',
      materialesSeleccionados: [],
      fecha: '',
      subtotal: 0,
      iva: 0,
      total: 0
    };
  }
}
