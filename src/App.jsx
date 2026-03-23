import { useState, useEffect, useCallback } from 'react';
import './index.css';

const GRID_SIZE = 3;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

const TRANSLATIONS = {
  fr: {
    moves: "Coups",
    time: "Temps",
    shuffle: "Mélanger",
    gallery: "Galerie",
    settings: "Paramètres",
    chooseImage: "Choisir un pack",
    upload: "Uploader",
    win: "✨ Félicitations ! ✨",
    solvedIn: "Résolu en {moves} coups et {time}",
    about: "À propos du dév",
    theme: "Apparence",
    language: "Langue",
    bio: "Ingénieure IA & Prompt Engineer passionnée. Fondatrice de Codorah.",
    location: "Lomé, Togo",
    errorFormat: "Format non autorisé. JPG, PNG ou WEBP uniquement.",
    errorSize: "Image trop lourde (Max 5MB)."
  },
  en: {
    moves: "Moves",
    time: "Time",
    shuffle: "Shuffle",
    gallery: "Gallery",
    settings: "Settings",
    chooseImage: "Choose Pack",
    upload: "Upload",
    win: "✨ Congratulations! ✨",
    solvedIn: "Solved in {moves} moves and {time}",
    about: "About Developer",
    theme: "Appearance",
    language: "Language",
    bio: "AI Engineer & Prompt Engineer. Founder of Codorah.",
    location: "Lomé, Togo",
    errorFormat: "Unauthorized format. JPG, PNG or WEBP only.",
    errorSize: "File too large (Max 5MB)."
  },
  es: {
    moves: "Movimientos",
    time: "Tiempo",
    shuffle: "Mezclar",
    gallery: "Galería",
    settings: "Ajustes",
    chooseImage: "Elegir pack",
    upload: "Subir",
    win: "✨ ¡Felicidades! ✨",
    solvedIn: "Resuelto en {moves} movimientos y {time}",
    about: "Sobre el dev",
    theme: "Apariencia",
    language: "Idioma",
    bio: "Ingeniera de IA y Prompt Engineer. Fundadora de Codorah.",
    location: "Lomé, Togo",
    errorFormat: "Formato no autorizado. Solo JPG, PNG o WEBP.",
    errorSize: "Archivo demasiado grande (Máx 5MB)."
  }
};

const DEFAULT_GALLERY = [
  '/gallery/puzzle-1.png',
  '/gallery/puzzle-2.png',
  '/gallery/puzzle-3.png'
];

