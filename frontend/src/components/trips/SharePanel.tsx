import { useEffect, useState } from "react";
import type { AccessType, ShareLink } from "../../models/Sharing";
import { ACCESS_TYPE_LABELS } from "../../models/Sharing";
import { createShareLink, getShareLinks, revokeShareLink } from "../../services/sharingService";
import { getErrorMessage } from "../../utils/errors";
import { useToast } from "../../context/ToastContext";
import { ErrorAlert } from "../ui/Alert";
import { Spinner } from "../ui/Spinner";

interface SharePanelProps {
  tripId: string;
}

export function SharePanel({ tripId }: SharePanelProps) {
  const { showToast } = useToast();
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
      showToast("Link za deljenje je opozvan.", "success");
    } catch (err) {
      showToast(getErrorMessage(err, "Greška prilikom brisanja linka."), "error");
    }
  }

  if (!isOpen) {
    return (
      <button className="btn btn-secondary" onClick={() => setIsOpen(true)}>
        🔗 Podeli plan
      </button>
    );
  }

  return (
    <div className="card fade-in" style={{ marginTop: 16, maxWidth: 480 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Deljenje plana</h3>
        <button className="btn btn-ghost btn-sm" onClick={() => setIsOpen(false)}>
          Zatvori
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <select
          className="select"
          value={accessType}
          onChange={(e) => setAccessType(e.target.value as AccessType)}
        >
          <option value="View">{ACCESS_TYPE_LABELS.View}</option>
          <option value="Edit">{ACCESS_TYPE_LABELS.Edit}</option>
        </select>
        <button className="btn btn-primary" onClick={handleCreate} disabled={isCreating}>
          {isCreating ? <Spinner /> : null}
          {isCreating ? "Kreiranje..." : "Generiši link"}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 12 }}>
          <ErrorAlert message={error} />
        </div>
      )}

      {newLink && (
        <div style={{ marginTop: 16, textAlign: "center", padding: 16, background: "var(--color-bg)", borderRadius: "var(--radius-sm)" }}>
          <img
            src={`data:image/png;base64,${newLink.qrCodeBase64}`}
            alt="QR kod za deljenje"
            style={{ width: 160, height: 160, borderRadius: "var(--radius-sm)" }}
          />
          <p style={{ wordBreak: "break-all", fontSize: 12.5, marginTop: 10, marginBottom: 0 }}>
            {newLink.shareUrl}
          </p>
        </div>
      )}

      {links.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Aktivni linkovi</div>
          <ul>
            {links.map((link) => (
              <li
                key={link.token}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                <span className={`badge badge-${link.accessType === "Edit" ? "warning" : "primary"}`}>
                  {ACCESS_TYPE_LABELS[link.accessType]}
                </span>
                <button className="btn btn-ghost btn-sm" onClick={() => handleRevoke(link.token)}>
                  Opozovi
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
