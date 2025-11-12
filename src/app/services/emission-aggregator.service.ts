// src/app/services/emission-aggregator.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Emission } from '../models/emission.model';

@Injectable({ providedIn: 'root' })
export class EmissionAggregatorService {
  private readonly MAX_DATA_POINTS = 30;

  constructor(private ngZone: NgZone) {}

  aggregateData(emissions: Emission[]): Promise<{ labels: string[]; values: number[] }> {
    return new Promise((resolve) => {
      this.ngZone.runOutsideAngular(() => {
        const aggregate = new Map<string, number>();
        const chunkSize = 1000;

        const processChunk = (start: number) => {
          const end = Math.min(start + chunkSize, emissions.length);
          for (let i = start; i < end; i++) {
            const e = emissions[i];
            const key = `${e.country} - ${e.activity}`;
            aggregate.set(key, (aggregate.get(key) || 0) + Number(e.emissions || 0));
          }

          if (end < emissions.length) {
            requestAnimationFrame(() => processChunk(end));
          } else {
            const sorted = Array.from(aggregate.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, this.MAX_DATA_POINTS);

            resolve({
              labels: sorted.map(([k]) => k),
              values: sorted.map(([, v]) => v),
            });
          }
        };

        processChunk(0);
      });
    });
  }
}
