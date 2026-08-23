import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createDestination, getDestinationById, updateDestination } from "../services/destinationService";
import type { DestinationRequest } from "../models/Destination";
import { getErrorMessage } from "../utils/errors";
import { toDateInputValue } from "../utils/format";
import { useToast } from "../context/ToastContext";
import { ErrorAlert } from "../components/ui/Alert";
import { Spinner, LoadingRow } from "../components/ui/Spinner";

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
  const { showToast } = useToast();

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
        showToast("Destinacija je sačuvana.", "success");
      } else {
        await createDestination(tripId, form);
        showToast("Destinacija je dodata.", "success");
      }
      navigate(`/trips/${tripId}`);
    } catch (err) {
      setError(getErrorMessage(err, "Greška prilikom čuvanja destinacije."));
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
      <Link to={tripId ? `/trips/${tripId}` : "/trips"}>← Nazad na plan putovanja</Link>
      <h1 style={{ marginTop: 12 }}>{isEditMode ? "Izmena destinacije" : "Nova destinacija"}</h1>

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
          <label htmlFor="location">Lokacija</label>
          <input
            id="location"
            type="text"
            className="input"
            required
            maxLength={200}
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="arrivalDate">Datum dolaska</label>
            <input
              id="arrivalDate"
              type="date"
              className="input"
              required
              value={form.arrivalDate}
              onChange={(e) => updateField("arrivalDate", e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="departureDate">Datum odlaska</label>
            <input
              id="departureDate"
              type="date"
              className="input"
              required
              value={form.departureDate}
              onChange={(e) => updateField("departureDate", e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="notes">Napomena</label>
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
