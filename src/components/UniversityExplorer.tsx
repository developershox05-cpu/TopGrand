import React, { useState } from 'react';
import { Search, MapPin, Award, Calendar, DollarSign, Globe, Lock, Unlock, FileText, CheckCircle, Flame, Star, Sparkles, Send, GraduationCap, ArrowUpRight } from 'lucide-react';
import { University, User } from '../types';
import { universitiesData } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface UniversityExplorerProps {
  user: User;
  onOpenPremium: () => void;
}

export default function UniversityExplorer({ user, onOpenPremium }: UniversityExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('barchasi');
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'katalog' | 'qaynoq'>('katalog');
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  // Available countries
  const countries = [
    { value: 'barchasi', label: 'Barcha Davlatlar' },
    { value: "O'zbekiston", label: "O'zbekiston (UZB)" },
    { value: 'AQSh', label: 'AQSh' },
    { value: 'Buyuk Britaniya', label: 'UK (Britaniya)' },
    { value: 'Germaniya', label: 'Germaniya' },
    { value: 'Kanada', label: 'Kanada' },
    { value: 'Janubiy Koreya', label: 'Koreya' },
    { value: 'Yaponiya', label: 'Yaponiya' },
    { value: 'Turkiya', label: 'Turkiya' },
    { value: 'Italiya', label: 'Italiya' },
    { value: 'Singapur', label: 'Singapur' },
    { value: 'Shveytsariya', label: 'Shveytsariya' },
    { value: 'Fransiya', label: 'Fransiya' },
    { value: 'Xitoy', label: 'Xitoy' }
  ];

  // Filtering logic
  const filteredUniversities = universitiesData.filter((uni) => {
    const matchesCountry = selectedCountry === 'barchasi' || uni.country === selectedCountry;
    const matchesSearch = 
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.brief.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12" id="explorer-root">
      {/* Sub tabs bar specifically for Catalog vs Qaynoq Takliflar */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveSubTab('katalog')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 border ${
            activeSubTab === 'katalog'
              ? 'bg-white text-blue-700 border-blue-200 shadow-md backdrop-blur-md ring-2 ring-blue-400/20'
              : 'text-blue-900/60 hover:text-blue-700 hover:bg-white/40 border-transparent'
          }`}
          id="btn-subtab-katalog"
        >
          <GraduationCap className="h-4.5 w-4.5 text-blue-600" />
          <span>Universitetlar Katalogi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('qaynoq')}
          className={`relative flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 border ${
            activeSubTab === 'qaynoq'
              ? 'bg-white text-blue-700 border-blue-200 shadow-md backdrop-blur-md ring-2 ring-blue-400/20'
              : 'text-blue-900/60 hover:text-blue-700 hover:bg-white/40 border-transparent'
          }`}
          id="btn-subtab-qaynoq"
        >
          <Flame className="h-4.5 w-4.5 text-yellow-500 animate-pulse" />
          <span>Qaynoq Takliflar</span>
          {/* Animated dot indicator */}
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
        </button>
      </div>

      {activeSubTab === 'katalog' ? (
        <>
          {/* Search and Filters Segment */}
          <div className="mb-10 p-6 rounded-3xl border border-white/60 bg-white/75 backdrop-blur-xl space-y-4 shadow-xl shadow-blue-500/5">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Search Box */}
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-blue-500" />
                <input
                  type="text"
                  placeholder="Universitet nomi, shahar yoki kalit so'z bo'yicha qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-blue-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 placeholder-blue-900/40 outline-none focus:border-blue-500 transition shadow-inner"
                />
              </div>

              {/* Country select option */}
              <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                >
                  {countries.map((c) => (
                    <option key={c.value} value={c.value} className="bg-white text-slate-800">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Helper Badge */}
            <p className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>Siz hozirda bevosita topshira oladigan eng yirik va oliy global universitetlar hisobotini ko'rib turibsiz.</span>
            </p>
          </div>

          {/* CENTRAL TELEGRAM FOLLOW BANNER */}
          <div className="mb-10 bg-gradient-to-r from-blue-600 to-sky-600 rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden transition-all hover:scale-[1.01] duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="space-y-1 text-center sm:text-left">
                <span className="bg-white/20 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  TOPGRAND HAMKORLIK
                </span>
                <h4 className="text-base md:text-lg font-black text-white leading-snug">
                  Bizni Telegram kanalda kuzating va so'nggi yangiliklardan habardor bo'ling!
                </h4>
                <p className="text-xs text-blue-105 font-bold">
                  @Topgrands telegram kanaliga a'zo bo'lib eng so'nggi grant va viza takliflarini qo'lga kiriting.
                </p>
              </div>
              <button
                onClick={() => window.open('https://t.me/Topgrands', '_blank', 'noopener,noreferrer')}
                className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 transition rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 shrink-0 self-center cursor-pointer"
                style={{ minHeight: '44px' }}
                id="btn-telegram-uni-explore"
              >
                <Send className="h-4 w-4 text-blue-700" />
                <span>Qo'shilish @Topgrands</span>
              </button>
            </div>
          </div>

          {/* Grid Layout of Universities */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((uni, idx) => {
              // Lock university check is permanently disengaged to allow 105% free lookup
              const isLocked = false;

              return (
                <div
                  key={uni.id}
                  className={`relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 transition duration-300 backdrop-blur-md flex flex-col justify-between shadow-lg shadow-blue-500/5 ${
                    isLocked 
                      ? 'hover:border-blue-100' 
                      : 'hover:border-blue-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10'
                  }`}
                >
                  {/* Lock Blur Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-blue-900/40 p-6 backdrop-blur-md">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 border border-blue-100 mb-3 animate-pulse shadow-md">
                        <Lock className="h-6 w-6" />
                      </div>
                      <h4 className="text-sm font-black text-blue-900 text-center">Premium Universitet</h4>
                      <p className="text-[11px] text-blue-950 font-semibold text-center mt-1 mb-4 leading-normal bg-white/60 px-2 py-1 rounded-lg">
                        Katalogdagi 15 tadan keyingi premium oliygohlar portfelini ko'rish uchun a'zo bo'ling.
                      </p>
                      <button
                        onClick={onOpenPremium}
                        className="rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:brightness-110 active:scale-95 transition px-4 py-2 text-xs font-black text-white shadow-lg shadow-blue-500/20 flex items-center gap-1.5"
                      >
                        <Unlock className="h-3.5 w-3.5" />
                        <span>Premium Obuna</span>
                      </button>
                    </div>
                  )}

                  {/* University Card Content */}
                  <div className="p-6 space-y-4">
                    {/* Header attributes */}
                    <div className="flex items-start justify-between gap-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 border border-blue-200 px-2.5 py-1 text-[10px] font-mono font-bold text-blue-700">
                        Rank #{uni.ranking}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                        <MapPin className="h-3.5 w-3.5 text-blue-600" />
                        {uni.country}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-blue-950 leading-tight min-h-[50px] flex items-center">
                        {uni.name}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed line-clamp-3">
                        {uni.brief}
                      </p>
                    </div>

                    {/* Ratings and metrics */}
                    <div className="flex items-center gap-1 mt-1 text-xs text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(uni.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-350'
                          }`}
                        />
                      ))}
                      <span className="text-[10px] font-mono text-slate-500 font-bold ml-1">({uni.rating.toFixed(1)})</span>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="p-6 pt-0 border-t border-slate-100 mt-auto flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 font-semibold truncate max-w-[130px]">
                      {uni.city}
                    </span>
                    <button
                      onClick={() => setSelectedUni(uni)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition flex items-center gap-1 shadow-md shadow-blue-500/10"
                      id={`btn-detail-${uni.id}`}
                    >
                      Batafsil
                      <ArrowUpRight className="h-3.5 w-3.5 text-white" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredUniversities.length === 0 && (
            <div className="text-center py-16 text-blue-200">
              <p className="text-base font-semibold">Hech qanday universitet topilmadi.</p>
              <p className="text-xs mt-1">Iltimos, filtr orqali boshqa davlatni tanlang yoki so'rovni o'zgartiring.</p>
            </div>
          )}
        </>
      ) : (
        /* QAYNOQ TAKLIFLAR (HOT OFFERS) SECTION - EMPTY & PARTNERSHIP TRIGGER */
        <div className="w-full max-w-xl mx-auto text-center py-10" id="qaynoq-panel">
          <div className="rounded-[2.5rem] border border-white bg-white/80 p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Soft decorative glow */}
            <div className="absolute -top-15 -left-15 h-24 w-24 rounded-full bg-blue-200/40 blur-xl"></div>
            <div className="absolute -bottom-15 -right-15 h-24 w-24 rounded-full bg-indigo-200/30 blur-xl"></div>

            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-500/15 text-yellow-600 border border-yellow-200 animate-pulse p-4 shadow-sm">
                <Flame className="h-10 w-10" />
              </div>
            </div>

            <h3 className="text-xl font-black text-blue-950 mb-1">Qaynoq Takliflar Bo'limi</h3>
            <p className="text-xs text-blue-600 font-mono tracking-widest uppercase mb-4">Hot Academic Solicitations</p>

            <div className="my-6 rounded-2xl bg-slate-50/60 border border-slate-100 p-5 font-semibold text-slate-600 text-sm space-y-3 shadow-inner">
              <p className="font-extrabold text-blue-950">Hozircha ushbu bo'lim bo'sh.</p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Yaqin orada dunyo oliygohlarining maxsus 100% lik qisman yoki to'liq qabul grantlari va stipendiyali qaynoq vaucherlari aynan shu erda e'lon qilinadi!
              </p>
            </div>

            {/* Top Partnership Alert inside section */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-left space-y-3">
              <p className="text-xs font-black text-blue-900 text-center leading-normal">
                Sizning xususiy oliygohingiz yoki universitetingiz bormi? Unda biz bilan hamkorlik qiling!
              </p>
              <button
                onClick={() => setShowPartnerModal(true)}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:brightness-110 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-blue-500/20"
                id="btn-partner-empty-hot"
              >
                Biz bilan bog'lanish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNIVERSITY DETAILS DIALOG / MODAL (Batafsil bo'limi) */}
      <AnimatePresence>
        {selectedUni && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/45 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-white/60 bg-white p-8 shadow-2xl backdrop-blur-xl text-slate-850 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedUni(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 hover:bg-slate-100 p-1.5 rounded-full transition"
                id="btn-close-uni-detail"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
                      Jahon Reytingi #{selectedUni.ranking}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-slate-500 ml-auto font-semibold">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      {selectedUni.city}, {selectedUni.country}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black text-blue-950 leading-tight">
                    {selectedUni.name}
                  </h2>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {selectedUni.description}
                </p>

                {/* Requirements & Documents section */}
                <div className="rounded-2xl border border-blue-100 bg-[#f8fafc] p-5 space-y-3">
                  <h4 className="font-extrabold text-sm text-blue-900 flex items-center gap-1.5">
                    <FileText className="h-4.5 w-4.5 text-blue-600" />
                    <span>Kerakli Hujjatlar Ro'yxati</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-semibold">
                    {selectedUni.documents.map((doc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Financial and deadlines segment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-blue-100 bg-[#f8fafc] p-4 flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kontrakt To'lovi</h4>
                      <p className="text-balance text-xs text-blue-950 font-black mt-1 leading-normal">{selectedUni.fee}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-100 bg-[#f8fafc] p-4 flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Topshirish Muddatlari</h4>
                      <p className="text-xs text-blue-950 font-black mt-1 leading-normal">{selectedUni.deadlines}</p>
                    </div>
                  </div>
                </div>

                {/* Footer website target */}
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-between border-t border-slate-100 pt-5">
                  <a
                    href={selectedUni.website}
                    target="_blank"
                    rel="referrer noopener"
                    className="flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Rasmiy sayti: {selectedUni.website}</span>
                  </a>

                  <a
                    href="https://t.me/studytime_uz"
                    target="_blank"
                    rel="referrer noopener"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-xs font-black text-white transition hover:brightness-110 active:scale-95 shadow-lg shadow-blue-500/20"
                  >
                    Mustaqil hujjat topshirishni boshlash
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUBMIT HAMKORLIK TO LOCAL POPUP */}
      <AnimatePresence>
        {showPartnerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/50 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-white/20 bg-blue-950/80 p-8 shadow-2xl backdrop-blur-xl text-center text-white"
            >
              <button
                onClick={() => setShowPartnerModal(false)}
                className="absolute top-4 right-4 text-blue-200 hover:text-white"
                id="btn-close-partner-hot"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-3 shadow-lg shadow-cyan-400/20">
                <Flame className="h-8 w-8 text-white" />
              </div>

              <h2 className="mt-4 text-2xl font-black text-white">Hamkorlik Qiling</h2>
              <p className="mt-2 text-xs text-cyan-300 font-bold uppercase tracking-wider">TopGrand Partnership Proposal</p>

              <div className="my-6 rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
                <p className="text-base text-blue-100 font-medium leading-relaxed">
                  "Sizning xususiy oliygohingiz yoki universitetingiz bormi? Unda biz bilan hamkorlik qiling"
                </p>
                <p className="text-[11px] text-blue-200 leading-relaxed font-light">
                  Ushbu taklif orqali siz bizning daxshatli oq va ko'k shaffof raqamli platformamizda minglab tayyor va intiluvchan talabalarni to'g'ridan-to'g'ri oliygohingizga jalb qila olasiz.
                </p>
              </div>

              <a
                href="https://t.me/studytime_uz"
                target="_blank"
                rel="referrer noopener"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 active:scale-[0.98] transition py-3 font-bold text-white shadow-lg shadow-cyan-500/25"
                id="btn-partner-tg-link-hot"
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

// Minimal placeholder component for X icon
function X({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
