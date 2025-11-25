
import React, { useState } from 'react';
import { 
  User, 
  Fingerprint, 
  BrainCircuit, 
  Activity, 
  Palette, 
  Bell, 
  Cpu, 
  Database, 
  Shield, 
  Smartphone, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Moon, 
  Sun, 
  Layers, 
  Workflow, 
  Save,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  Command,
  Power,
  ArrowRight,
  Volume2
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '../lib/utils';
import { useSound } from '../contexts/SoundContext';

// --- TYPES ---

type SettingsTab = 'profile' | 'identity' | 'intelligence' | 'behavior' | 'appearance' | 'system' | 'data';

interface SettingToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

interface SettingSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  formatValue?: (val: number) => string;
}

// --- UI COMPONENTS ---

const SettingToggle: React.FC<SettingToggleProps> = ({ label, description, checked, onChange }) => {
  const { playSound } = useSound();
  
  const handleToggle = () => {
    playSound(checked ? 'off' : 'on');
    onChange(!checked);
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group">
      <div className="pr-8">
        <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{label}</div>
        {description && <div className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</div>}
      </div>
      <button 
        onClick={handleToggle}
        className={cn(
          "relative w-11 h-6 rounded-full transition-all duration-300 shrink-0",
          checked ? 'bg-forge-accent shadow-[0_0_10px_rgba(124,58,237,0.4)]' : 'bg-white/10 hover:bg-white/20'
        )}
      >
        <div className={cn(
          "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm",
          checked ? 'translate-x-5' : 'translate-x-0'
        )} />
      </button>
    </div>
  );
};

const SettingSlider: React.FC<SettingSliderProps> = ({ label, value, min, max, onChange, formatValue }) => (
  <div className="py-4 border-b border-white/5 last:border-0">
    <div className="flex justify-between items-center mb-3">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <span className="text-xs font-mono text-forge-cyan bg-forge-cyan/10 px-2 py-0.5 rounded">
        {formatValue ? formatValue(value) : value}
      </span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-forge-accent hover:accent-forge-cyan focus:outline-none transition-all"
    />
  </div>
);

const SectionHeader: React.FC<{ title: string; description: string; icon: React.ElementType }> = ({ title, description, icon: Icon }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-forge-cyan">
        <Icon size={20} />
      </div>
      <h2 className="text-2xl font-display font-bold text-white">{title}</h2>
    </div>
    <p className="text-sm text-gray-400 max-w-2xl leading-relaxed ml-11">
      {description}
    </p>
  </div>
);

// --- SUB-MODULES ---

