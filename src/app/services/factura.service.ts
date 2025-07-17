import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Factura {
  idFactura?: number;
  numeroFactura: string;
  pedidoId: number;
  fecha: string;
  clienteCedula: string;
  estadoPago: 'Pendiente' | 'Cancelado';
  archivo?: string | null;
  observaciones?: string;
  pedido?: { numeroPedido: string };
  cliente?: { nombre: string; cedula: string };
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

  getFacturaById(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.apiUrl}/${id}`);
  }

  addFactura(factura: Factura): Observable<any> {
    return this.http.post(this.apiUrl, factura);
  }

  updateFactura(id: number, factura: Factura): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, factura);
  }

  deleteFactura(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}