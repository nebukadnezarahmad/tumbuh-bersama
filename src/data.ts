import type { GuideItem, Recipe, SourceItem, StageId } from "./types";

export interface StageMeta {
  id: StageId;
  num: string;
  label: string;
  short: string;
  summary: string;
  focus: string[];
}

export const STAGES: StageMeta[] = [
  {
    id: "prakonsepsi",
    num: "01",
    label: "Sebelum hamil",
    short: "Persiapan",
    summary: "Rencana konsultasi dan kebiasaan yang dijalankan berdua.",
    focus: [
      "Daftar pertanyaan untuk bidan atau dokter",
      "Kebiasaan makan, istirahat, dan rumah bebas asap",
      "Pembagian tugas dan perkiraan biaya",
    ],
  },
  {
    id: "hamil",
    num: "02",
    label: "Kehamilan",
    short: "Hamil",
    summary: "Prioritas tiap trimester, jadwal kunjungan, dan dukungan pasangan.",
    focus: [
      "Usia kehamilan dan jadwal pemeriksaan",
      "Menu realistis dan catatan keluhan",
      "Persiapan persalinan dan transportasi",
    ],
  },
  {
    id: "nifas",
    num: "03",
    label: "Setelah melahirkan",
    short: "Nifas",
    summary: "Pemulihan ibu berjalan bersama perawatan bayi baru.",
    focus: [
      "Kontrol ibu dan tanda bahaya",
      "Makan, minum, istirahat, dukungan menyusui",
      "Tugas pengasuh yang bisa diambil alih",
    ],
  },
  {
    id: "bayi",
    num: "04",
    label: "Bayi 0-5 bulan",
    short: "0-5 bulan",
    summary: "Dukungan pemberian ASI, perawatan, dan pengukuran.",
    focus: [
      "ASI eksklusif dan bantuan laktasi",
      "Imunisasi dan kunjungan",
      "Berat, panjang, dan catatan singkat",
    ],
  },
  {
    id: "mpasi",
    num: "05",
    label: "Anak 6-23 bulan",
    short: "MPASI",
    summary: "Menu sesuai tahap, keragaman makan, dan pemantauan tumbuh.",
    focus: [
      "MPASI dengan tekstur dan porsi sesuai usia",
      "Bahan lokal dan anggaran rumah",
      "Catatan makan dan pertumbuhan",
    ],
  },
  {
    id: "balita",
    num: "06",
    label: "Balita 24-59 bulan",
    short: "Balita",
    summary: "Kebiasaan makan keluarga, bermain, dan pemantauan lanjutan.",
    focus: [
      "Makanan keluarga dan pilihan jajanan",
      "Aktivitas bermain tanpa alat khusus",
      "Pengukuran sampai usia lima tahun",
    ],
  },
];

export interface PriorityTemplate {
  title: string;
  reason: string;
  ruleId: string;
  source: string;
  owner: "Saya" | "Pengasuh";
  offsetDays: number;
  stage: StageId;
}

const priority = (
  stage: StageId,
  title: string,
  reason: string,
  ruleId: string,
  source: string,
  owner: "Saya" | "Pengasuh",
  offsetDays: number,
): PriorityTemplate => ({
  stage,
  title,
  reason,
  ruleId,
  source,
  owner,
  offsetDays,
});

