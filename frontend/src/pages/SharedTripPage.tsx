import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import { getSharedTrip, updateSharedTrip, validateShareToken } from "../services/sharingService";
import type { TripPlan, TripPlanRequest } from "../models/Trip";
import { getErrorMessage } from "../utils/errors";
import { formatDate, formatMoney, toDateInputValue } from "../utils/format";

export function SharedTripPage() {
  const { token } = useParams<{ token: string }>();

  const [trip, setTrip] = useState<TripPlan | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<TripPlanRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    validateShareToken(token)
      .then((validation) => {
        setCanEdit(validation.accessType === "Edit");
        return getSharedTrip(validation.tripPlanId, token);
      })
      .then(setTrip)
      .catch(() => setError("Link nije validan ili je istekao."))
      .finally(() => setIsLoading(false));
  }, [token]);

  function startEditing() {
    if (!trip) {
      return;
    }
    setForm({
      name: trip.name,
      description: trip.description ?? "",
      startDate: toDateInputValue(trip.startDate),
      endDate: toDateInputValue(trip.endDate),
      budget: trip.budget,
      notes: trip.notes ?? "",
    });
    setIsEditing(true);
  }

  function updateField<K extends keyof TripPlanRequest>(field: K, value: TripPlanRequest[K]) {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token || !trip || !form) {
      return;
    }

    setError(null);
    setIsSaving(true);
    try {
      const updated = await updateSharedTrip(trip.id, token, form);
      setTrip(updated);
      setIsEditing(false);
    } catch (err) {
      setError(getErrorMessage(err, "Greška prilikom čuvanja izmena."));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p style={{ padding: "2rem" }}>Učitavanje...</p>;
  }

  if (error || !trip) {
    return <p style={{ padding: "2rem", color: "#c62828" }}>{error ?? "Plan putovanja nije pronađen."}</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif", padding: "0 1rem" }}>
      <p style={{ color: "#666" }}>
        Deljen plan putovanja — {canEdit ? "imaš dozvolu za izmenu" : "samo za pregled"}
      </p>

      {!isEditing ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <h1 style={{ margin: 0 }}>{trip.name}</h1>
            {canEdit && <button onClick={startEditing}>Izmeni</button>}
          </div>

          <p>{trip.description}</p>

          <dl>
            <dt>
              <strong>Period</strong>
            </dt>
            <dd>
              {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
            </dd>

            <dt>
              <strong>Planirani budžet</strong>
            </dt>
            <dd>{formatMoney(trip.budget)}</dd>

            {trip.notes && (
              <>
                <dt>
                  <strong>Napomene</strong>
                </dt>
                <dd>{trip.notes}</dd>
              </>
            )}
          </dl>
        </>
      ) : (
        form && (
          <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
            <h1>Izmena plana putovanja</h1>

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

            <button type="submit" disabled={isSaving}>
              {isSaving ? "Čuvanje..." : "Sačuvaj"}
            </button>
            <button type="button" onClick={() => setIsEditing(false)} style={{ marginLeft: "0.5rem" }}>
              Otkaži
            </button>
          </form>
        )
      )}
    </div>
  );
}
