import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Emission } from '../models/emission.model';
import { environment } from '../../environments/environment';

export interface EmissionFilter {
  country?: string | null;
  activity?: string | null;
  emission_type?: string | null;
  year?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class EmissionService {
  private readonly apiUrl = `${environment.apiUrl}/emissions/`;
  private readonly http = inject(HttpClient);
  private cache: Emission[] | null = null;

  getEmissions(filter?: EmissionFilter): Observable<Emission[]> {
    const isFiltered = !!(filter && Object.keys(filter).length > 0);
    let params = new HttpParams();
    
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, String(value));
        }
      });
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    if (this.cache && !isFiltered) {
      return of([...this.cache]);
    }

    return this.http.get<Emission[]>(this.apiUrl, { params, headers }).pipe(
      tap(emissions => {
        if (!isFiltered) {
          this.cache = [...emissions];
        }
      }),
      catchError(error => {
        console.error('Error fetching emissions:', error);
        return of([]);
      })
    );
  }

  getUniqueValues(field: keyof Emission): Observable<string[]> {
    return this.getEmissions().pipe(
      map(emissions =>
        [...new Set(
          emissions
            .map(e => e[field])
            .filter((v): v is string | number => v !== null && v !== undefined)
            .map(String)
        )].sort()
      ),
      catchError(() => of([]))
    );
  }
}
