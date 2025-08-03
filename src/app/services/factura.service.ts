import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pago {
  idPago?: number;
  facturaId: number;
  monto: number;
  fechaPago: string;
  comprobante?: string | null;
}

export interface Factura {
  idFactura?: number;
  numeroFactura: string;
  pedidoId: number;
  fecha: string;
  clienteCedula: string;
  estadoPago: 'Pendiente' | 'Cancelado';
  archivo?: string | null;
  observaciones?: string;
  pedido?: { //detallar para obtener total
    pedidoId?: number;
    numeroPedido: string;
    fecha: string;
    cotizacionId: number;
    clienteCedula: string;
    estadoPago: 'Pendiente' | 'Cancelado';
    estadoEntrega: string;
    estadoPedido: string;
    facturaId?: number | null;
    observaciones?: string;
    cotizacion?: { //obtener el total
      cotizacionId?: number;
      numeroCot: string;
      total: number; 
    };
  };
  cliente?: { nombre: string; cedula: string };
  pagos?: Pago[]; 
}

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private apiUrl = 'https://localhost:7210/api/Facturas';
  private pagosApiUrl = 'https://localhost:7210/api/Pagos'; //endpoint para pagos

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

  // Métodos para Pagos (opdional ya se los maneja anidados en Factura.update)
  // getPagosByFacturaId(facturaId: number): Observable<Pago[]> {
  //   return this.http.get<Pago[]>(`${this.pagosApiUrl}/ByFactura/${facturaId}`);
  // }
  // addPago(pago: Pago): Observable<Pago> {
  //   return this.http.post<Pago>(this.pagosApiUrl, pago);
  // }
  // updatePago(id: number, pago: Pago): Observable<any> {
  //   return this.http.put(`${this.pagosApiUrl}/${id}`, pago);
  // }
  // deletePago(id: number): Observable<any> {
  //   return this.http.delete(`${this.pagosApiUrl}/${id}`);
  // }
}