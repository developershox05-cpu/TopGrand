import React, { useState } from 'react';
import { 
  Sparkles, GraduationCap, BookOpen, Compass, 
  Layers, ChevronRight, Check, Trophy 
} from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';
import PrepProgress from './PrepProgress';
import TestimonialsCarousel from './TestimonialsCarousel';

interface HomeSectionProps {
  user: User;
  currentLang: 'uz' | 'en' | 'ru';
  onOpenAuth: () => void;
  onOpenPremium: () => void;
  setActiveTab: (tab: string) => void;
}

export default function HomeSection({ user, currentLang, onOpenAuth, onOpenPremium, setActiveTab }: HomeSectionProps) {
  const [selectedSpec, setSelectedSpec] = useState<string>('us');

  // Translation Dictionaries
  const langText = {
    uz: {
      statSavings: "Talaba Xarajatini Tejash",
      statModules: "Active AI Modullar",
      statUniversities: "Real Global Oliygohlar",
      statSavingsVal: "100% ($1,500+)",
      statModulesVal: "30+ Daxshatli",
      statUniversitiesVal: "500+ (50+/Davlat)",
      
      problemBadge: "MUAMMO & YECHIM",
      problemTitle: "Nima muammoni hal qiladi?",
      problemSubtitle: "Konsalting firibgarligi va chalkashliklar barham topdi",
      problemDesc: "Ko'plab agentliklar talabalardan $1,000 dan $4,000 gacha asossiz konsalting to'lovlarini undiradi. TopGrand bevosita va to'g'ridan-to'g'ri o'qishga topshirishingiz uchun rasmiy hujjatlar ro'yxati va arizalarni ochib beradi. Siz uchun daxshatli 30+ AI yordamchilari viza imkoniyatlari, insholar va tavsiyanomalarni yozishni osonlashtiradi.",
      problemPoints: [
        "Konsaltorlik to'lovini mutlaqo $0 ga tushirish",
        "Oliygohlar bilan to'g'ridan-to'g'ri muloqot va real ma'lumotlar",
        "Insho (SOP) va tavsiyanomalarning sun'iy intellekt tahlili",
        "Viza va elchixona savol-javoblariga 100% tayyorgarlik"
      ],

      workBadge: "ISH QOIDASI",
      workTitle: "Qanday ishlaydi?",
      workSubtitle: "Atigi 4 qadamda mustaqil qabul va grantni qo'lga kiriting",
      workDesc: "TopGrand tizimi orqali hujjatlarni bevosita topshirish o'yin qoidasidek sodda va tushunarli qilib yaratilgan. Har bir qadam daxshatli sun'iy intellekt nazorati ostida tahlil qilinadi.",
      workSteps: [
        { step: "01", title: "Oliygohni Tanlang", detail: "Katalogimizdan har bir davlatda 55 tadan ortiq taqdim etilgan nufuzli universitetlarni cheksiz va real ma'lumotlar bilan o'rganing." },
        { step: "02", title: "AI Vakili bilan Suhbat", detail: "Oliygohlar sahifasidagi individual AI konsul-konsultanti orqali har bir shart, kvota va talabni 100% aniqlashtiring." },
        { step: "03", title: "Grantni Hisoblang", detail: "Kalkulyator orqali profilingiz va moliyaviy holatingizga ko'ra bepul yashash hamda to'liq chet el grantlarini aniqlang." },
        { step: "04", title: "Hujjatlarni Tayyorlab Yuboring", detail: "30 ta super AI orqali portfolio, LOR va o'ziga jalb qiluvchi insholarni tayyorlab, oliygoh rasmiy saytidan arizangizni rasmiylashtiring." }
      ],

      hubBadge: "Daxshatli Modullar Doirasi",
      hubTitle: "Platformada Kiruvchi Funksiyalar",
      hubDesc: "Quyidagi istalgan modullarga bir marta bosish (kamida 44px o'lchamdagi touch maydon) orqali direct o'tishingiz mumkin:",
      hubPopular: "MASHHUR ⚡",

      modules: {
        all: { label: 'Universitetlar Katalogi', desc: "Har bir davlatda kamida 50+ dan ortiq gibrid, davlat va xususiy oliygohlar ma'lumotlar jurnali." },
        courses: { label: 'IELTS & SAT Kurslari', desc: "Yuklab olinadigan bepul darsliklar, testlar, qo'llanmalar va yuqori ball olish sirlari." },
        ai: { label: '30 daxshatli AI Markazi', desc: "Insholarni tahrirlash, qabul ofitseri bahosi, reja bashorat qiluvchi va komissiya simulyatorlari." },
        uz: { label: '100% Grant Kalkulyatori', desc: "Shaxsiy ko'rsatgichlar asosida bepul pul va yevro, dollar dagi grantlarni topish analitik kalkulyatori." },
        apply: { label: 'Oliygohga Topshirish', desc: "Viza, elchixona intervyusiga tayyorlov, kerakli hujjatlar to'plami va rasmiy saytlarga o'tish." }
      },

      countryBadge: "Global Grantlar",
      countryTitle: "Yirik Davlatlar Shartlari & Imtiyozlari",
      countryDesc: "Quyidagi davlatlardan birini tanlang va talabaga cheksiz bo'lgan barcha grant afzalliklarini real vaqtda o'rganing.",
      countrySystem: "Oliy Ta'lim Tizimi",
      countryInsight: "TopGrand International Insights",
      labelCost: "Yillik Kontrakt Kontur",
      labelMerit: "Talaba Bo'lish Imtiyozi",
      labelCriteria: "O'rtacha Qabul Mezonlari",
      recommendation: "💡 **TopGrand Tavsiyasi**: {benefit}. Biz orqali konsaltingsiz bevosita o'zingiz arizangizni topshiring. Xarajat 0$ bo'ladi!",

      countries: {
        us: { country: "AQSh", cost: "Oila daromadi <$75k bo'lsa tekin (Need-Blind)", merit: "Cheksiz grant va ish imkoniyati", ielts: "GPA 3.0+, IELTS 6.5+, SAT tavsiya etiladi", benefit: "Eng yuqori startap muhiti xaritalari" },
        it: { country: "Italiya", cost: "DSU Regional granti (O'qish tekin, €7,000 grant)", merit: "Yotoqxona va tekin tushlik kafolati", ielts: "IELTS 5.5 - 6.0, imtihonlarsiz ko'p hollarda", benefit: "Eng oson bepul o'qish imkoniyati" },
        de: { country: "Germaniya", cost: "O'qish to'liq tekin (Davlat oliygohlari)", merit: "DAAD granti, Deutschlandstipendium €300/oylik", ielts: "Nemis tili yoki ingliz tilida IELTS 6.0+", benefit: "BMW, Siemens kabi gigantlarda majburiy amaliyot" },
        kr: { country: "Janubiy Koreya", cost: "GKS (100% tekin o'qish va $900 oylik)", merit: "TOPIK natijasiga ko'ra ulkan imtiyozlar", ielts: "IELTS 5.5+ yoki TOPIK 3-daraja", benefit: "O'quv davomida yarim kunlik ishlash ruxsati" },
        cn: { country: "Xitoy", cost: "CSC davlat granti (To'liq bepul + $500 oylik)", merit: "Bepul dori darmon, viza va yotoqxona", ielts: "IELTS 6.0+ yoki HSK 4-daraja", benefit: "Dunyodan o'zib ketayotgan texnologik kampus hayoti" }
      }
    },
    en: {
      statSavings: "Student Expenses Saved",
      statModules: "Active AI Modules",
      statUniversities: "Real Global Universities",
      statSavingsVal: "100% ($1,500+)",
      statModulesVal: "30+ Intense",
      statUniversitiesVal: "500+ (50+/Country)",

      problemBadge: "PROBLEM & SOLUTION",
      problemTitle: "What dynamic does it solve?",
      problemSubtitle: "Consulting fraud and confusion has ended",
      problemDesc: "Many agencies charge students groundless fees from $1,000 to $4,000. TopGrand unrolls list of official requirements and application processes for direct submission. Our powerful 30+ AI agents streamline writing of motivation drafts, recommendation letters, and visa answers.",
      problemPoints: [
        "Reducing consultant commission absolutely to $0",
        "Direct communication channels & real university data",
        "AI audit of Personal Statements (SOP) and tutor references",
        "100% solid preparation for Consulate & Visa inquiries"
      ],

      workBadge: "HOW IT WORKS",
      workTitle: "Step-by-Step Path",
      workSubtitle: "Secure direct admission and scholarship in just 4 steps",
      workDesc: "Submitting directly through TopGrand is made incredibly intuitive. Every single task is analyzed under strict, comprehensive AI oversight.",
      workSteps: [
        { step: "01", title: "Select University", detail: "Browse and evaluate over 55 accredited, prestigious institutes in each country with authentic data logs." },
        { step: "02", title: "Chat with AI Advisor", detail: "Leverage dedicated, individual AI agents on university pages to answer every question about credits & criteria." },
        { step: "03", title: "Calculate Scholarship", detail: "Run the interactive calculator to trace the highest free funding or stipend available for your GPA scoring." },
        { step: "04", title: "Submit & Succeed", detail: "Polish your writing assets using 30+ AI modules and submit your official applications live on the university portals." }
      ],

      hubBadge: "Advanced Modules Hub",
      hubTitle: "Ecosystem Features",
      hubDesc: "Seamlessly route to any core module below with one click (optimized 44px responsive touch targets):",
      hubPopular: "POPULAR ⚡",

      modules: {
        all: { label: "University Explorer", desc: "Catalog of over 50+ hybrid, public, and private universities containing authentic criteria." },
        courses: { label: "IELTS & SAT Courses", desc: "Downloadable textbooks, test presets, study rules, and strategy materials." },
        ai: { label: "30+ AI Prep Tools", desc: "Essay checkers, admission reviewers, study plan predictors, and interview simulators." },
        uz: { label: "Scholarship Matcher", desc: "Analytical grant matching tool that finds fully funded programs for your background." },
        apply: { label: "Direct Admissions", desc: "Visa checklists, embassy guidelines, direct links, and submission portals." }
      },

      countryBadge: "Global Scholarships",
      countryTitle: "Target Country Criteria",
      countryDesc: "Pick a destination below to inspect extensive student benefits, tuition criteria, and rules in real-time.",
      countrySystem: "Higher Ed System",
      countryInsight: "TopGrand International Insights",
      labelCost: "Average Annual Tuition",
      labelMerit: "Key Student Privileges",
      labelCriteria: "Average Entry Criteria",
      recommendation: "💡 **TopGrand Advice**: Please consider {benefit}. Use TopGrand to apply directly by yourself and lower your expenses to $0!",

      countries: {
        us: { country: "USA", cost: "Free if family income is <$75k (Need-Blind)", merit: "Unconstrained grants and research assistantships", ielts: "GPA 3.0+, IELTS 6.5+, SAT recommended", benefit: "unparalleled start-up ecosystem & funding maps" },
        it: { country: "Italy", cost: "DSU Regional Grant (Free tuition + €7,400 stipend)", merit: "Guaranteed free housing & campus dining", ielts: "IELTS 5.5 - 6.0, often without admissions test", benefit: "easiest pathway to get 100% free fully-funded education" },
        de: { country: "Germany", cost: "Fully tuition-free (Public Universities)", merit: "DAAD grants, Deutschlandstipendium €300/mo", ielts: "German language or English IELTS 6.0+", benefit: "compulsory paid internships at BMW, Siemens, Bosch, etc." },
        kr: { country: "S. Korea", cost: "GKS (100% free tuition + $900/mo salary)", merit: "Tremendous benefits for high TOPIK scores", ielts: "IELTS 5.5+ or TOPIK Level 3", benefit: "part-time work permits allowed from day one" },
        cn: { country: "China", cost: "CSC Scholarship (Free tuition + $500/mo stipend)", merit: "Free medical insurance & free student dorms", ielts: "IELTS 6.0+ or HSK Level 4", benefit: "pioneering technological campuses and state-of-the-art facilities" }
      }
    },
    ru: {
      statSavings: "Сэкономлено студентом",
      statModules: "Активные ИИ модули",
      statUniversities: "Реальные мировые вузы",
      statSavingsVal: "100% ($1,505+)",
      statModulesVal: "30+ Мощных",
      statUniversitiesVal: "500+ (50+/Страна)",

      problemBadge: "ПРОБЛЕМА И РЕШЕНИЕ",
      problemTitle: "Какую проблему решает TopGrand?",
      problemSubtitle: "Конец обману и хаосу в академическом консалтинге",
      problemDesc: "Большинство агентств берут со студентов огромные комиссии от $1000 до $4000 без каких-либо гарантий. TopGrand раскрывает официальные каталожные требования и прямые ссылки на порталы. Наши 30+ специализированных ИИ-агентов облегчают написание эссе (SOP), рекомендаций и подготовку к визовым вопросам.",
      problemPoints: [
        "Снижение стоимости консультаций до $0",
        "Прямой контакт с университетами и актуальные данные",
        "Тщательный ИИ-аудит мотивационных и рекомендательных писем",
        "100% качественная подготовка к вопросам посольства и визовых офицеров"
      ],

      workBadge: "КАК ЭТО РАБОТАЕТ",
      workTitle: "Простой рабочий процесс",
      workSubtitle: "Получите прямое зачисление и стипендию всего за 4 шага",
      workDesc: "Подача документов через TopGrand спроектирована максимально просто и интуитивно. Каждый этап анализируется под тщательным контролем наших ИИ-ассистентов.",
      workSteps: [
        { step: "01", title: "Выберите Университет", detail: "Изучите более 55 престижных вузов в каждой стране с подробными требованиями и бюджетом." },
        { step: "02", title: "Консультация с ИИ", detail: "Общайтесь с персональными ИИ-советниками на страницах вузов для уточнения любых вопросов о баллах и квотах." },
        { step: "03", title: "Калькулятор грантов", detail: "Рассчитайте шансы на бесплатное обучение и размер стипендий на основе своего GPA и языковых баллов." },
        { step: "04", title: "Подача документов", detail: "Отредактируйте рекомендательные письма и эссе с помощью 30+ инструментов ИИ и подайте заявку напрямую в вуз." }
      ],

      hubBadge: "Интерактивный центр модулей",
      hubTitle: "Функции платформы",
      hubDesc: "Переходите в любой ключевой раздел в один клик (сенсорные кнопки адаптированы под мобильные экраны — от 44px):",
      hubPopular: "ПОПУЛЯРНО ⚡",

      modules: {
        all: { label: "Каталог Вузов", desc: "База данных по более чем 50+ государственным и частым учебным заведениям мира." },
        courses: { label: "Курсы IELTS & SAT", desc: "Бесплатные методические пособия, пресеты тестов, правила подготовки и стратегии высоких баллов." },
        ai: { label: "30+ ИИ-Инструментов", desc: "Аудит эссе, оценка приёмной комиссии, прогнозирование планов и симуляторы собеседований." },
        uz: { label: "Калькулятор Грантов", desc: "Аналитический инструмент для мгновенного подбора полных стипендий под ваш профиль." },
        apply: { label: "Прямое поступление", desc: "Визовые чек-листы, рекомендации посольства, прямые ссылки и руководство по зачислению." }
      },

      countryBadge: "Глобальные стипендии",
      countryTitle: "Требования стран и привилегии",
      countryDesc: "Выберите любую интересующую вас страну ниже и изучите академические преимущества и требования в реальном времени.",
      countrySystem: "Система высшего образования",
      countryInsight: "Рекомендации TopGrand",
      labelCost: "Средняя стоимость в год",
      labelMerit: "Ключевые привилегии",
      labelCriteria: "Средние критерии отбора",
      recommendation: "💡 **Рекомендация TopGrand**: Обратите внимание на {benefit}. Подавайте документы напрямую через нашу платформу, экономя бюджет на посредниках до $0!",

      countries: {
        us: { country: "США", cost: "Бесплатно, если семейный доход <$75k (Need-Blind)", merit: "Неограниченные гранты и возможности ассистентских контрактов", ielts: "GPA 3.0+, IELTS 6.5+, SAT рекомендуется", benefit: "уникальную экосистему стартапов и финансирования" },
        it: { country: "Италия", cost: "Региональный грант DSU (Бесплатное обучение + €7400/год)", merit: "Гарантированное бесплатное жилье и обеды в кампусе", ielts: "IELTS 5.5 - 6.0, часто без вступительного экзамена", benefit: "самый простой способ получить 100% бесплатное образование" },
        de: { country: "Германия", cost: "Полностью бесплатно (государственные вузы)", merit: "Гранты DAAD, Deutschlandstipendium €300/мес", ielts: "Немецкий язык B2/C1 или английский IELTS 6.0+", benefit: "обязательные оплачиваемые стажировки в BMW, Siemens, Bosch и др." },
        kr: { country: "Южная Корея", cost: "Стипендия GKS (100% оплата обучения + $900/мес)", merit: "Огромные льготы при высоких баллах TOPIK", ielts: "IELTS 5.5+ или TOPIK 3-й уровень", benefit: "разрешения на подработку с первого учебного дня" },
        cn: { country: "Китай", cost: "Грант CSC (Полное освобождение от платы + $500/мес)", merit: "Бесплатная медицинская страховка и проживание в общежитии", ielts: "IELTS 6.0+ или HSK 4-й уровень", benefit: "передовые кампусы и ультрасовременные исследовательские базы" }
      }
    }
  };

  const text = langText[currentLang] || langText['uz'];

  const stats = [
    { label: text.statSavings, value: text.statSavingsVal, icon: Trophy, color: "text-amber-600 bg-amber-50" },
    { label: text.statModules, value: text.statModulesVal, icon: Sparkles, color: "text-sky-600 bg-sky-50" },
    { label: text.statUniversities, value: text.statUniversitiesVal, icon: GraduationCap, color: "text-indigo-600 bg-indigo-50" },
  ];

  const valueProps = [
    {
      title: text.problemTitle,
      subtitle: text.problemSubtitle,
      badge: text.problemBadge,
      desc: text.problemDesc,
      points: text.problemPoints,
      dark: false
    },
    {
      title: text.workTitle,
      subtitle: text.workSubtitle,
      badge: text.workBadge,
      desc: text.workDesc,
      steps: text.workSteps,
      dark: true
    }
  ];

  const modulePreviews = [
    { id: 'all', label: text.modules.all.label, desc: text.modules.all.desc, icon: GraduationCap, color: 'border-sky-200 hover:border-sky-400 bg-white' },
    { id: 'courses', label: text.modules.courses.label, desc: text.modules.courses.desc, icon: BookOpen, color: 'border-indigo-200 hover:border-indigo-400 bg-white' },
    { id: 'ai', label: text.modules.ai.label, desc: text.modules.ai.desc, icon: Sparkles, color: 'border-cyan-200 hover:border-cyan-400 bg-white/90', highlight: true },
    { id: 'uz', label: text.modules.uz.label, desc: text.modules.uz.desc, icon: Layers, color: 'border-emerald-250 hover:border-emerald-400 bg-white' },
    { id: 'apply', label: text.modules.apply.label, desc: text.modules.apply.desc, icon: Compass, color: 'border-rose-200 hover:border-rose-400 bg-white' },
  ];

  const countrySpecs = [
    { key: 'us', flag: "🇺🇸", country: text.countries.us.country, cost: text.countries.us.cost, merit: text.countries.us.merit, ielts: text.countries.us.ielts, benefit: text.countries.us.benefit },
    { key: 'it', flag: "🇮🇹", country: text.countries.it.country, cost: text.countries.it.cost, merit: text.countries.it.merit, ielts: text.countries.it.ielts, benefit: text.countries.it.benefit },
    { key: 'de', flag: "🇩🇪", country: text.countries.de.country, cost: text.countries.de.cost, merit: text.countries.de.merit, ielts: text.countries.de.ielts, benefit: text.countries.de.benefit },
    { key: 'kr', flag: "🇰🇷", country: text.countries.kr.country, cost: text.countries.kr.cost, merit: text.countries.kr.merit, ielts: text.countries.kr.ielts, benefit: text.countries.kr.benefit },
    { key: 'cn', flag: "🇨🇳", country: text.countries.cn.country, cost: text.countries.cn.cost, merit: text.countries.cn.merit, ielts: text.countries.cn.ielts, benefit: text.countries.cn.benefit }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-4">
      
      {/* SECTION 1: WELCOME INTRO METRICS */}
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
                className="rounded-3xl border border-white/10 bg-white/5 p-5 flex flex-col justify-between space-y-4 hover:bg-white/10 transition-all min-h-[170px]"
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

      {/* BENTO SECTION: SUCCESS STORIES AND PREPARATION PROGRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch" id="premium-bento-success-prep">
        {/* Left Bento item: Circular Prep Tracker */}
        <PrepProgress currentLang={currentLang} userEmail={user.email} userId={user.id} />

        {/* Right Bento item: Success Stories Carousel */}
        <TestimonialsCarousel currentLang={currentLang} />
      </div>

      {/* SECTION 4: NIMALAR BOR / TIZIM MODULLARI - INTERACTIVE HUB */}
      <div className="space-y-6">
        <div className="text-center sm:text-left space-y-1">
          <span className="text-[10px] font-black tracking-widest text-sky-700 uppercase">{text.hubBadge}</span>
          <h2 className="text-xl sm:text-3xl font-black text-blue-950">{text.hubTitle}</h2>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {text.hubDesc}
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
                    {text.hubPopular}
                  </span>
                )}
                
                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 text-sky-700 group-hover:bg-indigo-600 group-hover:text-white transition shrink-0 self-start">
                  <Icon className="h-5.5 w-5.5 text-sky-600 group-hover:text-white" />
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
              <span className="text-[10px] font-black tracking-widest text-sky-700 uppercase block">{text.countryBadge}</span>
              <h3 className="text-xl font-black text-blue-950 leading-tight">{text.countryTitle}</h3>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                {text.countryDesc}
              </p>
            </div>

            {/* Selection tabs with mobile friendly touches */}
            <div className="flex flex-wrap gap-2 mt-6">
              {countrySpecs.map((cs) => (
                <button
                  key={cs.key}
                  onClick={() => setSelectedSpec(cs.key)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition cursor-pointer ${
                    selectedSpec === cs.key
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md'
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
                      <h4 className="text-base font-black text-blue-950">{cs.country} {text.countrySystem}</h4>
                      <p className="text-[10px] text-sky-700 font-bold uppercase tracking-wider">{text.countryInsight}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">{text.labelCost}</span>
                      <p className="font-extrabold text-[#111827] text-xs leading-normal">{cs.cost}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">{text.labelMerit}</span>
                      <p className="font-extrabold text-[#111827] text-xs leading-normal">{cs.merit}</p>
                    </div>

                    <div className="space-y-1 border-t border-slate-100 pt-3 sm:col-span-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">{text.labelCriteria}</span>
                      <p className="font-extrabold text-blue-950 text-xs leading-normal">{cs.ielts}</p>
                    </div>

                    <div className="space-y-1 border-t border-slate-100 pt-3 sm:col-span-2 text-blue-950 font-bold text-[11px] bg-white/40 p-3 rounded-xl border border-blue-100">
                      {text.recommendation.replace("{benefit}", cs.benefit)}
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
