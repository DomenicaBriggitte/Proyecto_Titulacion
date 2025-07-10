import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  transform(texto: string, termino: string): any {
    if (!termino) return texto;

    const regex = new RegExp(`(${termino})`, 'gi');
    return texto.replace(regex, `<span class="resaltado">$1</span>`);
  }
}