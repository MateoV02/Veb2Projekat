import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TripCard } from "../components/trips/TripCard";
import { EmptyState } from "../components/ui/EmptyState";
import { ListSkeleton } from "../components/ui/Skeleton";
import { ErrorAlert } from "../components/ui/Alert";
import { deleteTrip, getTrips } from "../services/tripService";
import type { TripPlan } from "../models/Trip";
import { getErrorMessage } from "../utils/errors";
import { useToast } from "../context/ToastContext";

export function TripsListPage() {
  const { showToast } = useToast();
  const [trips, setTrips] = useState<TripPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrips();
  }, []);

  function loadTrips() {
    setIsLoading(true);
    getTrips()
      .then(setTrips)
      .catch((err) => setError(getErrorMessage(err, "Greška prilikom učitavanja planova.")))
      .finally(() => setIsLoading(false));
  }

  async function handleDelete(id: string) {
    if (!confirm("Da li sigurno želiš da obrišeš ovaj plan putovanja?")) {
      return;
    }

    try {
      await deleteTrip(id);
      setTrips((prev) => prev.filter((trip) => trip.id !== id));
      showToast("Plan putovanja je obrisan.", "success");
    } catch (err) {
      showToast(getErrorMessage(err, "Greška prilikom brisanja plana."), "error");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Moji planovi putovanja</h1>
        <Link to="/trips/new" className="btn btn-primary">
          + Novi plan
        </Link>
      </div>

      {error && <ErrorAlert message={error} />}

      {isLoading ? (
        <ListSkeleton count={3} />
      ) : trips.length === 0 ? (
        <EmptyState
          title="Nemaš još nijedan plan putovanja"
          description='Klikni na dugme "+ Novi plan" da kreiraš svoj prvi plan putovanja.'
          action={
            <Link to="/trips/new" className="btn btn-primary">
              + Novi plan
            </Link>
          }
        />
      ) : (
        <div className="fade-in">
          <p style={{ fontSize: 13.5, color: "var(--color-text-muted)", marginTop: -8, marginBottom: 16 }}>
            Klikni na naziv putovanja da otvoriš detalje, izmeniš plan ili pristupiš dodatnim opcijama (aktivnosti, troškovi, deljenje).
          </p>
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
