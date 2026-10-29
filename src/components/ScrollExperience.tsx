"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { motionTokens, springs } from "../lib/motion-tokens";
import type { Screen } from "../types";

export function useMotionSettings() {
  const reduced = useReducedMotion();
  const [capable, setCapable] = useState(false);
  const [wide, setWide] = useState(false);
  const [forcedOff, setForcedOff] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 900px) and (min-height: 650px)");
    const update = () => setWide(media.matches);
    update();
    setCapable(!navigator.hardwareConcurrency || navigator.hardwareConcurrency > 4);
    setForcedOff(new URLSearchParams(window.location.search).get("motion") === "off");
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return { enabled: capable && reduced === false && !forcedOff, wide };
}

export function Reveal({ children, className = "", kind = "rise", ui = false }: {
  children: ReactNode; className?: string; kind?: "rise" | "side" | "settle"; ui?: boolean;
}) {
  const { enabled } = useMotionSettings();
  const effect = kind === "side" ? { scaleX: [motionTokens.scale.inline, motionTokens.scale.rest] }
    : kind === "settle" ? { scale: [motionTokens.scale.settle, motionTokens.scale.rest] }
    : { y: [motionTokens.distance.normal, 0] };
  return <motion.div className={className} data-ui={ui || undefined} initial={false}
    whileInView={enabled ? effect : { x: 0, y: 0, scale: 1, scaleX: 1 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: enabled ? motionTokens.duration.normal : 0, ease: motionTokens.easing.smooth }}>
    {children}
  </motion.div>;
}

export function AlbumHeadline() {
  const { enabled } = useMotionSettings();
  return <h1 id="hero-title">{["Tumbuh bersama.", "Satu per satu."].map((line, index) => (
    <span className="album-headline-mask" key={line}>
      <motion.span initial={false} animate={enabled ? { y: ["100%", "0%"] } : { y: "0%" }}
        transition={{ duration: enabled ? motionTokens.duration.slow : 0, delay: enabled ? index * motionTokens.stagger : 0, ease: motionTokens.easing.smooth }}>
        {line}
      </motion.span>
    </span>
  ))}</h1>;
}

export function AlbumPhoto() {
  const ref = useRef<HTMLElement>(null);
  const { enabled } = useMotionSettings();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const zoom = useTransform(scrollYProgress, [0, 0.7, 1], [motionTokens.scale.photo, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [-motionTokens.distance.small, motionTokens.distance.small]);
  return <figure className="premium-hero-photo" ref={ref}>
    <div className="album-photo-window">
      <motion.img src="/images/family-editorial.jpg"
        alt="Ilustrasi AI seorang ibu dan bayi yang saling menatap di rumah"
        width="1536" height="1024" fetchPriority="high"
        style={{ scale: enabled ? zoom : 1, y: enabled ? y : 0 }} />
    </div>
    <figcaption><span>Setiap keluarga punya ritmenya.</span><span>Gambar ilustratif AI</span></figcaption>
  </figure>;
}

export function ReadingProgress() {
  const { enabled } = useMotionSettings();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, springs.gentle);
  return enabled ? <motion.div className="reading-progress" aria-hidden="true" style={{ scaleX: progress }} /> : null;
}

const STORY = [
  { title: "Pilih yang penting.", text: "Tiga prioritas mingguan, dengan alasan, pemilik, dan tenggat. Saat hari berubah, rencananya ikut menyesuaikan.", image: "hari-ini", action: "Buka prioritas", route: "hari-ini" },
  { title: "Mulai dari dapurmu.", text: "Pilih menu berdasarkan waktu, anggaran, alergi, dan bahan yang tersedia. Pengganti bahan ikut menghitung ulang estimasi biaya.", image: "rencana", action: "Susun menu", route: "rencana" },
  { title: "Bawa catatanmu.", text: "Pengukuran mentah dan pertanyaan terkumpul dalam ringkasan yang bisa dicetak. Bekal untuk berdiskusi dengan tenaga kesehatan.", image: "catatan", action: "Lihat catatan", route: "catatan" },
] as const;

function StoryContent({ item, onOpen, animated = false }: { item: typeof STORY[number]; onOpen: (screen: Screen) => void; animated?: boolean }) {
  return <motion.article className="feature-walkthrough-row" initial={animated ? { opacity: 0.4, y: 12 } : false}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: animated ? motionTokens.duration.normal : 0, ease: motionTokens.easing.smooth }}>
    <div className="feature-walkthrough-copy"><h3>{item.title}</h3><p>{item.text}</p>
      <button type="button" className="album-story-action" onClick={() => onOpen(item.route)}>{item.action}<span aria-hidden="true">↗</span></button>
    </div>
    <figure className="feature-walkthrough-image">
      <img src={`/images/product-${item.image}.png`}
        alt={`Tampilan demo TumbuhBersama: ${item.title}`} width="1440" height="900" loading="eager" />
      <figcaption>Tampilan aplikasi · Data contoh</figcaption>
    </figure>
  </motion.article>;
}

export function ScrollStory({ onOpen }: { onOpen: (screen: Screen) => void }) {
  const ref = useRef<HTMLElement>(null);
  const { enabled, wide } = useMotionSettings();
  const cinematic = enabled && wide;
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!cinematic) return;
    STORY.forEach((item) => {
      const image = new Image();
      image.src = `/images/product-${item.image}.png`;
    });
  }, [cinematic]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 76px", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(Math.min(STORY.length - 1, Math.max(0, Math.floor(value * STORY.length))));
  });
  return <section ref={ref} id="beda" className={`album-story feature-walkthrough ${cinematic ? "feature-scroll" : ""}`} aria-labelledby="story-title">
    <div className="feature-scroll-stage">
      <div className="album-story-heading"><h2 id="story-title">Satu ruang keluarga.</h2><p>Susun prioritas, pilih menu, dan siapkan catatan. Lihat bagaimana semuanya dipakai sehari-hari.</p></div>
      {cinematic ? <>
        <nav className="feature-scroll-nav" aria-label="Pilih fitur untuk dilihat">
          {STORY.map((item, index) => <button type="button" key={item.image} aria-pressed={active === index}
            onClick={() => {
              const section = ref.current;
              if (!section) return;
              const start = section.getBoundingClientRect().top + window.scrollY - 76;
              const travel = section.offsetHeight - window.innerHeight + 76;
              window.scrollTo({ top: start + travel * ((index + 0.5) / STORY.length), behavior: "instant" });
              setActive(index);
            }}>{["Prioritas", "Menu", "Catatan"][index]}</button>)}
        </nav>
        <StoryContent key={STORY[active].image} item={STORY[active]} onOpen={onOpen} animated />
        <p className="feature-scroll-hint">Gulir untuk menjelajahi fitur <span aria-hidden="true">↓</span></p>
      </> : <div className="feature-walkthrough-list">{STORY.map((item) => <StoryContent key={item.image} item={item} onOpen={onOpen} />)}</div>}
    </div>
  </section>;
}
