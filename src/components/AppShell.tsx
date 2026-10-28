import type { ReactNode } from "react";
import type { Screen } from "../types";
import { useStore } from "../store";
import { STAGES } from "../data";
import { navigate, type RouteName } from "../lib/router";
import { Icon } from "./ui";

const NAV: Array<{ id: Screen; label: string; icon: string }> = [
  { id: "hari-ini", label: "Hari Ini", icon: "today" },
  { id: "rencana", label: "Rencana", icon: "plan" },
  { id: "catatan", label: "Catatan", icon: "notes" },
  { id: "panduan", label: "Panduan", icon: "guide" },
  { id: "keluarga", label: "Keluarga", icon: "family" },
];

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a
      className="brand"
      href="#/"
    >
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
          <path
            d="M12 21V10M12 10c0-4 3-6.5 7.5-6.5C19.5 7.5 16.5 10 12 10ZM12 14c0-3-2.5-5-6.5-5 0 3 2.5 5 6.5 5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="brand-name">
        TumbuhBersama<span className="brand-dot">.</span>
        {!compact ? <span className="brand-suffix">Purwarupa</span> : null}
      </span>
      <span className="sr-only">, kembali ke beranda</span>
    </a>
  );
}

export function AppShell({
  screen,
  children,
}: {
  screen: Screen;
  children: ReactNode;
}) {
  const { state } = useStore();
  const stage = STAGES.find((item) => item.id === state.profile?.stage);
  const activeTaskCount = state.tasks.filter(
    (task) => task.status !== "selesai",
  ).length;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <Brand compact />
          <div className="app-header-meta">
            {state.demo ? <span className="demo-tag">Data contoh</span> : null}
            {stage ? <span className="stage-pill">{stage.label}</span> : null}
            {state.profile ? (
              <span className="header-name">{state.profile.motherName}</span>
            ) : null}
          </div>
        </div>
      </header>

      <div className="app-body">
        <aside className="app-side" aria-label="Navigasi samping">
          <div className="side-family">
            <span className="family-monogram" aria-hidden="true">{state.profile?.motherName.slice(0, 1).toUpperCase() || "K"}</span>
            <div><strong>Keluarga {state.profile?.motherName || "kita"}</strong><span>{stage?.short || "Ruang keluarga"}</span></div>
          </div>
          <p className="side-section-label">Ruang keluarga</p>
          <nav aria-label="Navigasi aplikasi">
            <ul className="side-nav">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#/${item.id}`}
                    aria-current={screen === item.id ? "page" : undefined}
                    className="side-link"
                  >
                    <Icon name={item.icon} size={18} />
                    <span>{item.label}</span>
                    {item.id === "hari-ini" && activeTaskCount > 0 ? (
                      <span className="nav-count" aria-hidden="true">
                        {activeTaskCount}
                      </span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="side-note">
            <p>
              <strong>Purwarupa.</strong> Materi dan angka adalah contoh. Bukan
              layanan kesehatan.
            </p>
            <a href="#/" className="text-link">
              Kembali ke beranda
            </a>
          </div>
        </aside>

        <main id="konten" className="app-main" tabIndex={-1}>
          {state.demo ? (
            <div className="demo-banner no-print">
              <span>
                Mode demo dengan keluarga fiktif. Data tersimpan di peramban
                ini.
              </span>
              <a href="#/keluarga">Kelola data</a>
            </div>
          ) : null}
          {children}
        </main>
      </div>

      <nav className="bottom-nav" aria-label="Navigasi utama">
        {NAV.map((item) => (
          <a
            key={item.id}
            href={`#/${item.id}`}
            className="bottom-link"
            aria-current={screen === item.id ? "page" : undefined}
          >
            <span className="bottom-icon">
              <Icon name={item.icon} size={21} />
              {item.id === "hari-ini" && activeTaskCount > 0 ? (
                <span className="bottom-dot" aria-hidden="true" />
              ) : null}
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}

export function goTo(route: Exclude<RouteName, "landing">) {
  navigate(route);
}
