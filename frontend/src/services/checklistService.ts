import { tripApi } from "../api/httpClient";
import type { ChecklistItem, ChecklistItemRequest } from "../models/Checklist";

export async function getChecklistItems(tripId: string): Promise<ChecklistItem[]> {
  const response = await tripApi.get<ChecklistItem[]>(`/trips/${tripId}/checklist`);
  return response.data;
}

export async function createChecklistItem(
  tripId: string,
  data: ChecklistItemRequest
): Promise<ChecklistItem> {
  const response = await tripApi.post<ChecklistItem>(`/trips/${tripId}/checklist`, data);
  return response.data;
}

export async function updateChecklistItem(
  tripId: string,
  id: string,
  data: ChecklistItemRequest
): Promise<ChecklistItem> {
  const response = await tripApi.put<ChecklistItem>(`/trips/${tripId}/checklist/${id}`, data);
  return response.data;
}

export async function deleteChecklistItem(tripId: string, id: string): Promise<void> {
  await tripApi.delete(`/trips/${tripId}/checklist/${id}`);
}
