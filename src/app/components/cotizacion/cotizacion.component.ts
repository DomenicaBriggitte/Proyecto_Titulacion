import { Component } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { ClienteService } from '../../services/cliente.service';
import { MaterialesService } from 'src/app/services/materiales.service';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css']
})
export class CotizacionComponent {
  clientes: any[] = [];
  materiales: any[] = [];

  constructor(
    private clienteService: ClienteService,
    private materialesService: MaterialesService
  ) {
    this.clientes = this.clienteService.getClientes();
    this.materiales = this.materialesService.getMateriales();
  }

  // Lista de cotizaciones
  cotizaciones: any[] = [];

  // Propiedad para la búsqueda
  searchQuery: string = '';
  filteredCotizaciones: any[] = [];

  // Propiedad para una nueva cotización
  nuevoCotizacion = {
    numero: '',
    cliente: '',
    fecha: '',
    materialesSeleccionados: [] as any[],
    subTotal: 0,
    iva: 0,
    total: 0
  };

  // Filtrar las cotizaciones por número o cliente
  filterCotizaciones() {
    this.filteredCotizaciones = this.cotizaciones.filter(cotizacion =>
      cotizacion.numero.includes(this.searchQuery) ||
      cotizacion.cliente.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Método para generar un número de cotización único
  generarNumeroCotizacion(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    // Buscar el mayor correlativo existente para el año y mes actual
    let maxSecuencia = 0;
    this.cotizaciones.forEach(c => {
      if (c.numero) {
        const match = c.numero.match(/^COT_(\d{4})(\d{2})(\d{6})$/);
        if (match && match[1] === year.toString() && match[2] === month) {
          const secuencia = parseInt(match[3], 10);
          if (secuencia > maxSecuencia) {
            maxSecuencia = secuencia;
          }
        }
      }
    });
    const nuevaSecuencia = (maxSecuencia + 1).toString().padStart(6, '0');
    return `COT_${year}${month}${nuevaSecuencia}`;
  }

  // Método para agregar una cotización
  addCotizacion() {
    this.nuevoCotizacion.numero = this.generarNumeroCotizacion();
    this.cotizaciones.push({ ...this.nuevoCotizacion });
    this.filteredCotizaciones = [...this.cotizaciones];
    this.nuevoCotizacion = { numero: '', cliente: '', fecha: '', materialesSeleccionados: [], subTotal: 0, iva:0, total: 0 };

    // Cerrar el modal de nueva cotización y luego mostrar el de éxito
    const modalElement = document.getElementById('nuevoCotizacionModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modal.hide();
    // Esperar a que termine de cerrarse antes de mostrar el de éxito
    modalElement.addEventListener('hidden.bs.modal', () => {
      const successModalElement = document.getElementById('successModal');
        if (successModalElement) {
          const successModal = bootstrap.Modal.getInstance(successModalElement) || new bootstrap.Modal(successModalElement);
          successModal.show();
        }
      }, { once: true });
      
      const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove(); // Eliminar capa oscura
        }
    }
  }

  // Método para eliminar una cotización
  deleteCotizacion(cotizacion: any) {
    const index = this.cotizaciones.findIndex(c => c.numero === cotizacion.numero);
    if (index !== -1) {
      this.cotizaciones.splice(index, 1);
      this.filteredCotizaciones = [...this.cotizaciones];  // Actualizar la lista filtrada para mostrar los cambios
    }
  }

  // Método para ver una cotización
  viewCotizacion(cotizacion: any) {
    console.log(cotizacion);
    // Mostrar detalles de la cotización
  }

  // Método para editar una cotización
  editCotizacion(cotizacion: any) {
    this.nuevoCotizacion = { ...cotizacion };
    const modalElement = document.getElementById('editCotizacionModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Método para actualizar la cotización
  updateCotizacion() {
    const index = this.cotizaciones.findIndex(c => c.numero === this.nuevoCotizacion.numero);
    if (index !== -1) {
      this.cotizaciones[index] = { ...this.nuevoCotizacion };
      this.filteredCotizaciones = [...this.cotizaciones];  // Actualizar la lista filtrada para mostrar los cambios
    }
    this.nuevoCotizacion = { numero: '', cliente: '', fecha: '', materialesSeleccionados: [], subTotal: 0, iva:0, total: 0 };

    const modalElement = document.getElementById('editCotizacionModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.hide();
    }
  }

  // Método para seleccionar los materiales
  seleccionarMaterial(material: any) {
    this.nuevoCotizacion.materialesSeleccionados.push({
      ...material,
      cantidad: 1,
      iva: material.costoSinIva * 0.12,  // Ejemplo: 12% IVA
      total: material.costoSinIva * 1.12 // Precio con IVA
    });
    this.calcularTotales();
  }

  // Método para calcular los totales
  calcularTotales() {
    this.nuevoCotizacion.subTotal = this.nuevoCotizacion.materialesSeleccionados.reduce((acc, material) => acc + (material.costoSinIva * material.cantidad), 0);
    this.nuevoCotizacion.iva = this.nuevoCotizacion.subTotal * 0.12; // Ejemplo de IVA 12%
    this.nuevoCotizacion.total = this.nuevoCotizacion.subTotal + this.nuevoCotizacion.iva;
  }


  onMaterialChange(material: any, event: any): void {
  if (!this.nuevoCotizacion.materialesSeleccionados) {
    this.nuevoCotizacion.materialesSeleccionados = [];
  }
  if (event.target.checked) {
    this.nuevoCotizacion.materialesSeleccionados.push(material);
  } else {
    this.nuevoCotizacion.materialesSeleccionados = this.nuevoCotizacion.materialesSeleccionados.filter((m: any) => m.codigo !== material.codigo);
  }
  // Optionally, recalculate subTotal and total here if needed
}

}
