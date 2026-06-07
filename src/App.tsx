import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Shield, HelpCircle, Lock, Gem, LogIn, ExternalLink, Send, ArrowRight, Play, Heart, Star, CheckCircle } from 'lucide-react';
import { User } from './types';
import Hero from './components/Hero';
import UniversityExplorer from './components/UniversityExplorer';
import GrantCalculator from './components/GrantCalculator';
import CoursePrepSection from './components/CoursePrepSection';
import ApplyUniversitySection from './components/ApplyUniversitySection';
import AIPrepCenter from './components/AIPrepCenter';
import AuthModal from './components/AuthModal';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('all'); // all, courses, ai, uz, apply
  const [user, setUser] = useState<User>({
    id: '',
    name: '',
    surname: '',
    email: '',
    isLoggedIn: false,
    isPremium: false,
    usageLog: {}
  });

  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' as 'login' | 'register' });
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Local storage session retrieval
  useEffect(() => {
    const stored = localStorage.getItem('current_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleAuthSuccess = (userData: { name: string; surname: string; email: string }) => {
    const updatedUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      surname: userData.surname,
      email: userData.email,
      isLoggedIn: true,
      isPremium: false,
      usageLog: {}
    };
    setUser(updatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    setUser({
      id: '',
      name: '',
      surname: '',
      email: '',
      isLoggedIn: false,
      isPremium: false,
      usageLog: {}
    });
  };

  const handleOpenPremium = () => {
    setShowPremiumModal(true);
  };

  const handleForcePremium = () => {
    // Let user activate premium instantly for mock testing to make sure they can experience unlimited access!
    const updatedUser = { ...user, isPremium: true };
    setUser(updatedUser);
    localStorage.setItem('current_user', JSON.stringify(updatedUser));
    // Also save in user db
    if (user.email) {
      localStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser));
    }
    setShowPremiumModal(false);
    alert("Tabriklaymiz! Premium obuna cheksiz huquqlar bilan bepul faollashtirildi (Simulatsiya)!");
  };

  const handleUpdateUsage = (toolKey: string) => {
    if (user.isPremium) return; // Premium user bypasses completely
    
    const updatedLog = { ...user.usageLog, [toolKey]: new Date().toISOString() };
    const updatedUser = { ...user, usageLog: updatedLog };
    setUser(updatedUser);
    localStorage.setItem('current_user', JSON.stringify(updatedUser));
    if (user.email) {
      localStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser));
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff] text-slate-800 font-sans flex flex-col justify-between selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden" id="main-root">
      
      {/* Animated Background Elements - SaaS Themes */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-sky-100/60 rounded-full blur-[80px]"></div>
      </div>

      <main className="flex-grow pb-16 relative z-10">
        {/* HERO HEADER AREA */}
        <Hero 
          user={user} 
          onOpenAuth={() => handleOpenAuth('login')}
          onLogout={handleLogout}
          onOpenPremium={handleOpenPremium}
          activeTab={activeTab === 'all' ? 'all' : activeTab === 'courses' ? 'courses' : activeTab === 'ai' ? 'ai' : activeTab === 'uz' ? 'uz' : 'apply'}
          setActiveTab={(tab) => {
            if (tab === 'all') setActiveTab('all');
            else if (tab === 'Chet elga Tayyorlov (AI)' || tab === 'ai') setActiveTab('ai');
            else if (tab === 'Grand Kalkulyatori' || tab === 'uz') setActiveTab('uz');
            else setActiveTab('apply');
          }}
        />

        {/* EXTRA NAVIGATION RAIL WITH GLASSMORPHIC THEME */}
        <div className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-wrap items-center justify-center gap-3">
          {[
            { id: 'all', label: 'Universitetlar Katalogi & Qaynoq Takliflar' },
            { id: 'courses', label: 'IELTS & SAT Kurslari' },
            { id: 'ai', label: 'Chet elga tayyorlov (AI Hub - 14 modullar!)' },
            { id: 'uz', label: '100% Grant Kalkulyatori (20+ Tavsiya!)' },
            { id: 'apply', label: 'Universitetlarga Topshirish' }
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition duration-200 border cursor-pointer ${
                activeTab === nav.id
                  ? 'bg-white/80 text-blue-700 border-white/60 shadow-lg shadow-blue-500/10 backdrop-blur-md ring-2 ring-blue-400/35 font-extrabold'
                  : 'text-blue-900/75 hover:text-blue-600 hover:bg-white/40 border-transparent bg-white/0 font-semibold'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </div>

        {/* ACTIVE TAB VIEWS SEGMENTATION */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'all' && (
                <UniversityExplorer 
                  user={user} 
                  onOpenPremium={handleOpenPremium} 
                />
              )}

              {activeTab === 'courses' && (
                <CoursePrepSection />
              )}

              {activeTab === 'ai' && (
                <AIPrepCenter 
                  user={user} 
                  onOpenAuth={() => handleOpenAuth('register')} 
                  onOpenPremium={handleOpenPremium}
                  onUpdateUsage={handleUpdateUsage}
                />
              )}

              {activeTab === 'uz' && (
                <GrantCalculator />
              )}

              {activeTab === 'apply' && (
                <ApplyUniversitySection />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 w-full bg-blue-900 border-t border-blue-950 px-8 py-4 text-white flex flex-col sm:flex-row justify-between items-center text-xs font-semibold gap-3">
        <div className="flex items-center gap-2">
          <span className="font-black text-white text-sm tracking-wider">TOPGRAND</span>
          <span className="opacity-75">| Global Oliy Ta'lim & Sun'iy Intellekt Platformasi © 2026</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="opacity-75">Viza Ko'mak AI: Online</span>
          <span className="opacity-75 font-mono text-cyan-300">SOP Check AI: Active</span>
          <span className="text-cyan-300 font-bold">Update in 48h</span>
        </div>
      </footer>

      {/* AUTHENTICATION GATE MODAL */}
      <AnimatePresence>
        {authModal.isOpen && (
          <AuthModal 
            isOpen={authModal.isOpen} 
            onClose={() => setAuthModal({ ...authModal, isOpen: false })}
            onSuccess={handleAuthSuccess}
            initialMode={authModal.mode}
          />
        )}
      </AnimatePresence>

      {/* PREMIUM SUBSCRIPTION MODAL (TEZ ORADA / DEMO BYPASS) */}
      <AnimatePresence>
        {showPremiumModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/45 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-white/20 bg-blue-950/90 p-8 shadow-2xl backdrop-blur-xl text-center text-white"
            >
              <button
                onClick={() => setShowPremiumModal(false)}
                className="absolute top-4 right-4 text-blue-200 hover:text-white hover:bg-white/10 p-1.5 rounded-full"
                id="btn-close-premium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-600 p-3 shadow-lg shadow-yellow-500/20">
                <Gem className="h-8 w-8 text-white animate-pulse" />
              </div>

              <h2 className="mt-4 text-2xl font-black text-white">TopGrand Premium</h2>
              <p className="mt-2 text-xs text-yellow-400 font-bold uppercase tracking-wider">Tez orada / Coming Soon</p>

              <div className="my-6 rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3.5 text-left text-xs">
                <p className="text-sm font-semibold text-white text-center">Premium qatlam bilan cheksiz huquqlar:</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                    <span>Hamma 20+ Premium universitet hisobotlariga to'liq kirish</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                    <span>Daxshatli 14 ta AI metodistlaridan 24soatlik cheklovsiz foydalanish</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                    <span>Tez orada ochiladigan barcha IELTS & SAT onlayn video darsliklari</span>
                  </div>
                </div>
              </div>

              {/* Action grid (Tez orada alert + Sandbox override button) */}
              <div className="space-y-3">
                <button
                  onClick={() => alert("Tez orada! Premium obuna tizimi integratsiyalashmoqda. Hozircha sinov rejimida bepul kiring.")}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-600 hover:brightness-110 active:scale-95 transition font-bold text-white shadow-lg shadow-yellow-500/20"
                >
                  Premium Obuna Bo'lish
                </button>

                <button
                  onClick={handleForcePremium}
                  className="w-full py-2.5 rounded-xl border border-dashed border-cyan-400/40 hover:bg-cyan-400/10 transition text-xs font-semibold text-cyan-300"
                >
                  ⚡ Sinov uchun Premium ruxsatni faollashtirish (Tekin!)
                </button>
              </div>

              <button
                onClick={() => setShowPremiumModal(false)}
                className="mt-3.5 text-xs text-blue-300 hover:text-white"
              >
                Orqaga qaytish
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
