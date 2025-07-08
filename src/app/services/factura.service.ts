import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private apiUrl = 'https://localhost:7210/api/Factura';

  constructor(private http: HttpClient) {}

  getFacturas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addFactura(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  updateFactura(id: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData); // ✅ backticks
  }

  deleteFactura(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`); // ✅ backticks
  }
}
