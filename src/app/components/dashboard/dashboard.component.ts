// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { CotizacionService } from 'src/app/services/cotizacion.service';
import { ReporteDiarioService } from 'src/app/services/reporte-diario.service';
import { MaterialesService } from 'src/app/services/materiales.service';
import { RegistroVolquetaService } from 'src/app/services/registro-volqueta.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Tarjetas principales
cards = [
  { title: 'Clientes', count: 129, color: 'bg-primary', description: 'Registrados' ,route: '/cliente'},
  { title: 'Materiales', count: 56, color: 'bg-warning', description: 'Disponibles' ,route: '/materiales' },
  { title: 'Cotizaciones', count: 1, color: 'bg-success', description: 'Emitidas' ,route: '/cotizacion' },
  { title: 'Volquetas', count: 11, color: 'bg-danger', description: 'Registradas' ,route: '/registro-volqueta' }
];


  // Gráfico de barras: Cotizaciones por mes
  cotizacionesPorMes: any[] = [];

  // Gráfico de pastel: Tipo de clientes
  clientesPorTipo: any[] = [];

  // Línea de ingresos mensuales
  ingresosMensuales: any[] = [];

  // Esquema de colores para los gráficos
  colorScheme: Color = {
    name: 'darkScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#00acc1', '#ffca28', '#66bb6a', '#ef5350', '#ab47bc']
  };

  materialesTop: any[] = [];
  volquetaStats = { operativo: 0, mantenimiento: 0 };

  constructor(
    private clienteService: ClienteService,
    private cotizacionService: CotizacionService,
    private reporteService: ReporteDiarioService,
    private materialesService: MaterialesService,
    private volquetaService: RegistroVolquetaService,
    private router: Router 
  ) {}


  irA(ruta: string): void {
  if (ruta) {
    this.router.navigate([ruta]);
  }
}

  ngOnInit(): void {
    this.clienteService.getClientes().subscribe(clientes => {
      const naturales = clientes.filter(c => c.tipo === 'Natural').length;
      const juridicos = clientes.filter(c => c.tipo === 'Jurídica').length;

      this.cards[0].count = clientes.length;
      this.clientesPorTipo = [
        { name: 'Natural', value: naturales },
        { name: 'Jurídica', value: juridicos }
      ];
    });

    

 this.cotizacionService.getCotizaciones().subscribe(cotizaciones => {
  this.cards[2].count = cotizaciones.length;

  const resumenPorMes: any = {};
  const resumenIngresos: any = {};

  cotizaciones.forEach(cot => {
    const fecha = new Date(cot.fecha);

    // ✅ Obtenemos mes abreviado sin punto final
    const mes = fecha.toLocaleString('es-EC', { month: 'short' }).replace('.', '');

    resumenPorMes[mes] = (resumenPorMes[mes] || 0) + 1;
    resumenIngresos[mes] = (resumenIngresos[mes] || 0) + cot.total;
  });

  // ✅ Asignamos a los gráficos de forma dinámica
  this.cotizacionesPorMes = Object.entries(resumenPorMes).map(([name, value]) => ({ name, value }));

  this.ingresosMensuales = [
  {
    name: 'Ingresos',
    series: Object.entries(resumenIngresos).map(([name, value]) => ({
      name,
      value: parseFloat((value as number).toFixed(2)) // ⬅️ Cast seguro
    }))
  }
];

});


    this.reporteService.getReportes().subscribe(reportes => {
      this.cards[3].count = reportes.length;
    });

    this.materialesService.getMateriales().subscribe(materiales => {
      this.cards[1].count = materiales.length;
      this.materialesTop = materiales.sort((a, b) => b.costoSinIva - a.costoSinIva).slice(0, 5);
    });

    this.volquetaService.getAll().subscribe(volquetas => {
      this.volquetaStats.operativo = volquetas.filter(v => v.estado === 'Operativo').length;
      this.volquetaStats.mantenimiento = volquetas.filter(v => v.estado === 'En mantenimiento').length;
    });
  }
}
