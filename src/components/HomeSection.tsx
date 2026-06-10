import React, { useState } from 'react';
import { 
  Sparkles, GraduationCap, BookOpen, Compass, 
  Layers, ChevronRight, Check, Trophy, CheckSquare, Square, Info, MapPin, Award, X, Calendar, ArrowRight,
  Globe, Star, DollarSign, FileText, CheckCircle, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, University } from '../types';
import { universitiesData } from '../data';
import PrepProgress from './PrepProgress';
import TestimonialsCarousel from './TestimonialsCarousel';

interface HomeSectionProps {
  user: User;
  currentLang: 'uz' | 'en' | 'ru';
  onOpenAuth: () => void;
  onOpenPremium: () => void;
  setActiveTab: (tab: string) => void;
}

interface GrantInfo {
  id: string;
  title: string;
  country: string;
  deadline: string;
  benefit: string;
  badge: string;
  desc: string;
  requirements: string[];
}

const campusImages = [
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1627896157734-4d7d4388f24b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=600&q=80"
];

export default function HomeSection({ user, currentLang, onOpenAuth, onOpenPremium, setActiveTab }: HomeSectionProps) {
  const [selectedSpec, setSelectedSpec] = useState<string>('us');

  // --- TOP 50 CAROUSEL STATE ---
  const [selectedCarouselUni, setSelectedCarouselUni] = useState<University | null>(null);
  const [carouselUniWebError, setCarouselUniWebError] = useState<string | null>(null);

  // --- 1. LIVE GRANT TICKER COMPONENT STATE ---
  const [activeGrantModal, setActiveGrantModal] = useState<GrantInfo | null>(null);

  // --- 2. INTERACTIVE MAP STATE ---
  const [activeMapCountry, setActiveMapCountry] = useState<string | null>('it');

  // --- 3. PERSONALIZED PROGRESS RING STATE (reads from localStorage with checklist toggles) ---
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('topgrand_document_checker_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      sop: true,      // Statement of Purpose
      lor: false,     // Recommendation Letter
      cv: false,      // ATS Friendly CV
      ielts: true,    // IELTS/English Certificate
    };
  });

  const handleToggleChecklist = (key: keyof typeof checklist) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    localStorage.setItem('topgrand_document_checker_v1', JSON.stringify(updated));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 4) * 100);

  // --- IN-APP STATIC REAL DATABASES (0 Cost, 100% Reliable) ---
  const liveGrants: GrantInfo[] = [
    {
      id: 'dsu',
      title: 'DSU Regional Grant Program',
      country: 'Italiya 🇮🇹',
      deadline: '15-Avgust, 2026',
      badge: 'BENTLEY SINFIDAGI FOYDA',
      benefit: 'Yillik €7,200 gacha sof stipendiya, bepul o\'qish, tekin 2 mahal murakkab tushlik va bepul yotoqxona',
      desc: 'Italiyaning barcha hududiy viloyatlarida oilaviy daromadi kam bo\'lgan xalqaro talabalar uchun taqdim etiladigan eng oson bepul o\'qish tizimi.',
      requirements: ['IELTS 5.5+ yoki universitet ingiliz tili suhbati', 'Oilaviy daromad to\'g\'risida ma\'lumotnoma', 'Universitetdan qabul xati (Pre-admission letter)']
    },
    {
      id: 'daad',
      title: 'DAAD Scholarship Germany',
      country: 'Germaniya 🇩🇪',
      deadline: '15-Iyun, 2026',
      badge: 'MUKAMMAL EUROPE STANDARTI',
      benefit: 'Yillik oylik €934 - €1,200 gacha stipendiya, to\'liq kontrakt to\'lovi, bepul tibbiy sug\'urta va yo\'l xarajatlari',
      desc: 'Germaniyaning eng nufuzli davlat stipendiyasi bo\'lib, u iqtidorli yosh tadqiqotchilar va mutaxassislarni jahon darajasiga olib chiqish uchun mo\'ljallangan.',
      requirements: ['IELTS 6.5+ yoki Nemis tili til sertifikati', 'Kamida 2 ta professor tavsiyanomasi (Academic LORs)', 'Kamida 2 yillik kasbiy ish tajribasi (faqat magistr uchun)']
    },
    {
      id: 'gks',
      title: 'GKS Korean Government Grant',
      country: 'Janubiy Koreya 🇰🇷',
      deadline: '20-Fevral, 2027',
      badge: 'OSIYO GIGANTI',
      benefit: '100% bepul o\'qish kontrakt to\'lovi asosi, 1 yillik bepul koreys tili tayyorlov kursi, oyiga $1,000 naqd yordam va bepul aviachiptalar',
      desc: 'Koreya Respublikasi hukumati tomonidan ajratiladigan dunyodagi eng qimmatbaho to\'liq vasiylik dasturlaridan biri.',
      requirements: ['GPA 80/100 balldan yuqori bo\'lishi shart', 'TOPIK 3-daraja yoki IELTS 6.0+ band', 'Bakalavr yoki magistr diplomi tarjimasi']
    },
    {
      id: 'csc',
      title: 'CSC Chinese Government Scholarship',
      country: 'Xitoy 🇨🇳',
      deadline: '15-Mart, 2027',
      badge: '100% BEPUL TAYYORLOV',
      benefit: 'Yillik bepul zamonaviy yotoqxona xonasi, to\'liq tibbiy sug\'urta va oylik 3,000 RMB ($450) gacha stipendiya',
      desc: 'Xitoy Xalq Respublikasi Ta\'lim vazirligi tomonidan eng nufuzli Double First-Class xitoy oliygohlariga jalb etish uchun taklif qilinadi.',
      requirements: ['Yosh chegarasi: Bakalavr uchun 25 yoshgacha, Magistratura uchun 35 yoshgacha', 'HSK 4-daraja yoki ingliz tilida o\'tiladigan guruhlar uchun IELTS 6.0', 'Tadqiqot rejasi yoki Study Plan xati (SOP)']
    },
    {
      id: 'latvia',
      title: 'Latvian State Fellowship',
      country: 'Latviya 🇱🇻',
      deadline: '01-Aprel, 2027',
      badge: 'SHENGENGA OSON KIRISH',
      benefit: 'Oyiga €500 yevro naqd stipendiya, o\'qish to\'liq yoki qisman bepulligi, Shengen mamlakatlarida erkin harakatlanish ruxsatnomasi',
      desc: 'Evropa Ittifoqida yevroda oylik olib o\'qish istagida bo\'lgan talabalar uchun Yevropa davlati tomonidan ajratiladigan nufuzli stipendiya.',
      requirements: ['Universitet rasmiy qabul xati', 'IELTS 5.5+ yoki muqobil ingliz tili darajasi', 'Akademik transcripts baholari']
    }
  ];

  const mapCountriesDb: Record<string, { country: string; flag: string; city: string; scholarship: string; cost: string; work: string; tip: string }> = {
    us: {
      country: "AQSh",
      flag: "🇺🇸",
      city: "Boston / New York",
      scholarship: "Need-Blind / Need-Based universitet grantlari (100% bepul o'qish va ehtiyojlar qoplanadi)",
      cost: "Oyiga taxminan $800 - $1,100 (universitet yotoqxonasi va oziq-ovqat imtiyozlari bilan tejaladi)",
      work: "Haqiqiy F-1 vizasi bilan haftasiga 20 soat kampus ichida ishlash qonuniy kafolati bor",
      tip: "CSS Profile daxshatli tarzda to'g'ri to'ldirilishi va oilaning haqiqiy iqtisodiy qiyinchilik xati yozilishi shart!"
    },
    it: {
      country: "Italiya",
      flag: "🇮🇹",
      city: "Rim / Milan / Bolonya",
      scholarship: "DSU Regional granti (€7,200 soft va tekin yotoqxona va €0 kontrakt)",
      cost: "Eng arzon o'qish: oyiga €300 - €500 (DSU tekin tushlik talonlari bilan xarajat pastga tushadi)",
      work: "Talabalar haftasiga 20 soat istalgan joyda rasmiy ishlashlari va soliq imtiyozi olishlari mumkin",
      tip: "DSU granti ISEE kodi bo'yicha beriladi. Ijtimoiy himoya hujjatlarini elchixonaga to'g'ri topshiring."
    },
    de: {
      country: "Germaniya",
      flag: "🇩🇪",
      city: "Myunxen / Berlin",
      scholarship: "Davlat oliygohlarida kontrakt 100% bepul va DAAD, Deutschlandstipendium dasturlari",
      cost: "Kontrakt barchaga bepul, oziq-ovqat va yashash uchun oyiga €700 - €900 (Block-account talab etiladi)",
      work: "Yiliga 140 kun to'liq yoki 280 kun yarim kunlik qonuniy ishlash kafolati mavjud",
      tip: "Germaniya davlat oliygohlariga topshirganda bevosita 'Uni-Assist' tizimidan to'g'ri foydalaning!"
    },
    kr: {
      country: "Janubiy Koreya",
      flag: "🇰🇷",
      city: "Seul / Pusan",
      scholarship: "GKS davlat granti hamda universitet professorlarining o'z shaxsiy laboratoriya laboratorlik bepul kvotalari",
      cost: "Oyiga taxminan $600 - $850 (agar GKS g'olibi bo'lsangiz barcha yashash va chiptalar bepul g'olibona tugaydi)",
      work: "TOPIK 3-darajadan keyin haftasiga 20 dan 30 soatgacha rasmiy ishlash huquqiga ega bo'linadi",
      tip: "TOPIK sertifikati qabul foizini 90% dan yuqoriga chiqaradi. IELTS bilan ham GKS topshirsangiz bo'ladi."
    },
    cn: {
      country: "Xitoy",
      flag: "🇨🇳",
      city: "Pekin / Shanxay",
      scholarship: "CSC Chinese Government scholarship, Silk Road Fellowship (Full accommodation + 3,000 RMB nafaqa)",
      cost: "CSC grantida yotoqxona va kontrakt butunlay bepul bo'lganligi uchun xarajat 0 yevrodan boshlanadi",
      work: "Alohida ruxsatnomalar, stajirovkalar va universitet tadqiqot laboratoriyalarida yarim kunlik bandlik",
      tip: "Hukumat grantlari uchun professor bilan maktub yozib, Acceptance Letter (Qabul kafolati) olish katta yutuqdir."
    },
    jp: {
      country: "Yaponiya",
      flag: "🇯🇵",
      city: "Tokio / Kyoto",
      scholarship: "MEXT Scholarship, JASSO Fellowship, xususiy yapon korporativ grantlari (Toyota, Panasonic)",
      cost: "MEXT stipendiyasi oyiga 145,000 JPY to'lab turgani uchun yashash xarajatlaridan ortib qoladi",
      work: "Haftasiga 28 soat qonuniy ishlash tizimi (Arubaito) bilan talaba o'z xarajatini 100% mustaqil qoplaydi",
      tip: "MEXT uchun elchixona yo'li orqali yoki to'g'ridan-to'g'ri universitet tavsiyasi orqali ariza bering."
    },
    lv: {
      country: "Latviya",
      flag: "🇱🇻",
      city: "Riga / Jelgava",
      scholarship: "Latvian State Fellowship, Riga Tech Merit-Based scholarship (%50 gacha to'la imtiyozlar)",
      cost: "O'ta arzon - Yevropadagi eng quyi narxlar, oyiga €250 - €450 (xalqaro talabalar yotoqxonasi zo'r)",
      work: "Haftasiga 20 soat va yozgi ta'tilda haftasiga 40 soat umumiy to'liq ishlash huquqi bor",
      tip: "Shengen hududiga kirishning eng oson yo'li bo'lib, o'qish tugagach butun Yevroittifoqda ishlash mumkin."
    }
  };

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

  const top50Unis = [...universitiesData]
    .sort((a, b) => a.ranking - b.ranking)
    .slice(0, 50);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-4" id="home-dashboard-stage">
      
      {/* 1. LIVE GRANT TRACKER (MULTIMEDIA NEON TICKER TAPE) */}
      <div className="w-full overflow-hidden bg-gradient-to-r from-blue-950 via-sky-950 to-blue-950 rounded-2xl border border-cyan-400/35 p-3.5 shadow-lg shadow-cyan-500/10 relative" id="live-grant-ticker-banner">
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-blue-950 to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-blue-950 to-transparent pointer-events-none z-10" />
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-cyan-500/15 border border-cyan-400/30 px-3 py-1 rounded-full animate-pulse shrink-0">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-[10px] font-black text-cyan-300 tracking-widest uppercase">LIVE GRANTS</span>
          </div>
          
          {/* Loopable marquee wrapper */}
          <div className="flex-1 overflow-hidden relative h-5">
            <div className="absolute flex gap-12 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap cursor-pointer">
              {liveGrants.concat(liveGrants).map((gr, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveGrantModal(gr)}
                  className="flex items-center gap-2 hover:text-cyan-300 text-slate-300 transition text-xs font-bold focus:outline-none"
                >
                  <span className="text-cyan-400 font-black">★</span>
                  <span>{gr.title} ({gr.country})</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] border border-amber-500/20 font-mono">
                    Deadline: {gr.deadline}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <span className="text-[10px] text-cyan-400/60 font-mono font-bold shrink-0 hidden sm:inline">
            Hover to Pause • Click Details
          </span>
        </div>
      </div>

      {/* CSS and DOM Animations Injection for Loopable Marquee (Vite compliant) */}
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marqueeRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
      `}</style>

      {/* 2. HEADER BLOCK: PERSONALIZED GREETINGS & PERSONALIZED PROGRESS RING */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch" id="dashboard-personalized-header">
        {/* Welcome card */}
        <div className="lg:col-span-2 rounded-[2rem] border border-sky-100 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-44 h-44 bg-sky-200/15 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
                🎓
              </div>
              <div>
                <span className="text-[10px] font-black tracking-wider text-slate-500 uppercase block">TOPGRAND ACCOUNT</span>
                <h1 className="text-xl sm:text-2xl font-black text-blue-950">
                  Assalomu alaykum, {user.name || "Talaba"}!
                </h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Siz xalqaro talaba bo\'lish sari daxshatli sayohatdasiz. Quyidagi cheklisni yangilab, tayyorgarlik foizini nazorat qiling hamda o\'ngda joylashgan aylanma neon progress bar orqali statusni kuzating. Har bir modul touch-friendly qilib ishlangan!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-6 sm:pt-4">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-black tracking-tight block">KIRISH HUQUQI</span>
              <div className="flex items-center gap-2 pt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-extrabold text-slate-700">Bepul (Cheksiz kirish)</span>
              </div>
            </div>
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3 flex flex-col justify-between">
              <span className="text-[10px] text-blue-800 font-black tracking-tight block">CYBER RANK</span>
              <div className="flex items-center gap-1.5 pt-1 text-blue-950 font-extrabold text-[11px]">
                <Trophy className="h-3.5 w-3.5 text-amber-505" />
                <span>Scholar Prodigy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Progress Ring Container (reads/saves to localStorage) */}
        <div className="rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-slate-900 to-sky-950 p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row lg:flex-col justify-between items-center gap-6" id="personalized-progress-ring-card bg border">
          <div className="absolute -right-12 -bottom-12 w-28 h-28 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
          
          {/* Radial progress design */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-slate-850"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-cyan-400 transition-all duration-500"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 46}
                strokeDashoffset={2 * Math.PI * 46 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0px 0px 6px rgba(34, 211, 238, 0.5))' }}
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xl font-mono font-black text-white">{progressPercent}%</span>
              <span className="text-[9px] text-cyan-300 font-bold block uppercase tracking-wider">TAYYOR</span>
            </div>
          </div>

          {/* Interactive Checklist checkboxes */}
          <div className="flex-1 w-full space-y-2 text-xs">
            <span className="text-[9px] font-black tracking-widest text-[#9ca3af] uppercase block border-b border-white/10 pb-1">
              HUJJATLARINGIZ STATUSI:
            </span>
            <div className="space-y-1.5 font-bold text-slate-200">
              <button 
                onClick={() => handleToggleChecklist('sop')}
                className="flex items-center gap-2.5 w-full hover:text-cyan-300 transition text-left cursor-pointer"
              >
                {checklist.sop ? <CheckSquare className="h-4 w-4 text-cyan-400 shrink-0" /> : <Square className="h-4 w-4 text-slate-500 shrink-0" />}
                <span className={checklist.sop ? "line-through text-slate-400" : ""}>Insho yozilgan (SOP)</span>
              </button>
              <button 
                onClick={() => handleToggleChecklist('lor')}
                className="flex items-center gap-2.5 w-full hover:text-cyan-300 transition text-left cursor-pointer"
              >
                {checklist.lor ? <CheckSquare className="h-4 w-4 text-cyan-400 shrink-0" /> : <Square className="h-4 w-4 text-slate-500 shrink-0" />}
                <span className={checklist.lor ? "line-through text-slate-400" : ""}>Tavsiyalar tayyor (LORs)</span>
              </button>
              <button 
                onClick={() => handleToggleChecklist('cv')}
                className="flex items-center gap-2.5 w-full hover:text-cyan-300 transition text-left cursor-pointer"
              >
                {checklist.cv ? <CheckSquare className="h-4 w-4 text-cyan-400 shrink-0" /> : <Square className="h-4 w-4 text-slate-500 shrink-0" />}
                <span className={checklist.cv ? "line-through text-slate-400" : ""}>ATS CV optimal bo\'lgan</span>
              </button>
              <button 
                onClick={() => handleToggleChecklist('ielts')}
                className="flex items-center gap-2.5 w-full hover:text-cyan-300 transition text-left cursor-pointer"
              >
                {checklist.ielts ? <CheckSquare className="h-4 w-4 text-cyan-400 shrink-0" /> : <Square className="h-4 w-4 text-slate-500 shrink-0" />}
                <span className={checklist.ielts ? "line-through text-slate-400" : ""}>IELTS topshirilgan</span>
              </button>
            </div>
            
            {/* Direct motivational text feedback based on progress */}
            <div className="pt-2 text-[11px] text-cyan-300 italic font-medium leading-tight">
              {progressPercent === 100 ? (
                "🎉 Daxshatli! Hamma hujjatlar tayyor, zudlik bilan rasmiy arizangizni ulaning!"
              ) : progressPercent >= 50 ? (
                "Inshongiz 60% tayyor, tavsiyanoma kutilmoqda, marraga oz qoldi!"
              ) : (
                "Ajoyib boshlanish! Hujjatlar arsenalini (THE DOCUMENT VAULT) to\'ldirishda davom eting."
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- 50 TOP GLOBAL UNIVERSITIES CAROUSEL SLIDER (AUTO-ROTATING FROM LEFT TO RIGHT) --- */}
      <div className="space-y-4" id="top-50-universities-track">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="px-3 py-1 rounded-full text-[9px] uppercase font-black text-indigo-805 bg-indigo-50 border border-indigo-100 tracking-wider">
              TOP 50 GLOBAL UNIVERSITIES (QS WORLD RANKINGS)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-blue-950 mt-1">
              Top 50 Dunyo Universitetlari
            </h2>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Dunyodagi eng kuchli 50 ta yetakchi oliygohlar ro'yxati. Istalgan universitetni tanlang va barcha ma'lumotlarni ko'ring.
            </p>
          </div>
          <span className="text-[10px] text-indigo-500 font-mono font-black shrink-0 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
            Chapdan O'ngga Aylanuvchi • Pause qilish uchun sichqonchani ustiga olib boring
          </span>
        </div>

        {/* Endless marquee slider container of beautiful universities */}
        <div className="w-full overflow-hidden bg-slate-50 border border-slate-200/60 rounded-[2rem] p-4 shadow-sm relative" id="top-50-marquee-track">
          <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-10" />

          <div className="flex overflow-hidden relative h-48 py-2">
            <div className="absolute flex gap-6 animate-[marqueeRight_40s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap cursor-pointer">
              {top50Unis.concat(top50Unis).map((uni, idx) => {
                const imgUrl = campusImages[idx % campusImages.length];
                return (
                  <button
                    key={`${uni.id}-carousel-${idx}`}
                    type="button"
                    onClick={() => {
                      setSelectedCarouselUni(uni);
                      setCarouselUniWebError(null);
                    }}
                    className="w-56 shrink-0 bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-indigo-400 focus:outline-none transition-all duration-300 transform hover:-translate-y-1 shadow-sm text-left flex flex-col justify-between"
                  >
                    <div className="h-24 w-full relative overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={imgUrl}
                        alt={uni.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full font-mono shadow-sm">
                        QS #{uni.ranking}
                      </span>
                      <span className="absolute bottom-2 right-2 bg-slate-900/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                        {uni.country}
                      </span>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <h4 className="text-xs font-black text-slate-950 line-clamp-1 whitespace-normal">
                        {uni.name}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mt-2 pt-1 border-t border-slate-100 shrink-0">
                        <span>{uni.city}</span>
                        <span className="text-indigo-600 font-black">Batafsil →</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. TOPGRAND INTERACTIVE WORLD MAP (HUD NEON EXPERIENCES) */}
      <div className="rounded-[2.5rem] border border-blue-200 bg-blue-50/40 p-6 sm:p-8 shadow-xl space-y-6" id="topgrand-hud-interactive-world-map">
        <div className="max-w-3xl space-y-1.5">
          <span className="px-3 py-1 rounded-full text-[9px] uppercase font-black text-cyan-800 bg-cyan-100 border border-cyan-200 tracking-wider">
            TOPGRAND HUD MAP (0 XARAJOAT)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-blue-950">
            TopGrand Interactive World Map
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
            Dunyodagi eng nufuzli ta\'lim markazlarini neon dunyo xaritasi orqali tanlang. Ixtiyoriy hududni bosish orqali stipendiyalar, bepul yashash imtiyozlari hamda viza sirlarini yoritib beruvchi bir zumda ochiluvchi "Cheat-Sheet" varag\'iga ega bo\'ling.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch pt-2">
          {/* Vector Map Showcase */}
          <div className="xl:col-span-7 bg-[#111827] border border-slate-800 rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between relative shadow-inner overflow-hidden min-h-[340px]">
            {/* Cyber grid overlays */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />
            
            <div className="absolute top-4 left-5 z-20 flex flex-wrap gap-2 items-center">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">7 ACTIVE GLOBAL NODES</span>
            </div>

            {/* Stylized SVG Map nodes */}
            <div className="relative w-full h-[220px] my-auto flex items-center justify-center">
              {/* Actual Map SVG Backdrop */}
              <svg viewBox="0 0 800 400" className="w-full h-full opacity-20 pointer-events-none absolute inset-0">
                <path fill="#475569" d="M150 120h40v20h-40zm30 50h30v15h-30zm320 0h50v30h-50zm80-80h60v40h-60zm-330-40h200v200H300z" opacity="0.1" />
                <path stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" fill="none" d="M100 200h600M400 50v300" />
              </svg>
              
              {/* Interactive HUD Map Pins (exactly placed) */}
              {Object.entries(mapCountriesDb).map(([k, dt]) => {
                // Approximate coordinate positions to make the map beautiful & clean
                const coords: Record<string, { x: string; y: string }> = {
                  us: { x: '22%', y: '28%' },
                  it: { x: '47%', y: '33%' },
                  de: { x: '49%', y: '23%' },
                  kr: { x: '75%', y: '36%' },
                  cn: { x: '70%', y: '32%' },
                  jp: { x: '82%', y: '38%' },
                  lv: { x: '53%', y: '18%' }
                };
                const co = coords[k] || { x: '50%', y: '50%' };
                const isActive = activeMapCountry === k;
                
                return (
                  <button
                    key={k}
                    onClick={() => setActiveMapCountry(k)}
                    className="absolute group focus:outline-none focus:ring-0 cursor-pointer"
                    style={{ left: co.x, top: co.y }}
                  >
                    {/* Glowing animated pulsing circles */}
                    <span className={`absolute -inset-3.5 rounded-full ${isActive ? 'bg-cyan-400/30 scale-125 animate-ping' : 'bg-slate-500/20 group-hover:bg-cyan-500/10 group-hover:scale-110'} transition-all`} />
                    
                    <div className={`relative h-5 w-5 rounded-full ${isActive ? 'bg-cyan-400 border-2 border-white shadow-lg shadow-cyan-400/50' : 'bg-slate-700 border border-slate-600 group-hover:bg-sky-400 group-hover:scale-105'} flex items-center justify-center transition-all`}>
                      <span className="text-[10px] leading-none select-none">{isActive ? '✓' : '•'}</span>
                    </div>
                    
                    {/* Tiny Floating Country Name labels */}
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 border border-slate-750 px-2 py-0.5 rounded text-[10px] font-bold text-white whitespace-nowrap shadow opacity-80 group-hover:opacity-100 transition">
                      {dt.flag} {dt.country}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2.5 z-20 pt-4 border-t border-slate-800/80">
              {Object.entries(mapCountriesDb).map(([k, dt]) => (
                <button
                  key={k}
                  onClick={() => setActiveMapCountry(k)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition flex items-center gap-1.5 cursor-pointer ${
                    activeMapCountry === k 
                      ? 'bg-cyan-400 text-slate-950 shadow shadow-cyan-400/40 font-black' 
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                  style={{ minHeight: '38px' }}
                >
                  <span>{dt.flag}</span>
                  <span>{dt.country}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Glowing Glassmorphic Cheat-Sheet Card (Instant responsive readout) */}
          <div className="xl:col-span-5 flex flex-col justify-between" id="world-map-cheat-sheet-viewer">
            <AnimatePresence mode="wait">
              {activeMapCountry && (
                <motion.div
                  key={activeMapCountry}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-[2rem] border border-cyan-400/15 bg-white p-6 shadow-xl flex flex-col justify-between h-full relative"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl leading-none">{mapCountriesDb[activeMapCountry].flag}</span>
                        <div>
                          <h3 className="text-base font-black text-blue-950 font-sans">
                            {mapCountriesDb[activeMapCountry].country} (Cheat-Sheet)
                          </h3>
                          <p className="text-[10px] text-cyan-600 font-extrabold flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>Markaz: {mapCountriesDb[activeMapCountry].city}</span>
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-cyan-150 border border-cyan-200 text-cyan-800 text-[9px] font-mono font-black animate-pulse">
                        ONLINE DIRECT
                      </span>
                    </div>

                    <div className="space-y-3 text-xs leading-relaxed font-medium text-slate-700">
                      <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                        <span className="text-[10px] font-black text-slate-400 uppercase block tracking-wider">TEKIN O\'QISH / GRAND:</span>
                        <p className="font-extrabold text-[#111827] text-xs leading-normal">{mapCountriesDb[activeMapCountry].scholarship}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1 bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
                          <span className="text-[9px] font-black text-slate-400 uppercase block tracking-wider">YASHASH XARAJATI:</span>
                          <p className="text-[11px] font-extrabold text-slate-900 leading-normal">{mapCountriesDb[activeMapCountry].cost}</p>
                        </div>
                        <div className="space-y-1 bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
                          <span className="text-[9px] font-black text-slate-400 uppercase block tracking-wider">ISH REJIMI:</span>
                          <p className="text-[11px] font-extrabold text-slate-900 leading-normal">{mapCountriesDb[activeMapCountry].work}</p>
                        </div>
                      </div>

                      <div className="space-y-1 bg-cyan-100/10 border border-cyan-200 p-3.5 rounded-2xl text-blue-950 font-bold bg-[#f0f9ff]/50">
                        <span className="text-[10px] font-black text-cyan-700 uppercase block tracking-wider flex items-center gap-1">
                          <Award className="h-3.5 w-3.5" />
                          <span>DAXSHATLI INSIDER MASLAHAT:</span>
                        </span>
                        <p className="text-xs pt-1 leading-relaxed text-[#1e293b]">{mapCountriesDb[activeMapCountry].tip}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('mapper')}
                    className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition text-center shadow shadow-blue-600/30 cursor-pointer"
                    style={{ minHeight: '44px' }}
                  >
                    <span>The Mapper Bo\'limidan Tahlil</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

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

      {/* ANIME DETAILS MODAL OVERLAY FOR ACTIVE TICKER GRANTS */}
      <AnimatePresence>
        {activeGrantModal && (
          <div className="fixed inset-0 bg-[#0f172a]/70 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto" id="grant-tracker-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] border border-cyan-400/25 max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveGrantModal(null)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition cursor-pointer"
                style={{ minHeight: '40px' }}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-[9px] uppercase font-mono font-black text-cyan-800 bg-cyan-100 border border-cyan-300">
                  {activeGrantModal.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-blue-950 font-sans pt-2">
                  {activeGrantModal.title}
                </h3>
                <p className="text-xs text-sky-700 font-extrabold flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Kombinatsiya Davlati: {activeGrantModal.country}</span>
                </p>
              </div>

              <div className="space-y-4 text-xs leading-normal font-medium text-slate-700">
                <p className="text-slate-600 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                  {activeGrantModal.desc}
                </p>

                <div className="space-y-2 bg-[#f0f9ff] border border-blue-100 p-4 rounded-2xl">
                  <span className="text-[10px] font-black text-blue-800 uppercase block">AJRATILADIGAN FOYDALAR KO\'LAMO:</span>
                  <p className="font-extrabold text-blue-950">{activeGrantModal.benefit}</p>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase block tracking-wider">TAYYORLOV STRATEGIK HUJJATLARI:</span>
                  <div className="space-y-2">
                    {activeGrantModal.requirements.map((req, ridx) => (
                      <div key={ridx} className="flex items-start gap-2 text-xs text-[#1f2937] font-semibold">
                        <div className="h-5 w-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                          ✔
                        </div>
                        <span className="pt-0.5">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4.5 w-4.5 text-rose-500" />
                  <div>
                    <span className="text-[9px] text-slate-400 font-black tracking-tight block">DEADLINE MUDDATI</span>
                    <span className="text-[11px] text-rose-600 font-black">{activeGrantModal.deadline}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveGrantModal(null);
                    setActiveTab('funder');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-xl transition text-center cursor-pointer"
                  style={{ minHeight: '44px' }}
                >
                  "THE FUNDER" ga o\'tish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 50 WORLD UNIVERSITIES - CAROUSEL SELECTION DETAIL MODAL */}
      <AnimatePresence>
        {selectedCarouselUni && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto" id="carousel-uni-detail-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="bg-white rounded-[2.5rem] border border-slate-205 max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col my-8"
            >
              {/* Image Banner */}
              <div className="h-56 w-full relative bg-slate-105 shrink-0">
                <img
                  src={campusImages[top50Unis.findIndex(u => u.id === selectedCarouselUni.id) % campusImages.length] || campusImages[0]}
                  alt={selectedCarouselUni.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/20 to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedCarouselUni(null)}
                  className="absolute top-4 right-4 h-10 w-10 rounded-full bg-slate-900/50 hover:bg-slate-950/75 border border-white/20 flex items-center justify-center text-white transition cursor-pointer z-25"
                  style={{ minHeight: '40px' }}
                >
                  <X className="h-5 w-5" />
                </button>
                
                <div className="absolute bottom-4 left-6 right-6 text-left">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      QS Rank: #{selectedCarouselUni.ranking}
                    </span>
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white/10 uppercase tracking-wider">
                      {selectedCarouselUni.country} • {selectedCarouselUni.city}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {selectedCarouselUni.name}
                  </h3>
                </div>
              </div>

              {/* Scrollable Contents */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[55vh] overflow-y-auto text-left">
                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Oliygoh haqida</h4>
                  <p className="text-xs sm:text-sm text-slate-755 font-bold leading-relaxed">
                    {selectedCarouselUni.description}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-blue-50 bg-slate-50/75 p-4 flex items-start gap-3">
                    <div className="p-2.5 bg-blue-100 border border-blue-200 text-blue-700 rounded-xl shrink-0">
                      <DollarSign className="h-5 w-5 stroke-[2.5px]" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yillik Kontrakt / Grant</span>
                      <p className="text-xs sm:text-sm text-blue-950 font-black leading-snug">{selectedCarouselUni.fee}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-50 bg-slate-50/75 p-4 flex items-start gap-3">
                    <div className="p-2.5 bg-blue-105 border border-blue-200 text-blue-700 rounded-xl shrink-0">
                      <Calendar className="h-5 w-5 stroke-[2.5px]" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qabul deadlines</span>
                      <p className="text-xs sm:text-sm text-blue-950 font-black leading-snug">{selectedCarouselUni.deadlines}</p>
                    </div>
                  </div>
                </div>

                {/* Required Hujjatlar */}
                <div className="rounded-2xl border border-blue-50 bg-slate-50/75 p-5 space-y-3.5">
                  <h4 className="font-extrabold text-xs sm:text-sm text-blue-950 flex items-center gap-2">
                    <FileText className="h-4.5 w-4.5 text-blue-700 shrink-0" />
                    <span>Qabul uchun talab qilinadigan hujjatlar:</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 font-bold">
                    {selectedCarouselUni.documents.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sticky Bottom Actions Grid */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <h4 className="text-xs font-black text-slate-900 uppercase">Rasmiy Veb-Sayt</h4>
                  <p className="text-[10px] text-slate-400 font-semibold leading-tight">Portaldagi bevosita yangiliklarni kuzating.</p>
                </div>

                <div className="w-full sm:w-auto flex flex-col gap-1.5 min-w-[200px]">
                  {selectedCarouselUni.website && selectedCarouselUni.website.trim() !== "" && !selectedCarouselUni.website.includes("undefined") ? (
                    <a
                      href={selectedCarouselUni.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition duration-200 shrink-0 shadow-md text-center"
                      style={{ minHeight: '44px' }}
                    >
                      <Globe className="h-4 w-4" />
                      <span>Saytga tashrif buyurish</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCarouselUniWebError("Ushbu universitetning rasmiy veb-sayti mavjud emas.")}
                      className="w-full bg-slate-205 text-slate-500 font-black text-xs py-3 px-5 rounded-xl flex items-center justify-center gap-2 shrink-0 transition cursor-pointer"
                      style={{ minHeight: '44px' }}
                    >
                      <Globe className="h-4 w-4" />
                      <span>Saytga tashrif buyurish</span>
                    </button>
                  )}

                  {carouselUniWebError && (
                    <span className="text-[10px] text-rose-600 font-extrabold text-center block bg-rose-50 border border-rose-100 rounded-lg py-1 px-2 animate-bounce">
                      {carouselUniWebError}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
