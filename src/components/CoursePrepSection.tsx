import React, { useState } from 'react';
import { Sparkles, Calendar, BookOpen, AlertCircle, Handshake, Send, ChevronRight, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CoursePrepSection() {
  const [showTutorModal, setShowTutorModal] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 text-white" id="course-prep-root">
      {/* SECTION HEADER WITH COHESIVE CTA BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-white leading-tight">
            IELTS & SAT Tayyorlov Kurslari
          </h2>
          <p className="text-sm text-cyan-300 font-mono tracking-widest uppercase mt-1">Imtihonlar Bo'limi & Metodika</p>
        </div>

        {/* Partnership Button above */}
        <button
          onClick={() => setShowTutorModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 active:scale-95 transition px-5 py-2.5 text-xs font-bold font-sans text-white shadow-lg shadow-blue-500/25"
          id="btn-tutor-partner-head"
        >
          <Handshake className="h-4.5 w-4.5 text-white animate-pulse" />
          <span>O'qituvchi Hamkorligi</span>
        </button>
      </div>

      {/* DETAILED CONTENT AREA DISPLAYING NO ACTIVE COURSES YET */}
      <div className="max-w-2xl mx-auto text-center py-8">
        <div className="rounded-[2.5rem] border border-white/15 bg-white/5 p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle accent blur circles */}
          <div className="absolute -top-12 -left-12 h-24 w-24 rounded-full bg-blue-500/20 blur-xl"></div>
          <div className="absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-cyan-400/10 blur-xl"></div>

          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/10 text-cyan-400 border border-cyan-400/20 p-4">
              <BookOpen className="h-10 w-10 text-cyan-300 animate-pulse" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Hozircha kurslar mavjud emas</h3>
          <p className="text-xs text-blue-200 mt-2 max-w-md mx-auto leading-relaxed font-light">
            Platformamizning daxshatli o'quv rejalari va IELTS/SAT virtual dars qismlari hozirda yangilanmoqda. Tez orada barcha darslar to'liq ishga tushadi!
          </p>

          <div className="my-6 border-t border-white/5 pt-6">
            {/* Elegant prompt box for teacher collaboration */}
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5 text-left space-y-3.5">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>O'qituvchilar va Mentorlar Diqqatiga!</span>
              </h4>
              <p className="text-xs text-blue-100 leading-relaxed font-medium">
                "Agar siz professional IELTS yoki SAT o'qituvchisi bo'lsangiz va o'zingizning mualliflik darslik, audio/video darslaringizni platformamiz orqali minglab qiziquvchilarga taqdim etmoqchi bo'lsangiz, biz bilan hamkorlik qiling!"
              </p>
              
              <button
                onClick={() => setShowTutorModal(true)}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 py-2.5 text-xs font-bold text-white transition"
                id="btn-tutor-partner-invite"
              >
                Hamkorlikni Boshlash
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TUTOR COLLABORATION MODAL CONTAINER */}
      <AnimatePresence>
        {showTutorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/50 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-white/20 bg-blue-950/80 p-8 shadow-2xl backdrop-blur-xl text-center text-white"
            >
              <button
                onClick={() => setShowTutorModal(false)}
                className="absolute top-4 right-4 text-blue-200 hover:text-white"
                id="btn-close-tutor-modal"
              >
                {/* Close placeholder */}
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
              <p className="mt-2 text-xs text-cyan-300 font-bold uppercase tracking-wider">TopGrand Academic Alliance</p>

              <div className="my-6 rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
                <p className="text-sm text-blue-100 font-medium leading-relaxed">
                  "Ushbu sohada tajribali o'qituvchi bo'lsangiz - o'z shaxsiy onlayn maktabingiz, darslaringizni biz bilan kengaytiring."
                </p>
                <p className="text-[11px] text-blue-200 leading-normal font-light">
                  TopGrand oq-ko'k shaffof elita platformasidagi minglab xalqaro talabalar sizning bepul va pullik kurslaringiz auditoriyasi bo'lishga tayyor!
                </p>
              </div>

              <a
                href="https://t.me/studytime_uz"
                target="_blank"
                rel="referrer noopener"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 active:scale-[0.98] transition py-3 font-bold text-white shadow-lg shadow-cyan-500/25"
                id="btn-tg-tutor-connect"
              >
                <Send className="h-4.5 w-4.5 text-white shrink-0 animate-bounce" />
                <span>Aloqaga Chiqish (@studytime_uz)</span>
              </a>

              <button
                onClick={() => setShowTutorModal(false)}
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
