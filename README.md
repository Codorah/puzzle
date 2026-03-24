
<div align="center">
  
# 🧩 Lumina Elite
Production-Ready Sliding Puzzle PWA & Gamified Messaging Protocol

[![React](https://img.shields.io/badge/React-19.0-blue.svg?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-purple.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-100%25_Offline-success.svg?style=flat&logo=pwa)](https://web.dev/progressive-web-apps/)
[![Security](https://img.shields.io/badge/Security-Zero--Tracking-shield.svg?style=flat)](#-security--privacy-zero-tracking)

### 🚀 [Play Lumina Elite Live](https://p-lumina.vercel.app/) 🚀

</div>



Lumina Elite is an App Store-grade Progressive Web App (PWA) that redefines the classic sliding puzzle. Engineered to deliver a luxurious, fluid, and immersive mobile experience, it transcends a simple game to become an asymmetric messaging tool. The architecture prioritizes visual perfection, native-like interactions, and complex client-side mechanics.

Lead Architect & Developer: Elodie ATANA (AI Engineer & Founder of Codorah)
⚙️ Tech Stack & Architecture

Built on a modern, lightweight, and ultra-fast foundation:

    Core Logic: JavaScript (ES6+), HTML5

    Styling: Native CSS3 (Root Variables, Flexbox/Grid, Dynamic Geometry dvh)

    Frontend Framework: React (v19)

    Build Tool & Server: Vite (v8)

    Local Storage: localforage (Asynchronous local database utilizing IndexedDB)

    Offline Management (PWA): vite-plugin-pwa powered by Workbox

    Image Processing Engine: HTML5 Canvas API (2D WebGL Context)

 Core Engineering Features
1. App Shell Architecture (Native Interface)

The UI is strictly structured as a native application. Zero accidental scrolling. The game layout adapts dynamically using advanced CSS mathematical functions (min(), aspect-ratio) and dynamic viewport heights (100dvh). Whether on a compact smartphone, a wide tablet, in portrait, or landscape mode, the puzzle remains a perfect, strictly centered square without ever cropping buttons or headers.
2 Canvas-Powered HD Upscaling & Cropping Engine

When users upload personal photos, the application bypasses basic rendering. The image is intercepted in the background by a dedicated Canvas script that:

    Crops to a perfect square (1:1 ratio), completely preventing tile distortion or stretching.

    Upscales to High Definition (1080p min) using hardware acceleration (imageSmoothingQuality = 'high'), ensuring optimal sharpness even for smaller source images once sliced onto the grid.

3. Offline-First PWA (100% Network Independent)

Leveraging Service Workers configured via vite-plugin-pwa, users only need network access for the initial visit. The application caches the entire source code (HTML, CSS, JS) and default gallery assets. Result: Instantaneous performance in airplane mode, underground, or in zero-connectivity environments.
4. Persistent Private Gallery (IndexedDB)

Beyond the curated pre-loaded gallery, users can import personal high-resolution photos. Using localforage, these heavy files are silently compressed (1080p cap) and stored directly in the browser's IndexedDB.

    Uploaded assets persist across sessions and device reboots.

    100% private, client-side storage with zero cloud server involvement.

    Full CRUD capabilities directly within the gallery UI.

5.  Asymmetric Messaging & URL Cryptography

Users can embed a "Secret Message" to generate a challenge link.

    The payload is securely encoded into textual Base64 (UTF-8 compliant) directly within the URL parameters (e.g., ?msg=SGVsbG8=).

    The recipient sees the puzzle interface but can only decrypt and read the hidden text upon successful resolution of the grid (Victory State trigger).

    No backend database is required; the data transfer is strictly peer-to-peer via URL state.

6. Dynamic Auto-Shuffle Execution

Seamless UX for shared challenges: if the application detects a challenge link upon launch, immediately following the startup animation, it automatically selects the payload image and shuffles the tiles at the exact difficulty level dictated by the URL parameters (e.g., ?lvl=5).
7.  Premium UI/UX & Glassmorphism

    Dark Mode Luxe: Obsidian backgrounds, electric blue accents, and gold highlights.

    Glassmorphism: Modals, headers, and settings menus utilize advanced blur filters (backdrop-filter) and sophisticated opacities.

    Seamless Preview: During gameplay, the Preview function superimposes the solved image using an elegant crossfade transition without disrupting the game state.

    Native-Style Settings: A strictly defined 100dvh settings view that slides from the bottom, featuring iOS-style toggles for theme and audio management.

Repository Architecture

    src/App.jsx: The core engine. Contains the React lifecycles (useEffect, useState), the HD Canvas engine logic, URL state parsing, and localforage queries. Highly structured and documented for maintainability.

    src/index.css: The "Single Source of Truth" design system. Manages extreme responsive geometry (min(), 100dvh), keyframe animations, and the CSS variable-driven theming engine.

    vite.config.js: Bundler configuration housing the PWA plugin setup and Workbox rules (global caching strategies for static assets and /gallery/ endpoints).

🛠️ Getting Started / Installation
Bash

# 1. Clone the repository
git clone https://github.com/Codorah/puzzle.git

# 2. Navigate to the directory and install dependencies
npm install

# 3. Start the local development server
npm run dev

# 4. Build for production / deployment (generates the /dist folder)
npm run build


 Security & Privacy (Zero-Tracking)

Lumina Elite is a Zero-Tracking application. No personal data, uploaded images, or secret messages are ever transmitted to the internet or hosted on external servers. All processing intelligence—including Canvas resizing, IndexedDB storage, and URL decryption—executes exclusively client-side within the end-user's browser sandbox. The architecture is inherently "Secure by Design" through its 100% local execution model.