import { identityApi } from "../api/httpClient";
import type { ServiceHealth } from "../models/ServiceHealth";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../models/Auth";

export async function checkIdentityHealth(): Promise<ServiceHealth> {
  const response = await identityApi.get<ServiceHealth>("/identity/health");
  return response.data;
}

export async function register(data: RegisterRequest): Promise<User> {
  const response = await identityApi.post<User>("/identity/auth/register", data);
  return response.data;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await identityApi.post<AuthResponse>("/identity/auth/login", data);
  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await identityApi.get<User>("/identity/users/me");
  return response.data;
}
