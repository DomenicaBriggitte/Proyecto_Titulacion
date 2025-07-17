import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7210/api/auth';
  private isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) {}

  login(nombreUsuario: string, contraseña: string): Observable<boolean> {
    const body = { nombreUsuario, contraseña };
    return this.http.post<any>(`${this.apiUrl}/login`, body).pipe(
      tap({
        next: () => {
          this.isAuthenticated = true;
          localStorage.setItem('isLoggedIn', 'true');
        },
        error: () => {
          this.isAuthenticated = false;
          localStorage.removeItem('isLoggedIn');
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated || localStorage.getItem('isLoggedIn') === 'true';
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}
