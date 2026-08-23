export type ExpenseCategory =
  | "Transport"
  | "Accommodation"
  | "Food"
  | "Tickets"
  | "Shopping"
  | "Other";

export interface Expense {
  id: string;
  tripPlanId: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
  createdAt: string;
}

export interface ExpenseRequest {
  tripPlanId: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
}

export interface BudgetSummary {
  tripPlanId: string;
  plannedBudget: number;
  totalSpent: number;
  remainingBudget: number;
}

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  Transport: "Prevoz",
  Accommodation: "Smeštaj",
  Food: "Hrana",
  Tickets: "Ulaznice",
  Shopping: "Kupovina",
  Other: "Ostalo",
};
