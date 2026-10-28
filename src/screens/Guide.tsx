import { useMemo, useState } from "react";
import { GUIDE_ITEMS, MYTHS, SOURCES, STAGES } from "../data";
import { useStore } from "../store";
import type { StageId } from "../types";
import { Badge, EmptyState, Icon, SectionHead } from "../components/ui";

export function Guide() {
  const { state } = useStore();
  const [stage, setStage] = useState<StageId | "all">(
    state.profile?.stage ?? "all",
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return GUIDE_ITEMS.filter((item) => {
      const stageMatch = stage === "all" || item.stages.includes(stage);
      const textMatch =
        !text ||
        `${item.title} ${item.summary} ${item.takeaway} ${item.category}`
          .toLowerCase()
          .includes(text);
      return stageMatch && textMatch;
    });
  }, [stage, query]);

  return (
    <div className="screen guide">
      <header className="screen-head">
        <div>
          <p className="kicker">Panduan</p>
          <h1>Materi sesuai tahap.</h1>
          <p className="lede screen-lede">
            Ringkasan dari sumber resmi. Setiap materi menyebut sumbernya.
            Materi demo belum ditelaah tenaga kesehatan.
          </p>
        </div>
        <div className="head-meta">
          <Badge tone="warn">Belum ditelaah</Badge>
        </div>
      </header>

      <div className="guide-layout">
        <div className="guide-main">
          <div className="filter-bar">
            <div className="field search-field">
              <label htmlFor="guide-search">Cari panduan</label>
              <input
                id="guide-search"
                type="search"
                value={query}
                placeholder="Contoh: MPASI, pengukuran, tanda bahaya"
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <fieldset className="field chip-field">
              <legend>Tahap</legend>
              <div className="chip-wrap">
                <button
                  type="button"
                  className="chip"
                  aria-pressed={stage === "all"}
                  onClick={() => setStage("all")}
                >
                  Semua
                </button>
                {STAGES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="chip"
                    aria-pressed={stage === item.id}
                    onClick={() => setStage(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <p className="result-count" aria-live="polite">
            {filtered.length} materi ditemukan
          </p>

          {filtered.length === 0 ? (
            <EmptyState
              title="Belum ada materi yang cocok"
              action={
                <button
                  type="button"
                  className="btn btn-ghost btn-small"
                  onClick={() => {
                    setQuery("");
                    setStage("all");
                  }}
                >
                  Atur ulang pencarian
                </button>
              }
            >
              Coba kata lain atau pilih tahap “Semua”.
            </EmptyState>
          ) : (
            <div className="material-list">
              {filtered.map((item) => (
                <details key={item.id} className="material">
                  <summary>
                    <div className="material-head">
                      <span className="material-category">{item.category}</span>
                      <h2>{item.title}</h2>
                      <span className="material-source">{item.source}</span>
                    </div>
                    <span className="material-toggle" aria-hidden="true">
                      <Icon name="chevron" size={18} />
                    </span>
                  </summary>
                  <div className="material-body">
                    <p>{item.summary}</p>
                    <div className="takeaway">
                      <span className="kicker">Yang perlu diingat</span>
                      <p>{item.takeaway}</p>
                    </div>
                    <p className="material-meta">
                      <Badge tone="neutral">Contoh demo</Badge>
                      <span>
                        Sumber: {item.source}. Status telaah: belum ditetapkan.
                      </span>
                    </p>
                  </div>
                </details>
              ))}
            </div>
          )}

          <section aria-labelledby="myth-title" className="myths">
            <SectionHead
              kicker="Mitos dan fakta"
              title="Klaim yang tidak dipakai produk"
              lede="Beberapa kalimat populer justru menyesatkan. Ini koreksinya menurut sumber."
            />
            <div className="myth-list">
              {MYTHS.map((item) => (
                <details key={item.myth} className="myth">
                  <summary>
                    <span className="myth-label">Mitos</span>
                    <span>{item.myth}</span>
                  </summary>
                  <div className="myth-body">
                    <span className="fact-label">Fakta</span>
                    <p>{item.fact}</p>
                    <span className="source-chip">Sumber {item.source}</span>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section aria-labelledby="ref-title" className="references">
            <SectionHead
              kicker="Referensi"
              title="Sumber yang dipakai rancangan"
              lede="Nomor mengikuti dokumen rancangan halaman 33 dan 34. Periksa ulang versi pedoman sebelum rilis."
            />
            <ol className="reference-list">
              {SOURCES.map((source) => (
                <li key={source.id}>
                  <span className="source-id">{source.id}</span>
                  <div>
                    <p className="source-org">{source.org}</p>
                    <p className="source-title">{source.title}</p>
                    <p className="source-note">{source.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="guide-aside" aria-label="Panduan cepat">
          <section className="aside-card help-card" aria-labelledby="help-title">
            <span className="kicker">Bantuan</span>
            <h2 id="help-title">Tanda bahaya tidak menunggu formulir.</h2>
            <p>
              Contoh yang perlu bantuan segera: perdarahan banyak atau sulit
              bernapas setelah melahirkan; bayi tidak mau menyusu, kejang, atau
              kesulitan bernapas.
            </p>
            <p className="fine-note">
              Daftar ini tidak lengkap. Hubungi layanan darurat setempat atau
              fasilitas kesehatan terdekat. Jangan menunggu aplikasi.
            </p>
          </section>

          <section className="aside-card" aria-labelledby="mental-title">
            <h2 id="mental-title">Dukungan emosional</h2>
            <p className="muted">
              Bila ada pikiran melukai diri, cari bantuan segera dan hubungi
              orang tepercaya atau layanan darurat. Ini bukan tips nutrisi
              biasa.
            </p>
          </section>

          <section className="aside-card" aria-labelledby="ai-title">
            <h2 id="ai-title">Posisi AI</h2>
            <p className="muted">
              AI tidak dipakai untuk diagnosis, dosis, kategori antropometri,
              atau menyatakan aman dari gejala. Purwarupa ini tidak memakai AI.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
