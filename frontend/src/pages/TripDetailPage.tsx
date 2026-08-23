import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteTrip, getTripById } from "../services/tripService";
import { deleteDestination, getDestinations } from "../services/destinationService";
import {
  createChecklistItem,
  deleteChecklistItem,
  getChecklistItems,
  updateChecklistItem,
} from "../services/checklistService";
import type { TripPlan } from "../models/Trip";
import type { Destination } from "../models/Destination";
import type { ChecklistItem } from "../models/Checklist";
import { DestinationCard } from "../components/trips/DestinationCard";
import { ChecklistSection } from "../components/trips/ChecklistSection";
import { SharePanel } from "../components/trips/SharePanel";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorAlert } from "../components/ui/Alert";
import { LoadingRow } from "../components/ui/Spinner";
import { getErrorMessage } from "../utils/errors";
import { formatDate, formatMoney } from "../utils/format";
import { useToast } from "../context/ToastContext";

export function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [trip, setTrip] = useState<TripPlan | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    Promise.all([getTripById(id), getDestinations(id), getChecklistItems(id)])
      .then(([tripResult, destinationsResult, checklistResult]) => {
        setTrip(tripResult);
        setDestinations(destinationsResult);
        setChecklistItems(checklistResult);
      })
      .catch((err) => setError(getErrorMessage(err, "Plan putovanja nije pronađen.")))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleAddChecklistItem(text: string) {
    if (!id) {
      return;
    }

    try {
      const created = await createChecklistItem(id, { text, isCompleted: false });
      setChecklistItems((prev) => [...prev, created]);
    } catch (err) {
      showToast(getErrorMessage(err, "Greška prilikom dodavanja stavke."), "error");
    }
  }

  async function handleToggleChecklistItem(item: ChecklistItem) {
    if (!id) {
      return;
    }

    try {
      const updated = await updateChecklistItem(id, item.id, {
        text: item.text,
        isCompleted: !item.isCompleted,
      });
      setChecklistItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    } catch (err) {
      showToast(getErrorMessage(err, "Greška prilikom izmene stavke."), "error");
    }
  }

  async function handleDeleteChecklistItem(itemId: string) {
    if (!id) {
      return;
    }

    try {
      await deleteChecklistItem(id, itemId);
      setChecklistItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      showToast(getErrorMessage(err, "Greška prilikom brisanja stavke."), "error");
    }
  }

  async function handleDeleteTrip() {
    if (!id || !confirm("Da li sigurno želiš da obrišeš ovaj plan putovanja?")) {
      return;
    }

    try {
      await deleteTrip(id);
      showToast("Plan putovanja je obrisan.", "success");
      navigate("/trips");
    } catch (err) {
      showToast(getErrorMessage(err, "Greška prilikom brisanja plana."), "error");
    }
  }

  async function handleDeleteDestination(destinationId: string) {
    if (!id || !confirm("Da li sigurno želiš da obrišeš ovu destinaciju?")) {
      return;
    }

    try {
      await deleteDestination(id, destinationId);
      setDestinations((prev) => prev.filter((d) => d.id !== destinationId));
      showToast("Destinacija je obrisana.", "success");
    } catch (err) {
      showToast(getErrorMessage(err, "Greška prilikom brisanja destinacije."), "error");
    }
  }

  if (isLoading) {
    return (
      <div className="page">
        <LoadingRow />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="page">
        <ErrorAlert message={error ?? "Plan putovanja nije pronađen."} />
        <Link to="/trips">← Nazad na listu</Link>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <Link to="/trips">← Nazad na listu</Link>

      <div className="page-header" style={{ marginTop: 12 }}>
        <h1 style={{ margin: 0 }}>{trip.name}</h1>
        <div className="actions-row">
          <Link to={`/trips/${trip.id}/activities`} className="btn btn-secondary">
            📅 Aktivnosti
          </Link>
          <Link to={`/trips/${trip.id}/expenses`} className="btn btn-secondary">
            💰 Troškovi
          </Link>
          <Link to={`/trips/${trip.id}/edit`} className="btn btn-secondary">
            Izmeni
          </Link>
          <button className="btn btn-danger" onClick={handleDeleteTrip}>
            Obriši
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <SharePanel tripId={trip.id} />
      </div>

      {trip.description && <p style={{ marginTop: 16, fontSize: 15 }}>{trip.description}</p>}

      <div className="card" style={{ marginTop: 16, display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 12.5, color: "var(--color-text-faint)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>
            Period
          </div>
          <div style={{ fontSize: 15, marginTop: 4 }}>
            {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12.5, color: "var(--color-text-faint)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>
            Planirani budžet
          </div>
          <div style={{ fontSize: 15, marginTop: 4 }}>{formatMoney(trip.budget)}</div>
        </div>

        {trip.notes && (
          <div style={{ flexBasis: "100%" }}>
            <div style={{ fontSize: 12.5, color: "var(--color-text-faint)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>
              Napomene
            </div>
            <div style={{ fontSize: 14.5, marginTop: 4 }}>{trip.notes}</div>
          </div>
        )}
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Destinacije</h2>
          <Link to={`/trips/${trip.id}/destinations/new`} className="btn btn-primary btn-sm">
            + Nova destinacija
          </Link>
        </div>

        {destinations.length === 0 ? (
          <EmptyState title="Nema još nijedne destinacije" description="Dodaj prvu destinaciju za ovo putovanje." />
        ) : (
          <div>
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

      <ChecklistSection
        items={checklistItems}
        onAdd={handleAddChecklistItem}
        onToggle={handleToggleChecklistItem}
        onDelete={handleDeleteChecklistItem}
      />
    </div>
  );
}
