import { Link } from "react-router-dom";
import type { Expense } from "../../models/Expense";
import { EXPENSE_CATEGORY_LABELS } from "../../models/Expense";
import { formatDate, formatMoney } from "../../utils/format";

export function ExpenseCard({
  tripId,
  expense,
  onDelete,
}: {
  tripId: string;
  expense: Expense;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="list-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14.5 }}>{expense.name}</div>
        <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 3 }}>
          <span className="badge badge-neutral" style={{ marginRight: 6 }}>
            {EXPENSE_CATEGORY_LABELS[expense.category]}
          </span>
          {formatDate(expense.date)}
        </div>
        {expense.description && <p style={{ margin: "6px 0 0", fontSize: 13.5 }}>{expense.description}</p>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <strong style={{ fontSize: 15 }}>{formatMoney(expense.amount)}</strong>
        <Link to={`/trips/${tripId}/expenses/${expense.id}/edit`} className="btn btn-secondary btn-sm">
          Izmeni
        </Link>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(expense.id)}>
          Obriši
        </button>
      </div>
    </div>
  );
}
