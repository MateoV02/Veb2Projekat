import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createExpense, getExpenseById, updateExpense } from "../services/expenseService";
import type { ExpenseCategory, ExpenseRequest } from "../models/Expense";
import { EXPENSE_CATEGORY_LABELS } from "../models/Expense";
import { getErrorMessage } from "../utils/errors";
import { toDateInputValue } from "../utils/format";

const CATEGORY_OPTIONS: ExpenseCategory[] = [
  "Transport",
  "Accommodation",
  "Food",
  "Tickets",
  "Shopping",
  "Other",
];

export function ExpenseFormPage() {
  const { tripId, expenseId } = useParams<{ tripId: string; expenseId: string }>();
  const isEditMode = Boolean(expenseId);
  const navigate = useNavigate();

  const [form, setForm] = useState<ExpenseRequest>({
    tripPlanId: tripId ?? "",
    name: "",
    category: "Other",
    amount: 0,
    date: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!expenseId) {
      return;
    }

    getExpenseById(expenseId)
      .then((expense) =>
        setForm({
          tripPlanId: expense.tripPlanId,
          name: expense.name,
          category: expense.category,
          amount: expense.amount,
          date: toDateInputValue(expense.date),
          description: expense.description ?? "",
        })
      )
      .catch((err) => setError(getErrorMessage(err, "Trošak nije pronađen.")))
      .finally(() => setIsLoading(false));
  }, [expenseId]);

  function updateField<K extends keyof ExpenseRequest>(field: K, value: ExpenseRequest[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (form.amount <= 0) {
      setError("Iznos mora biti veći od nule.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && expenseId) {
        await updateExpense(expenseId, form);
      } else {
        await createExpense(form);
      }
      navigate(`/trips/${tripId}/expenses`);
    } catch (err) {
      setError(getErrorMessage(err, "Greška prilikom čuvanja troška."));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <p>Učitavanje...</p>;
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h1>{isEditMode ? "Izmena troška" : "Novi trošak"}</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name">Naziv</label>
          <input
            id="name"
            type="text"
            required
            maxLength={150}
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="category">Kategorija</label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value as ExpenseCategory)}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {EXPENSE_CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="amount">Iznos</label>
          <input
            id="amount"
            type="number"
            min={0.01}
            step="0.01"
            required
            value={form.amount}
            onChange={(e) => updateField("amount", Number(e.target.value))}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="date">Datum</label>
          <input
            id="date"
            type="date"
            required
            value={form.date}
            onChange={(e) => updateField("date", e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="description">Opis</label>
          <textarea
            id="description"
            maxLength={500}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        {error && <p style={{ color: "#c62828" }}>{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Čuvanje..." : "Sačuvaj"}
        </button>
      </form>
    </div>
  );
}
