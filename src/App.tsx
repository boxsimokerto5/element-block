/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence, animate } from "motion/react";
import { Play, Loader2, Trophy, Zap, X, ChevronRight } from "lucide-react";
import { START_IO_APP_ID, GAME_URL } from "./constants";

// Custom Animated Logo Component
const GalacticLogo = ({ size = "large" }: { size?: "small" | "large" }) => {
  const containerSize = size === "large" ? "w-64 h-64" : "w-48 h-48";
  const blockSize = size === "large" ? "w-24 h-24" : "w-18 h-18";
  
  return (
    <div className={`relative ${containerSize} flex items-center justify-center`}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-orange-500/20 blur-[60px] rounded-full animate-pulse" />
      
      {/* 4 Element Blocks Grid */}
      <div className="grid grid-cols-2 gap-2 relative z-10">
        {/* Fire Block (Red/Orange) */}
        <motion.div 
          animate={{ y: [0, -5, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className={`${blockSize} bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center border border-white/20 overflow-hidden`}
        >
          <Zap className="text-white relative z-10" size={size === "large" ? 40 : 30} />
        </motion.div>
        
        {/* Air/Wind Block (Yellow/Gold) */}
        <motion.div 
          animate={{ x: [0, 5, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className={`${blockSize} bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center border border-white/20`}
        >
          <div className="w-10 h-10 border-4 border-white/40 rounded-full border-t-white animate-spin" />
        </motion.div>
        
        {/* Earth Block (Green) */}
        <motion.div 
          animate={{ x: [0, -5, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`${blockSize} bg-gradient-to-br from-emerald-500 to-green-700 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center justify-center border border-white/20`}
        >
          <div className="w-8 h-8 bg-white/30 rounded-lg rotate-45" />
        </motion.div>
        
        {/* Water Block (Blue) */}
        <motion.div 
          animate={{ y: [0, 5, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className={`${blockSize} bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl shadow-[0_0_20_rgba(59,130,246,0.5)] flex items-center justify-center border border-white/20`}
        >
          <div className="w-10 h-10 border-b-4 border-white/60 rounded-full" />
        </motion.div>
      </div>

      {/* Orbiting Particles */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
        <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-orange-400 rounded-full shadow-[0_0_10px_orange]" />
      </motion.div>
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState<"splash" | "menu" | "game">("splash");
  const [highScore, setHighScore] = useState<number>(0);
  const [displayScore, setDisplayScore] = useState<number>(0);
  const [showAd, setShowAd] = useState(false);

  // Default Ad Config (Hardcoded for Live Version)
  const adDuration = 2.5;
  const showOnBack = true;
  const showOnGameOver = true;
  
  const [startCount, setStartCount] = useState(0);

  // Load high score from localStorage
  useEffect(() => {
    const savedScore = localStorage.getItem("element_blocks_highscore");
    if (savedScore) {
      const score = parseInt(savedScore);
      setHighScore(score);
      setDisplayScore(score);
    }
  }, []);

  // Animate display score when high score changes
  useEffect(() => {
    const controls = animate(displayScore, highScore, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (value) => setDisplayScore(Math.floor(value)),
    });
    return () => controls.stop();
  }, [highScore]);

  const triggerInterstitial = (callback: () => void) => {
    setShowAd(true);
    setTimeout(() => {
      setShowAd(false);
      callback();
    }, adDuration * 1000);
  };

  const handleStartGame = () => {
    setStartCount(prev => prev + 1);
    // Always trigger interstitial before starting game for live version
    triggerInterstitial(() => setScreen("game"));
  };

  const handleBackToMenu = () => {
    if (showOnBack) {
      triggerInterstitial(() => setScreen("menu"));
    } else {
      setScreen("menu");
    }
  };

  const simulateGameOver = () => {
    if (showOnGameOver) {
      triggerInterstitial(() => setScreen("menu"));
    } else {
      setScreen("menu");
    }
  };

  const simulateNewScore = () => {
    const newScore = highScore + Math.floor(Math.random() * 1000) + 500;
    setHighScore(newScore);
    localStorage.setItem("element_blocks_highscore", newScore.toString());
  };

  useEffect(() => {
    if (screen === "splash") {
      const timer = setTimeout(() => {
        setScreen("menu");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  return (
    <div className="h-screen w-full bg-slate-900 text-white overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {/* Simulated Interstitial Ad */}
        {showAd && (
          <motion.div
            key="interstitial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6"
          >
            <div className="bg-white text-black w-full max-w-sm rounded-xl overflow-hidden shadow-2xl">
              <div className="h-48 bg-slate-200 flex items-center justify-center relative">
                <span className="text-slate-400 font-bold">Start.io Ad Content</span>
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded">App ID: {START_IO_APP_ID}</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">Amazing New App</h3>
                <p className="text-sm text-slate-600 mb-4">Download now and get 50% discount on your first purchase!</p>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">INSTALL NOW</button>
              </div>
            </div>
            <p className="mt-6 text-slate-500 text-xs italic">
              Simulated Ad - Closing in {adDuration}s...
            </p>
          </motion.div>
        )}

        {screen === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full p-6 text-center bg-slate-950 relative overflow-hidden"
          >
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10"
            >
              <GalacticLogo size="large" />
              
              {/* Rotating Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6 border border-orange-500/20 rounded-[3.5rem] border-dashed"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <h1 className="text-4xl font-black tracking-tighter mb-4 italic text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-blue-400">
                ELEMENT BLOCKS
              </h1>
              
              <div className="flex flex-col items-center gap-2">
                <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                    className="h-full w-full bg-gradient-to-r from-orange-500 to-blue-500"
                  />
                </div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">
                  Initializing Galaxy...
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {screen === "menu" && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center h-full p-6 text-center relative overflow-hidden"
          >
            {/* Subtle Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

            {/* Menu Logo */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <GalacticLogo size="small" />
            </motion.div>

            <h1 className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-blue-400 tracking-tighter italic">
              ELEMENT BLOCKS
            </h1>
            
            <motion.div 
              layout
              className="bg-slate-800/50 border border-slate-700 px-8 py-4 rounded-2xl mb-6 relative group"
            >
              <Trophy className="absolute -top-3 -right-3 text-yellow-500 drop-shadow-lg group-hover:scale-110 transition-transform" size={28} />
              <p className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-1 font-semibold">Personal Best</p>
              <motion.p 
                key={highScore}
                initial={{ scale: 1.1, color: "#f97316" }}
                animate={{ scale: 1, color: "#fb923c" }}
                className="text-4xl font-mono font-black"
              >
                {displayScore.toLocaleString()}
              </motion.p>
            </motion.div>

            {/* Instructions Section */}
            <div className="max-w-xs mb-6 text-left bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50">
              <h2 className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                How to Play
              </h2>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex gap-2">
                  <span className="text-orange-500 font-bold">1.</span>
                  Drag and drop blocks onto the 10x10 board.
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-500 font-bold">2.</span>
                  Fill rows or columns to clear them.
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xs mb-12">
              <button
                onClick={handleStartGame}
                className="group relative flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 transition-all py-5 rounded-full text-xl font-bold shadow-xl hover:shadow-orange-500/20 active:scale-95"
              >
                <Play fill="white" />
                START GAME
              </button>

              <button
                onClick={simulateNewScore}
                className="flex items-center justify-center gap-2 text-slate-500 hover:text-orange-400 transition-colors text-xs uppercase tracking-widest font-bold"
              >
                <Zap size={14} />
                Simulate New Score
              </button>
            </div>

            {/* Simulated Start.io Banner Ad */}
            <div className="w-full max-w-[320px] h-[50px] bg-slate-800 border border-slate-700 flex items-center justify-center relative overflow-hidden rounded">
              <div className="absolute top-0 left-0 bg-blue-600 text-white text-[8px] px-1 rounded-br">Ad ID: {START_IO_APP_ID}</div>
              <span className="text-slate-500 text-[10px] uppercase tracking-tighter">Start.io Banner Ad Placeholder</span>
            </div>
          </motion.div>
        )}

        {screen === "game" && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full relative flex flex-col"
          >
            <div className="bg-slate-900 p-4 flex items-center justify-between border-b border-slate-800">
              <button 
                onClick={handleBackToMenu}
                className="bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors flex items-center gap-2 pr-4"
              >
                <ChevronRight className="rotate-180" />
                <span className="text-xs font-bold uppercase tracking-widest">Back</span>
              </button>
              
              <button 
                onClick={simulateGameOver}
                className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
              >
                Simulate Game Over
              </button>
            </div>

            <iframe 
              src={GAME_URL}
              className="w-full flex-1 border-none"
              title="Element Blocks"
              allow="autoplay; fullscreen"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
