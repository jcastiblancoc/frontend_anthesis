import { Component, OnInit, OnDestroy, AfterViewInit, AfterViewChecked, ViewChild, ElementRef, Inject, ChangeDetectionStrategy, ChangeDetectorRef, PLATFORM_ID, NgZone, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, firstValueFrom } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EmissionService, EmissionFilter } from '../../services/emission.service';
import { EmissionAggregatorService } from '../../services/emission-aggregator.service';
import { ChartFactoryService } from '../../services/chart-factory.service';
import { Emission } from '../../models/emission.model';
import { Chart } from 'chart.js';

type DashboardFilter = {
  country?: string | null;
  activity?: string | null;
  emission_type?: string | null;
  year?: number | null;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) set chartCanvasRef(ref: ElementRef<HTMLCanvasElement> | undefined) {
    if (ref) {
      this._chartCanvas = ref;
      this.initializeChartWithData().catch(error => {
        this.error = 'Failed to initialize chart';
        this.cdr.markForCheck();
        console.error(error);
      });
    }
  }

  private _chartCanvas?: ElementRef<HTMLCanvasElement>;
  private get chartCanvas(): ElementRef<HTMLCanvasElement> | undefined {
    return this._chartCanvas;
  }

  emissions: Emission[] = [];
  countries: string[] = [];
  activities: string[] = [];
  emissionTypes: string[] = [];
  availableYears: number[] = [];
  filter: DashboardFilter = {};
  chart: Chart | null = null;

  minYear = 2015;
  currentYear = new Date().getFullYear();
  isLoading = false;
  error: string | null = null;

  private updateChartTimer: any;
  isBrowser: boolean;
  private resizeObserver: ResizeObserver | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private emissionService: EmissionService,
    private chartFactory: ChartFactoryService,
    private aggregator: EmissionAggregatorService,
    @Inject(PLATFORM_ID) platformId: Object,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.availableYears = Array.from({ length: this.currentYear - this.minYear + 1 }, (_, i) => this.currentYear - i);
    this.loadFilterOptions();
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.loadEmissions().catch(err => {
      this.error = 'Failed to load initial data';
      this.cdr.markForCheck();
      console.error(err);
    });
    if (typeof ResizeObserver !== 'undefined') this.setupResizeObserver();
  }

  ngAfterViewChecked(): void {}

  private setupResizeObserver(): void {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    this.resizeObserver = new ResizeObserver(() => {
      if (this.chart) {
        this.ngZone.run(() => {
          this.chart?.resize();
          this.chart?.update();
          this.cdr.markForCheck();
        });
      }
    });
    const container = this.chartCanvas?.nativeElement?.parentElement;
    if (container) this.resizeObserver.observe(container);
  }

  ngOnDestroy(): void {
    clearTimeout(this.updateChartTimer);
    this.chart?.destroy();
    this.chart = null;
    this.resizeObserver?.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadFilterOptions(): void {
    this.emissionService.getUniqueValues('country').pipe(takeUntil(this.destroy$)).subscribe(v => this.countries = v);
    this.emissionService.getUniqueValues('activity').pipe(takeUntil(this.destroy$)).subscribe(v => this.activities = v);
    this.emissionService.getUniqueValues('emission_type').pipe(takeUntil(this.destroy$)).subscribe(v => this.emissionTypes = v);
  }

  private async initializeChartWithData(): Promise<void> {
    if (!this.isBrowser || !this.chartCanvas?.nativeElement) return;
    try {
      const canvas = this.chartCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No 2D context');
      const container = canvas.parentElement;
      if (container) {
        const width = container.clientWidth;
        const height = 500;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const scale = window.devicePixelRatio;
        canvas.width = width * scale;
        canvas.height = height * scale;
        ctx.scale(scale, scale);
      }
      this.chart?.destroy();
      const { labels, values } = await this.aggregator.aggregateData(this.emissions);
      if (!labels.length || !values.length) return;
      this.chart = this.chartFactory.createBarChart(ctx, labels, values);
      this.chart.update();
      setTimeout(() => {
        this.chart?.resize();
        this.chart?.update();
        this.cdr.detectChanges();
      }, 100);
    } catch (error) {
      this.error = 'Failed to initialize chart';
      this.cdr.markForCheck();
      console.error(error);
    }
  }

  async loadEmissions(): Promise<void> {
    if (!this.isBrowser) return;
    this.isLoading = true;
    this.error = null;
    this.cdr.markForCheck();
    try {
      const filters: EmissionFilter = { ...(this.filter || {}) };
      const data = await firstValueFrom(this.emissionService.getEmissions(filters));
      if (!Array.isArray(data)) throw new Error('Invalid data format');
      this.emissions = [...data];
      this.cdr.markForCheck();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load emissions data';
      console.error(err);
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  onFilterChange(): void {
    clearTimeout(this.updateChartTimer);
    this.isLoading = true;
    this.error = null;
    this.cdr.markForCheck();
    this.updateChartTimer = setTimeout(() => {
      this.ngZone.run(() => {
        this.loadEmissions().catch(error => {
          this.error = 'Failed to update data';
          this.isLoading = false;
          this.cdr.detectChanges();
          console.error(error);
        });
      });
    }, 150);
  }

  resetFilters(): void {
    this.filter = {};
    this.cdr.detectChanges();
    this.onFilterChange();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.chart?.resize();
  }
}
