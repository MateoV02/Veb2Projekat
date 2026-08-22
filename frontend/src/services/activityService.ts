import { tripApi } from "../api/httpClient";
import type { Activity, ActivityRequest } from "../models/Activity";

export async function getActivities(tripId: string): Promise<Activity[]> {
  const response = await tripApi.get<Activity[]>(`/trips/${tripId}/activities`);
  return response.data;
}

export async function getActivityById(tripId: string, id: string): Promise<Activity> {
  const response = await tripApi.get<Activity>(`/trips/${tripId}/activities/${id}`);
  return response.data;
}

export async function createActivity(tripId: string, data: ActivityRequest): Promise<Activity> {
  const response = await tripApi.post<Activity>(`/trips/${tripId}/activities`, data);
  return response.data;
}

export async function updateActivity(
  tripId: string,
  id: string,
  data: ActivityRequest
): Promise<Activity> {
  const response = await tripApi.put<Activity>(`/trips/${tripId}/activities/${id}`, data);
  return response.data;
}

export async function deleteActivity(tripId: string, id: string): Promise<void> {
  await tripApi.delete(`/trips/${tripId}/activities/${id}`);
}
