import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartSelectorComponent } from './components/left-pane/chart-selector/chart-selector.component';
import { FormatterOptionsComponent } from './components/left-pane/formatter-options/formatter-options.component';
import { ChartContainerComponent } from './components/chart-container/chart-container.component';
import { ChartStateService } from './src/app/services/chart-state.service';
import { FormatterOptions } from './types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ChartSelectorComponent,
    FormatterOptionsComponent,
    ChartContainerComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showFormatterPanel = false;
  showChart = false;

  constructor(public chartState: ChartStateService) {}

  onChartTypeChanged(): void {
    this.showFormatterPanel = false;
    this.showChart = false;
  }

  onPlot(): void {
    const currentOptions = this.chartState.getFormatterOptionsValue();

    // Sync `values` into `data`
    this.chartState.setFormatterOptions({
      ...currentOptions,
      data: [...currentOptions.values] // 🔁 force `data` to update
    });

    this.showChart = true;
  }

  toggleFormatterPanel(): void {
    this.showFormatterPanel = !this.showFormatterPanel;
  }

  onFormatterChange(updatedOptions: FormatterOptions): void {
    this.chartState.setFormatterOptions({
      ...updatedOptions,
      data: [...updatedOptions.values] // 🔁 keep data updated automatically
    });
  }

  get currentChartType() {
    return this.chartState.getChartTypeValue();
  }

  get currentFormatterOptions() {
    return this.chartState.getFormatterOptionsValue();
  }
}
