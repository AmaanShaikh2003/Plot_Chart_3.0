import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartStateService } from 'src/app/src/app/services/chart-state.service';
import { ChartType } from 'src/app/types';

@Component({
  selector: 'app-chart-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chart-selector.component.html',
  styleUrls: ['./chart-selector.component.css']
})
export class ChartSelectorComponent {
  chartType: ChartType = 'none';

  constructor(private chartState: ChartStateService) {}

  onChartTypeChange(): void {
    this.chartState.setChartType(this.chartType);
  }
}
