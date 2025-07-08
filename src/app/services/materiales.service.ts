import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {
  private apiUrl = 'https://localhost:7210/api/Materiales';

  constructor(private http : HttpClient) {}


  getMateriales(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addMaterial(material: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, material);
  }

  updateMaterial(material: any): Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${material.codigo}`, material);  
  }

  deleteMaterial(codigo: string) {
    return this.http.delete<any>(`${this.apiUrl}/${codigo}`);
  }

}
