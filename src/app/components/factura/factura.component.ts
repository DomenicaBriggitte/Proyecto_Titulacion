// factura.component.ts
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FacturaService, Factura } from 'src/app/services/factura.service';
import { ClienteService } from '../../services/cliente.service';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {
  facturas: Factura[] = [];
  filteredFacturas: Factura[] = [];
  clientes: any[] = [];
  searchQuery: string = '';
  clienteInput = '';


  nuevaFactura: Factura = {
    clienteCedula: '',
    fecha: '',
    estadoPago: '',
    archivoNombre: ''
  };
    constructor(
    private facturaService: FacturaService,
    private clienteService: ClienteService 
  ) {}
  cargarClientes(): void {
    this.clienteService.getClientes().subscribe(data => {
      this.clientes = data;
    });
  }

  ngOnInit(): void {
    this.obtenerFacturas();
    this.cargarClientes(); 
  }

  obtenerFacturas(): void {
    this.facturaService.getFacturas().subscribe(data => {
      this.facturas = data;
      this.filteredFacturas = [...data];
    });
  }

  filterFacturas(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredFacturas = this.facturas.filter(f =>
      f.clienteCedula.toLowerCase().includes(query)
    );
  }

  subirArchivo(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.nuevaFactura.archivoNombre = file.name;
    }
  }

guardarFactura(form: NgForm): void {
  if (form.invalid) return;

const facturaParaEnviar = {
  clienteCedula: this.nuevaFactura.clienteCedula,
  fecha: new Date(this.nuevaFactura.fecha).toISOString(),
  estadoPago: this.nuevaFactura.estadoPago,
  archivoNombre: this.nuevaFactura.archivoNombre
};
console.log('Factura enviada al backend', facturaParaEnviar);

  this.facturaService.agregarFactura(facturaParaEnviar).subscribe(() => {
  this.obtenerFacturas();
  this.nuevaFactura = {
    clienteCedula: '',
    fecha: '',
    estadoPago: '',
    archivoNombre: ''
};

    const modalElement = document.getElementById('nuevoFacturaModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }

    const successModal = new bootstrap.Modal(document.getElementById('successModal')!);
    successModal.show();
  });
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
  this.nuevaFactura.cliente = event.item;
  this.nuevaFactura.clienteCedula = event.item.cedula; 
}
  seleccionarCliente(event: any): void {
    this.nuevaFactura.clienteCedula = event.item.cedula;
  }

  exportarPDF(): void {
    console.table(this.facturas.map(f => ({ Fecha: f.fecha, Cedula: f.clienteCedula, Estado: f.estadoPago })));
    alert('Funcionalidad de exportar PDF en desarrollo.');
  }
}
