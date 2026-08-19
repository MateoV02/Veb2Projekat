import { tripApi } from "../api/httpClient";
import type { ServiceHealth } from "../models/ServiceHealth";

export async function checkTripHealth(): Promise<ServiceHealth> {
  const response = await tripApi.get<ServiceHealth>("/trips/health");
  return response.data;
}
