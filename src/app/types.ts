export interface ChartDataItem {
  label: string;
  value: number;
}

export interface FormatterOptions {
  tooltip: boolean;
  legend: boolean;
  radius?: number;
  barWidth?: number;
  barHeight?: number;
  values: ChartDataItem[];
  data: ChartDataItem[];
}

export type ChartType = 'none' | 'pie' | 'bar';
