import React, { useState } from 'react';
import { Send, Handshake, Shield, Sparkles, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ApplyUniversitySectionProps {
  currentLang?: 'uz' | 'en' | 'ru';
}

export default function ApplyUniversitySection({ currentLang = 'uz' }: ApplyUniversitySectionProps) {
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Localization Dictionary
  const langText = {
    uz: {
      header: "Universitetga To'g'ridan-To'g'ri Topshirish",
      subheader: "Direct Academic Submissions Portal",
      btnPartner: "Oliygohlar uchun Hamkorlik",
      notAvailableHead: "Hozircha mavjud emas",
      notAvailableDesc: "To'g'ridan-to'g'ri hujjat topshirish virtual API tizimi ishlab chiqilmoqda. Tez orada barcha davlat universitetlariga bevosita shu yerdan pasportingizni yuklab o'qishga topshira olasiz.",
      attentionHead: "Oliygohlar va Konsaltinglar Diqqatiga!",
      attentionDesc: "Siz hamkorlik qilish orqali ushbu platforma yordamida minglab va millionlab faol o'quvchilarni oliygohingizga yuklama oqimlarisiz jalb qila olasiz.",
      btnProposal: "Biz bilan Hamkorlik Taklifini Ko'rish",
      modalTitle: "Hamkorlik Aloqasi",
      modalTag: "TopGrand International Universities",
      modalDesc: "Ushbu platforma orqali juda ko'p va yuqori darajadagi aktiv talabalarni bevosita qabul qiling!",
      point1: "Ortiqcha reklama va qatlam xarajatlarini tejang",
      point2: "Eng saralangan IELTS / SAT va portfolio egalarini oling",
      point3: "100% shaffoflik muhiti va tizim integratsiyasi",
      btnContact: "Taklif Yuborish (@studytime_uz)",
      btnClose: "Yopish"
    },
    en: {
      header: "Direct University Applications",
      subheader: "Direct Academic Submissions Portal",
      btnPartner: "University Partnership",
      notAvailableHead: "Not available yet",
      notAvailableDesc: "The direct application virtual API infrastructure is currently under active development. Soon you'll be able to upload your passport and submit applications directly to state universities.",
      attentionHead: "Attention Universities & Consulting Agencies!",
      attentionDesc: "By collaborating with us, you can seamlessly attract thousands and millions of active students to your academic programs without any overhead streams.",
      btnProposal: "View Cooperation Proposal with us",
      modalTitle: "Partnership Network",
      modalTag: "TopGrand International Universities",
      modalDesc: "Attract and enroll top-tier, highly motivated prospective students directly via this portal!",
      point1: "Save marketing and intermediary commission structural expenses",
      point2: "Recruit premium candidates with high IELTS / SAT scores & credentials",
      point3: "Enjoy 100% transparent tracking data & secure API integrations",
      btnContact: "Send Proposal (@studytime_uz)",
      btnClose: "Close"
    },
    ru: {
      header: "Прямая подача в университеты",
      subheader: "Direct Academic Submissions Portal",
      btnPartner: "Сотрудничество для вузов",
      notAvailableHead: "Временно недоступно",
      notAvailableDesc: "Виртуальная API-система для прямой подачи документов находится в процессе разработки. Скоро вы сможете загрузить паспорт и подать заявление в любые государственные вузы напрямую.",
      attentionHead: "Вниманию университетов и агентств!",
      attentionDesc: "Сотрудничая с нами, вы сможете привлечь тысячи и миллионы активных студентов в свой университет без лишних накладных расходов.",
      btnProposal: "Посмотреть предложение о партнерстве",
      modalTitle: "Связь для партнёров",
      modalTag: "TopGrand International Universities",
      modalDesc: "Принимайте большое количество активных и квалифицированных студентов напрямую через эту платформу!",
      point1: "Экономьте на лишней рекламе и брокерских расходах",
      point2: "Привлекайте студентов с лучшими баллами IELTS / SAT и портфолио",
      point3: "100% прозрачная среда и глубокая системная интеграция",
      btnContact: "Отправить предложение (@studytime_uz)",
      btnClose: "Закрыть"
    }
  };

  const text = langText[currentLang] || langText['uz'];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 text-white" id="apply-uni-root">
      {/* SECTION CONTAINER HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-10 text-center sm:text-left">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {text.header}
          </h2>
          <p className="text-xs sm:text-sm text-cyan-300 font-mono tracking-widest uppercase mt-1">
            {text.subheader}
          </p>
        </div>

        {/* Top Partnership CTA with mobile safety */}
        <button
          onClick={() => setShowApplyModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 active:scale-95 transition px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20"
          id="btn-apply-partner-head"
          style={{ minHeight: '44px' }}
        >
          <Handshake className="h-4.5 w-4.5 shrink-0" />
          <span>{text.btnPartner}</span>
        </button>
      </div>

      {/* CORE DISPLAY ZONE */}
      <div className="max-w-2xl mx-auto text-center py-4">
        <div className="rounded-[2.5rem] border border-white/15 bg-white/5 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Accent glow elements */}
          <div className="absolute -top-12 -left-12 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl"></div>
          <div className="absolute -bottom-12 -right-12 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl"></div>

          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/10 text-cyan-400 border border-cyan-400/20 p-4 shrink-0">
              <PlayCircle className="h-10 w-10 text-cyan-300 animate-pulse" />
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{text.notAvailableHead}</h3>
          <p className="text-xs sm:text-sm text-blue-200 mt-2 max-w-sm mx-auto leading-relaxed font-light">
            {text.notAvailableDesc}
          </p>

          <div className="my-6 border-t border-white/5 pt-6">
            {/* Highly customized visual block detailing core benefits of TopGrand */}
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 sm:p-5 text-left space-y-4">
              <h4 className="text-[10px] sm:text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>{text.attentionHead}</span>
              </h4>
              <p className="text-xs text-blue-100 leading-relaxed font-semibold">
                {text.attentionDesc}
              </p>
              
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 py-3 text-xs font-bold text-white transition"
                id="btn-apply-partner-trigger"
                style={{ minHeight: '44px' }}
              >
                {text.btnProposal}
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
              className="relative w-full max-w-md rounded-3xl border border-white/20 bg-blue-950/85 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center text-white"
            >
              <button
                onClick={() => setShowApplyModal(false)}
                className="absolute top-4 right-4 text-blue-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
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

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-3 shadow-lg shadow-cyan-400/20 shrink-0">
                <Handshake className="h-8 w-8 text-white" />
              </div>

              <h2 className="mt-4 text-xl sm:text-2xl font-black text-white">{text.modalTitle}</h2>
              <p className="mt-2 text-[10px] text-cyan-300 font-bold uppercase tracking-wider">{text.modalTag}</p>

              <div className="my-6 rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5 space-y-4 text-left">
                <p className="text-xs sm:text-sm text-blue-100 font-semibold leading-relaxed text-center">
                  {text.modalDesc}
                </p>
                <div className="space-y-2 text-xs text-blue-200 font-medium">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{text.point1}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{text.point2}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{text.point3}</span>
                  </div>
                </div>
              </div>

              <a
                href="https://t.me/studytime_uz"
                target="_blank"
                rel="referrer noopener"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 active:scale-[0.98] transition py-3 px-4 font-bold text-xs sm:text-sm text-white shadow-lg shadow-cyan-500/25 cursor-pointer"
                id="btn-tg-apply-connect"
                style={{ minHeight: '44px' }}
              >
                <Send className="h-4 w-4 text-white shrink-0 animate-bounce" />
                <span>{text.btnContact}</span>
              </a>

              <button
                onClick={() => setShowApplyModal(false)}
                className="mt-3 text-xs text-blue-300 hover:text-white font-semibold transition cursor-pointer"
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
