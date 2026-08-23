import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createTrip, getTripById, updateTrip } from "../services/tripService";
import type { TripPlanRequest } from "../models/Trip";
import { getErrorMessage } from "../utils/errors";
import { toDateInputValue } from "../utils/format";
import { useToast } from "../context/ToastContext";
import { ErrorAlert } from "../components/ui/Alert";
import { Spinner, LoadingRow } from "../components/ui/Spinner";

const EMPTY_FORM: TripPlanRequest = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  budget: 0,
  notes: "",
};

export function TripFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState<TripPlanRequest>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    getTripById(id)
      .then((trip) =>
        setForm({
          name: trip.name,
          description: trip.description ?? "",
          startDate: toDateInputValue(trip.startDate),
          endDate: toDateInputValue(trip.endDate),
          budget: trip.budget,
          notes: trip.notes ?? "",
        })
      )
      .catch((err) => setError(getErrorMessage(err, "Plan putovanja nije pronađen.")))
      .finally(() => setIsLoading(false));
  }, [id]);

  function updateField<K extends keyof TripPlanRequest>(field: K, value: TripPlanRequest[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError("Krajnji datum ne može biti prije početnog datuma.");
      return;
    }

    if (form.budget < 0) {
      setError("Budžet ne može biti negativan.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await updateTrip(id, form);
        showToast("Plan putovanja je sačuvan.", "success");
      } else {
        await createTrip(form);
        showToast("Plan putovanja je kreiran.", "success");
      }
      navigate("/trips");
    } catch (err) {
      setError(getErrorMessage(err, "Greška prilikom čuvanja plana putovanja."));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="page page--narrow">
        <LoadingRow />
      </div>
    );
  }

  return (
    <div className="page page--narrow fade-in">
      <Link to="/trips">← Nazad na listu</Link>
      <h1 style={{ marginTop: 12 }}>{isEditMode ? "Izmena plana putovanja" : "Novi plan putovanja"}</h1>

      <form onSubmit={handleSubmit} className="card">
        <div className="field">
          <label htmlFor="name">Naziv</label>
          <input
            id="name"
            type="text"
            className="input"
            required
            maxLength={150}
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="description">Opis</label>
          <textarea
            id="description"
            className="textarea"
            maxLength={1000}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="startDate">Početni datum</label>
            <input
              id="startDate"
              type="date"
              className="input"
              required
              value={form.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="endDate">Krajnji datum</label>
            <input
              id="endDate"
              type="date"
              className="input"
              required
              value={form.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="budget">Planirani budžet</label>
          <input
            id="budget"
            type="number"
            className="input"
            min={0}
            step="0.01"
            required
            value={form.budget}
            onChange={(e) => updateField("budget", Number(e.target.value))}
          />
        </div>

        <div className="field">
          <label htmlFor="notes">Napomene</label>
          <textarea
            id="notes"
            className="textarea"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
          />
        </div>

        {error && <ErrorAlert message={error} />}

        <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : null}
          {isSubmitting ? "Čuvanje..." : "Sačuvaj"}
        </button>
      </form>
    </div>
  );
}
