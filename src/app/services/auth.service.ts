import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7083/api/auth'; // Ajusta tu puerto
  private isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) {}

  login(nombreUsuario: string, contraseña: string): Observable<boolean> {
    const body = { nombreUsuario, contraseña };
    return this.http.post<any>(`${this.apiUrl}/login`, body).pipe(
      tap({
        next: () => this.isAuthenticated = true,
        error: () => this.isAuthenticated = false
      }),
      // Retornamos true o false basado en si la respuesta fue exitosa
      tap(() => {}, () => false)
    );
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}
