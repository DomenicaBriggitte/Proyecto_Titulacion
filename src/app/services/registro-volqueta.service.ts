import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Volqueta {
  id?: number;
  placa: string;
  tipo: string;
  capacidad: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistroVolquetaService {
  private apiUrl = 'https://localhost:7210/api/RegistroVolqueta';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Volqueta[]> {
    return this.http.get<Volqueta[]>(this.apiUrl);
  }

  create(volqueta: Volqueta): Observable<void> {
    return this.http.post<void>(this.apiUrl, volqueta);
  }

  update(volqueta: Volqueta): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${volqueta.id}`, volqueta);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
