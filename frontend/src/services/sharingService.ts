import { sharingApi, tripApi } from "../api/httpClient";
import type { ServiceHealth } from "../models/ServiceHealth";
import type { AccessType, ShareLink, TokenValidation } from "../models/Sharing";
import type { TripPlan, TripPlanRequest } from "../models/Trip";

export async function checkSharingHealth(): Promise<ServiceHealth> {
  const response = await sharingApi.get<ServiceHealth>("/sharing/health");
  return response.data;
}

export async function createShareLink(tripId: string, accessType: AccessType): Promise<ShareLink> {
  const response = await sharingApi.post<ShareLink>(`/sharing/trips/${tripId}/links`, { accessType });
  return response.data;
}

export async function getShareLinks(tripId: string): Promise<ShareLink[]> {
  const response = await sharingApi.get<ShareLink[]>(`/sharing/trips/${tripId}/links`);
  return response.data;
}

export async function revokeShareLink(token: string): Promise<void> {
  await sharingApi.delete(`/sharing/links/${token}`);
}

export async function validateShareToken(token: string): Promise<TokenValidation> {
  const response = await sharingApi.get<TokenValidation>(`/sharing/validate/${token}`);
  return response.data;
}

export async function getSharedTrip(tripId: string, token: string): Promise<TripPlan> {
  const response = await tripApi.get<TripPlan>(`/trips/${tripId}`, {
    headers: { "X-Share-Token": token },
  });
  return response.data;
}

export async function updateSharedTrip(
  tripId: string,
  token: string,
  data: TripPlanRequest
): Promise<TripPlan> {
  const response = await tripApi.put<TripPlan>(`/trips/${tripId}`, data, {
    headers: { "X-Share-Token": token },
  });
  return response.data;
}
