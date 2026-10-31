import { useRef, useState } from "react";
import { useStore, buildDemoState } from "../store";
import { SOURCES, STAGES } from "../data";
import { navigate } from "../lib/router";
import { Brand } from "../components/AppShell";
import { Icon, SkipLink } from "../components/ui";
import { PixelGrid } from "../components/PixelGrid";
import type { Screen } from "../types";

const TASKS = [
  {
    title: "Siapkan catatan untuk posyandu",
    owner: "Ibu",
    due: "Jumat",
    icon: "notes",
  },
  {
    title: "Belanja bahan MPASI",
    owner: "Ayah",
    due: "Besok",
    icon: "utensils",
  },
  {
    title: "Luangkan waktu bermain bersama",
    owner: "Bersama",
    due: "Hari ini",
    icon: "heart",
  },
];
const TOOLS = [
  {
    id: "hari-ini" as Screen,
    icon: "plan",
    title: "Yang penting, terlihat jelas.",
    label: "Prioritas harian",
    description:
      "Cukup tiga prioritas dalam seminggu. Tentukan siapa yang mengerjakan dan kapan. Ada yang berubah? Rencananya bisa ikut menyesuaikan.",
    action: "Lihat contoh prioritas",
  },
  {
    id: "rencana" as Screen,
    icon: "utensils",
    title: "Menu berangkat dari dapurmu.",
    label: "Rencana menu",
    description:
      "Mulai dari bahan yang ada, waktu memasak, dan anggaran keluarga. Pilih menu lokal, cek alergi, lalu siapkan daftar belanjanya.",
    action: "Jelajahi menu keluarga",
  },
  {
    id: "catatan" as Screen,
    icon: "ruler",
    title: "Catatan kecil, cerita lebih utuh.",
    label: "Catatan tumbuh",
    description:
      "Simpan hasil pengukuran dan pertanyaan yang sering terlupa. Saat jadwal konsultasi tiba, ringkasannya sudah siap dibawa.",
    action: "Buka contoh catatan",
  },
];

