import { useEffect, useState } from "react";
import type { AccessType, ShareLink } from "../../models/Sharing";
import { ACCESS_TYPE_LABELS } from "../../models/Sharing";
import { createShareLink, getShareLinks, revokeShareLink } from "../../services/sharingService";
import { getErrorMessage } from "../../utils/errors";

interface SharePanelProps {
  tripId: string;
}

export function SharePanel({ tripId }: SharePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [links, setLinks] = useState<ShareLink[]>([]);
  const [accessType, setAccessType] = useState<AccessType>("View");
  const [newLink, setNewLink] = useState<ShareLink | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getShareLinks(tripId).then(setLinks).catch(() => {});
    }
  }, [isOpen, tripId]);

  async function handleCreate() {
    setError(null);
    setIsCreating(true);
    try {
      const link = await createShareLink(tripId, accessType);
      setNewLink(link);
      setLinks((prev) => [...prev, link]);
    } catch (err) {
      setError(getErrorMessage(err, "Greška prilikom kreiranja linka za deljenje."));
    } finally {
      setIsCreating(false);
    }
  }

  async function handleRevoke(token: string) {
    try {
      await revokeShareLink(token);
      setLinks((prev) => prev.filter((l) => l.token !== token));
      if (newLink?.token === token) {
        setNewLink(null);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Greška prilikom brisanja linka."));
    }
  }

  if (!isOpen) {
    return <button onClick={() => setIsOpen(true)}>Podeli plan</button>;
  }

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: "1rem", marginTop: "1rem", maxWidth: 480 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Deljenje plana</h3>
        <button onClick={() => setIsOpen(false)}>Zatvori</button>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <select value={accessType} onChange={(e) => setAccessType(e.target.value as AccessType)}>
          <option value="View">{ACCESS_TYPE_LABELS.View}</option>
          <option value="Edit">{ACCESS_TYPE_LABELS.Edit}</option>
        </select>
        <button onClick={handleCreate} disabled={isCreating}>
          {isCreating ? "Kreiranje..." : "Generiši link"}
        </button>
      </div>

      {error && <p style={{ color: "#c62828" }}>{error}</p>}

      {newLink && (
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <img
            src={`data:image/png;base64,${newLink.qrCodeBase64}`}
            alt="QR kod za deljenje"
            style={{ width: 160, height: 160 }}
          />
          <p style={{ wordBreak: "break-all", fontSize: "0.85rem" }}>{newLink.shareUrl}</p>
        </div>
      )}

      {links.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Aktivni linkovi:</strong>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {links.map((link) => (
              <li
                key={link.token}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.25rem 0" }}
              >
                <span>{ACCESS_TYPE_LABELS[link.accessType]}</span>
                <button onClick={() => handleRevoke(link.token)}>Opozovi</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
