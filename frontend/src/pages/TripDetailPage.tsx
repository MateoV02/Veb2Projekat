import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteTrip, getTripById } from "../services/tripService";
import type { TripPlan } from "../models/Trip";
import { getErrorMessage } from "../utils/errors";
import { formatDate, formatMoney } from "../utils/format";

export function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    getTripById(id)
      .then(setTrip)
      .catch((err) => setError(getErrorMessage(err, "Plan putovanja nije pronađen.")))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleDelete() {
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
          <button onClick={handleDelete}>Obriši</button>
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
    </div>
  );
}
