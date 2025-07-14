import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

  // Obtener todas las volquetas
  getAll(): Observable<Volqueta[]> {
    return this.http.get<Volqueta[]>(this.apiUrl).pipe(
      catchError(this.handleError)  // Manejo de errores en caso de falla en la petición
    );
  }

  // Crear una volqueta
  create(volqueta: Volqueta): Observable<void> {
    return this.http.post<void>(this.apiUrl, volqueta).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar una volqueta
  update(volqueta: Volqueta): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${volqueta.id}`, volqueta).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar una volqueta
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Método para manejar errores (actualizado para usar la función de fábrica de throwError)
  private handleError(error: any) {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Algo salió mal; por favor intente de nuevo más tarde.'));
  }
}
