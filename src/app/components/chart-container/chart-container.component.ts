import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartType, FormatterOptions } from '../../types';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';

@Component({
  selector: 'app-chart-container',
  standalone: true,
  imports: [CommonModule, PieChartComponent, BarChartComponent],
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.css']
})
export class ChartContainerComponent implements OnChanges {
  @Input() chartType!: ChartType;
  @Input() formatterOptions!: FormatterOptions;

  ngOnChanges(): void {
    // This will trigger when chartType or formatterOptions changes
  }
}