export const PRIORITY_TEMPLATES: PriorityTemplate[] = [
  priority(
    "prakonsepsi",
    "Pilih fasilitas untuk konsultasi persiapan hamil",
    "Tahap persiapan belum punya jadwal konsultasi.",
    "plan.prep.visit.v1",
    "Templat tahap prakonsepsi",
    "Saya",
    3,
  ),
  priority(
    "prakonsepsi",
    "Catat obat dan suplemen yang sedang dipakai",
    "Daftar ini membantu saat konsultasi, tanpa mengubah dosis sendiri.",
    "plan.prep.meds.v1",
    "Templat tahap prakonsepsi",
    "Saya",
    2,
  ),
  priority(
    "prakonsepsi",
    "Sepakati satu tugas pendamping minggu ini",
    "Persiapan disebut sebagai urusan berdua, bukan ibu saja.",
    "plan.family.task.v1",
    "Templat pembagian tugas keluarga",
    "Pengasuh",
    4,
  ),
  priority(
    "prakonsepsi",
    "Siapkan pertanyaan soal folat dan zat besi",
    "Pertanyaan disiapkan untuk dibahas dengan tenaga kesehatan.",
    "plan.prep.questions.v1",
    "Templat pertanyaan konsultasi",
    "Saya",
    5,
  ),
  priority(
    "hamil",
    "Siapkan catatan untuk kontrol berikutnya",
    "Ada jadwal kunjungan yang dicatat keluarga.",
    "plan.visit.prep.v1",
    "Templat persiapan kunjungan",
    "Saya",
    2,
  ),
  priority(
    "hamil",
    "Pilih menu minggu ini",
    "Menu membantu memenuhi bahan dan waktu memasak yang tersedia.",
    "plan.menu.week.v1",
    "Templat rencana makan",
    "Saya",
    1,
  ),
  priority(
    "hamil",
    "Bagikan tugas belanja ke pengasuh",
    "Dukungan keluarga perlu berbentuk tindakan yang jelas.",
    "plan.family.task.v1",
    "Templat pembagian tugas keluarga",
    "Pengasuh",
    3,
  ),
  priority(
    "hamil",
    "Periksa perlengkapan persalinan",
    "Persiapan persalinan lebih tenang bila daftar diperiksa bertahap.",
    "plan.birth.bag.v1",
    "Templat persiapan persalinan",
    "Saya",
    6,
  ),
  priority(
    "nifas",
    "Catat jadwal kontrol ibu",
    "Pemulihan ibu punya jalur sendiri setelah kelahiran.",
    "plan.mother.visit.v1",
    "Templat pemulihan ibu",
    "Saya",
    3,
  ),
  priority(
    "nifas",
    "Pilih satu tugas rumah yang diambil alih",
    "Beban ibu berkurang bila tugas rumah dibagi secara konkret.",
    "plan.family.task.v1",
    "Templat pembagian tugas keluarga",
    "Pengasuh",
    1,
  ),
  priority(
    "nifas",
    "Siapkan daftar tanda bahaya",
    "Keluarga perlu tahu kapan mencari bantuan tanpa menunggu formulir.",
    "care.danger.signs.v1",
    "Templat jalur bantuan",
    "Saya",
    2,
  ),
  priority(
    "bayi",
    "Catat berat dan panjang bayi",
    "Pengukuran berkala membantu melihat arah pertumbuhan.",
    "growth.measure.monthly.v1",
    "Templat pemantauan pertumbuhan",
    "Saya",
    4,
  ),
  priority(
    "bayi",
    "Siapkan pertanyaan soal menyusui",
    "Kendala menyusui lebih mudah dibahas bila pertanyaan disiapkan.",
    "care.feed.questions.v1",
    "Templat konsultasi menyusui",
    "Saya",
    2,
  ),
  priority(
    "bayi",
    "Ambil alih satu tugas malam",
    "Dukungan pengasuh membantu ibu mendapat waktu istirahat.",
    "plan.family.task.v1",
    "Templat pembagian tugas keluarga",
    "Pengasuh",
    1,
  ),
  priority(
    "mpasi",
    "Siapkan bahan menu minggu ini",
    "Menu sudah dipilih keluarga, daftar belanja belum dijalankan.",
    "plan.menu.shopping.v1",
    "Templat rencana makan",
    "Pengasuh",
    2,
  ),
  priority(
    "mpasi",
    "Catat berat dan panjang anak",
    "Pengukuran terakhir sudah lebih dari empat minggu.",
    "growth.measure.monthly.v1",
    "Templat pemantauan pertumbuhan",
    "Saya",
    4,
  ),
  priority(
    "mpasi",
    "Siapkan dua pertanyaan untuk posyandu",
    "Kunjungan berikutnya bisa dipakai untuk membahas kendala makan.",
    "care.visit.questions.v1",
    "Templat ringkasan konsultasi",
    "Saya",
    6,
  ),
  priority(
    "mpasi",
    "Coba satu tekstur baru",
    "Keragaman tekstur dilatih bertahap sesuai kemampuan anak.",
    "plan.food.texture.v1",
    "Templat belajar makan",
    "Saya",
    3,
  ),
  priority(
    "balita",
    "Rencanakan satu menu keluarga",
    "Menu keluarga membantu anak makan makanan yang sama dengan aman.",
    "plan.family.menu.v1",
    "Templat menu keluarga",
    "Pengasuh",
    2,
  ),
  priority(
    "balita",
    "Jadwalkan pengukuran bulan ini",
    "Pemantauan pertumbuhan berlanjut sampai sebelum usia lima tahun.",
    "growth.measure.monthly.v1",
    "Templat pemantauan pertumbuhan",
    "Saya",
    5,
  ),
  priority(
    "balita",
    "Pilih satu aktivitas bermain tanpa alat khusus",
    "Interaksi sehari-hari mendukung belajar, bukan mengejar skor.",
    "care.play.daily.v1",
    "Templat aktivitas pengasuhan",
    "Saya",
    1,
  ),
];

