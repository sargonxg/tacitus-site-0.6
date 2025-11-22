import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Activity, 
  BookOpen, 
  ArrowRight, 
  Search,
  MessageSquare,
  Share2,
  Database,
  Globe,
  Shield
} from 'lucide-react';

// --- GLOBAL STYLES (Ported & Extended) ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700&family=Inter:wght@300;400;600&display=swap');

    :root {
        --bg-deep: #020308;
        --glass-bg: rgba(6, 10, 20, 0.72);
        --glass-border: rgba(148, 163, 184, 0.2);
        --neon-cyan: #00f3ff;
        --neon-purple: #bc13fe;
        --neon-amber: #ffb347;
        --text-main: #e5e7eb;
        --text-muted: #9ca3af;
        --accent: #f97316;
        --font-mono: 'JetBrains Mono', monospace;
        --font-sans: 'Inter', sans-serif;
    }

    body {
        background-color: var(--bg-deep);
        color: var(--text-main);
        font-family: var(--font-sans);
        overflow-x: hidden;
        margin: 0;
    }

    /* UTILITIES */
    .font-mono { font-family: var(--font-mono); }
    .text-cyan { color: var(--neon-cyan); }
    .text-purple { color: var(--neon-purple); }
    .text-amber { color: var(--neon-amber); }
    
    /* GLASS PANEL */
    .glass-panel {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        backdrop-filter: blur(12px);
    }

    /* GLITCH TEXT EFFECT */
    .glitch-text {
        position: relative;
        font-weight: 800;
        letter-spacing: -0.08em;
        text-shadow: 0 0 20px rgba(0, 243, 255, 0.45), 0 0 40px rgba(188, 19, 254, 0.25);
    }
    .glitch-text::after {
        content: attr(data-text);
        position: absolute; left: 0; top: 0; width: 100%;
        overflow: hidden; text-shadow: -2px 0 var(--neon-purple);
        animation: glitchShift 3s infinite ease-in-out alternate;
        opacity: 0.32;
    }
    @keyframes glitchShift {
        0% { clip-path: inset(0 0 80% 0); transform: translate(0, 0); }
        50% { clip-path: inset(20% 0 40% 0); transform: translate(1px, -1px); }
        100% { clip-path: inset(60% 0 0 0); transform: translate(-1px, 1px); }
    }

    /* BUTTON GLOW */
    .btn-glow {
        box-shadow: 0 0 18px rgba(0, 243, 255, 0.45);
        transition: all 0.3s ease;
    }
    .btn-glow:hover {
        box-shadow: 0 0 25px rgba(0, 243, 255, 0.75);
    }

    /* CARD CYBER HOVER */
    .card-cyber {
        transition: transform 0.24s ease, border-color 0.24s ease;
    }
    .card-cyber:hover {
        transform: translateY(-6px);
        border-color: var(--neon-cyan);
    }

    /* PRISM LAB VISUALS */
    .pulse-dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: var(--neon-cyan);
        box-shadow: 0 0 10px rgba(0,243,255,0.6);
        animation: pulse 2s infinite;
        display: inline-block;
    }
    @keyframes pulse {
        0% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.3); opacity: 1; }
        100% { transform: scale(1); opacity: 0.6; }
    }

    /* CUSTOM SCROLLBAR */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #020308; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--neon-cyan); }
  `}</style>
);

// --- 1. NEURAL CANVAS (Entropy → Crystal) ---
const NeuralCanvas = ({ activeView }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationFrameId;
    
    const config = {
        particleCount: window.innerWidth < 768 ? 60 : 140,
        baseSpeed: 0.28,
        connectionDist: 120,
        mouseInfluence: 140,
        colorFact: '0, 243, 255',      // Cyan
        colorNarrative: '188, 19, 254', // Purple
        colorShared: '255, 179, 71'     // Amber
    };

    const getTargetStructure = () => {
        if (activeView === 'home') return 0.1;
        if (activeView === 'magazine') return 0.3;
        return 0.95; // Engine, Prism, Analysis are structured
    };

    let structureLevel = getTargetStructure();

    class Particle {
        constructor(index, total) {
            this.index = index;
            this.total = total;
            this.resetPosition();
            this.assignType();
            this.computeCrystalTarget();
        }

        resetPosition() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * config.baseSpeed * 3;
            this.vy = (Math.random() - 0.5) * config.baseSpeed * 3;
            this.size = 1 + Math.random() * 1.7;
        }

        assignType() {
            const r = Math.random();
            if (r < 0.65) {
                this.kind = 'fact';
            } else if (r < 0.9) {
                this.kind = 'narrative';
            } else {
                this.kind = 'shared';
                this.size *= 1.3;
            }
        }

        computeCrystalTarget() {
            const cols = Math.ceil(Math.sqrt(this.total));
            const rows = Math.ceil(this.total / cols);
            const col = this.index % cols;
            const row = Math.floor(this.index / cols);

            const marginX = width * 0.18;
            const marginY = height * 0.18;
            const crystalWidth = width - marginX * 2;
            const crystalHeight = height - marginY * 2;
            
            this.tx = marginX + col * (cols > 1 ? crystalWidth / (cols - 1) : 0);
            this.ty = marginY + row * (rows > 1 ? crystalHeight / (rows - 1) : 0);
        }

        update(targetStruct) {
            structureLevel += (targetStruct - structureLevel) * 0.02;

            this.x += this.vx * (1.4 - 0.6 * structureLevel);
            this.y += this.vy * (1.4 - 0.6 * structureLevel);

            if (this.x < -40 || this.x > width + 40 || this.y < -40 || this.y > height + 40) {
                this.resetPosition();
                this.computeCrystalTarget();
            }

            if (structureLevel > 0.05) {
                const pull = 0.015 + structureLevel * 0.035;
                this.x += (this.tx - this.x) * pull;
                this.y += (this.ty - this.y) * pull;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            let color = config.colorFact;
            let alpha = 0.55;
            
            if (this.kind === 'narrative') { color = config.colorNarrative; alpha = 0.7; }
            else if (this.kind === 'shared') { color = config.colorShared; alpha = 0.9; }

            ctx.fillStyle = `rgba(${color}, ${alpha})`;
            ctx.fill();
        }
    }

    const init = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle(i, config.particleCount));
        }
    };

    const drawConnections = () => {
        const baseDist = config.connectionDist;
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const effectiveDist = baseDist * (1.1 - 0.5 * structureLevel);
                
                if (dist < effectiveDist) {
                    let alpha = (1 - dist / effectiveDist) * (0.55 + 0.4 * structureLevel);
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(${config.colorFact}, ${alpha})`;
                    ctx.lineWidth = 0.4 + structureLevel * 0.6;
                    ctx.stroke();
                }
            }
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        const gradient = ctx.createRadialGradient(width*0.5, height*0.1, 0, width*0.5, height*0.5, height*0.9);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        const target = getTargetStructure();
        particles.forEach(p => {
            p.update(target);
            p.draw();
        });
        drawConnections();
        animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener('resize', init);
    return () => {
        window.removeEventListener('resize', init);
        cancelAnimationFrame(animationFrameId);
    };
  }, [activeView]);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10 opacity-70 pointer-events-none" />;
};

