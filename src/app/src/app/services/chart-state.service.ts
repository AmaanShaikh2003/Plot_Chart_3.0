import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChartType, FormatterOptions, ChartDataItem } from '../../../types';

@Injectable({
  providedIn: 'root'
})
export class ChartStateService {
  private chartTypeSubject = new BehaviorSubject<ChartType>('none');
  chartType$ = this.chartTypeSubject.asObservable();

  private formatterOptionsSubject = new BehaviorSubject<FormatterOptions>({
    tooltip: true,
    legend: true,
    radius: 150,
    barWidth: 250,
    barHeight: 300,
    values: [
      { label: 'A', value: 30 },
      { label: 'B', value: 70 },
      { label: 'C', value: 45 }
    ],
    data: [ // ✅ Include 'data' explicitly to match FormatterOptions interface
      { label: 'A', value: 30 },
      { label: 'B', value: 70 },
      { label: 'C', value: 45 }
    ]
  });
  formatterOptions$ = this.formatterOptionsSubject.asObservable();

  setChartType(type: ChartType) {
    this.chartTypeSubject.next(type);
  }

  setFormatterOptions(options: FormatterOptions) {
    this.formatterOptionsSubject.next(options);
  }

  getChartTypeValue(): ChartType {
    return this.chartTypeSubject.value;
  }

  getFormatterOptionsValue(): FormatterOptions {
    return this.formatterOptionsSubject.value;
  }
}
