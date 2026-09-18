# Writely

<p align="center">
  <img src="public/icons/icon.svg" alt="Writely Logo" width="96" height="96" style="border-radius: 20px;" />
</p>

<p align="center">
  <strong>A distraction-free, local-first markdown workspace crafted for deep work.</strong>
</p>

<p align="center">
  <a href="https://github.com/hiimanshu19x/writely/stargazers"><img src="https://img.shields.io/github/stars/hiimanshu19x/writely?style=for-the-badge&color=blue" alt="Stars"></a>
  <a href="https://github.com/hiimanshu19x/writely/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License"></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS"></a>
  <a href="https://dexie.org"><img src="https://img.shields.io/badge/IndexedDB-Dexie.js-orange?style=for-the-badge" alt="Dexie.js"></a>
</p>

<p align="center">
  <a href="https://usewritely.vercel.app"><strong>🚀 Live App: https://usewritely.vercel.app</strong></a>
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/hiimanshu19x/writely&project-name=writely&repository-name=writely">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
</p>

---

## ✨ Overview

**Writely** is an ultra-minimalist, distraction-free writing environment built for thinkers, writers, and builders. It bridges the elegance of macOS native text editors with modern local-first web technologies, giving you a lightning-fast workspace that works offline, preserves complete privacy, and never traps your data.

- 🔒 **100% Local-First & Private:** Everything is stored directly in your browser's persistent IndexedDB via Dexie.js. No telemetry, no cloud lock-in, zero latency.
- ⚡ **Instant Startup & PWA Ready:** Install Writely as a standalone Progressive Web App on Chrome, Edge, macOS, iOS, or Android with custom ultra-high-resolution icons and an ambient launch animation.
- 🎨 **8 Hand-Crafted Themes:** From true pitch-black OLED to tranquil Forest Pine, every theme has been tuned for typographic contrast, legibility, and reduced eye fatigue.
- 🔤 **11 Premium Fonts:** Choose between Apple SF Pro, high-end editorial serifs (Merriweather, Playfair Display), modern sans-serifs (Inter, Plus Jakarta Sans), or programmer monospaces (JetBrains Mono, Fira Code).
- 🪄 **Fluid Micro-Interactions:** Smooth sliding formatting panels, rotating controls, and borderless floating scrollbars that fade out gracefully.

---

## 🎨 8 Curated Premium Themes

Every theme in Writely is built using semantic CSS custom properties, adjusting backgrounds, surface elevations, text hierarchy, and accent glows dynamically:

| Theme | Atmosphere | Primary Accent | Best For |
| :--- | :--- | :--- | :--- |
| **Light** | Clean, radiant, minimalist | Royal Blue | Daytime writing & drafting |
| **Dark** | Modern charcoal slate | Electric Sky | Evening sessions & low light |
| **Sepia** | Warm analog parchment | Amber Gold | Long reading & reduced eye strain |
| **OLED Black** | Pure `#000000` pitch black | High-contrast Emerald | AMOLED displays & night owls |
| **Nord** | Arctic frost & Scandinavian cool | Glacial Cyan | Coding notes & chilled focus |
| **Midnight Blue** | Deep nocturnal oceanic navy | Celestial Indigo | Creative writing & midnight thoughts |
| **Forest Pine** | Earthy botanical sanctuary | Evergreen Moss | Mindful reflection & journaling |
| **Cyberpunk** | High-octane synthwave neon | Vivid Magenta & Cyan | High-energy flow & brainstorming |

---

## 🔤 11 Premium Typography Options

Typography is the core of any great writing tool. Writely lets you switch fonts in real-time without layout shifting:

- **System & Apple:**
  - `SF Pro / System Sans` — Native Apple-grade clarity and rhythm
- **Modern Sans-Serif:**
  - `Inter` — Precision-engineered for computer screens
  - `Plus Jakarta Sans` — Geometric contemporary warmth
  - `Outfit` — Friendly, modern rounded geometry
  - `DM Sans` — Low-contrast geometric design for editorial flow