// --- ASCII ARCHITECTURE BOX FOR ENGINE ---
const AsciiArchitecture = () => (
  <div className="font-mono text-[10px] md:text-xs leading-tight text-orange-300/90 whitespace-pre overflow-x-auto p-6 bg-black/80 border border-orange-500/30 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.1)] backdrop-blur-sm mb-8">
{`
    [ INGESTION VECTOR ]        [ AGENTIC COMPUTE ]             [ STRATEGIC OUTPUT ]
           |                           |                                 |
     +------------+            +-------------------+            +-------------------+
     | WEB INTEL  | ---------> | FACT DISCOVERY    |            | SITUATION REPORTS |
     | (Velocity) |            | (Contradiction    |            | (Structured JSON) |
     +------------+            |  Check)           |            +-------------------+
           |                   +-------------------+                     ^
     +------------+                      |                               |
     | LOCAL RAD  | ---------> +-------------------+            +-------------------+
     | ( Specific)|            | NARRATIVE MINER   | ========>  | POLICY BRIEFS     |
     +------------+            | (Values Ontology) |            | (Stakeholder Map) |
           |                   +-------------------+            +-------------------+
     +------------+                      |
     | DOC RAG    | ---------> +-------------------+
     | (Authority)|            | STRATEGY AGENT    |
     +------------+            | (Game Theory)     |
                               +-------------------+
`}
  </div>
);

