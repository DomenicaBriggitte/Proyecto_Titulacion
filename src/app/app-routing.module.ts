import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { RegistroVolquetaComponent } from './components/volqueta/registro-volqueta/registro-volqueta.component';
import { ReporteDiarioComponent } from './components/volqueta/reporte-diario/reporte-diario.component';
import { FacturaComponent } from './components/factura/factura.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cliente', component: ClienteComponent },
  { path: 'quienes-somos', component: InicioComponent },  // Asegúrate de tener el componente para esta ruta
  { path: 'nuestros-servicios', component: InicioComponent },  // Asegúrate de tener el componente para esta ruta
  { path: 'contactenos', component: InicioComponent },  // Asegúrate de tener el componente para esta ruta
  { path: 'pedido', component: PedidoComponent },
  { path: 'registro-volqueta', component: RegistroVolquetaComponent },
  { path: 'reporte-diario', component: ReporteDiarioComponent },
  { path: 'factura', component: FacturaComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
