import { useState, type FormEvent } from "react";
import { STAGES, dateLabelForStage } from "../data";
import { buildDemoState, buildEmptyState, useStore } from "../store";
import { navigate } from "../lib/router";
import { todayISO } from "../lib/date";
import type { StageId } from "../types";
import { Brand } from "../components/AppShell";
import { Icon, Modal, SkipLink } from "../components/ui";

export function Onboarding() {
  const { state, setState } = useStore();
  const [stage, setStage] = useState<StageId>(() => {
    const requested = new URLSearchParams(window.location.hash.split("?")[1]).get("tahap");
    return STAGES.find((item) => item.id === requested)?.id ?? "mpasi";
  });
  const [motherName, setMotherName] = useState("");
  const [childName, setChildName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [confirmReplace, setConfirmReplace] = useState(false);
  const childStage = ["nifas", "bayi", "mpasi", "balita"].includes(stage);

  const createProfile = () => {
    setState(() => buildEmptyState(stage, motherName.trim() || "Ibu", childStage ? childName.trim() : "", childStage ? birthDate : ""));
    navigate("hari-ini");
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (state.profile) setConfirmReplace(true);
    else createProfile();
  };
  const startDemo = () => {
    if (!state.profile) setState(() => buildDemoState());
    navigate("hari-ini");
  };

  return (
    <div className="onboarding premium-onboarding">
      <SkipLink target="formulir">Lewati ke formulir</SkipLink>
      <header className="onboard-header"><Brand compact /><a href="#/" className="text-link">Kembali</a></header>
      <main className="onboard-main" id="formulir" tabIndex={-1}>
        <div className="onboard-copy">
          <p className="premium-eyebrow">RUANG UNTUK KELUARGAMU</p>
          <h1>Mulai dari<br /><em>tahapmu.</em></h1>
          <p className="lede">Cukup pilih tahap keluarga. Nama dan tanggal bisa dilengkapi kapan saja.</p>
          <figure className="onboard-photo"><img src="/images/family-editorial.jpg" alt="Ilustrasi AI kebersamaan ibu dan bayi di rumah" width="1536" height="1024" /><figcaption>Setiap keluarga punya ritmenya. · Gambar ilustratif AI</figcaption></figure>
          <button type="button" className="premium-text-action" onClick={startDemo}>{state.profile ? "Lanjutkan rencana yang tersimpan" : "Lihat demo dulu"}<Icon name="arrow" size={16} /></button>
        </div>
        <form className="onboard-form" onSubmit={submit}>
          {state.profile ? <div className="existing-profile"><Icon name="info" size={18} /><div><strong>Rencana keluargamu sudah tersimpan.</strong><p>Untuk memperbarui tahap, <a href="#/keluarga">edit profil yang ada</a>. Formulir ini membuat profil baru.</p></div></div> : null}
          <fieldset className="field">
            <legend>Di tahap mana keluargamu sekarang?</legend>
            <div className="stage-picker">
              {STAGES.map((item) => <label key={item.id} className={`stage-option ${stage === item.id ? "is-selected" : ""}`}><input type="radio" name="stage" value={item.id} checked={stage === item.id} onChange={() => setStage(item.id)} /><span className="stage-option-num">{item.num}</span><span><span className="stage-option-title">{item.label}</span><span className="stage-option-desc">{item.summary}</span></span><Icon name="check" size={15} /></label>)}
            </div>
          </fieldset>
          <details className="optional-profile-fields">
            <summary>Tambahkan nama & tanggal<span>Opsional<Icon name="plus" size={15} /></span></summary>
            <div className="optional-profile-body">
              <div className="field-row">
                <div className="field"><label htmlFor="mother-name">Nama panggilan ibu</label><input id="mother-name" type="text" value={motherName} maxLength={50} onChange={(event) => setMotherName(event.target.value)} placeholder="Contoh: Rani" autoComplete="given-name" /></div>
                {childStage ? <div className="field"><label htmlFor="child-name">Nama anak</label><input id="child-name" type="text" value={childName} maxLength={50} onChange={(event) => setChildName(event.target.value)} placeholder="Contoh: Alya" /></div> : null}
              </div>
              {childStage ? <div className="field"><label htmlFor="birth-date">{dateLabelForStage(stage)}</label><input id="birth-date" type="date" value={birthDate} max={todayISO()} onChange={(event) => setBirthDate(event.target.value)} /><span className="field-hint">Untuk usia dan sumbu grafik. Boleh diisi nanti.</span></div> : null}
            </div>
          </details>
          <div className="onboard-submit"><button type="submit" className="btn btn-primary">Buat rencana keluargaku<Icon name="arrow" size={17} /></button><p><Icon name="shield" size={14} />Tersimpan di perangkat ini. Tanpa akun.</p></div>
        </form>
      </main>
      <Modal open={confirmReplace} onClose={() => setConfirmReplace(false)} title="Buat profil baru?">
        <p className="muted">Profil, tugas, dan catatan yang tersimpan akan diganti. Ekspor data terlebih dahulu jika ingin menyimpannya.</p>
        <div className="replace-actions"><a href="#/keluarga" className="btn btn-ghost">Kelola & ekspor data</a><button type="button" className="btn btn-primary" onClick={createProfile}>Ganti dengan profil baru</button><button type="button" className="text-button" onClick={() => setConfirmReplace(false)}>Tetap gunakan profil lama</button></div>
      </Modal>
    </div>
  );
}