// --- SUB-PAGES ---

const ConflictEngine = ({ onBack }) => (
  <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pt-24 pb-12 px-6 max-w-7xl mx-auto">
    <button onClick={onBack} className="mb-8 flex items-center text-slate-400 hover:text-cyan-400 transition-colors font-mono text-sm group">
      <ArrowRight className="rotate-180 w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> BACK_TO_DASHBOARD
    </button>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="glass-panel p-8 rounded-2xl border-l-4 border-orange-500 mb-8">
          <div className="font-mono text-xs text-orange-500 mb-2 tracking-widest">SYSTEM ARCHITECTURE // V2.1</div>
          <h1 className="glitch-text text-3xl md:text-5xl text-white mb-4" data-text="CONFLICT ENGINE">CONFLICT ENGINE</h1>
          <p className="text-slate-300 text-lg leading-relaxed">
             A multi-pipeline, multi-agent <span className="text-amber font-semibold">Conflict Intelligence Engine</span>. 
             It fuses OSINT, email-native threads, and a policy RAG of high-authority documents to generate live situation
             reports and options that reduce rather than amplify conflict.
          </p>
        </div>

        <AsciiArchitecture />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-cyber bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
             <h4 className="text-cyan font-mono text-sm mb-2">PIPELINE A: VELOCITY</h4>
             <p className="text-xs text-slate-400">
               Captures high-velocity updates via search and web intel. Deduplicates and clusters within rolling cycles.
             </p>
          </div>
          <div className="card-cyber bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
             <h4 className="text-purple font-mono text-sm mb-2">PIPELINE B: SPECIFICITY</h4>
             <p className="text-xs text-slate-400">
               Targets local sources (radio transcripts, NGO updates, field notes) via crawlers and manual uploads.
             </p>
          </div>
          <div className="card-cyber bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
             <h4 className="text-amber font-mono text-sm mb-2">PIPELINE C: AUTHORITY</h4>
             <p className="text-xs text-slate-400">
               Vector repository of high-authority documents (UN reports, ICG, law, internal SOPs) for grounded answers.
             </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
         <div className="glass-panel p-6 rounded-xl">
            <h4 className="font-mono text-xs text-slate-500 mb-4 border-b border-slate-700 pb-2">DEPLOYMENT MODES</h4>
            <ul className="space-y-4 text-sm font-mono text-slate-300">
                <li className="flex items-center"><Globe className="w-4 h-4 mr-3 text-cyan" /> Cloud Native</li>
                <li className="flex items-center"><Database className="w-4 h-4 mr-3 text-purple" /> Private VPC</li>
                <li className="flex items-center"><Shield className="w-4 h-4 mr-3 text-amber" /> Air-Gapped</li>
            </ul>
            <button className="w-full mt-6 py-2 border border-cyan-500/50 text-cyan text-xs hover:bg-cyan-500/10 transition-colors rounded">
                REQUEST_PILOT_ACCESS
            </button>
         </div>
      </div>
    </div>
  </div>
);

