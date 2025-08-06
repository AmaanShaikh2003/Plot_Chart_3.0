import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartSelectorComponent } from './chart-selector/chart-selector.component';
import { FormatterOptionsComponent } from './formatter-options/formatter-options.component';

@Component({
  selector: 'app-left-pane',
  standalone: true,
  imports: [CommonModule, ChartSelectorComponent, FormatterOptionsComponent],
  templateUrl: './left-pane.component.html',
  styleUrls: ['./left-pane.component.css']
})
export class LeftPaneComponent {}
