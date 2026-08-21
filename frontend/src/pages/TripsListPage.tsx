import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TripCard } from "../components/trips/TripCard";
import { deleteTrip, getTrips } from "../services/tripService";
import type { TripPlan } from "../models/Trip";
import { getErrorMessage } from "../utils/errors";

export function TripsListPage() {
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
    } catch (err) {
      setError(getErrorMessage(err, "Greška prilikom brisanja plana."));
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Moji planovi putovanja</h1>
        <Link to="/trips/new">
          <button>+ Novi plan</button>
        </Link>
      </div>

      {error && <p style={{ color: "#c62828" }}>{error}</p>}

      {isLoading ? (
        <p>Učitavanje...</p>
      ) : trips.length === 0 ? (
        <p>Nemaš još nijedan plan putovanja. Klikni "+ Novi plan" da kreiraš prvi.</p>
      ) : (
        <div>
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
