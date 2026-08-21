import { tripApi } from "../api/httpClient";
import type { Destination, DestinationRequest } from "../models/Destination";

export async function getDestinations(tripId: string): Promise<Destination[]> {
  const response = await tripApi.get<Destination[]>(`/trips/${tripId}/destinations`);
  return response.data;
}

export async function getDestinationById(tripId: string, id: string): Promise<Destination> {
  const response = await tripApi.get<Destination>(`/trips/${tripId}/destinations/${id}`);
  return response.data;
}

export async function createDestination(
  tripId: string,
  data: DestinationRequest
): Promise<Destination> {
  const response = await tripApi.post<Destination>(`/trips/${tripId}/destinations`, data);
  return response.data;
}

export async function updateDestination(
  tripId: string,
  id: string,
  data: DestinationRequest
): Promise<Destination> {
  const response = await tripApi.put<Destination>(`/trips/${tripId}/destinations/${id}`, data);
  return response.data;
}

export async function deleteDestination(tripId: string, id: string): Promise<void> {
  await tripApi.delete(`/trips/${tripId}/destinations/${id}`);
}