const PrismLab = ({ onBack }) => (
  <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pt-24 pb-12 px-6 max-w-7xl mx-auto">
    <button onClick={onBack} className="mb-8 flex items-center text-slate-400 hover:text-purple-400 transition-colors font-mono text-sm group">
      <ArrowRight className="rotate-180 w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> BACK_TO_DASHBOARD
    </button>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
            <div className="glass-panel p-8 rounded-2xl border-l-4 border-purple-500 mb-8">
                <div className="font-mono text-xs text-purple-500 mb-2 tracking-widest">PRISM LAB // POLARIZATION ENGINE</div>
                <h1 className="glitch-text text-3xl md:text-5xl text-white mb-4" data-text="THE PRISM LAB">THE PRISM LAB</h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                    A specialized environment for <span className="text-purple font-semibold">polarization forensics</span> and 
                    <span className="text-amber font-semibold"> campaign intelligence</span>. Prism ingests polling, social feeds,
                    email threads and memos, then maps value-clusters across polarized audiences to surface the narrow band of
                    <span className="text-cyan font-semibold"> actionable common ground</span>.
                </p>
            </div>

            {/* Visual: overlapping coalitions */}
            <div className="border border-purple-500/40 rounded-lg overflow-hidden bg-black/40 relative backdrop-blur-sm h-72 flex items-center justify-center mb-8">
                <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-500 bg-black/50 px-3 py-1 rounded-full border border-slate-700/60">
                    MODE: POLARIZATION MAP
                </div>
                <div className="text-center">
                    <div className="flex justify-center gap-8 mb-4 items-center">
                        <div className="w-28 h-28 rounded-full border-2 border-cyan-500/50 bg-cyan-500/10 flex items-center justify-center">
                            <span className="font-mono text-[10px] text-cyan">BLOC A<br/>(Reform + Innovation)</span>
                        </div>
                        <div className="w-28 h-28 rounded-full border-2 border-amber-500/50 bg-amber-500/10 flex items-center justify-center -ml-10 mix-blend-screen">
                            <span className="font-mono text-[10px] text-amber">BLOC B<br/>(Stability + Security)</span>
                        </div>
                        <div className="w-20 h-20 rounded-full border-2 border-purple-500/50 bg-purple-500/10 flex items-center justify-center -ml-8 mix-blend-screen">
                            <span className="font-mono text-[10px] text-purple-300">PIVOT<br/>VOTERS</span>
                        </div>
                    </div>
                    <div className="font-mono text-[11px] text-purple-300 bg-black/60 px-4 py-1 rounded inline-block border border-purple-500/60 mb-3">
                        BRIDGE DETECTED: "DIGNITY + CONTROL OVER FUTURE"
                    </div>
                    <div className="text-[10px] text-slate-400 max-w-md mx-auto">
                        Tacitus computes where fears and aspirations overlap, then proposes language that speaks to both 
                        blocs without betraying either.
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-cyber glass-panel p-6 rounded-xl">
                    <h4 className="text-red-400 font-bold mb-2">SCENARIO // AI REGULATION CAMPAIGN</h4>
                    <p className="font-mono text-[11px] text-slate-300 mb-2">
                        Losing Frame: <span className="text-red-400">"We must release open weights because freedom of speech is absolute."</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mb-3">
                        Signals disregard for public-safety concerns; hardens opposition base.
                    </p>
                    <p className="font-mono text-[11px] text-emerald-300 mb-2">
                        Prism Reframe: <span className="text-emerald-400">"Open weights, paired with strong safety baselines, 
                        let more good actors find vulnerabilities before bad actors can weaponize them."</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                        Validates risk-aversion while preserving innovation goals; tested against both audience graphs.
                    </p>
                </div>
                <div className="card-cyber glass-panel p-6 rounded-xl border-amber-500/30">
                    <h4 className="text-amber-400 font-bold mb-2">AUDIENCE HEATMAP // OUTRAGE VS OPENNESS</h4>
                    <p className="text-[11px] text-slate-400 mb-3">
                        Tacitus projects segments onto a simple two-axis map (trust in institutions × openness to change).
                    </p>
                    <div className="space-y-2 mb-3">
                        <div>
                            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                <span>Online Base</span><span>OUTRAGE</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                                <div className="h-2 bg-red-500/80" style={{ width: '78%' }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                <span>Quiet Majority</span><span>LISTENING</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                                <div className="h-2 bg-cyan-500/80" style={{ width: '46%' }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                <span>Fence-Sitters</span><span>VOLATILE</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                                <div className="h-2 bg-amber-400/80" style={{ width: '61%' }} />
                            </div>
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                        Messaging experiments are run against this map; the system surfaces lines that lower entropy rather than spike it.
                    </p>
                </div>
            </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
             <div className="glass-panel p-6 rounded-xl">
                <h4 className="font-mono text-xs text-slate-500 mb-4 border-b border-slate-700 pb-2">PRISM MODES</h4>
                <div className="space-y-3 text-[11px] text-slate-300">
                    <div className="flex justify-between items-center">
                        <span>Campaign Strategy (A/B Narrative Testing)</span>
                        <span className="text-[9px] font-mono text-emerald-400">LIVE</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Platform / Moderation Policy Stress-Test</span>
                        <span className="text-[9px] font-mono text-slate-500">BETA</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Institutional Trust Repair (UN, Cities, Orgs)</span>
                        <span className="text-[9px] font-mono text-slate-500">SCENARIO</span>
                    </div>
                </div>
             </div>

             <div className="glass-panel p-6 rounded-xl">
                <h4 className="font-mono text-xs text-slate-500 mb-4 border-b border-slate-700 pb-2">MICRO-SIGNAL VIEW</h4>
                <p className="text-[11px] text-slate-400 mb-3">
                    Each message is decomposed into claims, fears, and desired goods. Prism tracks how these micro-signals travel across factions.
                </p>
                <div className="flex items-center gap-3 mb-3">
                    <span className="pulse-dot"></span>
                    <span className="text-[10px] text-slate-300 font-mono">Spike: "abandoning ordinary workers"</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                    <span className="pulse-dot" style={{ background: '#f97316' }}></span>
                    <span className="text-[10px] text-slate-300 font-mono">Spike: "reckless with safety"</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="pulse-dot" style={{ background: '#22c55e' }}></span>
                    <span className="text-[10px] text-slate-300 font-mono">Stabilizer: "shared responsibility / fairness"</span>
                </div>
             </div>
        </div>
    </div>
  </div>
);

const DeepAnalysis = ({ onBack }) => (
  <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pt-24 pb-12 px-6 max-w-7xl mx-auto">
    <button onClick={onBack} className="mb-8 flex items-center text-slate-400 hover:text-cyan-400 transition-colors font-mono text-sm group">
      <ArrowRight className="rotate-180 w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> BACK_TO_DASHBOARD
    </button>

    <div className="max-w-5xl mx-auto space-y-10">
         <div className="glass-panel p-8 rounded-2xl mb-4 text-center">
             <div className="font-mono text-xs text-cyan mb-2 tracking-widest">SYSTEM OUTPUT // CONFLICT ONTOLOGY</div>
             <h1 className="glitch-text text-3xl md:text-5xl text-white mb-4" data-text="THE LOGIC OF RESOLUTION">THE LOGIC OF RESOLUTION</h1>
             <p className="text-slate-300 text-lg">
                Tacitus does not just summarize emails. It maps the <span className="text-amber font-semibold">topology of the conflict</span> –
                who is in tension with whom, over which goods, under which constraints – and then searches that graph for workable paths forward.
             </p>
         </div>

         {/* Ontology Explanation */}
         <div className="glass-panel p-6 rounded-xl border border-cyan-500/30">
            <h3 className="font-mono text-sm text-cyan mb-3">TACITUS CONFLICT ONTOLOGY</h3>
            <p className="text-[13px] text-slate-300 mb-3">
              Internally, every dispute is decomposed into a small, opinionated ontology. That means each sentence is tagged as:
            </p>
            <ul className="grid md:grid-cols-3 gap-3 text-[12px] text-slate-300 mb-4">
              <li className="border border-slate-700 rounded-lg p-3">
                <span className="font-mono text-cyan block mb-1">ACTOR</span>
                Person, team, institution. Captures role, leverage, and risk profile.
              </li>
              <li className="border border-slate-700 rounded-lg p-3">
                <span className="font-mono text-amber block mb-1">POSITION → INTEREST</span>
                What they say they want vs. what they actually need (recognition, security, time, cashflow, dignity).
              </li>
              <li className="border border-slate-700 rounded-lg p-3">
                <span className="font-mono text-purple block mb-1">NARRATIVE</span>
                The story they tell about why they are right (or wronged) – often loaded with moral language.
              </li>
              <li className="border border-slate-700 rounded-lg p-3">
                <span className="font-mono text-slate-200 block mb-1">CONSTRAINT</span>
                Legal, political, procedural, or financial limits that bound any realistic agreement.
              </li>
              <li className="border border-slate-700 rounded-lg p-3">
                <span className="font-mono text-emerald-300 block mb-1">COMMON GROUND CANDIDATE</span>
                A sentence that partially satisfies at least two conflicting interests.
              </li>
              <li className="border border-slate-700 rounded-lg p-3">
                <span className="font-mono text-red-400 block mb-1">ESCALATION VECTOR</span>
                Language that reliably increases entropy (humiliation, zero-sum framing, identity attacks).
              </li>
            </ul>
            <pre className="font-mono text-[10px] text-slate-400 bg-black/60 rounded p-4 overflow-x-auto">
{`[ACTOR: CEO] --(INTEREST: recognition_of_IP)--> [NARRATIVE: "I built the core architecture"] 
[ACTOR: COO] --(INTEREST: validation_of_revenue_role)--> [NARRATIVE: "Without my clients there is no company"]
[CONSTRAINT] → vesting cliff by Q3; existing term sheet
[COMMON_GROUND] → "safeguard mission + avoid down-round"`}
            </pre>
         </div>

         {/* Case File 01 */}
         <div className="glass-panel p-6 rounded-xl border border-red-500/40">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                <h3 className="font-mono text-sm md:text-lg text-white">CASE FILE: 01 // FOUNDER DISPUTE</h3>
                <span className="bg-red-500/20 text-red-400 border border-red-500/50 text-[10px] font-mono px-2 py-1 rounded">HIGH ENTROPY</span>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-mono text-xs text-slate-500 mb-3">STAKEHOLDER NARRATIVES</h4>
                    <div className="mb-4 pl-4 border-l-2 border-cyan-500">
                        <div className="text-sm font-bold text-cyan mb-1">CEO (Technical)</div>
                        <p className="text-xs text-slate-400 italic mb-1">"I built the core IP. The pivot was my architecture."</p>
                        <div className="text-[10px] font-mono text-slate-500">INTEREST: RECOGNITION / CONTROL OVER TECH DIRECTION</div>
                    </div>
                    <div className="pl-4 border-l-2 border-purple-500">
                        <div className="text-sm font-bold text-purple mb-1">COO (Commercial)</div>
                        <p className="text-xs text-slate-400 italic mb-1">"Code is useless without the clients I brought."</p>
                        <div className="text-[10px] font-mono text-slate-500">INTEREST: VALIDATION / FAIR SHARE OF UPSIDE</div>
                    </div>
                </div>
                <div>
                    <h4 className="font-mono text-xs text-slate-500 mb-3">COMPUTED RESOLUTION</h4>
                    <div className="bg-black/40 p-4 rounded font-mono text-[11px] text-green-400 border border-green-900/50 mb-3">
                        <p>&gt; analyzing_incentives... DONE</p>
                        <p>&gt; mutual_threat: "Down-round by Q3"</p>
                        <p>&gt; shared_value: "Legacy of mission"</p>
                        <p>&gt; high_risk_clause: "unilateral vetoes on roadmap"</p>
                        <p className="mt-2 text-white">
                          RECOMMENDATION: Reset vesting schedule tied to clear revenue + IP targets, 
                          remove personal vetoes, embed mission lock in charter language.
                        </p>
                    </div>
                    <p className="text-[12px] text-slate-400">
                      The engine flags options that maximize joint value while reducing humiliation and public escalation risk. 
                      A human mediator remains in the loop to validate political feasibility.
                    </p>
                </div>
            </div>
         </div>

         {/* Case File 02 */}
         <div className="glass-panel p-6 rounded-xl border border-amber-500/40">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                <h3 className="font-mono text-sm md:text-lg text-white">CASE FILE: 02 // POLARIZED CITY COUNCIL</h3>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/50 text-[10px] font-mono px-2 py-1 rounded">MEDIUM ENTROPY</span>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-mono text-xs text-slate-500 mb-3">MAPPING THE GRIDLOCK</h4>
                    <ul className="text-[12px] text-slate-300 space-y-2">
                        <li>• Bloc 1 frames housing as a <span className="text-amber-300">justice obligation</span>.</li>
                        <li>• Bloc 2 frames it as a <span className="text-cyan-300">security + infrastructure stress</span> problem.</li>
                        <li>• Neighborhood groups speak in terms of <span className="text-purple-300">belonging + continuity</span>.</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-mono text-xs text-slate-500 mb-3">ONTOLOGY SNAPSHOT</h4>
                    <pre className="font-mono text-[10px] text-slate-400 bg-black/60 rounded p-4 overflow-x-auto">
{`VALUE_CLUSTER_A: "fairness / anti-displacement"
VALUE_CLUSTER_B: "safety / services capacity"
COMMON_GROUND_CANDIDATE: "predictable investment + guarantees for existing residents"`}
                    </pre>
                    <p className="text-[12px] text-slate-400 mt-2">
                      Tacitus proposes language that binds new permits to visible investments in shared goods (parks, transit, safety),
                      reducing the sense of zero-sum loss.
                    </p>
                </div>
            </div>
         </div>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const [activeView, setActiveView] = useState('home');

  const renderContent = () => {
    switch (activeView) {
        case 'engine': return <ConflictEngine onBack={() => setActiveView('home')} />;
        case 'prism': return <PrismLab onBack={() => setActiveView('home')} />;
        case 'analysis': return <DeepAnalysis onBack={() => setActiveView('home')} />;
        default: return (
            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="grid lg:grid-cols-2 gap-12 mb-20">
                    <div>
                        <div className="inline-block px-3 py-1 mb-6 rounded-full border border-purple-500/50 bg-purple-900/20 font-mono text-[10px] tracking-widest text-purple-300">
                            v0.7 · CONFLICT & POLARIZATION INTELLIGENCE
                        </div>
                        <h1 className="glitch-text text-5xl md:text-7xl text-white mb-6 leading-[0.9]" data-text="CONFLICT IS INFORMATION ASYMMETRY">
                            CONFLICT IS<br/>INFORMATION<br/>ASYMMETRY
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-lg mb-8 pl-4 border-l-2 border-slate-800">
                            Tacitus is an email-native, multi-agent <span className="text-amber font-semibold">conflict intelligence layer</span>.
                            It reads the tangle of email threads, chats and memos and turns information asymmetry — the
                            <span className="text-amber"> Resolution Deficit</span> — into structured maps of disputes, risks and common ground,
                            so leaders can defuse polarization and ground decisions in evidence rather than volume.
                        </p>
                        <div className="flex flex-wrap gap-2 font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                            <span className="px-2 py-1 border border-slate-800 bg-slate-900/80 rounded">Email-Native</span>
                            <span className="px-2 py-1 border border-slate-800 bg-slate-900/80 rounded">Multi-Agent</span>
                            <span className="px-2 py-1 border border-slate-800 bg-slate-900/80 rounded">RAG-Grounded</span>
                        </div>
                    </div>
                    
                    {/* Hero Panel (Right Side) */}
                    <div className="glass-panel rounded-xl p-6 self-center border-t border-cyan-500/20 shadow-[0_0_40px_rgba(0,243,255,0.1)]">
                        <div className="font-mono text-xs text-slate-500 mb-4 tracking-widest">SYSTEM DIAGNOSTIC // LIVE</div>
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-sm text-slate-400">Resolution Deficit</span>
                                <span className="font-mono text-red-400">HIGH</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-sm text-slate-400">Narrative Asymmetry</span>
                                <span className="font-mono text-amber-400">SEVERE</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-sm text-slate-400">Human Override</span>
                                <span className="font-mono text-green-400">ENFORCED</span>
                            </div>
                        </div>
                        <div className="font-mono text-xs text-slate-500">
                            <span>› Fly through the tangle.</span><br/>
                            <span>› Switch to ENGINE, PRISM, ANALYSIS to crystallize the graph.</span>
                        </div>
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: Conflict Engine */}
                    <div 
                        className="card-cyber glass-panel p-6 rounded-xl cursor-pointer border-t-2 border-t-amber-500"
                        onClick={() => setActiveView('engine')}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <Cpu className="w-8 h-8 text-amber-400" />
                            <ArrowRight className="w-4 h-4 text-slate-600" />
                        </div>
                        <h3 className="font-mono text-white text-sm mb-2">CONFLICT ENGINE</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                            Multi-pipeline conflict engine. OSINT + email-native RAG for live situation reports and option sets.
                        </p>
                        <span className="text-amber-400 text-xs font-mono font-bold">VIEW PIPELINE &rarr;</span>
                    </div>

                    {/* Card 2: Prism Lab */}
                    <div 
                        className="card-cyber glass-panel p-6 rounded-xl cursor-pointer border-t-2 border-t-purple-500"
                        onClick={() => setActiveView('prism')}
                    >
                         <div className="flex justify-between items-start mb-4">
                            <Activity className="w-8 h-8 text-purple-400" />
                            <ArrowRight className="w-4 h-4 text-slate-600" />
                        </div>
                        <h3 className="font-mono text-white text-sm mb-2">THE PRISM LAB</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                            Polarization intelligence. Understand blocs, test frames, and search for common ground across campaigns and institutions.
                        </p>
                        <span className="text-purple-400 text-xs font-mono font-bold">ENTER LAB &rarr;</span>
                    </div>

                    {/* Card 3: Concordia Discors Magazine */}
                    <div className="card-cyber glass-panel p-6 rounded-xl cursor-pointer border-t-2 border-t-cyan-500 group">
                         <div className="flex justify-between items-start mb-4">
                            <BookOpen className="w-8 h-8 text-cyan-400" />
                            <Share2 className="w-4 h-4 text-slate-600" />
                        </div>
                        <h3 className="font-mono text-white text-sm mb-2">CONCORDIA DISCORS MAGAZINE</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">
                            Our sister project: a journal on liberty, conscience, civic virtues and the art of disagreement.
                            Essays, dialogues, and criticism reading polarization, conflict, and AI through a philosophical lens.
                        </p>
                        <div className="text-[10px] font-mono text-slate-500 mb-3">
                            Liberty · Conscience · Civic Virtues · Polarization
                        </div>
                        <a href="https://concordiadiscors.org/" target="_blank" rel="noreferrer" className="text-cyan-400 text-xs font-mono font-bold group-hover:underline">
                            VISIT CONCORDIA DISCORS &rarr;
                        </a>
                    </div>
                </div>
                
                {/* Bottom Footer area */}
                <div className="mt-20 pt-8 border-t border-slate-800/50 text-center">
                     <div className="font-mono text-xs text-slate-600 mb-4">
                        <p>&gt; system_status: <span className="text-green-500">OPERATIONAL</span></p>
                        <a href="mailto:deploy@tacitus.me" className="text-cyan-500 hover:underline mt-2 inline-block">
                            root@tacitus:~$ initiate_deployment_sequence
                        </a>
                     </div>
                </div>
            </div>
        );
    }
  };

  return (
    <div className="min-h-screen text-slate-200 selection:bg-cyan-500/30 selection:text-cyan-100 relative">
      <GlobalStyles />
      <NeuralCanvas activeView={activeView} />

      <nav className="glass-panel fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center z-50">
        <div 
            className="font-mono font-bold text-lg flex items-center gap-1 cursor-pointer"
            onClick={() => setActiveView('home')}
        >
            TACITUS<span className="text-lg opacity-90">◳</span><span className="text-cyan animate-pulse">_</span>
        </div>

        <div className="hidden md:flex items-center gap-6 font-mono text-xs tracking-widest">
            <button onClick={() => setActiveView('home')} className={`hover:text-cyan transition-colors \${activeView === 'home' ? 'text-cyan' : 'text-slate-400'}`}>HOME</button>
            <button onClick={() => setActiveView('engine')} className={`hover:text-amber transition-colors \${activeView === 'engine' ? 'text-amber' : 'text-slate-400'}`}>INTEL</button>
            <button onClick={() => setActiveView('prism')} className={`hover:text-purple transition-colors \${activeView === 'prism' ? 'text-purple' : 'text-slate-400'}`}>PRISM</button>
            <button onClick={() => setActiveView('analysis')} className={`hover:text-slate-200 transition-colors \${activeView === 'analysis' ? 'text-white' : 'text-slate-400'}`}>ANALYSIS</button>
            <a href="mailto:deploy@tacitus.me" className="px-4 py-1 rounded-full border border-cyan-500 text-cyan shadow-[0_0_10px_rgba(0,243,255,0.3)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] transition-all">INITIALIZE</a>
        </div>
        
        {/* Mobile Menu Icon (Simplified) */}
        <div className="md:hidden space-y-1 cursor-pointer">
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
        </div>
      </nav>

      <main>
        {renderContent()}
      </main>
    </div>
  );
}
