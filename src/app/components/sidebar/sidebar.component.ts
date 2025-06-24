import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isVolquetasMenuOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    const volquetasMenuState = localStorage.getItem('volquetasMenuState');
    if (volquetasMenuState) {
      this.isVolquetasMenuOpen = JSON.parse(volquetasMenuState);
    }
  }

  // Alternar estado del menú de volquetas y guardar en localStorage
  toggleVolquetasMenu() {
    this.isVolquetasMenuOpen = !this.isVolquetasMenuOpen;
    localStorage.setItem('volquetasMenuState', JSON.stringify(this.isVolquetasMenuOpen));
  }

  // Función para abrir el modal de confirmación de cierre de sesión
  openLogoutModal() {
  const modalElement = document.getElementById('logoutModal');

  if (modalElement) {
    const logoutModal = new bootstrap.Modal(modalElement);
    logoutModal.show();
  }
}

  // Función de cierre de sesión
  logout() {
    this.authService.logout();  
    this.router.navigate(['']);

    // Eliminar backdrop
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();  // Eliminar la capa oscura
    }
  
  }   
}


