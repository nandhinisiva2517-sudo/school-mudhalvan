"use client";
import { motion } from "framer-motion";
import { useState } from "react";

type Tile = { id: string; title: string; iconUrl: string; href: string; completed: boolean; firstTaskId?: string };

export function StudentDashboardK3({ tiles: initialTiles, studentName }: { tiles: Tile[]; studentName: string }) {
  const [tiles, setTiles] = useState<Tile[]>(initialTiles);
  
  const handleTileClick = async (e: React.MouseEvent<HTMLAnchorElement>, tile: Tile) => {
    // If it's not completed and we have a task ID, mark it as done!
    if (!tile.completed && tile.firstTaskId) {
      try {
        const res = await fetch(`/api/progress/${tile.firstTaskId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: true }),
        });
        if (res.ok) {
          setTiles(prev => prev.map(t => t.id === tile.id ? { ...t, completed: true } : t));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="relative z-10 w-full min-h-screen pb-20">
      {/* Decorative floating elements */}
      <div className="absolute top-10 left-10 text-4xl opacity-20 animate-float" style={{ animationDelay: "0s" }}>🚀</div>
      <div className="absolute top-20 right-20 text-5xl opacity-20 animate-float" style={{ animationDelay: "1s" }}>🌟</div>
      <div className="absolute bottom-20 left-1/4 text-4xl opacity-20 animate-float" style={{ animationDelay: "2.5s" }}>🎨</div>
      
      <motion.div 
        className="text-center mb-12"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <p className="font-baloo text-xl text-spark-ink-muted mb-2 tracking-wide">
          Hello, <span style={{color:"var(--spark-primary)"}} className="font-bold">{studentName}</span>! 👋
        </p>
        <h2 className="font-baloo text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 drop-shadow-sm">
          What do you want to learn today?
        </h2>
      </motion.div>
      <div className="spark-k3-grid">
        {tiles.map((tile, i) => (
          <motion.a
            key={tile.id}
            href={tile.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleTileClick(e, tile)}
            className="spark-k3-tile relative overflow-hidden group"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 15 }}
            whileHover={{ scale: 1.05, translateY: -5 }}
            whileTap={{ scale: 0.95 }}
            style={tile.completed ? { borderColor: "var(--spark-success)", background: "rgba(47,184,139,0.08)", boxShadow: "0 10px 25px -5px rgba(47,184,139,0.3)" } : { boxShadow: "0 10px 25px -5px rgba(255,138,61,0.2)" }}
          >
            {/* Background decorative glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            
            <img src={tile.iconUrl} alt="" className={`spark-k3-icon ${i % 2 === 0 ? 'animate-float' : 'animate-pulse'}`} style={{ animationDelay: `${i * 0.2}s` }} />
            <span className="spark-k3-label text-xl mt-4 font-bold tracking-wide" style={{ color: tile.completed ? "var(--spark-success)" : "var(--spark-ink)" }}>{tile.title}</span>
            {tile.completed && (
              <motion.span
                className="spark-k3-badge absolute -top-3 -right-3 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-4 border-white"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.2 }}
              >
                ⭐
              </motion.span>
            )}
          </motion.a>
        ))}
      </div>
    </div>
  );
}