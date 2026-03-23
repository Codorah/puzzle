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
    settings: "Options",
    packs: "Collections",
    upload: "Importer",
    win: "Lumina: Succès",
    solved: "Tableau complété",
    details: "en {moves} mouvements • {time}",
    appearance: "Thème",
    lang: "Langue",
    bio: "Ingénieure IA & Prompt Engineer passionnée. Fondatrice de Codorah.",
    link: "Voir Profil",
    back: "Retour"
  },
  en: {
    moves: "Moves",
    time: "Time",
    shuffle: "Shuffle",
    gallery: "Gallery",
    settings: "Options",
    packs: "Collections",
    upload: "Import",
    win: "Lumina: Success",
    solved: "Puzzle Solved",
    details: "in {moves} moves • {time}",
    appearance: "Theme",
    lang: "Language",
    bio: "AI Engineer & Prompt Engineer. Founder of Codorah.",
    link: "View Profile",
    back: "Back"
  },
  es: {
    moves: "Pasos",
    time: "Tiempo",
    shuffle: "Mezclar",
    gallery: "Galería",
    settings: "Opciones",
    packs: "Colecciones",
    upload: "Importar",
    win: "Lumina: Éxito",
    solved: "Rompecabezas Resuelto",
    details: "en {moves} pasos • {time}",
    appearance: "Tema",
    lang: "Idioma",
    bio: "Ingeniera de IA y Prompt Engineer. Fundadora de Codorah.",
    link: "Ver Perfil",
    back: "Volver"
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
  const [isReady, setIsReady] = useState(false);
  const [view, setView] = useState('board'); // 'board', 'gallery', 'settings'
  const [lang, setLang] = useState('fr');
  const [theme, setTheme] = useState('dark');

  const t = (key) => TRANSLATIONS[lang][key] || key;

  // Initialize
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Timer
  useEffect(() => {
    let interval;
    if (isPlaying && !isSolved) {
      interval = setInterval(() => setTime((v) => v + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isSolved]);

  // Theme
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
  }, [theme]);

  const playSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.15);
      g.gain.setValueAtTime(0.1, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch(e) {}
  }, []);

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
    setTiles(newTiles);
    setIsSolved(false); setMoves(0); setTime(0); setIsPlaying(true);
  };

  const handleTileClick = (idx) => {
    if (isSolved || !isReady) return;
    const emptyIdx = tiles.indexOf(TILE_COUNT - 1);
    const r = Math.floor(idx / GRID_SIZE), c = idx % GRID_SIZE;
    const er = Math.floor(emptyIdx / GRID_SIZE), ec = emptyIdx % GRID_SIZE;
    if ((Math.abs(r - er) + Math.abs(c - ec)) === 1) {
        const newTiles = [...tiles];
        [newTiles[emptyIdx], newTiles[idx]] = [newTiles[idx], newTiles[emptyIdx]];
        setTiles(newTiles);
        setMoves((m) => m + 1);
        playSound();
        if (newTiles.every((v, i) => v === i)) {
            setIsSolved(true); setIsPlaying(false);
        }
    }
  };

  const handleUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImage(URL.createObjectURL(f));
    setTiles([...Array(TILE_COUNT).keys()]);
    setView('board'); setIsSolved(false); setMoves(0); setTime(0);
  };

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <>
      {!isReady && (
        <div className="splash-screen">
            <h1 className="splash-logo">LUMINA</h1>
        </div>
      )}

      <div className="app-container">
        <header>
          <h1 className="logo-text">LU<span>MINA</span></h1>
          <div style={{display: 'flex', gap: 12}}>
            <button className="btn-secondary" onClick={() => setView('gallery')}>🖼️</button>
            <button className="btn-secondary" onClick={() => setView('settings')}>⚙️</button>
          </div>
        </header>

        <main className="game-area">
          <div className="board-wrapper">
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
          </div>

          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-label">{t('moves')}</span>
              <span className="stat-value">{moves}</span>
            </div>
            <div className="stat-item">
               <span className="stat-label">{t('time')}</span>
               <span className="stat-value">{formatTime(time)}</span>
            </div>
          </div>

          <div className="action-bar">
             <button className="btn-premium" onClick={shuffle}>{t('shuffle')}</button>
             <label className="btn-secondary" style={{cursor: 'pointer'}}>
                {t('upload')}
                <input type="file" hidden accept="image/*" onChange={handleUpload} />
             </label>
          </div>

          {isSolved && (
            <div style={{marginTop: 32, textAlign: 'center', animation: 'fadeIn 0.5s ease'}}>
                <h2 style={{color: 'var(--accent-primary)', marginBottom: 4}}>{t('win')}</h2>
                <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                    {t('details').replace('{moves}', moves).replace('{time}', formatTime(time))}
                </p>
            </div>
          )}
        </main>
      </div>

      {(view === 'gallery' || view === 'settings') && (
        <div className="modal">
          <div className="modal-backdrop" onClick={() => setView('board')}></div>
          <div className="modal-card glass">
             <div className="modal-header">
                <h2 className="modal-title">{t(view)}</h2>
             </div>
             
             {view === 'gallery' && (
                <div className="gallery-grid">
                  {DEFAULT_GALLERY.map((src, i) => (
                    <div 
                      key={i}
                      className="gallery-item"
                      style={{backgroundImage: `url(${src})` }}
                      onClick={() => { setImage(src); setView('board'); setTiles([...Array(TILE_COUNT).keys()]); }}
                    />
                  ))}
                </div>
             )}

             {view === 'settings' && (
                <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
                   <div className="setting-row">
                      <span className="stat-label">{t('appearance')}</span>
                      <div style={{display: 'flex', gap: 8, marginTop: 8}}>
                        <button className="btn-secondary" onClick={() => setTheme('dark')}>🌙</button>
                        <button className="btn-secondary" onClick={() => setTheme('light')}>☀️</button>
                      </div>
                   </div>
                   <div className="setting-row">
                      <span className="stat-label">{t('lang')}</span>
                      <div style={{display: 'flex', gap: 8, marginTop: 8}}>
                        <button className="btn-secondary" onClick={() => setLang('fr')}>FR</button>
                        <button className="btn-secondary" onClick={() => setLang('en')}>EN</button>
                        <button className="btn-secondary" onClick={() => setLang('es')}>ES</button>
                      </div>
                   </div>
                   <div className="bio-box">
                      <span className="bio-name">Elodie ATANA</span>
                      <p style={{margin: '8px 0', color: 'var(--text-muted)'}}>{t('bio')}</p>
                      <a href="https://github.com/Codorah" target="_blank" style={{color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700}}>{t('link')}</a>
                   </div>
                </div>
             )}

             <button className="btn-premium" style={{width: '100%', marginTop: 32}} onClick={() => setView('board')}>
                {t('back')}
             </button>
          </div>
        </div>
      )}
    </>
  );
}
