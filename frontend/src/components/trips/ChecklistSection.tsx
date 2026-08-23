import { useState } from "react";
import type { FormEvent } from "react";
import type { ChecklistItem } from "../../models/Checklist";
import { EmptyState } from "../ui/EmptyState";
import { Spinner } from "../ui/Spinner";

interface ChecklistSectionProps {
  items: ChecklistItem[];
  onAdd: (text: string) => Promise<void>;
  onToggle: (item: ChecklistItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ChecklistSection({ items, onAdd, onToggle, onDelete }: ChecklistSectionProps) {
  const [newText, setNewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!newText.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(newText.trim());
      setNewText("");
    } finally {
      setIsSubmitting(false);
    }
  }

  const completedCount = items.filter((i) => i.isCompleted).length;

  return (
    <div className="section">
      <div className="section-header">
        <h2>Checklist / Packing lista</h2>
        {items.length > 0 && (
          <span className="muted-count">
            {completedCount}/{items.length} završeno
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          className="input"
          placeholder="Npr. pasoš, karta, punjač..."
          maxLength={200}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={isSubmitting || !newText.trim()}>
          {isSubmitting ? <Spinner /> : "Dodaj"}
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState title="Nema stavki na listi" description="Dodaj prvu stavku za pakovanje iznad." />
      ) : (
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="list-item"
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 8 }}
            >
              <label className="checkbox-row" style={{ flex: 1, cursor: "pointer" }}>
                <input type="checkbox" checked={item.isCompleted} onChange={() => onToggle(item)} />
                <span
                  style={{
                    fontSize: 14.5,
                    textDecoration: item.isCompleted ? "line-through" : "none",
                    color: item.isCompleted ? "var(--color-text-faint)" : "var(--color-text)",
                  }}
                >
                  {item.text}
                </span>
              </label>
              <button className="btn btn-ghost btn-sm" onClick={() => onDelete(item.id)}>
                Obriši
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
