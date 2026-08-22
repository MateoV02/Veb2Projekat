import type { Activity } from "../../models/Activity";

interface ActivityCalendarProps {
  activities: Activity[];
  monthDate: Date;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onMonthChange: (delta: number) => void;
}

const WEEKDAY_LABELS = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];
const MONTH_LABELS = [
  "Januar", "Februar", "Mart", "April", "Maj", "Jun",
  "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar",
];

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildCalendarCells(monthDate: Date): Date[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  // Monday = 0 ... Sunday = 6
  const leadingOffset = (firstOfMonth.getDay() + 6) % 7;

  const gridStart = new Date(year, month, 1 - leadingOffset);

  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
  }
  return cells;
}

export function ActivityCalendar({
  activities,
  monthDate,
  selectedDate,
  onSelectDate,
  onMonthChange,
}: ActivityCalendarProps) {
  const cells = buildCalendarCells(monthDate);
  const currentMonth = monthDate.getMonth();

  const countsByDate = activities.reduce<Record<string, number>>((acc, activity) => {
    const key = activity.dateTime.slice(0, 10);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 420 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <button onClick={() => onMonthChange(-1)}>‹</button>
        <strong>
          {MONTH_LABELS[currentMonth]} {monthDate.getFullYear()}
        </strong>
        <button onClick={() => onMonthChange(1)}>›</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} style={{ textAlign: "center", fontSize: "0.8rem", color: "#888" }}>
            {label}
          </div>
        ))}

        {cells.map((cell) => {
          const key = toDateKey(cell);
          const isCurrentMonth = cell.getMonth() === currentMonth;
          const count = countsByDate[key] ?? 0;
          const isSelected = key === selectedDate;

          return (
            <button
              key={key}
              onClick={() => onSelectDate(key)}
              style={{
                padding: "0.4rem 0",
                border: isSelected ? "2px solid #333" : "1px solid #eee",
                borderRadius: 4,
                background: count > 0 ? "#e8f0fe" : "white",
                color: isCurrentMonth ? "#000" : "#bbb",
                cursor: "pointer",
              }}
            >
              <div>{cell.getDate()}</div>
              {count > 0 && <div style={{ fontSize: "0.7rem", color: "#1a56db" }}>{count} akt.</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
