import { useState, useEffect, useCallback, useRef } from 'react';
import './index.css';

/**
 * Icons: Minimalist, consistent Lucide-style SVGs.
 */
const Icons = {
  Gallery: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>,
  Settings: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1-1-1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>,
  Shuffle: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>,
  Hint: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>,
  Preview: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>,
  Share: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>,
  Upload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>,
  Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>,
  Copy: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>,
  LinkedIn: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>,
  Mail: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
  Globe: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
  Github: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
};

const DEFAULT_GALLERY = [
  '/gallery/puzzle-4.png', '/gallery/nezuko.jpg', '/gallery/fufu.jpg', '/gallery/mac.jpg',
  '/gallery/naruto.jpg', '/gallery/gboma.jpg', '/gallery/zoo.jpg', '/gallery/gojo.jpg',
  '/gallery/renard.jpg', '/gallery/puzzle-1.png', '/gallery/puzzle-2.png', '/gallery/puzzle-3.png'
];

export default function App() {
  // Gameplay State
  const [gridSize, setGridSize] = useState(3);
  const [image, setImage] = useState('/gallery/puzzle-4.png');
  const TILE_COUNT = gridSize * gridSize;
  const [tiles, setTiles] = useState([...Array(TILE_COUNT).keys()]);

  // Progress State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [isReady, setIsReady] = useState(false); // Splash screen state
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);

  // Custom Overlays State
  const [showSettings, setShowSettings] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Feature State
  const [showHints, setShowHints] = useState(false);
  const [view, setView] = useState('board'); // 'board' | 'gallery' | 'level'
  const [loadedImages, setLoadedImages] = useState({});
  const [croppedImage, setCroppedImage] = useState(null); // The perfectly squared image
  const fileInputRef = useRef(null);

  // Mystery Message State
  const [secretMessage, setSecretMessage] = useState(''); // Decoded from URL
  const [messageInput, setMessageInput] = useState(''); // Typed by user

  // Settings State
  const [userName, setUserName] = useState('Player');
  const [theme, setTheme] = useState('dark');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initial URL parsing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('msg');
    const imgIdx = params.get('img');
    const level = parseInt(params.get('lvl'));

    if (msg) try { setSecretMessage(decodeURIComponent(escape(window.atob(msg)))); } catch (e) { }
    if (imgIdx && DEFAULT_GALLERY[imgIdx]) setImage(DEFAULT_GALLERY[imgIdx]);
    else if (imgIdx === 'custom') setImage(DEFAULT_GALLERY[0]);

    if (level && [3, 4, 5].includes(level)) setGridSize(level);
    setTimeout(() => setIsReady(true), 1500);
  }, []);

  // Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Image HD Upscaler & Square Cropping perfectly resolving the "Blurry" issue
  useEffect(() => {
    let isMounted = true;
    const processImageToHD = (url) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () => {
        if (!isMounted) return;
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        // Force HD Resolution (1080x1080 minimum) for ultra-sharp tiles
        const HD_SIZE = Math.max(size, 1080);

        const canvas = document.createElement('canvas');
        canvas.width = HD_SIZE;
        canvas.height = HD_SIZE;
        const ctx = canvas.getContext('2d');

        // Enable High-Quality Hardware Smoothing for the Upscale
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Crop and Upscale simultaneously
        ctx.drawImage(img, startX, startY, size, size, 0, 0, HD_SIZE, HD_SIZE);

        // Output as maximum quality JPEG
        setCroppedImage(canvas.toDataURL('image/jpeg', 1.0));
      };
      img.onerror = () => { if (isMounted) setCroppedImage(url); }
    };
    processImageToHD(image);
    return () => { isMounted = false; };
  }, [image]);

  // Reset board on grid size change
  useEffect(() => {
    setTiles([...Array(gridSize * gridSize).keys()]);
    setIsSolved(false);
    setIsPlaying(false);
    setMoves(0);
    setTime(0);
    setIsPreviewMode(false);
  }, [gridSize]);

  // Timer loop
  useEffect(() => {
    let interval;
    if (isPlaying && !isSolved) {
      interval = setInterval(() => setTime((v) => v + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isSolved]);

  // Shuffle Logic
  const handleShuffle = (targetLevel) => {
    if (!targetLevel) {
      setView('level');
      return;
    }

    setView('board');
    setGridSize(targetLevel);

    setTimeout(() => {
      let newTiles = [...Array(targetLevel * targetLevel).keys()];
      // Make 300 random valid moves to ensure solvability
      for (let i = 0; i < 300; i++) {
        const emptyIdx = newTiles.indexOf(targetLevel * targetLevel - 1);
        const r = Math.floor(emptyIdx / targetLevel);
        const c = emptyIdx % targetLevel;
        const valid = [];

        if (r > 0) valid.push(emptyIdx - targetLevel);
        if (r < targetLevel - 1) valid.push(emptyIdx + targetLevel);
        if (c > 0) valid.push(emptyIdx - 1);
        if (c < targetLevel - 1) valid.push(emptyIdx + 1);

        const move = valid[Math.floor(Math.random() * valid.length)];
        [newTiles[emptyIdx], newTiles[move]] = [newTiles[move], newTiles[emptyIdx]];
      }
      setTiles(newTiles);
      setIsSolved(false);
      setMoves(0);
      setTime(0);
      setIsPlaying(true);
      setIsPreviewMode(false);
    }, 50);
  };

  // Move Logic
  const handleTileClick = (idx) => {
    if (isSolved || !isPlaying || isPreviewMode) return;

    const emptyIdx = tiles.indexOf(TILE_COUNT - 1);
    const r = Math.floor(idx / gridSize);
    const c = idx % gridSize;
    const er = Math.floor(emptyIdx / gridSize);
    const ec = emptyIdx % gridSize;

    // Check adjacency
    if ((Math.abs(r - er) + Math.abs(c - ec)) === 1) {
      const newTiles = [...tiles];
      [newTiles[emptyIdx], newTiles[idx]] = [newTiles[idx], newTiles[emptyIdx]];
      setTiles(newTiles);
      setMoves((m) => m + 1);

      // Check Win Condition
      if (newTiles.every((v, i) => v === i)) {
        setIsSolved(true);
        setIsPlaying(false);
      }
    }
  };

  // Image Upload Logic
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
      setView('board');
      setIsPlaying(false);
      setTiles([...Array(TILE_COUNT).keys()]);
    } else {
      alert("Invalid image format.");
    }
  };

  // Share Logic
  const handleShare = async () => {
    const imgIdx = DEFAULT_GALLERY.indexOf(image);
    // Encode message securely supporting UTF-8
    const contentToEncode = messageInput || secretMessage;
    const msg = contentToEncode ? window.btoa(unescape(encodeURIComponent(contentToEncode))) : '';

    const url = `${window.location.origin}${window.location.pathname}?img=${imgIdx >= 0 ? imgIdx : 'custom'}&msg=${msg}&lvl=${gridSize}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Lumina Puzzle Challenge',
          text: 'I challenge you to solve this!',
          url: url
        });
      } catch (err) {
        console.log("Share skipped or failed.", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Lien copié dans le presse-papier !');
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="app-shell">
      {/* 0. Splash Screen */}
      {!isReady && (
        <div className="splash-screen">
          <div className="brand-logo">
            <span className="brand-col-1">LU</span><span className="brand-col-2">MINA</span>
          </div>
        </div>
      )}

      {/* 1. Header Area */}
      <header className="app-header">
        <div className="brand-logo">
          <span className="brand-col-1">LU</span><span className="brand-col-2">MINA</span>
        </div>

        {/* Only show input if we are NOT playing a received mystery message */}
        {!secretMessage && (
          <input
            type="text"
            className="input-premium"
            style={{ maxWidth: '200px', padding: '8px 16px', fontSize: '0.9rem', background: 'transparent' }}
            placeholder="Message secret..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
        )}

        <div className="header-actions">
          <button className="btn-icon-labeled" style={{ minWidth: 'auto', padding: '8px' }} onClick={() => setShowSettings(true)} aria-label="Paramètres">
            <Icons.Settings />
          </button>
          <button className="btn-icon-labeled" style={{ minWidth: 'auto', padding: '8px' }} onClick={handleShare} aria-label="Partager">
            <Icons.Share />
          </button>
        </div>
      </header>

      {/* 2. Main Game Area */}
      <main className="game-viewport">
        {/* Puzzle Board Container */}
        <div
          className="puzzle-board"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            '--grid-size': gridSize
          }}
        >
          {/* Seamless In-Game Preview Crossfade */}
          <div
            className={`preview-overlay ${isPreviewMode ? 'active' : ''}`}
            style={{ backgroundImage: `url(${croppedImage || image})` }}
          />

          {tiles.map((v, i) => {
            const isEmpty = v === TILE_COUNT - 1;
            const x = v % gridSize;
            const y = Math.floor(v / gridSize);
            const bgImageSrc = croppedImage || image;

            return (
              <div
                key={i}
                className={`tile ${isEmpty ? 'empty' : ''}`}
                onClick={() => handleTileClick(i)}
                style={!isEmpty ? {
                  backgroundImage: `url(${bgImageSrc})`,
                  backgroundPosition: `${(x / (gridSize - 1)) * 100}% ${(y / (gridSize - 1)) * 100}%`,
                } : {}}
              >
                {showHints && !isEmpty && <span className="tile-hint">{v + 1}</span>}
              </div>
            );
          })}
        </div>

        {/* Victory Overlay Modal */}
        {isSolved && (
          <div className="victory-modal">
            <h1 className="brand-logo" style={{ fontSize: '2.5rem', marginBottom: 10 }}>VICTOIRE</h1>
            <p style={{ color: 'var(--text-muted)' }}>Coups: {moves} | Temps: {formatTime(time)}</p>

            {/* The Mystery Reveal */}
            {(secretMessage || messageInput) && (
              <div className="mystery-reveal-box">
                <span className="mystery-label">Message Secret</span>
                <span className="mystery-text">{secretMessage || messageInput}</span>
              </div>
            )}

            <button className="btn-primary" style={{ marginTop: 30, width: '100%', maxWidth: 300 }} onClick={() => setIsSolved(false)}>
              Continuer
            </button>
          </div>
        )}
      </main>

      {/* 3. Bottom Toolbar */}
      <footer className="app-toolbar">
        <button className="btn-icon-labeled" onClick={() => handleShuffle(null)}>
          <Icons.Shuffle />
          <span>Mélanger</span>
        </button>
        <button className={`btn-icon-labeled ${showHints ? 'active' : ''}`} onClick={() => setShowHints(!showHints)}>
          <Icons.Hint />
          <span>Indices</span>
        </button>
        {/* New Preview Toggle Button */}
        <button className={`btn-icon-labeled ${isPreviewMode ? 'active' : ''}`} onClick={() => setIsPreviewMode(!isPreviewMode)}>
          <Icons.Preview />
          <span>Aperçu</span>
        </button>
        <button className="btn-icon-labeled" onClick={() => setView('gallery')}>
          <Icons.Gallery />
          <span>Galerie</span>
        </button>
      </footer>

      {/* Premium Glass Settings Modal */}
      <div className={`glass-modal-overlay ${showSettings ? 'open' : ''}`} onClick={() => setShowSettings(false)}>
        <div className="glass-modal" onClick={e => e.stopPropagation()}>
          <div className="sheet-header" style={{ marginBottom: 20 }}>
            <h2>Paramètres</h2>
            <button className="btn-icon-labeled" style={{ minWidth: 'auto', padding: 4 }} onClick={() => setShowSettings(false)}>
              <Icons.Close />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="settings-section" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pseudo de Partage</label>
              <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="input-premium" placeholder="Votre nom..." />
            </div>

            <div className="settings-section">
              <span style={{ fontWeight: 600 }}>Thème Sombre</span>
              <label className="toggle-switch">
                <input type="checkbox" checked={theme === 'dark'} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings-section">
              <span style={{ fontWeight: 600 }}>Effets Sonores</span>
              <label className="toggle-switch">
                <input type="checkbox" checked={soundEnabled} onChange={() => setSoundEnabled(!soundEnabled)} />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div style={{ background: 'var(--glass-bg)', padding: '20px', borderRadius: '16px', border: '1px solid var(--glass-border)', marginTop: 12 }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: 8 }}>Développeur</div>
              <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--accent-blue)', marginBottom: 4 }}>Elodie ATANA</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>Ingénieure IA & Lead Architect. Fondatrice de Codorah.</p>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a className="social-pill" href="www.linkedin.com/in/codorah" target="_blank" rel="noopener noreferrer"><Icons.LinkedIn /> LinkedIn</a>
                <a className="social-pill" href="https://portfolio-js-elodie.vercel.app/" target="_blank" rel="noopener noreferrer"><Icons.Globe /> Portfolio</a>
                <a className="social-pill" href="https://github.com/Codorah" target="_blank" rel="noopener noreferrer"><Icons.Github /> GitHub</a>
                <a className="social-pill" href="mailto:codorah@hotmail.com"><Icons.Mail /> Mail</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals & Overlays (Bottom Sheets for Gallery and Level) */}
      <div className={`sheet-overlay ${view !== 'board' ? 'open' : ''}`} onClick={() => setView('board')}>
        <div className="sheet-content" onClick={(e) => e.stopPropagation()}>

          <div className="sheet-header">
            <h2>{view === 'gallery' ? 'Galerie' : 'Difficulté'}</h2>
            <button className="btn-icon-labeled" style={{ minWidth: 'auto', padding: 4 }} onClick={() => setView('board')}>
              <Icons.Close />
            </button>
          </div>

          <div className="scroll-area">
            {/* Gallery View */}
            {view === 'gallery' && (
              <div className="gallery-grid">
                <div className="upload-card" onClick={() => fileInputRef.current?.click()}>
                  <Icons.Upload />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Importer</span>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                </div>
                {DEFAULT_GALLERY.map((src, i) => (
                  <div
                    key={i}
                    className={`gallery-item ${!loadedImages[src] ? 'skeleton' : ''} ${image === src ? 'active' : ''}`}
                    onClick={() => { setImage(src); setView('board'); setIsPlaying(false); setTiles([...Array(TILE_COUNT).keys()]); }}
                  >
                    <img
                      src={src}
                      alt={`Puzzle ${i}`}
                      loading="lazy"
                      onLoad={() => setLoadedImages(p => ({ ...p, [src]: true }))}
                      style={{ opacity: loadedImages[src] ? 1 : 0, transition: 'opacity 0.3s ease' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Level Select View */}
            {view === 'level' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <button className="btn-secondary" onClick={() => handleShuffle(3)}>Facile (3x3)</button>
                <button className="btn-secondary" onClick={() => handleShuffle(4)}>Moyen (4x4)</button>
                <button className="btn-secondary" onClick={() => handleShuffle(5)}>Difficile (5x5)</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
