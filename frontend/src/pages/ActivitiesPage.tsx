import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTripById } from "../services/tripService";
import { deleteActivity, getActivities } from "../services/activityService";
import type { TripPlan } from "../models/Trip";
import type { Activity } from "../models/Activity";
import { ActivityCalendar } from "../components/trips/ActivityCalendar";
import { ActivityCard } from "../components/trips/ActivityCard";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorAlert } from "../components/ui/Alert";
import { LoadingRow } from "../components/ui/Spinner";
import { getErrorMessage } from "../utils/errors";
import { useToast } from "../context/ToastContext";

export function ActivitiesPage() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [trip, setTrip] = useState<TripPlan | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [monthDate, setMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    Promise.all([getTripById(id), getActivities(id)])
      .then(([tripResult, activitiesResult]) => {
        setTrip(tripResult);
        setActivities(activitiesResult);
        setMonthDate(new Date(tripResult.startDate));
      })
      .catch((err) => setError(getErrorMessage(err, "Plan putovanja nije pronađen.")))
      .finally(() => setIsLoading(false));
  }, [id]);

  function handleMonthChange(delta: number) {
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  async function handleDeleteActivity(activityId: string) {
    if (!id || !confirm("Da li sigurno želiš da obrišeš ovu aktivnost?")) {
      return;
    }

    try {
      await deleteActivity(id, activityId);
      setActivities((prev) => prev.filter((a) => a.id !== activityId));
      showToast("Aktivnost je obrisana.", "success");
    } catch (err) {
      showToast(getErrorMessage(err, "Greška prilikom brisanja aktivnosti."), "error");
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

  const visibleActivities = selectedDate
    ? activities.filter((a) => a.dateTime.slice(0, 10) === selectedDate)
    : activities;

  return (
    <div className="page fade-in">
      <Link to={`/trips/${id}`}>← Nazad na plan putovanja</Link>

      <div className="page-header" style={{ marginTop: 12 }}>
        <h1 style={{ margin: 0 }}>Aktivnosti — {trip.name}</h1>
        <Link to={`/trips/${id}/activities/new`} className="btn btn-primary">
          + Nova aktivnost
        </Link>
      </div>

      <div style={{ marginTop: 20 }}>
        <ActivityCalendar
          activities={activities}
          monthDate={monthDate}
          selectedDate={selectedDate}
          onSelectDate={(date) => setSelectedDate(date === selectedDate ? null : date)}
          onMonthChange={handleMonthChange}
        />
      </div>

      <div className="section">
        <div className="section-header">
          <h2>{selectedDate ? `Aktivnosti — ${selectedDate}` : "Sve aktivnosti"}</h2>
          {selectedDate && (
            <button className="btn btn-ghost btn-sm" onClick={() => setSelectedDate(null)}>
              Prikaži sve
            </button>
          )}
        </div>

        {visibleActivities.length === 0 ? (
          <EmptyState
            title={selectedDate ? "Nema aktivnosti za ovaj dan" : "Nema još nijedne aktivnosti"}
            description="Dodaj novu aktivnost dugmetom iznad."
          />
        ) : (
          <div>
            {visibleActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                tripId={id}
                activity={activity}
                onDelete={handleDeleteActivity}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
