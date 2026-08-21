export interface TripPlan {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  notes: string;
  createdAt: string;
}

export interface TripPlanRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  notes: string;
}
