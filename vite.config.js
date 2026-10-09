import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import process from "process";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1";
  // Di build produksi, request lewat rewrite Vercel (/api/v1 -> open-api.delcom.org)
  // agar same-origin dan tidak memicu preflight CORS.
  const baseUrl = mode === "production" && !env.VITE_DELCOM_BASEURL ? "/api/v1" : apiUrl;
  const port = Number(env.APP_PORT) || 3000;

  return {
    plugins: [vue(), tailwindcss()],
    server: { port },
    preview: { port },
    define: {
      DELCOM_BASEURL: JSON.stringify(baseUrl),
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      include: ["src/**/*.test.{js,jsx}"],
      exclude: ["**/node_modules/**", "**/.bun/**", "**/.node/**", "**/dist/**"],
      reporters: ["default", "junit"],
      outputFile: { junit: "./test-results/junit.xml" },
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov"],
        include: ["src/**/*.{js,vue}"],
        exclude: [
          "src/main.js",
          "src/setupTests.js",
          "src/test-utils.js",
          "**/*.test.{js,jsx}",
          "**/node_modules/**",
          "**/.bun/**",
          "**/.node/**",
        ],
        thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 },
      },
    },
  };
});