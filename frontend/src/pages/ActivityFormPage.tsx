import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createActivity, getActivityById, updateActivity } from "../services/activityService";
import type { ActivityRequest, ActivityStatus } from "../models/Activity";
import { ACTIVITY_STATUS_LABELS } from "../models/Activity";
import { getErrorMessage } from "../utils/errors";
import { toDateTimeInputValue } from "../utils/format";
import { useToast } from "../context/ToastContext";
import { ErrorAlert } from "../components/ui/Alert";
import { Spinner, LoadingRow } from "../components/ui/Spinner";

const EMPTY_FORM: ActivityRequest = {
  name: "",
  dateTime: "",
  location: "",
  description: "",
  estimatedCost: 0,
  status: "Planned",
};

const STATUS_OPTIONS: ActivityStatus[] = ["Planned", "Reserved", "Completed", "Cancelled"];

export function ActivityFormPage() {
  const { tripId, activityId } = useParams<{ tripId: string; activityId: string }>();
  const isEditMode = Boolean(activityId);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState<ActivityRequest>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId || !activityId) {
      return;
    }

    getActivityById(tripId, activityId)
      .then((activity) =>
        setForm({
          name: activity.name,
          dateTime: toDateTimeInputValue(activity.dateTime),
          location: activity.location ?? "",
          description: activity.description ?? "",
          estimatedCost: activity.estimatedCost,
          status: activity.status,
        })
      )
      .catch((err) => setError(getErrorMessage(err, "Aktivnost nije pronađena.")))
      .finally(() => setIsLoading(false));
  }, [tripId, activityId]);

  function updateField<K extends keyof ActivityRequest>(field: K, value: ActivityRequest[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!tripId) {
      return;
    }

    if (form.estimatedCost < 0) {
      setError("Procijenjeni trošak ne može biti negativan.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && activityId) {
        await updateActivity(tripId, activityId, form);
        showToast("Aktivnost je sačuvana.", "success");
      } else {
        await createActivity(tripId, form);
        showToast("Aktivnost je dodata.", "success");
      }
      navigate(`/trips/${tripId}/activities`);
    } catch (err) {
      setError(getErrorMessage(err, "Greška prilikom čuvanja aktivnosti."));
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
      <Link to={tripId ? `/trips/${tripId}/activities` : "/trips"}>← Nazad na aktivnosti</Link>
      <h1 style={{ marginTop: 12 }}>{isEditMode ? "Izmena aktivnosti" : "Nova aktivnost"}</h1>

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
          <label htmlFor="dateTime">Datum i vreme</label>
          <input
            id="dateTime"
            type="datetime-local"
            className="input"
            required
            value={form.dateTime}
            onChange={(e) => updateField("dateTime", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="location">Lokacija</label>
          <input
            id="location"
            type="text"
            className="input"
            maxLength={200}
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
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

        <div className="field">
          <label htmlFor="estimatedCost">Procijenjeni trošak</label>
          <input
            id="estimatedCost"
            type="number"
            className="input"
            min={0}
            step="0.01"
            required
            value={form.estimatedCost}
            onChange={(e) => updateField("estimatedCost", Number(e.target.value))}
          />
        </div>

        <div className="field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            className="select"
            value={form.status}
            onChange={(e) => updateField("status", e.target.value as ActivityStatus)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {ACTIVITY_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
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
