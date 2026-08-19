import { expenseApi } from "../api/httpClient";
import type { ServiceHealth } from "../models/ServiceHealth";

export async function checkExpenseHealth(): Promise<ServiceHealth> {
  const response = await expenseApi.get<ServiceHealth>("/expenses/health");
  return response.data;
}
