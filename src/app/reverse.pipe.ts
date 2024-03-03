import { Pipe, PipeTransform } from '@angular/core';
// 用來將最新的內容放在最上方
@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {
  transform(value: any[]): any[] {
    if (!value) return [];
    return value.slice().reverse();
  }
}
