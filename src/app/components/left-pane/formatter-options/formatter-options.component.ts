import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormatterOptions, ChartType, ChartDataItem } from '../../../types';

@Component({
  selector: 'app-formatter-options',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formatter-options.component.html',
  styleUrls: ['./formatter-options.component.css']
})
export class FormatterOptionsComponent {
  @Input() chartType: ChartType = 'none';
  @Input() formatterOptions!: FormatterOptions;
  @Output() formatterChange = new EventEmitter<FormatterOptions>();

  toggleLegend(): void {
    this.formatterOptions.legend = !this.formatterOptions.legend;
    this.emitChange();
  }

  toggleTooltip(): void {
    this.formatterOptions.tooltip = !this.formatterOptions.tooltip;
    this.emitChange();
  }

  onRadiusChange(value: string): void {
    const radius = parseInt(value, 10);
    if (!isNaN(radius)) {
      this.formatterOptions.radius = radius;
      this.emitChange();
    }
  }

  onBarWidthChange(value: string): void {
    const barWidth = parseInt(value, 10);
    if (!isNaN(barWidth)) {
      this.formatterOptions.barWidth = barWidth;
      this.emitChange();
    }
  }

  onBarHeightChange(value: string): void {
    const barHeight = parseInt(value, 10);
    if (!isNaN(barHeight)) {
      this.formatterOptions.barHeight = barHeight;
      this.emitChange();
    }
  }

  onValuesChange(value: string): void {
    const items = value.split(',').map((v, i) => ({
      label: `Label ${i + 1}`,
      value: parseFloat(v.trim())
    })).filter(item => !isNaN(item.value));
    this.formatterOptions.values = items;
    this.emitChange();
  }

  emitChange(): void {
    this.formatterChange.emit({ ...this.formatterOptions });
  }

  getValuesAsString(): string {
    return this.formatterOptions.values.map(v => v.value).join(', ');
  }
}
