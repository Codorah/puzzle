# 🧩 Lumina: Premium Puzzle

A world-class, high-fidelity Progressive Web Application (PWA) sliding puzzle game. **Lumina** combines a minimalist, glassmorphic aesthetic with advanced front-end engineering to deliver a truly premium gaming experience.

## ✨ Features
- **Lumina Branding**: A sophisticated identity focused on light, precision, and elegance.
- **Glassmorphic UI**: High-end visual effects using frosted glass backgrounds and subtle obsidian-to-slate gradients.
- **Custom Photo Engine**: Securely upload and slice your own photos into high-resolution puzzles.
- **Curated Gallery**: includes a professional collection of premium abstract and cosmic photography.
- **Universal Accessibility**: 
  - **Multi-language**: Seamless switching between French 🇫🇷, English 🇺🇸, and Spanish 🇪🇸.
  - **Theming**: Premium Dark and Light modes for any lighting environment.
- **PWA Excellence**: Installable on any device with offline play support via optimized Service Workers.
- **Seamless Board**: Precisely calibrated tile alignment with zero gaps for an immersive visual experience.

## 🔒 Security Posture
Built with a "Security-First" mindset:
- **XSS & DoS Protection**: Strict MIME-type validation (`JPG`, `PNG`, `WEBP`) and 5MB payload limits for image uploads.
- **Hardened Headers**: `vercel.json` inclusion for `X-Frame-Options: DENY` and `nosniff` protection.
- **Supply Chain Integrity**: Audited dependencies to ensure a clean software lifecycle.

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Codorah/puzzle.git
   cd puzzle
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment
Optimized for **Vercel**:
```bash
npm run build
vercel --prod
```

---
*Developed by Elodie ATANA (Codorah) — Bridging AI, Design, and Engineering.*
