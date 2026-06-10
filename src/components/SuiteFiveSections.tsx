import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Compass, DollarSign, Edit3, MessageSquare, Shield, Sparkles, Send, 
  MapPin, Clock, Calendar, CheckCircle, RefreshCw, AlertTriangle, FileText, 
  ChevronRight, Award, Trash2, Heart, BookOpen, Star, HelpCircle, User, Play, Briefcase
} from 'lucide-react';
import { User as UserType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { getApiUrl } from '../lib/api';

interface SuiteFiveSectionsProps {
  sectionId: string; // 'mapper' | 'funder' | 'editor' | 'coach' | 'guardian'
  user: UserType;
  onOpenAuth: () => void;
  onOpenPremium: () => void;
  currentLang?: 'uz' | 'en' | 'ru';
  onToggleFullScreen?: (isOpen: boolean) => void;
}

interface ToolConfig {
  key: string;
  title: string;
  desc: string;
  type: 'static' | 'ai';
  limitType: 'free' | 'limited' | 'pro';
  icon: React.ComponentType<any>;
  color: string;
}

export default function SuiteFiveSections({ 
  sectionId, 
  user, 
  onOpenAuth, 
  onOpenPremium, 
  currentLang = 'uz',
  onToggleFullScreen 
}: SuiteFiveSectionsProps) {

  const [activeTool, setActiveTool] = useState<ToolConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState('');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  
  // Interactive mini-states for particular games/tools
  const [clicheInput, setClicheInput] = useState('Since my childhood, I am hard worker. I have always dreamed to become a systems programmer in NYU because it is very important major for my career. I love coding and doing things...');
  const [clicheResult, setClicheResult] = useState<{ original: string; text: string; count: number; replaced: string[] } | null>(null);
  
  const [selectedCountry, setSelectedCountry] = useState('usa');
  const [selectedMajor, setSelectedMajor] = useState('stem');
  const [selectedDate, setSelectedDate] = useState('2026-09-01');
  const [deadlineResult, setDeadlineResult] = useState<any>(null);

  // Flashcard states
  const [flashcardQuestion, setFlashcardQuestion] = useState('Nima uchun aynan bizning universitetimizni tanlagansiz? Sizga motivatsiya berayotgan real narsa nima?');
  const [flashcardAnswer, setFlashcardAnswer] = useState('');
  const [flashcardReview, setFlashcardReview] = useState('');

  // Continuous chat for Mock simulation
  const [mockHistory, setMockHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);
  const [mockInput, setMockInput] = useState('');

  // Auto handle fullscreen on tool selection
  useEffect(() => {
    if (activeTool) {
      onToggleFullScreen?.(true);
    } else {
      onToggleFullScreen?.(false);
    }
    return () => onToggleFullScreen?.(false);
  }, [activeTool, onToggleFullScreen]);

  // Sections definitions
  const sectionMeta = {
    mapper: {
      title: currentLang === 'uz' ? "THE MAPPER" : currentLang === 'ru' ? "THE MAPPER" : "THE MAPPER",
      subtitle: currentLang === 'uz' ? "Universitetlar va Shaharlar Xaritasi" : currentLang === 'ru' ? "Карта университетов и городов" : "Universities and Cities Navigator",
      desc: currentLang === 'uz' ? "Mablag'larni tejab, to'g'ri oliygoh va davlat tuzilmasini tanlang." : "Выберите правильный университет и страну, экономя время и деньги.",
      tools: [
        {
          key: 'mapper_country_cost',
          title: currentLang === 'uz' ? "Country Cost Navigator" : "Country Cost Navigator",
          desc: currentLang === 'uz' ? "Davlatlardagi eng arzon kontraktlar, yashash xarajatlari va qonuniy ishlash soatlari" : "Minimal tuition fees, monthly living costs and official working hours",
          type: 'static',
          limitType: 'free',
          icon: Compass,
          color: 'from-cyan-500 to-blue-600'
        },
        {
          key: 'mapper_unifilter',
          title: currentLang === 'uz' ? "University Smart Filter" : "University Smart Filter",
          desc: currentLang === 'uz' ? "IELTS va GPA ballaringizga qarab grant qabul imkoniyati eng yuqori bo'lgan 3 ta universitet" : "Recommended 3 top high-quota target universities matched with your IELTS and GPA",
          type: 'ai',
          limitType: 'limited',
          icon: Award,
          color: 'from-blue-600 to-teal-500'
        },
        {
          key: 'mapper_visa_odds',
          title: currentLang === 'uz' ? "Visa Success Odds" : "Visa Success Odds",
          desc: currentLang === 'uz' ? "Moliyaviy hisob va tanlangan mamlakat bo'yicha joriy yildagi viza olish ehtimoli kognitiv bashorati" : "Predicts this year's student visa approval rate %, citing actual sponsors data",
          type: 'ai',
          limitType: 'pro',
          icon: Shield,
          color: 'from-indigo-650 to-purple-600'
        }
      ]
    },
    funder: {
      title: currentLang === 'uz' ? "THE FUNDER" : "THE FUNDER",
      subtitle: currentLang === 'uz' ? "Grants & Financial Support Suite" : "Grants & Financial Support Suite",
      desc: currentLang === 'uz' ? "Universitet to'lovlaridan ozod bo'lish va ko'p yillik stipendiyalarni yutish kaliti" : "Unlock tuition-free admissions, regional scholarships, and fee waivers",
      tools: [
        {
          key: 'funder_calendar',
          title: currentLang === 'uz' ? "Scholarship Calendar & Alerts" : "Scholarship Calendar & Alerts",
          desc: currentLang === 'uz' ? "DAAD, DSU, GKS va Turkiya Burslari kabi daxshatli xalqaro grantlar taqvimi" : "Deadlines and key countdown actions for major governmental grants",
          type: 'static',
          limitType: 'free',
          icon: Calendar,
          color: 'from-emerald-500 to-teal-600'
        },
        {
          key: 'funder_storyteller',
          title: currentLang === 'uz' ? "CSS Profile / Financial Aid Storyteller" : "CSS Profile / Financial Aid Storyteller",
          desc: currentLang === 'uz' ? "Oila daromadiga qarab moliyaviy muhtojlikni isbotlovchi daxshatli ta'sirli xat" : "Drafts a compelling, high-success aid request story for CSS profile",
          type: 'ai',
          limitType: 'limited',
          icon: DollarSign,
          color: 'from-teal-600 to-green-500'
        },
        {
          key: 'funder_feewaiver',
          title: currentLang === 'uz' ? "Tax & Fee Waiver Generator" : "Tax & Fee Waiver Generator",
          desc: currentLang === 'uz' ? "Universitetning topshirish haqini ($50-$100) bekor qilishni so'raydigan rasmiy xat" : "Drafts a professional fee waiver request to bypass application fees",
          type: 'ai',
          limitType: 'pro',
          icon: FileText,
          color: 'from-amber-500 to-orange-600'
        }
      ]
    },
    editor: {
      title: currentLang === 'uz' ? "THE EDITOR" : "THE EDITOR",
      subtitle: currentLang === 'uz' ? "Tezkor va Aqlli Insho Tahrirchisi" : "AI Academic Essay Editorial Editor",
      desc: currentLang === 'uz' ? "Motivatsion xatolaringizni tozalab, haqiqiy akademik tilda o'girib bering" : "Remove boring clichés, polish style, and humanize robotic prose",
      tools: [
        {
          key: 'editor_cliche',
          title: currentLang === 'uz' ? "Cliché Remover & Word Counter" : "Cliché Remover & Word Counter",
          desc: currentLang === 'uz' ? "Inshodagi zerikarli 'Since my childhood' andozalarini avtomatik tozalovchi va so'z sanovchi" : "Finds and eliminates generic phrases, analyzing length and flow",
          type: 'static',
          limitType: 'free',
          icon: RefreshCw,
          color: 'from-gray-500 to-slate-600'
        },
        {
          key: 'editor_hook',
          title: currentLang === 'uz' ? "Paragraph Hook Enhancer" : "Paragraph Hook Enhancer",
          desc: currentLang === 'uz' ? "Taqdimnomangizning birinchi gapini ohanrabo kabi hayajonli va akademik tarzda yozib beradi" : "Enhances your essay beginning into a powerful academic hook",
          type: 'ai',
          limitType: 'limited',
          icon: Sparkles,
          color: 'from-pink-500 to-rose-450'
        },
        {
          key: 'editor_humanize',
          title: currentLang === 'uz' ? "Complete Essay Humanizer" : "Complete Essay Humanizer",
          desc: currentLang === 'uz' ? "Robotik tonlardan butunlay tozalab, 100% insoniy yozilgan deb tasdiqlanadigan darajaga o'tkazish" : "Rewrites robotic text to look 100% human-crafted and organic",
          type: 'ai',
          limitType: 'pro',
          icon: Edit3,
          color: 'from-purple-600 to-indigo-500'
        }
      ]
    },
    coach: {
      title: currentLang === 'uz' ? "THE COACH" : "THE COACH",
      subtitle: currentLang === 'uz' ? "Suhbat va Amaliy Nutq Mashqlari" : "Admissions Mock & Interview Trainer",
      desc: currentLang === 'uz' ? "Universitet elchilari va dekanlar suhbatidan qo'rquvsiz o'ting" : "Beat anxiety, formulate advanced responses, and simulation training",
      tools: [
        {
          key: 'coach_ques_cheat',
          title: currentLang === 'uz' ? "Top 20 Interview Cheat-Sheet" : "Top 20 Interview Cheat-Sheet",
          desc: currentLang === 'uz' ? "Xalqaro qabulda eng ko'p so'raladigan 20 ta savol va eng qudratli javob turlari" : "The 20 most frequent interview questions with logical strategy cheat sheet",
          type: 'static',
          limitType: 'free',
          icon: BookOpen,
          color: 'from-indigo-500 to-blue-500'
        },
        {
          key: 'coach_flashcard',
          title: currentLang === 'uz' ? "Random Flashcard Interview" : "Random Flashcard Interview",
          desc: currentLang === 'uz' ? "Kutilmagan tasodifiy qiyin savollar, javobingizni 10 ballik tizimda xolis baholaydi" : "AI rolls a random tough question, analyzes your answer, and scores it /10",
          type: 'ai',
          limitType: 'limited',
          icon: MessageSquare,
          color: 'from-sky-500 to-cyan-500'
        },
        {
          key: 'coach_mock',
          title: currentLang === 'uz' ? "Full Dynamic Mock Panel" : "Full Dynamic Mock Panel",
          desc: currentLang === 'uz' ? "Dekan va Qabul Qo'mitasi elchisi ishtirokidagi 15 daqiqalik uzluksiz sobiq simulyatsiya" : "Immersive interactive back-and-forth chat simulating a strict committee",
          type: 'ai',
          limitType: 'pro',
          icon: Award,
          color: 'from-rose-500 to-red-650'
        }
      ]
    },
    guardian: {
      title: currentLang === 'uz' ? "THE GUARDIAN" : "THE GUARDIAN",
      subtitle: currentLang === 'uz' ? "Hujjatlar Xavfsizligi & Kelajak Kafolati" : "Application Shield and Appeals Hub",
      desc: currentLang === 'uz' ? "Hujjatlar xatosini uzoq muddatli nazorat qilish va rad xatlarini grantga aylantirish" : "Deadlines tracking, document format check and rejection appeal builder",
      tools: [
        {
          key: 'guardian_deadline',
          title: currentLang === 'uz' ? "Deadline Alarm & Task List" : "Deadline Alarm & Task List",
          desc: currentLang === 'uz' ? "Sektor va hujjat topshirish muddatini hisoblab, dinamik va qulay vazifalar ro'yxatini tuzadi" : "Generates adaptive timeline checklist to complete requirements on time",
          type: 'static',
          limitType: 'free',
          icon: Clock,
          color: 'from-amber-400 to-yellow-600'
        },
        {
          key: 'guardian_document',
          title: currentLang === 'uz' ? "Document Integrity Check" : "Document Integrity Check",
          desc: currentLang === 'uz' ? "Sertifikat yoki diplom matni mantiq xatolari va xalqaro apostil talablari tahlili" : "Scans transcript / certificate notes for format risks or gaps",
          type: 'ai',
          limitType: 'limited',
          icon: FileText,
          color: 'from-teal-600 to-emerald-500'
        },
        {
          key: 'guardian_appeal',
          title: currentLang === 'uz' ? "Second-Chance Appeal Architect" : "Second-Chance Appeal Architect",
          desc: currentLang === 'uz' ? "Universitet rad darchasidan keyin qarorni qayta ko'rib chiqishga majburlaydigan kuchli xat" : "Drafts a compelling, high-arguments reconsideration appeal",
          type: 'ai',
          limitType: 'pro',
          icon: AlertTriangle,
          color: 'from-purple-600 to-pink-500'
        }
      ]
    }
  };

  const currentSection = sectionMeta[sectionId as keyof typeof sectionMeta];
  if (!currentSection) return null;

  // Execute AI requests
  const handleExecuteAI = async () => {
    if (!activeTool) return;
    if (activeTool.limitType === 'limited' && !user.isLoggedIn) {
      onOpenAuth();
      return;
    }
    if (activeTool.limitType === 'pro' && !user.isPremium) {
      onOpenPremium();
      return;
    }

    setLoading(true);
    setApiResult('');

    try {
      let promptData: any = { ...inputs };
      
      // Pass specialized prompts for tools
      if (activeTool.key === 'coach_flashcard') {
        promptData = {
          question: flashcardQuestion,
          userAnswer: flashcardAnswer
        };
      }

      const response = await fetch(getApiUrl('/api/ai/generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: activeTool.key,
          inputData: promptData,
          userContext: {
            name: user.name || 'Talaba',
            surname: user.surname || '',
            isPremium: user.isPremium
          }
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setApiResult(data.text);
      } else {
        alert(data.error || "Sun'iy intellekt aloqasida xatolik. Keyinroq qaytadan urining.");
      }
    } catch (e) {
      console.error(e);
      alert("Tizimda ulanish xatoligi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  // CLIENT-SIDE ENGINES (STATIC SOLUTIONS)
  
  // 1.1 Country Cost Navigator
  const countryCosts: Record<string, any> = {
    usa: {
      tuition: "$12,000 - $45,000 / yillik",
      living: "$900 - $1,500 / oylik",
      hours: "Haftasiga 20 soat qonuniy (Faqat universitet hududida / On-Campus)",
      topQuota: "Aynan xalqaro talabalarga eng ko'p grant va yordam (Financial Aid) ajratadigan davlat.",
      jobs: "Kutubxonalarda ishlash, assistentlik, yo'nalish bo'yicha kichik tadqiqot loyihalari."
    },
    germany: {
      tuition: "Yillik $0! Davlat oliygohlarida mutaxassislik mutlaqo bepul (Faqat ozgina semestr to'lovi $150-$300 bor)",
      living: "$750 - $950 / oylik",
      hours: "Yiliga 120 to'liq kun yoki 240 yarim kun (Haftasiga taxminan 20 soat off-campus)",
      topQuota: "Talabalar uchun juda qulay, o'qish tugagandan keyin 18 oylik ish qidirish vizasi taqdim etiladi.",
      jobs: "Darsdan tashqari ofis ishlari, yetkazib berish, til o'rgatish."
    },
    korea: {
      tuition: "$2,800 - $6,500 / yillik (IELTS va TOPIK bali borlarga 30% dan 100% gacha grant)",
      living: "$600 - $800 / oylik",
      hours: "Haftasiga 20 dan 30 soatgacha (TOPIK darajangiz yuqori bo'lsa off-campus ochiq ruxsatnoma)",
      topQuota: "Yuqori texnologiya, innovatsiyalar markazi. GKS granti orqali to'liq bepul o'qish imkoniyati bor.",
      jobs: "Kafelarda yordamchilik, tarjimonlik, ingliz tili o'qituvchisi, qadoqlash korxonalari."
    },
    latvia: {
      tuition: "$2,000 - $4,500 / yillik",
      living: "$450 - $650 / oylik",
      hours: "Haftasiga 20 soat qonuniy (Dars vaqtida ochiq)",
      topQuota: "Evropa Ittifoqidagi eng hamyonbop o'qish va vizaviy oson yo'nalishlardan biri. Shengen hududida cheksiz sayohat.",
      jobs: "Startaplarda ishlash, yetkazib berish xizmatlari, mehmonxona va turizm sohalari."
    }
  };

  // 2.1 Calendar
  const scholarshipCalendar = [
    { name: "DSU Regional Grant (Italiya)", date: "Iyul - Sentyabr", info: "O'qish kontrakt to'lovidan to'liq ozod bo'ladi, yiliga €5,000-€7,200 bepul stipendiya + bepul tushlik talonlari beriladi.", action: "Oilaviy daromad hujjatlarini (Sottoscrizione ISEE) tayyorlang!" },
    { name: "DAAD Study Grants (Germaniya)", date: "Sentyabr - Noyabr", info: "Oylik €934 miqdorida stipendiya, sug'urta, bepul yo'lkira va nemis tili bo'yicha bepul intensiv tayyorlov kurslari.", action: "Kuchli Motivatsiya xati va 2 ta professor tavsiyanomasini yarating!" },
    { name: "Turkiye Burslari (Turkiya)", date: "Yanvar - Fevral", info: "Yotoqxona bepul, oylik yuqori stipendiya, aviachiptalar, tekin sug'urta va to'liq bepul universitet o'qish dasturi.", action: "Sinfdan tashqari sertifikatlaringizni va jamoat ishlarini tasdiqlang." },
    { name: "GKS (Janubiy Koreya)", date: "Fevral - Mart", info: "Yiliga eng katta stipendiyalardan biri, 1 yillik bepul koreys tili tayyorlov kursi, aviachiptalar va to'liq tibbiy sug'urta kafolati.", action: "Tavsiyanomalar, rezyume va bir nechta Study Plan insholarini daxshatli yozing." },
    { name: "Fulbright Program (AQSh)", date: "Aprel - Iyun", info: "Magistratura o'qishlari uchun AQSh davlat granti. Kontrakt, yashash, sug'urta va barcha yo'l safarlari AQSh tomonidan qoplanadi.", action: "TOEFL/IELTS daxshatli ballarini oling va soha loyihasini yarating!" }
  ];

  // 3.1 Cliché Remover & Word Counter
  const runClicheRemover = () => {
    let text = clicheInput;
    let count = text.split(/\s+/).filter(Boolean).length;
    const cliches = [
      { find: /Since my childhood/gi, replace: "Throughout my formative academic pursuits" },
      { find: /I am hard worker/gi, replace: "I demonstrate exceptional intellectual tenacity" },
      { find: /I have always dreamed/gi, replace: "My fundamental academic aspirations reside in" },
      { find: /very important/gi, replace: "pivotal and paramount" },
      { find: /I love coding/gi, replace: "I possess an intrinsic fascination with computational logic" }
    ];

    let foundList: string[] = [];
    cliches.forEach(item => {
      if (text.match(item.find)) {
        foundList.push(item.find.source.replace('/gi', ''));
        text = text.replace(item.find, `**${item.replace}**`);
      }
    });

    setClicheResult({
      original: clicheInput,
      text: text,
      count: count,
      replaced: foundList
    });
  };

  // 4.1 Top 20 cheat-sheet
  const cheatSheetQuestions = [
    { q: "O'zingiz haqingizda gapirib bering?", strategy: "Sodda tarjimai hol aytmang. Shaxsiy qiziqishingiz, oxirgi bajargan nufuzli loyihangiz va bu oliygoh maqsadlariga qanday bog'liqligini 90 soniyada ishonarli qilib aytib bering. Amaliy natijalarni raqamlar bilan bog'lang." },
    { q: "Nega aynan ushbu oliygohda o'qishni hohlaysiz?", strategy: "Ssenariy: 'Universitet juda zo'r va reytingi yuqori' degan andozadan darhol qoching. Universitetdagi aniq 1 ta professor ishi, 1 ta unikal laboratoriya kabi faqatgina siz bilgan resurslarni bitta xatda tushuntiring." },
    { q: "Eng katta zaifligingiz (weakness) nima?", strategy: "Yolg'on kamtarlik qilmang ('Ishga berilib ketaman'). Haqiqiy bitta kichik tahliliy kamchilikni ayting hamda undan qanday qutulib, real tajriba to'playotganingizni aniq ko'rsating." },
    { q: "Biz sizga nega grant taqdim etishimiz kerak?", strategy: "Boshqa talabalardan qanday mantiqiy yoki shaxsiy afzallikka ega ekaningizni, yozgan loyihalaringiz va siz tufayli oliygoh qanday ijtimoiy/akademik yutuq olishini isbotlab bering." },
    { q: "5 yildan keyin o'zingizni qaerda ko'rasiz?", strategy: "Ish faqat mansab haqida gapirmang. Dunyo miqyosidagi qaysi katta muammoni (e.g. iqlim isishi, kibermuhofaza) yechishda yetakchi konsultant yoki startapchi bo'lishingizni akademik tarzda ayting." }
  ];

  // 5.1 Deadline check
  const handleCalculateDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    const d1 = new Date();
    const d2 = new Date(selectedDate);
    const diffMs = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    // Create task lists
    const tasks = [
      { id: 1, title: "IELTS & SAT sertifikatlarini jo'natish", deadline: "30 kun ichida" },
      { id: 2, title: "Tavsiyanomalar (LOR) yig'ish va tarjima qilish", deadline: "45 kun ichida" },
      { id: 3, title: "Hissiy Hook inshoni tahrirlab tugatish", deadline: "60 kun ichida" },
      { id: 4, title: "Bank sertifikati va Homiylik xatlarini muhrlatish", deadline: "Muddat tugashidan 15 kun avval" }
    ];

    setDeadlineResult({
      daysLeft: diffDays,
      tasks: tasks,
      status: diffDays > 90 ? 'Xavfsiz va qulay' : diffDays > 30 ? 'Tezkor tayyorgarlik kerak!' : 'Hozirdan harakat qilmasangiz kech bo\'ladi! 🚨'
    });
  };

  // Mock back-and-forth mock conversation engine
  const handleSendMockMsg = async () => {
    if (!mockInput.trim() || loading) return;
    const userMsg = mockInput;
    setMockHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setMockInput('');
    setLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/ai/generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'coach_mock',
          inputData: {
            userMessage: userMsg,
            history: JSON.stringify(mockHistory.slice(-6))
          },
          userContext: {
            name: user.name || 'Talaba',
            surname: user.surname || '',
            isPremium: user.isPremium
          }
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setMockHistory(prev => [...prev, { sender: 'ai', text: data.text }]);
      } else {
        setMockHistory(prev => [...prev, { sender: 'ai', text: "Muloqot tahlili yakunlandi yoki API xatosi. Iltimos davom etishni xohlasangiz xabar yo'llang." }]);
      }
    } catch {
      setMockHistory(prev => [...prev, { sender: 'ai', text: "Komissiya: Biz ulanish xatosi sababli suhbatimizni biroz to'xtatdik. Lekin ishonch bilan ayting, rejangiz qanday?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8" id="suite-five-root">
      
      <AnimatePresence mode="wait">
        {!activeTool ? (
          /* SECTION ROOT CATALOG OF SECTORS */
          <motion.div
            key="catalog-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Header Area */}
            <div className="bg-white border border-sky-100 rounded-[2.5rem] p-6 md:p-10 text-center space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-sky-200/20 rounded-full blur-[40px] pointer-events-none" />
              <span className="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-100 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-sky-700 font-mono">
                <Sparkles className="h-3.5 w-3.5 text-sky-500" />
                <span>TopGrand Professional Central Suite</span>
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-snug">
                {currentSection.title}
              </h1>
              <p className="text-sm font-extrabold text-sky-700 uppercase tracking-widest -mt-2">
                {currentSection.subtitle}
              </p>
              <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto font-medium">
                {currentSection.desc}
              </p>
            </div>

            {/* List of 3 Tools under this specific section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentSection.tools.map((tool) => {
                const IconComp = tool.icon;
                return (
                  <div
                    key={tool.key}
                    className="bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col justify-between shadow-md hover:border-sky-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                    id={`suite-card-${tool.key}`}
                  >
                    <div>
                      {/* Limit / Plan Tag */}
                      <div className="flex justify-between items-center mb-6">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                          tool.limitType === 'free' 
                            ? 'bg-emerald-50 border-emerald-150 text-emerald-700' 
                            : tool.limitType === 'limited' 
                            ? 'bg-sky-50 border-sky-150 text-sky-700' 
                            : 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse'
                        }`}>
                          {tool.limitType === 'free' && 'Mutloq BEPUL'}
                          {tool.limitType === 'limited' && 'Kuniga 3 marta'}
                          {tool.limitType === 'pro' && 'Faqat PRO (MUTLAQ)'}
                        </span>
                        
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {tool.type === 'static' ? '⚡ Static (Tezkor)' : '🧠 AI Real-time'}
                        </span>
                      </div>

                      {/* Icon & Title */}
                      <div className="space-y-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-lg shadow-sky-500/10`}>
                          <IconComp className="h-6 w-6 stroke-[2.5px]" />
                        </div>
                        <h3 className="text-base font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                          {tool.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 pt-5 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setActiveTool(tool as ToolConfig);
                          setApiResult('');
                        }}
                        className="w-full py-3 bg-slate-50 hover:bg-sky-600 hover:text-white border border-slate-150 rounded-xl text-xs font-black uppercase tracking-wider text-slate-705 flex items-center justify-center gap-1.5 transitionCursor transition cursor-pointer active:scale-98"
                      >
                        Boshlash / Ochish
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* DEEP IMMERSIVE FULL SCREEN WORKSPACE VIEW (ONLY ESCAPE TOP BACK BUTTON AS MANDATED) */
          <motion.div
            key="workspace-view"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col justify-between overflow-y-auto w-full p-4 md:p-8"
            id={`fullscreen-workspace-${activeTool.key}`}
          >
            {/* Top Minimal Back Headrest Option */}
            <div className="max-w-4xl w-full mx-auto flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <button
                onClick={() => {
                  setActiveTool(null);
                  setApiResult('');
                }}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-wider text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition cursor-pointer active:scale-95"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Orqaga Qaytish</span>
              </button>

              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-sky-600">
                  {currentSection.title} Central Hub
                </span>
                <p className="text-xs md:text-sm font-black text-slate-900">
                  {activeTool.title}
                </p>
              </div>
            </div>

            {/* Main Workbench Inner Body */}
            <div className="max-w-4xl w-full mx-auto flex-grow flex flex-col justify-start">
              
              {/* If Free staticCountryCost Tool */}
              {activeTool.key === 'mapper_country_cost' && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-6 shadow-sm">
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900">1.1. Country Cost Navigator (Mutloq Bepul)</h3>
                    <p className="text-xs text-slate-500 font-medium font-sans">
                      Davlatni tanlang va undagi xarajatlar tahlilini bir soniyada vizual kartochkalar orqali o'rganing.
                    </p>
                  </div>

                  {/* Buttons Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'usa', label: '🇺🇸 AQSh' },
                      { id: 'germany', label: '🇩🇪 Germaniya' },
                      { id: 'korea', label: '🇰🇷 Janubiy Koreya' },
                      { id: 'latvia', label: '🇱🇻 Latviya' }
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => setSelectedCountry(btn.id)}
                        className={`py-3 rounded-xl border text-xs font-black transition cursor-pointer ${
                          selectedCountry === btn.id 
                            ? 'bg-sky-600 text-white border-sky-600 shadow-md' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Country Cost Sheet Card */}
                  <div className="border border-slate-150 rounded-2xl p-5 bg-slate-50 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-150">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Eng arzon kontrakt:</span>
                        <span className="text-xs font-extrabold text-blue-900 block">{countryCosts[selectedCountry].tuition}</span>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl border border-slate-150">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Yashash xarajatlari (oylik):</span>
                        <span className="text-xs font-extrabold text-amber-900 block">{countryCosts[selectedCountry].living}</span>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-150">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Haftalik ishlash soati:</span>
                        <span className="text-xs font-extrabold text-emerald-9 hover:text-emerald-950 block">{countryCosts[selectedCountry].hours}</span>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Top nufuzli grant va kvota statuslari:</span>
                      <p className="text-slate-700 text-xs font-semibold leading-relaxed">
                        {countryCosts[selectedCountry].topQuota}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Talabalarlar uchun mavjud ish o'rinlari:</span>
                      <p className="text-slate-700 text-xs font-semibold leading-relaxed">
                        {countryCosts[selectedCountry].jobs}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 1.2 University Smart Filter */}
              {activeTool.key === 'mapper_unifilter' && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-5 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">1.2. University Smart Filter (Kuniga 3 marta)</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Sizning IELTS va GPA ko'rsatkichlaringiz bo'yicha grant yutish imkoniyati eng yuqori bo'lgan 3 ta real universitet kombinatsiyasini aniqlab beruvchi AI hisobot.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">IELTS ballingiz (yoki til sertifikati level):</label>
                      <input
                        type="text"
                        placeholder="IELTS 7.0 (yoki o'rniga TOPIK, nemis tili B2)"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 text-slate-905"
                        value={inputs.ielts || ''}
                        onChange={e => setInputs({ ...inputs, ielts: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GPA yoki diplom ballaringiz:</label>
                      <input
                        type="text"
                        placeholder="GPA: 4.8 / 5.0"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 text-slate-905"
                        value={inputs.gpa || ''}
                        onChange={e => setInputs({ ...inputs, gpa: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleExecuteAI}
                    disabled={loading}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md active:scale-98"
                  >
                    {loading ? "Hisoblanmoqda..." : "Grant Universitetlarini Chiqarish ✨"}
                  </button>

                  {/* Output area */}
                  {apiResult && (
                    <div className="p-5 bg-sky-50/50 border border-sky-100 rounded-2xl space-y-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-sky-700 block">TopGrand AI Tahlili:</span>
                      <div className="text-xs text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap">
                        {apiResult}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 1.3 Visa Success Odds */}
              {activeTool.key === 'mapper_visa_odds' && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-5 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">1.3. Visa Success Odds (Faqat PRO)</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Eslatma: Moliyaviy sponsoringiz bank hisobidagi qoldiq va tanlagan davlatga qarab viza olish success % bashorat qilish kognitiv xizmati.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Targeting Country (Viza olinadigan davlat):</label>
                      <input
                        type="text"
                        placeholder="E.g., AQSh, Polsha, Germaniya, Koreya..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 text-slate-905"
                        value={inputs.country || ''}
                        onChange={e => setInputs({ ...inputs, country: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sponsor bank hisobidagi summa ($ USD):</label>
                      <input
                        type="text"
                        placeholder="E.g., $15,000"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 text-slate-905"
                        value={inputs.sponsorAmt || ''}
                        onChange={e => setInputs({ ...inputs, sponsorAmt: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleExecuteAI}
                    disabled={loading}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md active:scale-98"
                  >
                    {loading ? "Hisob-viza foizini tuzmoqda..." : "Viza Imkoniyatini Ko'rish (PRO)"}
                  </button>

                  {/* Output area */}
                  {apiResult && (
                    <div className="p-5 bg-sky-50/50 border border-sky-100 rounded-2xl space-y-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-sky-700 block">Viza Bo'limi Tahlili:</span>
                      <div className="text-xs text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap">
                        {apiResult}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2.1 Scholarship Calendar & Alerts */}
              {activeTool.key === 'funder_calendar' && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-6 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">2.1. Scholarship Calendar & Alerts (Mutloq Bepul)</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Dunyodagi eng yirik nufuzli, davlat va tashkilotlar tomonidan ajratiladigan 100% grantlarning muddatlari va ko'rsatkichlari.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {scholarshipCalendar.map((item, index) => (
                      <div key={index} className="border border-slate-150 rounded-xl p-4 bg-slate-50 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-slate-900">{item.name}</span>
                          <span className="text-[10px] font-black text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">{item.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                          {item.info}
                        </p>
                        <p className="text-[10px] text-sky-700 leading-relaxed font-bold font-mono uppercase">
                          💡 REJA: {item.action}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2.2 CSS Profile / Financial Aid Storyteller */}
              {activeTool.key === 'funder_storyteller' && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-5 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">2.2. CSS Profile / Financial Aid Storyteller</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Oilaviy daromad va sharoitingizga to'g'ri keluvchi, universitetga yuboriladigan moliyaviy muhtojlik xati (Financial Aid Need Letter) loyihasini sun'iy intellekt orqali tayyorlash.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Oila a'zolari oylik o'rtacha daromadi yoki oilaviy sharoit haqida qisqacha ma'lumot:</label>
                    <textarea
                      placeholder="Masalan: Oila boshlig'i nafaqada, oylik oilaviy daromad $350 ga teng, oilada 3 ta talaba bor..."
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 text-slate-905"
                      value={inputs.familyStatus || ''}
                      onChange={e => setInputs({ ...inputs, familyStatus: e.target.value })}
                    />
                  </div>

                  <button
                    onClick={handleExecuteAI}
                    disabled={loading}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md active:scale-98"
                  >
                    {loading ? "Tizim daxshatli xat yozmoqda..." : "Xat Loyihasini Tuzish ✨ (BEPUL)"}
                  </button>

                  {/* Output area */}
                  {apiResult && (
                    <div className="p-5 bg-sky-50/50 border border-sky-100 rounded-2xl space-y-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-sky-700 block">Yozilgan Financial Aid xati (English):</span>
                      <div className="text-xs text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap bg-white border border-slate-150 p-4 rounded-xl">
                        {apiResult}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2.3 Tax & Fee Waiver Generator */}
              {activeTool.key === 'funder_feewaiver' && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-5 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">2.3. Tax & Fee Waiver Generator (Faqat PRO)</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Chet el universitetlariga hujjat topshirish to'lovini ($50-$100) tekinga o'tkazishni so'raydigan rasmiy ariza va fee waiver maktubini tayyorlash.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Targeting University (Universitet va yo'nalish nomi):</label>
                    <input
                      type="text"
                      placeholder="E.g., Boston University"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 text-slate-905"
                      value={inputs.targetUniName || ''}
                      onChange={e => setInputs({ ...inputs, targetUniName: e.target.value })}
                    />
                  </div>

                  <button
                    onClick={handleExecuteAI}
                    disabled={loading}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md active:scale-98"
                  >
                    {loading ? "Fee Waiver generatsiya qilinmoqda..." : "Application Fee Waiver xatini tayyorlash (PRO)"}
                  </button>

                  {/* Output area */}
                  {apiResult && (
                    <div className="p-5 bg-sky-50/50 border border-sky-100 rounded-2xl space-y-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-sky-700 block">Waiver Request Template:</span>
                      <div className="text-xs text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap bg-white border border-slate-150 p-4 rounded-xl">
                        {apiResult}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3.1 Cliché Remover & Word Counter */}
              {activeTool.key === 'editor_cliche' && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-5 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">3.1. Cliché Remover & Word Counter (Mutloq Bepul)</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Insholardagi andozaviy klishelarni aniqlaydi, qulay va boy sinonimlarga almashtiradi hamda so'z va belgilar sonini hisoblaydi.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inshongiz (SOP / Motivation Letter):</label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 text-slate-905"
                      value={clicheInput}
                      onChange={e => setClicheInput(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={runClicheRemover}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md active:scale-98"
                  >
                    Klishelarni qidirish va tozalash ⚡
                  </button>

                  {clicheResult && (
                    <div className="p-5 bg-slate-50 border border-slate-205 rounded-xl space-y-4">
                      <div className="flex justify-between text-[10px] font-mono font-bold text-slate-550 border-b pb-2">
                        <span>SO'ZLAR SONI: {clicheResult.count} ta</span>
                        <span className="text-emerald-700">ANIQLANGAN KLISHELAR: {clicheResult.replaced.length} ta</span>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-450 block">Yangilangan soha va toza matn:</span>
                        <div 
                          className="text-xs text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap bg-white p-4 border rounded-xl"
                          dangerouslySetInnerHTML={{ __html: clicheResult.text }}
                        />
                      </div>

                      {clicheResult.replaced.length > 0 && (
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 space-y-1">
                          <span className="text-[9px] font-bold text-amber-700 uppercase tracking-widest block">O'chirilgan andozalar:</span>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {clicheResult.replaced.map((val, idx) => (
                              <span key={idx} className="bg-white px-2.5 py-1 text-[10px] font-bold rounded border border-amber-250 text-amber-9">{val}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 3.2 Paragraph Hook Enhancer */}
              {activeTool.key === 'editor_hook' && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-5 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">3.2. Paragraph Hook Enhancer</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Inshongizning kirish gaplarini qabul komissiyasini jalb qila oladigan ilmiy-akademik jozibadorlikka ko'taradi.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inshoning birinchi gapi (kirish qismi):</label>
                    <textarea
                      placeholder="Draft intro: Since my childhood I liked data science..."
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 text-slate-905"
                      value={inputs.hookIntro || ''}
                      onChange={e => setInputs({ ...inputs, hookIntro: e.target.value })}
                    />
                  </div>

                  <button
                    onClick={handleExecuteAI}
                    disabled={loading}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md active:scale-98"
                  >
                    {loading ? "Hook variantlarini tuzmoqda..." : "Kirish Gapini Daxshatli Qilish ✨"}
                  </button>

                  {/* Output area */}
                  {apiResult && (
                    <div className="p-5 bg-sky-50/50 border border-sky-100 rounded-2xl space-y-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-sky-700 block">Tuzilgan Akademik Hook Gaplar (English):</span>
                      <div className="text-xs text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap bg-white border border-slate-150 p-4 rounded-xl">
                        {apiResult}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3.3 Complete Essay Humanizer */}
              {activeTool.key === 'editor_humanize' && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-5 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">3.3. Complete Essay Humanizer (Faqat PRO)</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Robotik (AI) ohangda yozilgan motivation xatlarini 100% inson qo'li bilan yozilgan tabiiy darajaga o'tkazadi va andozani tozalaydi.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tahrir qilmoqchi bo'lgan to'liq inshongiz:</label>
                    <textarea
                      placeholder="Put your essay here..."
                      rows={5}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 text-slate-905"
                      value={inputs.essayPayload || ''}
                      onChange={e => setInputs({ ...inputs, essayPayload: e.target.value })}
                    />
                  </div>

                  <button
                    onClick={handleExecuteAI}
                    disabled={loading}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md active:scale-98"
                  >
                    {loading ? "Humanize qilinmoqda..." : "Essay Humanizer Dasturini ishga tushirish (PRO)"}
                  </button>

                  {/* Output area */}
                  {apiResult && (
                    <div className="p-5 bg-sky-50/50 border border-sky-100 rounded-2xl space-y-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-sky-700 block">Tabiiylashtirilgan Toza Matn:</span>
                      <div className="text-xs text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap bg-white border border-slate-150 p-4 rounded-xl">
                        {apiResult}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4.1 Top 20 Interview Cheat-Sheet */}
              {activeTool.key === 'coach_ques_cheat' && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-6 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">4.1. Top 20 Interview Cheat-Sheet (Mutloq Bepul)</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Etakchi universitetlar intervyusida so'raladigan eng ko'p beriladigan daxshatli savollar qolipi va ularga beriladigan taktikalar.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {cheatSheetQuestions.map((item, idx) => (
                      <div key={idx} className="border border-slate-150 rounded-xl p-4 bg-slate-50 space-y-1">
                        <span className="text-xs font-black text-slate-900">SAVOL #{idx+1}: "{item.q}"</span>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-semibold pt-1">
                          <strong>Taktika:</strong> {item.strategy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4.2 Random Flashcard Interview */}
              {activeTool.key === 'coach_flashcard' && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-5 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">4.2. Random Flashcard Interview</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      AI tasodifiy bitta qiyin suhbat savolini generator qiladi. Siz unga yozma javob berasiz, AI esa 10 ballik tizimda tahlil qiladi.
                    </p>
                  </div>

                  {/* Question Flashcard */}
                  <div className="bg-indigo-50/50 border border-indigo-150 rounded-2xl p-5 text-center relative">
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-700 block mb-2">Tasodifiy Savol Card:</span>
                    <p className="text-xs font-black text-indigo-950 max-w-xl mx-auto italic leading-relaxed">
                      "{flashcardQuestion}"
                    </p>
                    <button
                      onClick={() => {
                        const quesList = [
                          "Universitetimizda siz o'zlashtirishni reja qilayotgan sohaning eng katta axloqiy/ijtimoiy kamchiligi nima deb hisoblaysiz?",
                          "Agar sizga oliygohimizda barcha moliyaviy byudjeti cheksiz birorta tadqiqot boshlash huquqi berilsa, qaysi muammoni yechardingiz?",
                          "Siz darslardan tashqari o'zingizning guruhdoshlaringiz yoki burchingiz oldida qanday mantiqiy majburiyat his qilasiz?",
                          "Loyihangizda biror jiddiy muvaffaqiyatsizlik yuz berganda buni jamoaga qanday tushuntirgan edingiz?"
                        ];
                        const randomQ = quesList[Math.floor(Math.random() * quesList.length)];
                        setFlashcardQuestion(randomQ);
                        setFlashcardReview('');
                        setFlashcardAnswer('');
                      }}
                      className="mt-3.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold uppercase transition scale-95"
                    >
                      Boshqa Savol Olish 🔄
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sizning beradigan javobingiz:</label>
                    <textarea
                      placeholder="Javobingizni o'zbek yoki ingliz tilida batafsil yozing..."
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 text-slate-905"
                      value={flashcardAnswer}
                      onChange={e => setFlashcardAnswer(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleExecuteAI}
                    disabled={loading}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md active:scale-98"
                  >
                    {loading ? "AI javobni tekshiryapti..." : "Javobni Tekshirish va Baholash ⚡"}
                  </button>

                  {/* Output Review */}
                  {apiResult && (
                    <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 block">AI Imtihonchi Reviewsi:</span>
                      <div className="text-xs text-slate-705 leading-relaxed font-semibold whitespace-pre-wrap">
                        {apiResult}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4.3 Full Dynamic Mock Panel */}
              {activeTool.key === 'coach_mock' && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-5 shadow-sm flex flex-col justify-between h-[65vh]">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">4.3. Full Dynamic Mock Panel (Faqat PRO)</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Suhbat xonasiga xush kelibsiz. Tizim qabul elchisi sifatida siz bilan uzluksiz suhbat olib boradi.
                    </p>
                  </div>

                  {/* Chat logs */}
                  <div className="flex-1 bg-slate-50 border border-slate-150 rounded-2xl p-4 overflow-y-auto space-y-4 max-h-[35vh]">
                    {mockHistory.length === 0 && (
                      <div className="text-center py-8 text-xs text-slate-400 font-semibold">
                        Suhbatni boshlash uchun quyida xabar yo'llang. Masalan, "Assalomu alaykum, intervyuga tayyorman."
                      </div>
                    )}
                    {mockHistory.map((item, index) => (
                      <div key={index} className={`flex ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed font-semibold ${
                          item.sender === 'user' 
                            ? 'bg-sky-600 text-white rounded-tr-none' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                        }`}>
                          <span className="text-[8px] font-black block mb-1 uppercase tracking-widest opacity-70">
                            {item.sender === 'user' ? 'Talaba (Siz)' : 'Komissiya a\'zosi'}
                          </span>
                          <span className="whitespace-pre-wrap">{item.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input bar */}
                  <div className="flex gap-2.5">
                    <input
                      type="text"
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 text-slate-905"
                      placeholder="Javobingiz or suhbat matnini yozing..."
                      value={mockInput}
                      onChange={e => setMockInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleSendMockMsg(); }}
                    />
                    <button
                      onClick={handleSendMockMsg}
                      disabled={loading}
                      className="px-5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                    >
                      {loading ? "..." : <Send className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* 5.1 Deadline Alarm & Task List */}
              {activeTool.key === 'guardian_deadline' && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-5 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">5.1. Deadline Alarm & Task List (Mutloq Bepul)</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Sohangiz va maqsad qilgan topshirish sanasini tanlang, JavaScript sizga dinamik ravishda daxshatli tayyorgarlik kalendarini tuzib beradi.
                    </p>
                  </div>

                  <form onSubmit={handleCalculateDeadline} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">O'qish sektori:</label>
                      <select
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-905 font-bold"
                        value={selectedMajor}
                        onChange={e => setSelectedMajor(e.target.value)}
                      >
                        <option value="stem">Common App (AQSh STEM)</option>
                        <option value="eu">Evropa Kuzgi Qabullari</option>
                        <option value="asia">Koreya/Yaponiya Bahorgi Sektor</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Topshirish sanasi (Target date):</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-905"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                    >
                      Dinamik Vazifalar ⚡
                    </button>
                  </form>

                  {deadlineResult && (
                    <div className="p-5 bg-amber-50/20 border border-amber-200/50 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-xs font-black text-slate-900">QOLGAN KUNLAR: {deadlineResult.daysLeft} kun</span>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                          deadlineResult.daysLeft > 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>{deadlineResult.status}</span>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-450 block">Hujjat topshirish daxshatli rejasi:</span>
                        {deadlineResult.tasks.map((task: any) => (
                          <div key={task.id} className="flex justify-between bg-white px-4 py-3 border border-slate-150 rounded-xl text-xs font-bold text-slate-700 shadow-sm">
                            <span>{task.title}</span>
                            <span className="text-rose-700 font-bold">{task.deadline}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5.2 Document Integrity Check */}
              {activeTool.key === 'guardian_document' && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-5 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">5.2. Document Integrity Check</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Diplom, rezyume, sertifikatlar va mantiqiy xatolar hamda apostil formatlari mosligini real vaqt rejimida skanerlash.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tekshirish uchun diplom yoki sertifikat ma'lumotlarini nusxalab kiriting:</label>
                    <textarea
                      placeholder="IELTS 6.5, SAT 1200, Diplom iqtisodiyot yo'nalishi..."
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 text-slate-905"
                      value={inputs.documentPayload || ''}
                      onChange={e => setInputs({ ...inputs, documentPayload: e.target.value })}
                    />
                  </div>

                  <button
                    onClick={handleExecuteAI}
                    disabled={loading}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md active:scale-98"
                  >
                    {loading ? "Integratsiya mantiqiy tekshiryapti..." : "Xalqaro Sifat standarti tekshiruvi ⚡"}
                  </button>

                  {/* Output area */}
                  {apiResult && (
                    <div className="p-5 bg-sky-50/50 border border-sky-100 rounded-2xl space-y-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-sky-700 block">Natija (Apostil & Integrity):</span>
                      <div className="text-xs text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap bg-white border border-slate-150 p-4 rounded-xl">
                        {apiResult}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5.3 Second-Chance Appeal Architect */}
              {activeTool.key === 'guardian_appeal' && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-5 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">5.3. Second-Chance Appeal Architect (Faqat PRO)</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Rad javobi (Rejection) bergan xorijiy universitet qabul komissiyasiga profilingizni qayta ko'rib chiqishga majburlaydigan kuchli norozilik xati tuzish.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rad bergan universitet nomi:</label>
                      <input
                        type="text"
                        placeholder="E.g., Munich University, Jacobs Bremen..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 text-slate-905"
                        value={inputs.rejectionUni || ''}
                        onChange={e => setInputs({ ...inputs, rejectionUni: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Taxminiy rad etilish sababi (IELTS, o'rin yetishmasligi):</label>
                      <input
                        type="text"
                        placeholder="E.g., Low competition, seats limit..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-sky-500 text-slate-905"
                        value={inputs.rejectionReason || ''}
                        onChange={e => setInputs({ ...inputs, rejectionReason: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleExecuteAI}
                    disabled={loading}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md active:scale-98"
                  >
                    {loading ? "Apellyatsiya maktubini yozmoqda..." : "Apellyatsiya Maktubini Tuzish (PRO)"}
                  </button>

                  {/* Output area */}
                  {apiResult && (
                    <div className="p-5 bg-sky-50/50 border border-sky-100 rounded-2xl space-y-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-sky-700 block">Yozilgan apellyatsiya xati (English):</span>
                      <div className="text-xs text-slate-700 leading-relaxed font-semibold whitespace-pre-wrap bg-white border border-slate-150 p-4 rounded-xl">
                        {apiResult}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Bottom Safe area indicators */}
            <div className="max-w-4xl w-full mx-auto border-t border-slate-200 mt-6 pt-4 text-center text-[10px] font-mono text-slate-400 font-bold uppercase">
              <span>TopGrand Admissions Engine v3.0 // 100% Secure Transaction Channel</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
