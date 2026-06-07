import React, { useState } from 'react';
import { 
  Sparkles, Award, MapPin, DollarSign, Calendar, Globe, ArrowUpRight, 
  Search, Sliders, CheckCircle, GraduationCap, ChevronRight, BookOpen, AlertCircle, Send, Key
} from 'lucide-react';
import { University } from '../types';
import { universitiesData } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export default function GrantCalculator() {
  // Input fields
  const [ielts, setIelts] = useState<number>(6.5);
  const [sat, setSat] = useState<number>(1200);
  const [gpa, setGpa] = useState<number>(4.2); // out of 5.0 scale
  const [targetRegion, setTargetRegion] = useState<string>('barchasi');
  
  const [hasSearched, setHasSearched] = useState<boolean>(true); // active by default to show initial match
  const [selectedUni, setSelectedUni] = useState<University | null>(null);

  // Filter and search logic with fallback
  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasSearched(true);
    // Scroll to results cleanly
    const block = document.getElementById('calculator-results-grid');
    if (block) {
      block.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Run the match algorithm
  // Displays at least 20+ universities, prioritizing those with 100% grants at the absolute top
  const matchedUniversities = (() => {
    const matched = universitiesData.filter((uni) => {
      // 1. Region match
      if (targetRegion !== 'barchasi' && uni.country !== targetRegion) {
        return false;
      }

      // 2. Scores match (Flexible match to ensure we get a full list of matching institutions!)
      // If student has IELTS >= minimumIelts - 1.0 (to allow conditional or pathway search)
      const matchesIelts = ielts >= (uni.minimumIelts || 5.0) - 1.0;
      const matchesGpa = gpa >= (uni.minimumGpa || 3.0) - 1.0;
      
      return matchesIelts && matchesGpa;
    });

    // Sort descending by grantPercentage, then ascending by ranking (higher ranks higher)
    return matched.sort((a, b) => {
      const gA = a.grantPercent ?? 0;
      const gB = b.grantPercent ?? 0;
      if (gA !== gB) return gB - gA; // descending
      return (a.ranking ?? 999) - (b.ranking ?? 999); // ascending rank
    });
  })();

  // Guarantee at least 20+ recommendations are visible
  const displayedMatches = matchedUniversities.slice(0, Math.max(20, matchedUniversities.length));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8" id="grant-calculator-wrapper">
      
      {/* HEADER SECTION FOR CALCULATOR */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <span className="bg-blue-100 text-blue-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider font-mono shadow-sm">
          Shaxsiy Qabul & Grant Portali
        </span>
        <h2 className="text-2xl md:text-4xl font-black text-blue-950 mt-3 tracking-tight leading-tight">
          Chet El va O'zbekiston Oliygo'hlari Grant Shartlari Kalkulyatori
        </h2>
        <p className="text-sm text-slate-600 mt-3 font-semibold leading-relaxed">
          IELTS/TOEFL, SAT bali hamda GPA ko'rsatkichlaringizni kiriting va 100% grant (kontrakt bepul) beradigan oliygohlarni yuqoridan quyiga tartiblangan holda toping!
        </p>
      </div>

      {/* TELEGRAM JOIN BANNER - INTEGRATED DIRECTLY IN THE MIDDLE FOR HIGH VISIBILITY */}
      <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 rounded-[2rem] p-6 md:p-8 text-white shadow-xl shadow-blue-500/10 relative overflow-hidden transition transform hover:scale-[1.01] duration-300 z-10">
        <div className="absolute right-[-5%] top-[-20%] w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-[-5%] bottom-[-20%] w-40 h-40 bg-sky-300/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest font-mono">
              Rasmiy Hamjamiyat
            </span>
            <h3 className="text-lg md:text-2xl font-black leading-tight text-white">
              Bizni Telegram kanalda kuzating va so'nggi yangiliklardan daxshatli tezkor xabardor bo'ling!
            </h3>
            <p className="text-xs md:text-sm text-blue-105 font-bold">
              Har kuni 100% chet el universitetlari grantlari, viza sirlari va bepul darsliklar @Topgrands kanalida!
            </p>
          </div>
          <button
            onClick={() => window.open('https://t.me/Topgrands', '_blank', 'noopener,noreferrer')}
            className="px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 active:scale-[0.98] transition rounded-2xl text-sm font-black shadow-lg flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center shrink-0"
            id="telegram-channel-btn"
            style={{ minHeight: '48px' }}
          >
            <Send className="h-5 w-5 text-blue-700 fill-current" />
            <span>@Topgrands qo'shilish</span>
          </button>
        </div>
      </div>

      {/* CALCULATOR FORM CONTROLS */}
      <div className="bg-white/80 border border-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/5 backdrop-blur-md">
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* IELTS SELECT VALUE */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-blue-950 uppercase tracking-widest font-mono">
                IELTS Score: <span className="text-blue-600 font-extrabold text-sm font-sans">{ielts}</span>
              </label>
              <div className="relative">
                <select
                  value={ielts}
                  onChange={(e) => setIelts(parseFloat(e.target.value))}
                  className="w-full bg-[#f8fafc] border border-blue-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400 select-touch"
                  style={{ minHeight: '48px' }}
                >
                  {[4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((val) => (
                    <option key={val} value={val}>{val} Score</option>
                  ))}
                </select>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold font-mono uppercase">TOEFL ekvivalenti: {(ielts * 15 - 5)} (Taxminan)</p>
            </div>

            {/* SAT VALUE */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-blue-950 uppercase tracking-widest font-mono">
                SAT / ACT Score: <span className="text-blue-600 font-extrabold text-sm font-sans">{sat}</span>
              </label>
              <select
                value={sat}
                onChange={(e) => setSat(parseInt(e.target.value))}
                className="w-full bg-[#f8fafc] border border-blue-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400 select-touch"
                style={{ minHeight: '48px' }}
              >
                {[800, 900, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600].map((val) => (
                  <option key={val} value={val}>{val} Ball (SAT)</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 font-semibold font-mono uppercase">AQSh & Xitoy uchun ustunlik</p>
            </div>

            {/* GPA VALUE */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-blue-950 uppercase tracking-widest font-mono">
                GPA Bahosi: <span className="text-blue-600 font-extrabold text-sm font-sans">{gpa}</span>
              </label>
              <select
                value={gpa}
                onChange={(e) => setGpa(parseFloat(e.target.value))}
                className="w-full bg-[#f8fafc] border border-blue-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400 select-touch"
                style={{ minHeight: '48px' }}
              >
                {[2.5, 3.0, 3.2, 3.5, 3.8, 4.0, 4.2, 4.5, 4.7, 4.8, 4.9, 5.0].map((val) => (
                  <option key={val} value={val}>{val} O'rtacha (5 lik tizim)</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 font-semibold font-mono uppercase">Muvaffaqiyatli reyting: {Math.min(100, Math.floor(gpa * 20))}%</p>
            </div>

            {/* TARGET COUNTRY SELECTOR */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-blue-950 uppercase tracking-widest font-mono">
                Maqsadli Davlat:
              </label>
              <select
                value={targetRegion}
                onChange={(e) => setTargetRegion(e.target.value)}
                className="w-full bg-[#f8fafc] border border-blue-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400 select-touch"
                style={{ minHeight: '48px' }}
              >
                <option value="barchasi">Barcha Davlatlar (Uzb + Xorij)</option>
                <option value="O'zbekiston">O'zbekiston (UZB)</option>
                <option value="AQSh">AQSh (USA)</option>
                <option value="Buyuk Britaniya">Buyuk Britaniya (UK)</option>
                <option value="Germaniya">Germaniya</option>
                <option value="Kanada">Kanada</option>
                <option value="Janubiy Koreya">Janubiy Koreya</option>
                <option value="Yaponiya">Yaponiya</option>
                <option value="Turkiya">Turkiya</option>
                <option value="Italiya">Italiya</option>
                <option value="Singapur">Singapur</option>
                <option value="Shveytsariya">Shveytsariya</option>
                <option value="Fransiya">Fransiya</option>
                <option value="Xitoy">Xitoy</option>
              </select>
              <p className="text-[10px] text-slate-500 font-semibold font-mono uppercase">Talablar avtomat yuklanadi</p>
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:brightness-110 active:scale-[0.99] transition font-black text-white text-sm shadow-xl shadow-blue-500/15 flex items-center justify-center gap-2 cursor-pointer"
            style={{ minHeight: '48px' }}
            id="calculate-find-options-btn"
          >
            <Sparkles className="h-5 w-5 text-white animate-spin-slow" />
            <span>Muvofiq Keluvchi 20+ Variantni Hisoblash & Topish</span>
          </button>
        </form>
      </div>

      {/* CALCULATOR MATCHED RESULTS GRID DISPLAY */}
      {hasSearched && (
        <div className="space-y-6" id="calculator-results-grid">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-200 pb-4">
            <div>
              <h3 className="text-xl font-black text-blue-950 flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                Siz uchun topilgan grant imkoniyatlari ({displayedMatches.length} ta oliygohlar)
              </h3>
              <p className="text-xs text-slate-500 font-bold mt-1">100% cheksiz grantlar doimo birinchi navbatda ko'rsatiladi</p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="inline-block h-3.5 w-3.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-black text-slate-600 font-mono uppercase">Natijalar: Real tahlil</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="calculator-cards-grid">
            {displayedMatches.map((uni, index) => {
              const is100PercentGrant = uni.grantPercent === 100;
              
              return (
                <div
                  key={uni.id}
                  className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-md transition duration-300 hover:shadow-xl hover:border-blue-300 transform hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top grant status badge */}
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono border ${
                        is100PercentGrant 
                          ? 'bg-green-150 text-green-800 border-green-200' 
                          : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}>
                        Grant: {uni.grantPercent}% {is100PercentGrant ? 'FULL-RIDE' : ''}
                      </span>
                      
                      <span className="text-xs font-mono font-bold text-slate-500">
                        Oliygoh Rank: #{uni.ranking}
                      </span>
                    </div>

                    {/* University Titles */}
                    <div>
                      <h4 className="text-base font-black text-blue-950 leading-tight">
                        {uni.name}
                      </h4>
                      <p className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span>{uni.city}, {uni.country}</span>
                      </p>
                    </div>

                    {/* Minimum parameters required */}
                    <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4.5 space-y-2 text-xs text-slate-700 font-semibold font-mono">
                      <div className="flex items-center justify-between">
                        <span>Min. IELTS score:</span>
                        <span className="text-blue-700 font-black">{uni.minimumIelts}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Min. GPA score:</span>
                        <span className="text-blue-700 font-black">{uni.minimumGpa}</span>
                      </div>
                      {(uni.country === "AQSh" || uni.country === "Xitoy") && (
                        <div className="flex items-center justify-between">
                          <span>Min. SAT score:</span>
                          <span className="text-blue-700 font-black">{uni.minimumSat}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                      {uni.brief}
                    </p>
                  </div>

                  {/* Actions Area */}
                  <div className="mt-6 pt-4 border-t border-slate-150 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500 font-bold font-mono">
                      Kontrakt: {uni.grantPercent === 100 ? 'Mutlaqo Bepul' : 'Puli qisman qoplanadi'}
                    </span>
                    
                    <button
                      onClick={() => setSelectedUni(uni)}
                      className="px-4 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition rounded-xl cursor-pointer shadow-sm flex items-center gap-1"
                      style={{ minHeight: '38px' }}
                    >
                      <span>Batafsil ko'rish</span>
                      <ChevronRight className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {displayedMatches.length === 0 && (
            <div className="text-center py-12 bg-white/60 border border-slate-150 rounded-[2rem] max-w-xl mx-auto space-y-3">
              <AlertCircle className="h-10 w-10 text-blue-600 mx-auto animate-bounce" />
              <h4 className="text-lg font-black text-blue-950">Afsuski muvofiq variantlar topilmadi</h4>
              <p className="text-xs text-slate-500 font-bold">Iltimos, IELTS balingizni yoki GPA darajangizni biroz pasaytirib qaytadan urining.</p>
            </div>
          )}

        </div>
      )}

      {/* DETAILED DIALOG MODAL VIEW FOR GRANTS & INSTRUCTIONS */}
      <AnimatePresence>
        {selectedUni && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/45 p-4 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] border border-slate-200 w-full max-w-2xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-800"
              id="uni-details-modal"
            >
              {/* Close Button top-right */}
              <button
                onClick={() => setSelectedUni(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full cursor-pointer transition"
                id="btn-close-uni-details"
                style={{ width: '40px', height: '40px' }}
              >
                ✕
              </button>

              {/* Title Header */}
              <div className="space-y-3 mb-6 pr-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 border border-green-200 text-green-900 text-xs font-black px-4 py-1">
                  <Award className="h-4 w-4 text-green-700" />
                  <span>Grant Sharti: {selectedUni.grantPercent}% {selectedUni.grantPercent === 100 ? 'TO\'LIQ FINANSIY' : 'O\'QISH CHEGIRMASI'}</span>
                </span>
                
                <h3 className="text-xl md:text-2xl font-black text-blue-950 leading-tight">
                  {selectedUni.name}
                </h3>
                
                <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>{selectedUni.city}, {selectedUni.country} — Jahon Reyting: #{selectedUni.ranking}</span>
                </p>
              </div>

              {/* Grid content blocks */}
              <div className="space-y-6 text-sm font-semibold text-slate-800">
                
                {/* 1. Qancha grant oladi block */}
                <div className="bg-green-50/50 border border-green-150 rounded-2.5xl p-5 space-y-2">
                  <h4 className="text-xs font-black text-green-900 uppercase tracking-widest font-mono flex items-center gap-1">
                    <DollarSign className="h-4.5 w-4.5 text-green-700 shrink-0" />
                    <span>Qancha Grant va Stipendiya Ajraladi?</span>
                  </h4>
                  <div className="text-sm font-semibold text-slate-800 space-y-1.5">
                    <p className="font-extrabold text-blue-900">
                      {selectedUni.fee}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {selectedUni.grantPercent === 100 
                        ? "Ushbu oliygoh oilaviy daromadi va talab yutuqlariga asosan kontrakt pulini butkul qoplaydi. Bunga qo'shimcha ravishda oylik oziq-ovqat stipendiyalari hamda yotoqxona xarajatlari to'liq kiritilgan."
                        : `Oliygohda o'quv yilining boshlanishi bilan ota-ona yukini kamaytirish uchun ${selectedUni.grantPercent}% grant beriladi. Kollej oqshomidagi qo'shimcha ish va part-time loyihalar orqali qolgan qismni osongina to'lash mumkin.`}
                    </p>
                  </div>
                </div>

                {/* 2. Nimalar qila oladi block */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-blue-950 uppercase tracking-widest font-mono flex items-center gap-1">
                    <BookOpen className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>Oliygoh Akademik Qobiliyatlari va Yo'nalishlari</span>
                  </h4>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-semibold">
                    {selectedUni.description}
                  </p>
                </div>

                {/* 3. Ariza Topsirish Qadam-baqadam Hujjatlar */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-blue-950 uppercase tracking-widest font-mono flex items-center gap-1">
                    <CheckCircle className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>Kerakli Hujjatlar Ro'yxati & Ko'rsatma (Konsaltingsiz topshiring!)</span>
                  </h4>
                  <ul className="space-y-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-2.5xl p-5 shadow-inner">
                    {selectedUni.documents.map((doc, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deadlines and Official web */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-150">
                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate-500 font-bold font-mono uppercase">Topshirish Muddatlari:</span>
                    <span className="text-xs font-mono font-black text-blue-950 flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-blue-600 shrink-0" />
                      {selectedUni.deadlines}
                    </span>
                  </div>

                  <div className="space-y-1 sm:text-right">
                    <span className="block text-[10px] text-slate-500 font-bold font-mono uppercase">Rasmiy Universitet Veb-sahifasi:</span>
                    <a
                      href={selectedUni.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-black text-blue-700 hover:text-blue-800 transition"
                    >
                      <Globe className="h-4 w-4 text-blue-600" />
                      <span>{selectedUni.website.replace('https://', '')}</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Close footer button */}
              <div className="mt-8">
                <button
                  onClick={() => setSelectedUni(null)}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.99] transition font-black text-slate-850 text-sm text-center"
                  style={{ minHeight: '48px' }}
                >
                  Yopish
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
