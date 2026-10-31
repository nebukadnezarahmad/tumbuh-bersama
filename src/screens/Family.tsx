import { useState, type FormEvent } from "react";
import { STAGES } from "../data";
import { buildDemoState, useStore } from "../store";
import { navigate } from "../lib/router";
import type { StageId } from "../types";
import { formatDate } from "../lib/date";
import {
  Badge,
  FieldError,
  Icon,
  Modal,
  SectionHead,
  Toggle,
} from "../components/ui";

export function Family() {
  const {
    state,
    updateProfile,
    setConsent,
    setNotification,
    inviteCaregiver,
    revokeCaregiver,
    setState,
    clearAll,
  } = useStore();
  const profile = state.profile;
  const [motherName, setMotherName] = useState(profile?.motherName ?? "");
  const [childName, setChildName] = useState(profile?.childName ?? "");
  const [stage, setStage] = useState<StageId>(profile?.stage ?? "mpasi");
  const [birthDate, setBirthDate] = useState(profile?.childBirthDate ?? "");
  const [profileSaved, setProfileSaved] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState<Record<string, string>>({});
  const [invited, setInvited] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const childStage = ["nifas", "bayi", "mpasi", "balita"].includes(stage);
  const today = new Date().toISOString().slice(0, 10);

  const saveProfile = (event: FormEvent) => {
    event.preventDefault();
    updateProfile({
      motherName: motherName.trim() || "Ibu",
      childName: childStage ? childName.trim() : "",
      stage,
      childBirthDate: childStage ? birthDate : "",
    });
    setProfileSaved(true);
  };

  const submitInvite = (event: FormEvent) => {
    event.preventDefault();
    const errors: Record<string, string> = {};
    if (!inviteName.trim()) errors.name = "Isi nama pengasuh.";
    if (!/^\S+@\S+\.\S+$/.test(inviteEmail.trim())) {
      errors.email = "Format email belum benar, contoh nama@email.com.";
    }
    setInviteError(errors);
    if (Object.keys(errors).length > 0) return;
    inviteCaregiver(inviteName.trim(), inviteEmail.trim());
    setInviteName("");
    setInviteEmail("");
    setInvited(
      "Contoh undangan tersimpan selama tujuh hari. Tidak ada email yang dikirim.",
    );
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tumbuh-bersama-data-${today}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="screen family">
      <header className="screen-head">
        <div>
          <p className="kicker">Keluarga</p>
          <h1>Ruang keluargamu.</h1>
          <p className="lede screen-lede">
            Perbarui profil, atur pilihan keluarga, dan simpan salinan
            catatanmu.
          </p>
        </div>
        <div className="head-meta">
          {state.demo ? (
            <Badge tone="clay">Data contoh</Badge>
          ) : (
            <Badge tone="neutral">Data lokal</Badge>
          )}
        </div>
      </header>

      <div className="family-grid">
        <section className="panel" aria-labelledby="profile-title">
          <SectionHead
            kicker="Profil"
            title="Data keluarga"
            lede="Lengkapi seperlunya. Nama, tanggal, dan tahap keluarga bisa kamu ubah kapan saja."
          />
          <form onSubmit={saveProfile} className="profile-form">
            <div className="field-row">
              <div className="field">
                <label htmlFor="family-mother">Nama panggilan ibu</label>
                <input
                  id="family-mother"
                  type="text"
                  value={motherName}
                  onChange={(event) => {
                    setMotherName(event.target.value);
                    setProfileSaved(false);
                  }}
                />
              </div>
              <div className="field">
                <label htmlFor="family-stage">Tahap keluarga</label>
                <select
                  id="family-stage"
                  value={stage}
                  onChange={(event) => {
                    setStage(event.target.value as StageId);
                    setProfileSaved(false);
                  }}
                >
                  {STAGES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {childStage ? (
              <div className="field-row">
                <div className="field">
                  <label htmlFor="family-child">Nama anak</label>
                  <input
                    id="family-child"
                    type="text"
                    value={childName}
                    onChange={(event) => {
                      setChildName(event.target.value);
                      setProfileSaved(false);
                    }}
                  />
                </div>
                <div className="field">
                  <label htmlFor="family-birth">Tanggal lahir anak</label>
                  <input
                    id="family-birth"
                    type="date"
                    max={today}
                    value={birthDate}
                    onChange={(event) => {
                      setBirthDate(event.target.value);
                      setProfileSaved(false);
                    }}
                  />
                  <span className="field-hint">
                    Untuk menghitung usia pada catatan pertumbuhan.
                  </span>
                </div>
              </div>
            ) : null}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Simpan profil
              </button>
              {profileSaved ? (
                <span className="alert alert-success" role="status">
                  Profil tersimpan.
                </span>
              ) : null}
            </div>
            <p className="fine-note">
              Mengubah tahap tidak menghapus tugas lama. Sesuaikan prioritas di
              Hari Ini bila perlu.
            </p>
          </form>
        </section>

        <section className="panel" aria-labelledby="caregiver-title">
          <SectionHead
            kicker="Pengasuh"
            title="Coba pembagian peran"
            lede="Undangan ini hanya simulasi. Tidak ada email atau catatan yang dikirim kepada pengasuh."
          />

          {state.caregivers.length === 0 ? (
            <p className="muted">Belum ada pengasuh diundang.</p>
          ) : (
            <ul className="caregiver-list">
              {state.caregivers.map((caregiver) => (
                <li key={caregiver.id}>
                  <div className="caregiver-avatar" aria-hidden="true">
                    {caregiver.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="caregiver-copy">
                    <span className="caregiver-name">{caregiver.name}</span>
                    <span className="field-hint">{caregiver.email}</span>
                    <span className="field-hint">
                      {caregiver.status === "aktif"
                        ? "Akses aktif"
                        : "Menunggu"}
                      {" · berlaku sampai "}
                      {formatDate(caregiver.expiresAt)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-button danger"
                    onClick={() => revokeCaregiver(caregiver.id)}
                  >
                    Cabut akses
                  </button>
                </li>
              ))}
            </ul>
          )}

          {state.caregivers.length === 0 ? (
            <form onSubmit={submitInvite} className="invite-form">
              <div className="field">
                <label htmlFor="invite-name">Nama pengasuh</label>
                <input
                  id="invite-name"
                  type="text"
                  value={inviteName}
                  aria-invalid={Boolean(inviteError.name)}
                  onChange={(event) => setInviteName(event.target.value)}
                />
                <FieldError>{inviteError.name}</FieldError>
              </div>
              <div className="field">
                <label htmlFor="invite-email">Email</label>
                <input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  aria-invalid={Boolean(inviteError.email)}
                  onChange={(event) => setInviteEmail(event.target.value)}
                />
                <FieldError>{inviteError.email}</FieldError>
              </div>
              <button type="submit" className="btn btn-ghost btn-small">
                <Icon name="plus" size={16} />
                Buat undangan
              </button>
            </form>
          ) : (
            <p className="fine-note">
              Simulasi ini memuat satu pengasuh. Cabut akses jika ingin mencoba
              dengan orang lain.
            </p>
          )}
          {invited ? (
            <p className="alert alert-success" role="status">
              {invited}
            </p>
          ) : null}
        </section>

        <section className="panel" aria-labelledby="consent-title">
          <SectionHead
            kicker="Izin"
            title="Pilihan berbagi catatan"
            lede="Coba pilih catatan yang ingin dibagikan. Pengaturan ini tersimpan di perangkatmu dan belum memberi akses kepada orang lain."
          />
          <div className="toggle-stack">
            <Toggle
              checked={state.consents.shareMaternal}
              onChange={(value) => setConsent("shareMaternal", value)}
              label="Bagikan catatan kesehatan ibu"
              description="Catatan kehamilan, pemulihan, dan keluhan pribadi."
            />
            <Toggle
              checked={state.consents.shareChild}
              onChange={(value) => setConsent("shareChild", value)}
              label="Bagikan catatan anak"
              description="Pengukuran, catatan makan, dan jadwal kunjungan anak."
            />
            <Toggle
              checked={state.consents.shareTasks}
              onChange={(value) => setConsent("shareTasks", value)}
              label="Bagikan tugas keluarga"
              description="Judul tugas, pemilik, dan status. Tanpa diagnosis atau keluhan."
            />
            <Toggle
              checked={state.consents.analytics}
              onChange={(value) => setConsent("analytics", value)}
              label="Izinkan analitik penggunaan"
              description="Demo ini tidak mengirim data ke alat analitik mana pun."
            />
          </div>
          <p className="fine-note">
            Catatan ibu tidak dibagikan secara bawaan. Kamu bisa mengubah
            pilihan ini kapan saja.
          </p>
        </section>

        <section className="panel" aria-labelledby="notif-title">
          <SectionHead
            kicker="Notifikasi"
            title="Atur pilihan pengingat"
            lede="Pilihanmu disimpan di perangkat ini. Belum ada notifikasi yang dikirim."
          />
          <div className="toggle-stack">
            <Toggle
              checked={state.notifications.weekly}
              onChange={(value) => setNotification("weekly", value)}
              label="Ringkasan mingguan"
              description="Pilihan untuk menerima ringkasan prioritas mingguan."
            />
            <Toggle
              checked={state.notifications.visits}
              onChange={(value) => setNotification("visits", value)}
              label="Pengingat kunjungan"
              description="Pilihan pengingat sesuai jadwal kunjunganmu."
            />
            <Toggle
              checked={state.notifications.growth}
              onChange={(value) => setNotification("growth", value)}
              label="Pengingat pengukuran"
              description="Pilihan pengingat untuk mencatat pengukuran."
            />
            <Toggle
              checked={state.notifications.lockScreenDetail}
              onChange={(value) => setNotification("lockScreenDetail", value)}
              label="Tampilkan detail di layar kunci"
              description="Mati secara bawaan agar status kesehatan tidak terlihat."
            />
          </div>
        </section>

        <section className="panel" aria-labelledby="data-title">
          <SectionHead
            kicker="Data"
            title="Simpan salinan atau kelola data"
            lede="Catatan tersimpan di peramban perangkat ini, tanpa akun atau sinkronisasi. Unduh salinan jika ingin menyimpannya di tempat lain."
          />
          <div className="data-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={exportData}
            >
              <Icon name="download" size={17} />
              Unduh data JSON
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setState(() => buildDemoState());
                navigate("hari-ini");
              }}
            >
              Muat ulang data demo
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setDeleteOpen(true)}
            >
              <Icon name="trash" size={17} />
              Hapus semua data
            </button>
          </div>
          <p className="fine-note">
            Ekspor berisi profil, tugas, pengukuran, izin, dan undangan. Tinjau
            sebelum membagikan.
          </p>
        </section>

        <section className="panel about-panel" aria-labelledby="about-title">
          <SectionHead
            kicker="Tentang"
            title="Tentang versi ini"
            lede="Pendamping rencana keluarga dari persiapan kehamilan hingga balita. Versi ini memakai penyimpanan di perangkatmu."
          />
          <div className="about-columns">
            <div>
              <h3>Sudah ada di demo</h3>
              <ul className="small-list">
                <li>Profil sesuai tahap keluarga</li>
                <li>Tiga prioritas dengan alasan dan pemilik</li>
                <li>Menu lokal, pengganti bahan, daftar belanja</li>
                <li>Riwayat pengukuran dan ringkasan konsultasi</li>
                <li>Simulasi izin pengasuh dan pilihan pengingat</li>
              </ul>
            </div>
            <div>
              <h3>Tidak termasuk</h3>
              <ul className="small-list">
                <li>Diagnosis, dosis, atau prediksi IQ</li>
                <li>Penilaian status gizi dari grafik</li>
                <li>Akun dan sinkronisasi antarperangkat</li>
                <li>Materi yang sudah ditelaah tenaga kesehatan</li>
                <li>Pengiriman undangan dan notifikasi</li>
              </ul>
            </div>
          </div>
          <p className="fine-note">
            Keluarga demo, menu, harga, dan jadwal memakai data contoh. Gunakan
            catatanmu sebagai bekal berdiskusi dengan tenaga kesehatan.
          </p>
        </section>
      </div>

      <Modal
        open={deleteOpen}
        title="Hapus semua data?"
        onClose={() => setDeleteOpen(false)}
      >
        <p className="muted">
          Profil, tugas, pengukuran, izin, dan undangan akan dihapus dari
          peramban ini. Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setDeleteOpen(false)}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              clearAll();
              setDeleteOpen(false);
              navigate("landing");
            }}
          >
            Hapus semua data
          </button>
        </div>
      </Modal>
    </div>
  );
}
