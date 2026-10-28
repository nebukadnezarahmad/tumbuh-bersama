import { useEffect, useState } from "react";
import { useStore, buildDemoState } from "../store";
import { SOURCES, STAGES } from "../data";
import { navigate } from "../lib/router";
import { Brand } from "../components/AppShell";
import { DemoTag, Icon, SkipLink } from "../components/ui";
import { AlbumHeadline, AlbumPhoto, ReadingProgress, Reveal, ScrollStory, useMotionSettings } from "../components/ScrollExperience";
import type { Screen } from "../types";

const EXAMPLE_TASKS = [
  { title: "Siapkan catatan kontrol", owner: "Kamu", due: "Jumat" },
  { title: "Belanja menu terpilih", owner: "Pengasuh", due: "Kamis" },
  { title: "Catat dua pertanyaan", owner: "Kamu", due: "Minggu ini" },
];

function SectionLinks({ onNavigate, active = "" }: { onNavigate?: () => void; active?: string }) {
  return (
    <>
      <a href="#perjalanan" aria-current={active === "perjalanan" ? "location" : undefined} onClick={onNavigate}>Tahap keluarga</a>
      <a href="#beda" aria-current={active === "beda" ? "location" : undefined} onClick={onNavigate}>Cara mendampingi</a>
      <a href="#sumber" aria-current={active === "sumber" ? "location" : undefined} onClick={onNavigate}>Sumber & batas</a>
    </>
  );
}

