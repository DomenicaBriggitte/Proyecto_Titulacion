import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {
  private materiales = [
    { codigo: '001', nombre: 'TRANSPORTE DE 8M', costoSinIva: 50, tipo: 'Transporte' },
    
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
