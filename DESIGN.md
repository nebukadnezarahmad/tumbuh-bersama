# TumbuhBersama — langkah kecil, tumbuh bersama

Penyempurnaan 31 Oktober 2026 untuk repo dan deployment Vercel yang sama. Fokus: UI keluarga yang hangat dan jelas, background dari referensi SIGAP, teks yang lebih dekat dengan keseharian, serta alur berdasarkan Rancangan Website TumbuhBersama.

## Arah visual dan hirarki

- Teal gelap #174e43 untuk aksi; ivory #f8f7f2 untuk halaman publik; sage untuk konteks; amber untuk pembagian peran.
- Manrope untuk navigasi dan aplikasi. Fraunces untuk judul editorial terbatas di halaman publik.
- Hero menampilkan contoh tiga prioritas yang bisa dicentang, pemilik tugas, tenggat, dan progres. Konten contoh diberi label.
- Kisi piksel diadaptasi dari `nebukadnezarahmad/sigap/src/components/pixel-grid.tsx`; 42px sel, celah 3px, gelombang opacity lambat, warna disesuaikan. Canvas dekoratif disembunyikan dari pembaca layar, berhenti di luar viewport/ketika tab tidak aktif, dan statis saat reduced motion.
- Pilihan tahap meliputi sebelum hamil hingga balita. Pilihan diteruskan ke formulir awal.
- Penjelasan produk memakai tiga pilihan interaktif: prioritas, menu, catatan. Setiap pilihan membuka contoh yang sesuai dan akses ke aplikasi.
- Foto keluarga lama dipertahankan sebagai ilustrasi pendukung, dengan label AI; tidak digunakan sebagai testimoni.
- Formulir awal menampilkan pilihan tahap, nama/tanggal opsional, dan contoh fokus yang sesuai. Dashboard memakai sistem warna dan ukuran teks yang sama.

## Kontrak produk

Pekerjaan utama pengguna: menyiapkan paling banyak tiga prioritas mingguan, memilih menu lokal, membagi peran, dan mencatat pengukuran untuk konsultasi. Aksi pertama: pilih tahap atau jelajahi demo. Target utama: 390×844 dan 1440×1000; pemeriksaan sempit tambahan 320px.

Alur yang dipertahankan: tahap → profil minimum → Hari Ini → Rencana / Catatan / Panduan / Keluarga. Navigasi bawah tetap tersedia di ponsel. Profil yang ada tidak ditimpa oleh tombol demo. Penggantian profil memerlukan dialog konfirmasi. Data tetap lokal di peramban, dapat diekspor dan dihapus lewat Keluarga. Tidak ada akun, sinkronisasi, diagnosis, atau skor kesehatan baru.

## Keadaan antarmuka

- Loading: aplikasi dan font dibundel lokal; canvas memiliki fallback tanpa menghalangi konten.
- Empty: keadaan kosong yang sudah ada pada menu dan catatan tetap menawarkan tindakan berikutnya.
- Error: validasi formulir dan pengukuran tetap memakai pesan spesifik; tidak menambahkan layanan jaringan baru.
- Partial: profil boleh hanya berisi tahap; nama/tanggal dapat diisi kemudian. Pengukuran atau menu yang belum dipilih tetap diberi penjelasan.
- Success: centang contoh mengubah progres; pembuatan profil membuka prioritas; tindakan aplikasi mempertahankan umpan balik yang sudah tersedia.
- Permission: tidak ada izin perangkat/akun baru atau perubahan akses.

## Berkas

`landing.css` memuat sistem halaman publik dan token palet. `app-polish.css` memuat penyesuaian layar kerja. Struktur layar, penyimpanan, data contoh, perhitungan menu, dan pengukuran tetap memakai kode proyek.
