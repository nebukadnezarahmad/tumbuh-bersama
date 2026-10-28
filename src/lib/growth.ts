import type { Measurement } from "../types";
import { ageInMonths, parseDate, todayISO } from "./date";

export interface MeasurementDraft {
  date: string;
  weight: string;
  height: string;
  position: "telentang" | "berdiri";
  source: string;
  confirmed: boolean;
}

export const emptyDraft: MeasurementDraft = {
  date: todayISO(),
  weight: "",
  height: "",
  position: "telentang",
  source: "Posyandu",
  confirmed: false,
};

export interface ValidationResult {
  errors: Record<string, string>;
  values?: {
    date: string;
    weightKg: number;
    heightCm: number;
    position: "telentang" | "berdiri";
    source: string;
  };
}

export function parseDecimal(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const normalized = trimmed.replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null;
  return Number(normalized);
}

export function validateMeasurement(
  draft: MeasurementDraft,
  birthDate: string,
  today = todayISO(),
): ValidationResult {
  const errors: Record<string, string> = {};
  const date = parseDate(draft.date);
  const birth = parseDate(birthDate);
  const todayDate = parseDate(today);

  if (!birthDate || !birth) {
    errors.date = "Isi tanggal lahir anak di halaman Keluarga sebelum mencatat.";
  }
  if (!date) {
    errors.date = "Tanggal pengukuran belum valid. Pilih tanggal dari kalender.";
  } else if (todayDate && date > todayDate) {
    errors.date = "Tanggal pengukuran tidak boleh di masa depan.";
  } else if (birth && date < birth) {
    errors.date = "Tanggal pengukuran tidak boleh sebelum tanggal lahir.";
  }

  const weight = parseDecimal(draft.weight);
  if (weight === null) {
    errors.weight = "Isi berat dalam kg, misalnya 7,8. Hanya angka dan satu desimal.";
  } else if (weight < 0.5 || weight > 60) {
    errors.weight = "Berat di luar batas pemeriksaan cepat. Periksa satuan kg dan angka.";
  }

  const height = parseDecimal(draft.height);
  if (height === null) {
    errors.height = "Isi panjang atau tinggi dalam cm, misalnya 68,5.";
  } else if (height < 20 || height > 140) {
    errors.height = "Tinggi di luar batas pemeriksaan cepat. Periksa satuan cm dan posisi ukur.";
  }

  if (!draft.source.trim()) {
    errors.source = "Sebutkan sumber pengukuran, misalnya Posyandu atau rumah.";
  }
  if (!draft.confirmed) {
    errors.confirmed = "Konfirmasi bahwa angka sudah diperiksa sebelum disimpan.";
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    errors,
    values: {
      date: draft.date,
      weightKg: weight as number,
      heightCm: height as number,
      position: draft.position,
      source: draft.source.trim(),
    },
  };
}

export interface ChartPoint {
  id: string;
  ageMonths: number;
  value: number;
  date: string;
}

export function growthSeries(
  measurements: Measurement[],
  birthDate: string,
  metric: "weightKg" | "heightCm",
): ChartPoint[] {
  if (!birthDate) return [];
  return measurements
    .map((item) => ({
      id: item.id,
      ageMonths: ageInMonths(birthDate, item.date),
      value: item[metric],
      date: item.date,
    }))
    .sort((a, b) => a.ageMonths - b.ageMonths);
}
