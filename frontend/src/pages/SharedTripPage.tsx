import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import { getSharedTrip, updateSharedTrip, validateShareToken } from "../services/sharingService";
import type { TripPlan, TripPlanRequest } from "../models/Trip";
import { getErrorMessage } from "../utils/errors";
import { formatDate, formatMoney, toDateInputValue } from "../utils/format";
import { useToast } from "../context/ToastContext";
import { ErrorAlert } from "../components/ui/Alert";
import { Spinner, LoadingRow } from "../components/ui/Spinner";
import { Badge } from "../components/ui/Badge";

export function SharedTripPage() {
  const { token } = useParams<{ token: string }>();
  const { showToast } = useToast();

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
      showToast("Izmene su sačuvane.", "success");
    } catch (err) {
      setError(getErrorMessage(err, "Greška prilikom čuvanja izmena."));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="page page--narrow" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <LoadingRow />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="page page--narrow" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <ErrorAlert message={error ?? "Plan putovanja nije pronađen."} />
      </div>
    );
  }

  return (
    <div className="page page--narrow fade-in" style={{ minHeight: "100vh" }}>
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <Badge tone={canEdit ? "warning" : "primary"} dot>
          Deljen plan — {canEdit ? "dozvoljena izmena" : "samo za pregled"}
        </Badge>
      </div>

      <div className="card">
        {!isEditing ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <h1 style={{ margin: 0 }}>{trip.name}</h1>
              {canEdit && (
                <button className="btn btn-secondary btn-sm" onClick={startEditing}>
                  Izmeni
                </button>
              )}
            </div>

            {trip.description && <p style={{ marginTop: 10 }}>{trip.description}</p>}

            <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginTop: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--color-text-faint)", fontWeight: 600, textTransform: "uppercase" }}>
                  Period
                </div>
                <div style={{ fontSize: 14.5, marginTop: 4 }}>
                  {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "var(--color-text-faint)", fontWeight: 600, textTransform: "uppercase" }}>
                  Planirani budžet
                </div>
                <div style={{ fontSize: 14.5, marginTop: 4 }}>{formatMoney(trip.budget)}</div>
              </div>
              {trip.notes && (
                <div style={{ flexBasis: "100%" }}>
                  <div style={{ fontSize: 12, color: "var(--color-text-faint)", fontWeight: 600, textTransform: "uppercase" }}>
                    Napomene
                  </div>
                  <div style={{ fontSize: 14, marginTop: 4 }}>{trip.notes}</div>
                </div>
              )}
            </div>
          </>
        ) : (
          form && (
            <form onSubmit={handleSubmit}>
              <h1>Izmena plana putovanja</h1>

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

              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? <Spinner /> : null}
                  {isSaving ? "Čuvanje..." : "Sačuvaj"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  Otkaži
                </button>
              </div>
            </form>
          )
        )}
      </div>
    </div>
  );
}
