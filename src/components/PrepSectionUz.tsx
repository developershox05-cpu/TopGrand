import React, { useState } from 'react';
import { Check, X, FileText, Download, Award, ChevronRight, HelpCircle, RefreshCw, BookOpen, Clock, Sparkles } from 'lucide-react';
import { uzTestQuestions, prepGuidesData } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export default function PrepSectionUz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'savollar' | 'qollanmalar'>('savollar');
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (showResults[questionId]) return; // locked after checking
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    setShowResults((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults({});
  };

  const handleDownload = (guideId: string) => {
    setDownloading((prev) => ({ ...prev, [guideId]: true }));
    setTimeout(() => {
      setDownloading((prev) => ({ ...prev, [guideId]: false }));
      alert("Qo'llanma muvaffaqiyatli yuklab olindi (Simulatsiya)!");
    }, 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12" id="uz-prep-root">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl font-black text-white tracking-tight">
          O'zbekiston Davlat Universitetlariga Tayyorlov Bo'limi
        </h2>
        <p className="text-sm text-cyan-300 font-mono tracking-widest uppercase mt-1">BMBA (DTM) Milliy Imtihonlar Segmenti</p>
        <p className="text-sm text-blue-200 mt-3 font-light">
          Milliy tayyorlov guruhimiz siz uchun maxsus ishlab chiqqan bepul qo'shimcha testlar va yangi yuklangan elektron qo'llanmalar bilan o'qishga kirish imkoniyatingizni maksimallashtiring.
        </p>
      </div>

      {/* Primary tab switcher */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('savollar')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-xs transition border ${
            activeTab === 'savollar'
              ? 'bg-white/10 text-white border-white/20'
              : 'text-blue-200 hover:text-white border-transparent'
          }`}
          id="btn-uztab-tests"
        >
          <HelpCircle className="h-4.5 w-4.5 text-cyan-400" />
          <span>Interaktiv Test Savollari</span>
        </button>

        <button
          onClick={() => setActiveTab('qollanmalar')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-xs transition border ${
            activeTab === 'qollanmalar'
              ? 'bg-white/10 text-white border-white/20'
              : 'text-blue-200 hover:text-white border-transparent'
          }`}
          id="btn-uztab-guides"
        >
          <BookOpen className="h-4.5 w-4.5 text-cyan-400" />
          <span>Yangi Elektron Qo'llanmalar</span>
        </button>
      </div>

      {/* QUIZ PORTION */}
      {activeTab === 'savollar' ? (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <span className="text-xs text-blue-200 font-mono flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-cyan-400" />
              Tizim: Namuna testlar va tahlillar yuklangan
            </span>
            <button
              onClick={handleResetQuiz}
              className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition"
              id="btn-quiz-reset"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Qaytadan topshirish</span>
            </button>
          </div>

          {uzTestQuestions.map((q, idx) => {
            const selectedIdx = selectedAnswers[q.id];
            const checked = showResults[q.id];

            return (
              <div
                key={q.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md space-y-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/40 text-[10px] font-bold text-cyan-300 uppercase tracking-widest mb-1.5">
                      {q.subject}
                    </span>
                    <h4 className="text-sm md:text-base font-bold text-white leading-normal">
                      {q.question}
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5 pl-10">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selectedIdx === oIdx;
                    const isCorrect = q.correctAnswer === oIdx;

                    let buttonStyle = 'border-white/10 bg-white/5 text-blue-100 hover:bg-white/10';
                    if (checked) {
                      if (isCorrect) {
                        buttonStyle = 'border-green-500/50 bg-green-500/20 text-green-200';
                      } else if (isSelected) {
                        buttonStyle = 'border-red-500/50 bg-red-500/20 text-red-200';
                      } else {
                        buttonStyle = 'border-white/5 bg-white/0 opacity-60 text-blue-200';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={checked}
                        onClick={() => handleSelectOption(q.id, oIdx)}
                        className={`w-full text-left rounded-xl border px-4 py-3 text-xs md:text-sm font-medium transition flex items-center justify-between ${buttonStyle}`}
                      >
                        <span>{opt}</span>
                        {checked && isCorrect && <Check className="h-4.5 w-4.5 text-green-400 shrink-0" />}
                        {checked && isSelected && !isCorrect && <X className="h-4.5 w-4.5 text-red-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Question explanation disclosure */}
                {checked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pl-10 pt-3 border-t border-white/5 text-xs text-blue-200 mt-2 space-y-1.5"
                  >
                    <p className="font-bold text-cyan-400 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-cyan-400" />
                      <span>To'g'ri Javob Izohi:</span>
                    </p>
                    <p className="leading-relaxed font-light">{q.explanation}</p>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* DOWNLOAD GUIDES PORTION */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prepGuidesData.filter(g => g.type === 'UZ').map((guide) => (
            <div
              key={guide.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md flex flex-col justify-between hover:border-white/20 transition hover:shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-400 border border-cyan-400/30">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 font-mono">
                    UZBEKISTAN PREP
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {guide.title}
                </h3>
                <p className="text-xs text-blue-200 font-light leading-relaxed">
                  {guide.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-300 font-semibold uppercase">
                  Hajmi: {guide.downloadSize}
                </span>

                <button
                  disabled={downloading[guide.id]}
                  onClick={() => handleDownload(guide.id)}
                  className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 hover:border-cyan-450 px-4 py-2 text-xs font-bold text-white shadow transition-colors"
                  id={`btn-download-${guide.id}`}
                >
                  <Download className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{downloading[guide.id] ? "Yuklanmoqda..." : "Yuklab olish"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
