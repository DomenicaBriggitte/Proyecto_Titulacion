import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

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

  //Alternar estado menú volquetas y guardar
  toggleVolquetasMenu() {
    this.isVolquetasMenuOpen = !this.isVolquetasMenuOpen;
    localStorage.setItem('volquetasMenuState', JSON.stringify(this.isVolquetasMenuOpen));
  }
    

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); // Navegar a la página de inicio
  }
}