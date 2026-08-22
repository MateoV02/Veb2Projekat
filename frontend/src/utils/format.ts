export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("sr-Latn-RS");
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("sr-Latn-RS", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function toDateInputValue(value: string): string {
  return value.slice(0, 10);
}

export function toDateTimeInputValue(value: string): string {
  return value.slice(0, 16);
}
