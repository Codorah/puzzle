import { useState, useEffect, useCallback, useRef } from 'react';
import './index.css';

// --- Professional SVG Icons ---
const Icons = {
  Gallery: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>,
  Settings: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>,
  Shuffle: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>,
  Hint: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13v-3a1 1 0 0 1 1-1h1" /><path d="M15 17v-4a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v4" /><path d="M15 15h2" /><path d="M7 17h2" /></svg>,
  Preview: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>,
  Share: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>,
  Upload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
};

const TRANSLATIONS = {
  fr: {
    gallery: "Galerie", settings: "Options", shuffle: "Mélanger", moves: "Coups", time: "Temps",
    win: "Puzzle Résolu !", back: "Retour", level: "Niveau", easy: "Facile",
    medium: "Moyen", hard: "Difficile", name: "Pseudo", appearance: "Thème",
    sound: "Sons", copied: "Lien copié !", writeMsg: "Message mystère...",
    upload: "Importer", hints: "Indices", preview: "Aperçu", share: "Partager",
    bio: "Ingénieure IA & Prompt Engineer passionnée. Fondatrice de Codorah.",
    link: "Voir Profil"
  },
  en: {
    gallery: "Gallery", settings: "Settings", shuffle: "Shuffle", moves: "Moves", time: "Time",
    win: "Puzzle Solved!", back: "Back", level: "Level", easy: "Easy",
    medium: "Medium", hard: "Hard", name: "User", appearance: "Theme",
    sound: "Sounds", copied: "Link copied!", writeMsg: "Mystery message...",
    upload: "Upload", hints: "Hints", preview: "Preview", share: "Share",
    bio: "AI Engineer & Prompt Engineer. Founder of Codorah.",
    link: "View Profile"
  },
  es: {
    gallery: "Galería", settings: "Opciones", shuffle: "Mezclar", moves: "Pasos", time: "Tiempo",
    win: "¡Resuelto!", back: "Volver", level: "Nivel", easy: "Fácil",
    medium: "Medio", hard: "Difícil", name: "Nombre", appearance: "Tema",
    sound: "Sonido", copied: "¡Copiado!", writeMsg: "Mensaje...",
    upload: "Subir", hints: "Pistas", preview: "Vista", share: "Compartir",
    bio: "Ingeniera de IA y Prompt Engineer. Fundadora de Codorah.",
    link: "Ver Perfil"
  }
};

const DEFAULT_GALLERY = [
  '/gallery/puzzle-4.png', '/gallery/nezuko.jpg', '/gallery/fufu.jpg', '/gallery/mac.jpg',
  '/gallery/naruto.jpg', '/gallery/gboma.jpg', '/gallery/zoo.jpg', '/gallery/gojo.jpg',
  '/gallery/renard.jpg', '/gallery/puzzle-1.png', '/gallery/puzzle-2.png', '/gallery/puzzle-3.png'
];

