
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ForgeChamber } from './components/ForgeChamber';
import { JournalView } from './components/JournalView';
import { MemoryView } from './components/MemoryView';
import { TimelineView } from './components/TimelineView';
import { QuoteView } from './components/QuoteView';
import { MoodView } from './components/MoodView';
import { InsightView } from './components/InsightView';
import { IdeasView } from './components/IdeasView';
import { GoalsView } from './components/GoalsView';
import { HabitsView } from './components/HabitsView';
import { RoutinesView } from './components/RoutinesView';
import { MilestoneView } from './components/MilestoneView';
import { EnergyView } from './components/EnergyView';
import { WeeklyReviewView } from './components/WeeklyReviewView';
import { MonthlyReviewView } from './components/MonthlyReviewView';
import { View } from './types';
import { GlassCard } from './components/GlassCard';
import { Hammer } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.FORGE_CHAMBER:
        return <ForgeChamber />;
      case View.JOURNAL:
        return <JournalView />;
      case View.MEMORY:
        return <MemoryView />;
      case View.TIMELINE:
        return <TimelineView />;
      case View.QUOTES:
        return <QuoteView />;
      case View.MOOD:
        return <MoodView />;
      case View.INSIGHTS:
        return <InsightView />;
      case View.IDEAS:
        return <IdeasView />;
      case View.GOALS:
        return <GoalsView />;
      case View.HABITS:
        return <HabitsView />;
      case View.ROUTINES:
        return <RoutinesView />;
      case View.MILESTONES:
        return <MilestoneView />;
      case View.ENERGY:
        return <EnergyView />;
      case View.WEEKLY_REVIEW:
        return <WeeklyReviewView />;
      case View.MONTHLY_REVIEW:
        return <MonthlyReviewView />;
      default:
        return (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <GlassCard className="max-w-md flex flex-col items-center p-12">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                 <Hammer className="text-gray-400" size={32} />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">Module Under Construction</h2>
              <p className="text-gray-400 mb-6">
                The {currentView.toLowerCase().replace('_', ' ')} interface is currently being forged in the system core.
              </p>
              <button 
                onClick={() => setCurrentView(View.DASHBOARD)}
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
    <div className="flex h-screen w-screen bg-forge-bg text-white overflow-hidden selection:bg-forge-accent selection:text-white font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#09090b] to-[#050505]">
      
      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-forge-accent/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-forge-cyan/5 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 pointer-events-none z-0" />

      {/* Layout Container */}
      <div className="relative z-10 flex w-full h-full">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />
        
        <main className="flex-1 h-full relative overflow-hidden flex flex-col">
           <div className="flex-1 overflow-hidden">
             {renderContent()}
           </div>
        </main>
      </div>
    </div>
  );
};

export default App;
