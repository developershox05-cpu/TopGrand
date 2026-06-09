import React, { useState } from 'react';
import { 
  Award, MapPin, DollarSign, Calendar, Globe, ArrowUpRight, 
  CheckCircle, GraduationCap, ChevronRight, BookOpen, AlertCircle, Send
} from 'lucide-react';
import { University } from '../types';
import { universitiesData } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface GrantCalculatorProps {
  currentLang?: 'uz' | 'en' | 'ru';
}

export default function GrantCalculator({ currentLang = 'uz' }: GrantCalculatorProps) {
  // Input fields
  const [ielts, setIelts] = useState<number>(6.5);
  const [sat, setSat] = useState<number>(1200);
  const [gpa, setGpa] = useState<number>(4.2); // out of 5.0 scale
  const [targetRegion, setTargetRegion] = useState<string>('barchasi');
  
  const [hasSearched, setHasSearched] = useState<boolean>(true); // active by default to show initial match
  const [selectedUni, setSelectedUni] = useState<University | null>(null);

  // Localization Dictionary
  const langText = {
    uz: {
      subBadge: "Shaxsiy Qabul & Grant Portali",
      header: "Chet El va O'zbekiston Oliygo'hlari Grant Shartlari Kalkulyatori",
      subheader: "IELTS/TOEFL, SAT bali hamda GPA ko'rsatkichlaringizni kiriting va 100% grant (kontrakt bepul) beradigan oliygohlarni yuqoridan quyiga tartiblangan holda toping!",
      tgBadge: "Rasmiy Hamjamiyat",
      tgTitle: "Bizni Telegram kanalda kuzating va so'nggi yangiliklardan daxshatli tezkor xabardor bo'ling!",
      tgDesc: "Har kuni 100% chet el universitetlari grantlari, viza sirlari va bepul darsliklar @Topgrands kanalida!",
      tgBtn: "@Topgrands qo'shilish",
      labelIelts: "IELTS Score:",
      labelSat: "SAT / ACT Score:",
      labelGpa: "GPA Bahosi:",
      labelRegion: "Maqsadli Davlat:",
      gpaScale: "O'rtacha (5 lik tizim)",
      toeflEquiv: "TOEFL ekvivalenti: {score} (Taxminan)",
      satAdvantage: "AQSh & Xitoy uchun ustunlik",
      gpaSuccess: "Muvaffaqiyatli reyting: {score}%",
      countryAll: "Barcha Davlatlar (Uzb + Xorij)",
      countryDefault: "Barcha Davlatlar",
      regionAutoLoad: "Talablar avtomat yuklanadi",
      btnCalculate: "Muvofiq Keluvchi 20+ Variantni Hisoblash & Topish",
      resultsHead: "Siz uchun topilgan grant imkoniyatlari ({count} ta oliygohlar)",
      resultsSub: "100% cheksiz grantlar doimo birinchi navbatda ko'rsatiladi",
      resultsRealAnalysis: "Natijalar: Real tahlil",
      minIelts: "Min. IELTS score:",
      minGpa: "Min. GPA score:",
      minSat: "Min. SAT score:",
      contractFree: "Mutlaqo Bepul",
      contractPartial: "Puli qisman qoplanadi",
      btnDetails: "Batafsil ko'rish",
      noResultsHead: "Afsuski muvofiq variantlar topilmadi",
      noResultsDesc: "Iltimos, IELTS balingizni yoki GPA darajangizni biroz pasaytirib qaytadan urining.",
      modalGrantBadge: "Grant Sharti:",
      modalFullFunded: "TO'LIQ FINANSIY",
      modalDiscount: "O'QISH CHEGIRMASI",
      modalWorldRank: "Jahon Reyting:",
      modalStipendHead: "Qancha Grant va Stipendiya Ajraladi?",
      modalFullFundedDesc: "Ushbu oliygoh oilaviy daromadi va talab yutuqlariga asosan kontrakt pulini butkul qoplaydi. Bunga qo'shimcha ravishda oylik oziq-ovqat stipendiyalari hamda yotoqxona xarajatlari to'liq kiritilgan.",
      modalPartialDesc: "Oliygohda o'quv yilining boshlanishi bilan ota-ona yukini kamaytirish uchun {percent}% grant beriladi. Kollej oqshomidagi qo'shimcha ish va part-time loyihalar orqali qolgan qismni osongina to'lash mumkin.",
      modalAcademics: "Oliygoh Akademik Qobiliyatlari va Yo'nalishlari",
      modalDocsHead: "Kerakli Hujjatlar Ro'yxati & Ko'rsatma (Konsaltingsiz topshiring!)",
      modalDeadlineLabel: "Topshirish Muddatlari:",
      modalWebLabel: "Rasmiy Universitet Veb-sahifasi:",
      btnClose: "Yopish"
    },
    en: {
      subBadge: "Personal Admissions & Scholarship Portal",
      header: "Foreign & Domestic Scholarship Match Calculator",
      subheader: "Input your IELTS/TOEFL, SAT parameters, and GPA average to fetch universities offering up to 100% full-ride scholarships, organized descending by grant value!",
      tgBadge: "Official Community",
      tgTitle: "Join our official Telegram channel and secure amazing direct scholarship resources!",
      tgDesc: "Every day 100% full scholarships, visa hacks, and free textbooks at @Topgrands!",
      tgBtn: "Join @Topgrands",
      labelIelts: "IELTS Score:",
      labelSat: "SAT / ACT Score:",
      labelGpa: "GPA Grade:",
      labelRegion: "Target Destination:",
      gpaScale: "Average (5.0 Scale)",
      toeflEquiv: "TOEFL Equivalent: {score} (Estimate)",
      satAdvantage: "Advantage in USA & China admissions",
      gpaSuccess: "Success Rate: {score}%",
      countryAll: "All Countries (Uzb + International)",
      countryDefault: "All Regions",
      regionAutoLoad: "Requirements loaded dynamically",
      btnCalculate: "Calculate & Show Best Matching Opportunities",
      resultsHead: "Scholarship Matches Identified For You ({count} universities)",
      resultsSub: "100% full-ride scholarships are always prioritized and listed first",
      resultsRealAnalysis: "Results: Live Audit",
      minIelts: "Min. IELTS score:",
      minGpa: "Min. GPA score:",
      minSat: "Min. SAT score:",
      contractFree: "100% Free Tuition",
      contractPartial: "Partial Tuition Coverage",
      btnDetails: "View Details",
      noResultsHead: "No matching opportunities identified",
      noResultsDesc: "Please try lowering your targeted IELTS average or GPA standard to fetch more matches.",
      modalGrantBadge: "Funding Scheme:",
      modalFullFunded: "FULLY FUNDED",
      modalDiscount: "TUITION SCHOLARSHIP",
      modalWorldRank: "World Rank:",
      modalStipendHead: "What Financial Aid is Provided?",
      modalFullFundedDesc: "This university fully covers tuition expenses based on family assets or merit. Additionally, active monthly food stipends and free dorm allocations are fully structured.",
      modalPartialDesc: "A scholarship of {percent}% is automatically granted upon enrollment to lower parent cost. Rest of the tuition can be easily offset via on-campus student employment details.",
      modalAcademics: "Academic Programs & Capabilities",
      modalDocsHead: "Required Application Checklist & Instructions (No consulting needed!)",
      modalDeadlineLabel: "Application Deadlines:",
      modalWebLabel: "Official University Website:",
      btnClose: "Close"
    },
    ru: {
      subBadge: "Персональный портал грантов и зачисления",
      header: "Калькулятор условий грантов в зарубежных и местных вузах",
      subheader: "Введите ваши баллы IELTS/TOEFL, SAT и средний балл GPA, чтобы мгновенно подобрать вузы со 100% покрытием стоимости обучения!",
      tgBadge: "Официальное сообщество",
      tgTitle: "Следите за нами в Telegram и получайте ценнейшие инструкции по поступлению!",
      tgDesc: "Каждый день 100% гранты, секреты визовой анкеты и бесплатные материалы на канале @Topgrands!",
      tgBtn: "Вступить в @Topgrands",
      labelIelts: "Балл IELTS:",
      labelSat: "Балл SAT / ACT:",
      labelGpa: "Оценка GPA:",
      labelRegion: "Целевая страна:",
      gpaScale: "Средний балл (5-балльная шкала)",
      toeflEquiv: "Эквивалент TOEFL: {score} (Приблизительно)",
      satAdvantage: "Преимущество для поступления в США и Китай",
      gpaSuccess: "Уровень успешности: {score}%",
      countryAll: "Все страны (Узбекистан + Зарубежье)",
      countryDefault: "Все страны",
      regionAutoLoad: "Требования загружаются автоматически",
      btnCalculate: "Рассчитать и подобрать подходящие варианты (20+)",
      resultsHead: "Найденные для вас гранты ({count} университетов)",
      resultsSub: "Программы со 150% и 100% грантом всегда выводятся на первых позициях",
      resultsRealAnalysis: "Результаты: Онлайн анализ",
      minIelts: "Мин. балл IELTS:",
      minGpa: "Мин. балл GPA:",
      minSat: "Мин. балл SAT:",
      contractFree: "Абсолютно бесплатно",
      contractPartial: "Частичное покрытие контракта",
      btnDetails: "Подробнее",
      noResultsHead: "К сожалению, подходящих вариантов не найдено",
      noResultsDesc: "Попробуйте немного понизить желаемый балл IELTS или средний GPA и повторите поиск.",
      modalGrantBadge: "Схема гранта:",
      modalFullFunded: "ПОЛНОЕ ФИНАНСИРОВАНИЕ",
      modalDiscount: "СКИДКА НА ОБУЧЕНИЕ",
      modalWorldRank: "Мировой рейтинг:",
      modalStipendHead: "Какая финансовая поддержка оказывается?",
      modalFullFundedDesc: "Этот университет полностью покрывает стоимость контракта на основе доходов семьи и личных заслуг. Дополнительно предоставляются ежемесячные стипендии на питание и бесплатное общежитие.",
      modalPartialDesc: "При зачислении предоставляется скидка в размере {percent}%, что значительно снижает финансовую нагрузку на родителей. Оставшуюся часть можно покрыть за счет подработки в кампусе.",
      modalAcademics: "Академические программы и направления",
      modalDocsHead: "Список необходимых документов и инструкция (Поступайте сами!)",
      modalDeadlineLabel: "Сроки подачи заявок:",
      modalWebLabel: "Официальный сайт университета:",
      btnClose: "Закрыть"
    }
  };

  const text = langText[currentLang] || langText['uz'];

  // Country translations helper for accurate multilingual lists
  const translateCountry = (country: string) => {
    if (currentLang === 'uz') return country;
    const mapping: Record<string, Record<string, string>> = {
      "O'zbekiston": { en: "Uzbekistan", ru: "Узбекистан" },
      "AQSh": { en: "USA", ru: "США" },
      "Buyuk Britaniya": { en: "United Kingdom", ru: "Великобритания" },
      "Germaniya": { en: "Germany", ru: "Германия" },
      "Kanada": { en: "Canada", ru: "Канада" },
      "Janubiy Koreya": { en: "South Korea", ru: "Южная Корея" },
      "Yaponiya": { en: "Japan", ru: "Япония" },
      "Turkiya": { en: "Turkey", ru: "Турция" },
      "Italiya": { en: "Italy", ru: "Италия" },
      "Singapur": { en: "Singapore", ru: "Сингапур" },
      "Shveytsariya": { en: "Switzerland", ru: "Швейцария" },
      "Fransiya": { en: "France", ru: "Франция" },
      "Xitoy": { en: "China", ru: "Китай" }
    };
    return mapping[country]?.[currentLang] || country;
  };

  const countries = [
    { value: 'barchasi', label: text.countryAll },
    { value: "O'zbekiston", label: translateCountry("O'zbekiston") },
    { value: 'AQSh', label: translateCountry("AQSh") },
    { value: 'Buyuk Britaniya', label: translateCountry("Buyuk Britaniya") },
    { value: 'Germaniya', label: translateCountry("Germaniya") },
    { value: 'Kanada', label: translateCountry("Kanada") },
    { value: 'Janubiy Koreya', label: translateCountry("Janubiy Koreya") },
    { value: 'Yaponiya', label: translateCountry("Yaponiya") },
    { value: 'Turkiya', label: translateCountry("Turkiya") },
    { value: 'Italiya', label: translateCountry("Italiya") },
    { value: 'Singapur', label: translateCountry("Singapur") },
    { value: 'Shveytsariya', label: translateCountry("Shveytsariya") },
    { value: 'Fransiya', label: translateCountry("Fransiya") },
    { value: 'Xitoy', label: translateCountry("Xitoy") }
  ];

  // Run the match algorithm
  const matchedUniversities = (() => {
    const matched = universitiesData.filter((uni) => {
      // 1. Region match
      if (targetRegion !== 'barchasi' && uni.country !== targetRegion) {
        return false;
      }
      // 2. Score match with pathway allowance
      const matchesIelts = ielts >= (uni.minimumIelts || 5.0) - 1.0;
      const matchesGpa = gpa >= (uni.minimumGpa || 3.0) - 1.0;
      return matchesIelts && matchesGpa;
    });

    // Sort descending by grantPercentage, then ascending by ranking
    return matched.sort((a, b) => {
      const gA = a.grantPercent ?? 0;
      const gB = b.grantPercent ?? 0;
      if (gA !== gB) return gB - gA;
      return (a.ranking ?? 999) - (b.ranking ?? 999);
    });
  })();

  const displayedMatches = matchedUniversities.slice(0, Math.max(20, matchedUniversities.length));

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasSearched(true);
    const block = document.getElementById('calculator-results-grid');
    if (block) {
      block.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8" id="grant-calculator-wrapper">
      
      {/* HEADER SECTION FOR CALCULATOR */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <span className="bg-blue-105 border border-blue-200 text-blue-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider font-mono shadow-sm">
          {text.subBadge}
        </span>
        <h2 className="text-2xl md:text-4xl font-black text-blue-950 mt-3 tracking-tight leading-tight">
          {text.header}
        </h2>
        <p className="text-sm text-slate-600 mt-3 font-semibold leading-relaxed">
          {text.subheader}
        </p>
      </div>

      {/* TELEGRAM JOIN BANNER - STANDARD ANCHOR PREVENTING IFRAME OVERWRITE */}
      <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 rounded-[2rem] p-6 md:p-8 text-white shadow-xl shadow-blue-500/10 relative overflow-hidden transition transform hover:scale-[1.005] duration-300 z-10">
        <div className="absolute right-[-5%] top-[-20%] w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-[-5%] bottom-[-20%] w-40 h-40 bg-sky-300/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest font-mono">
              {text.tgBadge}
            </span>
            <h3 className="text-lg md:text-2xl font-black leading-tight text-white">
              {text.tgTitle}
            </h3>
            <p className="text-xs md:text-sm text-blue-100 font-bold">
              {text.tgDesc}
            </p>
          </div>
          <a
            href="https://t.me/Topgrands"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 active:scale-[0.98] transition rounded-2xl text-sm font-black shadow-lg flex items-center gap-2 w-full md:w-auto justify-center shrink-0"
            id="telegram-channel-btn"
            style={{ minHeight: '48px' }}
          >
            <Send className="h-5 w-5 text-blue-700 fill-current" />
            <span>{text.tgBtn}</span>
          </a>
        </div>
      </div>

      {/* CALCULATOR FORM CONTROLS */}
      <div className="bg-white/80 border border-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/5 backdrop-blur-md">
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* IELTS SELECT VALUE */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-blue-950 uppercase tracking-widest font-mono">
                {text.labelIelts} <span className="text-blue-600 font-extrabold text-sm font-sans">{ielts}</span>
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
              <p className="text-[10px] text-slate-500 font-semibold font-mono uppercase">
                {text.toeflEquiv.replace("{score}", String(ielts * 15 - 5))}
              </p>
            </div>

            {/* SAT VALUE */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-blue-950 uppercase tracking-widest font-mono">
                {text.labelSat} <span className="text-blue-600 font-extrabold text-sm font-sans">{sat}</span>
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
              <p className="text-[10px] text-slate-500 font-semibold font-mono uppercase">{text.satAdvantage}</p>
            </div>

            {/* GPA VALUE */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-blue-950 uppercase tracking-widest font-mono">
                {text.labelGpa} <span className="text-blue-600 font-extrabold text-sm font-sans">{gpa}</span>
              </label>
              <select
                value={gpa}
                onChange={(e) => setGpa(parseFloat(e.target.value))}
                className="w-full bg-[#f8fafc] border border-blue-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400 select-touch"
                style={{ minHeight: '48px' }}
              >
                {[2.5, 3.0, 3.2, 3.5, 3.8, 4.0, 4.2, 4.5, 4.7, 4.8, 4.9, 5.0].map((val) => (
                  <option key={val} value={val}>{val} {text.gpaScale}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 font-semibold font-mono uppercase">
                {text.gpaSuccess.replace("{score}", String(Math.min(100, Math.floor(gpa * 20))))}
              </p>
            </div>

            {/* TARGET COUNTRY SELECTOR */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-blue-950 uppercase tracking-widest font-mono">
                {text.labelRegion}
              </label>
              <select
                value={targetRegion}
                onChange={(e) => setTargetRegion(e.target.value)}
                className="w-full bg-[#f8fafc] border border-blue-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400 select-touch"
                style={{ minHeight: '48px' }}
              >
                {countries.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 font-semibold font-mono uppercase">{text.regionAutoLoad}</p>
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:brightness-110 active:scale-[0.99] transition font-black text-white text-sm shadow-xl shadow-blue-500/15 flex items-center justify-center gap-2 cursor-pointer"
            style={{ minHeight: '48px' }}
            id="calculate-find-options-btn"
          >
            <GraduationCap className="h-5 w-5 text-white animate-pulse" />
            <span>{text.btnCalculate}</span>
          </button>
        </form>
      </div>

      {/* CALCULATOR MATCHED RESULTS GRID DISPLAY */}
      {hasSearched && (
        <div className="space-y-6" id="calculator-results-grid">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-200 pb-4">
            <div>
              <h3 className="text-xl font-black text-blue-950 flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-blue-600 shrink-0" />
                {text.resultsHead.replace("{count}", String(displayedMatches.length))}
              </h3>
              <p className="text-xs text-slate-500 font-bold mt-1">
                {text.resultsSub}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="inline-block h-3.5 w-3.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-black text-slate-600 font-mono uppercase">{text.resultsRealAnalysis}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="calculator-cards-grid">
            {displayedMatches.map((uni) => {
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
                          ? 'bg-green-150 text-green-800 border-green-200 animate-pulse' 
                          : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}>
                        Grant: {uni.grantPercent}% {is100PercentGrant ? 'FULL-RIDE' : ''}
                      </span>
                      
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {text.modalWorldRank} #{uni.ranking}
                      </span>
                    </div>

                    {/* University Titles */}
                    <div>
                      <h4 className="text-base font-black text-blue-950 leading-tight">
                        {uni.name}
                      </h4>
                      <p className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span>{uni.city}, {translateCountry(uni.country)}</span>
                      </p>
                    </div>

                    {/* Minimum parameters required */}
                    <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4.5 space-y-2 text-xs text-slate-700 font-semibold font-mono">
                      <div className="flex items-center justify-between">
                        <span>{text.minIelts}</span>
                        <span className="text-blue-700 font-black">{uni.minimumIelts}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{text.minGpa}</span>
                        <span className="text-blue-700 font-black">{uni.minimumGpa}</span>
                      </div>
                      {(uni.country === "AQSh" || uni.country === "Xitoy") && (
                        <div className="flex items-center justify-between">
                          <span>{text.minSat}</span>
                          <span className="text-blue-700 font-black">{uni.minimumSat}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                      {uni.brief}
                    </p>
                  </div>

                  {/* Actions Area with mobile friendly dimension */}
                  <div className="mt-6 pt-4 border-t border-slate-150 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500 font-bold font-mono">
                      Kontrakt: {uni.grantPercent === 100 ? text.contractFree : text.contractPartial}
                    </span>
                    
                    <button
                      onClick={() => setSelectedUni(uni)}
                      className="px-4 py-2.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition rounded-xl cursor-pointer shadow-sm flex items-center gap-1"
                      style={{ minHeight: '44px' }}
                    >
                      <span>{text.btnDetails}</span>
                      <ChevronRight className="h-4 w-4 text-white shrink-0" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {displayedMatches.length === 0 && (
            <div className="text-center py-12 bg-white/60 border border-slate-150 rounded-[2rem] max-w-xl mx-auto space-y-3">
              <AlertCircle className="h-10 w-10 text-blue-600 mx-auto animate-bounce shrink-0" />
              <h4 className="text-lg font-black text-blue-950">{text.noResultsHead}</h4>
              <p className="text-xs text-slate-500 font-bold">{text.noResultsDesc}</p>
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
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full cursor-pointer transition flex items-center justify-center shrink-0"
                id="btn-close-uni-details"
                style={{ width: '40px', height: '40px' }}
              >
                ✕
              </button>

              {/* Title Header */}
              <div className="space-y-3 mb-6 pr-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 border border-green-200 text-green-900 text-xs font-black px-4 py-1">
                  <Award className="h-4 w-4 text-green-700 shrink-0" />
                  <span>
                    {text.modalGrantBadge} {selectedUni.grantPercent}% {selectedUni.grantPercent === 100 ? text.modalFullFunded : text.modalDiscount}
                  </span>
                </span>
                
                <h3 className="text-xl md:text-2xl font-black text-blue-950 leading-tight">
                  {selectedUni.name}
                </h3>
                
                <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>{selectedUni.city}, {translateCountry(selectedUni.country)} — {text.modalWorldRank} #{selectedUni.ranking}</span>
                </p>
              </div>

              {/* Grid content blocks */}
              <div className="space-y-6 text-sm font-semibold text-slate-800">
                
                {/* 1. Qancha grant oladi block */}
                <div className="bg-green-50/50 border border-green-150 rounded-2.5xl p-5 space-y-2">
                  <h4 className="text-xs font-black text-green-900 uppercase tracking-widest font-mono flex items-center gap-1">
                    <DollarSign className="h-4.5 w-4.5 text-green-700 shrink-0" />
                    <span>{text.modalStipendHead}</span>
                  </h4>
                  <div className="text-sm font-semibold text-slate-800 space-y-1.5">
                    <p className="font-extrabold text-blue-900">
                      {selectedUni.fee}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {selectedUni.grantPercent === 100 
                        ? text.modalFullFundedDesc
                        : text.modalPartialDesc.replace("{percent}", String(selectedUni.grantPercent))}
                    </p>
                  </div>
                </div>

                {/* 2. Nimalar qila oladi block */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-blue-950 uppercase tracking-widest font-mono flex items-center gap-1">
                    <BookOpen className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>{text.modalAcademics}</span>
                  </h4>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-semibold animate-fade-in">
                    {selectedUni.description}
                  </p>
                </div>

                {/* 3. Ariza Topsirish Qadam-baqadam Hujjatlar */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-blue-950 uppercase tracking-widest font-mono flex items-center gap-1">
                    <CheckCircle className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>{text.modalDocsHead}</span>
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
                    <span className="block text-[10px] text-slate-500 font-bold font-mono uppercase">{text.modalDeadlineLabel}</span>
                    <span className="text-xs font-mono font-black text-blue-950 flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-blue-600 shrink-0" />
                      {selectedUni.deadlines}
                    </span>
                  </div>

                  <div className="space-y-1 sm:text-right">
                    <span className="block text-[10px] text-slate-500 font-bold font-mono uppercase">{text.modalWebLabel}</span>
                    <a
                      href={selectedUni.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-black text-blue-700 hover:text-blue-800 transition active:scale-95 cursor-pointer"
                    >
                      <Globe className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>{selectedUni.website.replace('https://', '')}</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Close footer button */}
              <div className="mt-8">
                <button
                  onClick={() => setSelectedUni(null)}
                  className="w-full py-4.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.99] transition font-black text-slate-800 text-sm text-center"
                  style={{ minHeight: '48px' }}
                >
                  {text.btnClose}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
