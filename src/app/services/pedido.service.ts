import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pedido {
  pedidoId?: number;
  numeroPedido: string;
  fecha: string;
  cotizacionId: string;
  clienteCedula: string;
  estadoEntrega: 'Pendiente' | 'Entregado' | 'En Curso' | 'Cancelado';
  estadoPago: 'Pendiente' | 'Cancelado';
  estadoPedido: 'Abierto' | 'Cerrado';
  facturaId?: string | null;
  observaciones?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'https://localhost:7210/api/Pedidos';

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  getPedidoById(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`);
  }

  addPedido(pedido: Pedido): Observable<any> {
    return this.http.post(this.apiUrl, pedido);
  }

  updatePedido(id: number, pedido: Pedido): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, pedido);
  }

  deletePedido(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
