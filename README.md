# Lumina Elite: Premium Sliding Puzzle PWA

Lumina Elite is a world-class, premium sliding puzzle web application built with React, Vite, and absolute attention to detail and design. It features an array of incredible mobile-first mechanics, secure offline persistence, and seamless social sharing functionality.

**Developer:** Elodie ATANA (Ingénieure IA & Lead Architect, Codorah)

## 🚀 Key Features

* **App Shell Architecture**: True mobile-native feel. Zero scrolling, no overflow, perfectly locked iOS/Android experience. Responsive to any screen size.
* **Full-Screen Settings Page**: A comprehensive, sliding settings menu featuring iOS-style toggle interactions, custom theme switching, and access to developer portfolio links.
* **Canvas HD Upscaler & Square Cropper**: Never see a distorted or low-resolution image again. Any image uploaded or chosen is intercepted via a rigorous WebGL/Canvas algorithm, perfectly cropped to a 1:1 format, and artificially upscaled to *at least* 1080p high definition (HD) before rendering the puzzle.
* **100% Offline PWA (Service Workers)**: Powered by `vite-plugin-pwa`. Once loaded, the game caches all assets, scripts, and the complete image gallery via an aggressive Workbox policy. You can play completely without an internet connection!
* **Persistent Custom User Gallery**: Uploaded images are cleanly compressed without losing quality and saved directly to the device browser's `IndexedDB` using `localforage`. They stay in your private gallery permanently, available even offline.
* **Mystery Message Sharing**: Encode a secret message into a `base64` shared link. The recipient will only see your custom message *after* successfully completing the puzzle!
* **Instant Auto-Shuffle**: When a friend opens your shared link, the splash screen fades and the board instantly shuffles automatically at the exact difficulty level (e.g., 5x5) you sent them.
* **Glassmorphic UI & Dark Mode**: A stunning Obsidian Dark/Bright Light theme paired with precise blur filters, beautiful bottom sheets for Gallery/Difficulty, and sleek buttons.
* **Seamless Crossfade Preview**: Press the "Aperçu" button to seamlessly crossfade from the playable puzzle grid to the fully solved image directly over the board, without breaking the layout.

## 🛠️ Technology Stack

* **Core**: React 19 & Vite 8
* **Styling**: Vanilla CSS entirely driven by Root CSS Variables for atomic consistency.
* **Storage**: `localforage` (IndexedDB Wrapper for robust unlimited offline image storage)
* **PWA**: `vite-plugin-pwa` (Offline Service Workers, Webmanifest generation)

## 💻 Installation & Usage

```bash
# Clone the repository
# Navigate to the project directory

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔒 Security & Privacy Statement
This is a zero-tracking application. This application evaluates no external APIs and operates entirely locally on your machine/device. All user-uploaded images and secret messages are processed locally in the browser's DOM securely. Mystery messages use UTF-8 base64 encoding and are decoded purely client-side without ever touching a server database.
