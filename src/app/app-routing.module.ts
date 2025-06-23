import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { RegistroVolquetaComponent } from './components/volqueta/registro-volqueta/registro-volqueta.component';
import { ReporteDiarioComponent } from './components/volqueta/reporte-diario/reporte-diario.component';
import { FacturaComponent } from './components/factura/factura.component';
import { MaterialesComponent } from './components/materiales/materiales.component'; 

const routes: Routes = [  
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cliente', component: ClienteComponent },
  { path: 'pedido', component: PedidoComponent },
  { path: 'registro-volqueta', component: RegistroVolquetaComponent },
  { path: 'reporte-diario', component: ReporteDiarioComponent },
  { path: 'factura', component: FacturaComponent },
  { path: 'materiales', component: MaterialesComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
