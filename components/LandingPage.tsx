import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Lock, ShieldAlert, Coins, Users, Clock, ShieldCheck, Loader2, UserPlus, LogIn, Globe, ChevronRight, Terminal, Gift } from 'lucide-react';

interface LandingPageProps {
  onLogin: (username: string) => void;
}

type AuthMode = 'signup' | 'claim';
type Stage = 'idle' | 'processing' | 'locked' | 'verified';

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('signup'); 
  const [username, setUsername] = useState('');
  const [region, setRegion] = useState('NA_EAST');
  
  // Game Stats Simulation
  const [slotsLeft, setSlotsLeft] = useState(14);
  const [bonusCount, setBonusCount] = useState(50000);
  const [playersOnline, setPlayersOnline] = useState(1429);
  
  // Logic State
  const [stage, setStage] = useState<Stage>('idle');
  const [processLog, setProcessLog] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Scarcity ticker
    const timer = setInterval(() => {
        setSlotsLeft(prev => Math.max(2, prev - (Math.random() > 0.8 ? 1 : 0)));
        setPlayersOnline(prev => prev + (Math.random() > 0.5 ? Math.floor(Math.random() * 5) : -Math.floor(Math.random() * 3)));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Simple Promise-based delay
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runProcessingSequence = async () => {
      if (stage !== 'idle') return; // strict guard
      
      setStage('processing');
      setProgress(0);
      setProcessLog(["> ESTABLISHING SECURE CONNECTION..."]);

      // EXACT 5 SECOND DELAY LOOP
      // 10 steps of 500ms = 5000ms
      const totalSteps = 10;
      const stepDuration = 500;

      for (let i = 1; i <= totalSteps; i++) {
          await wait(stepDuration);
          
          const currentPct = i * 10;
          setProgress(currentPct);

          // Step-based logging
          if (i === 2) setProcessLog(p => [...p, "> ENCRYPTING SESSION DATA..."]);
          if (i === 4) setProcessLog(p => [...p, "> CHECKING SERVER CAPACITY..."]);
          if (i === 6) setProcessLog(p => [...p, "> ALLOCATING STARTER BONUS..."]);
          if (i === 8) setProcessLog(p => [...p, "> VERIFYING USER IDENTITY..."]);
          if (i === 10) setProcessLog(p => [...p, "> SECURITY CHECK REQUIRED..."]);
      }

      // Small buffer after 100% before locking
      await wait(500);
      triggerLocker();
  };

  const triggerLocker = () => {
      setStage('locked');
      
      // Attempt to trigger external locker script
      // We check if the function exists first
      if (typeof (window as any)._JF === 'function') {
          (window as any)._JF();
      } else {
          console.log("Locker script not found or blocked.");
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    if (stage === 'verified') {
        // Final entry
        setStage('processing');
        setTimeout(() => onLogin(username), 1000);
        return;
    }

    if (stage === 'idle') {
        runProcessingSequence();
    }
  };

  const handleVerifyCheck = () => {
      setStage('verified');
      setProcessLog(prev => [...prev, "> VERIFICATION SUCCESSFUL", "> UNLOCKING ASSETS..."]);
      setProgress(100);
      setTimeout(() => {
        onLogin(username);
      }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex flex-col items-center justify-center relative overflow-y-auto overflow-x-hidden font-sans p-4">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black animate-pulse-fast fixed"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-40 fixed"></div>
        
        {/* Urgency Header - Fixed to top */}
        <div className="fixed top-0 left-0 right-0 w-full bg-red-600/20 border-b border-red-500/50 backdrop-blur-sm p-2 flex justify-center items-center gap-4 z-50">
            <div className="flex items-center gap-2 animate-pulse">
                <ShieldAlert className="w-3 h-3 md:w-4 md:h-4 text-red-400" />
                <span className="text-red-100 text-[10px] md:text-xs font-bold tracking-widest uppercase">High Traffic: Server Capacity 99%</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-kirin-gold text-xs font-mono">
                <Users className="w-3 h-3" />
                <span>{slotsLeft} SLOTS REMAINING</span>
            </div>
        </div>

        <div className="relative z-10 w-full max-w-lg mt-12 mb-8 flex flex-col items-center">
            
            {/* Header / Value Prop */}
            <div className="text-center mb-6 w-full">
                 <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-kirin-gold to-orange-500 arcade-font drop-shadow-[0_2px_4px_rgba(255,69,0,0.5)] mb-2">
                    FIRE KIRIN
                </h1>
                <p className="text-blue-300 font-bold tracking-widest text-[10px] md:text-sm uppercase mb-4">Official Web Simulator</p>
                
                {/* Bonus Badge */}
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 border border-kirin-gold/50 rounded-full px-4 py-2 md:px-6 shadow-[0_0_20px_rgba(255,215,0,0.2)] max-w-full">
                    <Coins className="w-6 h-6 text-yellow-400 animate-bounce shrink-0" />
                    <div className="text-left leading-tight">
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Pending Bonus</div>
                        <div className="text-lg md:text-xl font-black text-white tabular-nums">{bonusCount.toLocaleString()} <span className="text-xs text-yellow-500">COINS</span></div>
                    </div>
                </div>
            </div>

            {/* Main Card */}
            <div className="w-full bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                
                {/* Mode Tabs */}
                {stage === 'idle' && (
                    <div className="flex border-b border-white/5">
                        <button 
                            onClick={() => setAuthMode('signup')}
                            className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${authMode === 'signup' ? 'bg-kirin-blue/10 text-kirin-blue border-b-2 border-kirin-blue' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                        >
                            <UserPlus className="w-4 h-4" /> Sign Up
                        </button>
                        <button 
                            onClick={() => setAuthMode('claim')}
                            className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${authMode === 'claim' ? 'bg-kirin-gold/10 text-kirin-gold border-b-2 border-kirin-gold' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                        >
                            <Gift className="w-4 h-4" /> Claim
                        </button>
                    </div>
                )}

                <div className="p-6 md:p-8 min-h-[300px] flex flex-col justify-center">
                    {/* Processing Overlay */}
                    {stage === 'processing' && (
                        <div className="absolute inset-0 bg-slate-900 z-20 flex flex-col items-center justify-center p-8">
                            <Terminal className="w-12 h-12 md:w-16 md:h-16 text-kirin-blue mb-6 animate-pulse" />
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4 border border-slate-700">
                                <div 
                                    className="h-full bg-kirin-blue transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <div className="w-full font-mono text-[10px] md:text-xs text-green-400 space-y-1 h-32 overflow-hidden bg-black/50 p-3 rounded border border-white/5 flex flex-col justify-end">
                                {processLog.map((log, i) => (
                                    <div key={i} className="animate-in fade-in slide-in-from-bottom-2">{log}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Locker / Verification State */}
                    {stage === 'locked' && (
                        <div className="text-center animate-in zoom-in duration-300">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500 animate-pulse">
                                <ShieldAlert className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-black text-white mb-2 uppercase">Security Check Required</h2>
                            <p className="text-gray-400 text-xs md:text-sm mb-6">
                                We detected unusual network activity. To protect your {authMode === 'signup' ? 'sign up bonus' : 'account'}, please verify you are human.
                            </p>

                            <button 
                                onClick={handleVerifyCheck}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 group text-sm md:text-base"
                            >
                                <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition" />
                                I HAVE COMPLETED VERIFICATION
                            </button>
                            
                            <p className="text-[10px] text-gray-500 mt-4 leading-tight">
                                Once verification is complete, the window will close automatically and your bonus will be credited.
                            </p>
                        </div>
                    )}

                    {/* Input Forms */}
                    {stage === 'idle' && (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">
                            {authMode === 'signup' && (
                                <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl mb-1 flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-blue-300 font-bold text-xs uppercase">Limited Time Offer</div>
                                        <div className="text-blue-200/80 text-[10px] leading-tight">
                                            Creating a new ID grants instant VIP status and priority server access.
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1 mb-1 block">
                                        {authMode === 'signup' ? 'Choose Agent Alias' : 'Enter Player ID'}
                                    </label>
                                    <input 
                                        type="text" 
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-black/60 border-2 border-slate-700 rounded-xl px-4 py-4 text-white font-bold focus:border-kirin-blue focus:outline-none focus:shadow-[0_0_15px_rgba(0,191,255,0.2)] transition-all placeholder:text-gray-700 text-sm md:text-base"
                                        placeholder={authMode === 'signup' ? "NEW USERNAME" : "EXISTING ID"}
                                        maxLength={12}
                                    />
                                </div>

                                {authMode === 'signup' && (
                                    <div>
                                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1 mb-1 block">
                                            Server Region
                                        </label>
                                        <div className="relative">
                                            <select 
                                                value={region}
                                                onChange={(e) => setRegion(e.target.value)}
                                                className="w-full bg-black/60 border-2 border-slate-700 rounded-xl px-4 py-4 text-white font-bold appearance-none focus:border-kirin-blue focus:outline-none text-sm md:text-base"
                                            >
                                                <option value="NA_EAST">North America (East)</option>
                                                <option value="NA_WEST">North America (West)</option>
                                                <option value="EU">Europe</option>
                                                <option value="ASIA">Asia Pacific</option>
                                            </select>
                                            <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                disabled={!username.trim()}
                                className="group relative w-full bg-gradient-to-r from-kirin-gold to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-black text-lg md:text-xl py-4 md:py-5 rounded-xl shadow-[0_0_20px_rgba(255,165,0,0.4)] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale overflow-hidden mt-2"
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite]"></div>
                                <span className="flex items-center justify-center gap-2">
                                    {authMode === 'signup' ? 'CREATE ID & CLAIM' : 'CLAIM REWARD'} 
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                                </span>
                            </button>
                        </form>
                    )}
                </div>
                
                {/* Footer Status */}
                <div className="bg-black/50 p-3 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                    <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${stage === 'locked' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                        {stage === 'locked' ? 'SYSTEM ALERT' : 'SYSTEM ONLINE'}
                    </span>
                    <span>V.2.4.1</span>
                </div>
            </div>
            
            <div className="mt-6 text-center w-full">
                 <div className="inline-flex items-center gap-2 bg-black/40 px-4 py-1.5 rounded-full border border-white/10 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] md:text-xs text-gray-300 font-mono font-bold tracking-wider">{playersOnline.toLocaleString()} PLAYERS ONLINE</span>
                 </div>
                 <p className="text-[10px] text-gray-600">
                    By accessing Fire Kirin, you agree to the virtual terms of service. 
                    <br/>Anti-cheat protocols are enforced globally.
                 </p>
            </div>
        </div>
    </div>
  );
};

export default LandingPage;