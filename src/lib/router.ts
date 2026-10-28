import { useEffect, useState } from "react";
import type { Screen, StageId } from "../types";

export type RouteName = "landing" | "mulai" | Screen;

const ROUTES: RouteName[] = [
  "landing",
  "mulai",
  "hari-ini",
  "rencana",
  "catatan",
  "panduan",
  "keluarga",
];

const PUBLIC_SECTIONS = ["perjalanan", "beda", "sumber", "konten-publik"];

function readRoute(): RouteName {
  const raw = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  if (!raw) return "landing";
  return ROUTES.includes(raw as RouteName) ? (raw as RouteName) : "landing";
}

export function useRoute(): RouteName {
  const [route, setRoute] = useState<RouteName>(readRoute);

  useEffect(() => {
    const onChange = () => {
      const target = window.location.hash.replace(/^#\/?/, "").split("?")[0];
      // Section anchors use the same hash as app routes; preserve native scrolling.
      if (!target || ROUTES.includes(target as RouteName)) {
        setRoute(readRoute());
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      } else if (PUBLIC_SECTIONS.includes(target)) {
        setRoute("landing");
      }
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  useEffect(() => {
    const target = window.location.hash.slice(1);
    if (route === "landing" && PUBLIC_SECTIONS.includes(target)) {
      document.getElementById(target)?.scrollIntoView({ block: "start" });
    }
  }, [route]);

  return route;
}

export function navigate(route: RouteName, options?: { stage?: StageId }) {
  const suffix = options?.stage ? `?tahap=${encodeURIComponent(options.stage)}` : "";
  const next = route === "landing" ? "#/" : `#/${route}${suffix}`;
  if (window.location.hash === next) {
    window.scrollTo({ top: 0 });
    return;
  }
  window.location.hash = next;
}
