import React, { useState } from 'react';
import { Sparkles, Handshake, Send, ChevronRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CoursePrepSectionProps {
  currentLang?: 'uz' | 'en' | 'ru';
}

export default function CoursePrepSection({ currentLang = 'uz' }: CoursePrepSectionProps) {
  const [showTutorModal, setShowTutorModal] = useState(false);

  // Localization Dictionary
  const langText = {
    uz: {
      header: "IELTS & SAT Tayyorlov Kurslari",
      subheader: "Imtihonlar Bo'limi & Metodika",
      btnPartner: "O'qituvchi Hamkorligi",
      notAvailableHead: "Hozircha kurslar mavjud emas",
      notAvailableDesc: "Platformamizning daxshatli o'quv rejalari va IELTS/SAT virtual dars qismlari hozirda yangilanmoqda. Tez orada barcha darslar to'liq ishga tushadi!",
      attentionHead: "O'qituvchilar va Mentorlar Diqqatiga!",
      attentionDesc: "Agar siz professional IELTS yoki SAT o'qituvchisi bo'lsangiz va o'zingizning mualliflik darslik, audio/video darslaringizni platformamiz orqali minglab qiziquvchilarga taqdim etmoqchi bo'lsangiz, biz bilan hamkorlik qiling!",
      btnStartCooperation: "Hamkorlikni Boshlash",
      modalTitle: "Hamkorlik Aloqasi",
      modalTag: "TopGrand Academic Alliance",
      modalDesc1: "Ushbu sohada tajribali o'qituvchi bo'lsangiz - o'z shaxsiy onlayn maktabingiz, darslaringizni biz bilan kengaytiring.",
      modalDesc2: "TopGrand oq-ko'k shaffof elita platformasidagi minglab xalqaro talabalar sizning bepul va pullik kurslaringiz auditoriyasi bo'lishga tayyor!",
      btnContact: "Aloqaga Chiqish (@studytime_uz)",
      btnClose: "Yopish"
    },
    en: {
      header: "IELTS & SAT Preparation Courses",
      subheader: "Exam Department & Methodology",
      btnPartner: "Teacher Collaboration",
      notAvailableHead: "No courses available yet",
      notAvailableDesc: "Our intensive curriculums and virtual IELTS/SAT course modules are currently being updated. All lessons will be fully live soon!",
      attentionHead: "Attention Teachers & Mentors!",
      attentionDesc: "If you are a professional IELTS or SAT instructor and want to host your video/audio courses, textbooks, or materials on our platform to thousands of students, collaborate with us!",
      btnStartCooperation: "Start Collaboration",
      modalTitle: "Partnership Network",
      modalTag: "TopGrand Academic Alliance",
      modalDesc1: "If you are an experienced tutor in this field, expand your personal online school & lessons with us.",
      modalDesc2: "Thousands of international students on TopGrand's premium platform are ready to join your free and paid curriculum options!",
      btnContact: "Contact Us (@studytime_uz)",
      btnClose: "Close"
    },
    ru: {
      header: "Курсы подготовки к IELTS и SAT",
      subheader: "Экзаменационный отдель и методика",
      btnPartner: "Сотрудничество для учителей",
      notAvailableHead: "На данный момент курсы отсутствуют",
      notAvailableDesc: "Наши интенсивные учебные программы и виртуальные модули курсов IELTS/SAT сейчас обновляются. Совсем скоро все уроки будут запущены!",
      attentionHead: "Вниманию преподавателей и менторов!",
      attentionDesc: "Если вы являетесь профессиональным преподавателем IELTS или SAT и хотите представить свои авторские учебники, аудио- и видеоуроки тысячам студентов через нашу платформу, присоединяйтесь!",
      btnStartCooperation: "Начать сотрудничество",
      modalTitle: "Связь для партнёров",
      modalTag: "TopGrand Academic Alliance",
      modalDesc1: "Если вы опытный преподаватель в этой области, развивайте свою личную онлайн-школу и уроки вместе с нами.",
      modalDesc2: "Тысячи международных студентов на элитной платформе TopGrand готовы стать аудиторией ваших бесплатных и платных курсов!",
      btnContact: "Связаться (@studytime_uz)",
      btnClose: "Закрыть"
    }
  };

  const text = langText[currentLang] || langText['uz'];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 text-white" id="course-prep-root">
      {/* SECTION HEADER WITH COHESIVE CTA BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-10 text-center sm:text-left">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {text.header}
          </h2>
          <p className="text-xs sm:text-sm text-cyan-300 font-mono tracking-widest uppercase mt-1">
            {text.subheader}
          </p>
        </div>

        {/* Partnership Button with full mobile responsiveness (no cut-off) */}
        <button
          onClick={() => setShowTutorModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 active:scale-95 transition px-5 py-3 text-xs font-bold font-sans text-white shadow-lg shadow-blue-500/25"
          id="btn-tutor-partner-head"
          style={{ minHeight: '44px' }}
        >
          <Handshake className="h-4.5 w-4.5 text-white animate-pulse shrink-0" />
          <span>{text.btnPartner}</span>
        </button>
      </div>

      {/* DETAILED CONTENT AREA DISPLAYING NO ACTIVE COURSES YET */}
      <div className="max-w-2xl mx-auto text-center py-4">
        <div className="rounded-[2rem] sm:rounded-[2.5rem] border border-white/15 bg-white/5 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle accent blur circles */}
          <div className="absolute -top-12 -left-12 h-24 w-24 rounded-full bg-blue-500/20 blur-xl"></div>
          <div className="absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-cyan-400/10 blur-xl"></div>

          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/10 text-cyan-400 border border-cyan-400/20 p-4 shrink-0">
              <BookOpen className="h-10 w-10 text-cyan-300 animate-pulse" />
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{text.notAvailableHead}</h3>
          <p className="text-xs sm:text-sm text-blue-200 mt-2 max-w-md mx-auto leading-relaxed font-light">
            {text.notAvailableDesc}
          </p>

          <div className="my-6 border-t border-white/5 pt-6">
            {/* Elegant prompt box for teacher collaboration */}
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4 sm:p-5 text-left space-y-3.5">
              <h4 className="text-[10px] sm:text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>{text.attentionHead}</span>
              </h4>
              <p className="text-xs text-blue-100 leading-relaxed font-semibold">
                "{text.attentionDesc}"
              </p>
              
              <button
                onClick={() => setShowTutorModal(true)}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 py-3 text-xs font-bold text-white transition cursor-pointer"
                id="btn-tutor-partner-invite"
                style={{ minHeight: '44px' }}
              >
                <span>{text.btnStartCooperation}</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
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
              className="relative w-full max-w-md rounded-3xl border border-white/20 bg-blue-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center text-white"
            >
              <button
                onClick={() => setShowTutorModal(false)}
                className="absolute top-4 right-4 text-blue-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
                id="btn-close-tutor-modal"
              >
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

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-3 shadow-lg shadow-cyan-400/20 shrink-0">
                <Handshake className="h-8 w-8 text-white" />
              </div>

              <h2 className="mt-4 text-xl sm:text-2xl font-black text-white">{text.modalTitle}</h2>
              <p className="mt-1 text-[10px] text-cyan-300 font-bold uppercase tracking-wider">{text.modalTag}</p>

              <div className="my-6 rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5 space-y-4">
                <p className="text-xs sm:text-sm text-blue-105 font-semibold leading-relaxed">
                  "{text.modalDesc1}"
                </p>
                <p className="text-[10px] sm:text-xs text-blue-200 leading-normal font-light">
                  {text.modalDesc2}
                </p>
              </div>

              <a
                href="https://t.me/studytime_uz"
                target="_blank"
                rel="referrer noopener"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 active:scale-[0.98] transition py-3 px-4 font-bold text-xs sm:text-sm text-white shadow-lg shadow-cyan-500/25 cursor-pointer"
                id="btn-tg-tutor-connect"
                style={{ minHeight: '44px' }}
              >
                <Send className="h-4 w-4 text-white shrink-0 animate-bounce" />
                <span>{text.btnContact}</span>
              </a>

              <button
                onClick={() => setShowTutorModal(false)}
                className="mt-4 text-xs text-blue-300 hover:text-white font-semibold transition cursor-pointer"
              >
                {text.btnClose}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
