import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { ChartDataItem, FormatterOptions } from '../../../types';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() data: ChartDataItem[] = [];
  @Input() formatterOptions!: FormatterOptions;
  @Output() formatterChange = new EventEmitter<FormatterOptions>();
  @ViewChild('pieContainer', { static: true }) pieContainer!: ElementRef<HTMLDivElement>;

    toggleLegend(): void {
    this.formatterOptions.legend = !this.formatterOptions.legend;
    this.emitChange();
  }

    emitChange(): void {
    this.formatterChange.emit({ ...this.formatterOptions });
  }

  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private chartGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private tooltip?: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  private resizeObserver!: ResizeObserver;

  readonly color = d3.scaleOrdinal(d3.schemeCategory10);

  ngAfterViewInit(): void {
    this.createChart();
    this.observeResize();
  }

  ngOnChanges(): void {
    if (this.pieContainer?.nativeElement) {
      this.createChart();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private observeResize(): void {
    const container = this.pieContainer.nativeElement;
    this.resizeObserver = new ResizeObserver(() => this.createChart());
    this.resizeObserver.observe(container);
  }

  private createChart(): void {
    const container = this.pieContainer.nativeElement;
    container.innerHTML = ''; // clear old chart


    const bounds = container.getBoundingClientRect();
    const fallbackRadius = 150;
    const radius = this.formatterOptions?.radius ?? fallbackRadius;

    const margin = { top: 50, right: 20, bottom: 30, left: 40 };

    const svgWidth = 2 * radius + margin.left + margin.right;
    const svgHeight = 2 * radius + margin.top + margin.bottom;

    if (this.formatterOptions?.title) {
  this.svg.append('text')
    .attr('x', svgWidth / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('class', 'chart-title')
    .text(this.formatterOptions.title);
}

    this.svg = d3.select(container)
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);
    
      
    const chartTitle = this.formatterOptions?.title ?? '';
    if (chartTitle) {
      this.svg.append('text')
        .attr('x', svgWidth / 2)
        .attr('y', margin.top / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '18px')
        .attr('font-family', 'Arial, sans-serif')
        .attr('fill', '#333')
        .text(chartTitle);
    }

    this.chartGroup = this.svg.append('g')
      .attr('transform', `translate(${margin.left + radius}, ${margin.top + radius})`);

    this.tooltip = d3.select('#tooltip') as unknown as d3.Selection<HTMLDivElement, unknown, null, undefined>;

    const values = this.formatterOptions?.values ?? [];
    const tooltipEnabled = this.formatterOptions?.tooltip ?? true;
    // Force-hide tooltip when disabled
    if (!tooltipEnabled && this.tooltip) {
      this.tooltip.style('display', 'none').style('opacity', '0');
    }
    const showLegend = this.formatterOptions?.legend ?? true;

    const processedData: ChartDataItem[] = values.map((v, i) => ({
      label: v.label ?? `Label ${i + 1}`,
      value: typeof v.value === 'number' ? v.value : 0
    }));

    const pie = d3.pie<ChartDataItem>().value(d => d.value);
    const arc = d3.arc<d3.PieArcDatum<ChartDataItem>>()
      .innerRadius(0)
      .outerRadius(radius);

    this.chartGroup.selectAll('path')
      .data(pie(processedData))
      .join('path')
      .attr('d', arc)
      .attr('fill', d => this.color(d.data.label))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', tooltipEnabled ? 'pointer' : 'default')
      .on('mouseover', (event, d) => {
        if (!tooltipEnabled) return;
        this.tooltip
          ?.style('display', 'block')
          .style('opacity', '1')
          .html(`<strong>${d.data.label}:</strong> ${d.data.value}`);
      })
    .on('mouseover', (event, d) => {
      if (!tooltipEnabled) return;

      const [x, y] = arc.centroid(d);
      const chart = this.chartGroup.node()?.getBoundingClientRect();
      if (chart) {
        this.tooltip
          ?.style('display', 'block')
          .style('opacity', '1')
          .style('left', `${chart.left + x + window.scrollX}px`)
          .style('top', `${chart.top + y + 30 + window.scrollY}px`) // ✅ Add vertical offset
          .html(`<strong>${d.data.label}:</strong> ${d.data.value}`);
      }
    })
    .on('mouseout', () => {
      this.tooltip?.style('display', 'none').style('opacity', '0');
    });


      // .on('mouseout', () => {
      //   this.tooltip?.style('display', 'none').style('opacity', '0');
      // });
      const legendContainer = d3.select('#legend');
      legendContainer.selectAll('*').remove(); // ✅ always clear previous legend

      if (showLegend) {
        const legendItems = legendContainer
          .selectAll('.legend-item')
          .data(processedData)
          .enter()
          .append('div')
          .attr('class', 'legend-item');

        legendItems.append('span')
          .attr('class', 'legend-color')
          .style('background-color', d => this.color(d.label));

        legendItems.append('span')
          .text(d => `${d.label}: ${d.value}`);
      }

  }
}