export default function App() {
  const [tiles, setTiles] = useState([...Array(TILE_COUNT).keys()]);
  const [image, setImage] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState('board'); // 'board', 'gallery', 'settings'
  const [lang, setLang] = useState('fr');
  const [theme, setTheme] = useState('dark');

  const t = (key) => TRANSLATIONS[lang][key] || key;

  // Cleanup splash
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3200);
    return () => clearTimeout(timer);
  }, []);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isPlaying && !isSolved) {
      interval = setInterval(() => setTime((v) => v + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isSolved]);

  // Update theme class
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
  }, [theme]);

  const playSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1);
      g.gain.setValueAtTime(0.2, audioCtx.currentTime);
      g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
      osc.connect(g);
      g.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch(e) {}
  }, []);

  const shuffle = () => {
    let newTiles = [...tiles];
    for (let i = 0; i < 150; i++) {
        const emptyIdx = newTiles.indexOf(TILE_COUNT - 1);
        const row = Math.floor(emptyIdx / GRID_SIZE);
        const col = emptyIdx % GRID_SIZE;
        const valid = [];
        if (row > 0) valid.push(emptyIdx - GRID_SIZE);
        if (row < GRID_SIZE - 1) valid.push(emptyIdx + GRID_SIZE);
        if (col > 0) valid.push(emptyIdx - 1);
        if (col < GRID_SIZE - 1) valid.push(emptyIdx + 1);
        const move = valid[Math.floor(Math.random() * valid.length)];
        [newTiles[emptyIdx], newTiles[move]] = [newTiles[move], newTiles[emptyIdx]];
    }
    setTiles(newTiles);
    setIsSolved(false);
    setMoves(0);
    setTime(0);
    setIsPlaying(true);
  };

  const handleTileClick = (idx) => {
    if (isSolved) return;
    if (!isPlaying) setIsPlaying(true);
    const emptyIdx = tiles.indexOf(TILE_COUNT - 1);
    const r = Math.floor(idx / GRID_SIZE), c = idx % GRID_SIZE;
    const er = Math.floor(emptyIdx / GRID_SIZE), ec = emptyIdx % GRID_SIZE;
    const isAdj = (Math.abs(r - er) + Math.abs(c - ec)) === 1;

    if (isAdj) {
        const newTiles = [...tiles];
        [newTiles[emptyIdx], newTiles[idx]] = [newTiles[idx], newTiles[emptyIdx]];
        setTiles(newTiles);
        setMoves((m) => m + 1);
        playSound();
        if (newTiles.every((v, i) => v === i)) {
          setIsSolved(true);
          setIsPlaying(false);
        }
    }
  };

  const handleUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
      alert(t('errorFormat')); return;
    }
    if (f.size > 5 * 1024 * 1024) {
      alert(t('errorSize')); return;
    }
    setImage(URL.createObjectURL(f));
    setTiles([...Array(TILE_COUNT).keys()]);
    setView('board');
  };

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <>
      {showSplash && (
        <div className="splash-screen">
          <div className="logo-container">PZL.</div>
          <div className="logo-sub">Codorah Premium</div>
        </div>
      )}

      <div className="app-container">
        <header className="header">
          <h1 className="title" onClick={() => setView('board')}>TAQUIN</h1>
          <div className="nav-btns">
            <button className="btn-icon" onClick={() => setView('gallery')}>🖼️</button>
            <button className="btn-icon" onClick={() => setView('settings')}>⚙️</button>
          </div>
        </header>

        <div className="game-stats">
          <div>{t('moves')}: <span className="stat-val">{moves}</span></div>
          <div>{t('time')}: <span className="stat-val">{formatTime(time)}</span></div>
        </div>

        {isSolved && <div className="win-message" style={{marginBottom: 20}}>
            {t('win')}<br/>
            <small>{t('solvedIn').replace('{moves}', moves).replace('{time}', formatTime(time))}</small>
        </div>}

        <div className="board">
          {tiles.map((v, i) => {
            const isEmpty = v === TILE_COUNT - 1;
            const x = (v % GRID_SIZE) * 110;
            const y = Math.floor(v / GRID_SIZE) * 110;
            return (
              <div 
                key={i}
                className={`tile ${isEmpty ? 'empty' : ''}`}
                onClick={() => handleTileClick(i)}
                style={!isEmpty && image ? {
                  backgroundImage: `url(${image})`,
                  backgroundSize: '330px 330px',
                  backgroundPosition: `-${x}px -${y}px`
                } : {}}
              >
                {!image && !isEmpty && v + 1}
              </div>
            );
          })}
        </div>

        <div className="main-btns">
          <button className="btn-icon" style={{padding: '10px 30px'}} onClick={shuffle}>
            {t('shuffle')}
          </button>
          <label className="btn-icon" style={{padding: '10px 20px'}}>
             {t('upload')}
             <input type="file" hidden accept="image/*" onChange={handleUpload} />
          </label>
        </div>
      </div>

      {view === 'gallery' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setView('board')}>×</button>
            <h3>{t('chooseImage')}</h3>
            <div className="gallery-grid">
              {DEFAULT_GALLERY.map((src, i) => (
                <div 
                  key={i} 
                  className="gallery-item" 
                  style={{backgroundImage: `url(${src})`}}
                  onClick={() => { setImage(src); setView('board'); setTiles([...Array(TILE_COUNT).keys()]); }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'settings' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setView('board')}>×</button>
            
            <section className="settings-section">
              <h3>{t('theme')}</h3>
              <div style={{display: 'flex', gap: 10}}>
                <button className="btn-icon" onClick={() => setTheme('dark')}>🌙 Dark</button>
                <button className="btn-icon" onClick={() => setTheme('light')}>☀️ Light</button>
              </div>
            </section>

            <section className="settings-section">
              <h3>{t('language')}</h3>
              <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                <button className="btn-icon" onClick={() => setLang('fr')}>🇫🇷 FR</button>
                <button className="btn-icon" onClick={() => setLang('en')}>🇺🇸 EN</button>
                <button className="btn-icon" onClick={() => setLang('es')}>🇪🇸 ES</button>
              </div>
            </section>

            <section className="settings-section">
              <h3>{t('about')}</h3>
              <div className="bio-card">
                <span className="bio-name">ATANA E. ELODIE H. (Codorah)</span>
                <p>{t('bio')}</p>
                <p>📍 {t('location')}<br/>📧 codorah@hotmail.com</p>
                <a href="https://github.com/Codorah" target="_blank" className="bio-name" style={{color: 'var(--accent-primary)', textDecoration: 'none'}}>Github</a>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
