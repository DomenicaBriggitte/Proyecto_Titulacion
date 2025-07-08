import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'https://localhost:7210/api/Cliente';

  constructor(private http: HttpClient) {}

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addCliente(cliente: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, cliente);
  }

  updateCliente(cliente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${cliente.cedula}`, cliente);
  }

  deleteCliente(cedula: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${cedula}`);
  }

  
}
