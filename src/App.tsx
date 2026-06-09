import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Trophy, Shield, HelpCircle, Lock, Gem, LogIn, ExternalLink, 
  Send, ArrowRight, ArrowLeft, Play, Heart, Star, CheckCircle, Menu, X, GraduationCap, 
  Compass, Award, BookOpen, Layers, MessageSquare, Briefcase, ChevronRight, LogOut, PhoneCall, Home
} from 'lucide-react';
import { User } from './types';
import Hero from './components/Hero';
import UniversityExplorer from './components/UniversityExplorer';
import GrantCalculator from './components/GrantCalculator';
import CoursePrepSection from './components/CoursePrepSection';
import ApplyUniversitySection from './components/ApplyUniversitySection';
import AIPrepCenter from './components/AIPrepCenter';
import AuthModal from './components/AuthModal';
import HomeSection from './components/HomeSection';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // home, all, courses, ai, uz, apply
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
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

  // Local storage session retrieval
  useEffect(() => {
    try {
      const stored = localStorage.getItem('current_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Mangled session storage, clearing state:", e);
      localStorage.removeItem('current_user');
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
    { id: 'home', label: 'Bosh Sahifa', desc: 'Platforma haqida batafsil va ko\'rsatmalar', icon: Home },
    { id: 'all', label: 'Universitetlar Katalogi', desc: 'Real ma\'lumotlar va grant kvotalari', icon: GraduationCap },
    { id: 'courses', label: 'IELTS & SAT Kurslari', desc: 'Akademik tayyorgarlik maktabi', icon: BookOpen },
    { id: 'ai', label: '30 ta Daxshatli AI Funksiya', desc: 'Chet elga tayyorlov AI markazi', icon: Sparkles, badge: 'PRO' },
    { id: 'uz', label: '100% Grant Kalkulyatori', desc: 'Siz uchun unikal 20+ yechim', icon: Layers },
    { id: 'apply', label: 'Universitetlarga Topshirish', desc: 'Ariza topshirish va vizalar', icon: Compass }
  ];

  return (
    <div className="min-h-screen bg-[#f0f9ff] text-slate-900 font-sans flex flex-col justify-between selection:bg-sky-500/20 selection:text-slate-900 overflow-x-hidden relative" id="main-root">
      
      {/* Dynamic Ambient Cyberlight Effects (Cyan & Blue Glow) */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[150px] left-[15%] w-[400px] h-[400px] rounded-full bg-blue-300/10 blur-[120px] animate-pulse"></div>
        <div className="absolute -top-[200px] right-[10%] w-[500px] h-[500px] rounded-full bg-cyan-300/10 blur-[130px]"></div>
      </div>

      {/* GLOBAL TRANSLUCENT TOP HEADER (With Menu Icon On Left) */}
      {!isFullScreenOpen && (
        <header className="sticky top-0 z-40 w-full border-b border-sky-100 bg-white/85 backdrop-blur-md px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
          
          {/* Left hamburger + branded title */}
          <div className="flex items-center gap-3.5">
            <button 
              onClick={() => setMenuOpen(true)}
              className="p-2 mr-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 focus:outline-none focus:ring-1 focus:ring-sky-200 active:scale-95 transition cursor-pointer"
              title="Kanal va Bo'limlar Menyusi"
              id="btn-global-hamburger"
            >
              <Menu className="h-5.5 w-5.5 text-sky-600" />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-400 to-blue-500 shadow-lg p-1.5 border border-sky-200">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-base font-black tracking-wider bg-gradient-to-r from-slate-900 to-sky-950 bg-clip-text text-transparent">
                  TopGrand Central v3.0
                </span>
                <p className="text-[9px] font-mono tracking-widest text-sky-600 font-bold uppercase">AI Ecosystem</p>
              </div>
            </div>
          </div>

          {/* Center menu removed completely as requested to keep layout ultra-clean and iPhone 16/17 optimized */}

          {/* Right side status options (Telegram link + auth button) */}
          <div className="flex items-center gap-3">
            {/* Telegram Channel Link with beautiful ping animation */}
            <a
              href="https://t.me/TopGrands"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center gap-1.5 bg-[#0088cc]/10 border border-[#0088cc]/25 hover:border-[#0088cc]/50 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#0088cc] shadow-sm active:scale-95 transition"
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
              <div className="flex items-center gap-2 rounded-xl bg-sky-50 border border-sky-100 px-3 py-1.5" id="user-top-info">
                <span className="text-[10px] text-sky-800 font-bold max-w-[85px] truncate hidden sm:inline-block">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-1 hover:text-red-500 text-slate-500 transition cursor-pointer"
                  title="Chiqish"
                  id="btn-logout-top"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleOpenAuth('login')}
                className="flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 border border-sky-500/30 px-3.5 py-1.5 text-xs font-bold text-white transition active:scale-95 cursor-pointer"
                id="btn-login-top"
              >
                <LogIn className="h-3.5 w-3.5 text-white" />
                <span>Kirish</span>
              </button>
            )}
          </div>
        </header>
      )}

      {/* BOTTOM PHONE-OPTIMIZED SLIDING SHEET DRAWER MENU */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:justify-start">
            {/* Backdrop translucent overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            {/* Translucent bottom-sheet container optimized for iPhone 16/17 */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="relative w-full max-w-lg md:max-w-[325px] bg-white/98 backdrop-blur-2xl border border-sky-100 md:border-r h-[88vh] md:h-[calc(100vh-2rem)] md:m-4 rounded-t-[2.5rem] md:rounded-[2rem] flex flex-col justify-between p-6 pb-8 z-10 text-slate-900 shadow-2xl overflow-y-auto scrollbar-none focus:outline-none"
            >
              <div>
                {/* iPhone drag handle bar indicator */}
                <div className="w-14 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 shrink-0 block md:hidden" />

                {/* Header of drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5 font-sans">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-sky-600 animate-pulse" />
                    <span className="font-extrabold text-base tracking-wide text-slate-900">TopGrand Menyu</span>
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Telegram info badge */}
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-sky-400/10 to-blue-500/5 border border-sky-100">
                  <span className="text-[9px] font-black tracking-widest text-sky-700 uppercase block mb-1">Rasmiy Telegram Kanal</span>
                  <a 
                    href="https://t.me/TopGrands" 
                    target="_blank" 
                    rel="noreferrer noopener"
                    className="flex items-center justify-between text-xs font-bold text-slate-900 hover:text-sky-600 transition"
                  >
                    <span>@TopGrands platformasi</span>
                    <ExternalLink className="h-3.5 w-3.5 text-sky-600" />
                  </a>
                </div>

                {/* List of sections with description */}
                <div className="space-y-2">
                  <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-black px-2 pb-1">
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
                          setIsFullScreenOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-2xl transition border flex items-center gap-3.5 cursor-pointer group ${
                          activeTab === item.id
                            ? 'bg-sky-50 text-sky-900 border-sky-200/50 font-extrabold'
                            : 'bg-transparent text-slate-700 border-transparent hover:bg-slate-50 hover:text-slate-950 font-semibold'
                        }`}
                      >
                        <div className={`p-2 rounded-xl border ${
                          activeTab === item.id 
                            ? 'bg-sky-500 border-sky-400 text-white' 
                            : 'bg-slate-100 border-slate-150 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-750'
                        }`}>
                          <IconComp className="h-4.5 w-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate leading-snug">
                            {item.label}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5 font-light">
                            {item.desc}
                          </p>
                        </div>
                        {item.badge && (
                          <span className="text-[8px] font-black tracking-widest text-[#b45309] bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom drawer elements */}
              <div className="pt-6 border-t border-slate-100 text-center space-y-3.5">
                {user.isLoggedIn ? (
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-left">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Hisobingiz:</span>
                    <span className="text-xs font-extrabold text-slate-900 truncate block mt-1">
                      {user.name} {user.surname}
                    </span>
                    <span className="text-[10px] text-sky-600 mt-1 block font-mono font-semibold">
                      {user.isPremium ? '💎 Premium active' : '🎁 Bepul versiya'}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="mt-3.5 w-full py-2 bg-red-50 hover:bg-red-100 text-red-650 text-xs font-bold rounded-xl border border-red-200 transition cursor-pointer"
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
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-sky-500 hover:brightness-110 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-lg shadow-sky-550/10"
                  >
                    Hisobga Kirish
                  </button>
                )}

                {/* Help numbers */}
                <div className="text-[10px] text-slate-400 font-semibold font-mono">
                  TopGrand Tech Support Team.
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-grow pb-16 relative z-10">
        
        {/* HERO HEADER AREA (STARS CONSTELLATION) - ONLY ON HOME TAB AS MANDATED */}
        {activeTab === 'home' && (
          <Hero 
            user={user} 
            onOpenAuth={() => handleOpenAuth('login')}
            onLogout={handleLogout}
            onOpenPremium={handleOpenPremium}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

        {/* ACTIVE TAB VIEWS SEGMENTATION */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 'home' && (
                <HomeSection 
                  user={user}
                  onOpenAuth={() => handleOpenAuth('login')}
                  onOpenPremium={handleOpenPremium}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'all' && (
                <UniversityExplorer 
                  user={user} 
                  onOpenPremium={handleOpenPremium} 
                  onToggleFullScreen={setIsFullScreenOpen}
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
                  onToggleFullScreen={setIsFullScreenOpen}
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

      {/* FOOTER - LIGHT ELEGANT NO WRITING DECOR */}
      <footer className="relative z-10 w-full bg-white border-t border-sky-100 px-8 py-5 text-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs font-semibold gap-3 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-900 text-sm tracking-wider">TOPGRAND™</span>
          <span className="text-slate-500 font-normal">| Global Oliy Ta'lim & Sun'iy Intellekt Platformasi © 2026</span>
        </div>
        <div className="flex gap-4 items-center font-mono text-[10px] text-slate-500 font-bold uppercase">
          <span>SOP CHECK AI: ACTIVE</span>
          <span>VISA COPILOT: ONLINE</span>
          <a href="https://t.me/TopGrands" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700 transition">@TopGrands Kanal</a>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-sky-100 bg-white p-8 shadow-2xl backdrop-blur-xl text-center text-slate-900"
            >
              <button
                onClick={() => setShowPremiumModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full cursor-pointer transition-colors"
                id="btn-close-premium"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 p-3 shadow-lg shadow-yellow-500/20 border border-sky-100">
                <Gem className="h-8 w-8 text-white animate-pulse" />
              </div>

              <h2 className="mt-4 text-2xl font-black text-slate-900">TopGrand Premium 🏆</h2>
              <p className="mt-1 text-xs text-yellow-600 font-bold uppercase tracking-wider">Tez orada Obunalar O'tadi</p>

              <div className="my-6 rounded-2xl bg-sky-50/50 border border-sky-100 p-5 space-y-3.5 text-left text-xs text-slate-700">
                <p className="text-xs font-bold text-slate-900 text-center uppercase tracking-widest text-sky-700">Premium cheksiz imkoniyatlari:</p>
                <div className="space-y-2 font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>Real 30 ta sun'iy intellekt modullaridan cheksiz so'rovlar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>Universitet daxshatli intervyu simulyatorlarini to'liq ochish</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>Xorijiy huquq va vizaviy maslahatlar bo'limlari</span>
                  </div>
                </div>
              </div>

              {/* Premium acquisition list */}
              <div className="space-y-3">
                <button
                  onClick={() => alert("Premium to'lov integratsiyasi faollashtirilmoqda! Iltimos, administrator bilan bog'laning.")}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:brightness-110 active:scale-[0.98] transition font-bold text-xs uppercase tracking-wider text-black shadow-lg cursor-pointer"
                >
                  Premium Obunani Xarid qilish
                </button>
              </div>

              <button
                onClick={() => setShowPremiumModal(false)}
                className="mt-4 text-xs text-slate-500 hover:text-slate-800 transition"
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
