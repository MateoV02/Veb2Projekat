import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTripById } from "../services/tripService";
import { deleteActivity, getActivities } from "../services/activityService";
import type { TripPlan } from "../models/Trip";
import type { Activity } from "../models/Activity";
import { ActivityCalendar } from "../components/trips/ActivityCalendar";
import { ActivityCard } from "../components/trips/ActivityCard";
import { getErrorMessage } from "../utils/errors";

export function ActivitiesPage() {
  const { id } = useParams<{ id: string }>();

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
    } catch (err) {
      setError(getErrorMessage(err, "Greška prilikom brisanja aktivnosti."));
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

  const visibleActivities = selectedDate
    ? activities.filter((a) => a.dateTime.slice(0, 10) === selectedDate)
    : activities;

  return (
    <div style={{ maxWidth: 700 }}>
      <Link to={`/trips/${id}`}>← Nazad na plan putovanja</Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
        <h1 style={{ margin: 0 }}>Aktivnosti — {trip.name}</h1>
        <Link to={`/trips/${id}/activities/new`}>
          <button>+ Nova aktivnost</button>
        </Link>
      </div>

      <ActivityCalendar
        activities={activities}
        monthDate={monthDate}
        selectedDate={selectedDate}
        onSelectDate={(date) => setSelectedDate(date === selectedDate ? null : date)}
        onMonthChange={handleMonthChange}
      />

      <div style={{ marginTop: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>{selectedDate ? `Aktivnosti — ${selectedDate}` : "Sve aktivnosti"}</h2>
          {selectedDate && <button onClick={() => setSelectedDate(null)}>Prikaži sve</button>}
        </div>

        {visibleActivities.length === 0 ? (
          <p>Nema aktivnosti {selectedDate ? "za ovaj dan" : "za ovo putovanje"}.</p>
        ) : (
          <div style={{ marginTop: "1rem" }}>
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