export const PANTRY_ITEMS = [
  "Beras",
  "Telur",
  "Ayam",
  "Tempe",
  "Tahu",
  "Ikan kembung",
  "Wortel",
  "Labu siam",
  "Kentang",
  "Tomat",
  "Daun bawang",
  "Pisang",
  "Ubi",
  "Oat",
  "Hati ayam",
  "Minyak",
];

export const ALLERGENS = ["Telur", "Ikan", "Kedelai", "Gandum", "Susu", "Udang"];

export const RECIPES: Recipe[] = [
  {
    id: "bubur-ayam-wortel",
    name: "Bubur ayam wortel",
    stage: "MPASI 8-23 bulan",
    ageMin: 8,
    ageMax: 23,
    texture: "Lumat kasar, naik bertahap",
    minutes: 40,
    servings: 2,
    ingredients: [
      { name: "Beras", amount: "40 g", cost: 1500, alt: { name: "Kentang", amount: "150 g", cost: 3000 } },
      { name: "Ayam", amount: "50 g", cost: 5000, alt: { name: "Tempe", amount: "60 g", cost: 2500, allergens: ["Kedelai"] } },
      { name: "Wortel", amount: "40 g", cost: 1500, alt: { name: "Labu siam", amount: "60 g", cost: 2000 } },
      { name: "Daun bawang", amount: "10 g", cost: 500, alt: { name: "Tomat", amount: "30 g", cost: 800 } },
      { name: "Minyak", amount: "5 ml", cost: 300 },
    ],
    steps: [
      "Cuci tangan dan bahan. Pisahkan talenan mentah dan matang.",
      "Masak beras dengan air sampai lembek.",
      "Kukus ayam sampai matang penuh, lalu cincang halus.",
      "Parut wortel dan masukkan menjelang akhir memasak.",
      "Campur semua, tambahkan minyak, atur tekstur sesuai kemampuan anak.",
    ],
    note: "Takaran contoh untuk demo. Tekstur dan porsi disesuaikan dengan kemampuan anak dan arahan tenaga kesehatan.",
  },
  {
    id: "sup-ikan-tomat",
    name: "Sup ikan kembung tomat",
    stage: "MPASI 12-23 bulan",
    ageMin: 12,
    ageMax: 23,
    texture: "Cincang halus dengan kuah",
    minutes: 30,
    servings: 2,
    ingredients: [
      { name: "Ikan kembung", amount: "80 g", cost: 9000, allergens: ["Ikan"], alt: { name: "Ayam", amount: "60 g", cost: 5000 } },
      { name: "Tomat", amount: "50 g", cost: 1500, alt: { name: "Labu siam", amount: "50 g", cost: 2000 } },
      { name: "Kentang", amount: "60 g", cost: 2500, alt: { name: "Ubi", amount: "60 g", cost: 2000 } },
      { name: "Bawang merah", amount: "10 g", cost: 800 },
      { name: "Minyak", amount: "3 ml", cost: 200 },
    ],
    steps: [
      "Bersihkan ikan, periksa duri dengan teliti.",
      "Kukus ikan sampai matang, lalu suwir dan cincang.",
      "Rebus kentang dan tomat sampai lunak.",
      "Masukkan ikan dan bawang, masak sebentar.",
      "Sajikan hangat dengan tekstur yang sesuai.",
    ],
    note: "Periksa duri dua kali. Hentikan pemberian ikan bila ada reaksi alergi dan cari bantuan tenaga kesehatan.",
  },
  {
    id: "telur-labu",
    name: "Telur orak-arik labu",
    stage: "MPASI 9-23 bulan",
    ageMin: 9,
    ageMax: 23,
    texture: "Lumat dengan gumpalan lembut",
    minutes: 15,
    servings: 1,
    ingredients: [
      { name: "Telur", amount: "1 butir", cost: 2500, allergens: ["Telur"], alt: { name: "Tahu", amount: "80 g", cost: 3000, allergens: ["Kedelai"] } },
      { name: "Labu siam", amount: "50 g", cost: 1800, alt: { name: "Wortel", amount: "40 g", cost: 1500 } },
      { name: "Minyak", amount: "3 ml", cost: 200 },
      { name: "Bawang putih", amount: "5 g", cost: 400 },
    ],
    steps: [
      "Kukus labu sampai lunak, lalu lumatkan.",
      "Kocok telur, campur dengan labu.",
      "Panaskan minyak, masukkan bawang, lalu campuran telur.",
      "Masak sampai telur matang penuh, sajikan hangat.",
    ],
    note: "Telur perlu dimasak sampai matang penuh. Perkenalkan satu bahan baru pada satu waktu.",
  },
  {
    id: "tempe-kukus",
    name: "Tempe kukus lumat",
    stage: "MPASI 9-23 bulan",
    ageMin: 9,
    ageMax: 23,
    texture: "Lumat lembut",
    minutes: 20,
    servings: 1,
    ingredients: [
      { name: "Tempe", amount: "60 g", cost: 2500, allergens: ["Kedelai"], alt: { name: "Ayam", amount: "50 g", cost: 5000 } },
      { name: "Wortel", amount: "30 g", cost: 1200, alt: { name: "Labu siam", amount: "40 g", cost: 1500 } },
      { name: "Bawang putih", amount: "5 g", cost: 400 },
      { name: "Minyak", amount: "2 ml", cost: 150 },
    ],
    steps: [
      "Kukus tempe dan wortel sampai lunak.",
      "Lumatkan dengan garpu, tambahkan bawang yang sudah dikukus.",
      "Tambahkan minyak, aduk rata.",
      "Sajikan hangat dengan tekstur sesuai kemampuan anak.",
    ],
    note: "Tempe termasuk kedelai. Bila ada riwayat alergi, ganti bahan dan konsultasikan.",
  },
  {
    id: "nasi-tim-hati",
    name: "Nasi tim hati ayam",
    stage: "MPASI 12-23 bulan",
    ageMin: 12,
    ageMax: 23,
    texture: "Nasi lembek, hati dicincang",
    minutes: 45,
    servings: 2,
    ingredients: [
      { name: "Beras", amount: "50 g", cost: 1800 },
      { name: "Hati ayam", amount: "40 g", cost: 5000, alt: { name: "Ayam", amount: "50 g", cost: 5000 } },
      { name: "Wortel", amount: "30 g", cost: 1200, alt: { name: "Labu siam", amount: "40 g", cost: 1500 } },
      { name: "Tomat", amount: "30 g", cost: 900 },
      { name: "Minyak", amount: "3 ml", cost: 200 },
    ],
    steps: [
      "Cuci hati, masak sampai matang penuh, lalu cincang halus.",
      "Masak beras dengan air lebih banyak sampai lembek.",
      "Tambahkan wortel dan tomat, masak sampai lunak.",
      "Campur hati, aduk rata, sajikan hangat.",
    ],
    note: "Hati bukan makanan harian. Susun variasi bahan bersama tenaga kesehatan atau ahli gizi.",
  },
  {
    id: "pisang-oat",
    name: "Pisang kukus oat",
    stage: "MPASI 9-23 bulan",
    ageMin: 9,
    ageMax: 23,
    texture: "Lumat lembut",
    minutes: 15,
    servings: 1,
    ingredients: [
      { name: "Pisang", amount: "70 g", cost: 2500 },
      { name: "Oat", amount: "20 g", cost: 2000, allergens: ["Gandum"], alt: { name: "Ubi", amount: "60 g", cost: 2000 } },
      { name: "Air", amount: "50 ml", cost: 0 },
    ],
    steps: [
      "Lumatkan pisang.",
      "Masak oat dengan air sampai lunak.",
      "Campur pisang, aduk rata.",
      "Sajikan hangat. Hindari tambahan gula.",
    ],
    note: "Oat dapat mengandung gluten. Bila perlu menghindari gandum, gunakan ubi.",
  },
  {
    id: "sup-ayam-keluarga",
    name: "Sup ayam keluarga",
    stage: "Balita 24-59 bulan",
    ageMin: 24,
    ageMax: 59,
    texture: "Makanan keluarga, potongan kecil",
    minutes: 45,
    servings: 3,
    ingredients: [
      { name: "Ayam", amount: "200 g", cost: 16000, alt: { name: "Tempe", amount: "150 g", cost: 6000, allergens: ["Kedelai"] } },
      { name: "Kentang", amount: "100 g", cost: 4000, alt: { name: "Ubi", amount: "100 g", cost: 3500 } },
      { name: "Wortel", amount: "80 g", cost: 2500 },
      { name: "Tomat", amount: "50 g", cost: 1500 },
      { name: "Bawang merah", amount: "10 g", cost: 800 },
    ],
    steps: [
      "Potong bahan menjadi ukuran kecil yang aman.",
      "Rebus ayam sampai matang penuh.",
      "Masukkan kentang dan wortel, masak sampai lunak.",
      "Tambahkan tomat dan bawang, masak sebentar.",
      "Sajikan tanpa tambahan garam berlebihan.",
    ],
    note: "Menu keluarga dengan bahan lokal. Batasi gula, garam, dan lemak trans menurut pedoman gizi.",
  },
];

