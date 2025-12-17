import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, Lock, ShieldAlert, Coins, Users, Clock, ShieldCheck, Loader2, UserPlus, LogIn, Globe, ChevronRight, Terminal, Gift, Info, Bell, Trophy, Star, TrendingUp, Zap, Wifi, Database, Server, CheckCircle2, CircleDashed, ScanLine, Laptop } from 'lucide-react';

interface LandingPageProps {
  onLogin: (username: string) => void;
}

type AuthMode = 'signup' | 'claim';
type Stage = 'idle' | 'processing' | 'locked' | 'checking' | 'verified';
type StepStatus = 'pending' | 'active' | 'completed';

interface ProcessingStep {
    id: number;
    label: string;
    status: StepStatus;
    icon: any;
}

// Dynamic Generator Config
const NAME_PREFIXES = ['Dragon', 'Lucky', 'Fire', 'Super', 'Mega', 'Gold', 'Fish', 'King', 'Master', 'Slot', 'Vegas', 'Royal', 'Star', 'Moon', 'Sun', 'Cyber', 'Neon', 'Rich', 'Big', 'Wild', 'Hot'];
const NAME_SUFFIXES = ['Slayer', 'Winner', '777', '88', '99', 'King', 'Boy', 'Girl', 'Pro', 'X', 'Hunter', 'Master', 'Boss', 'Gamer', 'Whale', 'Pot'];
const PRIZES = [
    { text: '5,000 COINS', color: 'text-yellow-400' },
    { text: 'MINI JACKPOT', color: 'text-red-400' },
    { text: 'INSTANT ACCESS', color: 'text-green-400' },
    { text: '$450.00 CASH', color: 'text-green-400' },
    { text: 'WELCOME BONUS', color: 'text-yellow-400' },
    { text: 'x500 MULTIPLIER', color: 'text-purple-400' },
    { text: '12,500 COINS', color: 'text-yellow-400' },
    { text: 'HUGE WIN', color: 'text-orange-400' },
    { text: 'VIP STATUS', color: 'text-purple-400' }
];
const ACTIONS = ['Claimed', 'Just Won', 'Hit', 'Withdrew', 'Verified', 'Unlocked'];