export default function App() {
  const [gridSize, setGridSize] = useState(3);
  const [aspectRatio, setAspectRatio] = useState(1);
  const TILE_COUNT = gridSize * gridSize;
  const fileInputRef = useRef(null);

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
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [secretMessage, setSecretMessage] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [userName, setUserName] = useState('Player');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const t = (key) => TRANSLATIONS[lang][key] || key;

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const ratio = img.width / img.height;
      setAspectRatio(ratio);
      document.documentElement.style.setProperty('--image-ratio', ratio);
    };
  }, [image]);

  useEffect(() => {
    setTiles([...Array(TILE_COUNT).keys()]);
    setIsSolved(false); setIsPlaying(false); setMoves(0); setTime(0);
    document.documentElement.style.setProperty('--grid-size', gridSize);
  }, [gridSize, TILE_COUNT]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('msg');
    const imgIdx = params.get('img');
    const name = params.get('u');
    const level = parseInt(params.get('lvl'));
    if (msg) try { setSecretMessage(atob(msg)); } catch (e) { }
    if (imgIdx && DEFAULT_GALLERY[imgIdx]) setImage(DEFAULT_GALLERY[imgIdx]);
    if (name) setUserName(name);
    if (level && [3, 4, 5].includes(level)) setGridSize(level);
    setTimeout(() => setIsReady(true), 1500);
  }, []);

  useEffect(() => { document.body.className = theme === 'light' ? 'light-theme' : ''; }, [theme]);

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
      osc.type = 'sine'; osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.1);
      g.gain.setValueAtTime(0.05, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    } catch (e) { }
  }, [soundEnabled]);

  const shuffle = (level) => {
    if (!level) { setShowLevelSelect(true); return; }
    setShowLevelSelect(false); setGridSize(level);
    setTimeout(() => {
      let newTiles = [...Array(level * level).keys()];
      for (let i = 0; i < 300; i++) {
        const emptyIdx = newTiles.indexOf(level * level - 1);
        const r = Math.floor(emptyIdx / level), c = emptyIdx % level;
        const valid = [];
        if (r > 0) valid.push(emptyIdx - level);
        if (r < level - 1) valid.push(emptyIdx + level);
        if (c > 0) valid.push(emptyIdx - 1);
        if (c < level - 1) valid.push(emptyIdx + 1);
        const move = valid[Math.floor(Math.random() * valid.length)];
        [newTiles[emptyIdx], newTiles[move]] = [newTiles[move], newTiles[emptyIdx]];
      }
      setTiles(newTiles); setIsSolved(false); setMoves(0); setTime(0); setIsPlaying(true);
    }, 50);
  };

  const handleTileClick = (idx) => {
    if (isSolved || !isReady || !isPlaying) return;
    const emptyIdx = tiles.indexOf(TILE_COUNT - 1);
    const r = Math.floor(idx / gridSize), c = idx % gridSize;
    const er = Math.floor(emptyIdx / gridSize), ec = emptyIdx % gridSize;
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
    const url = `${window.location.origin}${window.location.pathname}?img=${imgIdx >= 0 ? imgIdx : 'custom'}&msg=${msg}&u=${encodeURIComponent(userName)}&lvl=${gridSize}`;
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
          <div className="header-controls">
            <button className="control-btn" onClick={() => setView('gallery')}><Icons.Gallery /><span>{t('gallery')}</span></button>
            <button className="control-btn" onClick={() => setView('settings')}><Icons.Settings /><span>{t('settings')}</span></button>
          </div>
        </header>

        {!secretMessage && (
          <div className="msg-bar">
            <input type="text" maxLength="100" placeholder={t('writeMsg')} value={messageInput} onChange={(e) => setMessageInput(e.target.value)} aria-label="Mystery Message" />
          </div>
        )}

        <main className="game-area">
          <div className="board-wrapper">
            <div className="board" style={{ 
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              '--grid-size': gridSize,
              '--image-ratio': aspectRatio
            }}>
              {tiles.map((v, i) => {
                const isEmpty = v === TILE_COUNT - 1;
                const x = v % gridSize, y = Math.floor(v / gridSize);
                return (
                  <div key={i} className={`tile ${isEmpty ? 'empty' : ''}`} onClick={() => handleTileClick(i)} style={!isEmpty ? {
                        backgroundImage: `url(${image})`,
                        backgroundPosition: `${(x / (gridSize - 1)) * 100}% ${(y / (gridSize - 1)) * 100}%`,
                      } : {}}>{showHints && !isEmpty && <span className="tile-hint">{v + 1}</span>}</div>
                );
              })}
              {showLevelSelect && (
                <div className="mini-modal">
                   <div style={{display:'flex', flexDirection:'column', gap: 12, width: '100%'}}>
                      <button className="control-btn btn-main-alt" style={{width:'100%', height:'60px'}} onClick={() => shuffle(3)}>{t('easy')} 3x3</button>
                      <button className="control-btn btn-main-alt" style={{width:'100%', height:'60px'}} onClick={() => shuffle(4)}>{t('medium')} 4x4</button>
                      <button className="control-btn btn-main-alt" style={{width:'100%', height:'60px'}} onClick={() => shuffle(5)}>{t('hard')} 5x5</button>
                   </div>
                </div>
              )}
            </div>
          </div>

          <div className="stats-bar">
            <div className="stat-item"><span className="stat-label">{t('moves')}</span><span className="stat-value">{moves}</span></div>
            <div className="stat-item"><span className="stat-label">{t('time')}</span><span className="stat-value">{formatTime(time)}</span></div>
          </div>
          
          {isSolved && (
            <div className="win-overlay-v2">
               <div className="win-badge">✓</div><div className="win-title">{t('win')}</div>
               <div className="win-stats"><div>{moves} {t('moves')}</div><div>{formatTime(time)}</div></div>
               {(secretMessage || messageInput) && (
                 <div className="mystery-box"><label>MESSAGE MYSTÈRE</label><div className="secret-reveal" style={{color: 'var(--accent-primary)', fontWeight: 900, fontSize: '1.2rem', marginTop: 10, background: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 10}}>{secretMessage || messageInput}</div></div>
               )}
               <button className="control-btn btn-main" style={{marginTop: 20, width: '100%', height: 55}} onClick={() => setIsSolved(false)}>{t('back')}</button>
            </div>
          )}
        </main>

        <div className="action-bar">
          <button className="control-btn btn-main-alt" onClick={() => shuffle()}><Icons.Shuffle /><span>{t('shuffle')}</span></button>
          <button className={`control-btn ${showHints ? 'active' : ''}`} onClick={() => setShowHints(!showHints)}><Icons.Hint /><span>{t('hints')}</span></button>
          <button className="control-btn" onClick={() => setShowPreview(true)}><Icons.Preview /><span>{t('preview')}</span></button>
          <button className="control-btn" onClick={handleShare}><Icons.Share /><span>{t('share')}</span></button>
        </div>
      </div>

      {(view !== 'board' || showPreview) && (
        <div className="modal">
          <div className="modal-content glass">
            {showPreview ? (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 20, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', border: '1px solid var(--glass-border)' }}>
                  <img src={image} style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }} alt="Preview" />
                </div>
                <button className="control-btn btn-main" style={{ width: '100%', height: 55 }} onClick={() => setShowPreview(false)}>{t('back')}</button>
              </div>
            ) : view === 'gallery' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ margin: 0 }}>{t('gallery')}</h2>
                  <label className="control-btn" style={{ cursor: 'pointer', height: '50px', width: '60px' }}>
                    <Icons.Upload /><input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
                      const f = e.target.files[0];
                      if (f) { setImage(URL.createObjectURL(f)); setView('board'); setIsPlaying(false); setTiles([...Array(TILE_COUNT).keys()]); }
                    }} />
                  </label>
                </div>
                <div className="gallery-grid">
                  <div className="gallery-card upload-trigger" style={{background: 'var(--glass-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, border: '2px dashed var(--glass-border)'}} onClick={() => fileInputRef.current.click()}>
                    <Icons.Upload /><span style={{fontSize: '0.6rem', fontWeight: 800}}>{t('upload')}</span>
                  </div>
                  {DEFAULT_GALLERY.map((src, i) => (
                    <div key={i} className={`gallery-card ${image === src ? 'active' : ''}`} style={{ backgroundImage: `url(${src})`, objectFit: 'cover' }} onClick={() => { setImage(src); setView('board'); setIsPlaying(false); setTiles([...Array(TILE_COUNT).keys()]); }} />
                  ))}
                </div>
                <button className="control-btn btn-main" style={{ width: '100%', height: 55 }} onClick={() => setView('board')}>{t('back')}</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <h2 style={{ margin: 0 }}>{t('settings')}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label className="stat-label" style={{ textAlign: 'left' }}>{t('name')}</label>
                  <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="control-btn" style={{ width: '100%', background: 'rgba(0,0,0,0.2)', textAlign: 'left', paddingLeft: 16, height: 55, border: '1px solid var(--glass-border)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="stat-item"><label className="stat-label">{t('appearance')}</label><button className="control-btn" style={{ width: '100%', marginTop: 8, height: 55 }} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '🌙' : '☀️'}</button></div>
                  <div className="stat-item"><label className="stat-label">{t('sound')}</label><button className="control-btn" style={{ width: '100%', marginTop: 8, height: 55 }} onClick={() => setSoundEnabled(!soundEnabled)}>{soundEnabled ? '🔊' : '🔇'}</button></div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}><button className={`control-btn ${lang === 'fr' ? 'active' : ''}`} style={{ flex: 1, height: 45 }} onClick={() => setLang('fr')}>FR</button><button className={`control-btn ${lang === 'en' ? 'active' : ''}`} style={{ flex: 1, height: 45 }} onClick={() => setLang('en')}>EN</button></div>
                <div className="bio-card" style={{background: 'var(--glass-bg)', padding: 20, borderRadius: 20, border: '1px solid var(--glass-border)'}}><div style={{ fontWeight: 800, color: 'var(--accent-primary)', marginBottom: 5 }}>Elodie ATANA</div><p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 15 }}>{t('bio')}</p><a href="https://github.com/Codorah" target="_blank" style={{color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 800}}>{t('link')}</a></div>
                <button className="control-btn btn-main" style={{ width: '100%', height: 55 }} onClick={() => setView('board')}>{t('back')}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