export function Landing() {
  const { state, setState } = useStore();
  const [selectedStage, setSelectedStage] = useState(4);
  const [checked, setChecked] = useState<number[]>([]);
  const [activeTool, setActiveTool] = useState(0);
  const menuRef = useRef<HTMLDetailsElement>(null);
  const hasProfile = state.profile !== null;
  const stage = STAGES[selectedStage];
  const tool = TOOLS[activeTool];
  const openScreen = (screen: Screen) => {
    if (!hasProfile) setState(() => buildDemoState());
    navigate(screen);
  };
  const start = () => navigate(hasProfile ? "hari-ini" : "mulai");
  const toggleTask = (index: number) =>
    setChecked((previous) =>
      previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index],
    );
  const closeMenu = () => {
    if (menuRef.current) menuRef.current.open = false;
  };
  const links = (
    <>
      <a href="#perjalanan" onClick={closeMenu}>
        Tahap keluarga
      </a>
      <a href="#beda" onClick={closeMenu}>
        Ruang bersama
      </a>
      <a href="#sumber" onClick={closeMenu}>
        Tentang kami
      </a>
    </>
  );

  return (
    <div className="tb-landing">
      <SkipLink target="konten-publik">Lewati ke konten</SkipLink>
      <header className="tb-header">
        <div className="tb-container tb-header-inner">
          <Brand compact />
          <nav className="tb-desktop-nav" aria-label="Navigasi halaman">
            {links}
          </nav>
          <div className="tb-header-actions">
            <button
              className="tb-demo-link"
              type="button"
              onClick={() => openScreen("hari-ini")}
            >
              {hasProfile ? "Ruang keluargaku" : "Coba demo"}
              <Icon name="arrow" size={16} />
            </button>
            <button
              className="btn btn-primary tb-header-start"
              type="button"
              onClick={start}
            >
              {hasProfile ? "Lanjutkan" : "Mulai sekarang"}
            </button>
            <details
              ref={menuRef}
              className="tb-mobile-menu"
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  closeMenu();
                  menuRef.current?.querySelector("summary")?.focus();
                }
              }}
            >
              <summary aria-label="Buka menu navigasi">
                <span>Menu</span>
                <Icon name="list" size={21} />
              </summary>
              <nav aria-label="Navigasi halaman mobile">
                {links}
                <button type="button" onClick={start}>
                  {hasProfile ? "Lanjutkan rencanaku" : "Mulai sekarang"}
                  <Icon name="arrow" size={16} />
                </button>
              </nav>
            </details>
          </div>
        </div>
      </header>
      <main id="konten-publik" tabIndex={-1}>
        <section className="tb-hero" aria-labelledby="hero-title">
          <PixelGrid />
          <div className="tb-container tb-hero-grid">
            <div className="tb-hero-copy">
              <p className="tb-eyebrow">
                <span />
                TEMAN BERTUMBUH KELUARGA
              </p>
              <h1 id="hero-title">
                Langkah kecil.
                <br />
                <em>Tumbuh bersama.</em>
              </h1>
              <p className="tb-hero-lede">
                Menjadi orang tua tak harus serba tahu.
                <br className="tb-desktop-break" /> Siapkan hari dengan rencana
                yang sederhana, menu dari dapur sendiri, dan peran yang dibagi
                bersama.
              </p>
              <div className="tb-hero-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={start}
                >
                  {hasProfile ? "Lanjutkan rencanaku" : "Mulai dari tahapku"}
                  <Icon name="arrow" size={18} />
                </button>
                <a className="tb-text-link" href="#beda">
                  Kenali ruang bersama
                  <Icon name="chevron" size={16} />
                </a>
              </div>
              <p className="tb-private">
                <Icon name="shield" size={15} />
                Tanpa akun. Catatan tersimpan di perangkatmu.
              </p>
              <div className="tb-hero-footnote">
                <span className="tb-small-sprout" aria-hidden="true">
                  <Icon name="heart" size={18} />
                </span>
                <span>
                  Dari menanti kehadiran,
                  <br />
                  <strong>sampai langkah kecil pertamanya.</strong>
                </span>
              </div>
            </div>
            <div className="tb-hero-visual">
              <div className="tb-preview-caption">
                <span>SEPERTI INI, SATU LANGKAH DIMULAI</span>
                <span className="tb-example-dot">Data contoh</span>
              </div>
              <div className="tb-daily-preview">
                <div className="tb-preview-top">
                  <span>
                    <Icon name="today" size={19} />
                    Ruang keluarga
                  </span>
                  <span className="tb-avatar">R</span>
                </div>
                <div className="tb-preview-greeting">
                  <div>
                    <p>Rani & keluarga</p>
                    <h2>
                      Hari yang baik
                      <br />
                      dimulai bersama.
                    </h2>
                  </div>
                  <span className="tb-stage-tag">Alya · 9 bulan</span>
                </div>
                <div className="tb-priority-label">
                  <strong>Fokus minggu ini</strong>
                  <span aria-live="polite">{checked.length}/3 selesai</span>
                </div>
                <div className="tb-preview-progress" aria-hidden="true">
                  <span style={{ width: `${(checked.length / 3) * 100}%` }} />
                </div>
                <ul className="tb-preview-tasks">
                  {TASKS.map((task, index) => (
                    <li
                      key={task.title}
                      className={checked.includes(index) ? "is-done" : ""}
                    >
                      <button
                        type="button"
                        aria-pressed={checked.includes(index)}
                        aria-label={`Selesaikan contoh: ${task.title}`}
                        onClick={() => toggleTask(index)}
                      >
                        <span>
                          {checked.includes(index) ? (
                            <Icon name="check" size={15} />
                          ) : null}
                        </span>
                      </button>
                      <div>
                        <strong>{task.title}</strong>
                        <span>
                          {task.owner}
                          <i />
                          {task.due}
                        </span>
                      </div>
                      <Icon name={task.icon} size={17} />
                    </li>
                  ))}
                </ul>
                <p className="tb-preview-note" aria-live="polite">
                  <Icon
                    name={checked.length === 3 ? "check" : "family"}
                    size={16}
                  />
                  {checked.length === 3
                    ? "Tiga langkah selesai. Ada waktu untuk beristirahat."
                    : "Tak harus sekaligus. Satu per satu juga berarti."}
                </p>
              </div>
              <div className="tb-shared-note">
                <span className="tb-shared-icon">
                  <Icon name="heart" size={21} />
                </span>
                <p>
                  <strong>Ada yang bisa dibantu?</strong>
                  <span>Peran kecil pun berarti besar.</span>
                </p>
                <span className="tb-shared-avatars" aria-hidden="true">
                  <i>R</i>
                  <i>A</i>
                </span>
              </div>
            </div>
          </div>
          <div className="tb-container tb-hero-bottom">
            <span>Setiap keluarga punya ritmenya sendiri.</span>
            <a href="#perjalanan">
              Temukan tahap keluargamu
              <Icon name="chevron" size={15} />
            </a>
          </div>
        </section>

        <section
          id="perjalanan"
          className="tb-journey tb-container tb-section"
          aria-labelledby="journey-title"
        >
          <div className="tb-section-heading">
            <div>
              <p className="tb-eyebrow">SETIAP TAHAP, ADA TEMANNYA</p>
              <h2 id="journey-title">
                Kamu sedang di
                <br />
                <em>cerita yang mana?</em>
              </h2>
            </div>
            <p>
              Tak perlu mulai dari awal.
              <br />
              Pilih tahap keluargamu sekarang, lalu temukan hal kecil yang bisa
              disiapkan.
            </p>
          </div>
          <div
            className="tb-stage-options"
            role="group"
            aria-label="Pilih tahap keluarga"
          >
            {STAGES.map((item, index) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={index === selectedStage}
                onClick={() => setSelectedStage(index)}
              >
                <span className="tb-stage-number">
                  {item.num}
                  <span aria-hidden="true">
                    {index === selectedStage ? (
                      <Icon name="check" size={14} />
                    ) : null}
                  </span>
                </span>
                <strong>{item.short}</strong>
                <span>
                  {
                    [
                      "Sebelum hamil",
                      "Masa kehamilan",
                      "Pemulihan ibu",
                      "Usia 0–5 bulan",
                      "Usia 6–23 bulan",
                      "Usia 2–5 tahun",
                    ][index]
                  }
                </span>
              </button>
            ))}
          </div>
          <div
            className="tb-stage-detail"
            aria-live="polite"
            aria-atomic="true"
          >
            <div>
              <span className="tb-detail-kicker">CERITA {stage.num} / 06</span>
              <h3>{stage.label}</h3>
              <p>{stage.summary}</p>
            </div>
            <ul>
              {stage.focus.map((focus) => (
                <li key={focus}>
                  <Icon name="check" size={16} />
                  <span>{focus}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("mulai", { stage: stage.id })}
            >
              Mulai tahap ini
              <Icon name="arrow" size={17} />
            </button>
          </div>
        </section>

        <section id="beda" className="tb-tools" aria-labelledby="tools-title">
          <div className="tb-container tb-section">
            <div className="tb-section-heading">
              <div>
                <p className="tb-eyebrow">SATU RUANG, DIJALANI BERSAMA</p>
                <h2 id="tools-title">
                  Lebih ringan saat
                  <br />
                  <em>ada yang menemani.</em>
                </h2>
              </div>
              <p>
                Untuk hal-hal sehari-hari yang terasa kecil,
                <br />
                tapi penting bagi keluarga.
              </p>
            </div>
            <div className="tb-workspace">
              <div
                className="tb-tool-choices"
                role="group"
                aria-label="Jelajahi fitur"
              >
                {TOOLS.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={index === activeTool}
                    aria-controls="contoh-fitur"
                    aria-label={item.label}
                    onClick={() => setActiveTool(index)}
                  >
                    <span className="tb-tool-icon">
                      <Icon name={item.icon} size={22} />
                    </span>
                    <span>
                      <small>
                        <span aria-hidden="true">0{index + 1} / </span>
                        {item.label}
                      </small>
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </span>
                    <Icon name="arrow" size={18} />
                  </button>
                ))}
              </div>
              <div
                className="tb-mobile-tool-copy"
                aria-live="polite"
                aria-atomic="true"
              >
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
              </div>
              <div
                id="contoh-fitur"
                className="tb-tool-preview"
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="tb-tool-preview-top">
                  <span>
                    <Icon name={tool.icon} size={18} />
                    {tool.label}
                  </span>
                  <span>CONTOH</span>
                </div>
                {activeTool === 0 ? (
                  <div className="tb-work-example">
                    <span className="tb-work-tag">MINGGU INI</span>
                    <h3>
                      Sedikit rencana.
                      <br />
                      Lebih banyak ruang.
                    </h3>
                    <ul className="tb-work-checklist">
                      <li>
                        <Icon name="check" size={17} />
                        <span>
                          Jadwalkan kunjungan posyandu<small>Ibu · Jumat</small>
                        </span>
                        <span className="tb-status-done">Selesai</span>
                      </li>
                      <li>
                        <span className="tb-outline-check" />
                        <span>
                          Siapkan bahan menu minggu ini
                          <small>Ayah · Besok</small>
                        </span>
                      </li>
                      <li>
                        <span className="tb-outline-check" />
                        <span>
                          Catat pertanyaan untuk bidan
                          <small>Bersama · Minggu ini</small>
                        </span>
                      </li>
                    </ul>
                    <p className="tb-work-footnote">
                      Pemilik, tenggat, dan alasan. Semuanya jelas.
                    </p>
                  </div>
                ) : activeTool === 1 ? (
                  <div className="tb-work-example">
                    <span className="tb-work-tag">DARI DAPUR KELUARGA</span>
                    <h3>
                      Yang ada di rumah,
                      <br />
                      bisa jadi awal.
                    </h3>
                    <div className="tb-ingredient-tags">
                      <span>Telur</span>
                      <span>Labu siam</span>
                      <span>Bawang putih</span>
                    </div>
                    <div className="tb-menu-example">
                      <Icon name="utensils" size={34} />
                      <h4>Telur orak-arik labu</h4>
                      <p>15 menit · Bahan lokal</p>
                      <span>
                        Sesuaikan tekstur dengan tahap anak.
                        <br />
                        Cek alergi sebelum memilih bahan.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="tb-work-example">
                    <span className="tb-work-tag">BEKAL UNTUK KONSULTASI</span>
                    <h3>
                      Supaya tak ada
                      <br />
                      yang terlupa.
                    </h3>
                    <div className="tb-notes-example">
                      <p>
                        <Icon name="ruler" size={18} />
                        <strong>Catatan pengukuran</strong>
                      </p>
                      <div>
                        <span>Tanggal ukur</span>
                        <strong>12 Oktober 2026</strong>
                      </div>
                      <div>
                        <span>Berat badan</span>
                        <strong>8,2 kg</strong>
                      </div>
                      <div>
                        <span>Panjang badan</span>
                        <strong>70 cm</strong>
                      </div>
                      <p>
                        <Icon name="notes" size={17} />
                        “Apa tekstur MPASI berikutnya?”
                      </p>
                    </div>
                    <p className="tb-work-footnote">
                      Data ilustratif, bukan penilaian kesehatan.
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  className="tb-tool-open"
                  onClick={() => openScreen(tool.id)}
                >
                  {tool.action}
                  <Icon name="arrow" size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          className="tb-together tb-container tb-section"
          aria-labelledby="together-title"
        >
          <figure className="tb-family-photo">
            <img
              src="/images/family-editorial.jpg"
              alt="Ilustrasi seorang ibu dan bayinya menikmati waktu bersama di rumah"
              width="1536"
              height="1024"
              loading="lazy"
            />
            <figcaption>
              Waktu bersama, dengan ritme sendiri. <span>Ilustrasi AI</span>
            </figcaption>
          </figure>
          <div className="tb-together-copy">
            <p className="tb-eyebrow">TUMBUH ITU KERJA BERSAMA</p>
            <h2 id="together-title">
              Tak semua harus
              <br />
              <em>kamu pegang sendiri.</em>
            </h2>
            <p>
              Ada hari yang rapi, ada hari yang berubah. TumbuhBersama memberi
              tempat untuk menyusun ulang rencana, membagi tugas, dan mengingat
              hal yang berarti.
            </p>
            <div className="tb-together-note">
              <Icon name="family" size={24} />
              <p>
                <strong>Untuk ibu, ayah, dan yang ikut merawat.</strong>
                <span>
                  Karena dukungan dimulai dari hal yang bisa dilakukan hari ini.
                </span>
              </p>
            </div>
            <button
              type="button"
              className="tb-text-link"
              onClick={() => openScreen("keluarga")}
            >
              Lihat ruang keluarga
              <Icon name="arrow" size={17} />
            </button>
          </div>
        </section>

        <section
          id="sumber"
          className="tb-trust tb-container tb-section"
          aria-labelledby="trust-title"
        >
          <div>
            <p className="tb-eyebrow">KENALI DULU, MULAI DENGAN TENANG</p>
            <h2 id="trust-title">
              Ruang yang sederhana.
              <br />
              <em>Batas yang jelas.</em>
            </h2>
            <p>
              TumbuhBersama membantu menyiapkan keseharian dan percakapan dengan
              tenaga kesehatan.
            </p>
            <span className="tb-prototype-label">
              Purwarupa · Penyimpanan lokal
            </span>
          </div>
          <div className="tb-faq">
            <details>
              <summary>
                Perlu membuat akun untuk mulai?
                <Icon name="plus" size={18} />
              </summary>
              <p>
                Tidak. Pilih tahap keluarga, lalu mulai menyusun rencana. Nama
                dan tanggal bisa dilengkapi nanti.
              </p>
            </details>
            <details>
              <summary>
                Di mana catatan keluargaku disimpan?
                <Icon name="plus" size={18} />
              </summary>
              <p>
                Catatan tersimpan di peramban pada perangkat ini, tanpa
                sinkronisasi antarperangkat. Ekspor cadangan lewat halaman
                Keluarga. Menghapus data peramban juga dapat menghapus catatan.
              </p>
            </details>
            <details>
              <summary>
                Apakah ini pengganti konsultasi kesehatan?
                <Icon name="plus" size={18} />
              </summary>
              <p>
                TumbuhBersama adalah alat bantu rencana dan pencatatan, bukan
                layanan diagnosis. Hasil pengukuran tidak menghasilkan skor atau
                diagnosis otomatis. Bawa catatan untuk dibahas dengan bidan,
                dokter, atau tenaga kesehatan.
              </p>
            </details>
            <details>
              <summary>
                Apa rujukan dalam rancangan ini?
                <Icon name="plus" size={18} />
              </summary>
              <div className="tb-sources">
                <p>
                  Rancangan mengacu pada sumber berikut. Materi dalam purwarupa
                  belum menggantikan penelaahan profesional.
                </p>
                {SOURCES.slice(0, 5).map((source) => (
                  <p key={source.id}>
                    <strong>{source.org}</strong>
                    <span>{source.title}</span>
                  </p>
                ))}
                <button
                  type="button"
                  className="tb-text-link"
                  onClick={() => openScreen("panduan")}
                >
                  Baca panduan & sumber
                  <Icon name="arrow" size={15} />
                </button>
              </div>
            </details>
          </div>
        </section>
        <section className="tb-closing" aria-labelledby="closing-title">
          <div className="tb-container">
            <div>
              <p className="tb-eyebrow">TAK PERLU SEMPURNA UNTUK MEMULAI</p>
              <h2 id="closing-title">
                Satu langkah hari ini.
                <br />
                <em>Untuk cerita yang panjang.</em>
              </h2>
            </div>
            <div>
              <button type="button" className="btn btn-light" onClick={start}>
                {hasProfile
                  ? "Kembali ke rencanaku"
                  : "Mulai cerita keluargaku"}
                <Icon name="arrow" size={18} />
              </button>
              <p>Pilih tahapmu. Kita mulai dari sana.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="tb-footer tb-container">
        <div>
          <Brand compact />
          <p>Langkah kecil untuk hari-hari bersama.</p>
        </div>
        <nav aria-label="Navigasi footer">{links}</nav>
        <span>© {new Date().getFullYear()} TumbuhBersama</span>
      </footer>
    </div>
  );
}
