import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { FacturaComponent } from './components/factura/factura.component';
import { VolquetaComponent } from './components/volqueta/volqueta.component';
import { RegistroVolquetaComponent } from './components/volqueta/registro-volqueta/registro-volqueta.component';
import { ReporteDiarioComponent } from './components/volqueta/reporte-diario/reporte-diario.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialesComponent } from './components/materiales/materiales.component';
import { CotizacionComponent } from './components/cotizacion/cotizacion.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';  
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    ClienteComponent,
    PedidoComponent,
    FacturaComponent,
    VolquetaComponent,
    RegistroVolquetaComponent,
    ReporteDiarioComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    MaterialesComponent,
    CotizacionComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    FormsModule,
    NgxPaginationModule,
    HttpClientModule,
    NgbTypeaheadModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }