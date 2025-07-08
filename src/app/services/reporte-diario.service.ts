import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReporteDiario {
  reporteDiario_Id?: number; // opcional para editar
  fecha: Date;
  clienteCedula: string;
  volquetaId: number;
  responsable: string;
  detalles: DetalleReporte[];
}

export interface DetalleReporte {
  descripcion: string;
  observacion: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReporteDiarioService {
  private apiUrl = 'https://localhost:7210/api/ReporteDiario';

  constructor(private http: HttpClient) {}

  getReportes(): Observable<ReporteDiario[]> {
    return this.http.get<ReporteDiario[]>(this.apiUrl);
  }

  createReporte(reporte: ReporteDiario): Observable<any> {
    return this.http.post(this.apiUrl, reporte);
  }

  updateReporte(id: number, reporte: ReporteDiario): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, reporte);
  }

  deleteReporte(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
