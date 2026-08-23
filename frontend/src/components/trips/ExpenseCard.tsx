import { Link } from "react-router-dom";
import type { Expense } from "../../models/Expense";
import { EXPENSE_CATEGORY_LABELS } from "../../models/Expense";
import { formatDate, formatMoney } from "../../utils/format";

interface ExpenseCardProps {
  tripId: string;
  expense: Expense;
  onDelete: (id: string) => void;
}

export function ExpenseCard({ tripId, expense, onDelete }: ExpenseCardProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #eee",
        borderRadius: 6,
        padding: "0.6rem 0.75rem",
        marginBottom: "0.5rem",
      }}
    >
      <div>
        <strong>{expense.name}</strong>
        <span style={{ color: "#555" }}> · {EXPENSE_CATEGORY_LABELS[expense.category]} · {formatDate(expense.date)}</span>
        {expense.description && <p style={{ margin: "0.25rem 0", color: "#555" }}>{expense.description}</p>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <strong>{formatMoney(expense.amount)}</strong>
        <Link to={`/trips/${tripId}/expenses/${expense.id}/edit`}>Izmeni</Link>
        <button onClick={() => onDelete(expense.id)}>Obriši</button>
      </div>
    </div>
  );
}
