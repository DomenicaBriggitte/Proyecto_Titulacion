import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: string = '';
  password: string = '';
  showError: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const isValid = this.authService.login(this.user, this.password);

    if (isValid) {
      const modalElement = document.getElementById('loginModal');
      if(modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }

      this.router.navigate(['/dashboard']);
    } else {
        this.showError = true;
      }
  }
}
