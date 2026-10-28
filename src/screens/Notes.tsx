import { useMemo, useState, type FormEvent } from "react";
import { STAGES } from "../data";
import { useStore } from "../store";
import type { Measurement } from "../types";
import {
  ageInMonths,
  ageLabel,
  daysBetween,
  formatDate,
  formatShortDate,
  numberId,
  rupiah,
  todayISO,
} from "../lib/date";
import {
  emptyDraft,
  growthSeries,
  validateMeasurement,
  type ChartPoint,
  type MeasurementDraft,
} from "../lib/growth";
import {
  Badge,
  FieldError,
  Icon,
  Modal,
  SectionHead,
  Toggle,
} from "../components/ui";

const TASK_STATUS_LABEL: Record<string, string> = {
  rencana: "Rencana",
  selesai: "Selesai",
  tertunda: "Ditunda",
  bantuan: "Perlu bantuan",
};

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? `measure-${crypto.randomUUID()}`
    : `measure-${Date.now()}`;
}

export function Notes() {
  const { state, addMeasurement, removeMeasurement } = useStore();
  const profile = state.profile;
  const stage = STAGES.find((item) => item.id === profile?.stage);
  const [draft, setDraft] = useState<MeasurementDraft>(emptyDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState("");
  const [toDelete, setToDelete] = useState<Measurement | null>(null);
  const [range, setRange] = useState<"30" | "90" | "all">("90");
  const [includeGrowth, setIncludeGrowth] = useState(true);
  const [includeTasks, setIncludeTasks] = useState(true);
  const [visitNote, setVisitNote] = useState("");
  const today = todayISO();
  const birthDate = profile?.childBirthDate ?? "";

  const sorted = useMemo(
    () =>
      [...state.measurements].sort((a, b) => b.date.localeCompare(a.date)),
    [state.measurements],
  );
  const weightSeries = growthSeries(sorted, birthDate, "weightKg");
  const heightSeries = growthSeries(sorted, birthDate, "heightCm");
  const weightNow = [...weightSeries].sort((a, b) => b.ageMonths - a.ageMonths)[0];
  const heightNow = [...heightSeries].sort((a, b) => b.ageMonths - a.ageMonths)[0];

  const filtered = useMemo(() => {
    const sortedAsc = [...state.measurements].sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    if (range === "all") return sortedAsc;
    const limit = Number(range);
    return sortedAsc.filter((item) => daysBetween(item.date, today) <= limit);
  }, [state.measurements, range, today]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = validateMeasurement(draft, birthDate, today);
    setErrors(result.errors);
    setSaved("");
    if (!result.values) return;
    addMeasurement({
      id: makeId(),
      date: result.values.date,
      weightKg: result.values.weightKg,
      heightCm: result.values.heightCm,
      position: result.values.position,
      source: result.values.source,
      confirmed: true,
      createdAt: today,
    });
    setDraft({
      ...emptyDraft,
      date: draft.date,
      position: draft.position,
      source: draft.source,
    });
    setSaved(
      "Pengukuran tersimpan. Data mentah disimpan, interpretasi tetap ditahan.",
    );
  };

  const summaryText = () => {
    const rows = filtered
      .map(
        (item) =>
          `- ${formatShortDate(item.date)}: ${numberId(item.weightKg)} kg, ${numberId(
            item.heightCm,
          )} cm, ${item.position}, ${item.source}`,
      )
      .join("\n");
    const tasks = includeTasks
      ? state.tasks
          .map(
            (task) =>
              `- ${task.title} (${TASK_STATUS_LABEL[task.status]}, ${task.owner}, ${formatShortDate(task.due)})`,
          )
          .join("\n")
      : "";
    return [
      "RINGKASAN KONSULTASI",
      `Disusun ${formatDate(today)}`,
      "",
      `Keluarga: ${profile?.motherName ?? "-"}`,
      `Anak: ${profile?.childName || "-"}${
        birthDate ? `, ${ageLabel(birthDate)}` : ""
      }`,
      `Tahap: ${stage?.label ?? "-"}`,
      "",
      "PENGUKURAN",
      rows || "- Belum ada pengukuran pada rentang ini.",
      "",
      "TUGAS DAN RENCANA",
      tasks || "- Tidak disertakan.",
      "",
      "CATATAN ORANG TUA",
      visitNote.trim() || "- Tidak diisi.",
      "",
      "Catatan: ringkasan disusun pengguna dari catatan sendiri. Bukan diagnosis.",
    ].join("\n");
  };

  const downloadSummary = () => {
    const blob = new Blob([summaryText()], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ringkasan-konsultasi-${today}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="screen notes">
      <header className="screen-head">
        <div>
          <p className="kicker">Catatan</p>
          <h1>Catatan tumbuh dan konsultasi.</h1>
          <p className="lede screen-lede">
            Simpan hasil ukur apa adanya. Siapkan ringkasan sebelum berbicara
            dengan tenaga kesehatan.
          </p>
        </div>
        {stage ? (
          <div className="head-meta">
            <Badge tone="teal">{stage.label}</Badge>
          </div>
        ) : null}
      </header>

      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-label">Berat terakhir</span>
          <span className="stat-value">
            {weightNow ? numberId(weightNow.value) : "–"}
            <span className="stat-unit">kg</span>
          </span>
          <span className="stat-sub">
            {weightNow ? formatDate(weightNow.date, false) : "Belum ada data"}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Panjang / tinggi terakhir</span>
          <span className="stat-value">
            {heightNow ? numberId(heightNow.value) : "–"}
            <span className="stat-unit">cm</span>
          </span>
          <span className="stat-sub">
            {heightNow ? formatDate(heightNow.date, false) : "Belum ada data"}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Jumlah pengukuran</span>
          <span className="stat-value">{state.measurements.length}</span>
          <span className="stat-sub">
            {state.measurements.length > 0
              ? `Terakhir ${formatDate(sorted[0]?.date ?? today, false)}`
              : "Mulai dari satu titik"}
          </span>
        </div>
      </div>

      <div className="screen-grid">
        <div className="screen-main">
          <section className="panel" aria-labelledby="add-measure-title">
            <SectionHead
              kicker="Pengukuran"
              title="Catat berat dan panjang"
              lede={
                birthDate
                  ? `Usia saat ini ${ageLabel(birthDate)}. Isi hasil ukur, bukan perkiraan.`
                  : "Tanggal lahir anak belum diisi, jadi usia belum bisa dihitung."
              }
              action={
                birthDate ? (
                  <Badge tone="neutral">Data mentah</Badge>
                ) : (
                  <a href="#/keluarga" className="text-link">
                    Isi tanggal lahir
                  </a>
                )
              }
            />

            {!birthDate ? (
              <p className="notice-inline">
                Catat tanggal lahir anak di halaman Keluarga sebelum
                menambahkan pengukuran. Ini mencegah sumbu usia yang keliru.
              </p>
            ) : (
              <form className="measure-form" onSubmit={submit} noValidate>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="measure-date">Tanggal pengukuran</label>
                    <input
                      id="measure-date"
                      type="date"
                      value={draft.date}
                      max={today}
                      aria-invalid={Boolean(errors.date)}
                      aria-describedby={errors.date ? "date-error" : undefined}
                      onChange={(event) =>
                        setDraft({ ...draft, date: event.target.value })
                      }
                    />
                    <span id="date-error">
                      <FieldError>{errors.date}</FieldError>
                    </span>
                  </div>
                  <div className="field">
                    <label htmlFor="measure-source">Sumber pengukuran</label>
                    <input
                      id="measure-source"
                      type="text"
                      list="source-options"
                      value={draft.source}
                      aria-invalid={Boolean(errors.source)}
                      aria-describedby={
                        errors.source ? "source-error" : undefined
                      }
                      onChange={(event) =>
                        setDraft({ ...draft, source: event.target.value })
                      }
                    />
                    <datalist id="source-options">
                      <option value="Posyandu" />
                      <option value="Rumah" />
                      <option value="Klinik" />
                      <option value="Rumah sakit" />
                    </datalist>
                    <span id="source-error">
                      <FieldError>{errors.source}</FieldError>
                    </span>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="measure-weight">Berat badan (kg)</label>
                    <div className="input-unit">
                      <input
                        id="measure-weight"
                        type="text"
                        inputMode="decimal"
                        placeholder="7,9"
                        value={draft.weight}
                        aria-invalid={Boolean(errors.weight)}
                        aria-describedby={
                          errors.weight ? "weight-error" : "weight-hint"
                        }
                        onChange={(event) =>
                          setDraft({ ...draft, weight: event.target.value })
                        }
                      />
                      <span>kg</span>
                    </div>
                    <span id="weight-hint" className="field-hint">
                      Koma atau titik diterima. Satuan kilogram.
                    </span>
                    <span id="weight-error">
                      <FieldError>{errors.weight}</FieldError>
                    </span>
                  </div>

                  <div className="field">
                    <label htmlFor="measure-height">
                      Panjang / tinggi badan (cm)
                    </label>
                    <div className="input-unit">
                      <input
                        id="measure-height"
                        type="text"
                        inputMode="decimal"
                        placeholder="68,4"
                        value={draft.height}
                        aria-invalid={Boolean(errors.height)}
                        aria-describedby={
                          errors.height ? "height-error" : "height-hint"
                        }
                        onChange={(event) =>
                          setDraft({ ...draft, height: event.target.value })
                        }
                      />
                      <span>cm</span>
                    </div>
                    <span id="height-hint" className="field-hint">
                      Satuan sentimeter.
                    </span>
                    <span id="height-error">
                      <FieldError>{errors.height}</FieldError>
                    </span>
                  </div>
                </div>

                <fieldset className="field">
                  <legend>Posisi ukur</legend>
                  <div className="radio-row">
                    <label>
                      <input
                        type="radio"
                        name="position"
                        value="telentang"
                        checked={draft.position === "telentang"}
                        onChange={() =>
                          setDraft({ ...draft, position: "telentang" })
                        }
                      />
                      Telentang, biasanya sampai 24 bulan
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="position"
                        value="berdiri"
                        checked={draft.position === "berdiri"}
                        onChange={() =>
                          setDraft({ ...draft, position: "berdiri" })
                        }
                      />
                      Berdiri
                    </label>
                  </div>
                </fieldset>

                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={draft.confirmed}
                    onChange={(event) =>
                      setDraft({ ...draft, confirmed: event.target.checked })
                    }
                  />
                  <span>
                    Saya sudah memeriksa angka, satuan, tanggal, dan posisi ukur.
                  </span>
                </label>
                <FieldError>{errors.confirmed}</FieldError>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Simpan pengukuran
                  </button>
                  <span className="fine-note">
                    Data mentah disimpan dengan tanggal dan sumber.
                  </span>
                </div>
                {saved ? (
                  <p className="alert alert-success" role="status">
                    {saved}
                  </p>
                ) : null}
              </form>
            )}
          </section>

          <section className="panel" aria-labelledby="chart-title">
            <SectionHead
              kicker="Grafik"
              title="Data mentah pertumbuhan"
              lede="Belum dibandingkan dengan kurva WHO. Interpretasi z-score ditahan sampai perhitungan dan penelaahan selesai."
            />
            <div className="chart-grid">
              <Chart
                title="Berat badan"
                unit="kg"
                points={weightSeries}
                color="var(--teal)"
              />
              <Chart
                title="Panjang / tinggi badan"
                unit="cm"
                points={heightSeries}
                color="var(--clay)"
              />
            </div>
            <p className="chart-note">
              <Icon name="info" size={16} />
              Satu titik bukan tren. Grafik membantu melihat catatan, bukan
              menilai status gizi. Kategori antropometri juga bukan diagnosis
              penyebab.
            </p>
          </section>

          <section className="panel" aria-labelledby="history-title">
            <SectionHead
              kicker="Riwayat"
              title="Semua pengukuran"
              lede="Urutan terbaru di atas. Hapus data yang salah, lalu ukur ulang bila memungkinkan."
            />
            {sorted.length === 0 ? (
              <p className="muted">Belum ada pengukuran tersimpan.</p>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <caption className="sr-only">
                    Riwayat pengukuran berat dan panjang anak
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Tanggal</th>
                      <th scope="col">Usia</th>
                      <th scope="col">Berat</th>
                      <th scope="col">Panjang</th>
                      <th scope="col">Posisi</th>
                      <th scope="col">Sumber</th>
                      <th scope="col">
                        <span className="sr-only">Aksi</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((item) => (
                      <tr key={item.id}>
                        <td>{formatShortDate(item.date)}</td>
                        <td>
                          {birthDate
                            ? `${Math.floor(ageInMonths(birthDate, item.date))} bln`
                            : "–"}
                        </td>
                        <td>{numberId(item.weightKg)} kg</td>
                        <td>{numberId(item.heightCm)} cm</td>
                        <td>{item.position}</td>
                        <td>{item.source}</td>
                        <td className="table-action">
                          <button
                            type="button"
                            className="icon-button"
                            aria-label={`Hapus pengukuran ${formatDate(item.date)}`}
                            onClick={() => setToDelete(item)}
                          >
                            <Icon name="trash" size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="panel summary-builder" aria-labelledby="summary-title">
            <SectionHead
              kicker="Ringkasan"
              title="Siapkan catatan untuk konsultasi"
              lede="Pilih rentang dan isi yang dibawa. Tinjau pratinjau sebelum mencetak."
            />

            <div className="filter-grid">
              <div className="field">
                <label htmlFor="summary-range">Rentang catatan</label>
                <select
                  id="summary-range"
                  value={range}
                  onChange={(event) =>
                    setRange(event.target.value as "30" | "90" | "all")
                  }
                >
                  <option value="30">30 hari terakhir</option>
                  <option value="90">90 hari terakhir</option>
                  <option value="all">Semua catatan</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="visit-note">Catatan untuk tenaga kesehatan</label>
                <textarea
                  id="visit-note"
                  rows={3}
                  value={visitNote}
                  maxLength={600}
                  placeholder="Contoh: dua minggu terakhir sulit makan tekstur kasar."
                  onChange={(event) => setVisitNote(event.target.value)}
                />
                <span className="field-hint">
                  {visitNote.length}/600 karakter. Boleh dikosongkan.
                </span>
              </div>
            </div>

            <div className="summary-toggles">
              <Toggle
                checked={includeGrowth}
                onChange={setIncludeGrowth}
                label="Sertakan pengukuran"
                description={`${filtered.length} catatan pada rentang ini.`}
              />
              <Toggle
                checked={includeTasks}
                onChange={setIncludeTasks}
                label="Sertakan tugas dan rencana"
                description="Status terakhir, pemilik, dan tenggat."
              />
            </div>

            <div className="summary-actions no-print">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                <Icon name="print" size={17} />
                Cetak atau simpan PDF
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={downloadSummary}
              >
                <Icon name="download" size={17} />
                Unduh teks
              </button>
            </div>

            <article className="print-sheet" aria-label="Pratinjau ringkasan">
              <div className="print-head">
                <div>
                  <p className="print-brand">TumbuhBersama.</p>
                  <h3>Ringkasan konsultasi</h3>
                </div>
                <p className="print-date">Disusun {formatDate(today)}</p>
              </div>
              <dl className="print-meta">
                <div>
                  <dt>Keluarga</dt>
                  <dd>{profile?.motherName || "-"}</dd>
                </div>
                <div>
                  <dt>Anak</dt>
                  <dd>
                    {profile?.childName || "-"}
                    {birthDate ? `, ${ageLabel(birthDate)}` : ""}
                  </dd>
                </div>
                <div>
                  <dt>Tahap</dt>
                  <dd>{stage?.label ?? "-"}</dd>
                </div>
              </dl>

              {includeGrowth ? (
                <div className="print-section">
                  <h4>Pengukuran</h4>
                  {filtered.length === 0 ? (
                    <p>Belum ada pengukuran pada rentang ini.</p>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th scope="col">Tanggal</th>
                          <th scope="col">Berat</th>
                          <th scope="col">Panjang</th>
                          <th scope="col">Posisi</th>
                          <th scope="col">Sumber</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((item) => (
                          <tr key={item.id}>
                            <td>{formatShortDate(item.date)}</td>
                            <td>{numberId(item.weightKg)} kg</td>
                            <td>{numberId(item.heightCm)} cm</td>
                            <td>{item.position}</td>
                            <td>{item.source}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : null}

              {includeTasks ? (
                <div className="print-section">
                  <h4>Tugas dan rencana</h4>
                  <ul className="print-list">
                    {state.tasks.map((task) => (
                      <li key={task.id}>
                        {task.title} · {TASK_STATUS_LABEL[task.status]} ·{" "}
                        {task.owner} · {formatShortDate(task.due)}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="print-section">
                <h4>Catatan orang tua</h4>
                <p className="print-note">
                  {visitNote.trim() || "Tidak diisi."}
                </p>
              </div>

              <p className="print-foot">
                Disusun pengguna dari catatan sendiri. Bukan diagnosis. Data
                pada purwarupa ini adalah contoh.
              </p>
            </article>

            <p className="fine-note">
              File yang sudah diunduh tidak bisa ditarik kembali. Tinjau isi
              sebelum membagikan.
            </p>
          </section>
        </div>

        <aside className="screen-aside" aria-label="Panduan catatan">
          <section className="aside-card">
            <h2>Aturan data</h2>
            <ul className="small-list">
              <li>Data mentah tidak ditimpa saat koreksi.</li>
              <li>Tanggal dan satuan diperiksa sebelum simpan.</li>
              <li>Kategori tidak muncul saat data belum lengkap.</li>
              <li>Ekspor hanya setelah pengguna meninjau pratinjau.</li>
            </ul>
          </section>
          <section className="aside-card">
            <h2>Batas interpretasi</h2>
            <p className="muted">
              Berat badan rendah belum tentu stunting. Indikator BB/U dan PB/U
              menjawab hal berbeda. Penilaian penyebab butuh tenaga kesehatan.
            </p>
          </section>
          <section className="aside-card">
            <h2>Biaya contoh</h2>
            <p className="muted">
              Estimasi menu memakai {rupiah(9000)} sampai {rupiah(26000)} per
              resep. Bukan harga pasar waktu nyata.
            </p>
          </section>
        </aside>
      </div>

      <Modal
        open={toDelete !== null}
        title="Hapus pengukuran?"
        onClose={() => setToDelete(null)}
      >
        <p className="muted">
          Catatan tanggal {toDelete ? formatDate(toDelete.date) : ""} akan
          dihapus dari peramban ini. Data mentah lain tidak berubah.
        </p>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setToDelete(null)}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              if (toDelete) removeMeasurement(toDelete.id);
              setToDelete(null);
            }}
          >
            Hapus pengukuran
          </button>
        </div>
      </Modal>
    </div>
  );
}

function Chart({
  title,
  unit,
  points,
  color,
}: {
  title: string;
  unit: string;
  points: ChartPoint[];
  color: string;
}) {
  const width = 620;
  const height = 240;
  const padding = { top: 18, right: 18, bottom: 34, left: 42 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const maxAge = Math.max(12, ...points.map((point) => point.ageMonths));
  const values = points.map((point) => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const spread = Math.max(2, maxValue - minValue);
  const yMin = Math.max(0, Math.floor((minValue - spread * 0.25) / 5) * 5);
  const yMax = Math.ceil((maxValue + spread * 0.25) / 5) * 5;
  const xTickStep = maxAge > 24 ? 6 : 3;
  const xTicks: number[] = [];
  for (let month = 0; month <= maxAge; month += xTickStep) {
    xTicks.push(month);
  }
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(
    (ratio) => yMin + (yMax - yMin) * ratio,
  );

  const x = (age: number) =>
    padding.left + (Math.min(age, maxAge) / maxAge) * innerW;
  const y = (value: number) =>
    padding.top + innerH - ((value - yMin) / Math.max(1, yMax - yMin)) * innerH;

  const path = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${x(point.ageMonths).toFixed(1)} ${y(
          point.value,
        ).toFixed(1)}`,
    )
    .join(" ");

  return (
    <figure className="chart-figure">
      <figcaption>
        <span>{title}</span>
        <span className="chart-unit">{unit}</span>
      </figcaption>
      {points.length === 0 ? (
        <div className="chart-empty">
          Belum ada data untuk grafik ini. Tambahkan pengukuran pertama.
        </div>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="chart-svg"
            role="img"
            aria-label={`Grafik ${title} mentah, ${points.length} titik, sumbu usia dalam bulan.`}
          >
            <title>{`Grafik ${title} mentah`}</title>
            <desc>
              {points
                .map(
                  (point) =>
                    `Usia ${numberId(point.ageMonths)} bulan, ${numberId(
                      point.value,
                    )} ${unit}.`,
                )
                .join(" ")}
            </desc>
            {yTicks.map((tick) => (
              <g key={tick}>
                <line
                  x1={padding.left}
                  x2={width - padding.right}
                  y1={y(tick)}
                  y2={y(tick)}
                  className="chart-grid-line"
                />
                <text
                  x={padding.left - 8}
                  y={y(tick) + 4}
                  textAnchor="end"
                  className="chart-label"
                >
                  {numberId(tick, 0)}
                </text>
              </g>
            ))}
            {xTicks.map((tick) => (
              <text
                key={tick}
                x={x(tick)}
                y={height - 12}
                textAnchor="middle"
                className="chart-label"
              >
                {tick}
              </text>
            ))}
            <text
              x={padding.left}
              y={height - 1}
              className="chart-axis-title"
            >
              Usia (bulan)
            </text>
            <path d={path} className="chart-line" style={{ stroke: color }} />
            {points.map((point) => (
              <g key={point.id}>
                <circle
                  cx={x(point.ageMonths)}
                  cy={y(point.value)}
                  r={5}
                  className="chart-dot"
                  style={{ fill: color }}
                />
                <title>
                  {`${formatDate(point.date)}: ${numberId(point.value)} ${unit}`}
                </title>
              </g>
            ))}
          </svg>
          <details className="chart-table">
            <summary>Lihat sebagai tabel</summary>
            <table>
              <thead>
                <tr>
                  <th scope="col">Usia</th>
                  <th scope="col">Tanggal</th>
                  <th scope="col">
                    {title} ({unit})
                  </th>
                </tr>
              </thead>
              <tbody>
                {points.map((point) => (
                  <tr key={point.id}>
                    <td>{numberId(point.ageMonths)} bln</td>
                    <td>{formatShortDate(point.date)}</td>
                    <td>{numberId(point.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </>
      )}
    </figure>
  );
}
