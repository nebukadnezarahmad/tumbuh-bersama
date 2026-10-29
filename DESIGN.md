# TumbuhBersama: premium yang tetap dekat

Penyempurnaan 25 Oktober 2026 berdasarkan permintaan pengguna: UI sederhana dengan ketenangan Apple, warna dan sentuhan editorial Pryvo, foto yang relevan, serta alur yang lebih mudah dipakai. Arah sebelumnya berupa jurnal hijau digantikan oleh burgundy, gading, dan charcoal.

Antislop during. ENERGY 2 / RHYTHM 3 / MOTION 3 pada landing setelah permintaan pemolesan scroll; layar kerja tetap tenang. Fokus jelas, komposisi mengikuti isi, tanpa loop.

## Pemolesan taste-skill dan scroll

Pengguna meminta `npx skills add Leonxlnx/taste-skill`. Skill `design-taste-frontend` dipasang global untuk Codex pada 25 Oktober 2026 dan panduannya dipakai pada iterasi ini. Direction sheet tersimpan di `.taste-skill/direction.json`, dengan arah borrowed-category: perencana keluarga diperlakukan sebagai album keluarga pribadi. Palet dan keluarga font dipertahankan.

Headline menjadi dua baris besar dalam satu wajah dan warna. Foto keluarga memenuhi lebar konten di bawahnya. Label uppercase kecil, indeks dekoratif, garis pembatas, dan bayangan di permukaan diam dikurangi pada landing. Bagian produk menampilkan tiga cuplikan aplikasi nyata; bersama foto utama tersedia empat gambar berbeda.

Motion menggunakan `motion/react`: pembukaan headline bermasker, foto terkait posisi scroll, progres baca, entrance dengan arah sesuai isi, serta tiga langkah cerita dengan media sticky di desktop. Scroll tetap native. Pada layar sempit, tinggi layar pendek, preferensi reduced motion, perangkat dengan paling banyak empat logical cores, atau URL `?motion=off`, cerita tampil statis dengan seluruh gambar dan teks.

Token di `src/lib/motion-tokens.ts`. Gerak mikro 180ms, entrance 420ms, signature headline 640ms; pengecualian headline lebih lambat dipakai sekali. Tidak ada loop, wheel interception, animasi properti layout, atau konten yang menunggu scroll untuk menjadi dapat dibaca. Reset reduced motion langsung tanpa durasi transisi.

Pada pengujian produksi ditemukan overflow sesaat dari entrance horizontal. Gerak itu diganti dengan scaleX 0.985 ke 1; ukuran halaman tetap sama dengan viewport selama entrance pada 320, 390, 768, 1024, dan 1440px.

Aturan baru di `src/taste.css` berlaku pada landing. Layar kerja dan data tetap mengikuti sistem aplikasi sebelumnya. Cuplikan live diberi `data-ui` agar aturan panel aplikasi tidak tercampur dengan aturan halaman publik.

## Keputusan visual

- Gading `#faf9f6` untuk baca yang tenang; putih untuk formulir dan catatan yang dapat dikelola.
- Burgundy `#691c39` membawa aksi dan navigasi aktif; `#4d1228` untuk hover. Ini aksen utama, bukan hijau.
- Charcoal `#252126` untuk teks dan `#68616a` untuk teks sekunder. Rose `#f1e9ed` mengelompokkan informasi pendukung.
- Champagne hanya pada judul besar di penutup gelap, tidak untuk teks kecil di gading.
- Manrope menjadi basis judul dan isi; landing terbaru tidak memakai kata aksen berwarna atau italic. Fraunces dipertahankan pada wordmark dan detail aplikasi yang sudah ada.
- Foto keluarga memberi konteks personal. Dibuat memakai imagegen bawaan, berlabel ilustratif AI, bukan foto pelanggan atau testimoni.
- Hero terbaru memakai judul dua baris, satu aksi utama dan tautan penjelasan, lalu foto lebar. Pratinjau interaktif ditempatkan setelah cerita aplikasi.
- Tahap disusun sebagai pilihan bernomor, dengan fokus dan CTA kontekstual di bawahnya.
- Panel konten dan foto bersudut lembut; pil terbatas pada kontrol. Navigasi tidak memakai dekorasi berulang.
- Gerak hanya untuk respons keadaan dan kedatangan konteks; reduced motion mematikannya.
- Dasar terang dipilih untuk membaca, mencatat, dan mencetak; tidak ada sakelar tema yang menjanjikan mode gelap.

## Perbaikan UX

- Pilihan tahap diteruskan lewat `#/mulai?tahap=...` dan divalidasi sebelum dipakai.
- Pengguna bisa mulai hanya dengan memilih tahap; nama dan tanggal diungkap melalui detail opsional.
- Profil yang sudah ada tidak dihapus oleh tombol demo. Formulir baru memberi tautan edit profil lama dan meminta konfirmasi sebelum mengganti data.
- Navigasi mobile memiliki menu berlabel, dapat ditutup dengan Escape, dan fokus kembali ke pemicu.
- Tugas menampilkan aksi utama Selesai. Tunda, bantuan, alasan, pemilik, dan tenggat berada dalam Detail & pilihan.
- Shortcut dashboard mengikuti tahap: pengukuran untuk tahap anak, panduan untuk persiapan/kehamilan.
- Skip link memindahkan fokus tanpa mengganti hash router, agar pilihan tahap dan tombol Back tetap benar.
- Default Rencana tidak diulang sebagai badge pada setiap tugas; badge hanya menandai keadaan khusus.

## Batas produk

Tetap purwarupa lokal. Tidak ada diagnosis, z-score, prediksi IQ, atau saran dosis. Data demo, estimasi biaya, dan materi belum ditelaah tetap diberi label. Ekspor dan hapus data tetap tersedia.

## Implementasi

`src/premium.css` menetapkan sistem burgundy; `src/taste.css` memoles landing dan komposisi scroll. Alias token teal lama menunjuk warna aksi burgundy agar komponen lama tetap konsisten. Detail aset dan prompt ada di `public/images/README.md`.

Build dan pemeriksaan browser dilakukan pada source final. Tujuh layar diperiksa pada 320, 360, 390, 768, 1024, dan 1440px; alur baru serta regresi utama diuji. Ini bukan audit klinis atau sertifikasi WCAG.

## Revisi feedback 29 Oktober 2026

Hero diubah menjadi dua kolom pada desktop: penjelasan dan CTA berdampingan dengan foto yang dibatasi oleh kolom, rasio 1.5. Pada ponsel foto rasio 1.7 agar tidak menghabiskan layar. Konteks rencana/menu/catatan ditambahkan di dekat foto. Cerita sticky dan pergantian screenshot berdasarkan progres scroll dihapus; tiga baris fitur memasangkan teks, CTA, dan screenshot secara permanen. Ini menghilangkan ketergantungan timing scroll. Motion headline, reveal ringan, dan foto tetap menghormati reduced motion. Footer diperluas dengan navigasi, akses ruang keluarga/demo, batas penggunaan, penyimpanan data, dan kembali ke atas dengan fokus keyboard. Lebar konten utama 1200px.
