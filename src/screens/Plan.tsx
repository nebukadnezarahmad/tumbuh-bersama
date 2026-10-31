import { useMemo, useState } from "react";
import { ALLERGENS, PANTRY_ITEMS, RECIPES, STAGES } from "../data";
import { taskFromTitle, useStore } from "../store";
import type { MenuState } from "../types";
import {
  ageInMonths,
  formatDate,
  relativeDue,
  rupiah,
  todayISO,
} from "../lib/date";
import {
  matchRecipes,
  recipeAllergens,
  recipeCost,
  recipeLines,
  shoppingList,
} from "../lib/menu";
import { Badge, EmptyState, Icon, SectionHead } from "../components/ui";

export function Plan() {
  const { state, setState, addTask } = useStore();
  const [showAll, setShowAll] = useState(false);
  const [assignMessage, setAssignMessage] = useState("");
  const [assignError, setAssignError] = useState("");
  const profile = state.profile;
  const stage = STAGES.find((item) => item.id === profile?.stage);
  const today = todayISO();

  const childAge = profile?.childBirthDate
    ? Math.floor(ageInMonths(profile.childBirthDate, today))
    : null;
  const ageMonths = childAge ?? 24;

  const activeTasks = state.tasks
    .filter((task) => task.status !== "selesai")
    .sort((a, b) => a.due.localeCompare(b.due));

  const selected = RECIPES.find((item) => item.id === state.menu.recipeId);
  const substitutions = state.menu.substitutions;

  const matches = useMemo(
    () =>
      matchRecipes({
        recipes: RECIPES,
        ageMonths,
        minutes: state.menu.minutes,
        budget: state.menu.budget,
        allergies: state.menu.allergies,
        pantry: state.menu.pantry,
      }),
    [
      ageMonths,
      state.menu.minutes,
      state.menu.budget,
      state.menu.allergies,
      state.menu.pantry,
    ],
  );

  const selectedCost = selected ? recipeCost(selected, substitutions) : 0;
  const selectedAllergens = selected
    ? recipeAllergens(selected, substitutions)
    : [];
  const conflicts = selectedAllergens.filter((item) =>
    state.menu.allergies.includes(item),
  );
  const list = selected
    ? shoppingList(selected, substitutions, state.menu.pantry)
    : [];
  const lines = selected ? recipeLines(selected, substitutions) : [];
  const shown = showAll ? matches : matches.slice(0, 3);

  const updateMenu = (patch: Partial<MenuState>) => {
    setState((current) => ({
      ...current,
      menu: { ...current.menu, ...patch },
    }));
  };

  const toggleAllergy = (item: string) => {
    updateMenu({
      allergies: state.menu.allergies.includes(item)
        ? state.menu.allergies.filter((value) => value !== item)
        : [...state.menu.allergies, item],
    });
  };

  const togglePantry = (item: string) => {
    updateMenu({
      pantry: state.menu.pantry.includes(item)
        ? state.menu.pantry.filter((value) => value !== item)
        : [...state.menu.pantry, item],
    });
  };

  const selectRecipe = (id: string) => {
    updateMenu({ recipeId: id, substitutions: {} });
    setState((current) => ({ ...current, shoppingDone: [] }));
    setAssignMessage("");
    setAssignError("");
  };

  const changeIngredient = (
    ingredientName: string,
    chosenName: string,
    baseName: string,
  ) => {
    const next = { ...substitutions };
    if (chosenName === baseName || !chosenName) {
      delete next[ingredientName];
    } else {
      next[ingredientName] = chosenName;
    }
    updateMenu({ substitutions: next });
  };

  const toggleShopping = (item: string) => {
    setState((current) => ({
      ...current,
      shoppingDone: current.shoppingDone.includes(item)
        ? current.shoppingDone.filter((value) => value !== item)
        : [...current.shoppingDone, item],
    }));
  };

  const assignShopping = () => {
    if (!selected) return;
    setAssignMessage("");
    setAssignError("");
    if (activeTasks.length >= 3) {
      setAssignError(
        "Tiga prioritas aktif sudah penuh. Batalkan satu di Hari Ini dulu.",
      );
      return;
    }
    if (conflicts.length > 0) {
      setAssignError(
        "Ganti bahan yang bentrok dengan alergi sebelum menugaskan.",
      );
      return;
    }
    addTask(
      taskFromTitle(
        profile?.stage ?? "mpasi",
        `Siapkan belanja: ${selected.name}`,
        "Pengasuh",
        2,
      ),
    );
    setAssignMessage(
      "Tugas belanja masuk ke Hari Ini dengan pemilik Pengasuh dan tenggat dua hari.",
    );
  };

  const resetFilters = () => {
    updateMenu({
      minutes: 45,
      budget: 20000,
      allergies: [],
    });
  };

  return (
    <div className="screen plan">
      <header className="screen-head">
        <div>
          <p className="kicker">Rencana</p>
          <h1>Rencana minggu ini.</h1>
          <p className="lede screen-lede">
            Cek prioritas keluarga, pilih menu dari bahan di rumah, lalu siapkan
            daftar belanja.
          </p>
        </div>
        {stage ? (
          <div className="head-meta">
            <Badge tone="teal">{stage.label}</Badge>
          </div>
        ) : null}
      </header>

      <section className="panel" aria-labelledby="plan-tasks-title">
        <div className="panel-head">
          <div>
            <p className="kicker">Prioritas</p>
            <h2 id="plan-tasks-title">Prioritas keluargamu</h2>
          </div>
          <a href="#/hari-ini" className="text-link">
            Atur di Hari Ini
          </a>
        </div>
        {activeTasks.length === 0 ? (
          <EmptyState title="Belum ada prioritas aktif">
            Pilih prioritas di halaman Hari Ini. Tugas dan penanggung jawabnya
            akan muncul di sini.
          </EmptyState>
        ) : (
          <ul className="compact-list">
            {activeTasks.map((task) => (
              <li key={task.id}>
                <span className="compact-title">{task.title}</span>
                <span className="compact-meta">
                  {task.owner} · {relativeDue(task.due)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel menu-builder" aria-labelledby="menu-title">
        <SectionHead
          kicker="Menu lokal"
          title="Cari menu yang bisa dimasak hari ini"
          lede={
            childAge !== null
              ? `Pilihan untuk usia ${childAge} bulan, waktu memasak, dan anggaranmu. Harga memakai data contoh.`
              : "Tanggal lahir anak belum diisi. Menu ditampilkan untuk contoh usia 24 bulan."
          }
          action={
            <button
              type="button"
              className="text-button"
              onClick={resetFilters}
            >
              Atur ulang saringan
            </button>
          }
        />

        <div className="filter-grid">
          <div className="field">
            <label htmlFor="plan-minutes">Waktu memasak</label>
            <select
              id="plan-minutes"
              value={state.menu.minutes}
              onChange={(event) =>
                updateMenu({ minutes: Number(event.target.value) })
              }
            >
              <option value={15}>Maksimal 15 menit</option>
              <option value={30}>Maksimal 30 menit</option>
              <option value={45}>Maksimal 45 menit</option>
              <option value={60}>Maksimal 60 menit</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="plan-budget">
              Anggaran bahan per resep: {rupiah(state.menu.budget)}
            </label>
            <input
              id="plan-budget"
              type="range"
              min={10000}
              max={40000}
              step={5000}
              value={state.menu.budget}
              onChange={(event) =>
                updateMenu({ budget: Number(event.target.value) })
              }
            />
            <span className="field-hint">
              Perkiraan dari data contoh. Harga bahan di sekitarmu bisa berbeda.
            </span>
          </div>
        </div>

        <fieldset className="field chip-field">
          <legend>Alergi yang perlu dihindari</legend>
          <div className="chip-wrap">
            {ALLERGENS.map((item) => (
              <button
                key={item}
                type="button"
                className="chip"
                aria-pressed={state.menu.allergies.includes(item)}
                onClick={() => toggleAllergy(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <span className="field-hint">
            Bila tidak ada yang dipilih, semua bahan ditampilkan.
          </span>
        </fieldset>

        <details className="pantry-panel">
          <summary>
            Bahan tersedia di rumah
            <span className="summary-count">
              {state.menu.pantry.length} dipilih
            </span>
          </summary>
          <div className="chip-wrap pantry-chips">
            {PANTRY_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                className="chip"
                aria-pressed={state.menu.pantry.includes(item)}
                onClick={() => togglePantry(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="inline-actions">
            <button
              type="button"
              className="text-button"
              onClick={() => updateMenu({ pantry: [...PANTRY_ITEMS] })}
            >
              Pilih semua
            </button>
            <button
              type="button"
              className="text-button"
              onClick={() => updateMenu({ pantry: [] })}
            >
              Kosongkan
            </button>
          </div>
        </details>

        <div className="results-head">
          <h3>
            {matches.length} menu sesuai pilihanmu
            {matches.length > 3 && !showAll ? ", 3 teratas" : ""}
          </h3>
          <span className="muted">
            Usia {ageMonths} bulan · {state.menu.minutes} menit ·{" "}
            {rupiah(state.menu.budget)}
          </span>
        </div>

        {matches.length === 0 ? (
          <EmptyState
            title="Belum ada menu yang cocok"
            action={
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={resetFilters}
              >
                Atur ulang saringan
              </button>
            }
          >
            Coba tambah waktu memasak atau naikkan anggaran. Atur ulang akan
            mengosongkan pilihan alergi; pilih kembali bahan yang perlu
            dihindari.
          </EmptyState>
        ) : (
          <>
            <ul className="recipe-list">
              {shown.map(({ recipe, cost, missing, allergens }) => (
                <li key={recipe.id} className="recipe-row">
                  <div className="recipe-row-main">
                    <div className="recipe-title-line">
                      <h3>{recipe.name}</h3>
                      <span className="recipe-age">{recipe.stage}</span>
                    </div>
                    <p className="recipe-meta">
                      {recipe.minutes} menit · {recipe.servings} porsi ·
                      estimasi {rupiah(cost)}
                    </p>
                    <p className="recipe-texture">{recipe.texture}</p>
                    <p className="stock-line">
                      <Icon name="list" size={15} />
                      {recipe.ingredients.length - missing.length} dari{" "}
                      {recipe.ingredients.length} bahan tersedia
                      {missing.length > 0
                        ? ` · perlu beli: ${missing.join(", ")}`
                        : " · bahan utama lengkap"}
                    </p>
                    {allergens.length > 0 ? (
                      <div className="tag-row">
                        {allergens.map((item) => (
                          <Badge key={item} tone="warn">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className={`btn ${
                      state.menu.recipeId === recipe.id
                        ? "btn-ghost"
                        : "btn-primary"
                    } btn-small`}
                    onClick={() => selectRecipe(recipe.id)}
                  >
                    {state.menu.recipeId === recipe.id
                      ? "Dipilih"
                      : "Pilih menu"}
                  </button>
                </li>
              ))}
            </ul>
            {matches.length > 3 ? (
              <button
                type="button"
                className="text-button show-all"
                onClick={() => setShowAll((value) => !value)}
              >
                {showAll
                  ? "Tampilkan tiga teratas"
                  : `Tampilkan semua (${matches.length})`}
              </button>
            ) : null}
          </>
        )}
      </section>

      {selected ? (
        <section
          className="panel selected-recipe"
          aria-labelledby="selected-title"
        >
          <div className="panel-head">
            <div>
              <p className="kicker">Menu terpilih</p>
              <h2 id="selected-title">{selected.name}</h2>
            </div>
            <button
              type="button"
              className="text-button"
              onClick={() => updateMenu({ recipeId: null })}
            >
              Lepas pilihan
            </button>
          </div>

          <div className="stat-row">
            <div>
              <span className="stat-label">Waktu</span>
              <span className="stat-line">{selected.minutes} menit</span>
            </div>
            <div>
              <span className="stat-label">Porsi</span>
              <span className="stat-line">{selected.servings} porsi</span>
            </div>
            <div>
              <span className="stat-label">Estimasi bahan</span>
              <span className="stat-line">{rupiah(selectedCost)}</span>
            </div>
            <div>
              <span className="stat-label">Tekstur</span>
              <span className="stat-line">{selected.texture}</span>
            </div>
          </div>

          {conflicts.length > 0 ? (
            <p className="alert alert-danger" role="alert">
              Bahan terpilih mengandung alergi yang kamu saring:{" "}
              {conflicts.join(", ")}. Ganti bahan sebelum membuat daftar
              belanja.
            </p>
          ) : null}

          <div className="recipe-detail-grid">
            <div>
              <h3>Bahan dan pengganti</h3>
              <ul className="ingredient-list">
                {lines.map(({ base, chosen, substituted }) => (
                  <li key={base.name}>
                    <div className="ingredient-copy">
                      <span className="ingredient-name">
                        {chosen.name}
                        {substituted ? (
                          <Badge tone="clay">diganti</Badge>
                        ) : null}
                      </span>
                      <span className="ingredient-amount">{chosen.amount}</span>
                      <span className="ingredient-cost">
                        {rupiah(chosen.cost)}
                      </span>
                      {chosen.allergens?.length ? (
                        <span className="ingredient-allergen">
                          Alergen: {chosen.allergens.join(", ")}
                        </span>
                      ) : null}
                    </div>
                    {base.alt ? (
                      <label className="sub-select">
                        <span>Ganti bahan</span>
                        <select
                          value={substituted ? chosen.name : base.name}
                          onChange={(event) =>
                            changeIngredient(
                              base.name,
                              event.target.value,
                              base.name,
                            )
                          }
                        >
                          <option value={base.name}>
                            {base.name} {base.amount}
                          </option>
                          <option value={base.alt.name}>
                            {base.alt.name} {base.alt.amount}
                          </option>
                        </select>
                      </label>
                    ) : null}
                  </li>
                ))}
              </ul>
              <p className="fine-note">
                Estimasi {rupiah(selectedCost)} untuk {selected.servings} porsi.
                Harga memakai data contoh. Perkiraan biaya ikut berubah saat
                kamu mengganti bahan.
              </p>
            </div>

            <div>
              <h3>Cara membuat</h3>
              <ol className="step-list">
                {selected.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="recipe-note">{selected.note}</p>
            </div>
          </div>

          <div className="menu-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={assignShopping}
              disabled={conflicts.length > 0}
            >
              <Icon name="plus" size={17} />
              Tugaskan belanja ke pengasuh
            </button>
            <span className="fine-note">
              Tugas belanja akan tersimpan di Hari Ini. Pengasuh tidak menerima
              pesan atau notifikasi.
            </span>
          </div>
          {assignError ? (
            <p className="alert alert-danger" role="alert">
              {assignError}
            </p>
          ) : null}
          {assignMessage ? (
            <p className="alert alert-success" role="status">
              {assignMessage} <a href="#/hari-ini">Lihat di Hari Ini</a>
            </p>
          ) : null}

          <div className="shopping-panel">
            <div className="panel-head">
              <div>
                <h3>Daftar belanja</h3>
                <p className="muted">
                  {list.length > 0
                    ? `${list.length} bahan belum tersedia.`
                    : "Bahan utama sudah tersedia di rumah."}
                </p>
              </div>
              <span className="fine-note">
                Diperbarui {formatDate(today, false)}
              </span>
            </div>
            {list.length === 0 ? (
              <p className="muted">
                Periksa bumbu, minyak, dan alat masak sebelum mulai.
              </p>
            ) : (
              <ul className="shopping-list">
                {list.map((item) => {
                  const checked = state.shoppingDone.includes(item);
                  return (
                    <li key={item}>
                      <label className={checked ? "is-checked" : ""}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleShopping(item)}
                        />
                        <span>{item}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
