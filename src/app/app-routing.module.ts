import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { RegistroVolquetaComponent } from './components/volqueta/registro-volqueta/registro-volqueta.component';
import { ReporteDiarioComponent } from './components/volqueta/reporte-diario/reporte-diario.component';
import { FacturaComponent } from './components/factura/factura.component';
import { MaterialesComponent } from './components/materiales/materiales.component'; 
import { CotizacionComponent } from './components/cotizacion/cotizacion.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [  
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'cliente', component: ClienteComponent, canActivate: [AuthGuard] },
  { path: 'pedido', component: PedidoComponent, canActivate: [AuthGuard] },
  { path: 'registro-volqueta', component: RegistroVolquetaComponent, canActivate: [AuthGuard] },
  { path: 'reporte-diario', component: ReporteDiarioComponent, canActivate: [AuthGuard] },
  { path: 'factura', component: FacturaComponent, canActivate: [AuthGuard] },
  { path: 'materiales', component: MaterialesComponent, canActivate: [AuthGuard] },
  { path: 'cotizacion', component: CotizacionComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
