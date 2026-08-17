# gameEdukasiInteraktif

## Deskripsi Game

`gameEdukasiInteraktif` adalah permainan edukasi untuk anak usia dini yang membantu mengenal huruf, membentuk kata, dan menyusun kembali huruf yang teracak. Setiap huruf memiliki suara pengucapan, sehingga anak tidak hanya melihat bentuk huruf tetapi juga mendengar bunyinya.

## Mekanisme Level

1. Level 1 - Mengenal Huruf
   - Anak dapat menekan huruf A sampai Z.
   - Setiap huruf memicu suara pengucapan huruf tersebut.
   - Tujuan: membiasakan anak mengenali huruf dan bunyi masing-masing.

2. Level 2 - Menyusun Kata
   - Anak menarik garis dari satu huruf ke huruf berikutnya untuk membentuk kata.
   - Aplikasi memeriksa apakah kata yang dibentuk sudah benar.
   - Suara huruf tetap aktif dan akan diputar saat kata disusun.

3. Level 3 - Menyusun Ulang Huruf
   - Anak merapikan kembali kata yang huruf-hurufnya diacak dengan menukar posisi huruf.
   - Permainan mengecek apakah hasilnya sudah sama dengan kata target.
   - Suara huruf tetap membantu pada setiap interaksi huruf.

## Perbaikan dan Kebersihan Kode

- Semua logika inti ditempatkan di folder `core/`.
- Redundansi audio dan validasi kata telah disederhanakan.
- `AudioManager` sekarang menggunakan `preload: false` untuk mengurangi beban awal dan mendukung lazy loading audio.
- `WordValidator` menggunakan daftar kata terpusat dari file data dan daftar level, agar validasi tetap konsisten.
- Halaman level menggunakan modul `core/` untuk meminimalkan duplikasi kode.

## Struktur Folder

- `core/` - logika utama permainan dan audio.
- `data/` - definisi huruf dan kumpulan kata.
- `assets/audio/` - aset suara huruf dan efek.
- `PAGE/` - halaman permainan level dan dashboard.

## Catatan Pengembangan

- Pastikan halaman yang memerlukan audio memuat `Howler.js`.
- Untuk meningkatkan performa lebih lanjut, aset gambar dan audio bisa dikompresi atau dimuat secara selektif.