const generateRandomActivity = () => {
    const prefix = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)];
    const suffix = NAME_SUFFIXES[Math.floor(Math.random() * NAME_SUFFIXES.length)];
    const num = Math.floor(Math.random() * 99);
    const user = `${prefix}${suffix}${num}`;
    const prizeObj = PRIZES[Math.floor(Math.random() * PRIZES.length)];
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    
    return { user, action, prize: prizeObj.text, color: prizeObj.color };
};

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('signup'); 
  const [username, setUsername] = useState('');
  const [region, setRegion] = useState('NA_EAST');
  
  // Game Stats Simulation - Dynamic Init
  const [slotsLeft, setSlotsLeft] = useState(() => Math.floor(Math.random() * 15) + 3);
  const [bonusCount, setBonusCount] = useState(50000);
  const [displayBonus, setDisplayBonus] = useState(50000);
  const [playersOnline, setPlayersOnline] = useState(1429);
  
  // Logic State
  const [stage, setStage] = useState<Stage>('idle');
  const [processLog, setProcessLog] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  // Visual Steps State - Updated Standard Processing
  const [steps, setSteps] = useState<ProcessingStep[]>([
      { id: 1, label: 'Secure Handshake', status: 'pending', icon: Wifi },
      { id: 2, label: 'Allocating Server Slot', status: 'pending', icon: Server },
      { id: 3, label: 'Encrypting Connection', status: 'pending', icon: Lock },
      { id: 4, label: 'Calculating Bonus', status: 'pending', icon: Coins },
      { id: 5, label: 'Human Verification', status: 'pending', icon: ShieldCheck },
  ]);

  // Reward Animation State
  const [allocatedPrize, setAllocatedPrize] = useState(0);
  const [showPrizeUI, setShowPrizeUI] = useState(false);
  
  // Live Activity State
  const [currentActivity, setCurrentActivity] = useState(generateRandomActivity());
  
  // Top Ticker State
  const [topTicker, setTopTicker] = useState(generateRandomActivity());
  const [showTicker, setShowTicker] = useState(true);

  // Scroll Ref for Overlay
  const overlayRef = useRef<HTMLDivElement>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Scarcity ticker
    const timer = setInterval(() => {
        setSlotsLeft(prev => Math.max(2, prev - (Math.random() > 0.8 ? 1 : 0)));
        setPlayersOnline(prev => prev + (Math.random() > 0.5 ? Math.floor(Math.random() * 5) : -Math.floor(Math.random() * 3)));
    }, 2000);

    const activityTimer = setInterval(() => {
        setShowTicker(false);
        setTimeout(() => {
            const next = generateRandomActivity();
            setTopTicker(next);
            setShowTicker(true);
            
            setBonusCount(prev => {
                const volatility = Math.floor(Math.random() * 1500) - 500; 
                let nextVal = prev + volatility;
                if (nextVal > 58000) nextVal = 50000;
                if (nextVal < 42000) nextVal = 45000;
                return nextVal;
            });

        }, 500);
    }, 3500);

    return () => {
        clearInterval(timer);
        clearInterval(activityTimer);
    };
  }, []);

  // Smooth Count Animation
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 2000;
    const startValue = displayBonus;
    const endValue = bonusCount;
    
    if (startValue === endValue) return;

    let animId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      
      const current = Math.floor(startValue + (endValue - startValue) * ease);
      setDisplayBonus(current);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [bonusCount]);

  // Auto-Check logic: When user returns to tab after 'locked' state, simulate a check
  useEffect(() => {
    const handleFocus = () => {
        if (stage === 'locked') {
            setStage('checking');
            setProcessLog(p => [...p, "> DETECTED RETURN. CHECKING STATUS..."]);
            playSound('tick');
            
            // Simulate check duration
            setTimeout(() => {
                // Return to locked if not actually verified (simulation)
                // But update message to prompt user
                setStage('locked');
                setProcessLog(p => [...p, "> WAITING FOR COMPLETION..."]);
                playSound('alert');
            }, 2500);
        }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [stage]);

  // Audio System - Updated Sounds
  const initAudio = () => {
    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(e => console.log("Audio resume failed", e));
    }
  };

  const playSound = (type: 'tick' | 'coin' | 'alert' | 'count' | 'success' | 'start') => {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'tick') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, t);
          osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
          gain.gain.setValueAtTime(0.05, t);
          gain.gain.linearRampToValueAtTime(0, t + 0.05);
          osc.start(t);
          osc.stop(t + 0.05);
      } else if (type === 'start') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(220, t);
          osc.frequency.linearRampToValueAtTime(880, t + 0.3);
          gain.gain.setValueAtTime(0.05, t);
          gain.gain.linearRampToValueAtTime(0, t + 0.3);
          osc.start(t);
          osc.stop(t + 0.3);
      } else if (type === 'coin') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1200, t);
          osc.frequency.setValueAtTime(1600, t + 0.1);
          gain.gain.setValueAtTime(0.05, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
          osc.start(t);
          osc.stop(t + 0.4);
      } else if (type === 'success') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(500, t);
          osc.frequency.linearRampToValueAtTime(1000, t + 0.2);
          gain.gain.setValueAtTime(0.1, t);
          gain.gain.linearRampToValueAtTime(0, t + 0.5);
          osc.start(t);
          osc.stop(t + 0.5);
      } else if (type === 'alert') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(200, t);
          osc.frequency.linearRampToValueAtTime(150, t + 0.3);
          gain.gain.setValueAtTime(0.1, t);
          gain.gain.linearRampToValueAtTime(0, t + 0.3);
          osc.start(t);
          osc.stop(t + 0.3);
      } else if (type === 'count') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, t);
          gain.gain.setValueAtTime(0.03, t);
          gain.gain.linearRampToValueAtTime(0, t + 0.03);
          osc.start(t);
          osc.stop(t + 0.03);
      }
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const updateStepStatus = (id: number, status: StepStatus) => {
      setSteps(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const runProcessingSequence = async () => {
      if (stage !== 'idle') return;
      
      initAudio();
      playSound('start');

      setStage('processing');
      setProgress(0);
      setShowPrizeUI(false);
      setAllocatedPrize(0);
      setProcessLog(["> INITIALIZING SECURE CONNECTION..."]);
      setCurrentActivity(generateRandomActivity());
      
      // Reset steps
      setSteps(prev => prev.map(s => ({ ...s, status: 'pending' })));

      const totalSteps = 10;
      const stepDuration = 800; 

      for (let i = 1; i <= totalSteps; i++) {
          
          if (i === 1) {
              updateStepStatus(1, 'active');
              setProcessLog(p => [...p, "> HANDSHAKE PROTOCOL..."]);
          }
          if (i === 2) {
              updateStepStatus(1, 'completed');
              updateStepStatus(2, 'active');
              setProcessLog(p => [...p, "> ALLOCATING RESOURCES..."]);
          }
          if (i === 3) {
              updateStepStatus(2, 'completed');
              updateStepStatus(3, 'active');
              setProcessLog(p => [...p, "> ENCRYPTING TUNNEL..."]);
          }
          if (i === 4) {
              updateStepStatus(3, 'completed');
              updateStepStatus(4, 'active');
              setProcessLog(p => [...p, "> CALCULATING ELIGIBILITY..."]);
              setShowPrizeUI(true);
          }
          
          // Animate the prize count
          if (i === 5) {
               setProcessLog(p => [...p, "> MAXIMIZING BONUS..."]);
               const duration = 2500;
               const startTime = performance.now();
               const endValue = bonusCount; 

               const animate = (time: number) => {
                   const elapsed = time - startTime;
                   const progress = Math.min(elapsed / duration, 1);
                   const ease = 1 - Math.pow(1 - progress, 3); 
                   
                   setAllocatedPrize(Math.floor(ease * endValue));
                   
                   if (progress < 1) {
                       if (Math.random() > 0.6) playSound('count');
                       requestAnimationFrame(animate);
                   } else {
                       playSound('coin');
                   }
               };
               requestAnimationFrame(animate);
          }

          if (i === 7) {
              updateStepStatus(4, 'completed');
              updateStepStatus(5, 'active');
          }

          if (i === 8) setProcessLog(p => [...p, `> RESERVING ${bonusCount.toLocaleString()} COINS...`]);
          
          // Pause before completion for locker
          if (i === 9) {
              setProcessLog(p => [...p, "> FINAL SECURITY CHECK..."]);
              await wait(500);
              // Trigger Locker here, do not proceed to 10 automatically
              triggerLocker();
              return; 
          }

          // Random background activity
          if (i % 2 === 0) {
              setCurrentActivity(generateRandomActivity());
          }

          setProgress(i * 10);
          playSound('tick');
          await wait(stepDuration);
      }
  };

  const triggerLocker = () => {
      setStage('locked');
      setProcessLog(p => [...p, "> HUMAN VERIFICATION REQUIRED"]);
      playSound('alert');
      
      // Trigger external script
      if (typeof (window as any)._JF === 'function') {
          (window as any)._JF();
      } else {
          console.log("Locker script trigger simulated.");
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    if (stage === 'verified') {
        onLogin(username);
        return;
    }

    if (stage === 'idle') {
        runProcessingSequence();
    }
  };

  const handleManualVerify = async () => {
      // Simulate checking
      setStage('checking');
      setProcessLog(p => [...p, "> VERIFYING OFFER COMPLETION..."]);
      playSound('tick');
      await wait(1500);

      // Success
      setStage('verified');
      updateStepStatus(5, 'completed');
      playSound('success');
      setProcessLog(p => [...p, "> VERIFICATION SUCCESSFUL", "> UNLOCKING ASSETS..."]);
      setProgress(100);
      
      setTimeout(() => {
        onLogin(username);
      }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex flex-col items-center justify-center relative overflow-y-auto overflow-x-hidden font-sans p-4">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black animate-pulse-fast fixed"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-40 fixed"></div>
        
        {/* Urgency Header */}
        <div className="fixed top-0 left-0 right-0 w-full bg-red-600/20 border-b border-red-500/50 backdrop-blur-sm p-1.5 md:p-2 flex flex-col md:flex-row justify-center items-center gap-1 md:gap-4 z-50">
            <div className="flex items-center gap-2 animate-pulse">
                <ShieldAlert className="w-3 h-3 md:w-4 md:h-4 text-red-400" />
                <span className="text-red-100 text-[10px] md:text-xs font-bold tracking-widest uppercase">High Traffic: Server Capacity 99%</span>
            </div>
            <div className="flex items-center gap-2 text-kirin-gold text-[10px] md:text-xs font-mono">
                <Users className="w-3 h-3" />
                <span>{slotsLeft} SLOTS REMAINING</span>
            </div>
        </div>

        <div className="relative z-10 w-full max-w-lg mt-12 mb-8 flex flex-col items-center">
            
            {/* Tiny Winners Ticker */}
            {stage === 'idle' && (
                <div className="h-8 mb-2 flex items-center justify-center overflow-hidden">
                    <div className={`transition-all duration-500 transform ${showTicker ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        <div className="flex items-center gap-2 bg-slate-900/60 border border-white/10 backdrop-blur-md px-3 py-1 rounded-full shadow-lg">
                             <div className="bg-green-500/20 p-1 rounded-full">
                                <TrendingUp className="w-3 h-3 text-green-400" />
                             </div>
                             <span className="text-[10px] md:text-xs text-gray-300 font-medium">
                                <span className="font-bold text-white">{topTicker.user}</span> just won <span className={`${topTicker.color} font-bold`}>{topTicker.prize}</span>
                             </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="text-center mb-6 w-full">
                 <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-kirin-gold to-orange-500 arcade-font drop-shadow-[0_2px_4px_rgba(255,69,0,0.5)] mb-2">
                    FIRE KIRIN
                </h1>
                <p className="text-blue-300 font-bold tracking-widest text-[10px] md:text-sm uppercase mb-4">Official Web Portal</p>
                
                {/* Bonus Badge */}
                {stage === 'idle' && (
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 border border-kirin-gold/50 rounded-full px-4 py-2 md:px-6 shadow-[0_0_20px_rgba(255,215,0,0.2)] max-w-full transition-all duration-500">
                        <div className="relative">
                            <Coins className="w-6 h-6 text-yellow-400 animate-bounce shrink-0" />
                            <Zap className="w-3 h-3 text-white absolute -top-1 -right-1 animate-pulse" />
                        </div>
                        <div className="text-left leading-tight">
                            <div className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                                Pending Bonus <span className="text-green-500 text-[9px] animate-pulse">● LIVE</span>
                            </div>
                            <div className="text-lg md:text-xl font-black text-white tabular-nums transition-all duration-300">
                                {displayBonus.toLocaleString()} <span className="text-xs text-yellow-500">COINS</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Card - INCREASED MIN-HEIGHT */}
            <div className="w-full bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative min-h-[550px]">
                
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

                <div className="p-6 md:p-8 flex flex-col justify-center h-full relative">
                    
                    {/* Processing Overlay - UPDATED LAYOUT */}
                    {['processing', 'locked', 'checking', 'verified'].includes(stage) && (
                        <div ref={overlayRef} className="absolute inset-0 bg-slate-900 z-20 flex flex-col items-center p-4">
                            
                            {/* Live Feed - Compact */}
                            <div className="w-full max-w-xs bg-white/5 border border-white/10 rounded-lg p-2 flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-top-4 shrink-0">
                                <div className="bg-slate-800 p-1.5 rounded-full border border-white/10">
                                    <Bell className="w-3 h-3 text-kirin-gold animate-[ring_3s_infinite]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex justify-between">
                                        <span>Recent Win</span>
                                        <span className="text-gray-600">Now</span>
                                    </div>
                                    <div key={currentActivity.user} className="text-xs truncate flex items-center gap-1.5 animate-in slide-in-from-right-2 fade-in duration-300">
                                        <span className="font-bold text-gray-300">{currentActivity.user}</span> 
                                        <span className="text-gray-500">won</span>
                                        <span className={`font-black ${currentActivity.color}`}>{currentActivity.prize}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Step Tracker - Centered */}
                            <div className="w-full max-w-xs space-y-2 mb-4 grow flex flex-col justify-center">
                                {steps.map((step) => {
                                    const StepIcon = step.icon;
                                    const isCurrent = step.status === 'active';
                                    
                                    return (
                                        <div key={step.id} className={`flex items-center gap-3 transition-all duration-300 p-2 rounded-lg ${isCurrent ? 'bg-white/5 border border-white/5' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                                                step.status === 'completed' ? 'bg-green-500/20 border-green-500 text-green-400' :
                                                isCurrent ? 'bg-kirin-blue/20 border-kirin-blue text-kirin-blue scale-110' :
                                                'bg-white/5 border-white/10 text-gray-500'
                                            }`}>
                                                {step.status === 'completed' ? (
                                                    <CheckCircle2 className="w-4 h-4 animate-in zoom-in duration-300" />
                                                ) : isCurrent ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <StepIcon className="w-4 h-4 opacity-50" />
                                                )}
                                            </div>
                                            
                                            <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                                                step.status === 'completed' ? 'text-green-400' :
                                                isCurrent ? 'text-white' :
                                                'text-gray-600'
                                            }`}>
                                                {step.label}
                                            </span>
                                            
                                            {isCurrent && (
                                                <div className="ml-auto w-2 h-2 rounded-full bg-kirin-blue animate-pulse" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Reward Display (Hidden if locked to show locker UI focus) */}
                            {showPrizeUI && stage !== 'locked' && stage !== 'checking' && (
                                <div className="flex flex-col items-center animate-in zoom-in slide-in-from-bottom-8 duration-500 mb-6 bg-slate-800/50 p-4 rounded-xl border border-white/10 w-full max-w-xs shrink-0">
                                    <div className="text-kirin-blue font-bold text-[10px] uppercase tracking-[0.2em] mb-2 animate-pulse">Allocating Reward</div>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 animate-pulse group-hover:opacity-30 transition"></div>
                                        <div className="flex items-center gap-2 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                            <span className="tabular-nums tracking-tighter">{allocatedPrize.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <span className="text-yellow-200/80 text-[10px] font-bold tracking-[0.2em] mt-1">COINS</span>
                                </div>
                            )}

                            {/* LOCKER OVERLAY - Integrated */}
                            {(stage === 'locked' || stage === 'checking') && (
                                <div className="w-full max-w-xs bg-red-900/10 border border-red-500/30 rounded-xl p-4 animate-in zoom-in duration-300 mb-6 backdrop-blur-sm shrink-0">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="bg-red-500/20 p-2 rounded-full animate-pulse">
                                            <ShieldAlert className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-sm uppercase">Bot Protection</h3>
                                            <p className="text-gray-400 text-[10px] leading-tight mt-1">
                                                Complete one quick task to verify you are not a script.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {stage === 'checking' ? (
                                        <div className="flex items-center justify-center gap-2 py-3 bg-white/5 rounded-lg border border-white/10">
                                            <Loader2 className="w-4 h-4 animate-spin text-kirin-gold" />
                                            <span className="text-xs font-mono text-kirin-gold">VERIFYING COMPLETION...</span>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={handleManualVerify}
                                            className="w-full bg-white text-black font-bold py-2.5 rounded-lg text-xs uppercase hover:bg-gray-200 transition shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <ShieldCheck className="w-4 h-4" />
                                            I Have Completed The Offer
                                        </button>
                                    )}
                                </div>
                            )}
                            
                            {/* Bottom: Progress Bar */}
                            <div className="w-full mt-auto shrink-0">
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3 border border-slate-700 relative">
                                    <div 
                                        className="h-full bg-gradient-to-r from-kirin-blue to-cyan-400 transition-all duration-300 ease-out relative"
                                        style={{ width: `${stage === 'locked' ? 90 : progress}%` }}
                                    >
                                        <div className="absolute right-0 top-0 h-full w-2 bg-white/80 animate-pulse box-shadow-[0_0_10px_white]"></div>
                                    </div>
                                </div>
                                <div className="font-mono text-[9px] text-green-400/80 text-center h-4 overflow-hidden">
                                    {processLog[processLog.length - 1]}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Input Forms (Idle State) */}
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
                <div className="bg-black/50 p-3 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-mono rounded-b-3xl absolute bottom-0 w-full z-30">
                    <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${stage === 'locked' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                        {['locked', 'checking'].includes(stage) ? 'VERIFICATION PENDING' : 'SYSTEM ONLINE'}
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

        {/* Toast Notification for Locker */}
        {stage === 'locked' && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-900/90 backdrop-blur-xl border border-kirin-gold/20 p-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.6)] flex items-start gap-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
                <div className="bg-kirin-gold/10 p-2 rounded-full shrink-0">
                    <Info className="w-5 h-5 text-kirin-gold" />
                </div>
                <div className="flex-1">
                    <h4 className="text-kirin-gold font-bold text-xs uppercase mb-1 tracking-wider">Verification Pending</h4>
                    <p className="text-gray-300 text-xs leading-relaxed font-medium">
                        Complete an offer to verify. If you have already completed it, click "I Have Completed The Offer" above.
                    </p>
                </div>
                <div className="shrink-0">
                    <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                </div>
            </div>
        )}
    </div>
  );
};

export default LandingPage;