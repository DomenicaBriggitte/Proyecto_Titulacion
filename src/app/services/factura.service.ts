import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Factura {
  clienteCedula: string; 
  fecha: string;
  estadoPago: string;
  archivoNombre: string;
  cliente?: { nombre: string }; 
}

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private apiUrl = 'https://localhost:7210/api/Facturas'; 

  constructor(private http: HttpClient) {}

  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.apiUrl);
  }

  agregarFactura(factura: Factura): Observable<Factura> {
    return this.http.post<Factura>(this.apiUrl, factura);
  }
}
