import { useState, useEffect, useCallback } from 'react';
import './index.css';

const GRID_SIZE = 3;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

// --- Professional SVG Icons ---
const Icons = {
  Gallery: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>,
  Settings: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>,
  Shuffle: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>,
  Hint: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 15 4-8 4 8" /><path d="M4 13h6" /><circle cx="18" cy="12" r="3" /><path d="M18 9v6" /></svg>,
  Preview: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>,
  Share: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>,
  Upload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
};

const TRANSLATIONS = {
  fr: {
    moves: "Coups",
    time: "Temps",
    shuffle: "Mélanger",
    gallery: "Galerie",
    settings: "Options",
    writeMsg: "Écris un message mystère...",
    win: "Lumina: Succès",
    copied: "Lien copié !",
    name: "Pseudo",
    appearance: "Apparence",
    sound: "Son",
    mute: "Muet",
    bio: "Ingénieure IA & Prompt Engineer passionnée. Fondatrice de Codorah.",
    link: "Voir Profil",
    back: "Retour au Jeu"
  },
  en: {
    moves: "Moves",
    time: "Time",
    shuffle: "Shuffle",
    gallery: "Gallery",
    settings: "Options",
    writeMsg: "Write a mystery message...",
    win: "Lumina: Success",
    copied: "Link copied!",
    name: "Username",
    appearance: "Appearance",
    sound: "Sound",
    mute: "Mute",
    bio: "AI Engineer & Prompt Engineer. Founder of Codorah.",
    link: "View Profile",
    back: "Back to Game"
  },
  es: {
    moves: "Pasos",
    time: "Tiempo",
    shuffle: "Mezclar",
    gallery: "Galería",
    settings: "Opciones",
    writeMsg: "Escribe un mensaje...",
    win: "Lumina: Éxito",
    copied: "¡Copiado!",
    name: "Nombre",
    appearance: "Apariencia",
    sound: "Sonido",
    mute: "Mudo",
    bio: "Ingeniera de IA y Prompt Engineer. Fundadora de Codorah.",
    link: "Ver Perfil",
    back: "Volver"
  }
};

const DEFAULT_GALLERY = [
  '/gallery/puzzle-4.png',
  '/gallery/puzzle-1.png',
  '/gallery/puzzle-2.png',
  '/gallery/puzzle-3.png',
  '/gallery/puzzle-5.jpg',
  '/gallery/puzzle-6.jpg'
];

