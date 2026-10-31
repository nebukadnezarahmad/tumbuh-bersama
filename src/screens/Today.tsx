import { useMemo, useState } from "react";
import { PRIORITY_TEMPLATES, RECIPES, STAGES } from "../data";
import { taskFromTemplate, useStore } from "../store";
import type { Task, TaskStatus } from "../types";
import {
  ageLabel,
  formatDate,
  formatWeekday,
  relativeDue,
  rupiah,
  todayISO,
} from "../lib/date";
import { recipeCost } from "../lib/menu";
import { Badge, DemoTag, EmptyState, Icon, Modal } from "../components/ui";

const STATUS_LABEL: Record<TaskStatus, string> = {
  rencana: "Rencana",
  selesai: "Selesai",
  tertunda: "Ditunda",
  bantuan: "Perlu bantuan",
};

const STATUS_TONE: Record<TaskStatus, "neutral" | "success" | "warn" | "clay"> =
  {
    rencana: "neutral",
    selesai: "success",
    tertunda: "warn",
    bantuan: "clay",
  };

export function Today() {
  const { state, updateTask, removeTask, addTask } = useStore();
  const [pickerOpen, setPickerOpen] = useState(false);
  const today = todayISO();
  const profile = state.profile;
  const hasChildStage = ["nifas", "bayi", "mpasi", "balita"].includes(
    profile?.stage ?? "",
  );
  const stage = STAGES.find((item) => item.id === profile?.stage);
  const active = useMemo(
    () =>
      state.tasks
        .filter((task) => task.status !== "selesai")
        .sort((a, b) => a.due.localeCompare(b.due)),
    [state.tasks],
  );
  const done = state.tasks.filter((task) => task.status === "selesai");
  const childAge =
    profile?.childBirthDate && profile.childName
      ? `${profile.childName}, ${ageLabel(profile.childBirthDate)}`
      : "";
  const latestMeasurement = [...state.measurements].sort((a, b) =>
    b.date.localeCompare(a.date),
  )[0];
  const selectedRecipe = RECIPES.find(
    (item) => item.id === state.menu.recipeId,
  );
  const candidates = PRIORITY_TEMPLATES.filter(
    (item) =>
      item.stage === profile?.stage &&
      !state.tasks.some((task) => task.title === item.title),
  );

  const progress =
    state.tasks.length > 0
      ? Math.round((done.length / state.tasks.length) * 100)
      : 0;

  const addPriority = (title: string) => {
    const template = PRIORITY_TEMPLATES.find(
      (item) => item.stage === profile?.stage && item.title === title,
    );
    if (!template) return;
    if (active.length >= 3) return;
    addTask(taskFromTemplate(template, today));
  };

  return (
    <div className="screen today">
      <header className="screen-head">
        <div>
          <p className="kicker">
            Hari ini
            <span className="kicker-dot" aria-hidden="true" />
            {formatWeekday(today)}, {formatDate(today, false)}
          </p>
          <h1>Halo, {profile?.motherName || "Ibu"}.</h1>
          <p className="lede screen-lede">
            Ini rencana yang bisa kamu lanjutkan hari ini.
            {childAge ? ` Bersama ${childAge}.` : " Sesuaikan dengan waktumu."}
          </p>
        </div>
        <div className="head-meta">
          {state.demo ? <DemoTag /> : null}
          {stage ? <Badge tone="teal">{stage.label}</Badge> : null}
        </div>
      </header>

      <div className="today-overview">
        <div>
          <p className="eyebrow">Rencana keluarga</p>
          <h2>
            Satu per satu, <em>bersama.</em>
          </h2>
          <p>
            {stage?.summary || "Susun rencana yang sesuai dengan keluargamu."}
          </p>
          <div className="overview-shortcuts">
            <a href="#/rencana">
              <Icon name="utensils" size={15} />
              Pilih menu
            </a>
            <a href={hasChildStage ? "#/catatan" : "#/panduan"}>
              <Icon name={hasChildStage ? "plus" : "guide"} size={15} />
              {hasChildStage ? "Catat pengukuran" : "Baca panduan"}
            </a>
          </div>
        </div>
        <div className="overview-progress">
          <strong>
            {done.length}
            <span>/{state.tasks.length}</span>
          </strong>
          <span>prioritas selesai</span>
        </div>
      </div>

      <div className="screen-grid">
        <div className="screen-main">
          <section className="focus-panel" aria-labelledby="focus-title">
            <div className="focus-head">
              <div>
                <p className="kicker">Fokus minggu ini</p>
                <h2 id="focus-title">
                  {active.length === 0
                    ? "Belum ada prioritas aktif."
                    : `${active.length} langkah untuk minggu ini`}
                </h2>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => setPickerOpen(true)}
              >
                <Icon name="plus" size={16} />
                Atur rencana
              </button>
            </div>

            <div className="progress-row">
              <div
                className="progress-track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-label="Tugas selesai"
              >
                <span style={{ width: `${progress}%` }} />
              </div>
              <span className="progress-label">
                {done.length} dari {state.tasks.length} selesai
              </span>
            </div>

            {active.length === 0 ? (
              <EmptyState
                title="Tidak ada tugas aktif"
                action={
                  <button
                    type="button"
                    className="btn btn-primary btn-small"
                    onClick={() => setPickerOpen(true)}
                  >
                    Pilih prioritas
                  </button>
                }
              >
                Pilih satu prioritas saat kamu siap. Tugas yang sudah selesai
                tetap tersimpan di bawah.
              </EmptyState>
            ) : (
              <ol className="task-list">
                {active.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    onUpdate={updateTask}
                  />
                ))}
              </ol>
            )}
          </section>

          {done.length > 0 ? (
            <section className="done-panel" aria-labelledby="done-title">
              <div className="panel-head">
                <h2 id="done-title">Selesai</h2>
                <span className="muted">{done.length} tugas</span>
              </div>
              <ul className="done-list">
                {done.map((task) => (
                  <li key={task.id}>
                    <Icon name="check" size={16} />
                    <span>{task.title}</span>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => updateTask(task.id, { status: "rencana" })}
                    >
                      Batalkan
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="week-note" aria-labelledby="week-note-title">
            <Icon name="info" size={18} />
            <div>
              <h2 id="week-note-title">Rencana boleh berubah.</h2>
              <p>
                Ada yang belum sempat dikerjakan? Tunda tugas atau tandai “Perlu
                bantuan” lewat Detail & pilihan.
              </p>
            </div>
          </section>
        </div>

        <aside className="screen-aside" aria-label="Ringkasan">
          <section className="aside-card">
            <div className="panel-head">
              <h2>Catatan terakhir</h2>
              <a href="#/catatan" className="text-link">
                Catatan
              </a>
            </div>
            {latestMeasurement ? (
              <>
                <p className="stat-value">
                  {latestMeasurement.weightKg.toLocaleString("id-ID")}
                  <span className="stat-unit">kg</span>
                </p>
                <p className="stat-sub">
                  {latestMeasurement.heightCm.toLocaleString("id-ID")} cm ·{" "}
                  {formatDate(latestMeasurement.date, false)}
                </p>
                <p className="fine-note">
                  Hasil ukur yang kamu simpan, belum dibandingkan dengan kurva
                  WHO.
                </p>
              </>
            ) : (
              <p className="muted">
                Belum ada pengukuran. Catat berat dan panjang setelah diukur.
              </p>
            )}
          </section>

          <section className="aside-card">
            <div className="panel-head">
              <h2>Menu minggu ini</h2>
              <a href="#/rencana" className="text-link">
                Rencana
              </a>
            </div>
            {selectedRecipe ? (
              <>
                <p className="aside-title">{selectedRecipe.name}</p>
                <p className="stat-sub">
                  {selectedRecipe.minutes} menit · estimasi{" "}
                  {rupiah(recipeCost(selectedRecipe, state.menu.substitutions))}
                </p>
                <p className="fine-note">
                  Harga perkiraan dari data contoh; sesuaikan dengan harga di
                  sekitarmu.
                </p>
              </>
            ) : (
              <p className="muted">
                Belum ada menu dipilih. Mulai dari bahan yang tersedia di rumah.
              </p>
            )}
          </section>

          <section className="aside-card help-card">
            <div className="panel-head">
              <h2>Butuh bantuan?</h2>
            </div>
            <p className="muted">
              Jika ada keluhan berat, segera hubungi layanan darurat setempat
              atau fasilitas kesehatan terdekat.
            </p>
            <a href="#/panduan" className="text-link">
              Baca tanda bahaya
            </a>
          </section>
        </aside>
      </div>

      <Modal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Atur prioritas minggu ini"
      >
        <p className="muted modal-lede">
          Pilih hingga tiga prioritas yang paling perlu minggu ini. Pemilik
          tugas dan tenggatnya bisa kamu sesuaikan.
        </p>
        <div className="picker-section">
          <h3>Prioritas aktif ({active.length}/3)</h3>
          {active.length === 0 ? (
            <p className="muted">Belum ada prioritas aktif.</p>
          ) : (
            <ul className="picker-list">
              {active.map((task) => (
                <li key={task.id}>
                  <span>{task.title}</span>
                  <button
                    type="button"
                    className="text-button danger"
                    onClick={() => removeTask(task.id)}
                  >
                    Batalkan
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="picker-section">
          <h3>Pilihan untuk tahap ini</h3>
          {active.length >= 3 ? (
            <p className="field-hint">
              Batalkan satu prioritas dulu untuk menambah yang baru.
            </p>
          ) : null}
          {candidates.length === 0 ? (
            <p className="muted">
              Semua pilihan untuk tahap ini sudah masuk ke rencana. Batalkan
              satu prioritas jika ingin menggantinya.
            </p>
          ) : (
            <ul className="picker-list">
              {candidates.map((template) => (
                <li key={template.title}>
                  <div>
                    <span>{template.title}</span>
                    <span className="picker-reason">{template.reason}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-small"
                    disabled={active.length >= 3}
                    onClick={() => addPriority(template.title)}
                  >
                    Tambah
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </div>
  );
}

function TaskCard({
  task,
  index,
  onUpdate,
}: {
  task: Task;
  index: number;
  onUpdate: (id: string, patch: Partial<Task>) => void;
}) {
  return (
    <li className="task-card">
      <div className="task-top">
        <span className="task-num">{String(index + 1).padStart(2, "0")}</span>
        <div className="task-copy">
          <h3>{task.title}</h3>
          <p className="task-meta">
            <span>{task.owner}</span>
            <span aria-hidden="true">·</span>
            <span>{relativeDue(task.due)}</span>
            <span className="sr-only">, tenggat {formatDate(task.due)}</span>
          </p>
        </div>
        {task.status !== "rencana" ? (
          <Badge tone={STATUS_TONE[task.status]}>
            {STATUS_LABEL[task.status]}
          </Badge>
        ) : null}
      </div>

      <div className="task-actions">
        {task.status !== "selesai" ? (
          <>
            <button
              type="button"
              className="chip chip-action"
              onClick={() => onUpdate(task.id, { status: "selesai" })}
              aria-label={`Tandai selesai: ${task.title}`}
            >
              <Icon name="check" size={16} />
              Selesai
            </button>
          </>
        ) : (
          <button
            type="button"
            className="chip"
            onClick={() => onUpdate(task.id, { status: "rencana" })}
          >
            Batalkan selesai
          </button>
        )}
      </div>

      <details className="task-why">
        <summary>Detail & pilihan</summary>
        <div className="why-body">
          <div className="task-secondary-actions">
            <button
              type="button"
              className="chip"
              aria-pressed={task.status === "tertunda"}
              onClick={() =>
                onUpdate(task.id, {
                  status: task.status === "tertunda" ? "rencana" : "tertunda",
                })
              }
            >
              Tunda tugas
            </button>
            <button
              type="button"
              className="chip"
              aria-pressed={task.status === "bantuan"}
              onClick={() =>
                onUpdate(task.id, {
                  status: task.status === "bantuan" ? "rencana" : "bantuan",
                })
              }
            >
              Minta bantuan
            </button>
          </div>
          <p className="why-reason">{task.reason}</p>
          <dl className="meta-list">
            <div>
              <dt>Sumber</dt>
              <dd>{task.source}</dd>
            </div>
          </dl>
          <div className="task-fields">
            <label>
              <span>Penanggung jawab</span>
              <select
                value={task.owner}
                onChange={(event) =>
                  onUpdate(task.id, {
                    owner: event.target.value as Task["owner"],
                  })
                }
              >
                <option value="Saya">Saya</option>
                <option value="Pengasuh">Pengasuh</option>
              </select>
            </label>
            <label>
              <span>Tenggat</span>
              <input
                type="date"
                value={task.due}
                onChange={(event) =>
                  onUpdate(task.id, { due: event.target.value })
                }
              />
            </label>
          </div>
        </div>
      </details>
    </li>
  );
}
