import { Injectable } from '@angular/core';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';

Chart.register(...registerables);

@Injectable({ providedIn: 'root' })
export class ChartFactoryService {
  private readonly MAX_DATA_POINTS = 30;

  createBarChart(ctx: CanvasRenderingContext2D, labels: string[], values: number[]): Chart<'bar'> {
    if (!ctx) {
      throw new Error('Canvas context is required to create a chart');
    }

    const colors = this.generateColors(labels.length);

    const data: ChartData<'bar'> = {
      labels,
      datasets: [{
        label: 'Emissions (kt)',
        data: values,
        backgroundColor: colors,
        borderColor: colors.map(c => c.replace('0.8', '1')),
        borderWidth: 1,
        borderRadius: 5,
        barPercentage: 0.8,
        categoryPercentage: 0.9,
      }],
    };

    const options: ChartOptions<'bar'> = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: window.devicePixelRatio || 1,
      resizeDelay: 100,
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      },
      layout: {
        padding: {
          top: 10,
          right: 20,
          bottom: 10,
          left: 0
        }
      },
      scales: {
        x: { 
          beginAtZero: true,
          title: { 
            display: true, 
            text: 'Emissions (kt)',
            color: '#666',
            font: {
              size: 12,
              weight: 'bold' as const
            },
            padding: { top: 10, bottom: 10 }
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            color: '#666',
            font: {
              size: 12
            },
            padding: 5
          }
        },
        y: { 
          ticks: { 
            autoSkip: false,
            color: '#666',
            font: {
              size: 12
            },
            padding: 5
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          },
          border: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
      },
      plugins: { 
        legend: { 
          display: true,
          position: 'top',
          labels: {
            color: '#666',
            font: {
              size: 12,
              weight: 'bold' as const
            },
            padding: 20,
            usePointStyle: true,
            boxWidth: 10
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: 14,
            weight: 'bold' as const
          },
          bodyFont: {
            size: 12
          },
          padding: 10,
          cornerRadius: 4,
          usePointStyle: true,
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || '';
              const value = context.parsed?.x ?? 0;
              return `${label}: ${value.toLocaleString()} kt`;
            }
          }
        }
      },
      onResize: (chart, size) => {
        try {
          if (chart.canvas) {
            const container = chart.canvas.parentElement;
            if (container) {
              const width = container.clientWidth;
              const height = container.clientHeight || 500;
              
              chart.canvas.style.width = `${width}px`;
              chart.canvas.style.height = `${height}px`;
              
              const scale = window.devicePixelRatio || 1;
              chart.canvas.width = Math.floor(width * scale);
              chart.canvas.height = Math.floor(height * scale);
              
              const ctx = chart.ctx;
              ctx.scale(scale, scale);
              
              chart.update('resize');
            }
          }
        } catch (error) {
          console.error('Error in chart resize handler:', error);
        }
      }
    };

    return new Chart(ctx, { type: 'bar', data, options });
  }

  destroy(chart: Chart | null): void {
    if (chart) chart.destroy();
  }

  private generateColors(count: number): string[] {
    return Array.from({ length: count }, (_, i) => {
      const hue = (i * 137.508) % 360;
      return `hsla(${hue}, 75%, 60%, 0.9)`;
    });
  }
}
