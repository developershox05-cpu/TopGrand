import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Trophy, Globe, GraduationCap, ArrowRight, Star, Send, Handshake, ShieldCheck, UserCheck, LogOut, LogIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';

interface HeroProps {
  user: User;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenPremium: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Hero({ user, onOpenAuth, onLogout, onOpenPremium, activeTab, setActiveTab }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  // Starlight background particle effect simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = 420);

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
      alpha: number;
      decay: number;
    }> = [];

    // Create initial nodes
    const colors = ['rgba(147, 197, 253, ', 'rgba(56, 189, 248, ', 'rgba(255, 255, 255, '];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.3,
        decay: Math.random() * 0.01 + 0.002
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = 420;
    };

    window.addEventListener('resize', handleResize);

    const update = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw gradient atmospheric lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 80) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 150, height);
        ctx.stroke();
      }

      // Render and connect stars (constellation design)
      particles.forEach((p, idx) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();

        // Connect near nodes
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / 100) * 0.12})`;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-b-[2.5rem] border-b border-sky-200 bg-gradient-to-r from-blue-800 to-indigo-900 p-1 text-white shadow-xl mb-6">
      {/* Background Animated Scenery Simulation */}
      <div className="absolute inset-0 z-0 opacity-40">
        <canvas ref={canvasRef} className="h-full w-full object-cover" />
      </div>

      {/* Atmospheric Soft Light Flares */}
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-500/25 blur-[120px]" />
      <div className="absolute right-10 -bottom-10 h-80 w-80 rounded-full bg-cyan-400/20 blur-[130px]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 md:py-10">

        {/* HERO HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md">
              <Globe className="h-4 w-4 animate-spin-slow" />
              <span>100% Shaffof va To'g'ridan-to'g'ri Topshirish</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Konsaltinglarsiz <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-200 to-white bg-clip-text text-transparent">
                Jahon Universitetlariga
              </span> <br />
              Bevosita Topshiring!
            </h1>

            <p className="text-sm md:text-base text-blue-100 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Konsalting firmalarining daxshatli katta to'lovlarisiz, butun dunyo oliygohlari hujjatlar ro'yxatini real vaqtda oling va shaxsan mustaqil topshiring. Sun'iy intellekt (AI) yordamida insholarni daxshat darajada bexato tekshiring hamda testlarga tayyorlaning.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => setActiveTab('ai')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:brightness-110 active:scale-[0.98] transition px-8 py-4 font-bold text-white shadow-xl shadow-cyan-500/20"
                id="btn-cta-explore"
              >
                AI Tayyorlovni Boshlash
                <ArrowRight className="h-5 w-5 text-white" />
              </button>

              <button
                onClick={() => setShowPartnerModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 active:scale-[0.98] transition px-7 py-4 font-bold text-white backdrop-blur-md"
                id="btn-partner-hero"
              >
                <span>Xususiy Oliygohingiz bormi?</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 max-w-md mx-auto lg:mx-0">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md text-center lg:text-left">
                <span className="block text-xl md:text-2xl font-extrabold text-cyan-300">20+</span>
                <span className="text-[10px] text-blue-200 uppercase tracking-widest leading-3 block mt-0.5">Top Davlatlar</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md text-center lg:text-left">
                <span className="block text-xl md:text-2xl font-extrabold text-cyan-300">30+</span>
                <span className="text-[10px] text-blue-200 uppercase tracking-widest leading-3 block mt-0.5">Daxshat AI Modul</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md text-center lg:text-left">
                <span className="block text-xl md:text-2xl font-extrabold text-cyan-300">Free</span>
                <span className="text-[10px] text-blue-200 uppercase tracking-widest leading-3 block mt-0.5">Konsalting 0$</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center">
            {/* Visual Decorative Card depicting TopGrand admission letter */}
            <motion.div
              initial={{ rotate: -2, y: 10 }}
              animate={{ rotate: 1, y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-full max-w-[340px] rounded-[2rem] border border-white/25 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"
            >
              {/* Top accent badge */}
              <div className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 text-blue-950 font-bold shadow-lg shadow-cyan-400/35">
                <Trophy className="h-5 w-5" />
              </div>

              {/* Card visual elements */}
              <div className="flex items-center gap-2 text-cyan-300 font-mono text-[10px] uppercase tracking-widest font-bold">
                <Sparkles className="h-4 w-4" />
                <span>Admission Decision</span>
              </div>

              <h3 className="text-xl font-black text-white mt-1.5 leading-tight">Muvaffaqiyatli Qabul!</h3>
              <p className="text-xs text-blue-200 mt-2 font-light">Siz dunyoning eng nufuzli top-universiteti a'zosi bo'ldingiz. Konsalting burchidan ozod etildingiz.</p>

              <div className="mt-4 space-y-2 border-t border-white/10 pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-blue-300">Universitet:</span>
                  <span className="font-semibold text-white">MIT / Stanford / Oxford</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">Hujjat topshirish:</span>
                  <span className="font-semibold text-cyan-300">100% Bevosita (Mustaqil)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300">Konsaltorlik to'lovi:</span>
                  <span className="font-semibold text-green-300 line-through">$1,500</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-white/5">
                  <span className="text-white">Sizning xarajatingiz:</span>
                  <span className="text-cyan-400">$0</span>
                </div>
              </div>

              {/* Little visual mock bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-blue-200 font-mono">
                  <span>AI Portfolio Baholanishi</span>
                  <span className="text-cyan-300 font-bold">98% Perfect</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden">
                  <div className="h-full w-[95%] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
                </div>
              </div>
            </motion.div>

            {/* Behind layout styling nodes */}
            <div className="absolute -z-10 bottom-4 right-12 h-20 w-20 rounded-xl bg-blue-500/20 rotate-45 blur-lg"></div>
            <div className="absolute -z-10 top-4 left-12 h-16 w-16 rounded-full bg-cyan-400/20 blur-md"></div>
          </div>
        </div>
      </div>

      {/* HAMKORLIK PARTNERSHIP MODAL */}
      <AnimatePresence>
        {showPartnerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/50 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-white/20 bg-blue-950/70 p-8 shadow-2xl backdrop-blur-xl text-center text-white"
            >
              <button
                onClick={() => setShowPartnerModal(false)}
                className="absolute top-4 right-4 text-blue-200 hover:text-white"
                id="btn-close-partner"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-3 shadow-lg shadow-cyan-400/20">
                <Handshake className="h-8 w-8 text-white" />
              </div>

              <h2 className="mt-4 text-2xl font-black text-white">Hamkorlik Bo'limi</h2>
              <p className="mt-2 text-sm text-cyan-300 font-bold uppercase tracking-wider">TopGrand International Collaboration</p>

              <div className="my-6 rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
                <p className="text-base text-blue-100 font-medium leading-relaxed">
                  "Sizning xususiy oliygohingiz yoki universitetingiz bormi? Unda biz bilan hamkorlik qiling!"
                </p>
                <div className="flex flex-col gap-2 text-left text-xs text-blue-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span>Minglab intiluvchan talabalarga bevosita yetib boring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span>Haqiqiy shaffof va adolatli akademik qabul tizimi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span>Konsalting qatlamlarisiz to'g'ridan-to'g'ri integratsiya</span>
                  </div>
                </div>
              </div>

              <a
                href="https://t.me/studytime_uz"
                target="_blank"
                rel="referrer noopener"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 active:scale-[0.98] transition py-3 font-bold text-white shadow-lg shadow-cyan-500/25"
                id="btn-telegram-partner"
              >
                <Send className="h-4.5 w-4.5 text-white shrink-0" />
                <span>Bog'lanish (@studytime_uz)</span>
              </a>

              <button
                onClick={() => setShowPartnerModal(false)}
                className="mt-3 text-xs text-blue-300 hover:text-white"
              >
                Yopish
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
