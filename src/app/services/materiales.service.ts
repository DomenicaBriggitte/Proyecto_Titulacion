import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {
  private materiales = [
    { codigo: '001', nombre: 'TRANSPORTE DE 8M', costoSinIva: 50, tipo: 'Transporte' },
    { codigo: '002', nombre: 'TRANSPORTE DE 12M', costoSinIva: 50, tipo: 'Transporte' },
    { codigo: '003', nombre: 'TRANSPORTE DE ARENA DE 12M', costoSinIva: 130, tipo: 'Transporte' },
    { codigo: '004', nombre: 'TRANSPORTE DE RIPIO DE 12M', costoSinIva: 140, tipo: 'Transporte' },
    { codigo: '005', nombre: 'TRANSPORTE DE RIPIO DE 8M', costoSinIva: 105, tipo: 'Transporte' },
    { codigo: '006', nombre: 'TRANSPORTE DE ARENA DE 8M', costoSinIva: 95, tipo: 'Transporte' },
    { codigo: '007', nombre: 'TRANSPORTE DE 4M', costoSinIva: 30, tipo: 'Transporte' },
    { codigo: '008', nombre: 'TRANSPORTE DE CASCAJO DE 12M', costoSinIva: 80, tipo: 'Transporte' },
    { codigo: '009', nombre: 'TRANSPORTE DE PIEDRA BASE DE 8M', costoSinIva: 105, tipo: 'Transporte' },
    { codigo: '010', nombre: 'TRANSPORTE DE PIEDRA 3/4 de 8M', costoSinIva: 160, tipo: 'Transporte' },
    { codigo: '011', nombre: 'TRANSPORTE DE PIEDRA 3/4 DE 12M', costoSinIva: 215, tipo: 'Transporte' },
    { codigo: '012', nombre: 'TRANSPORTE DE CISCO 8M', costoSinIva: 140, tipo: 'Transporte' },
    { codigo: '013', nombre: 'TRANSPORTE DE PIEDRA CHISPA DE 12 METROS', costoSinIva: 226, tipo: 'Transporte' },
    { codigo: '1', nombre: 'ARENA HOMOGUENIZADA DE 8M', costoSinIva: 123.81, tipo: 'Arena' },
    { codigo: '1001', nombre: 'ARENA 8M', costoSinIva: 61.90, tipo: 'Arena' },
    { codigo: '1002', nombre: 'ARENA DE 12M', costoSinIva: 80, tipo: 'Arena' },
    { codigo: '1003', nombre: 'ARENA DE 4M', costoSinIva: 33.33, tipo: 'Arena' },
    { codigo: '1004', nombre: 'ARENA GRUESA DE 8M', costoSinIva: 80.95, tipo: 'Arena' },
    { codigo: '1005', nombre: 'ARENA HOMOGENIZADA 12m', costoSinIva: 125, tipo: 'Arena' },
    { codigo: '1006', nombre: 'ARENA 10M', costoSinIva: 125, tipo: 'Arena' },
    { codigo: '1007', nombre: 'Arena 6M', costoSinIva: 47.62, tipo: 'Arena' },
    { codigo: '1008', nombre: 'Arena gruesa 4M', costoSinIva: 42.86, tipo: 'Arena' },
    { codigo: '2001', nombre: 'RIPIO DE 8m', costoSinIva: 80.95, tipo: 'Ripio' },
    { codigo: '2002', nombre: 'RIPIO DE 12M', costoSinIva: 90.48, tipo: 'Ripio' },
    { codigo: '2003', nombre: 'RIPIO DE 4M', costoSinIva: 42.86, tipo: 'Ripio' },
    { codigo: '3001', nombre: 'CASCAJO DE 12M', costoSinIva: 76.19, tipo: 'Cascajo' },
    { codigo: '3002', nombre: 'CASCAJO DE 8M', costoSinIva: 57.14, tipo: 'Cascajo' },
    { codigo: '4001', nombre: 'PIEDRA 3/4 8m', costoSinIva: 100, tipo: 'Piedra 3/4' },
    { codigo: '4002', nombre: 'PIEDRA 3/4 12M', costoSinIva: 160, tipo: 'Piedra 3/4' },
    { codigo: '4003', nombre: 'CALIZA PIEDRA #4', costoSinIva: 80.35, tipo: 'Piedra 3/4' },
    { codigo: '4004', nombre: 'PIEDRA 3/4', costoSinIva: 100, tipo: 'Piedra 3/4' },
    { codigo: '4005', nombre: 'PIEDRA 3/4 de 6M', costoSinIva: 85.71, tipo: 'Piedra 3/4' },
    { codigo: '4006', nombre: 'PIEDRA 3/4 DE 4M', costoSinIva: 49.11, tipo: 'Piedra 3/4' },
    { codigo: '4009', nombre: 'PIEDRA 3/4 10M', costoSinIva: 178.57, tipo: 'Piedra 3/4' },
    { codigo: '4010', nombre: 'PIEDRA 3/8 8METROS', costoSinIva: 142.86, tipo: 'Piedra 3/4' },
    { codigo: '5001', nombre: 'PIEDRA CHISPA DE 8M', costoSinIva: 142.86, tipo: 'Piedra Chispa' },
    { codigo: '5002', nombre: 'CALIZA PIEDRA #67 (5 - 19 MM) GYE', costoSinIva: 110, tipo: 'Piedra Chispa' },
    { codigo: '5003', nombre: 'PIEDRA CHISPA DE 12M', costoSinIva: 171.43, tipo: 'Piedra Chispa' },
    { codigo: '5004', nombre: 'PIEDRA 3/8', costoSinIva: 100, tipo: 'Piedra Chispa' },
    { codigo: '5005', nombre: 'PIEDRA CHISPA de 4m', costoSinIva: 85.71, tipo: 'Piedra Chispa' },
    { codigo: '6001', nombre: 'CISCO DE 8M', costoSinIva: 80.36, tipo: 'Cisco' },
    { codigo: '6002', nombre: 'CISCO', costoSinIva: 44.64, tipo: 'Cisco' },
    { codigo: '6003', nombre: 'CISCO DE 4M', costoSinIva: 44.64, tipo: 'Cisco' },
    { codigo: '8001', nombre: 'PIEDRA BASE DE 8M', costoSinIva: 62.50, tipo: 'Piedra Base' },
    { codigo: '8002', nombre: 'PIEDRA BASE DE 12M', costoSinIva: 150, tipo: 'Piedra Base' },
    { codigo: '8003', nombre: 'PIEDRA BASE 4M', costoSinIva: 66.66, tipo: 'Piedra Base' },
    { codigo: '9001', nombre: 'Lavada de carro pequeño', costoSinIva: 15.18, tipo: 'Lavado de Carro' },
    { codigo: '1001', nombre: 'RUL.RUED.DEL.EXT.1924/OF1730/MAS', costoSinIva: 26.79, tipo: 'Respuesto para Volqueta' },
    //{ codigo: '1002', nombre: 'MANTENIMIENTO VEHICULOS', costoSinIva: 0, tipo: 'Respuesto para Volqueta' },
    { codigo: '1003', nombre: 'PLANCH.COMPR.90 FE.WF.C/LAIN.OM355.5/6', costoSinIva: 46.43, tipo: 'Respuesto para Volqueta' },
    { codigo: '1004', nombre: 'TUER.PUNT.FRONT.1', costoSinIva: 13.39, tipo: 'Respuesto para Volqueta' },
    { codigo: '10005', nombre: 'RUL.RUED.DEL.INT/CONO AL PIÑ. Ø300', costoSinIva: 60.71, tipo: 'Respuesto para Volqueta' },
    //{ codigo: '11001', nombre: 'GASOLINA', costoSinIva: 0, tipo: 'Combustible' },
    { codigo: '12001', nombre: 'ARCILLA DE 4m', costoSinIva: 31.25, tipo: 'Arcilla' },
    { codigo: '12002', nombre: 'ARCILLA DE 8 METROS', costoSinIva: 50, tipo: 'Arcilla' },
    { codigo: '13001', nombre: 'SUB BASE DE 8 METROS', costoSinIva: 100, tipo: 'Sub Base' }
  ];

  getMateriales() {
    return this.materiales;
  }

  addMaterial(material: any) {
    this.materiales.push(material);
  }

  updateMaterial(material: any) {
    const index = this.materiales.findIndex(m => m.codigo === material.codigo);
    if (index !== -1) {
      this.materiales[index] = { ...material };
    }
  }

  deleteMaterial(codigo: string) {
    const index = this.materiales.findIndex(m => m.codigo === codigo);
    if (index !== -1) {
      this.materiales.splice(index, 1);
    }
  }
}