const ProfileSection = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start gap-8">
        {/* Sigil Generator */}
        <div className="shrink-0">
          <div className="w-32 h-32 rounded-full bg-black border-2 border-white/10 relative flex items-center justify-center overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-forge-accent/20 to-forge-cyan/20 animate-pulse-slow" />
            <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-500">
               <svg viewBox="0 0 100 100" className="w-20 h-20 text-white fill-current">
                 <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                 <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
                 <path d="M50 20 L50 80 M20 50 L80 50" stroke="currentColor" strokeWidth="1" />
               </svg>
            </div>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
              <RefreshCw size={24} className="text-white" />
            </div>
          </div>
          <div className="text-center mt-3">
            <button className="text-xs text-forge-cyan hover:text-white transition-colors">Regenerate Sigil</button>
          </div>
        </div>

        {/* Fields */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 font-mono uppercase mb-1.5">Designation</label>
              <input type="text" defaultValue="Alex Cipher" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-forge-accent focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-mono uppercase mb-1.5">Inception Date</label>
              <input type="date" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-forge-accent focus:outline-none transition-colors" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 font-mono uppercase mb-1.5">Identity Tagline</label>
            <input type="text" defaultValue="Architect of Systems" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-forge-accent focus:outline-none transition-colors" />
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
             <div>
                <div className="text-xs text-gray-500 font-mono uppercase mb-1">Life Path Number</div>
                <div className="text-xl font-bold text-white">7 <span className="text-sm font-normal text-gray-500">| The Seeker</span></div>
             </div>
             <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 transition-colors border border-white/5">Recalculate</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const IdentitySection = () => {
  const [driftMonitor, setDriftMonitor] = useState(true);
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-3 gap-4">
        {['Creator', 'Strategist', 'Warrior'].map((arch, i) => (
          <div key={arch} className={cn(
            "p-4 rounded-xl border cursor-pointer transition-all hover:-translate-y-1",
            i === 1 ? 'bg-forge-accent/10 border-forge-accent text-white shadow-[0_0_15px_rgba(124,58,237,0.2)]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
          )}>
            <div className="text-[10px] uppercase tracking-widest opacity-60 mb-2">Core Archetype</div>
            <div className="text-lg font-bold">{arch}</div>
          </div>
        ))}
      </div>

      <GlassCard className="p-0 overflow-hidden" noPadding>
        <div className="p-4 bg-white/[0.02] border-b border-white/5">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Identity Configuration</h3>
        </div>
        <div className="p-6">
          <SettingToggle 
            label="Identity Drift Monitor" 
            description="AI detects when your behavior deviates from your declared archetype."
            checked={driftMonitor} 
            onChange={setDriftMonitor} 
          />
          <SettingToggle 
            label="Auto-Sync with Data" 
            description="Periodically rebuilds identity profile based on Journal and Habit logs."
            checked={true} 
            onChange={() => {}} 
          />
        </div>
      </GlassCard>

      <div>
        <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">Core Pillars</h3>
        <div className="space-y-2">
          {['Radical Truth', 'Systems Thinking', 'Compassionate Discipline'].map((pillar) => (
            <div key={pillar} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
              <span className="text-sm text-gray-200">{pillar}</span>
              <button className="text-gray-500 hover:text-white"><Command size={14} /></button>
            </div>
          ))}
          <button className="w-full py-2 rounded-lg border border-dashed border-white/20 text-xs text-gray-500 hover:text-white hover:border-white/40 transition-all">
            + Add Pillar
          </button>
        </div>
      </div>
    </div>
  );
};

const IntelligenceSection = () => {
  const [mode, setMode] = useState('active');
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <label className="block text-xs text-gray-500 font-mono uppercase mb-3">Insight Engine Mode</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'passive', label: 'Passive', desc: 'Only responds when asked.', icon: Moon },
            { id: 'active', label: 'Active', desc: 'Surfaces daily insights.', icon: Sun },
            { id: 'predictive', label: 'Predictive', desc: 'Warns about future dips.', icon: Zap },
          ].map((m) => (
            <div 
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden group",
                mode === m.id ? 'bg-white/10 border-forge-cyan text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/[0.08]'
              )}
            >
              {mode === m.id && <div className="absolute inset-0 bg-gradient-to-br from-forge-cyan/10 to-transparent pointer-events-none" />}
              <m.icon size={20} className={cn("mb-3", mode === m.id ? 'text-forge-cyan' : 'text-gray-500')} />
              <div className="font-bold text-sm mb-1">{m.label}</div>
              <div className="text-xs opacity-70 leading-relaxed">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <GlassCard className="p-6 space-y-2" noPadding>
        <div className="p-6 border-b border-white/5">
           <h3 className="text-sm font-bold text-white uppercase tracking-widest">Cognitive Toggles</h3>
        </div>
        <div className="p-6 pt-2">
          <SettingToggle label="Emotional Pattern Detection" checked={true} onChange={() => {}} />
          <SettingToggle label="Cognitive Loop Detection" description="Identifies recurring thought spirals in journals." checked={true} onChange={() => {}} />
          <SettingToggle label="Energy Forecasting" checked={false} onChange={() => {}} />
          <SettingToggle label="Narrative Synthesis" description="Rewrites your week as a story." checked={true} onChange={() => {}} />
        </div>
      </GlassCard>
    </div>
  );
};

