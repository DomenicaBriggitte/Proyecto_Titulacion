import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'quienes-somos', component: InicioComponent },  // Asegúrate de tener el componente para esta ruta
  { path: 'nuestros-servicios', component: InicioComponent },  // Asegúrate de tener el componente para esta ruta
  { path: 'contactenos', component: InicioComponent },  // Asegúrate de tener el componente para esta ruta
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
