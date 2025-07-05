import { Component } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { ClienteService } from '../../services/cliente.service';
import { MaterialesService } from 'src/app/services/materiales.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

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
    this.clienteService.getClientes().subscribe((clientes: any[]) => {
      this.clientes = clientes;
    });
    this.materialesService.getMateriales().subscribe((materiales: any[]) => {
      this.materiales = materiales;
  });
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

  //Obtener nombres para el listado
  nombreFormatter = (cliente: any) => cliente && cliente.nombre ? cliente.nombre : cliente;
  searchClientes = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term =>
      term.length < 2 ? []
        : this.clientes.filter(v => v.nombre.toLowerCase().includes(term.toLowerCase())).slice(0, 10)
    )
  );
  onSelectCliente(event: any) {
  this.nuevoCotizacion.cliente = event.item;
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
    this.nuevoCotizacion.materialesSeleccionados = [...this.materialesSeleccionados];
    this.cotizaciones.push({ ...this.nuevoCotizacion });
    this.filteredCotizaciones = [...this.cotizaciones];

    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    const fechaActual = `${yyyy}-${mm}-${dd}`;
    this.nuevoCotizacion = { numero: this.generarNumeroCotizacion(), cliente: '', fecha: fechaActual, materialesSeleccionados: [], subTotal: 0, iva:0, total: 0 };
    this.materialesSeleccionados = [
      { nombre: '', codigo: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }
    ];


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
    //recalcula numero de cotización -1
    this.nuevoCotizacion = {
      numero: this.generarNumeroCotizacion(),
      cliente: '',
      fecha: '',
      materialesSeleccionados: [],
      subTotal: 0,
      iva: 0,
      total: 0
    };
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
      iva: material.costoSinIva * 0.15,  // Ejemplo: 12% IVA
      total: material.costoSinIva * 1.15 // Precio con IVA
    });
    this.calcularTotales();
  }

  // Método para calcular los totales
  calcularTotales() {
    const subtotal = this.materialesSeleccionados.reduce((sum, mat) => sum + (mat.subtotal || 0), 0);
    this.nuevoCotizacion.subTotal = subtotal;
    this.nuevoCotizacion.iva = +(subtotal * 0.12).toFixed(2);
    this.nuevoCotizacion.total = +(subtotal + this.nuevoCotizacion.iva).toFixed(2);
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
}

  //Sección para Métodos de la Tabla de Cotización de Materiales
    // Estructura de un material seleccionado
    materialesSeleccionados = [
      { nombre: '', codigo: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }
    ];

    // Método para buscar materiales (ng-bootstrap typeahead)
    searchMateriales = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map(term => term.length < 2 ? []
          : this.materiales.filter(m => m.nombre.toLowerCase().includes(term.toLowerCase())).slice(0, 10))
      );

    // Formatea el nombre del material en el autocomplete
    materialNombreFormatter = (x: any) => x && x.nombre ? x.nombre : x;

    // Cuando seleccionas un material del autocomplete
    onSelectMaterial(event: any, idx: number) {
      const mat = event.item;
      this.materialesSeleccionados[idx].nombre = mat.nombre;
      this.materialesSeleccionados[idx].codigo = mat.codigo;
      this.materialesSeleccionados[idx].precioUnitario = mat.costoSinIva;
      this.updateSubtotal(idx);
    }

    // Actualiza el subtotal al cambiar cantidad o material
    updateSubtotal(idx: number) {
      const item = this.materialesSeleccionados[idx];
      const cantidad = Number(item.cantidad) > 0 ? Number(item.cantidad) : 1;
      item.subtotal = cantidad * (item.precioUnitario || 0);
      this.calcularTotales();
    }

    // Añadir una fila nueva
    addFilaMaterial() {
      this.materialesSeleccionados.push({ nombre: '', codigo: '', cantidad: 1, precioUnitario: 0, subtotal: 0 });
    }

    // Eliminar una fila de la tabla de materiales
    removeMaterial(idx: number) {
      this.materialesSeleccionados.splice(idx, 1);
      this.calcularTotales();
    }

    recargarMateriales() {
      this.materialesService.getMateriales().subscribe((materiales: any[]) => {
        this.materiales = materiales;
      });
    }

}
