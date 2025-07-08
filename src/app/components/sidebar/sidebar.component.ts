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
  isSidebarVisible: boolean = true;

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
  isVolquetasMenuOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    // Recuperar el estado del menú de volquetas de localStorage
    const volquetasMenuState = localStorage.getItem('volquetasMenuState');
    if (volquetasMenuState) {
      this.isVolquetasMenuOpen = JSON.parse(volquetasMenuState);
    }
  }

  // Alternar el estado del menú de volquetas y guardarlo en localStorage
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
    this.authService.logout();  // Cerrar sesión utilizando el servicio de autenticación
    this.router.navigate(['/']); // Redirigir al usuario a la página principal

    // Cerrar el modal de confirmación de cierre de sesión
    const deleteModalElement = document.getElementById('logoutModal');
    if (deleteModalElement) {
      const logoutModal = new bootstrap.Modal(deleteModalElement);
      logoutModal.hide();  // Cerrar el modal
    }

    // Eliminar la capa oscura (backdrop)
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove(); // Eliminar capa oscura
    }
  }
}
