import { Pipe } from '@angular/core';

@Pipe({ name: 'period' })
export class PeriodDatePipe {

  transformDateToPeriod(date: Date): string {
    return date.getMonth() + 1 + "-" + date.getFullYear();
  }

  transformToDateFromPeriod(period: string): Date {
    var month = Number.parseInt(period.split("-")[0]);
    var year = Number.parseInt(period.split("-")[1]);
    var date = new Date();
    date.setMonth(month - 1);
    date.setFullYear(year);
    return date;
  }

}
