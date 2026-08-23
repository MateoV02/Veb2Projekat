import { useState } from "react";
import type { FormEvent } from "react";
import type { ChecklistItem } from "../../models/Checklist";

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
    <div style={{ marginTop: "2rem" }}>
      <h2>
        Checklist / Packing lista{" "}
        {items.length > 0 && (
          <span style={{ fontSize: "0.9rem", color: "#666" }}>
            ({completedCount}/{items.length})
          </span>
        )}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Npr. pasoš, karta, punjač..."
          maxLength={200}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button type="submit" disabled={isSubmitting || !newText.trim()}>
          Dodaj
        </button>
      </form>

      {items.length === 0 ? (
        <p>Nema stavki na listi.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.25rem 0" }}
            >
              <input
                type="checkbox"
                checked={item.isCompleted}
                onChange={() => onToggle(item)}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: item.isCompleted ? "line-through" : "none",
                  color: item.isCompleted ? "#888" : "inherit",
                }}
              >
                {item.text}
              </span>
              <button onClick={() => onDelete(item.id)}>Obriši</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
