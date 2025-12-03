
import React, { useState, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ForgeChamber } from './components/ForgeChamber';
import { JournalView } from './components/JournalView';
import { MemoryView } from './components/MemoryView';
import { TimelineView } from './components/TimelineView';
import { QuoteView } from './components/QuoteView';
import { MoodView } from './components/MoodView';
import { InsightView } from './components/InsightView';
import { ForgeLabView } from './components/ForgeLabView'; 
import { GoalsView } from './components/GoalsView';
import { HabitsView } from './components/HabitsView';
import { RoutinesView } from './components/RoutinesView';
import { MilestoneView } from './components/MilestoneView';
import { EnergyView } from './components/EnergyView';
import { WeeklyReviewView } from './components/WeeklyReviewView';
import { MonthlyReviewView } from './components/MonthlyReviewView';
import { YearlyReviewView } from './components/YearlyReviewView';
import { AchievementsView } from './components/AchievementsView';
import { IdentityView } from './components/IdentityView';
import { LifeThemesView } from './components/LifeThemesView';
import { ShadowWorkView } from './components/ShadowWorkView';
import { CompassView } from './components/CompassView';
import { SoundtrackView } from './components/SoundtrackView'; 
import { MantraView } from './components/MantraView'; 
import { MetaJournalView } from './components/MetaJournalView'; 
import { ConnectionView } from './components/ConnectionView';
import { PresenceView } from './components/PresenceView'; 
import { EchoesView } from './components/EchoesView'; 
import { WikiView } from './components/WikiView';
import { ThoughtStreamView } from './components/ThoughtStreamView';
import { EpicSceneVault } from './components/EpicSceneVault/EpicSceneVault';
import { SettingsView } from './components/SettingsView';
import { NovaGuide } from './components/NovaGuide';
import { View } from './types';
import { GlassCard } from './components/GlassCard';
import { Hammer } from 'lucide-react';
import { NotificationOverlay } from './components/Notification/NotificationOverlay';
import { GlobalPlayer } from './components/GlobalPlayer';
import { gsap } from 'gsap';

// Redux Adapter Hooks (formerly Contexts)
import { useNavigation } from './contexts/NavigationContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { EchoesProvider } from './contexts/EchoesContext';
import { InsightProvider } from './contexts/InsightContext';
import { ThoughtStreamProvider } from './contexts/ThoughtStreamContext';
import { SoundtrackProvider } from './contexts/SoundtrackContext';
import { ForgeLabProvider } from './contexts/ForgeLabContext';
import { EpicSceneProvider } from './contexts/EpicSceneContext';

const AppContent: React.FC = () => {
  const { currentView, navigateTo } = useNavigation();
  const mainContentRef = useRef<HTMLDivElement>(null);

  // GSAP View Transition
  useEffect(() => {
    if (mainContentRef.current) {
        gsap.fromTo(mainContentRef.current, 
            { 
                opacity: 0, 
                y: 20, 
                filter: 'blur(8px)',
                scale: 0.98
            },
            { 
                opacity: 1, 
                y: 0, 
                filter: 'blur(0px)',
                scale: 1,
                duration: 0.6, 
                ease: 'power3.out',
                clearProps: 'all' // Cleanup to avoid issues with fixed positioned children
            }
        );
    }
  }, [currentView]);

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard />;
      case View.FORGE_CHAMBER: return <ForgeChamber />;
      case View.THOUGHT_STREAM: return <ThoughtStreamView />; 
      case View.JOURNAL: return <JournalView />;
      case View.META_JOURNAL: return <MetaJournalView />; 
      case View.MEMORY: return <MemoryView />;
      case View.TIMELINE: return <TimelineView />;
      case View.QUOTES: return <QuoteView />;
      case View.MOOD: return <MoodView />;
      case View.MANTRA: return <MantraView />; 
      case View.SOUNDTRACK: return <SoundtrackView />; 
      case View.INSIGHTS: return <InsightView />;
      case View.FORGE_LAB: return <ForgeLabView />; 
      case View.EPIC_SCENE_VAULT: return <EpicSceneVault />;
      case View.GOALS: return <GoalsView />;
      case View.HABITS: return <HabitsView />;
      case View.ROUTINES: return <RoutinesView />;
      case View.MILESTONES: return <MilestoneView />;
      case View.ACHIEVEMENTS: return <AchievementsView />;
      case View.IDENTITY: return <IdentityView />;
      case View.CONNECTION: return <ConnectionView />; 
      case View.PRESENCE: return <PresenceView />; 
      case View.ECHOES: return <EchoesView />;
      case View.WIKI: return <WikiView />; 
      case View.THEMES: return <LifeThemesView />;
      case View.SHADOW_WORK: return <ShadowWorkView />;
      case View.COMPASS: return <CompassView />;
      case View.ENERGY: return <EnergyView />;
      case View.WEEKLY_REVIEW: return <WeeklyReviewView />;
      case View.MONTHLY_REVIEW: return <MonthlyReviewView />;
      case View.YEARLY_REVIEW: return <YearlyReviewView />;
      case View.SETTINGS: return <SettingsView />;
      default:
        return (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <GlassCard className="max-w-md flex flex-col items-center p-12">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                 <Hammer className="text-gray-400" size={32} />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">Module Under Construction</h2>
              <p className="text-gray-400 mb-6">
                The {(currentView as string).toLowerCase().replace('_', ' ')} interface is currently being forged in the system core.
              </p>
              <button 
                onClick={() => navigateTo(View.DASHBOARD)}
                className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Return to Dashboard
              </button>
            </GlassCard>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen bg-forge-bg text-white overflow-hidden font-sans transition-colors duration-300">
      <div className="relative z-10 flex w-full h-full">
        <Sidebar currentView={currentView} onNavigate={navigateTo} />
        <main className="flex-1 h-full relative overflow-hidden flex flex-col">
            <div ref={mainContentRef} className="flex-1 overflow-hidden w-full h-full">
              {renderContent()}
            </div>
            
            {/* System Layers */}
            <NovaGuide currentView={currentView} />
            <GlobalPlayer />
            <NotificationOverlay />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    {/* These "Providers" now just trigger initial data loads via Redux dispatch */}
    <NotificationProvider>
      <EchoesProvider>
        <InsightProvider>
          <ThoughtStreamProvider>
            <SoundtrackProvider>
              <ForgeLabProvider>
                <EpicSceneProvider>
                  <AppContent />
                </EpicSceneProvider>
              </ForgeLabProvider>
            </SoundtrackProvider>
          </ThoughtStreamProvider>
        </InsightProvider>
      </EchoesProvider>
    </NotificationProvider>
  </Provider>
);

export default App;