export const GUIDE_ITEMS: GuideItem[] = [
  {
    id: "hpk",
    stages: ["prakonsepsi", "hamil", "nifas", "bayi", "mpasi", "balita"],
    category: "Gizi",
    title: "Seribu hari pertama dimulai sebelum lahir",
    summary:
      "Kerangka 1.000 HPK berjalan dari kehamilan sampai sekitar ulang tahun kedua: sekitar 270 hari kehamilan dan 730 hari setelah lahir.",
    takeaway:
      "Persiapan sebelum hamil adalah tahap tambahan. Usia 24-59 bulan adalah lanjutan, bukan bagian dari hitungan 1.000 HPK.",
    source: "S02 · Kemenkes RI, Ayo Sehat",
  },
  {
    id: "anc",
    stages: ["hamil"],
    category: "Layanan",
    title: "Enam pemeriksaan kehamilan sebagai acuan awal",
    summary:
      "Kemenkes menyebut minimal enam pemeriksaan: satu di trimester pertama, dua di trimester kedua, tiga di trimester ketiga. Minimal dua oleh dokter.",
    takeaway:
      "Jadwal pribadi mengikuti tenaga kesehatan. Aplikasi hanya mengingatkan, tidak mengubah jadwal klinis.",
    source: "S02 · Kemenkes RI, Ayo Sehat",
  },
  {
    id: "asi",
    stages: ["nifas", "bayi"],
    category: "Gizi",
    title: "ASI eksklusif enam bulan pertama",
    summary:
      "WHO menganjurkan ASI eksklusif selama enam bulan, lalu makanan pendamping mulai usia enam bulan sambil melanjutkan ASI sampai dua tahun atau lebih.",
    takeaway:
      "Bila menyusui terkendala, tampilkan akses konseling. Jangan menyalahkan ibu atau menghitung volume dari durasi menyusu.",
    source: "S09 · WHO, Infant and young child feeding",
  },
  {
    id: "mpasi",
    stages: ["mpasi", "balita"],
    category: "Gizi",
    title: "MPASI mulai enam bulan",
    summary:
      "Pedoman WHO 2023 membahas keragaman pangan, makanan hewani, sayur dan buah, serta pemberian makan responsif untuk usia 6-23 bulan.",
    takeaway:
      "Tekstur, frekuensi, dan porsi mengikuti pedoman yang dipilih tim dan lolos penelaahan. Bukan skor kecerdasan.",
    source: "S10 · WHO, Complementary feeding guideline 2023",
  },
  {
    id: "hewani",
    stages: ["mpasi", "balita"],
    category: "Gizi",
    title: "Makanan hewani dan keragaman bahan",
    summary:
      "Keragaman pangan membantu memenuhi kebutuhan gizi. Makanan hewani dan sayur buah masuk dalam anjuran MPASI.",
    takeaway:
      "Satu menu tidak menentukan kecukupan seluruh zat gizi. Nilai gizi yang tidak tersedia ditandai, bukan dianggap nol.",
    source: "S10 · WHO, Complementary feeding guideline 2023",
  },
  {
    id: "gula-garam",
    stages: ["mpasi", "balita"],
    category: "Gizi",
    title: "Batasi gula, garam, dan lemak trans",
    summary:
      "Pedoman MPASI menyarankan menghindari makanan tinggi gula, garam, dan lemak trans serta minuman berpemanis.",
    takeaway:
      "Nilai makanan dari kandungan dan frekuensi, bukan dari tempat membelinya. Tidak ada label orang tua gagal.",
    source: "S10, S11 · WHO",
  },
  {
    id: "ukur",
    stages: ["bayi", "mpasi", "balita"],
    category: "Pertumbuhan",
    title: "Ukur panjang telentang, tinggi berdiri",
    summary:
      "Panjang badan diukur telentang, tinggi badan diukur berdiri. Posisi ukur memengaruhi hasil dan perlu dicatat.",
    takeaway:
      "Foto, usia, atau berat badan saja tidak cukup untuk menilai panjang atau tinggi menurut umur.",
    source: "S14 · Permenkes No. 2 Tahun 2020",
  },
  {
    id: "grafik",
    stages: ["bayi", "mpasi", "balita"],
    category: "Pertumbuhan",
    title: "Grafik bukan diagnosis",
    summary:
      "Kategori antropometri seperti pendek atau normal adalah klasifikasi indikator, bukan diagnosis penyebab atau kesimpulan kesehatan.",
    takeaway:
      "Purwarupa ini menampilkan data mentah. Interpretasi z-score ditahan sampai validasi dan penelaahan klinis selesai.",
    source: "S14 · Permenkes No. 2 Tahun 2020",
  },
  {
    id: "kia",
    stages: ["hamil", "nifas", "bayi", "mpasi", "balita"],
    category: "Layanan",
    title: "Buku KIA sebagai rujukan harian",
    summary:
      "Buku Kesehatan Ibu dan Anak edisi 2024 tersedia di katalog resmi Kemenkes. Isinya perlu ditelaah tim sebelum diadaptasi.",
    takeaway:
      "Catatan aplikasi melengkapi buku, bukan menggantikan catatan layanan kesehatan.",
    source: "S16 · Kemenkes RI, Buku KIA 2024",
  },
  {
    id: "bahaya",
    stages: ["nifas", "bayi"],
    category: "Layanan",
    title: "Tanda bahaya tidak menunggu formulir",
    summary:
      "Contohnya perdarahan banyak atau sulit bernapas setelah melahirkan, bayi tidak mau menyusu, kejang, atau kesulitan bernapas.",
    takeaway:
      "Arahkan ke bantuan medis segera. Daftar ini tidak lengkap dan bukan pengganti penilaian tenaga kesehatan.",
    source: "S08, S19 · WHO",
  },
  {
    id: "emosi",
    stages: ["nifas"],
    category: "Pengasuhan",
    title: "Kesehatan ibu tetap jalur utama",
    summary:
      "Pemulihan fisik, kesejahteraan mental, dukungan keluarga, dan perawatan bayi adalah bagian pengalaman pascapersalinan.",
    takeaway:
      "Check-in ringan bukan alat diagnosis. Bila ada kekhawatiran, sediakan jalur bantuan dan jangan menambah beban mencatat.",
    source: "S08 · WHO, postnatal care",
  },
  {
    id: "privasi",
    stages: ["prakonsepsi", "hamil", "nifas", "bayi", "mpasi", "balita"],
    category: "Privasi",
    title: "Data ibu bukan otomatis milik keluarga",
    summary:
      "UU Pelindungan Data Pribadi menggolongkan data kesehatan dan data anak sebagai data pribadi spesifik.",
    takeaway:
      "Izin berbagi harus spesifik, dapat dicabut, dan berlaku di server. File yang sudah diunduh tidak bisa ditarik kembali.",
    source: "S18 · UU No. 27 Tahun 2022",
  },
  {
    id: "perkembangan",
    stages: ["bayi", "mpasi", "balita"],
    category: "Pengasuhan",
    title: "Perkembangan bukan lomba",
    summary:
      "Aktivitas stimulasi adalah kesempatan berinteraksi, bukan latihan mengejar skor. Perkembangan berbeda dari ukuran tubuh.",
    takeaway:
      "Jangan memeringkat anak. Bila ada kekhawatiran, siapkan pertanyaan dan arahkan ke tenaga kesehatan.",
    source: "S03 · WHO, Nurturing care",
  },
  {
    id: "keluarga",
    stages: ["balita"],
    category: "Gizi",
    title: "Menu keluarga, bukan menu diet",
    summary:
      "Balita makan makanan keluarga dengan potongan aman, variasi bahan, dan pembatasan gula, garam, serta lemak tidak sehat.",
    takeaway:
      "Satu kali makan tidak menentukan status gizi. Nilai pola makan beberapa hari, bukan satu hari.",
    source: "S11 · WHO, Healthy diet",
  },
];

