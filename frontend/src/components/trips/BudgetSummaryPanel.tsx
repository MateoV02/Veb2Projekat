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
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--color-text-faint)", fontWeight: 600, textTransform: "uppercase" }}>
            Planirani budžet
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>{formatMoney(summary.plannedBudget)}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "var(--color-text-faint)", fontWeight: 600, textTransform: "uppercase" }}>
            Potrošeno
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>{formatMoney(summary.totalSpent)}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "var(--color-text-faint)", fontWeight: 600, textTransform: "uppercase" }}>
            Preostalo
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
              marginTop: 2,
              color: isOverBudget ? "var(--color-danger)" : "var(--color-success)",
            }}
          >
            {formatMoney(summary.remainingBudget)}
          </div>
        </div>
      </div>

      <div style={{ height: 10, background: "var(--color-bg)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${spentRatio * 100}%`,
            background: isOverBudget ? "var(--color-danger)" : "var(--color-primary)",
            transition: "width var(--transition)",
          }}
        />
      </div>

      {isOverBudget && (
        <div className="alert alert-error" style={{ marginTop: 12, marginBottom: 0 }}>
          Prekoračen je planirani budžet!
        </div>
      )}
    </div>
  );
}