export default function App() {
  const [tiles, setTiles] = useState([...Array(TILE_COUNT).keys()]);
  const [image, setImage] = useState('/gallery/puzzle-4.png');
  const [isSolved, setIsSolved] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [view, setView] = useState('board');
  const [lang, setLang] = useState('fr');
  const [theme, setTheme] = useState('dark');
  const [showHints, setShowHints] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [secretMessage, setSecretMessage] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [userName, setUserName] = useState('Player');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const t = (key) => TRANSLATIONS[lang][key] || key;

  // Initialize & URL Check
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('msg');
    const imgIdx = params.get('img');
    const name = params.get('u');
    if (msg) try { setSecretMessage(atob(msg)); } catch (e) { }
    if (imgIdx && DEFAULT_GALLERY[imgIdx]) setImage(DEFAULT_GALLERY[imgIdx]);
    if (name) setUserName(name);

    setTimeout(() => setIsReady(true), 3000);
  }, []);

  // Theme Sync
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
  }, [theme]);

  useEffect(() => {
    let interval;
    if (isPlaying && !isSolved) interval = setInterval(() => setTime((v) => v + 1), 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isSolved]);

  const playSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.15);
      g.gain.setValueAtTime(0.05, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.15);
    } catch (e) { }
  }, [soundEnabled]);

  const shuffle = () => {
    let newTiles = [...tiles];
    for (let i = 0; i < 200; i++) {
      const emptyIdx = newTiles.indexOf(TILE_COUNT - 1);
      const r = Math.floor(emptyIdx / GRID_SIZE), c = emptyIdx % GRID_SIZE;
      const valid = [];
      if (r > 0) valid.push(emptyIdx - GRID_SIZE);
      if (r < GRID_SIZE - 1) valid.push(emptyIdx + GRID_SIZE);
      if (c > 0) valid.push(emptyIdx - 1);
      if (c < GRID_SIZE - 1) valid.push(emptyIdx + 1);
      const move = valid[Math.floor(Math.random() * valid.length)];
      [newTiles[emptyIdx], newTiles[move]] = [newTiles[move], newTiles[emptyIdx]];
    }
    setTiles(newTiles); setIsSolved(false); setMoves(0); setTime(0); setIsPlaying(true);
  };

  const handleTileClick = (idx) => {
    if (isSolved || !isReady || !isPlaying) return;
    const emptyIdx = tiles.indexOf(TILE_COUNT - 1);
    const r = Math.floor(idx / GRID_SIZE), c = idx % GRID_SIZE;
    const er = Math.floor(emptyIdx / GRID_SIZE), ec = emptyIdx % GRID_SIZE;
    if ((Math.abs(r - er) + Math.abs(c - ec)) === 1) {
      const newTiles = [...tiles];
      [newTiles[emptyIdx], newTiles[idx]] = [newTiles[idx], newTiles[emptyIdx]];
      setTiles(newTiles); setMoves((m) => m + 1); playSound();
      if (newTiles.every((v, i) => v === i)) { setIsSolved(true); setIsPlaying(false); }
    }
  };

  const handleShare = () => {
    const imgIdx = DEFAULT_GALLERY.indexOf(image);
    const msg = btoa(messageInput || secretMessage);
    const url = `${window.location.origin}${window.location.pathname}?img=${imgIdx >= 0 ? imgIdx : 0}&msg=${msg}&u=${encodeURIComponent(userName)}`;
    if (navigator.share) navigator.share({ title: `Challenge by ${userName}`, url });
    else { navigator.clipboard.writeText(url); alert(t('copied')); }
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <>
      {!isReady && <div className="splash-screen"><h1 className="splash-logo">LUMINA</h1></div>}

      <div className="app-container">
        <header>
          <div className="logo-text">LU<span>MINA</span></div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-icon btn-premium" onClick={() => setView('gallery')}><Icons.Gallery /></button>
            <button className="btn-icon btn-premium" onClick={() => setView('settings')}><Icons.Settings /></button>
          </div>
        </header>

        {!secretMessage && !isPlaying && (
          <div className="msg-bar">
            <input type="text" placeholder={t('writeMsg')} value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
          </div>
        )}

        <main className="game-area">
          <div className="board-wrapper">
            <div className="board">
              {tiles.map((v, i) => {
                const isEmpty = v === TILE_COUNT - 1;
                const x = (v % GRID_SIZE);
                const y = Math.floor(v / GRID_SIZE);
                return (
                  <div
                    key={i}
                    className={`tile ${isEmpty ? 'empty' : ''}`}
                    onClick={() => handleTileClick(i)}
                    style={!isEmpty ? {
                      backgroundImage: `url(${image})`,
                      backgroundSize: 'calc(var(--tile-size) * 3)',
                      backgroundPosition: `calc(-1 * ${x} * var(--tile-size)) calc(-1 * ${y} * var(--tile-size))`,
                      position: 'relative'
                    } : {}}
                  >
                    {showHints && !isEmpty && (
                      <span style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: '50%', width: 20, height: 20, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {v + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="stats-bar">
            <div className="stat-item"><span className="stat-label">{t('moves')}</span><span className="stat-value">{moves}</span></div>
            <div className="stat-item"><span className="stat-label">{t('time')}</span><span className="stat-value">{formatTime(time)}</span></div>
          </div>

          <div className="action-bar">
            <button className="btn-premium btn-main" onClick={shuffle}>
              <Icons.Shuffle style={{ marginRight: 8 }} /> {t('shuffle')}
            </button>
            <button className={`btn-premium btn-icon ${showHints ? 'active' : ''}`} onClick={() => setShowHints(!showHints)}>
              <Icons.Hint />
            </button>
            <button className="btn-premium btn-icon" onClick={() => setShowPreview(true)}>
              <Icons.Preview />
            </button>
            <button className="btn-premium btn-icon" onClick={handleShare}>
              <Icons.Share />
            </button>
          </div>

          {isSolved && (
            <div className="win-overlay" style={{ marginTop: 20 }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 10 }}>{t('win')}</div>
              {(secretMessage || messageInput) && <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: 10 }}>{secretMessage || messageInput}</div>}
            </div>
          )}
        </main>
      </div>

      {(view !== 'board' || showPreview) && (
        <div className="modal">
          <div className="modal-content glass">
            {showPreview ? (
              <div style={{ textAlign: 'center' }}>
                <img src={image} style={{ width: '100%', borderRadius: 20 }} />
                <button className="btn-premium btn-main" style={{ width: '100%', marginTop: 20 }} onClick={() => setShowPreview(false)}>{t('back')}</button>
              </div>
            ) : view === 'gallery' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ margin: 0 }}>{t('gallery')}</h2>
                  <label className="btn-premium btn-icon" style={{ cursor: 'pointer' }}>
                    <Icons.Upload />
                    <input type="file" hidden accept="image/*" onChange={(e) => {
                      const f = e.target.files[0];
                      if (f) { setImage(URL.createObjectURL(f)); setView('board'); setIsPlaying(false); setTiles([...Array(TILE_COUNT).keys()]); }
                    }} />
                  </label>
                </div>
                <div className="gallery-grid">
                  {DEFAULT_GALLERY.map((src, i) => (
                    <div key={i} className="gallery-card" style={{ backgroundImage: `url(${src})` }} onClick={() => { setImage(src); setView('board'); setIsPlaying(false); setTiles([...Array(TILE_COUNT).keys()]); }} />
                  ))}
                </div>
                <button className="btn-premium btn-main" style={{ width: '100%' }} onClick={() => setView('board')}>{t('back')}</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <h2 style={{ margin: 0 }}>{t('settings')}</h2>

                <div className="stat-item" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label className="stat-label" style={{ textAlign: 'left' }}>{t('name')}</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="btn-premium"
                    style={{ width: '100%', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', textAlign: 'left', paddingLeft: 16 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="stat-item">
                    <label className="stat-label">{t('appearance')}</label>
                    <button className="btn-premium btn-icon" style={{ width: '100%', marginTop: 8 }} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                      {theme === 'dark' ? '🌙' : '☀️'}
                    </button>
                  </div>
                  <div className="stat-item">
                    <label className="stat-label">{t('sound')}</label>
                    <button className="btn-premium btn-icon" style={{ width: '100%', marginTop: 8 }} onClick={() => setSoundEnabled(!soundEnabled)}>
                      {soundEnabled ? '🔊' : '🔇'}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 0 }}>
                  <button className={`btn-premium btn-icon ${lang === 'fr' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setLang('fr')}>FR</button>
                  <button className={`btn-premium btn-icon ${lang === 'en' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setLang('en')}>EN</button>
                </div>

                <div className="bio-card">
                  <div style={{ fontWeight: 800, color: 'var(--accent-primary)', marginBottom: 5 }}>Elodie ATANA</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 15 }}>{t('bio')}</p>
                  <a href="https://github.com/Codorah" target="_blank">{t('link')}</a>
                </div>
                <button className="btn-premium btn-main" style={{ width: '100%' }} onClick={() => setView('board')}>{t('back')}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
