import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createDestination, getDestinationById, updateDestination } from "../services/destinationService";
import type { DestinationRequest } from "../models/Destination";
import { getErrorMessage } from "../utils/errors";
import { toDateInputValue } from "../utils/format";

const EMPTY_FORM: DestinationRequest = {
  name: "",
  location: "",
  arrivalDate: "",
  departureDate: "",
  notes: "",
};

export function DestinationFormPage() {
  const { tripId, destinationId } = useParams<{ tripId: string; destinationId: string }>();
  const isEditMode = Boolean(destinationId);
  const navigate = useNavigate();

  const [form, setForm] = useState<DestinationRequest>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId || !destinationId) {
      return;
    }

    getDestinationById(tripId, destinationId)
      .then((destination) =>
        setForm({
          name: destination.name,
          location: destination.location,
          arrivalDate: toDateInputValue(destination.arrivalDate),
          departureDate: toDateInputValue(destination.departureDate),
          notes: destination.notes ?? "",
        })
      )
      .catch((err) => setError(getErrorMessage(err, "Destinacija nije pronađena.")))
      .finally(() => setIsLoading(false));
  }, [tripId, destinationId]);

  function updateField<K extends keyof DestinationRequest>(field: K, value: DestinationRequest[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!tripId) {
      return;
    }

    if (new Date(form.departureDate) < new Date(form.arrivalDate)) {
      setError("Datum odlaska ne može biti prije datuma dolaska.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && destinationId) {
        await updateDestination(tripId, destinationId, form);
      } else {
        await createDestination(tripId, form);
      }
      navigate(`/trips/${tripId}`);
    } catch (err) {
      setError(getErrorMessage(err, "Greška prilikom čuvanja destinacije."));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <p>Učitavanje...</p>;
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h1>{isEditMode ? "Izmena destinacije" : "Nova destinacija"}</h1>

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
          <label htmlFor="location">Lokacija</label>
          <input
            id="location"
            type="text"
            required
            maxLength={200}
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="arrivalDate">Datum dolaska</label>
            <input
              id="arrivalDate"
              type="date"
              required
              value={form.arrivalDate}
              onChange={(e) => updateField("arrivalDate", e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="departureDate">Datum odlaska</label>
            <input
              id="departureDate"
              type="date"
              required
              value={form.departureDate}
              onChange={(e) => updateField("departureDate", e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="notes">Napomena</label>
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
