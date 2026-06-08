import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Trophy, Shield, HelpCircle, Lock, Gem, LogIn, ExternalLink, 
  Send, ArrowRight, Play, Heart, Star, CheckCircle, Menu, X, GraduationCap, 
  Compass, Award, BookOpen, Layers, MessageSquare, Briefcase, ChevronRight, LogOut, PhoneCall
} from 'lucide-react';
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
  const [menuOpen, setMenuOpen] = useState(false);
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

  const handleAuthSuccess = (userData: { id: string; name: string; surname: string; email: string; isPremium: boolean }) => {
    const updatedUser: User = {
      id: userData.id,
      name: userData.name,
      surname: userData.surname,
      email: userData.email,
      isLoggedIn: true,
      isPremium: userData.isPremium,
      usageLog: {}
    };
    setUser(updatedUser);
    localStorage.setItem('current_user', JSON.stringify({ ...updatedUser, isLoggedIn: true }));
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
    setMenuOpen(false);
  };

  const handleOpenPremium = () => {
    setShowPremiumModal(true);
  };

  const handleForcePremium = () => {
    const updatedUser = { ...user, isPremium: true };
    setUser(updatedUser);
    localStorage.setItem('current_user', JSON.stringify(updatedUser));
    setShowPremiumModal(false);
    alert("Tabriklaymiz! Premium obuna daxshatli cheksiz huquqlar bilan bepul faollashtirildi!");
    setMenuOpen(false);
  };

  const handleUpdateUsage = (toolKey: string) => {
    if (user.isPremium) return;
    const updatedLog = { ...user.usageLog, [toolKey]: new Date().toISOString() };
    const updatedUser = { ...user, usageLog: updatedLog };
    setUser(updatedUser);
    localStorage.setItem('current_user', JSON.stringify(updatedUser));
  };

  const navigationItems = [
    { id: 'all', label: 'Universitetlar Katalogi', desc: 'Real ma\'lumotlar va grant kvotalari', icon: GraduationCap },
    { id: 'courses', label: 'IELTS & SAT Kurslari', desc: 'Akademik tayyorgarlik maktabi', icon: BookOpen },
    { id: 'ai', label: '30 ta Daxshatli AI Funksiya', desc: 'Chet elga tayyorlov AI markazi', icon: Sparkles, badge: 'PRO' },
    { id: 'uz', label: '100% Grant Kalkulyatori', desc: 'Siz uchun unikal 20+ yechim', icon: Layers },
    { id: 'apply', label: 'Universitetlarga Topshirish', desc: 'Ariza topshirish va vizalar', icon: Compass }
  ];

  return (
    <div className="min-h-screen bg-[#030510] text-[#f8fafc] font-sans flex flex-col justify-between selection:bg-cyan-500/30 selection:text-white overflow-x-hidden relative" id="main-root">
      
      {/* Dynamic Ambient Cyberlight Effects (Cyan & Blue Glow) */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[150px] left-[15%] w-[400px] h-[400px] rounded-full bg-blue-600/15 blur-[120px] animate-pulse"></div>
        <div className="absolute -top-[200px] right-[10%] w-[500px] h-[500px] rounded-full bg-cyan-505/10 blur-[130px]" style={{ backgroundColor: 'rgba(6, 182, 212, 0.08)' }}></div>
      </div>

      {/* GLOBAL TRANSLUCENT TOP HEADER (With Menu Icon On Left) */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#030510]/80 backdrop-blur-md px-4 md:px-8 py-3.5 flex items-center justify-between">
        
        {/* Left hamburger + branded title */}
        <div className="flex items-center gap-3.5">
          <button 
            onClick={() => setMenuOpen(true)}
            className="p-2 mr-1 rounded-xl bg-white/5 hover:bg-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white/20 active:scale-95 transition cursor-pointer"
            title="Kanal va Bo'limlar Menyusi"
            id="btn-global-hamburger"
          >
            <Menu className="h-5.5 w-5.5 text-cyan-300" />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-lg p-1.5 border border-white/10">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base font-black tracking-wider bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                TopGrand Central v3.0
              </span>
              <p className="text-[9px] font-mono tracking-widest text-cyan-400/80 uppercase">AI Ecosystem</p>
            </div>
          </div>
        </div>

        {/* Center: Quick navigation links (Desktop only) */}
        <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-1 backdrop-blur-md">
          {navigationItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition ${
                activeTab === item.id
                  ? 'bg-[#00d2ff]/20 text-white border border-[#00d2ff]/30 shadow-lg'
                  : 'text-blue-200 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right side status options (Telegram link + auth button) */}
        <div className="flex items-center gap-3">
          {/* Telegram Channel Link with beautiful ping animation */}
          <a
            href="https://t.me/TopGrands"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center gap-1.5 bg-[#0088cc]/15 border border-[#0088cc]/30 hover:border-[#0088cc]/60 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition"
            id="header-tg-link"
          >
            <Send className="h-3.5 w-3.5 text-[#0088cc] fill-[#0088cc]" />
            <span className="hidden md:inline">@TopGrands Rasmiy</span>
            <span className="inline md:hidden">@TopGrands</span>
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </a>

          {/* Login or User status info */}
          {user.isLoggedIn ? (
            <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5" id="user-top-info">
              <span className="text-[10px] text-cyan-300 font-bold max-w-[85px] truncate hidden sm:inline-block">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="p-1 hover:text-red-400 text-blue-300 transition cursor-pointer"
                title="Chiqish"
                id="btn-logout-top"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleOpenAuth('login')}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 px-3.5 py-1.5 text-xs font-bold text-white transition active:scale-95 cursor-pointer"
              id="btn-login-top"
            >
              <LogIn className="h-3.5 w-3.5 text-cyan-400" />
              <span>Kirish</span>
            </button>
          )}
        </div>
      </header>

      {/* LEFT NAVIGATION SLIDING DRAWER MENU */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop black overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-slate-950"
            />

            {/* Translucent drawer container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-[310px] bg-[#060a1e]/95 backdrop-blur-2xl border-r border-white/10 h-full flex flex-col justify-between p-6 z-10 text-white"
            >
              <div>
                {/* Header of drawer */}
                <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-cyan-400" />
                    <span className="font-extrabold text-base tracking-wide text-white">TopGrand Menyu</span>
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-blue-200 transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Telegram info badge */}
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20">
                  <span className="text-[9px] font-black tracking-widest text-cyan-400 uppercase block mb-1">Rasmiy Telegram Kanal</span>
                  <a 
                    href="https://t.me/TopGrands" 
                    target="_blank" 
                    rel="noreferrer noopener"
                    className="flex items-center justify-between text-xs font-bold text-white hover:text-cyan-300"
                  >
                    <span>@TopGrands platformasi</span>
                    <ExternalLink className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                  </a>
                </div>

                {/* List of sections with description */}
                <div className="space-y-2">
                  <p className="text-[10px] font-mono tracking-widest text-blue-200/40 uppercase font-black px-2 pb-1">
                    Bo'limlar va Modullar
                  </p>
                  
                  {navigationItems.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMenuOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-2xl transition border flex items-center gap-3.5 cursor-pointer group ${
                          activeTab === item.id
                            ? 'bg-gradient-to-r from-blue-900/40 to-cyan-500/20 text-white border-cyan-400/35'
                            : 'bg-transparent text-blue-200 border-transparent hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className={`p-2 rounded-xl border ${
                          activeTab === item.id 
                            ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300' 
                            : 'bg-white/5 border-white/5 text-blue-300 group-hover:bg-white/10 group-hover:text-cyan-400'
                        }`}>
                          <IconComp className="h-4.5 w-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate leading-snug">
                            {item.label}
                          </p>
                          <p className="text-[10px] text-blue-300/40 truncate mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                        {item.badge && (
                          <span className="text-[8px] font-black tracking-widest text-[#d97706] bg-amber-500/10 border border-amber-400/25 px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom drawer elements */}
              <div className="pt-6 border-t border-white/5 text-center space-y-3.5">
                {user.isLoggedIn ? (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left">
                    <span className="text-[9px] font-bold text-blue-300 uppercase block">Hisobingiz:</span>
                    <span className="text-xs font-extrabold text-white truncate block mt-1">
                      {user.name} {user.surname}
                    </span>
                    <span className="text-[10px] text-cyan-400 mt-1 block font-mono font-semibold">
                      {user.isPremium ? '💎 Premium active' : '🎁 Bepul versiya'}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="mt-3.5 w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 transition cursor-pointer"
                    >
                      Menyudan Chiqish
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleOpenAuth('login');
                    }}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-lg"
                  >
                    Hisobga Kirish
                  </button>
                )}

                {/* Help numbers */}
                <div className="text-[10px] text-blue-300/40 font-semibold font-mono">
                  TopGrand Tech Support Team.
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-grow pb-16 relative z-10">
        
        {/* HERO HEADER AREA (STARS CONSTELLATION) */}
        <Hero 
          user={user} 
          onOpenAuth={() => handleOpenAuth('login')}
          onLogout={handleLogout}
          onOpenPremium={handleOpenPremium}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'all') setActiveTab('all');
            else if (tab === 'Chet elga Tayyorlov (AI)' || tab === 'ai') setActiveTab('ai');
            else if (tab === 'Grand Kalkulyatori' || tab === 'uz') setActiveTab('uz');
            else setActiveTab('apply');
          }}
        />

        {/* GLASSMORPHIC EXTRA NAVIGATION RAIL (No Whites) */}
        <div className="w-full max-w-7xl mx-auto px-6 py-2 flex flex-wrap items-center justify-center gap-3">
          {navigationItems.map((nav) => (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition duration-200 border cursor-pointer ${
                activeTab === nav.id
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-400/35 shadow-lg shadow-cyan-500/5 backdrop-blur-md ring-2 ring-cyan-400/20 font-extrabold'
                  : 'text-blue-200/70 hover:text-white hover:bg-white/5 border-transparent bg-transparent font-semibold'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </div>

        {/* ACTIVE TAB VIEWS SEGMENTATION */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
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

      {/* FOOTER - DARK ATMOSPHERIC NO WRITING DECOR */}
      <footer className="relative z-10 w-full bg-[#02040b] border-t border-white/5 px-8 py-5 text-white flex flex-col sm:flex-row justify-between items-center text-xs font-semibold gap-3">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-white text-sm tracking-wider">TOPGRAND™</span>
          <span className="text-blue-300/40 font-normal">| Global Oliy Ta'lim & Sun'iy Intellekt Platformasi © 2026</span>
        </div>
        <div className="flex gap-4 items-center font-mono text-[10px] text-blue-200/40 font-bold uppercase">
          <span>SOP CHECK AI: ACTIVE</span>
          <span>VISA COPILOT: ONLINE</span>
          <a href="https://t.me/TopGrands" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition">@TopGrands Kanal</a>
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

      {/* PREMIUM SUBSCRIPTION MODAL */}
      <AnimatePresence>
        {showPremiumModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#060a1e]/90 p-8 shadow-2xl backdrop-blur-xl text-center text-white"
            >
              <button
                onClick={() => setShowPremiumModal(false)}
                className="absolute top-4 right-4 text-blue-200 hover:text-white hover:bg-white/10 p-1.5 rounded-full cursor-pointer"
                id="btn-close-premium"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 p-3 shadow-lg shadow-yellow-500/20 border border-white/10">
                <Gem className="h-8 w-8 text-white animate-pulse" />
              </div>

              <h2 className="mt-4 text-2xl font-black text-white">TopGrand Premium 🏆</h2>
              <p className="mt-1 text-xs text-yellow-500 font-bold uppercase tracking-wider">Tez orada Obunalar O'tadi</p>

              <div className="my-6 rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3.5 text-left text-xs text-blue-100">
                <p className="text-xs font-bold text-white text-center uppercase tracking-widest text-cyan-300">Premium cheksiz imkoniyatlari:</p>
                <div className="space-y-2 font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span>Real 30 ta sun'iy intellekt modullaridan cheksiz so'rovlar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span>Universitet daxshatli intervyu simulyatorlarini to'liq ochish</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span>Xorijiy huquq va vizaviy maslahatlar bo'limlari</span>
                  </div>
                </div>
              </div>

              {/* Sandbox action list */}
              <div className="space-y-3">
                <button
                  onClick={() => alert("Premium to'lov imkoniyati integratsiya jarayonida. Quyidagi bepul sinov tugmasisiz hozircha unumli foydalaning.")}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:brightness-110 active:scale-95 transition font-bold text-xs uppercase tracking-wider text-black shadow-lg"
                >
                  Premium Obunani Xarid qilish
                </button>

                <button
                  onClick={handleForcePremium}
                  className="w-full py-2.5 rounded-xl border border-dashed border-cyan-450/40 bg-cyan-400/5 hover:bg-cyan-400/15 transition text-xs font-bold text-cyan-300 cursor-pointer"
                >
                  ⚡ Sinov Rejimi: Premium-ni Bepul yoqish (Unlock!)
                </button>
              </div>

              <button
                onClick={() => setShowPremiumModal(false)}
                className="mt-4 text-xs text-blue-300 hover:text-white"
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
