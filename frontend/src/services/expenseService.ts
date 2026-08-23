import { expenseApi } from "../api/httpClient";
import type { ServiceHealth } from "../models/ServiceHealth";
import type { BudgetSummary, Expense, ExpenseRequest } from "../models/Expense";

export async function checkExpenseHealth(): Promise<ServiceHealth> {
  const response = await expenseApi.get<ServiceHealth>("/expenses/health");
  return response.data;
}

export async function getExpenses(tripId: string): Promise<Expense[]> {
  const response = await expenseApi.get<Expense[]>("/expenses", { params: { tripId } });
  return response.data;
}

export async function getExpenseById(id: string): Promise<Expense> {
  const response = await expenseApi.get<Expense>(`/expenses/${id}`);
  return response.data;
}

export async function createExpense(data: ExpenseRequest): Promise<Expense> {
  const response = await expenseApi.post<Expense>("/expenses", data);
  return response.data;
}

export async function updateExpense(id: string, data: ExpenseRequest): Promise<Expense> {
  const response = await expenseApi.put<Expense>(`/expenses/${id}`, data);
  return response.data;
}

export async function deleteExpense(id: string): Promise<void> {
  await expenseApi.delete(`/expenses/${id}`);
}

export async function getBudgetSummary(tripId: string): Promise<BudgetSummary> {
  const response = await expenseApi.get<BudgetSummary>(`/expenses/summary/${tripId}`);
  return response.data;
}
