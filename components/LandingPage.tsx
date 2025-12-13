import React, { useState, useEffect } from 'react';
import { Play, Sparkles, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onLogin: (username: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  // Trigger locker again on mount just in case
  useEffect(() => {
    if ((window as any)._JF) {
      (window as any)._JF();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    
    // Simulate a brief "Connecting" delay for effect
    setTimeout(() => {
        onLogin(username);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black animate-pulse-fast"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
        
        {/* Content Container */}
        <div className="relative z-10 w-full max-w-md p-8">
            <div className="text-center mb-6">
                <div className="inline-block relative">
                    <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-50 animate-pulse"></div>
                    <span className="relative text-6xl animate-bounce">🔥</span>
                </div>
                <h1 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-kirin-gold to-orange-500 arcade-font drop-shadow-[0_2px_4px_rgba(255,69,0,0.5)] mt-4">
                    FIRE KIRIN
                </h1>
                <p className="text-blue-300 font-bold tracking-widest text-sm mt-2 uppercase">Ultimate Arcade Simulator</p>
            </div>

            {/* Verification Badge - Implies Post-Offer State */}
            <div className="flex items-center justify-center gap-2 mb-6 bg-green-500/10 border border-green-500/30 rounded-full py-1 px-4 w-fit mx-auto">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span className="text-[10px] text-green-400 font-bold tracking-wider">SECURE CONNECTION VERIFIED</span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-kirin-gold/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-kirin-gold to-transparent"></div>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 font-bold uppercase tracking-wider ml-1">Player Name</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/50 border-2 border-slate-700 rounded-xl px-4 py-4 text-white font-bold focus:border-kirin-gold focus:outline-none focus:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all placeholder:text-gray-600"
                            placeholder="ENTER USERNAME"
                            maxLength={12}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={!username.trim() || loading}
                        className="group relative w-full bg-gradient-to-r from-kirin-red to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xl py-5 rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:grayscale overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1s_infinite]"></div>
                        {loading ? (
                            <span className="flex items-center justify-center gap-2 animate-pulse">
                                <Sparkles className="w-5 h-5 animate-spin" /> CONNECTING...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                PLAY NOW <Play fill="currentColor" className="w-5 h-5" />
                            </span>
                        )}
                    </button>
                    
                    <div className="text-center">
                        <p className="text-[10px] text-gray-500 mt-2">
                            Access Granted. System ID: 888-KIRIN-V2
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default LandingPage;