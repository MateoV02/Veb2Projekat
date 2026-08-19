import { identityApi } from "../api/httpClient";
import type { ServiceHealth } from "../models/ServiceHealth";

export async function checkIdentityHealth(): Promise<ServiceHealth> {
  const response = await identityApi.get<ServiceHealth>("/identity/health");
  return response.data;
}