export function Landing() {
  const { state, setState } = useStore();
  const [selectedStage, setSelectedStage] = useState(4);
  const [checked, setChecked] = useState<number[]>([]);
  const [activeSection, setActiveSection] = useState("");
  const { enabled } = useMotionSettings();
  const stage = STAGES[selectedStage];
  const hasProfile = state.profile !== null;
  const openDemo = () => {
    if (!hasProfile) setState(() => buildDemoState());
    navigate("hari-ini");
  };
  const openScreen = (screen: Screen) => {
    if (!hasProfile) setState(() => buildDemoState());
    navigate(screen);
  };
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.filter((entry) => entry.isIntersecting).forEach((entry) => setActiveSection(entry.target.id));
    }, { rootMargin: "-20% 0px -50% 0px" });
    document.querySelectorAll(".premium-hero, #perjalanan, #beda, #sumber").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`premium-landing taste-page ${enabled ? "motion-enabled" : "motion-static"}`}>
      <ReadingProgress />
      <SkipLink target="konten-publik">Lewati ke konten</SkipLink>
      <header className="premium-header">
        <div className="premium-header-inner">
          <Brand compact />
          <nav className="premium-desktop-nav" aria-label="Navigasi halaman"><SectionLinks active={activeSection} /></nav>
          <div className="premium-header-actions">
            <button type="button" className="btn btn-primary btn-small" onClick={openDemo}>
              {hasProfile ? "Ruang keluargaku" : "Coba demo"}
            </button>
            <details className="premium-mobile-menu" onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.currentTarget.open = false;
                event.currentTarget.querySelector("summary")?.focus();
              }
            }}>
              <summary>Menu<Icon name="chevron" size={15} /></summary>
              <nav aria-label="Navigasi halaman mobile">
                <SectionLinks active={activeSection} onNavigate={() => document.querySelector<HTMLDetailsElement>(".premium-mobile-menu")?.removeAttribute("open")} />
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main id="konten-publik" tabIndex={-1}>
        <section className="premium-hero" aria-labelledby="hero-title">
          <div className="premium-hero-copy">
            <AlbumHeadline />
            <p>Rencana sederhana, menu sehari-hari, dan catatan tumbuh. Lebih terarah menjalani hari, dari rencana kehamilan sampai balita.</p>
            <div className="premium-hero-actions">
              <button type="button" className="btn btn-primary" onClick={() => hasProfile ? navigate("hari-ini") : navigate("mulai")}>
                {hasProfile ? "Lanjutkan rencanaku" : "Mulai perjalananmu"}<Icon name="arrow" size={16} />
              </button>
              <a className="premium-text-action" href="#beda">Lihat cara kerjanya<Icon name="chevron" size={15} /></a>
            </div>
            <p className="premium-private"><Icon name="shield" size={14} />Tanpa akun. Tersimpan di perambanmu.</p>
          </div>
          <AlbumPhoto />
        </section>

        <Reveal className="premium-promise-strip" kind="side">
          <p>Lebih sedikit yang harus diingat.<br /><strong>Lebih banyak yang bisa dijalani bersama.</strong></p>
          <span>Prioritas yang jelas</span><span>Peran yang bisa dibagi</span><span>Catatan yang berlanjut</span>
        </Reveal>

        <section id="perjalanan" className="premium-journey" aria-labelledby="journey-title">
          <Reveal className="premium-section-head">
            <div><h2 id="journey-title">Mulai dari tahapmu.</h2></div>
            <p>Kebutuhan berubah. Pendampingan ikut menyesuaikan. Pilih tahap untuk melihat fokusnya.</p>
          </Reveal>
          <div className="premium-stage-options" role="group" aria-label="Pilih tahap keluarga">
            {STAGES.map((item, index) => (
              <button key={item.id} type="button" aria-pressed={selectedStage === index} onClick={() => setSelectedStage(index)}>
                <strong>{item.short}</strong><span>{item.label}</span>
              </button>
            ))}
          </div>
          <Reveal className="premium-stage-detail" kind="side">
            <div className="premium-stage-copy" aria-live="polite" aria-atomic="true">
              <h3>{stage.label}</h3><p>{stage.summary}</p>
            </div>
            <ul aria-label={`Fokus ${stage.label}`}>
              {stage.focus.map((focus) => <li key={focus}><Icon name="check" size={16} /><span>{focus}</span></li>)}
            </ul>
            <div className="premium-stage-action">
              <button type="button" className="btn btn-primary" onClick={() => navigate("mulai", { stage: stage.id })}>Mulai tahap ini<Icon name="arrow" size={16} /></button>
              <p>Contoh rancangan.<br />Belum ditelaah secara klinis.</p>
            </div>
          </Reveal>
        </section>

        <ScrollStory onOpen={openScreen} />

        <section className="premium-product" aria-labelledby="product-title">
          <Reveal className="premium-product-copy">
            <h2 id="product-title">Coba satu langkah.</h2>
            <p>Tak perlu mengingat semuanya. Tentukan yang penting, lalu jalani sesuai kemampuan keluarga.</p>
            <div className="premium-feature-list">
              <div><Icon name="plan" size={21} /><div><h3>Prioritas, bukan tumpukan pengingat.</h3><p>Maksimal tiga tugas. Ada penanggung jawab dan tenggat yang bisa diubah.</p></div></div>
              <div><Icon name="utensils" size={21} /><div><h3>Menu yang dekat dengan rumah.</h3><p>Saring waktu, anggaran, dan bahan. Susun belanja dari menu pilihan.</p></div></div>
              <div><Icon name="notes" size={21} /><div><h3>Catatan untuk dibawa bercerita.</h3><p>Simpan pengukuran, siapkan pertanyaan, lalu cetak ringkasan konsultasi.</p></div></div>
            </div>
            <button type="button" className="premium-text-action" onClick={openDemo}>{hasProfile ? "Buka ruang keluargaku" : "Coba dengan data contoh"}<Icon name="arrow" size={16} /></button>
          </Reveal>
          <Reveal className="premium-demo-area" kind="settle" ui>
            <div className="premium-demo-card">
              <div className="premium-demo-bar"><span><Icon name="today" size={17} /> Hari ini</span><DemoTag /></div>
              <div className="premium-demo-title"><span>Rani & keluarga</span><h3>Rencana minggu ini.</h3><p>Alya, 9 bulan · Tahap MPASI</p></div>
              <div className="premium-demo-progress"><span aria-live="polite">{checked.length} dari 3 selesai</span><div aria-hidden="true"><span style={{ width: `${checked.length / 3 * 100}%` }} /></div></div>
              <ul className="premium-demo-tasks">
                {EXAMPLE_TASKS.map((task, index) => (
                  <li key={task.title} className={checked.includes(index) ? "is-complete" : ""}>
                    <button type="button" aria-pressed={checked.includes(index)} aria-label={`Selesaikan contoh: ${task.title}`} className="premium-demo-check" onClick={() => setChecked((previous) => previous.includes(index) ? previous.filter((item) => item !== index) : [...previous, index])}><span>{checked.includes(index) ? <Icon name="check" size={13} /> : null}</span></button>
                    <div><strong>{task.title}</strong><span>{task.owner} · {task.due}</span></div>
                  </li>
                ))}
              </ul>
              <div className="premium-demo-footer"><Icon name="family" size={18} /><span>Peran kecil, dikerjakan bersama.</span></div>
            </div>
            <p className="premium-demo-caption">Coba centang satu tugas. Ini hanya pratinjau.</p>
          </Reveal>
        </section>

        <section id="sumber" className="premium-trust" aria-labelledby="trust-title">
          <Reveal><h2 id="trust-title">Tahu batas.<br />Tetap membantu.</h2><p>Catatanmu membantu percakapan dengan tenaga kesehatan. Keputusan kesehatan tetap bersama ahlinya.</p></Reveal>
          <Reveal className="premium-trust-content" kind="side">
            <p className="premium-demo-notice"><DemoTag />Purwarupa dengan keluarga fiktif. Materi contoh belum ditelaah secara klinis.</p>
            <details><summary>Apa yang bisa dan tidak bisa dilakukan?<Icon name="plus" size={16} /></summary><div><p>Susun prioritas, pilih menu, dan simpan pengukuran mentah. Tidak ada prediksi IQ, diagnosis dari foto, z-score, atau saran dosis.</p><a href="#/panduan" className="premium-text-action" onClick={(event) => { event.preventDefault(); if (!hasProfile) setState(() => buildDemoState()); navigate("panduan"); }}>Buka panduan demo<Icon name="arrow" size={16} /></a></div></details>
            <details><summary>Di mana catatan disimpan?<Icon name="plus" size={16} /></summary><div><p>Data demo tersimpan di peramban perangkat ini. Tidak ada akun atau sinkronisasi. Kamu bisa mengekspor atau menghapusnya lewat halaman Keluarga.</p></div></details>
            <details><summary>Rujukan dalam rancangan<Icon name="plus" size={16} /></summary><ul className="premium-sources">{SOURCES.slice(0, 8).map((source) => <li key={source.id}><span>{source.id}</span><div><strong>{source.org}</strong><p>{source.title}</p><p>{source.note}</p></div></li>)}</ul><p className="premium-source-note">Daftar dari rancangan 1.0, 20 Oktober 2026. Relevansi klinis perlu ditelaah.</p></details>
          </Reveal>
        </section>

        <section className="premium-closing" aria-labelledby="closing-title">
          <Reveal><h2 id="closing-title">Mulai dari keluargamu.</h2></Reveal>
          <button type="button" className="btn btn-light" onClick={() => hasProfile ? navigate("hari-ini") : navigate("mulai")}>{hasProfile ? "Lanjutkan rencanaku" : "Susun rencana keluargaku"}<Icon name="arrow" size={16} /></button>
          <p>Mulai dari tahapmu. Lengkapi catatan saat kamu siap.</p>
        </section>
      </main>
      <footer className="premium-footer"><div><Brand compact /><p>Untuk tumbuh. Untuk bersama.</p></div><div><span>Purwarupa lokal · Rancangan 1.0</span><p>Bukan layanan kesehatan. Data demo fiktif.</p><a href="#sumber">Sumber & batas penggunaan</a></div></footer>
    </div>
  );
}
