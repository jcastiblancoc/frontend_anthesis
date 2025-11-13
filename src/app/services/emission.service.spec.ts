import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { EmissionService } from './emission.service';
import { Emission } from '../models/emission.model';
import { API_CONFIG } from '../config/api.config';

describe('EmissionService', () => {
  let service: EmissionService;
  let httpMock: HttpTestingController;
  const apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.emissions}`;

  const mockEmissions: Emission[] = [
    { id: 1, year: 2023, emissions: 5.5, emission_type: 'CO2', country: 'UK', activity: 'Transport' },
    { id: 2, year: 2023, emissions: 3.2, emission_type: 'CH4', country: 'Germany', activity: 'Industry' },
    { id: 3, year: 2022, emissions: 4.1, emission_type: 'CO2', country: 'UK', activity: 'Industry' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        EmissionService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(EmissionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch emissions from API', (done) => {
    service.getEmissions().subscribe(emissions => {
      expect(emissions).toEqual(mockEmissions);
      expect(emissions.length).toBe(3);
      done();
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmissions);
  });

  it('should handle API errors gracefully', (done) => {
    service.getEmissions().subscribe(emissions => {
      expect(emissions).toEqual([]);
      done();
    });

    const req = httpMock.expectOne(apiUrl);
    req.error(new ProgressEvent('error'));
  });
});
