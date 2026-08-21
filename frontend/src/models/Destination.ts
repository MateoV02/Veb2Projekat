export interface Destination {
  id: string;
  tripPlanId: string;
  name: string;
  location: string;
  arrivalDate: string;
  departureDate: string;
  notes: string;
  createdAt: string;
}

export interface DestinationRequest {
  name: string;
  location: string;
  arrivalDate: string;
  departureDate: string;
  notes: string;
}
