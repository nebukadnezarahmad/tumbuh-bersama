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

export function ScrollStory({ onOpen }: { onOpen: (screen: Screen) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { enabled, wide } = useMotionSettings();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(STORY.length - 1, Math.max(0, Math.floor(value * STORY.length)));
    setActive((current) => current === next ? current : next);
  });
  const cinematic = enabled && wide;
  return <section id="beda" className={`album-story ${cinematic ? "is-cinematic" : "is-static"}`} aria-labelledby="story-title">
    <Reveal className="album-story-heading"><h2 id="story-title">Satu ruang keluarga.</h2><p>Dari rencana kecil sampai catatan yang ingin dibawa bercerita.</p></Reveal>
    <div className="album-story-grid" ref={ref}>
      <div className="album-story-media" aria-hidden="true">
        <div className="album-story-screen">
          {STORY.map((item, index) => <motion.img key={item.image}
            src={`/images/product-${item.image}.png`} alt="" width="1440" height="900" loading="lazy"
            initial={false} animate={{ opacity: active === index ? 1 : 0, y: active === index ? 0 : motionTokens.distance.small }}
            transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }} />)}
        </div>
        <p>Tampilan aplikasi · Data contoh</p>
        <div className="album-story-dots">{STORY.map((item, index) => <span key={item.image} className={active === index ? "is-active" : ""} />)}</div>
      </div>
      <div className="album-story-steps">
        {STORY.map((item, index) => <article className={`album-story-step ${active === index ? "is-current" : ""}`} key={item.image}>
          <Reveal kind={index === 1 ? "side" : "rise"}><h3>{item.title}</h3><p>{item.text}</p>
            <button type="button" className="album-story-action" onClick={() => onOpen(item.route)}>{item.action}<span aria-hidden="true">↗</span></button>
          </Reveal>
          <img className="album-story-mobile-image" src={`/images/product-${item.image}.png`}
            alt={`Tampilan demo TumbuhBersama: ${item.title}`} width="1440" height="900" loading="lazy" />
        </article>)}
      </div>
    </div>
  </section>;
}
