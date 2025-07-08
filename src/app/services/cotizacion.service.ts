
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CotizacionMaterial {
  materialCodigo: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Cotizacion {
  cotizacionId?: number;
  numeroCot: string;
  clienteCedula: string;
  fecha: string;
  materiales: CotizacionMaterial[];
  subTotal: number;
  iva: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {
  private apiUrl = 'https://localhost:7210/api/Cotizacion';

  constructor(private http: HttpClient) {}

  getCotizaciones(): Observable<Cotizacion[]> {
    return this.http.get<Cotizacion[]>(this.apiUrl);
  }

  addCotizacion(cotizacion: Cotizacion): Observable<any> {
    return this.http.post(this.apiUrl, cotizacion);
  }

  updateCotizacion(id: number, cotizacion: Cotizacion): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cotizacion);
  }

  deleteCotizacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
