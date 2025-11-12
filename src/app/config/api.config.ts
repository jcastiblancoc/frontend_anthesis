import { environment } from '../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiUrl,
  endpoints: {
    emissions: '/emissions/',
  },
  timeout: 30000,
} as const;
