import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({ name: 'formatDate' })
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string | null): string {
    if (!value) return '';
    const date = new Date(value);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  // transform(value: any, format: string = 'dd/MM/yyyy'): string | null {
  //   if (value) {
  //     return formatDate(value, format, 'en');
  //   }
  //   return null;
  // }
}