- **Editorial Serif:**
  - `Merriweather` — Designed specifically for comfortable screen reading
  - `Playfair Display` — Classic high-contrast editorial elegance
  - `Lora` — Calligraphic curves balanced for literature and poetry
- **Developer Monospace:**
  - `JetBrains Mono` — Distinctive code font with increased x-height
  - `Fira Code` — Beautiful ligature-enabled monospace for technical documentation

---

## 💾 Local-First Architecture & Data Safety

### Where is your data saved?
Writely uses **Dexie.js** on top of the browser's native **IndexedDB** database engine.

- **Persistent Browser Sandbox:** Every folder, note, and keystroke is written instantly to your device's local database.
- **Closing the App / Browser:** **Your data is NOT deleted!** When you close your tab, shut down your browser, or reboot your machine, everything remains securely saved and rehydrates instantaneously on relaunch.
- **Offline Capable:** Works 100% without an active internet connection.
- **Cache vs Storage:** Normal browser cache clearance does not touch IndexedDB unless you explicitly choose to wipe "Cookies and Site Data / Storage" for the domain.
- **Exports:** You can export your documents anytime as standard Markdown (`.md`), HTML, or clean formatted text.

---

## 📱 Progressive Web App (PWA) Features

Writely is fully configured as a progressive web application:
- **Ultra High-Definition Master Icons:** 512×512 master PNGs, maskable icons with 80% safe zone compatibility for Android squircle masks, and Apple touch icons.
- **Standalone Window Mode:** Runs without browser navigation bars or tab strips, providing an authentic desktop app experience.
- **Theme-Adaptive Splash Screen:** Displays an ambient breathing monogram and launch progress indicator on startup, with instant keyboard or click dismissal.
- **Dynamic Tab & Favicon:** Keeps browser tabs uncluttered with just `Writely` and an icon that adapts dynamically to your chosen theme.

---

## ⌨️ Productivity & Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl / Cmd + B` | Bold selected text |
| `Ctrl / Cmd + I` | Italicize selected text |
| `Ctrl / Cmd + U` | Underline selected text |
| `Ctrl / Cmd + Shift + F` | Toggle Animated Formatting Sidebar |
| `Ctrl / Cmd + Shift + S` | Open Settings (Themes, Fonts, Layout) |
| `Ctrl / Cmd + Alt + 1` | Format Heading 1 |
| `Ctrl / Cmd + Alt + 2` | Format Heading 2 |
| `Ctrl / Cmd + Alt + 3` | Format Heading 3 |
| `Ctrl / Cmd + Shift + 7` | Ordered List |
| `Ctrl / Cmd + Shift + 8` | Bulleted List |
| `Ctrl / Cmd + Shift + 9` | Blockquote |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Editor Engine:** [Tiptap](https://tiptap.dev/) / ProseMirror
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & Storage:** [Dexie.js](https://dexie.org/) (IndexedDB)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Image & Icon Generation:** [Sharp](https://sharp.pixelplumbing.com/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ (or Node 20+)
- npm, pnpm, or yarn

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hiimanshu19x/writely.git
   cd writely
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

4. **Run production build & test:**
   ```bash
   npm run build
   node tests/writely.test.mjs
   ```

---

## 🌐 Deploy to Vercel

### Method 1: 1-Click Deploy (Fastest)

Click the button below to instantly deploy your own fork to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hiimanshu19x/writely&project-name=writely&repository-name=writely)

### Method 2: Import via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and select **`hiimanshu19x/writely`**.
3. Under **Project Name**, enter `writely` (or your preferred name).
4. Click **Deploy**. Vercel will automatically build and assign your domain (e.g. `writely.vercel.app`).

### Method 3: Vercel CLI

```bash
# Install and login
npm i -g vercel
vercel login

# Deploy to production
vercel --prod
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
