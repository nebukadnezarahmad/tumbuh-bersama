import { useEffect } from "react";
import { useStore } from "./store";
import { useRoute } from "./lib/router";
import { AppShell } from "./components/AppShell";
import { SkipLink } from "./components/ui";
import { Landing } from "./screens/Landing";
import { Onboarding } from "./screens/Onboarding";
import { Today } from "./screens/Today";
import { Plan } from "./screens/Plan";
import { Notes } from "./screens/Notes";
import { Guide } from "./screens/Guide";
import { Family } from "./screens/Family";
import type { Screen } from "./types";

const TITLES: Record<string, string> = {
  landing: "TumbuhBersama — Langkah kecil, tumbuh bersama",
  mulai: "Mulai — TumbuhBersama",
  "hari-ini": "Hari Ini — TumbuhBersama",
  rencana: "Rencana — TumbuhBersama",
  catatan: "Catatan — TumbuhBersama",
  panduan: "Panduan — TumbuhBersama",
  keluarga: "Keluarga — TumbuhBersama",
};

const APP_SCREENS: Screen[] = [
  "hari-ini",
  "rencana",
  "catatan",
  "panduan",
  "keluarga",
];

export default function App() {
  const route = useRoute();
  const { state } = useStore();
  const isApp = APP_SCREENS.includes(route as Screen);

  useEffect(() => {
    document.title = TITLES[route] ?? TITLES.landing;
  }, [route]);

  useEffect(() => {
    if (isApp && !state.profile) {
      window.location.hash = "#/mulai";
    }
  }, [isApp, state.profile]);

  if (route === "landing") return <Landing />;
  if (route === "mulai") return <Onboarding />;
  if (!state.profile) return <Onboarding />;

  const screen = route as Screen;

  return (
    <>
      <SkipLink target="konten">Lewati ke konten utama</SkipLink>
      <AppShell screen={screen}>
        {screen === "hari-ini" ? <Today /> : null}
        {screen === "rencana" ? <Plan /> : null}
        {screen === "catatan" ? <Notes /> : null}
        {screen === "panduan" ? <Guide /> : null}
        {screen === "keluarga" ? <Family /> : null}
      </AppShell>
    </>
  );
}
