import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTrip, getTripById, updateTrip } from "../services/tripService";
import type { TripPlanRequest } from "../models/Trip";
import { getErrorMessage } from "../utils/errors";
import { toDateInputValue } from "../utils/format";

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
      } else {
        await createTrip(form);
      }
      navigate("/trips");
    } catch (err) {
      setError(getErrorMessage(err, "Greška prilikom čuvanja plana putovanja."));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <p>Učitavanje...</p>;
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h1>{isEditMode ? "Izmena plana putovanja" : "Novi plan putovanja"}</h1>

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
          <label htmlFor="description">Opis</label>
          <textarea
            id="description"
            maxLength={1000}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="startDate">Početni datum</label>
            <input
              id="startDate"
              type="date"
              required
              value={form.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="endDate">Krajnji datum</label>
            <input
              id="endDate"
              type="date"
              required
              value={form.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="budget">Planirani budžet</label>
          <input
            id="budget"
            type="number"
            min={0}
            step="0.01"
            required
            value={form.budget}
            onChange={(e) => updateField("budget", Number(e.target.value))}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="notes">Napomene</label>
          <textarea
            id="notes"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
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
