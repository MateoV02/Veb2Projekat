import { tripApi } from "../api/httpClient";
import type { ServiceHealth } from "../models/ServiceHealth";
import type { TripPlan, TripPlanRequest } from "../models/Trip";

export async function checkTripHealth(): Promise<ServiceHealth> {
  const response = await tripApi.get<ServiceHealth>("/trips/health");
  return response.data;
}

export async function getTrips(): Promise<TripPlan[]> {
  const response = await tripApi.get<TripPlan[]>("/trips");
  return response.data;
}

export async function getTripById(id: string): Promise<TripPlan> {
  const response = await tripApi.get<TripPlan>(`/trips/${id}`);
  return response.data;
}

export async function createTrip(data: TripPlanRequest): Promise<TripPlan> {
  const response = await tripApi.post<TripPlan>("/trips", data);
  return response.data;
}

export async function updateTrip(id: string, data: TripPlanRequest): Promise<TripPlan> {
  const response = await tripApi.put<TripPlan>(`/trips/${id}`, data);
  return response.data;
}

export async function deleteTrip(id: string): Promise<void> {
  await tripApi.delete(`/trips/${id}`);
}
