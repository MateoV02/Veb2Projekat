import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTripById } from "../services/tripService";
import { deleteExpense, getBudgetSummary, getExpenses } from "../services/expenseService";
import type { TripPlan } from "../models/Trip";
import type { BudgetSummary, Expense } from "../models/Expense";
import { BudgetSummaryPanel } from "../components/trips/BudgetSummaryPanel";
import { ExpenseCard } from "../components/trips/ExpenseCard";
import { getErrorMessage } from "../utils/errors";

export function ExpensesPage() {
  const { id } = useParams<{ id: string }>();

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
    } catch (err) {
      setError(getErrorMessage(err, "Greška prilikom brisanja troška."));
    }
  }

  if (isLoading) {
    return <p>Učitavanje...</p>;
  }

  if (error || !trip || !id) {
    return (
      <div>
        <p style={{ color: "#c62828" }}>{error ?? "Plan putovanja nije pronađen."}</p>
        <Link to="/trips">← Nazad na listu</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <Link to={`/trips/${id}`}>← Nazad na plan putovanja</Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
        <h1 style={{ margin: 0 }}>Troškovi — {trip.name}</h1>
        <Link to={`/trips/${id}/expenses/new`}>
          <button>+ Novi trošak</button>
        </Link>
      </div>

      {summary && <BudgetSummaryPanel summary={summary} />}

      {expenses.length === 0 ? (
        <p>Nema još nijednog troška za ovo putovanje.</p>
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
