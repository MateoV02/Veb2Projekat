import { sharingApi } from "../api/httpClient";
import type { ServiceHealth } from "../models/ServiceHealth";

export async function checkSharingHealth(): Promise<ServiceHealth> {
  const response = await sharingApi.get<ServiceHealth>("/sharing/health");
  return response.data;
}
