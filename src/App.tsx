/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pata de Perro Main Application Entry Point
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { OnboardingFlow } from './components/OnboardingFlow';
import { WelcomeAuthModal } from './components/WelcomeAuthModal';
import { ExploreView } from './components/ExploreView';
import { CategoriesView } from './components/CategoriesView';
import { MapView } from './components/MapView';
import { ARNavigationSim } from './components/ARNavigationSim';
import { ReservationsView } from './components/ReservationsView';
import { HostDashboard } from './components/HostDashboard';
import { ProfileView } from './components/ProfileView';
import { MessagesView } from './components/MessagesView';
import { HelpManualView } from './components/HelpManualView';
import { DevOptionsView } from './components/DevOptionsView';
import { SettingsView } from './components/SettingsView';
import { ExperienceDetailModal } from './components/ExperienceDetailModal';
import { BookingModal } from './components/BookingModal';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeScreen, toastMessage } = useApp();

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'onboarding':
        return <OnboardingFlow />;
      case 'welcome':
        return <WelcomeAuthModal />;
      case 'explore':
        return <ExploreView />;
      case 'categories':
        return <CategoriesView />;
      case 'map':
        return <MapView />;
      case 'ar_navigation':
        return <ARNavigationSim />;
      case 'reservations':
        return <ReservationsView />;
      case 'messages':
        return <MessagesView />;
      case 'profile':
        return <ProfileView />;
      case 'help':
        return <HelpManualView />;
      case 'settings':
        return <SettingsView />;
      case 'host_dashboard':
        return <HostDashboard />;
      case 'dev_options':
      case 'unit_tests':
      case 'tech_docs':
        return <DevOptionsView />;
      default:
        return <ExploreView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white flex flex-col">
      {/* Show header on all views except onboarding & full AR navigation */}
      {activeScreen !== 'onboarding' && activeScreen !== 'ar_navigation' && <Header />}

      {/* Main View Area */}
      <main className="flex-1">{renderActiveScreen()}</main>

      {/* Global Modals */}
      <ExperienceDetailModal />
      <BookingModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
