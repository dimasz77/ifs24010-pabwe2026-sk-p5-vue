# ifs24010-pabwe2026-sk-p5-vue

Delcom Auction - aplikasi lelang online (Vue 3, JavaScript, Pinia, Tailwind CSS v4, Vitest).

## Menjalankan

```bash
bun install
cp .env.example .env   # sesuaikan jika perlu
bun run dev            # http://localhost:3000
```

## Pengujian

```bash
bun run test:coverage  # threshold 100% (statements, branches, functions, lines)
```

Laporan: `coverage/lcov.info` (dibaca SonarQube) dan `test-results/junit.xml` (dibaca Jenkins).

## CI/CD

- `Jenkinsfile`: Checkout, Setup Bun, Install, Test + Coverage, SonarQube Analysis, Quality Gate, Build.
  Nama konfigurasi Jenkins yang dipakai: tool `SonarScanner` dan server `SonarQube`
  (ubah di `Jenkinsfile` jika berbeda di Jenkins kampus).
- `sonar-project.properties`: project key `ifs24010-pabwe2026-sk-p5-vue`.

## Deploy (Vercel)

Nama project Vercel: `ifs24010-pabwe2026-sk-p5-vue` agar URL sesuai batas prefix penilaian.
Build command `bun run build`, output `dist`. `vercel.json` sudah berisi SPA rewrite dan security headers.
