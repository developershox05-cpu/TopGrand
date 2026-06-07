import React, { useState } from 'react';
import { Send, Handshake, Shield, Sparkles, AlertCircle, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ApplyUniversitySection() {
  const [showApplyModal, setShowApplyModal] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 text-white" id="apply-uni-root">
      {/* SECTION CONTAINER HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-white leading-tight">
            Universitetga To'g'ridan-To'g'ri Topshirish
          </h2>
          <p className="text-sm text-cyan-300 font-mono tracking-widest uppercase mt-1">Direct Academic Submissions Portal</p>
        </div>

        {/* Top Partnership CTA */}
        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 active:scale-95 transition px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20"
          id="btn-apply-partner-head"
        >
          <Handshake className="h-4.5 w-4.5" />
          <span>Oliygohlar uchun Hamkorlik</span>
        </button>
      </div>

      {/* CORE DISPLAY ZONE */}
      <div className="max-w-2xl mx-auto text-center py-8">
        <div className="rounded-[2.5rem] border border-white/15 bg-white/5 p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Accent glow elements */}
          <div className="absolute -top-12 -left-12 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl"></div>
          <div className="absolute -bottom-12 -right-12 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl"></div>

          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/10 text-cyan-400 border border-cyan-400/20 p-4">
              <PlayCircle className="h-10 w-10 text-cyan-300 animate-pulse" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Hozircha mavjud emas</h3>
          <p className="text-xs text-blue-200 mt-2 max-w-sm mx-auto leading-relaxed font-light">
            To'g'ridan-to'g'ri hujjat topshirish virtual API tizimi ishlab chiqilmoqda. Tez orada barcha davlat universitetlariga bevosita shu yerdan pasportingizni yuklab o'qishga topshira olasiz.
          </p>

          <div className="my-6 border-t border-white/5 pt-6">
            {/* Highly customized visual block detailing core benefits of TopGrand */}
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 text-left space-y-4">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <Sparkles className="h-4 w-4" />
                <span>Oliygohlar va Konsaltinglar Diqqatiga!</span>
              </h4>
              <p className="text-xs text-blue-100 leading-relaxed font-semibold">
                Siz hamkorlik qilish orqali ushbu platforma yordamida minglab va millionlab faol o'quvchilarni oliygohingizga yuklama oqimlarisiz jalb qila olasiz.
              </p>
              
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 py-2.5 text-xs font-bold text-white transition"
                id="btn-apply-partner-trigger"
              >
                Biz bilan Hamkorlik Taklifini Ko'rish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED PARTNERSHIP MODAL DESIGN */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/50 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-white/20 bg-blue-950/80 p-8 shadow-2xl backdrop-blur-xl text-center text-white"
            >
              <button
                onClick={() => setShowApplyModal(false)}
                className="absolute top-4 right-4 text-blue-200 hover:text-white"
                id="btn-close-apply-modal"
              >
                {/* Close svg representation */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-3 shadow-lg shadow-cyan-400/20">
                <Handshake className="h-8 w-8 text-white" />
              </div>

              <h2 className="mt-4 text-2xl font-black text-white">Hamkorlik Aloqasi</h2>
              <p className="mt-2 text-xs text-cyan-300 font-bold uppercase tracking-wider">TopGrand International Universities</p>

              <div className="my-6 rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4 text-left">
                <p className="text-sm text-blue-100 font-semibold leading-relaxed text-center">
                  Ushbu platforma orqali juda ko'p va yuqori darajadagi aktiv talabalarni bevosita qabul qiling!
                </p>
                <div className="space-y-2 text-xs text-blue-200">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Ortiqcha reklama va qatlam xarajatlarini tejang</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Eng saralangan IELTS / SAT va portfolio egalarini oling</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>100% shaffoflik muhiti va tizim integratsiyasi</span>
                  </div>
                </div>
              </div>

              <a
                href="https://t.me/studytime_uz"
                target="_blank"
                rel="referrer noopener"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 active:scale-[0.98] transition py-3 font-bold text-white shadow-lg shadow-cyan-500/25"
                id="btn-tg-apply-connect"
              >
                <Send className="h-4.5 w-4.5 text-white shrink-0" />
                <span>Taklif Yuborish (@studytime_uz)</span>
              </a>

              <button
                onClick={() => setShowApplyModal(false)}
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
