export interface Emission {
  id: number;
  country: string;
  activity: string;
  emission_type: string;
  year: number;
  emissions: number; 
}

export interface EmissionFilter {
  country?: string;
  activity?: string;
  emission_type?: string;
  year?: number;
}
