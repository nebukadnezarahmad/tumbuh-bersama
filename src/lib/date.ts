const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function parseDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(iso: string, days: number): string {
  const date = parseDate(iso);
  if (!date) return iso;
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function addMonths(iso: string, months: number): string {
  const date = parseDate(iso);
  if (!date) return iso;
  date.setMonth(date.getMonth() + months);
  return toISODate(date);
}

export function formatDate(iso: string, withYear = true): string {
  const date = parseDate(iso);
  if (!date) return "Tanggal belum diisi";
  return `${date.getDate()} ${MONTHS[date.getMonth()]}${withYear ? ` ${date.getFullYear()}` : ""}`;
}

export function formatShortDate(iso: string): string {
  const date = parseDate(iso);
  if (!date) return "-";
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function formatWeekday(iso: string): string {
  const date = parseDate(iso);
  if (!date) return "-";
  return ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][
    date.getDay()
  ];
}

export function daysBetween(fromIso: string, toIso: string): number {
  const from = parseDate(fromIso);
  const to = parseDate(toIso);
  if (!from || !to) return 0;
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

export function relativeDue(iso: string, today = todayISO()): string {
  const diff = daysBetween(today, iso);
  if (diff === 0) return "Hari ini";
  if (diff === 1) return "Besok";
  if (diff === -1) return "Kemarin";
  if (diff > 1 && diff <= 7) return `${diff} hari lagi`;
  if (diff < -1 && diff >= -7) return `${Math.abs(diff)} hari lalu`;
  return formatDate(iso, false);
}

export function ageLabel(birthIso: string, atIso = todayISO()): string {
  const birth = parseDate(birthIso);
  const at = parseDate(atIso);
  if (!birth || !at || at < birth) return "Usia belum dihitung";
  let months =
    (at.getFullYear() - birth.getFullYear()) * 12 +
    (at.getMonth() - birth.getMonth());
  let days = at.getDate() - birth.getDate();
  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(at.getFullYear(), at.getMonth(), 0);
    days += previousMonth.getDate();
  }
  if (months < 1) return `${days} hari`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years >= 1) {
    const monthText = rest > 0 ? ` ${rest} bulan` : "";
    return `${years} tahun${monthText}`;
  }
  return days > 0 ? `${months} bulan ${days} hari` : `${months} bulan`;
}

export function ageInMonths(birthIso: string, atIso: string): number {
  const birth = parseDate(birthIso);
  const at = parseDate(atIso);
  if (!birth || !at) return 0;
  const months =
    (at.getFullYear() - birth.getFullYear()) * 12 +
    (at.getMonth() - birth.getMonth()) +
    (at.getDate() - birth.getDate()) / 30.44;
  return Math.max(0, months);
}

export function rupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function numberId(value: number, digits = 1): string {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(value);
}
