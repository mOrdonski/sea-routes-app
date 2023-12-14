import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  providers: [provideEcharts()],
})
export class ChartComponent implements OnChanges {
  @Input() categories: string[] = [];
  @Input() data: number[] = [];
  @Output() closeChart: EventEmitter<void> = new EventEmitter<void>();

  chartOption: EChartsOption = {};

  ngOnChanges(): void {
    this.chartOption = {
      xAxis: {
        type: 'category',
        data: this.categories,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: this.data,
          type: 'line',
        },
      ],
    };
  }
}
