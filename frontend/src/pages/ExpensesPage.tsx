import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTripById } from "../services/tripService";
import { deleteExpense, getBudgetSummary, getExpenses } from "../services/expenseService";
import type { TripPlan } from "../models/Trip";
import type { BudgetSummary, Expense } from "../models/Expense";
import { BudgetSummaryPanel } from "../components/trips/BudgetSummaryPanel";
import { ExpenseCard } from "../components/trips/ExpenseCard";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorAlert } from "../components/ui/Alert";
import { LoadingRow } from "../components/ui/Spinner";
import { getErrorMessage } from "../utils/errors";
import { useToast } from "../context/ToastContext";

export function ExpensesPage() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [trip, setTrip] = useState<TripPlan | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    loadData(id);
  }, [id]);

  function loadData(tripId: string) {
    setIsLoading(true);
    Promise.all([getTripById(tripId), getExpenses(tripId), getBudgetSummary(tripId)])
      .then(([tripResult, expensesResult, summaryResult]) => {
        setTrip(tripResult);
        setExpenses(expensesResult);
        setSummary(summaryResult);
      })
      .catch((err) => setError(getErrorMessage(err, "Plan putovanja nije pronađen.")))
      .finally(() => setIsLoading(false));
  }

  async function handleDelete(expenseId: string) {
    if (!id || !confirm("Da li sigurno želiš da obrišeš ovaj trošak?")) {
      return;
    }

    try {
      await deleteExpense(expenseId);
      const [expensesResult, summaryResult] = await Promise.all([getExpenses(id), getBudgetSummary(id)]);
      setExpenses(expensesResult);
      setSummary(summaryResult);
      showToast("Trošak je obrisan.", "success");
    } catch (err) {
      showToast(getErrorMessage(err, "Greška prilikom brisanja troška."), "error");
    }
  }

  if (isLoading) {
    return (
      <div className="page">
        <LoadingRow />
      </div>
    );
  }

  if (error || !trip || !id) {
    return (
      <div className="page">
        <ErrorAlert message={error ?? "Plan putovanja nije pronađen."} />
        <Link to="/trips">← Nazad na listu</Link>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <Link to={`/trips/${id}`}>← Nazad na plan putovanja</Link>

      <div className="page-header" style={{ marginTop: 12 }}>
        <h1 style={{ margin: 0 }}>Troškovi — {trip.name}</h1>
        <Link to={`/trips/${id}/expenses/new`} className="btn btn-primary">
          + Novi trošak
        </Link>
      </div>

      <div style={{ marginTop: 20 }}>
        {summary && <BudgetSummaryPanel summary={summary} />}
      </div>

      {expenses.length === 0 ? (
        <EmptyState title="Nema još nijednog troška" description="Dodaj prvi trošak za ovo putovanje." />
      ) : (
        <div>
          {expenses.map((expense) => (
            <ExpenseCard key={expense.id} tripId={id} expense={expense} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