const AppearanceSection = () => {
  const [glowStrength, setGlowStrength] = useState(70);
  const [blurLevel, setBlurLevel] = useState(50);
  const { isEnabled, toggleSound } = useSound();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <label className="block text-xs text-gray-500 font-mono uppercase mb-3">System Theme</label>
        <div className="grid grid-cols-4 gap-3">
          {[
            { name: 'Cosmic', bg: 'bg-[#050505]', accent: 'bg-forge-accent' },
            { name: 'Aurora', bg: 'bg-[#0B0B15]', accent: 'bg-emerald-500' },
            { name: 'Titanium', bg: 'bg-gray-900', accent: 'bg-gray-200' },
            { name: 'Midnight', bg: 'bg-black', accent: 'bg-blue-600' }
          ].map((theme, i) => (
            <div key={theme.name} className="group cursor-pointer">
              <div className={cn("aspect-video rounded-lg border border-white/10 relative overflow-hidden mb-2", theme.bg)}>
                <div className={cn("absolute top-2 right-2 w-3 h-3 rounded-full", theme.accent)} />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/5 backdrop-blur-sm" />
                {i === 0 && <div className="absolute inset-0 border-2 border-forge-cyan rounded-lg" />}
              </div>
              <div className={cn("text-center text-xs", i === 0 ? 'text-white font-bold' : 'text-gray-500 group-hover:text-gray-300')}>{theme.name}</div>
            </div>
          ))}
        </div>
      </div>

      <GlassCard className="p-6" noPadding>
        <div className="p-6 border-b border-white/5">
           <h3 className="text-sm font-bold text-white uppercase tracking-widest">Visual & Audio Calibration</h3>
        </div>
        <div className="p-6 pt-2">
          <SettingToggle 
            label="Interaction Sounds" 
            description="Procedural audio feedback for clicks and hover states."
            checked={isEnabled} 
            onChange={toggleSound} 
          />
          <SettingSlider 
            label="Glow Strength" 
            value={glowStrength} 
            min={0} max={100} 
            onChange={setGlowStrength} 
            formatValue={(v) => `${v}%`} 
          />
          <SettingSlider 
            label="Background Blur" 
            value={blurLevel} 
            min={0} max={100} 
            onChange={setBlurLevel} 
            formatValue={(v) => `${v}px`} 
          />
          <SettingToggle label="Particle Effects" checked={true} onChange={() => {}} />
          <SettingToggle label="Reduced Motion" checked={false} onChange={() => {}} />
        </div>
      </GlassCard>
    </div>
  );
};

