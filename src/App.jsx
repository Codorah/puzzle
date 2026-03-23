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
    writeMsg: "Écris un message mystère...",
    win: "Lumina: Succès",
    copied: "Lien copié !",
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
    bio: "Ingeniera de IA y Prompt Engineer. Fundadora de Codorah.",
    link: "Ver Perfil",
    back: "Volver"
  }
};

const DEFAULT_GALLERY = [
  '/gallery/puzzle-4.png',
  '/gallery/puzzle-1.png',
  '/gallery/puzzle-2.png',
  '/gallery/puzzle-3.png'
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

  const t = (key) => TRANSLATIONS[lang][key] || key;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('msg');
    const imgIdx = params.get('img');
    if (msg) try { setSecretMessage(atob(msg)); } catch(e) {}
    if (imgIdx && DEFAULT_GALLERY[imgIdx]) setImage(DEFAULT_GALLERY[imgIdx]);
    
    setTimeout(() => setIsReady(true), 3000);
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying && !isSolved) interval = setInterval(() => setTime((v) => v + 1), 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isSolved]);

  const playSound = useCallback(() => {
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
    const url = `${window.location.origin}${window.location.pathname}?img=${imgIdx >= 0 ? imgIdx : 0}&msg=${msg}`;
    if (navigator.share) navigator.share({ title: 'Lumina Challenge', url });
    else { navigator.clipboard.writeText(url); alert(t('copied')); }
  };

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <>
      {!isReady && <div className="splash-screen"><h1 className="splash-logo">LUMINA</h1></div>}

      <div className="app-container">
        <header>
          <div className="logo-text">LU<span>MINA</span></div>
          <div style={{display: 'flex', gap: 10}}>
             <button className="btn-icon btn-premium" style={{height: 50, width: 50}} onClick={() => setView('gallery')}>🖼️</button>
             <button className="btn-icon btn-premium" style={{height: 50, width: 50}} onClick={() => setView('settings')}>⚙️</button>
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
                        <span style={{position:'absolute', top: 4, left: 4, background:'rgba(0,0,0,0.5)', color:'#fff', borderRadius:'50%', width:20, height:20, fontSize:'0.7rem', display:'flex', alignItems:'center', justifyContent:'center'}}>
                          {v+1}
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
             <button className="btn-premium btn-main" onClick={shuffle}>{t('shuffle')}</button>
             <button className="btn-premium btn-icon" onClick={() => setShowHints(!showHints)}>{showHints ? '👁️' : '🔢'}</button>
             <button className="btn-premium btn-icon" onClick={() => setShowPreview(true)}>❓</button>
             <button className="btn-premium btn-icon" onClick={handleShare}>🔗</button>
          </div>

          {isSolved && (
            <div className="win-overlay">
               <div>{t('win')}</div>
               {(secretMessage || messageInput) && <div style={{marginTop: 10, borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: 10}}>{secretMessage || messageInput}</div>}
            </div>
          )}
        </main>
      </div>

      {(view !== 'board' || showPreview) && (
        <div className="modal">
          <div className="modal-content glass">
             {showPreview ? (
                <div style={{textAlign: 'center'}}>
                   <img src={image} style={{width: '100%', borderRadius: 20}} />
                   <button className="btn-premium btn-main" style={{width: '100%', marginTop: 20}} onClick={() => setShowPreview(false)}>{t('back')}</button>
                </div>
             ) : view === 'gallery' ? (
                <div>
                   <h2 style={{marginTop: 0}}>{t('gallery')}</h2>
                   <div className="gallery-grid">
                      {DEFAULT_GALLERY.map((src, i) => (
                        <div key={i} className="gallery-card" style={{backgroundImage:`url(${src})`}} onClick={() => {setImage(src); setView('board'); setIsPlaying(false); setTiles([...Array(TILE_COUNT).keys()]); }} />
                      ))}
                   </div>
                   <button className="btn-premium btn-main" style={{width: '100%', marginTop: 20}} onClick={() => setView('board')}>{t('back')}</button>
                </div>
             ) : (
                <div>
                   <h2 style={{marginTop: 0}}>{t('settings')}</h2>
                   <div style={{display:'flex', gap: 10, marginBottom: 20}}>
                      <button className="btn-premium btn-icon" onClick={() => setLang('fr')}>FR</button>
                      <button className="btn-premium btn-icon" onClick={() => setLang('en')}>EN</button>
                   </div>
                   <div className="bio-card">
                      <div style={{fontWeight:800, color:'var(--accent-primary)'}}>Elodie ATANA</div>
                      <p style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>{t('bio')}</p>
                      <a href="https://github.com/Codorah" target="_blank">{t('link')}</a>
                   </div>
                   <button className="btn-premium btn-main" style={{width: '100%', marginTop: 20}} onClick={() => setView('board')}>{t('back')}</button>
                </div>
             )}
          </div>
        </div>
      )}
    </>
  );
}
