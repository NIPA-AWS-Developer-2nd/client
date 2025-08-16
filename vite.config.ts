import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// package.json 버전 정보
import packageJson from "./package.json";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 환경변수 로드
  const env = loadEnv(mode, ".", "");

  // API URL에서 베이스 URL 추출
  const apiUrl = env.VITE_API_URL || "http://localhost:3000";
  const apiBaseUrl = apiUrl.replace(/\/api$/, "");

  return {
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
    },
    build: {
      // Optimize build performance and memory usage
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['styled-components', 'lucide-react'],
            utils: ['zustand', 'ulid'],
          }
        }
      }
    },
    server: {
      // 개발 서버에서 캐시 비활성화
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      // API 요청을 백엔드로 프록시
      proxy: {
        "/api": {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
        },
        // 특정 auth 엔드포인트만 백엔드로 프록시 (/auth/success는 제외)
        "^/auth/(?!success|callback).*": {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "gstatic-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "images",
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
          ],
        },
        includeAssets: [
          "favicon.ico",
          "icons/icon-192x192.png",
          "icons/icon-512x512.png",
        ],
        manifest: {
          name: "Halsaram",
          short_name: "Halsaram",
          description: "지역 기반 번개모임 커뮤니티",
          theme_color: "#000000",
          background_color: "#000000",
          display: "standalone",
          scope: "/",
          start_url: "/",
          orientation: "portrait-primary",
          icons: [
            {
              src: "icons/icon-72x72.png",
              sizes: "72x72",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "icons/icon-96x96.png",
              sizes: "96x96",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "icons/icon-128x128.png",
              sizes: "128x128",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "icons/icon-144x144.png",
              sizes: "144x144",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "icons/icon-152x152.png",
              sizes: "152x152",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "icons/icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "icons/icon-384x384.png",
              sizes: "384x384",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
      }),
    ],
  };
});
