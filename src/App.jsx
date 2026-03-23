import { useState, useEffect } from 'react';
import './index.css';

// Constantes du jeu (Grille 3x3 par défaut, mais extensible)
const GRID_SIZE = 3;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

export default function App() {
  const [tiles, setTiles] = useState([...Array(TILE_COUNT).keys()]);
  const [image, setImage] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Gère le timer
  useEffect(() => {
    let interval;
    if (isPlaying && !isSolved) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isSolved]);

  // Jouer un petit son au déplacement
  const playSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch(e) { /* ignore */ }
  };

  // Mélange le puzzle de manière résoluble
  const shuffle = () => {
    let newTiles = [...tiles];
    for (let i = 0; i < 150; i++) {
      const emptyIndex = newTiles.indexOf(TILE_COUNT - 1);
      const validMoves = getValidMoves(emptyIndex);
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      [newTiles[emptyIndex], newTiles[randomMove]] = [newTiles[randomMove], newTiles[emptyIndex]];
    }
    setTiles(newTiles);
    setIsSolved(false);
    setMoves(0);
    setTime(0);
    setIsPlaying(true);
  };

  // Trouve les cases adjacentes à la case vide
  const getValidMoves = (emptyIndex) => {
    const moves = [];
    const row = Math.floor(emptyIndex / GRID_SIZE);
    const col = emptyIndex % GRID_SIZE;

    if (row > 0) moves.push(emptyIndex - GRID_SIZE); // Haut
    if (row < GRID_SIZE - 1) moves.push(emptyIndex + GRID_SIZE); // Bas
    if (col > 0) moves.push(emptyIndex - 1); // Gauche
    if (col < GRID_SIZE - 1) moves.push(emptyIndex + 1); // Droite
    return moves;
  };

  // Gère le clic sur une case
  const handleTileClick = (index) => {
    if (!isPlaying) setIsPlaying(true);
    
    const emptyIndex = tiles.indexOf(TILE_COUNT - 1);
    const validMoves = getValidMoves(emptyIndex);

    if (validMoves.includes(index) && !isSolved) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoves((m) => m + 1);
      playSound();
      checkWin(newTiles);
    }
  };

  // Vérifie si le puzzle est dans l'ordre original
  const checkWin = (currentTiles) => {
    const won = currentTiles.every((val, index) => val === index);
    setIsSolved(won);
    if (won) {
      setIsPlaying(false);
    }
  };

  // Gère l'upload de l'image de l'utilisateur avec sécurité
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // 1. Côté SEC : Liste blanche des types MIME autorisés (on exclut les SVG malveillants)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!validTypes.includes(file.type)) {
      alert("Format non sécurisé. Veuillez uploader une image JPG, PNG ou WEBP.");
      return;
    }

    // 2. Côté SEC : Limitation de la taille du fichier (Prévention d'un crash mémoire)
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_SIZE) {
      alert("L'image est trop volumineuse. Limite : 5 MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setTiles([...Array(TILE_COUNT).keys()]); // Réinitialise avant de mélanger
    setMoves(0);
    setTime(0);
    setIsPlaying(false);
    setIsSolved(false);
  };

  // Calcule la position du background CSS pour découper l'image
  const getBackgroundPosition = (originalIndex) => {
    const x = (originalIndex % GRID_SIZE) * 100;
    const y = Math.floor(originalIndex / GRID_SIZE) * 100;
    return `-${x}px -${y}px`;
  };

  // Formate le temps (mm:ss)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="app-container">
      <h1>Premium Puzzle</h1>
      
      <div className="stats-container">
        <div className="stat-box">Coups: <span className="stat-value">{moves}</span></div>
        <div className="stat-box">Temps: <span className="stat-value">{formatTime(time)}</span></div>
      </div>

      <div className="controls">
        <div className="btn-group">
            <label className="file-upload">
            📸 Charger une photo
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
            <button className="btn" onClick={shuffle}>🔀 Mélanger</button>
        </div>
      </div>

      {isSolved && <div className="win-message">✨ Félicitations ! Résolu en {moves} coups et {formatTime(time)} ✨</div>}

      <div className="board">
        {tiles.map((tileValue, currentIndex) => {
          const isEmpty = tileValue === TILE_COUNT - 1;
          return (
            <div
              key={currentIndex}
              className={`tile ${isEmpty ? 'empty' : ''}`}
              onClick={() => handleTileClick(currentIndex)}
              style={!isEmpty && image ? {
                backgroundImage: `url(${image})`,
                backgroundSize: `${GRID_SIZE * 100}px ${GRID_SIZE * 100}px`,
                backgroundPosition: getBackgroundPosition(tileValue)
              } : {}}
            >
              {!image && !isEmpty && tileValue + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}
