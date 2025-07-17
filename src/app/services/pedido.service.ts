import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  cedula: string;
  nombre: string;
  tipo: string;
  telefono: string;
  correo: string;
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
  pedido?: { numeroPedido: string };
  cliente?: { nombre: string; cedula: string };
}


export interface Pedido {
  pedidoId?: number;
  numeroPedido: string;
  fecha: string;
  cotizacionId: number;
  clienteCedula: string;
  estadoEntrega: 'Pendiente' | 'Entregado' | 'Parcial' | 'En Curso' | 'Cancelado';
  estadoPago: 'Pendiente' | 'Cancelado';
  estadoPedido: 'Abierto' | 'Cerrado';
  facturaId?: number | null;
  observaciones?: string;
  subTotal?: number;
  iva?: number;
  total?: number;
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