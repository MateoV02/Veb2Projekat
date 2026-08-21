import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteTrip, getTripById } from "../services/tripService";
import { deleteDestination, getDestinations } from "../services/destinationService";
import type { TripPlan } from "../models/Trip";
import type { Destination } from "../models/Destination";
import { DestinationCard } from "../components/trips/DestinationCard";
import { getErrorMessage } from "../utils/errors";
import { formatDate, formatMoney } from "../utils/format";

export function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<TripPlan | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    Promise.all([getTripById(id), getDestinations(id)])
      .then(([tripResult, destinationsResult]) => {
        setTrip(tripResult);
        setDestinations(destinationsResult);
      })
      .catch((err) => setError(getErrorMessage(err, "Plan putovanja nije pronađen.")))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleDeleteTrip() {
    if (!id || !confirm("Da li sigurno želiš da obrišeš ovaj plan putovanja?")) {
      return;
    }

    try {
      await deleteTrip(id);
      navigate("/trips");
    } catch (err) {
      setError(getErrorMessage(err, "Greška prilikom brisanja plana."));
    }
  }

  async function handleDeleteDestination(destinationId: string) {
    if (!id || !confirm("Da li sigurno želiš da obrišeš ovu destinaciju?")) {
      return;
    }

    try {
      await deleteDestination(id, destinationId);
      setDestinations((prev) => prev.filter((d) => d.id !== destinationId));
    } catch (err) {
      setError(getErrorMessage(err, "Greška prilikom brisanja destinacije."));
    }
  }

  if (isLoading) {
    return <p>Učitavanje...</p>;
  }

  if (error || !trip) {
    return (
      <div>
        <p style={{ color: "#c62828" }}>{error ?? "Plan putovanja nije pronađen."}</p>
        <Link to="/trips">← Nazad na listu</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <Link to="/trips">← Nazad na listu</Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginTop: "1rem" }}>
        <h1 style={{ margin: 0 }}>{trip.name}</h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link to={`/trips/${trip.id}/edit`}>
            <button>Izmeni</button>
          </Link>
          <button onClick={handleDeleteTrip}>Obriši</button>
        </div>
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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
        <h2 style={{ margin: 0 }}>Destinacije</h2>
        <Link to={`/trips/${trip.id}/destinations/new`}>
          <button>+ Nova destinacija</button>
        </Link>
      </div>

      {destinations.length === 0 ? (
        <p>Nema još nijedne destinacije za ovo putovanje.</p>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              tripId={trip.id}
              destination={destination}
              onDelete={handleDeleteDestination}
            />
          ))}
        </div>
      )}
    </div>
  );
}
