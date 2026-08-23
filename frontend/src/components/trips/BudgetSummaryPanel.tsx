import type { BudgetSummary } from "../../models/Expense";
import { formatMoney } from "../../utils/format";

interface BudgetSummaryPanelProps {
  summary: BudgetSummary;
}

export function BudgetSummaryPanel({ summary }: BudgetSummaryPanelProps) {
  const spentRatio = summary.plannedBudget > 0
    ? Math.min(summary.totalSpent / summary.plannedBudget, 1)
    : 0;
  const isOverBudget = summary.remainingBudget < 0;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: "1rem", marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <span>Planirani budžet: <strong>{formatMoney(summary.plannedBudget)}</strong></span>
        <span>Potrošeno: <strong>{formatMoney(summary.totalSpent)}</strong></span>
        <span style={{ color: isOverBudget ? "#c62828" : "#2e7d32" }}>
          Preostalo: <strong>{formatMoney(summary.remainingBudget)}</strong>
        </span>
      </div>

      <div style={{ height: 10, background: "#eee", borderRadius: 5, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${spentRatio * 100}%`,
            background: isOverBudget ? "#c62828" : "#1a56db",
          }}
        />
      </div>

      {isOverBudget && (
        <p style={{ color: "#c62828", marginTop: "0.5rem" }}>
          Prekoračen je planirani budžet!
        </p>
      )}
    </div>
  );
}
