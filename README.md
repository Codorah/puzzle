# 🧩 Premium Puzzle PWA

A high-fidelity, Progressive Web Application (PWA) sliding puzzle game built with React and Vite. It features a luxurious dark theme with bordeaux and gold accents, offering a premium user experience with zero compromises on performance and security.

## ✨ Features
- **Custom Photo Uploads**: Users can upload their own images to slice into a custom puzzle on-the-fly.
- **Mathematical Solvability**: The shuffle algorithm ensures all generated puzzles are 100% solvable by executing a series of reversed legal moves from the solved state.
- **Progressive Web App (PWA)**: Fully installable and offline-capable, leveraging service workers to cache assets securely.
- **Advanced Micro-Interactions**: Includes real-time move counters, a built-in timer, subtle CSS micro-animations, and synthesized sound effects via the Web Audio API.

## 🔒 Security Posture
Security is a first-class citizen in this project, adopting modern defense-in-depth strategies:
- **Client-Side File Validation (Anti-XSS/DoS)**: Strict MIME-type whitelisting (`image/jpeg`, `image/png`, `image/webp`) prevents malicious SVG payload executions. Hard file-size caps prevent potential client memory crashes.
- **Supply Chain Guardrails**: Regular `npm audit` pipelines ensure dependencies remain free of high-severity vulnerabilities.
- **Hardened HTTP Headers**: Implements `vercel.json` to enforce strict isolation:
  - `X-Frame-Options: DENY` (Clickjacking prevention)
  - `X-Content-Type-Options: nosniff` (MIME-sniffing prevention)
  - `Referrer-Policy: strict-origin-when-cross-origin`

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Codorah/puzzle.git
   cd puzzle
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the local development server**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment
This project is optimized for a zero-configuration deployment to **Vercel**. 
```bash
npm run build
vercel --prod
```
The accompanying `vercel.json` will automatically secure the deployment headers out of the box.

---
*Developed with a focus on seamless user experience, responsive web design, and front-end security.*