const SystemSection = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Automations */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
          <Workflow size={16} className="text-forge-cyan" /> Automations
        </h3>
        <div className="space-y-3">
          {[
            { trigger: 'Mood drops < 4', action: 'Suggest Recovery Routine', active: true },
            { trigger: 'Deep Work > 2h', action: 'Trigger Break Alert', active: true },
            { trigger: 'Sunday 8PM', action: 'Open Weekly Review', active: false },
          ].map((auto, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded">IF</div>
                <span className="text-sm text-white font-medium">{auto.trigger}</span>
                <ArrowRight size={12} className="text-gray-600" />
                <div className="text-xs font-mono text-forge-cyan bg-forge-cyan/10 px-2 py-1 rounded">THEN</div>
                <span className="text-sm text-white font-medium">{auto.action}</span>
              </div>
              <div className={cn("w-2 h-2 rounded-full", auto.active ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-gray-600')} />
            </div>
          ))}
          <button className="w-full py-3 rounded-xl border border-dashed border-white/20 text-xs text-gray-500 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2">
            <Zap size={14} /> Create New Automation
          </button>
        </div>
      </div>

      {/* Integrations */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
          <Layers size={16} className="text-fuchsia-500" /> Neural Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Google Calendar', status: 'Connected', color: 'bg-blue-500' },
            { name: 'Apple Health', status: 'Syncing...', color: 'bg-red-500' },
            { name: 'Notion', status: 'Disconnected', color: 'bg-white' },
            { name: 'Spotify', status: 'Connected', color: 'bg-green-500' },
          ].map((app) => (
            <div key={app.name} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-black font-bold text-xs", app.color)}>
                  {app.name[0]}
                </div>
                <span className="text-sm text-white font-medium">{app.name}</span>
              </div>
              <span className={cn("text-[10px] font-mono uppercase", app.status === 'Connected' ? 'text-green-400' : app.status === 'Disconnected' ? 'text-gray-500' : 'text-yellow-400')}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DataSection = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20 text-center">
          <Shield size={24} className="text-emerald-400 mx-auto mb-3" />
          <div className="text-lg font-bold text-white mb-1">Encrypted</div>
          <div className="text-xs text-gray-400">Local-First Vault</div>
        </GlassCard>
        <GlassCard className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 text-center">
          <Database size={24} className="text-blue-400 mx-auto mb-3" />
          <div className="text-lg font-bold text-white mb-1">24MB Used</div>
          <div className="text-xs text-gray-400">of 5GB Cloud</div>
        </GlassCard>
        <GlassCard className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20 text-center">
          <Save size={24} className="text-purple-400 mx-auto mb-3" />
          <div className="text-lg font-bold text-white mb-1">Last Backup</div>
          <div className="text-xs text-gray-400">2 hours ago</div>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden" noPadding>
        <div className="p-6 border-b border-white/5">
           <h3 className="text-sm font-bold text-white uppercase tracking-widest">Data Management</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div>
              <div className="text-sm font-medium text-white">Export Neural Archive</div>
              <div className="text-xs text-gray-500">Download all journals, metrics, and configurations (JSON).</div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all">Export</button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div>
              <div className="text-sm font-medium text-white">Clear AI Context</div>
              <div className="text-xs text-gray-500">Reset the Insight Engine's short-term memory.</div>
            </div>
            <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-bold transition-all">Reset</button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5">
            <div>
              <div className="text-sm font-medium text-red-400">Factory Reset</div>
              <div className="text-xs text-red-400/60">Wipe all local data. This cannot be undone.</div>
            </div>
            <button className="px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all">Delete All</button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

// --- MAIN COMPONENT ---

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { playSound } = useSound();

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'identity', label: 'Identity', icon: Fingerprint },
    { id: 'intelligence', label: 'Intelligence', icon: BrainCircuit },
    { id: 'behavior', label: 'Behavior', icon: Activity },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: Cpu },
    { id: 'data', label: 'Data & Privacy', icon: Shield },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSection />;
      case 'identity': return <IdentitySection />;
      case 'intelligence': return <IntelligenceSection />;
      case 'behavior': return <div className="text-center text-gray-500 py-20">Behavior Tracking Configuration Loading...</div>; // Placeholder for brevity if needed, or reuse standard patterns
      case 'appearance': return <AppearanceSection />;
      case 'system': return <SystemSection />;
      case 'data': return <DataSection />;
      default: return <ProfileSection />;
    }
  };

  const handleTabChange = (id: SettingsTab) => {
    playSound('click');
    setActiveTab(id);
  };

  // Headers for each section
  const headers: Record<SettingsTab, { title: string; description: string }> = {
    profile: { title: "Personal Profile", description: "Define the core parameters of the user entity." },
    identity: { title: "Identity Configuration", description: "Calibrate how the OS interprets your character and growth pillars." },
    intelligence: { title: "Insight Engine", description: "Configure the AI's behavior, creativity temperature, and intervention levels." },
    behavior: { title: "Behavior Tracking", description: "Adjust thresholds for streaks, routine adherence, and habit formation." },
    appearance: { title: "Appearance & Theme", description: "Customize the visual interface of the Forge OS." },
    system: { title: "System & Integrations", description: "Manage notifications, external connections, and automation protocols." },
    data: { title: "Data & Privacy", description: "Control your data footprint, backups, and encryption standards." },
  };

  return (
    <div className="h-full flex bg-[#050505] text-white relative overflow-hidden animate-in fade-in duration-700">
      
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-gray-900/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-forge-accent/5 rounded-full blur-[150px]" />
      </div>

      <div className="flex-1 h-full flex relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Sidebar */}
        <div className="w-64 hidden lg:flex flex-col border-r border-white/5 p-6">
          <div className="mb-8 pl-2">
            <h1 className="font-display font-bold text-xl text-white tracking-tight mb-1">Settings</h1>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Optimal
            </div>
          </div>
          
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                onMouseEnter={() => playSound('hover')}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.id 
                    ? 'bg-white/10 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-forge-cyan' : 'text-gray-500'} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors w-full px-2">
              <Power size={14} /> Developer Mode
            </button>
            <div className="mt-4 text-[10px] text-gray-600 font-mono px-2">
              Forge OS v2.5.0<br/>Build 2023.10.28
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-8 md:p-12 pb-40 max-w-3xl">
            <SectionHeader 
              title={headers[activeTab].title} 
              description={headers[activeTab].description} 
              icon={tabs.find(t => t.id === activeTab)!.icon} 
            />
            {renderContent()}
          </div>
        </div>

      </div>
    </div>
  );
};
