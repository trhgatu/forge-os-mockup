
import React, { useState } from 'react';
import { View, NavItem } from '../types';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  BookOpen, 
  History, 
  Lightbulb, 
  Settings,
  Activity,
  Cpu,
  ChevronLeft,
  ChevronRight,
  GitCommitHorizontal,
  Quote,
  Smile,
  Telescope,
  Target,
  Repeat,
  Clock,
  Zap,
  Flag,
  CalendarCheck,
  Moon,
  Orbit,
  Trophy,
  Fingerprint,
  Map,
  Ghost,
  Navigation,
  Globe,
  Languages
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: View.MASTERPLAN, labelKey: 'nav.masterplan', icon: Globe, group: 'Meta' },
  { id: View.DASHBOARD, labelKey: 'nav.dashboard', icon: LayoutDashboard, group: 'Main' },
  { id: View.FORGE_CHAMBER, labelKey: 'nav.forge_chamber', icon: BrainCircuit, group: 'Main' },
  { id: View.TIMELINE, labelKey: 'nav.timeline', icon: GitCommitHorizontal, group: 'Reflection' },
  { id: View.JOURNAL, labelKey: 'nav.journal', icon: BookOpen, group: 'Reflection' },
  { id: View.MEMORY, labelKey: 'nav.memory', icon: History, group: 'Reflection' },
  { id: View.SHADOW_WORK, labelKey: 'nav.shadow_work', icon: Ghost, group: 'Reflection' },
  { id: View.MOOD, labelKey: 'nav.mood', icon: Smile, group: 'Reflection' },
  { id: View.QUOTES, labelKey: 'nav.quotes', icon: Quote, group: 'Reflection' },
  { id: View.COMPASS, labelKey: 'nav.compass', icon: Navigation, group: 'Evolution' },
  { id: View.GOALS, labelKey: 'nav.goals', icon: Target, group: 'Evolution' },
  { id: View.IDENTITY, labelKey: 'nav.identity', icon: Fingerprint, group: 'Evolution' },
  { id: View.THEMES, labelKey: 'nav.themes', icon: Map, group: 'Evolution' },
  { id: View.MILESTONES, labelKey: 'nav.milestones', icon: Flag, group: 'Evolution' },
  { id: View.ACHIEVEMENTS, labelKey: 'nav.achievements', icon: Trophy, group: 'Evolution' },
  { id: View.HABITS, labelKey: 'nav.habits', icon: Repeat, group: 'Evolution' },
  { id: View.ROUTINES, labelKey: 'nav.routines', icon: Clock, group: 'Evolution' },
  { id: View.ENERGY, labelKey: 'nav.energy', icon: Zap, group: 'Evolution' },
  { id: View.INSIGHTS, labelKey: 'nav.insights', icon: Telescope, group: 'System' },
  { id: View.WEEKLY_REVIEW, labelKey: 'nav.weekly_review', icon: CalendarCheck, group: 'System' },
  { id: View.MONTHLY_REVIEW, labelKey: 'nav.monthly_review', icon: Moon, group: 'System' },
  { id: View.YEARLY_REVIEW, labelKey: 'nav.yearly_review', icon: Orbit, group: 'System' },
  { id: View.IDEAS, labelKey: 'nav.ideas', icon: Lightbulb, group: 'Creativity' },
  { id: View.SETTINGS, labelKey: 'nav.settings', icon: Settings, group: 'System' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en');
  };

  return (
    <aside 
      className={cn(
        "relative h-full z-50 flex flex-col",
        "border-r border-forge-border bg-forge-bg/60 backdrop-blur-2xl",
        "transition-[width] duration-500 ease-spring-out will-change-[width, transform]",
        isExpanded ? 'w-72' : 'w-20'
      )}
    >
      {/* Background Gradient Glow (Subtle) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-forge-accent/10 to-transparent transition-opacity duration-500",
          isExpanded ? 'opacity-100' : 'opacity-0'
        )} />
      </div>

      {/* Header */}
      <div className={cn(
        "flex items-center p-6 mb-2 transition-all duration-500",
        isExpanded ? 'justify-start gap-3' : 'justify-center'
      )}>
        <div className="relative group shrink-0 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forge-accent to-forge-cyan flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)] relative z-10 transition-transform duration-300 hover:scale-105">
            <Cpu className="text-white w-5 h-5" />
          </div>
          {/* Glow Effect behind logo */}
          <div className="absolute inset-0 bg-white/50 blur-lg rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
        </div>
        
        <div className={cn(
          "flex flex-col overflow-hidden whitespace-nowrap transition-all duration-300 ease-spring-out origin-left",
          isExpanded ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 -translate-x-4 w-0'
        )}>
          <span className="font-display font-bold text-lg tracking-wide text-white leading-none">FORGE OS</span>
          <span className="text-[10px] font-mono text-forge-cyan mt-1">v2.5.0-beta</span>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-6 scrollbar-hide">
        {['Meta', 'Main', 'Reflection', 'Creativity', 'Evolution', 'System'].map((group) => (
          <div key={group} className="relative">
            {/* Group Label */}
            <h3 className={cn(
              "px-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 transition-all duration-300",
              isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
            )}>
              {t(`group.${group.toLowerCase()}`)}
            </h3>

            <div className="space-y-1">
              {NAV_ITEMS.filter(item => item.group === group).map((item, index) => {
                const isActive = currentView === item.id;
                const Icon = item.icon;
                const label = t(item.labelKey);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      "group relative w-full flex items-center p-3 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive 
                        ? 'bg-white/10 text-white shadow-inner border border-white/5' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent',
                      isExpanded ? 'justify-start gap-3' : 'justify-center'
                    )}
                  >
                    {/* Active Indicator Pill (Left) */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-forge-cyan rounded-r-full shadow-[0_0_10px_#22D3EE] transition-all duration-300" />
                    )}

                    {/* Icon */}
                    <Icon 
                      size={20} 
                      className={cn(
                        "transition-all duration-300 z-10 shrink-0",
                        isActive ? 'text-forge-cyan' : 'text-gray-400 group-hover:text-gray-200',
                        !isExpanded && isActive ? 'scale-110' : ''
                      )} 
                    />

                    {/* Label with Staggered Entry */}
                    <span 
                      className={cn(
                        "whitespace-nowrap transition-all duration-300 ease-spring-out origin-left",
                        isExpanded ? 'opacity-100 translate-x-0 w-auto delay-75' : 'opacity-0 -translate-x-4 w-0'
                      )}
                      style={{ transitionDelay: isExpanded ? `${index * 35}ms` : '0ms' }}
                    >
                      {label}
                    </span>

                    {/* Active Dot (Right) - Only when expanded */}
                    {isActive && isExpanded && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-forge-cyan shadow-[0_0_8px_#22D3EE] animate-pulse" />
                    )}
                    
                    {/* Tooltip for Collapsed State */}
                    {!isExpanded && (
                      <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 border border-white/10 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none z-50 shadow-xl backdrop-blur-xl">
                        {label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle Button (Floating) */}
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300 z-50">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-6 h-12 bg-forge-bg border border-forge-border rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-forge-cyan transition-all shadow-xl backdrop-blur-xl"
        >
          {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* User Status & Settings */}
      <div className="p-4 mt-auto border-t border-forge-border bg-black/20 space-y-2">
        {/* Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className={cn(
            "w-full flex items-center rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-white/5 group",
            isExpanded ? 'p-2 gap-3' : 'p-2 justify-center'
          )}
        >
           <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
              <Languages size={16} />
           </div>
           {isExpanded && (
             <div className="flex-1 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">Language</span>
                <div className="flex bg-black/40 rounded-md p-0.5 border border-white/10">
                   <span className={cn("px-2 py-0.5 text-[10px] rounded font-bold transition-all", language === 'en' ? 'bg-forge-cyan text-black' : 'text-gray-500')}>EN</span>
                   <span className={cn("px-2 py-0.5 text-[10px] rounded font-bold transition-all", language === 'vi' ? 'bg-forge-cyan text-black' : 'text-gray-500')}>VI</span>
                </div>
             </div>
           )}
        </button>

        <div className={cn(
          "flex items-center rounded-xl transition-all duration-300",
          isExpanded ? 'p-2 gap-3 bg-white/5 border border-white/5' : 'p-0 justify-center bg-transparent border-none'
        )}>
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center border border-white/10 shadow-lg">
               <span className="text-xs font-bold">U</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-forge-bg rounded-full flex items-center justify-center">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
          
          <div className={cn(
             "flex-1 min-w-0 overflow-hidden transition-all duration-300",
             isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
          )}>
            <div className="text-sm font-medium text-white truncate">User_01</div>
            <div className="text-xs text-forge-cyan flex items-center gap-1">
               <Activity size={10} /> Online
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
