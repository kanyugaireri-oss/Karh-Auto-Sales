export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatCurrencyKES(amount: number) {
  return `KES ${new Intl.NumberFormat("en-KE").format(amount)}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function buildWhatsAppLink(number: string, message: string) {
  if (!number) {
    return "#";
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