export const MYTHS = [
  {
    myth: "Kecerdasan ditentukan 60% gen dan 40% gizi.",
    fact: "Tidak ada rumus persentase seperti itu. Gen dan lingkungan saling berinteraksi, termasuk gizi, pengasuhan, dan kesempatan belajar.",
    source: "S01",
  },
  {
    myth: "Stunting bisa dideteksi dari foto anak.",
    fact: "Tidak. Penilaian memerlukan panjang atau tinggi badan yang diukur dengan alat dan posisi benar, lalu dibandingkan dengan standar.",
    source: "S14",
  },
  {
    myth: "Volume ASI bisa dihitung dari lama menyusui.",
    fact: "Durasi bukan ukuran volume. Bila ada kendala, cari dukungan laktasi dan tenaga kesehatan.",
    source: "S09",
  },
  {
    myth: "Anak pendek pasti stunting.",
    fact: "Kategori antropometri adalah klasifikasi indikator, bukan diagnosis penyebab. Diperlukan penilaian tenaga kesehatan.",
    source: "S14",
  },
];

export const SOURCES: SourceItem[] = [
  {
    id: "S01",
    org: "MedlinePlus Genetics / NLM",
    title: "Is intelligence determined by genetics?",
    note: "Dasar koreksi klaim genetik dan lingkungan.",
  },
  {
    id: "S02",
    org: "Kementerian Kesehatan RI",
    title: "1000 HPK Kunci Cegah Stunting",
    note: "Periode inti, pemeriksaan kehamilan, konteks 1.000 HPK.",
  },
  {
    id: "S03",
    org: "World Health Organization",
    title: "Nurturing care",
    note: "Kesehatan, gizi, keamanan, pengasuhan responsif, belajar dini.",
  },
  {
    id: "S08",
    org: "World Health Organization",
    title: "Maternal and newborn care for a positive postnatal experience",
    note: "Pemulihan ibu, dukungan keluarga, tanda bahaya bayi baru lahir.",
  },
  {
    id: "S09",
    org: "World Health Organization",
    title: "Infant and young child feeding",
    note: "ASI, awal makanan pendamping, dukungan pemberian makan.",
  },
  {
    id: "S10",
    org: "World Health Organization",
    title: "Complementary feeding 6-23 months (2023)",
    note: "Keragaman pangan dan pemberian makan responsif.",
  },
  {
    id: "S11",
    org: "World Health Organization",
    title: "Healthy diet",
    note: "Pola makan beragam, gula, garam, dan lemak.",
  },
  {
    id: "S14",
    org: "Kementerian Kesehatan RI",
    title: "Permenkes No. 2 Tahun 2020: Standar Antropometri Anak",
    note: "Indikator, kategori, dan prinsip pengukuran.",
  },
  {
    id: "S16",
    org: "Kementerian Kesehatan RI",
    title: "Buku Kesehatan Ibu dan Anak, edisi 2024",
    note: "Rujukan nasional yang perlu ditelaah tim.",
  },
  {
    id: "S18",
    org: "Kementerian Komunikasi dan Digital",
    title: "UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi",
    note: "Data spesifik dan persetujuan pemrosesan data anak.",
  },
];

export const dateLabelForStage = (stage: StageId): string => {
  if (stage === "hamil") return "Hari pertama haid terakhir (opsional)";
  if (stage === "prakonsepsi") return "";
  return "Tanggal lahir anak (opsional)";
};
