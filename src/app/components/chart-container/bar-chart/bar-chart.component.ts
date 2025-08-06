import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { ChartDataItem, FormatterOptions } from '../../../types';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<div #barContainer class="bar-chart-container"></div>`,
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('barContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  @Input() data: ChartDataItem[] = [];
  @Input() formatterOptions!: FormatterOptions;

  private resizeObserver!: ResizeObserver;

  ngAfterViewInit(): void {
    this.createChart();
    this.observeResize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('BarChartComponent changes detected:', changes);

    if (changes['data']) {
      console.log('Updated data:', this.data);
    }

  if (this.containerRef && (changes['data'] || changes['formatterOptions'])) {
    this.createChart();
  }
}


  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private observeResize(): void {
    const container = this.containerRef.nativeElement;
    this.resizeObserver = new ResizeObserver(() => this.createChart());
    this.resizeObserver.observe(container);
  }

  private createChart(): void {
    const container = this.containerRef.nativeElement;
    d3.select(container).select('svg').remove();

    const width = this.formatterOptions?.barWidth ?? container.clientWidth ?? 400;
    const height = this.formatterOptions?.barHeight ?? container.clientHeight ?? 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const chartGroup = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(this.data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.value)!])
      .nice()
      .range([innerHeight, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // ✅ vibrant color scale
    chartGroup.selectAll('.bar')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label)!)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.value))
      .attr('fill', d => colorScale(d.label)); // ✅ assign color based on label

    chartGroup.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    chartGroup.append('g').call(d3.axisLeft(y));
  }
}
