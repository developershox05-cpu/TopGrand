import React, { useState } from 'react';
import { Search, MapPin, Award, Calendar, DollarSign, Globe, Lock, Unlock, FileText, CheckCircle, Flame, Star, Sparkles, Send, GraduationCap, ArrowUpRight, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';
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
  const [activeSubTab, setActiveSubTab] = useState<'katalog' | 'qaynoq' | 'favorite'>('katalog');
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  // Special State for University detail interactive tabs & questions/chat bounds
  const [modalSubTab, setModalSubTab] = useState<'info' | 'steps' | 'chat'>('info');
  const [uniChatInput, setUniChatInput] = useState('');
  const [uniChatHistory, setUniChatHistory] = useState<Record<string, Array<{sender: 'user' | 'ai', text: string}>>>({});
  const [uniChatLoading, setUniChatLoading] = useState(false);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('favorite_unis');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [uniQuestionsCount, setUniQuestionsCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('uni_chat_count');
      const storedDate = localStorage.getItem('uni_chat_date');
      const today = new Date();
      if (storedDate) {
        const lastDate = new Date(storedDate);
        if (lastDate.toDateString() !== today.toDateString()) {
          localStorage.setItem('uni_chat_count', '0');
          localStorage.setItem('uni_chat_date', today.toISOString());
          return 0;
        }
      } else {
        localStorage.setItem('uni_chat_date', today.toISOString());
      }
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const incrementUniChatCount = () => {
    const nextCount = uniQuestionsCount + 1;
    setUniQuestionsCount(nextCount);
    localStorage.setItem('uni_chat_count', String(nextCount));
    localStorage.setItem('uni_chat_date', new Date().toISOString());
  };

  const toggleFavorite = (uniId: string) => {
    const updated = favorites.includes(uniId)
      ? favorites.filter(id => id !== uniId)
      : [...favorites, uniId];
    setFavorites(updated);
    localStorage.setItem('favorite_unis', JSON.stringify(updated));
  };

  const handleSelectUni = (uni: University | null) => {
    setSelectedUni(uni);
    setModalSubTab('info');
  };

  const sendUniChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUni || !uniChatInput.trim() || uniChatLoading) return;

    if (!user.isPremium && uniQuestionsCount >= 5) {
      alert("Siz bugungi 5 ta bepul savol limitidan foydalandingiz! Pro versiyani sotib olish orqali cheksiz savollar berishingiz mumkin.");
      onOpenPremium();
      return;
    }

    const typedMsg = uniChatInput;
    setUniChatInput('');

    // Append user message
    const currentHist = uniChatHistory[selectedUni.id] || [];
    const updatedUserHist = [...currentHist, { sender: 'user' as const, text: typedMsg }];
    setUniChatHistory(prev => ({
      ...prev,
      [selectedUni.id]: updatedUserHist
    }));

    setUniChatLoading(true);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: "university_chat",
          inputData: {
            userMessage: typedMsg,
            uniName: selectedUni.name,
            uniCountry: selectedUni.country,
            uniCity: selectedUni.city,
            uniBrief: selectedUni.brief,
            uniDescription: selectedUni.description,
            uniFee: selectedUni.fee,
            uniDeadlines: selectedUni.deadlines,
            uniWebsite: selectedUni.website,
            uniDocuments: selectedUni.documents,
            history: updatedUserHist.slice(-8)
          },
          userContext: user
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setUniChatHistory(prev => ({
          ...prev,
          [selectedUni.id]: [...updatedUserHist, { sender: 'ai' as const, text: data.text }]
        }));
        if (!user.isPremium) {
          incrementUniChatCount();
        }
      } else {
        alert(data.error || "Ulanishda xatolik yuz berdi.");
      }
    } catch {
      alert("Platforma sun'iy intellekti bilan bog'lanishda muammo yuz berdi.");
    } finally {
      setUniChatLoading(false);
    }
  };

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
    if (activeSubTab === 'favorite' && !favorites.includes(uni.id)) {
      return false;
    }
    const matchesCountry = selectedCountry === 'barchasi' || uni.country === selectedCountry;
    const matchesSearch = 
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.brief.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12" id="explorer-root">
      {/* Sub tabs bar specifically for Catalog vs Qaynoq Takliflar & Favorites */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <button
          onClick={() => setActiveSubTab('katalog')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs md:text-sm transition-all duration-200 border ${
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
          className={`relative flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs md:text-sm transition-all duration-200 border ${
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

        <button
          onClick={() => setActiveSubTab('favorite')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs md:text-sm transition-all duration-200 border ${
            activeSubTab === 'favorite'
              ? 'bg-white text-blue-700 border-blue-200 shadow-md backdrop-blur-md ring-2 ring-blue-400/20'
              : 'text-blue-900/60 hover:text-blue-700 hover:bg-white/40 border-transparent'
          }`}
          id="btn-subtab-favorites"
        >
          <Star className={`h-4.5 w-4.5 ${activeSubTab === 'favorite' ? 'fill-yellow-500 text-yellow-500' : 'text-slate-400'}`} />
          <span>Saralangan Oliygohlar ({favorites.length})</span>
        </button>
      </div>

      {activeSubTab !== 'qaynoq' ? (
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
                      <span className="text-[10px] font-mono text-slate-500 font-bold ml-1">( {uni.rating.toFixed(1)} )</span>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="p-6 pt-0 border-t border-slate-100 mt-auto flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 font-semibold truncate max-w-[130px]">
                      {uni.city}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(uni.id);
                        }}
                        className={`p-2 rounded-xl border transition ${
                          favorites.includes(uni.id)
                            ? 'bg-yellow-50 border-yellow-200 text-yellow-500'
                            : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                        title={favorites.includes(uni.id) ? "Saralangandan o'chirish" : "Saralanganlarga qo'shish"}
                      >
                        <Star className={`h-4 w-4 ${favorites.includes(uni.id) ? 'fill-yellow-400 text-yellow-500' : 'text-slate-400'}`} />
                      </button>
                      <button
                        onClick={() => handleSelectUni(uni)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition flex items-center gap-1 shadow-md shadow-blue-500/10"
                        id={`btn-detail-${uni.id}`}
                      >
                        Batafsil
                        <ArrowUpRight className="h-3.5 w-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredUniversities.length === 0 && (
            <div className="text-center py-16 text-blue-200">
              <p className="text-base font-semibold text-blue-950">Hech qanday universitet topilmadi.</p>
              <p className="text-xs mt-1 text-slate-500">Iltimos, filtr orqali boshqa davlatni tanlang yoki so'rovni o'zgartiring.</p>
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

      {/* UNIVERSITY DETAILS FULL SCREEN OVERLAY (Batafsil bo'limi) */}
      <AnimatePresence>
        {selectedUni && (() => {
          const applyHelpSteps = [
            ...(selectedUni.country === 'AQSh' ? [
              {
                badge: "Hujjat topshirish",
                title: "1-Qadam: Common App portali va Account ochish",
                desc: "AQShdagi deyarli barcha top universitetlar, jumladan shu oliygoh ham 'Common Application' portali orqali hujjat qabul qiladi. Portalda xalqaro talaba toifasida akkaunt ochib, profilingizni faollashtiring hamda ushbu universitetni 'My Colleges' tizimiga qo'shing."
              },
              {
                badge: "Moliyaviy yordam",
                title: "2-Qadam: CSS Profile formasini to'ldirish (100% BEPUL o'qish siri)",
                desc: "Agar oilaviy o'rtacha daromadingiz yiliga $65,000 dan past bo'lsa, bu universitet oilasi muhtoj talabalarga to'liq bepul o'qish va yotoqxona (Full Need-Based Aid) taqdim etadi. Buni so'rash uchun College Board sayti orqali CSS Profile formasini batafsil to'ldirib, soliq va daromad guvohnomalarini ishonchli biriktirishingiz shart."
              },
              {
                badge: "Imtihonlar",
                title: "3-Qadam: SAT Digital va IELTS ballari",
                desc: "Ushbu oliygoh uchun IELTS kamida 6.5 - 7.5 talab qilinadi. Shuningdek xalqaro raqobatda ustun bo'lish uchun SAT Digital imtihonida asosan Matematika va Ingliz tili qismlaridan kamida 1420+ ball to'plash tavsiya etiladi."
              },
              {
                badge: "Insholar",
                title: "4-Qadam: Shaxsiy insho (Personal Statement) va Why Us",
                desc: "Komissiya sizning quruq ballaringizga emas, balki shaxsiyatingizga qaraydi. Global inshoni ingliz tilida 650 ta so'z oralig'ida yozing. Buning uchun 'THE CONTENT LAB' daxshatli AI modullarimiz yordamida 'Narrative Threader' va 'Hook' strategiyalaridan real foydalaning."
              },
              {
                badge: "Tavsiyanoma",
                title: "5-Qadam: Tavsiyalash va Maktab baholari transkripti",
                desc: "Sinf rahbaringiz hamda Matematika/Ingliz tili fani o'qituvchilaridan jami 2-3 ta rasmiy ingliz tilida tavsiyanoma (Recommendation Letter) yuklang. Maktabning so'nggi 3 yildagi choraklik va yillik baholari baholanish transkriptini ilova qiling."
              }
            ] : selectedUni.country === 'Germaniya' ? [
              {
                badge: "Tizim",
                title: "1-Qadam: Uni-assist portalidan ekvivalentlik tekshiruvi",
                desc: "O'zbekistondagi 11 yillik umumiy maktab hujjati Germaniya uchun yetarli hisoblanmaydi (Studienkolleg talab qilinishi mumkin). Uni-assist tizimida attestatingiz nemis 'HZB' standartiga tenglashtirilish darajasini tekshirishingiz muhim poydevor hisoblanadi."
              },
              {
                badge: "Viza kafolati",
                title: "2-Qadam: Bloklangan bank hisobi (Blocked Account) ochish",
                desc: "Germaniya elchixonasidan viza olish va yashash huquqini ta'minlash uchun nemis davlat banklarida (Expatrio, Fintiba) maxsus Bloklangan Hisob (Blocked Account) ochib, unga yiliga €11,900 miqdorida kafolatlangan pul o'tkazishingiz lozim."
              },
              {
                badge: "Til darajasi",
                title: "3-Qadam: Til sertifikatlarini biriktirish",
                desc: "Nemis tili o'quv yo'nalishlari uchun TestDaF kamida TDN 4 darajasi (C1), ingliz tilidagi xalqaro bakalavriat va magistratalar uchun esa IELTS Academic kamida 6.0/6.5 darajallari joriy qilinadi."
              },
              {
                badge: "Grantlar",
                title: "4-Qadam: DAAD va Deutschlandstipendium bepul yashash stipendiyalari",
                desc: "Germaniyada kontrakt to'lovi yo'q, o'qish bepul! Ammo turar-joy va yashashni ham tekin qilish uchun rasmiy DAAD tashkilotiga yoki oyiga €300 beradigan Deutschlandstipendium grantlariga hujjat berasiz."
              }
            ] : selectedUni.country === "Janubiy Koreya" ? [
              {
                badge: "GKS granti",
                title: "1-Qadam: GKS (Global Korea Scholarship) To'liq Grant arizasi",
                desc: "Koreyada 100% tekin o'qish, bepul yotoqxona va oyiga $900 oylik naqd mukofot olish uchun har yili fevral/sentyabr oylarida Global Koreya Granti (GKS) xizmatiga ariza bering. Buni elchixona yoki universitet orqali amalga oshirish mumkin."
              },
              {
                badge: "Til ko'rsatkichi",
                title: "2-Qadam: TOPIK yoki IELTS sertifikatlariga ega bo'lish",
                desc: "Koreys tili yo'nalishi uchun TOPIK kamida 3-4 daraja, ingliz tili darslari (Global Bachelor/Mundus) uchun esa IELTS 5.5 - 6.5 yetarli. TOPIK sertifikati bo'lsa universitetlar 30% dan 100% gacha bevosita ichki kontrakt grantlarini ham beradi."
              },
              {
                badge: "Apostil",
                title: "3-Qadam: Guvohnomalar va baholarni Apostil (Apostille) qilish",
                desc: "Koreya qonunlariga muvofiq, maktab attestatingiz va oilaviy munosabatlarni tasdiqlovchi FHDYo guvohnomalarini rasmiy notarial tarjima qildirib, Tashqi Ishlar Vazirligidan yoki Adliya Vazirligidan Apostil muhrlari bilan tasdiqlashingiz shart."
              },
              {
                badge: "Moliya",
                title: "4-Qadam: Viza uchun bankda $20,000 kafolat ko'rsatish",
                desc: "Agar siz GKS granti sohibi bo'lmasangiz, Koreya elchixonasidan viza olish uchun bank hisobingizda uzluksiz kamida $20,500 pul turganligini isbotlovchi xalqaro Bank guvohnomasi taqdim qilinadi."
              }
            ] : selectedUni.country === "Xitoy" ? [
              {
                badge: "CSC portal",
                title: "1-Qadam: Xitoy Hukumat Granti (CSC Scholarship) loyihasi",
                desc: "Xitoyda bepul dars olish, tekin yotoqxona hamda har oy $450 - $550 oylik stipendiyaga ega bo'lish uchun CSC rasmiy portalida ariza fo'ldiring va universitetning 'Agency Number' kodini mantiqiy kiriting."
              },
              {
                badge: "Salomatlik",
                title: "2-Qadam: Foreigner Physical Examination ko'rik hujjati",
                desc: "Xitoy elchixonasi talabiga asosan shifokor ko'rigidan o'tib, ingliz tildagi maxsus namunadagi 'Physical Examination' varag'ini rasm va muhrlar bilan rasmiylashtiring."
              },
              {
                badge: "Sertifikatlar",
                title: "3-Qadam: Sudlanmaganlik haqida ma'lumotnoma yuklash",
                desc: "Yagona Elektron Portal (my.gov.uz) orqali yashash joyingiz bo'yicha sudlanmaganlik to'g'risida inglizcha QR-kodli guvohnoma olib, portalga integratsiyalang."
              }
            ] : [
              {
                badge: "Tanlov",
                title: "1-Qadam: Oliygoh rasmiy ariza sahifasidagi talablarni o'rganish",
                desc: "Universitetning rasmiy saytida 'Admissions -> International Students' sahifasiga kirib, aynan shu yo'nalishdagi so'nggi muddatlarni va kerakli portallarni ko'rib chiqing."
              },
              {
                badge: "Baholar",
                title: "2-Qadam: GPA va til ko'rsatkichlarini rasmiylashtirish",
                desc: "Attestat yoki diplomni ingliz tiliga rasmiy tarjima qildiring, o'rtacha GPA ballaringizni baholab, IELTS Akademik sertifikatini biriktiring."
              },
              {
                badge: "Maktub",
                title: "3-Qadam: Motivatsion xat va tavsiyanoma draftlari",
                desc: "Nega aynan ushbu oliygoh va mutaxassislikni tanlaganingiz haqida daxshatli motivatsion insho tayyorlab, sobiq professorlardan talabchan tavsiyanoma oling."
              },
              {
                badge: "Intervyu",
                title: "4-Qadam: Suhbat va viza hujjatlari poydevori",
                desc: "Ariza tasdiqlangach, onlayn zoom intervyuga kirasiz. Keyin universitet taqdim etgan rasmiy elektron yo'llanma (masalan, I-20 yoki CAS) asosida talabalik vizasini rasmiylashtirasiz."
              }
            ])
          ];

          return (
            <div className="fixed inset-0 z-50 bg-[#f0f9ff] text-slate-900 flex flex-col h-screen w-screen overflow-hidden" id="uni-fullscreen-panel">
              
              {/* FIXED HIGH CONTRAST HEADER WITH BOLD BACK BUTTON AND EXIT CONTROL */}
              <div className="sticky top-0 bg-white border-b border-blue-100 px-6 py-4 flex items-center justify-between z-30 shadow-md shrink-0">
                <button
                  onClick={() => handleSelectUni(null)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-extrabold text-xs md:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
                  id="btn-close-uni-detail-fullscreen"
                >
                  <ArrowLeft className="h-5 w-5 text-blue-700 stroke-[3px]" />
                  <span>Orqaga Qaytish</span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-blue-100 border border-blue-200 px-3.5 py-1 text-xs font-black text-blue-800">
                    QS Rank: #{selectedUni.ranking}
                  </span>
                  
                  <button
                    onClick={() => toggleFavorite(selectedUni.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      favorites.includes(selectedUni.id)
                        ? 'bg-yellow-50 border-yellow-200 text-yellow-500'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Star className={`h-5 w-5 ${favorites.includes(selectedUni.id) ? 'fill-yellow-400 text-yellow-500' : 'text-slate-400'}`} />
                  </button>
                </div>
              </div>

              {/* OVERALL PORTAL LAYOUT GRID */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
                
                {/* UNIVERSITY TITLE HERO CONTAINER */}
                <div className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-[2.5rem] p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-white/10 border border-white/20 text-cyan-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                        {selectedUni.country} • {selectedUni.city}
                      </span>
                      <span className="bg-cyan-500/20 border border-cyan-400/30 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                        Reyting: #{selectedUni.ranking}
                      </span>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                      {selectedUni.name}
                    </h1>

                    <p className="text-xs md:text-sm text-cyan-100/85 leading-relaxed max-w-4xl font-medium">
                      {selectedUni.brief}
                    </p>
                  </div>
                </div>

                {/* MODAL NAVIGATION SUBTABS BAR */}
                <div className="flex border border-blue-200/60 bg-white p-1.5 rounded-[1.75rem] shadow-sm max-w-2xl mx-auto shrink-0">
                  <button
                    onClick={() => setModalSubTab('info')}
                    className={`flex-1 py-3 text-center text-xs md:text-sm font-black rounded-2xl transition-all duration-200 uppercase tracking-widest cursor-pointer ${
                      modalSubTab === 'info'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
                    }`}
                  >
                    Oliygoh haqida
                  </button>

                  <button
                    onClick={() => setModalSubTab('steps')}
                    className={`flex-1 py-3 text-center text-xs md:text-sm font-black rounded-2xl transition-all duration-200 uppercase tracking-widest cursor-pointer ${
                      modalSubTab === 'steps'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
                    }`}
                  >
                    0-dan Qabul Yo'li 🧭
                  </button>

                  <button
                    onClick={() => setModalSubTab('chat')}
                    className={`flex-1 py-3 text-center text-xs md:text-sm font-black rounded-2xl transition-all duration-200 uppercase tracking-widest cursor-pointer flex items-center justify-center gap-1.5 ${
                      modalSubTab === 'chat'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
                    }`}
                  >
                    <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                    <span>AI Maslahatchi</span>
                  </button>
                </div>

                {/* TAB SWITCH CONTENTS */}
                <div className="bg-white rounded-[2.5rem] border border-blue-100/60 p-6 md:p-8 shadow-xl shadow-blue-900/[0.02]">
                  
                  {modalSubTab === 'info' && (
                    <div className="space-y-8">
                      <div className="space-y-3 text-left">
                        <h3 className="text-lg md:text-xl font-extrabold text-blue-950">
                          Batafsil ma'lumotlar va statistikalar
                        </h3>
                        <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-semibold">
                          {selectedUni.description}
                        </p>
                      </div>

                      {/* Financial Metrics and Deadlines details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        <div className="rounded-3xl border border-blue-100 bg-[#f8fafc] p-6 flex items-start gap-4 shadow-sm">
                          <div className="p-3 bg-blue-100 border border-blue-200 text-blue-700 rounded-2xl shrink-0">
                            <DollarSign className="h-6 w-6 stroke-[2.5px]" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Yillik Kontrakt va Grantlar</h4>
                            <p className="text-xs md:text-sm text-blue-950 font-black leading-snug">
                              {selectedUni.fee}
                            </p>
                          </div>
                        </div>

                        <div className="rounded-3xl border border-blue-100 bg-[#f8fafc] p-6 flex items-start gap-4 shadow-sm">
                          <div className="p-3 bg-blue-100 border border-blue-200 text-blue-700 rounded-2xl shrink-0">
                            <Calendar className="h-6 w-6 stroke-[2.5px]" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Ariza topshirish oxirgi muddatlari (Deadlines)</h4>
                            <p className="text-xs md:text-sm text-blue-950 font-black leading-snug">
                              {selectedUni.deadlines}
                            </p>
                          </div>
                        </div>

                      </div>

                      {/* Required Documents checklist for Admissions */}
                      <div className="rounded-3xl border border-blue-100 bg-[#f8fafc] p-6 md:p-8 space-y-4">
                        <h4 className="font-extrabold text-sm md:text-base text-blue-950 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-700 shrink-0" />
                          <span>Qabul komissiyasiga talab qilinadigan hujjatlar:</span>
                        </h4>
                        
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs md:text-sm text-slate-800 font-bold">
                          {selectedUni.documents.map((doc, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle className="h-4.5 w-4.5 text-green-600 shrink-0 mt-0.5" />
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  )}

                  {modalSubTab === 'steps' && (
                    <div className="space-y-6">
                      <div className="border-b border-slate-100 pb-4 text-left">
                        <h3 className="text-lg md:text-xl font-extrabold text-blue-950">
                          {selectedUni.country}da O'qishga Kirishning 0-dan Batafsil Yo'riqnomasi 🧭
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 font-semibold">
                          Ushbu qavatda aynan {selectedUni.name} oliygohi joylashgan mamlakatning rasmiy va real o'qish qoidalari ketma-ketlikda tushuntiriladi.
                        </p>
                      </div>

                      <div className="relative border-l-2 border-blue-100 pl-6 ml-4 space-y-8">
                        {applyHelpSteps.map((step, sIdx) => (
                          <div key={sIdx} className="relative text-left">
                            
                            {/* Number Indicator Pill */}
                            <span className="absolute -left-[37px] top-1 flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 border-2 border-white text-white text-[10px] font-black shadow-sm font-mono z-10">
                              {sIdx + 1}
                            </span>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm md:text-base font-black text-blue-950 leading-snug">
                                  {step.title}
                                </h4>
                                <span className="bg-blue-50 border border-blue-150 text-blue-800 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                  {step.badge}
                                </span>
                              </div>
                              <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-semibold">
                                {step.desc}
                              </p>
                            </div>

                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs md:text-sm text-amber-800 font-bold leading-normal text-left">
                        ⚠️ **Eslatma**: Ushbu yo'llanmalar TopGrand akademik kengashi tomonidan so'nggi qabul hisobotlaridan mustaqil yig'ilgan real shablonlar hisoblanadi. Har bir hujjat va esse xatlarini topshirishdan oldin rasmiy veb-saytdan tekshirish tavsiya etiladi.
                      </div>
                    </div>
                  )}

                  {modalSubTab === 'chat' && (
                    /* INTERACTIVE AI CHAT COUNSELOR */
                    <div className="flex flex-col h-full min-h-[400px]">
                      
                      <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center text-left">
                        <div>
                          <h3 className="text-base font-extrabold text-blue-950 flex items-center gap-1.5">
                            <Sparkles className="h-4.5 w-4.5 text-cyan-600" />
                            <span>{selectedUni.name} Rasmiy AI Vakili</span>
                          </h3>
                          <p className="text-[10px] text-slate-500 font-semibold font-mono">
                            OFFICIAL ACADEMIC COGNITIVE CONSOLE
                          </p>
                        </div>

                        <span className="bg-blue-50 text-blue-800 text-[10px] font-black px-3 py-1 rounded-full border border-blue-100">
                          Limit remaining: {5 - (user.isPremium ? 0 : uniQuestionsCount)} / 5
                        </span>
                      </div>

                      {/* Scrollable conversation logs */}
                      <div className="flex-1 overflow-y-auto p-4 md:p-6 rounded-3xl bg-slate-50 border border-blue-100/50 text-xs text-slate-800 space-y-4 max-h-[380px] overflow-x-hidden shadow-inner text-left">
                        
                        {/* Initial Greeting message bubble */}
                        <div className="p-4 rounded-[1.5rem] bg-white border border-blue-100 text-slate-800 shadow-sm max-w-[90%] md:max-w-[80%]">
                          <p className="font-extrabold flex items-center gap-1.5 mb-1 text-blue-900 text-xs">
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            <span>{selectedUni.name} AI Maslahatchisi</span>
                          </p>
                          <p className="font-semibold leading-relaxed text-xs md:text-sm text-slate-700">
                            Assalomu alaykum, muhtaram talaba! Men {selectedUni.name} universitetining rasmiy sun'iy intellekt vakili hamda qabul suhbatdoshiman. Sizga oliygohdagi grant imkoniyatlari, viza qoidalari, yashash sharoitlari yoki ariza topshirish sirlari haqida 100% haqiqiy tahliliy javob beraman.
                          </p>
                        </div>

                        {/* Real Conversation history */}
                        {(uniChatHistory[selectedUni.id] || []).map((msg, i) => (
                          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-4 rounded-[1.5rem] max-w-[85%] md:max-w-[75%] shadow-sm ${
                              msg.sender === 'user'
                                ? 'bg-blue-600 text-white ml-auto border border-blue-500 font-extrabold'
                                : 'bg-white border border-blue-100 text-slate-900 mr-auto font-bold'
                            }`}>
                              <p className={`font-black text-[9px] uppercase tracking-wider mb-1 ${
                                msg.sender === 'user' ? 'text-blue-200' : 'text-blue-800'
                              }`}>
                                {msg.sender === 'user' ? 'Siz' : 'AI Maslahatchi'}
                              </p>
                              <p className="whitespace-pre-line leading-relaxed text-xs md:text-sm">{msg.text}</p>
                            </div>
                          </div>
                        ))}

                        {uniChatLoading && (
                          <div className="flex justify-start animate-pulse">
                            <div className="bg-white border border-blue-100 p-4 rounded-3xl flex items-center gap-2.5 shadow-sm">
                              <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span className="text-xs text-blue-800 font-black">AI ma'lumotlarni tahlil qilmoqda...</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Chat interactive input bar */}
                      <form onSubmit={sendUniChatMessage} className="mt-4 flex gap-2 shrink-0">
                        <input
                          type="text"
                          value={uniChatInput}
                          onChange={(e) => setUniChatInput(e.target.value)}
                          placeholder={`${selectedUni.name} haqida savol bering (Masalan: SAT ballisiz qabul bormi?) ...`}
                          className="flex-grow bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200 rounded-2xl px-4 py-3.5 text-xs md:text-sm outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm font-semibold"
                        />
                        <button
                          type="submit"
                          disabled={uniChatLoading || !uniChatInput.trim()}
                          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black transition-all flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40 shadow-md shadow-blue-600/10"
                        >
                          <Send className="h-4.5 w-4.5" />
                        </button>
                      </form>

                    </div>
                  )}

                </div>

                {/* IMMUTABLE ACADEMIC CALL TO ACTIONS */}
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-between border-t border-blue-105 pt-6 pb-12">
                  <a
                    href={selectedUni.website}
                    target="_blank"
                    rel="referrer noopener"
                    className="flex items-center gap-1.5 text-xs md:text-sm text-blue-700 font-extrabold hover:underline"
                  >
                    <Globe className="h-4.5 w-4.5 text-blue-600" />
                    <span>Rasmiy OTM Veb-Sayti: {selectedUni.website.replace("https://www.", "")}</span>
                  </a>

                  <a
                    href={selectedUni.website}
                    target="_blank"
                    rel="referrer noopener"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 hover:scale-[1.01] transition-all px-6 py-3.5 text-xs md:text-sm font-black text-white shadow-lg shadow-blue-900/15 cursor-pointer"
                  >
                    Oliygoh Saytida Online Ariza Topshirish <ArrowUpRight className="h-4.5 w-4.5 text-white" />
                  </a>
                </div>

              </div>

            </div>
          );
        })()}
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
