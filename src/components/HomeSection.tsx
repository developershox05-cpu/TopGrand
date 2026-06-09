import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, Zap, Layers, GraduationCap, BookOpen, Compass, 
  MapPin, Star, Send, ArrowRight, Check, AlertTriangle, Users, Trophy, ChevronRight, Gem 
} from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';

interface HomeSectionProps {
  user: User;
  onOpenAuth: () => void;
  onOpenPremium: () => void;
  setActiveTab: (tab: string) => void;
}

export default function HomeSection({ user, onOpenAuth, onOpenPremium, setActiveTab }: HomeSectionProps) {
  const [selectedSpec, setSelectedSpec] = useState<string>('us');

  const stats = [
    { label: "Talaba Xarajatini Tejash", value: "100% ($1,500+)", icon: Trophy, color: "text-amber-600 bg-amber-50" },
    { label: "Active AI Modullar", value: "30+ Daxshatli", icon: Sparkles, color: "text-sky-600 bg-sky-50" },
    { label: "Real Global Oliygohlar", value: "500+ (50+/Davlat)", icon: GraduationCap, color: "text-indigo-600 bg-indigo-50" },
  ];

  const valueProps = [
    {
      title: "Nima muammoni hal qiladi?",
      subtitle: "Konsalting firibgarligi va chalkashliklar barham topdi",
      badge: "MUAMMO & YECHIM",
      desc: "Ko'plab agentliklar talabalardan $1,000 dan $4,000 gacha asossiz konsalting to'lovlarini undiradi. TopGrand bevosita va to'g'ridan-to'g'ri o'qishga topshirishingiz uchun rasmiy hujjatlar ro'yxati va arizalarni ochib beradi. Siz uchun daxshatli 30+ AI yordamchilari viza imkoniyatlari, insholar va tavsiyanomalarni yozishni osonlashtiradi.",
      points: [
        "Konsaltorlik to'lovini mutlaqo $0 ga tushirish",
        "Oliygohlar bilan to'g'ridan-to'g'ri muloqot va real ma'lumotlar",
        "Insho (SOP) va tavsiyanomalarning sun'iy intellekt tahlili",
        "Viza va elchixona savol-javoblariga 100% tayyorgarlik"
      ],
      dark: false
    },
    {
      title: "Qanday ishlaydi?",
      subtitle: "Atigi 4 qadamda mustaqil qabul va grantni qo'lga kiriting",
      badge: "ISH QOIDASI",
      desc: "TopGrand tizimi orqali hujjatlarni bevosita topshirish o'yin qoidasidek sodda va tushunarli qilib yaratilgan. Har bir qadam daxshatli sun'iy intellekt nazorati ostida tahlil qilinadi.",
      steps: [
        { step: "01", title: "Oliygohni Tanlang", detail: "Katalogimizdan har bir davlatda 55 tadan ortiq taqdim etilgan nufuzli universitetlarni cheksiz va real ma'lumotlar bilan o'rganing." },
        { step: "02", title: "AI Vakili bilan Suhbat", detail: "Oliygohlar sahifasidagi individual AI konsul-konsultanti orqali har bir shart, kvota va talabni 100% aniqlashtiring." },
        { step: "03", title: "Grantni Hisoblang", detail: "Kalkulyator orqali profilingiz va moliyaviy holatingizga ko'ra bepul yashash hamda to'liq chet el grantlarini aniqlang." },
        { step: "04", title: "Hujjatlarni Tayyorlab Yuboring", detail: "30 ta super AI orqali portfolio, LOR va o'ziga jalb qiluvchi insholarni tayyorlab, oliygoh rasmiy saytidan arizangizni rasmiylashtiring." }
      ],
      dark: true
    }
  ];

  const modulePreviews = [
    { id: 'all', label: 'Universitetlar Katalogi', desc: 'Har bir davlatda kamida 50+ dan ortiq gibrid, davlat va xususiy oliygohlar ma\'lumotlar jurnali.', icon: GraduationCap, color: 'border-sky-200 hover:border-sky-400 bg-white' },
    { id: 'courses', label: 'IELTS & SAT Kurslari', desc: 'Yuklab olinadigan bepul darsliklar, testlar, qo\'llanmalar va yuqori ball olish sirlari.', icon: BookOpen, color: 'border-indigo-200 hover:border-indigo-400 bg-white' },
    { id: 'ai', label: '30 daxshatli AI Markazi', desc: 'Insholarni tahrirlash, qabul ofitseri bahosi, reja bashorat qiluvchi va komissiya simulyatorlari.', icon: Sparkles, color: 'border-cyan-200 hover:border-cyan-400 bg-white/90', highlight: true },
    { id: 'uz', label: '100% Grant Kalkulyatori', desc: 'Shaxsiy ko\'rsatgichlar asosida bepul pul va yevro, dollar dagi grantlarni topish analitik kalkulyatori.', icon: Layers, color: 'border-emerald-250 hover:border-emerald-400 bg-white' },
    { id: 'apply', label: 'Oliygohga Topsihirsh', desc: 'Viza, elchixona intervyusiga tayyorlov, kerakli hujjatlar to\'plami va rasmiy saytlarga o\'tish.', icon: Compass, color: 'border-rose-200 hover:border-rose-400 bg-white' },
  ];

  const countrySpecs = [
    { key: 'us', flag: "🇺🇸", country: "AQSh", cost: "Oila daromadi <$75k bo'lsa tekin (Need-Blind)", merit: "Cheksiz grant va ish imkoniyati", ielts: "GPA 3.0+, IELTS 6.5+, SAT tavsiya etiladi", benefit: "Eng yuqori startap muhiti xaritalari" },
    { key: 'it', flag: "🇮🇹", country: "Italiya", cost: "DSU Regional granti (O'qish tekin, €7,000 grant)", merit: "Yotoqxona va tekin tushlik kafolati", ielts: "IELTS 5.5 - 6.0, imtihonlarsiz ko'p hollarda", benefit: "Eng oson bepul o'qish imkoniyati" },
    { key: 'de', flag: "🇩🇪", country: "Germaniya", cost: "O'qish to'liq tekin (Davlat oliygohlari)", merit: "DAAD granti, Deutschlandstipendium €300/oylik", ielts: "Nemis tili yoki ingliz tilida IELTS 6.0+", benefit: "BMW, Siemens kabi gigantlarda majburiy amaliyot" },
    { key: 'kr', flag: "🇰🇷", country: "Janubiy Koreya", cost: "GKS (100% tekin o'qish va $900 oylik)", merit: "TOPIK natijasiga ko'ra ulkan imtiyozlar", ielts: "IELTS 5.5+ yoki TOPIK 3-daraja", benefit: "O'quv davomida yarim kunlik ishlash ruxsati" },
    { key: 'cn', flag: "🇨🇳", country: "Xitoy", cost: "CSC davlat granti (To'liq bepul + $500 oylik)", merit: "Bepul dori darmon, viza va yotoqxona", ielts: "IELTS 6.0+ yoki HSK 4-daraja", benefit: "Dunyodan o'zib ketayotgan texnologik kampus hayoti" }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-4">
      
      {/* SECTION 1: WELCOME INTRO METRICS (iPhone 16/17 Friendly Bento format) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm flex items-center gap-5"
            >
              <div className={`p-4 rounded-2xl ${st.color} shrink-0`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">{st.label}</span>
                <span className="text-lg md:text-xl font-black text-sky-950 block">{st.value}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* SECTION 2: MUAMMO VA YECHIM - BIG GLASSY CARD */}
      <div className="rounded-[2.5rem] border border-white bg-white/70 backdrop-blur-md p-6 sm:p-10 shadow-xl overflow-hidden relative">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-sky-200/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-5">
          <span className="px-3.5 py-1.5 rounded-full text-[10px] uppercase font-black text-blue-800 bg-blue-100 border border-blue-200 tracking-wider">
            {valueProps[0].badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-blue-950 tracking-tight leading-tight">
            {valueProps[0].title}
          </h2>
          <p className="text-xs sm:text-sm text-sky-950 font-extrabold italic leading-relaxed">
            {valueProps[0].subtitle}
          </p>
          <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
            {valueProps[0].desc}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            {valueProps[0].points?.map((pt, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-blue-950 font-bold">
                <div className="h-5 w-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <Check className="h-3 w-3" />
                </div>
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: QANDAY ISHLAYDI? - PREMIUM DARK BLUE CARD */}
      <div className="rounded-[2.5rem] border border-sky-850 bg-gradient-to-br from-blue-900 to-indigo-950 p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-8">
          <div className="space-y-2">
            <span className="px-3.5 py-1.5 rounded-full text-[10px] uppercase font-black text-cyan-300 bg-cyan-500/10 border border-cyan-400/20 tracking-wider">
              {valueProps[1].badge}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight pt-2">
              {valueProps[1].title}
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 font-light max-w-xl">
              {valueProps[1].subtitle}
            </p>
          </div>

          {/* Touch-Friendly Vertical Step lists for iPhone 16/17 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps[1].steps?.map((st, idx) => (
              <div 
                key={idx} 
                className="rounded-3xl border border-white/10 bg-white/5 p-5 flex flex-col justify-between space-y-4 hover:bg-white/10 transition-all cursor-crosshair min-h-[170px]"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xl sm:text-2xl font-black text-cyan-300">{st.step}</span>
                  <div className="h-6 w-6 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300 text-xs font-mono font-bold">
                    ✓
                  </div>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xs sm:text-sm font-extrabold text-white">{st.title}</h4>
                  <p className="text-[11px] text-blue-200/80 leading-normal font-medium">{st.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: NIMALAR BOR / TIZIM MODULLARI - INTERACTIVE HUB */}
      <div className="space-y-6">
        <div className="text-center sm:text-left space-y-1">
          <span className="text-[10px] font-black tracking-widest text-sky-700 uppercase">Daxshatli Modullar Doirasi</span>
          <h2 className="text-xl sm:text-3xl font-black text-blue-950">Platformada Kiruvchi Funksiyalar</h2>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Quyidagi istalgan modullarga bir marta bosish (kamida 44px o'lchamdagi touch maydon) orqali direct o'tishingiz mumkin:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modulePreviews.map((md) => {
            const Icon = md.icon;
            return (
              <motion.button
                whileTap={{ scale: 0.98 }}
                key={md.id}
                onClick={() => setActiveTab(md.id)}
                className={`w-full text-left p-6 rounded-3xl border ${md.color} transition duration-200 cursor-pointer shadow-md flex flex-col justify-between min-h-[180px] relative overflow-hidden group`}
                style={{ touchAction: 'manipulation', minHeight: '44px' }}
                id={`home-preview-btn-${md.id}`}
              >
                {md.highlight && (
                  <span className="absolute top-0 right-0 bg-yellow-405 text-amber-950 text-[8px] font-black tracking-widest uppercase px-3 py-1 rounded-bl-xl border-l border-b border-yellow-300 animate-pulse bg-yellow-400">
                    MASHHUR ⚡
                  </span>
                )}
                
                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 text-sky-700 group-hover:bg-sky-550 group-hover:text-sky-700 transition shrink-0 self-start">
                  <Icon className="h-5.5 w-5.5 text-sky-600" />
                </div>

                <div className="space-y-1.5 mt-4">
                  <h3 className="font-extrabold text-blue-950 group-hover:text-blue-700 transition text-sm sm:text-base flex items-center justify-between">
                    <span>{md.label}</span>
                    <ChevronRight className="h-4 w-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0" />
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {md.desc}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: DAVLATLAR BO'YICHA REAL STRATEGIKA & FOYDA */}
      <div className="rounded-[2.5rem] border border-white bg-white/70 backdrop-blur-md p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-stretch gap-6">
          {/* Left lists */}
          <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 pb-5 md:pb-0 md:pr-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-black tracking-widest text-sky-700 uppercase block">Global Grantlar</span>
              <h3 className="text-xl font-black text-blue-950 leading-tight">Yirik Davlatlar Shartlari & Imtiyozlari</h3>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Quyidagi davlatlardan birini tanlang va talabaga cheksiz bo'lgan barcha grant afzalliklarini real vaqtda o'rganing.
              </p>
            </div>

            {/* Selection tabs */}
            <div className="flex flex-wrap gap-2 mt-6">
              {countrySpecs.map((cs) => (
                <button
                  key={cs.key}
                  onClick={() => setSelectedSpec(cs.key)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition cursor-pointer ${
                    selectedSpec === cs.key
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-white text-slate-800 border-slate-150 hover:bg-slate-50'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  <span className="text-base leading-none">{cs.flag}</span>
                  <span>{cs.country}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right dynamic cards */}
          <div className="flex-1 flex flex-col justify-center">
            {countrySpecs.map((cs) => {
              if (cs.key !== selectedSpec) return null;
              return (
                <motion.div
                  key={cs.key}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-3xl border border-sky-100 bg-sky-50/50 p-6 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl leading-none">{cs.flag}</span>
                    <div>
                      <h4 className="text-base font-black text-blue-950">{cs.country} Oliy Ta'lim Tizimi</h4>
                      <p className="text-[10px] text-sky-700 font-bold uppercase tracking-wider">TopGrand International Insights</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Yillik Kontrakt Kontur</span>
                      <p className="font-extrabold text-[#111827] text-xs leading-normal">{cs.cost}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Talaba Bo'lish Imtiyozi</span>
                      <p className="font-extrabold text-[#111827] text-xs leading-normal">{cs.merit}</p>
                    </div>

                    <div className="space-y-1 border-t border-slate-100 pt-3 sm:col-span-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">O'rtacha Qabul Mezonlari</span>
                      <p className="font-extrabold text-blue-950 text-xs leading-normal">{cs.ielts}</p>
                    </div>

                    <div className="space-y-1 border-t border-slate-100 pt-3 sm:col-span-2 text-blue-950 font-bold text-[11px] bg-white/40 p-3 rounded-xl border border-blue-100">
                      💡 **TopGrand Tavsiyasi**: {cs.benefit}. Biz orqali konsaltingsiz bevosita o'zingiz arizangizni topshiring. Xarajat 0$ bo'ladi!
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
