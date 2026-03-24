# 🧩 Lumina Elite - Documentation Complète

## 📖 Présentation du Projet
**Lumina Elite** est une application web de puzzle à glissement (Sliding Puzzle) de niveau App Store (Progressive Web App - PWA). Elle a été conçue pour offrir une expérience mobile luxueuse, fluide et immersive. Le concept est de reconstituer une image divisée en tuiles, avec un accent particulier mis sur la perfection du rendu visuel et la complexité des mécaniques sous-jacentes.

**Développeur** : Elodie ATANA (Ingénieure IA & Lead Architect, Fondatrice de Codorah)

---

## ⚙️ Stack Technique & Langages

L'application est construite sur une architecture moderne, légère et ultra-rapide.

* **Cœur / Logique** : JavaScript (ES6+), HTML5
* **Stylisation** : CSS3 Natif (Variables Root, Flexbox/Grid, Géométrie Dynamique `dvh`)
* **Framework Front-end** : React (v19)
* **Outil de Build & Serveur** : Vite (v8)
* **Stockage Local** : `localforage` (Base de données locale asynchrone basée sur IndexedDB)
* **Gestion Hors-Ligne (PWA)** : `vite-plugin-pwa` propulsé par Workbox
* **Moteur d'Image** : HTML5 Canvas API (Context 2D WebGL)

---

## ✨ Fonctionnalités Principales (Features)

### 1. 📱 App Shell Architecture (Interface Native)
L'interface est structurée comme une véritable application native. **Il n'y a aucun défilement de page accidentel.** Le jeu s'adapte dynamiquement grâce aux fonctions mathématiques CSS (`min()`, `aspect-ratio`) et aux hauteurs dynamiques (`100dvh`). Peu importe le format du téléphone de l'utilisateur (très petit, large, portrait ou paysage), le puzzle reste un carré strict parfaitement centré sans jamais couper les boutons ou l'en-tête.

### 2. 🖼️ Moteur d'Upscaling & Recadrage Canvas
Lorsqu'un utilisateur sélectionne une de ses propres photos, l'application ne se contente pas de l'afficher. L'image est interceptée en arrière-plan par un script `Canvas` qui :
* **Recadre l'image en un carré parfait (1:1)**, empêchant totalement toute déformation ou étirement des tuiles.
* **Met à l'échelle (Upscale) en Haute Définition (1080p min)** via l'accélération matérielle (`imageSmoothingQuality = 'high'`), assurant que même une petite image reste ultra-nette une fois découpée sur la grille du puzzle.

### 3. 🌐 Progressive Web App (100% Hors-Ligne)
Grâce aux Service Workers configurés via `vite-plugin-pwa`, un joueur n'a besoin du réseau qu'à sa première visite. L'application met en cache l'intégralité du code source (HTML, CSS, JS) ainsi que toutes les images par défaut. **Résultat : Le jeu de puzzle peut être lancé en mode avion, dans le métro ou sans 4G avec des performances instantanées.**

### 4. 🗄️ Galerie Personnelle Persistante (IndexedDB)
L'application propose une galerie d'images préchargées, mais permet également l'importation de photos. Grâce à **`localforage`**, ces photos volumineuses sont redimensionnées silencieusement (compression max 1080p) puis enregistrées dans la base de données `IndexedDB` du navigateur de l'utilisateur.
* Les photos importées survivent à la fermeture de l'onglet ou au redémarrage du téléphone.
* C'est un stockage 100% privé, sans aucun serveur cloud, qui permet au joueur de constituer sa propre collection hors-ligne.
* Possibilité de supprimer les photos importées directement depuis la galerie.

### 5. ✉️ Mécanique de Message Mystère (Cryptage URL)
Le joueur peut taper un "Message Secret" et générer un lien de défi à envoyer à un ami. 
* Le message est encodé en **Base64** textuel de manière sécurisée (UTF-8) via l'URL (ex: `?msg=SGVsbG8=`).
* Le destinataire du lien verra le puzzle, mais ne pourra lire le texte secret qu'**après avoir résolu** le puzzle avec succès (apparition de l'écran de Victoire).
* Aucune base de données backend n'est nécessaire pour cet échange, tout est géré de pair-à-pair côté client.

### 6. 🔀 Auto-Mélange Dynamique (Auto-Shuffle)
L'expérience utilisateur du partage est poussée au maximum : si l'application détecte qu'un joueur a ouvert un lien de défi, dès que l'animation du logo de démarrage se termine, **l'application sélectionne l'image reçue et mélange automatiquement les tuiles sous les yeux du joueur** au niveau de difficulté (ex: 5x5) dicté par le lien (`?lvl=5`).

### 7. 🎨 UI/UX Premium & Glassmorphism
* L'application arbore un thème "Dark Mode Luxe" avec des couleurs obsidiennes, des bleus électriques fluos et de l'or.
* **Effets de Verre (Glassmorphism)** : Les modals, le header et les menus de réglages emploient des filtres de flou (`backdrop-filter`) et des transparences sophistiquées.
* **Aperçu Fluide (Seamless Preview)** : En pleine partie de puzzle, le bouton d'Aperçu superpose l'image complète avec un fondu enchaîné élégant (crossfade) sans avoir besoin de fermer l'écran de jeu.
* **Page Paramètres Native** : Conçue comme une vraie page d'application mobile (`100% dvh`) qui glisse du bas de l'écran, avec des interrupteurs iOS pour le mode de thème et du son.

---

## 📂 Architecture des Fichiers Clés

* `src/App.jsx` : Contient l'intégralité de la logique de jeu, des cycles de vie React (`useEffect`, `useState`), du moteur de Canvas HD, du partage d'URL et des requêtes LocalForage. L'ensemble est hautement structuré et commenté.
* `src/index.css` : Le système de design "Single Source of Truth", gérant la géométrie responsive extrême (`min()`, `100dvh`), les animations (`@keyframes`), et le système de thème piloté par variables CSS (`--bg-primary`, etc).
* `vite.config.js` : Configuration du bundler avec intégration du plugin PWA (`vite-plugin-pwa`) et définitions des règles `Workbox` (cache global des assets statiques et images `/gallery/...`).

---

## 🛠️ Instructions de Lancement

```bash
# 1. Cloner ou télécharger le dépôt
git clone https://github.com/Codorah/puzzle.git

# 2. Installer les dépendances (React, Vite, LocalForage)
npm install

# 3. Lancer le serveur de développement local
npm run dev

# 4. Compiler pour la production / déploiement (génère le dossier /dist)
npm run build
```

## 🔐 Sécurité & Transparence
Lumina Elite est une application **Zéro-Tracking**. Aucune donnée personnelle, aucune image importée, ni aucun message secret n'est envoyé vers internet ou hébergé. Toute l'intelligence (Redimensionnement Canvas, Sauvegarde IndexedDB, Décryptage URL) s'exécute exclusivement **côté-client** directement dans la Sandbox du navigateur de l'utilisateur final. L'application est intrinsèquement protégée ("Secure by Design") grâce à ce fonctionnement 100% local.
