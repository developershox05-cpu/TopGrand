import React, { useState, useEffect } from 'react';
import { 
  Sparkles, FileText, MessageSquare, Terminal, RefreshCw, Key, Shield, Clock, Lock, 
  Check, ArrowRight, CornerDownRight, DollarSign, Award, BookOpen, AlertCircle, Heart,
  FileCheck, ShieldCheck, Mail, Compass, Layers, Milestone, Send, Gem
} from 'lucide-react';
import { User } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AIPrepCenterProps {
  user: User;
  onOpenAuth: () => void;
  onOpenPremium: () => void;
  onUpdateUsage: (toolKey: string) => void;
}

interface ToolConfig {
  key: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  popular?: boolean;
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
}

export default function AIPrepCenter({ user, onOpenAuth, onOpenPremium, onUpdateUsage }: AIPrepCenterProps) {
  const [selectedTool, setSelectedTool] = useState<ToolConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [usageTrigger, setUsageTrigger] = useState(0); // Trigger re-rendering of usage limits

  // Unified Form Values State for all tools
  const [formValues, setFormValues] = useState<Record<string, string>>({
    essayText: '',
    topic: '',
    recommenderRole: 'Matematika o\'qituvchisi',
    strengths: 'Matematika olimpiadasi g\'olibi, intizomli, liderlik qobiliyati kuchli',
    skillsMajor: 'Fizika olimpiadasi g\'olibi, intizomli',
    targetUniversity: 'Stanford University',
    tone: 'Professional va samimiy',
    age: '18',
    gpa: '4.8',
    languageScore: 'IELTS 7.0 / SAT Yo\'q',
    major: 'Biznes va IT',
    topic_vocab: 'Sog\'liqni saqlash',
    currentLevel: 'Intermediate',
    country: 'Germaniya',
    lifestyle: 'Tejamkor (Yotoqxona)',
    sopText: '',
    favorites: 'Matematika, Fizika, Dasturlash',
    hobbies: 'Startaplar, Robototexnika, Shaxmat',
    grade: '10-sinf',
    history: 'Faqat standart darslar',
    currentScore: 'IELTS 6.0 / SAT 1200',
    targetScore: 'IELTS 7.5 / SAT 1450',
    timeLeft: '3 oy',
    examType: 'IELTS Academic',
    dailyHours: '4 soat',
    weakAreas: 'Writing Task 1 & Task 2'
  });

  // Chat message & history states
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);

  // Interview Multi-step states
  const [interviewMajor, setInterviewMajor] = useState('Computer Science & AI');
  const [interviewHistory, setInterviewHistory] = useState<Array<{ question: string; answer?: string }>>([
    { question: "Assalomu alaykum! TopGrand xalqaro suhbat xonasiga xush kelibsiz. O'zingizni tanishtiring va nega aynan ushbu oliygoh hamda mutaxassislikni tanlaganingizni aytib bering." }
  ]);
  const [currentInterviewAnswer, setCurrentInterviewAnswer] = useState('');

  // 20 Premium Ivy-League Ready Academic AI Tools Configuration
  const tools: ToolConfig[] = [
    { key: 'essay', title: "Admission Officer (Simulyator)", description: "Insho va portfolioni Harvard, Stanford yoki Oxford qabul komissiyasi ko'zi bilan tanqidiy tahlil qilish va Ivy League moslik foizini hisoblash.", icon: FileCheck, color: 'from-blue-600 to-cyan-500', popular: true },
    { key: 'interview', title: "AI Mock Interview (Interaktiv)", description: "Interaktiv real-vaqt intervyu simulyatori. Ortiqcha filler so'zlar (umm, aaa) tahlili va real qabul komissiyasi a'zosi suhbati.", icon: Terminal, color: 'from-cyan-500 to-blue-600', popular: true },
    { key: 'autopilot', title: "AI Application Autopilot", description: "Hujjatlar asosida universitet arizalarini to'ldirish bosqichlari va qabul portaliga to'liq integratsiya strategiyasi.", icon: RefreshCw, color: 'from-blue-500 to-indigo-500', popular: true },
    { key: 'dark_crawler', title: "Dark-Data Scholarship Crawler", description: "Google yoki ijtimoiy tarmoqlarda ochiq bo'lmagan, yashirin xususiy fondlar va oliygoh ichki grantlarini profilingizga qarab topuvchi detektor.", icon: Compass, color: 'from-purple-500 to-blue-600', popular: true },
    { key: 'kvant_matrix', title: "AI Predictive Admission Matrix", description: "Inshongizdagi jumlalarni kognitiv optimizatsiya qilib (masalan 'innovatsiya' so'zini 'ijtimoiy ta'sir'ga almashtirib) kirish ehtimolini hisoblash.", icon: Layers, color: 'from-indigo-600 to-purple-500' },
    { key: 'prof_matcher', title: "Professor Personality Matcher", description: "Ilmiy maqola mualliflari, global professorlarning LinkedIn va ilmiy ishlarini tahlil qilib, ular bilan mustahkam aloqa o'rnatish sirlari.", icon: Key, color: 'from-cyan-400 to-indigo-500' },
    { key: 'roadmap_gen', title: "Dynamic Up-Skilling Roadmap", description: "Nufuzli oliygohlarga mos 2 yillik kuchli loyihalar, olimpiadalar va darsdan tashqari hayotiy faoliyat rejasi.", icon: Milestone, color: 'from-blue-500 to-cyan-400' },
    { key: 'cold_email', title: "Cold-Email Autopilot", description: "Xorijiy professorlarga laboratoriya yoki grant asosida o'qishga kirish uchun daxshatli professional, shaxsiy aloqa xatlari.", icon: Mail, color: 'from-indigo-500 to-cyan-400' },
    { key: 'lor_generator', title: "Recommendation Letter Reconstructor", description: "Maktab o'qituvchisi bergandek sodda tavsiyanomani oliy qabul komissiyalari talab qiladigan eng yuqori darajada rekonstruksiya qilish.", icon: ShieldCheck, color: 'from-cyan-500 to-indigo-600' },
    { key: 'motivation_generator', title: "Motivation Letter Masterclass", description: "Yutuqlaringiz, qiziqishlaringiz va maqsadlaringiz asosida qabul komissiyasini lol qildiradigan professional motivatsiya xati inshosi.", icon: Sparkles, color: 'from-indigo-500 to-cyan-400' },
    { key: 'financial_aid', title: "Financial Aid Strategy Builder", description: "Oilaviy budjet va daromadga asosan nufuzli oliygohdan 100% gacha bo'lgan to'liq moliya yordamini so'rash va rasmilashtirish rejasi.", icon: DollarSign, color: 'from-green-500 to-cyan-500' },
    { key: 'visa_sop', title: "Visa Success Predictor & Planner", description: "Hujjatlaringiz (SOP, bank balansi, oilaviy holat) asosida viza rad etilishi xavfini aniqlash va qizil zonalarni bartaraf qilish.", icon: Shield, color: 'from-purple-500 to-blue-600' },
    { key: 'scholarship_matcher', title: "Scholarship Match-Maker", description: "Global xususiy jamg'armalar, Coca-Cola, Gates, MasterCard va hukumat stipendiyalarini profilingizga qarab filtrlash.", icon: Award, color: 'from-blue-600 to-indigo-500' },
    { key: 'deadline', title: "Deadline Guardian (Avtomatik Reja)", description: "Universitet topshirish muddati va tayyorgarligingizga qarab stressiz, soatbay avtomatik reja (calendar plan).", icon: Clock, color: 'from-cyan-500 to-blue-600' },
    { key: 'gap_year', title: "Gap-Year Strategy Generator", description: "Agar bu yil kirolmagan bo'lsangiz, vaqtni yo'qotmay keyingi yilga 200% kafolat beruvchi amaliy portfolioni shakllantirish loyihalari.", icon: Compass, color: 'from-blue-400 to-cyan-500' },
    { key: 'score_predictor', title: "SAT/IELTS Score Predictor", description: "Yozilgan insho va yechilgan mock xatolaringiz asosida real imtihondagi yakuniy daxshatli ballni prognoz va tahlil qilish.", icon: Key, color: 'from-indigo-600 to-cyan-400' },
    { key: 'culture', title: "University Culture Matcher", description: "Shaxsiy xarakteringiz, shovqinli shahar yoki sokin yotoqxona, iqlimiy imtiyozlaringizga mos eng mukammal universitet muhitini topish.", icon: BookOpen, color: 'from-blue-500 to-purple-500' },
    { key: 'translator', title: "AI Document Translator Analyst", description: "Notarial tarjima qilingan hujjatlarda xalqaro standart darslik terminologiyasiga to'liq rioya etilganini tekshirish.", icon: FileCheck, color: 'from-cyan-400 to-indigo-500' },
    { key: 'networking', title: "LinkedIn Network Connector", description: "Target universitet bitiruvchilaridan reabilitatsiya xatlari yoki 'Referral' olish maqsadida qanday yozish bo'yicha shablonlar.", icon: MessageSquare, color: 'from-blue-400 to-cyan-500' },
    { key: 'chat', title: "AI Smart Academic Advisor", description: "Konsalting firmalarsiz, bevosita topshirish, grant va stipendiya yutish bo'yicha to'g'ridan-to'g'ri universal maslahatchi.", icon: MessageSquare, color: 'from-blue-500 to-cyan-400', popular: true }
  ];

  // Dynamic Form Field configuration for non-chat & non-mock-interview tools
  const toolFields: Record<string, FormField[]> = {
    essay: [
      { id: 'topic', label: "Insho Mavzusi (Majburiy emas)", type: 'text', placeholder: "Masalan: Should AI replace teachers?" },
      { id: 'essayText', label: "Insho matnini kiriting (Tahlil qilish uchun)", type: 'textarea', placeholder: "Inshongizni yoki Personal Statement matnini shu yerga yozing..." }
    ],
    autopilot: [
      { id: 'targetUniversity', label: "Maqsadli Universitet", type: 'text', placeholder: "Masalan: Stanford University, Oxford University" },
      { id: 'sopText', label: "Yuklangan insho yoki hujjat matni", type: 'textarea', placeholder: "Hujjat matnini shu yerga kiriting..." }
    ],
    dark_crawler: [
      { id: 'country', label: "Qiziqayotgan Davlatingiz", type: 'text', placeholder: "Masalan: AQSh, Germaniya, Italiya, Polsha" },
      { id: 'major', label: "Mutaxassislik yo'nalishingiz", type: 'text', placeholder: "Masalan: Kompyuter muhandisligi, Moliyaviy tahlil" }
    ],
    kvant_matrix: [
      { id: 'targetUniversity', label: "Nishondagi Universitet", type: 'text', placeholder: "Masalan: Harvard University" },
      { id: 'essayText', label: "Inshongizdan biron bir muhim abzats yoki butun matnni kiriting", type: 'textarea', placeholder: "Masalan: I wanted to build software because it was cool..." }
    ],
    prof_matcher: [
      { id: 'strengths', label: "Siz qiziqayotgan tadqiqot sohasini kiriting", type: 'textarea', placeholder: "Masalan: Machine Learning, Quantum Computing, Cancer Research" }
    ],
    roadmap_gen: [
      { id: 'targetUniversity', label: "Siz kirmoqchi bo'lgan orzudagi oliygoh (Target)", type: 'text', placeholder: "Masalan: MIT (Massachusetts Institute of Technology)" },
      { id: 'grade', label: "Hozirgi sinfingiz / kursingiz", type: 'text', placeholder: "Masalan: 10-sinf yoki Lysey 1-kurs" },
      { id: 'history', label: "Kamtarona qilgan hozirgi ishlaringiz yoki qiziqishlaringiz", type: 'textarea', placeholder: "Masalan: Matematika to'garagi, maktab veb-saytini tuzganman..." }
    ],
    cold_email: [
      { id: 'recommenderRole', label: "Professor Ismi va Kafedrasi", type: 'text', placeholder: "Masalan: Prof. Smith, Stanford Computer Science" },
      { id: 'strengths', label: "Professor yozgan tadqiqot yoki maqola mavzusi", type: 'textarea', placeholder: "Masalan: AI fairness in convolutional neural networks" }
    ],
    lor_generator: [
      { id: 'recommenderRole', label: "Tavsiyanoma berayotgan shaxs unvoni (Lavozimi)", type: 'text', placeholder: "Masalan: Matematika o'qituvchisi" },
      { id: 'strengths', label: "Sizning asosiy akademik kuchli tomonlaringiz, yutuqlaringiz", type: 'textarea', placeholder: "Masalan: Kuchli mantiqiy fikrlash, Fizika olimpiadasi 1-o'rin, jamoaviy lider" }
    ],
    motivation_generator: [
      { id: 'targetUniversity', label: "Maqsadli Universitet", type: 'text', placeholder: "Masalan: Oxford University" },
      { id: 'skillsMajor', label: "Qiziqadigan sohangiz va ko'nikmalaringiz", type: 'textarea', placeholder: "Masalan: Kiberxavfsizlik va dasturlash loyihalari..." }
    ],
    financial_aid: [
      { id: 'topic', label: "Oilavyi yillik jami daromad (USD/UZS'da ko'rsating)", type: 'text', placeholder: "Masalan: $5,000 / 60 mln so'm" },
      { id: 'country', label: "Maqsadli Davlat", type: 'text', placeholder: "Masalan: AQSh, Koreya, Turkiya" }
    ],
    visa_sop: [
      { id: 'country', label: "Viza olmoqchi bo'lgan davlat", type: 'text', placeholder: "Masalan: AQSh F-1 Vizasi, Koreya D-2 Vizasi" },
      { id: 'sopText', label: "Mablag' miqdori va oilaviy rishtalar haqida qisqacha rejangiz", type: 'textarea', placeholder: "Masalan: Otam homiy ($30,000 bor), o'qib bo'lib O'zbekistonga qaytaman..." }
    ],
    scholarship_matcher: [
      { id: 'age', label: "Yoshingiz", type: 'number', placeholder: "18" },
      { id: 'gpa', label: "GPA balingiz (5 lik yoki 4 lik shkalada)", type: 'text', placeholder: "4.8 yoki 3.9" },
      { id: 'languageScore', label: "IELTS / SAT native ballari", type: 'text', placeholder: "IELTS 7.5, SAT 1420" },
      { id: 'major', label: "Sohangiz (Major)", type: 'text', placeholder: "Masalan: Iqtisodiyot" }
    ],
    deadline: [
      { id: 'targetUniversity', label: "Maqsadli Universitetlar va imtihonlar", type: 'text', placeholder: "Masalan: Stanford University (Early Action)" },
      { id: 'timeLeft', label: "Tayyorgarlikka mo'ljallangan umumiy vaqt", type: 'text', placeholder: "Masalan: 3 oy yoki 6 oy" }
    ],
    gap_year: [
      { id: 'major', label: "Siz o'qimoqchi bo'lgan soha", type: 'text', placeholder: "Masalan: Data Science & Business" },
      { id: 'history', label: "Oldingi yutuq va kamchilinlariz (Nima uchun bu yil kira olmadingiz?)", type: 'textarea', placeholder: "IELTS 6.5 ball yetmadi, insho oxiriga yetmay qoldi..." }
    ],
    score_predictor: [
      { id: 'currentScore', label: "Hozirgi Mock / amaldagi ballaringiz", type: 'text', placeholder: "IELTS 6.0, SAT 1200" },
      { id: 'targetScore', label: "Maqsad qilgan balingiz", type: 'text', placeholder: "IELTS 7.5, SAT 1450" },
      { id: 'timeLeft', label: "Imtihongacha qolgan aniq vaqt", type: 'text', placeholder: "2 oy" }
    ],
    culture: [
      { id: 'topic', label: "Siz qanday muhitni yoqtirasiz?", type: 'text', placeholder: "Masalan: Megapolis shahar, issiq iqlim, nufuzli kampuslar" },
      { id: 'hobbies', label: "Sizning qiziqishlaringiz va bo'sh vaqtdagi mashg'ulotlariz", type: 'textarea', placeholder: "Masalan: Futbol, teatr, kitob jamoalari" }
    ],
    translator: [
      { id: 'sopText', label: "Tekshirilishi kerak bo'lgan hujjat bo'limi yoki terminlar", type: 'textarea', placeholder: "Masalan: 'Iqtisodiy tahlil va prognozlash kafedrasi mudiri tavsiyanomasi' ..." }
    ],
    networking: [
      { id: 'targetUniversity', label: "Alumni o'qiyotgan target oliygoh", type: 'text', placeholder: "Masalan: NYU (New York University)" },
      { id: 'major', label: "Ushbu liniyadagi soha", type: 'text', placeholder: "Masalan: Finance / Investment Banking" }
    ]
  };

  // Robust VIP Gating: check usage state
  const checkUsageLimit = (toolKey: string) => {
    if (user.isPremium) {
      return { isLocked: false, remaining: Infinity, limit: Infinity, count: 0 };
    }

    const storageKey = `topgrand_usage_${user.id || 'guest'}_${toolKey}`;
    const raw = localStorage.getItem(storageKey);
    let timestamps: string[] = [];
    if (raw) {
      try {
        timestamps = JSON.parse(raw);
      } catch {
        timestamps = [];
      }
    }

    // Filter to last 24h
    const now = new Date().getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const recent = timestamps.filter(ts => {
      const t = new Date(ts).getTime();
      return now - t < oneDayMs;
    });

    const isChat = toolKey === 'chat' || toolKey === 'interview';
    const limit = isChat ? 5 : 1;
    const count = recent.length;
    const isLocked = count >= limit;
    const remaining = Math.max(0, limit - count);

    return { isLocked, remaining, limit, count };
  };

  const recordUsage = (toolKey: string) => {
    const storageKey = `topgrand_usage_${user.id || 'guest'}_${toolKey}`;
    const raw = localStorage.getItem(storageKey);
    let timestamps: string[] = [];
    if (raw) {
      try {
        timestamps = JSON.parse(raw);
      } catch {
        timestamps = [];
      }
    }

    timestamps.push(new Date().toISOString());
    localStorage.setItem(storageKey, JSON.stringify(timestamps));
    setUsageTrigger(prev => prev + 1);
  };

  const handleSelectTool = (tool: ToolConfig) => {
    if (!user.isLoggedIn) {
      onOpenAuth();
      return;
    }

    setSelectedTool(tool);
    setResult('');
  };

  const executeAIRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTool || loading) return;

    // Check limit first
    const { isLocked } = checkUsageLimit(selectedTool.key);
    if (isLocked) {
      alert("Savollar tugadi! Iltimos, Premium Pro rejasini faollashtiring.");
      return;
    }

    setLoading(true);
    setResult('');

    let inputData: any = {};
    if (selectedTool.key === 'chat') {
      inputData = { userMessage: chatMessage, history: chatHistory.slice(-8) };
      setChatHistory(prev => [...prev, { sender: 'user', text: chatMessage }]);
      setChatMessage('');
    } else if (selectedTool.key === 'interview') {
      const newHistory = [...interviewHistory];
      newHistory[newHistory.length - 1].answer = currentInterviewAnswer;
      setInterviewHistory(newHistory);
      inputData = { major: interviewMajor, history: newHistory };
      setCurrentInterviewAnswer('');
    } else {
      inputData = { ...formValues };
    }

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: selectedTool.key,
          inputData,
          userContext: user
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        if (selectedTool.key === 'chat') {
          setChatHistory(prev => [...prev, { sender: 'ai', text: data.text }]);
        } else if (selectedTool.key === 'interview') {
          setInterviewHistory(prev => [...prev, { question: data.text }]);
        } else {
          setResult(data.text);
        }

        // Record usage log locally and call main update usage
        recordUsage(selectedTool.key);
        onUpdateUsage(selectedTool.key);
      } else {
        alert(data.error || "Ulanishda xatolik yuz berdi.");
      }
    } catch (err) {
      console.error(err);
      alert("Platforma sun'iy intellekti bilan bog'lanishda muammo yuz berdi. Iltimos qaytadan urining.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12" id="ai-center-root">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full text-xs font-black text-cyan-500 uppercase tracking-widest font-mono">
          TopGrand Ivy-League AI Suite
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Sun'iy Intellekt <br />
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Tayyorgarlik Markazi
          </span>
        </h2>
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-semibold">
          Bizning 20 xil daxshatli sun'iy intellekt modullarimiz profilingizni tahlil qilib, portfolioingizni dunyo standartdariga to'liq moslashtiradi!
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedTool ? (
          /* TOOL GRID CATALOG */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            id="ai-tools-grid"
          >
            {tools.map((tool) => {
              const { isLocked, remaining, limit } = checkUsageLimit(tool.key);

              return (
                <div
                  key={tool.key}
                  onClick={() => handleSelectTool(tool)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-blue-100 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer shadow-lg shadow-blue-500/5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`rounded-2xl bg-gradient-to-tr ${tool.color} p-3 text-white shadow-md`}>
                        {React.createElement(tool.icon, { className: "h-5 w-5" })}
                      </div>
                      {isLocked ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-2.5 py-1 text-[10px] font-mono font-extrabold text-red-500">
                          <Lock className="h-3 w-3" /> Locked (Buy Pro)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-600">
                          {remaining === Infinity ? "Cheksiz" : `${remaining}/${limit} Qoldi`}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-50 mt-5 pt-4 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      Ivy Matrix Mode
                    </span>
                    <span className="text-xs text-blue-600 font-extrabold flex items-center gap-1">
                      Modulni boshlash <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          /* SINGLE TOOL WORKSPACE IN PREMIUM FULL SCREEN SCREEN OVERLAY */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto text-white p-6 md:p-10 flex flex-col items-center"
            id="ai-workspace"
          >
            <div className="w-full max-w-4xl flex-grow flex flex-col justify-start py-4 space-y-8">
              
              {/* HEADER WITH ONLY GO-BACK BUTTON AT TOP */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                <button
                  onClick={() => setSelectedTool(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-black text-cyan-400 hover:bg-slate-850 hover:text-white transition cursor-pointer flex items-center gap-2 shadow-inner"
                  id="btn-workspace-back"
                >
                  ← Katalogga qaytish
                </button>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-flex text-[10px] uppercase font-black text-slate-500 tracking-widest bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-850">
                    Ivy Matrix Active
                  </span>
                  <span className="text-xs font-bold font-mono text-cyan-405 bg-cyan-950/40 border border-cyan-900 px-3.5 py-1.5 rounded-xl">
                    {selectedTool.title}
                  </span>
                </div>
              </div>

              {/* EVALUATE LOCKED STATUS OR ACTIVE TOOL CONTENT */}
              {(() => {
                const { isLocked, remaining, limit } = checkUsageLimit(selectedTool.key);

                if (isLocked) {
                  return (
                    <div className="my-auto py-10 space-y-6 max-w-xl mx-auto text-center" id="tool-locked-warning">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-405 text-slate-950 p-4 shadow-xl shadow-yellow-500/10">
                        <Gem className="h-9 w-9 animate-bounce" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white leading-tight">
                          Premium Pro Obuna Talab Qilinadi!
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-md mx-auto font-medium">
                          {selectedTool.key === 'chat' || selectedTool.key === 'interview'
                            ? `Siz ushbu interaktiv chat modulining kunlik ${limit} ta bepul so'rov imkoniyatidan to'liq foydalandingiz.`
                            : `Siz bugungi ${limit} ta bepul tahlil qilish imkoniyatidan foydalandingiz.`}{" "}
                          Davom etish va barcha premium AI imkoniyatlaridan cheksiz foydalanish uchun VIP Pro rejasiga o'ting.
                        </p>
                      </div>

                      {/* Pro Benefits list */}
                      <div className="space-y-3 bg-slate-900 border border-slate-850 p-6 rounded-[2rem] text-left text-xs md:text-sm max-w-md mx-auto shadow-inner">
                        <h4 className="font-extrabold text-cyan-400 uppercase tracking-widest text-[11px] pb-2 border-b border-slate-800 flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4" />
                          <span>Premium Pro VIP imtiyozlari:</span>
                        </h4>
                        <div className="space-y-3 mt-3 font-semibold text-slate-300">
                          <div className="flex items-start gap-2.5">
                            <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>Barcha 20+ Sun'iy Intellekt tahlillariga 100% cheksiz ruxsat</span>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>ChatGPT-4o & Gemini Pro elita modellari bilan real-vaqtda aloqa</span>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>Insholarni bexato kognitiv, so'z boyligi va IELTS darajasi tahriri</span>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>Interaktiv real-vaqt suhbatdagi barcha xatoliklar hisboti</span>
                          </div>
                        </div>
                      </div>

                      {/* Buy action button */}
                      <div className="flex flex-col gap-3.5 max-w-md mx-auto pt-3">
                        <button
                          onClick={() => alert("Premium to'lov tizimi tez orada ishga tushadi! Yangilanishlarni kuzatib boring.")}
                          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 active:scale-[0.98] transition font-black text-slate-950 text-xs md:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/10 cursor-pointer"
                        >
                          <Gem className="h-4 w-4" />
                          <span>Obunani Sotib Olish</span>
                        </button>
                        
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-850 text-[10px] text-slate-500 font-bold font-mono">
                          Navbatdagi bepul imkoniyat 24 soatdan so'ng avtomatik yangilanadi.
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  /* ACTUAL TOOL ACTIVE INPUT FORM & RESULTS */
                  <div className="space-y-6 flex-grow flex flex-col">
                    <div className="flex items-center justify-between pb-1">
                      <h3 className="text-xl font-black text-white flex items-center gap-2.5">
                        <span className="p-2 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800 shadow-md">
                          {React.createElement(selectedTool.icon, { className: "h-5 w-5" })}
                        </span>
                        {selectedTool.title}
                      </h3>
                      {!user.isPremium && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold font-mono">
                          <Check className="h-4 w-4 text-emerald-500" />
                          <span>Foydalanish: <b className="text-cyan-400">{remaining}/{limit}</b> qoldi</span>
                        </div>
                      )}
                    </div>

                    <form onSubmit={executeAIRequest} className="space-y-5">
                      {/* DYNAMIC FORM REGION ACCORDING TO SPECIFIED CONFIG */}
                      {selectedTool.key === 'interview' && (
                        <div className="space-y-4 flex flex-col">
                          <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-850/60 p-3 rounded-2xl">
                            <label className="text-xs font-black text-cyan-400 uppercase tracking-wider">Suhbat Mutaxassisligi:</label>
                            <select
                              value={interviewMajor}
                              onChange={(e) => setInterviewMajor(e.target.value)}
                              className="bg-slate-950 text-white rounded-xl border border-slate-800 p-2 text-xs outline-none focus:border-cyan-400 font-extrabold"
                            >
                              <option value="Computer Science & AI">Kompyuter Ilmlari va Sun'iy Intellekt</option>
                              <option value="Business Administration & MBA">Biznes Boshqaruvi va MBA</option>
                              <option value="Medicine & Biology">Tibbiyot va Biologiya</option>
                              <option value="Humanities & International Relations">Siyosatshunoslik va Xalqaro munosabatlar</option>
                              <option value="Engineering & Robotics">Muhandislik va Robototexnika</option>
                            </select>
                          </div>

                          {/* Interview Chat Bubble Container */}
                          <div className="space-y-3.5 max-h-[350px] overflow-y-auto p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                            {interviewHistory.map((chat, idx) => (
                              <div key={idx} className="space-y-3">
                                {/* Interviewer side */}
                                <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-4 text-cyan-300">
                                  <p className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider">
                                    <Milestone className="h-3 w-3 text-cyan-400 animate-pulse" />
                                    <span>TopGrand Qabul Komissiyasi A'zosi</span>
                                  </p>
                                  <p className="mt-2 font-medium leading-relaxed whitespace-pre-line">{chat.question}</p>
                                </div>

                                {/* Student response side if exists */}
                                {chat.answer && (
                                  <div className="rounded-2xl bg-slate-950 border border-slate-850 p-4 text-right max-w-lg ml-auto shadow-md">
                                    <p className="font-extrabold text-[#e0e9ff] text-[11px] uppercase tracking-wider">Siz ({user.name})</p>
                                    <p className="mt-1.5 font-medium leading-relaxed text-slate-300">{chat.answer}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Input if loading is not active */}
                          <div className="relative">
                            <input
                              type="text"
                              required
                              placeholder="O'zbek tilida o'z javobingizni isbotlab, batafsil kiritib yuboring..."
                              value={currentInterviewAnswer}
                              onChange={(e) => setCurrentInterviewAnswer(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl py-4 pl-5 pr-14 text-xs md:text-sm outline-none focus:border-cyan-400 transition"
                            />
                            <button
                              type="submit"
                              disabled={loading || !currentInterviewAnswer}
                              className="absolute right-2.5 top-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 p-2 text-blue-950 transition cursor-pointer disabled:opacity-50"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedTool.key === 'chat' && (
                        <div className="space-y-4 flex flex-col">
                          <div className="space-y-3.5 max-h-[350px] overflow-y-auto p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                            {chatHistory.length === 0 && (
                              <p className="text-cyan-400/85 text-center py-8 font-semibold">Chet elda o'qish, to'liq grantlar, insholar yoki viza bo'yicha mustaqil maslahatchiga o'zingizni qiziqtirgan savolni yo'llang.</p>
                            )}
                            {chatHistory.map((bubble, i) => (
                              <div
                                key={i}
                                className={`p-4 rounded-2xl border ${
                                  bubble.sender === 'user'
                                    ? 'bg-slate-950 border-slate-850 text-right max-w-lg ml-auto shadow-md'
                                    : 'bg-blue-500/10 border-blue-500/20 text-left text-cyan-200 whitespace-pre-line leading-relaxed font-semibold'
                                }`}
                              >
                                <p className="font-black text-[10px] uppercase tracking-wider">{bubble.sender === 'user' ? `Siz (${user.name})` : 'AI Konsalting Mutaxassisi'}</p>
                                <p className="mt-1.5 font-medium">{bubble.text}</p>
                              </div>
                            ))}
                          </div>

                          <div className="relative">
                            <input
                              type="text"
                              required
                              placeholder="Maslahat olish uchun savol yo'llang..."
                              value={chatMessage}
                              onChange={(e) => setChatMessage(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl py-4 pl-5 pr-14 text-xs md:text-sm outline-none focus:border-cyan-400 transition"
                            />
                            <button
                              type="submit"
                              disabled={loading || !chatMessage}
                              className="absolute right-2.5 top-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 p-2 text-blue-950 transition cursor-pointer disabled:opacity-50"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* DYNAMIC METADATA DRIVEN FORM INPUT FIELDS */}
                      {selectedTool.key !== 'chat' && selectedTool.key !== 'interview' && (
                        <div className="space-y-4 text-left">
                          {(toolFields[selectedTool.key] || []).map((field) => (
                            <div key={field.id} className="space-y-1.5">
                              <label className="block text-xs font-black text-cyan-400 uppercase tracking-wider">{field.label}</label>
                              {field.type === 'textarea' ? (
                                <textarea
                                  required
                                  rows={6}
                                  placeholder={field.placeholder}
                                  value={formValues[field.id] || ''}
                                  onChange={(e) => setFormValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl py-3 px-4 text-xs md:text-sm outline-none focus:border-cyan-400 focus:bg-slate-950 transition duration-150 font-semibold"
                                />
                              ) : field.type === 'select' ? (
                                <select
                                  value={formValues[field.id] || ''}
                                  onChange={(e) => setFormValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl py-3 px-4 text-xs md:text-sm outline-none focus:border-cyan-400 focus:bg-slate-950 transition duration-150 font-semibold"
                                >
                                  {(field.options || []).map(opt => (
                                    <option key={opt} value={opt} className="bg-slate-900 text-white">{opt}</option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type={field.type}
                                  required
                                  placeholder={field.placeholder}
                                  value={formValues[field.id] || ''}
                                  onChange={(e) => setFormValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl py-3 px-4 text-xs md:text-sm outline-none focus:border-cyan-400 focus:bg-slate-950 transition duration-150 font-semibold"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Submit action */}
                      {selectedTool.key !== 'chat' && selectedTool.key !== 'interview' && (
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full relative flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:brightness-110 active:scale-[0.98] transition font-black text-white text-xs md:text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 cursor-pointer"
                          id="btn-workspace-submit"
                        >
                          {loading ? (
                            <>
                              <RefreshCw className="h-4.5 w-4.5 animate-spin text-white" />
                              <span>Sun'iy Intellekt Tahlil Qilmoqda...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4.5 w-4.5 text-white" />
                              <span>100% Bexato Tahlil Qilish</span>
                            </>
                          )}
                        </button>
                      )}
                    </form>

                    {/* LOADING GRAPHICS */}
                    {loading && selectedTool.key !== 'chat' && selectedTool.key !== 'interview' && (
                      <div className="flex flex-col items-center justify-center py-10 space-y-3" id="ai-loading">
                        <div className="relative flex h-10 w-10">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-10 w-10 bg-blue-600 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-white animate-spin-slow" />
                          </span>
                        </div>
                        <p className="text-xs text-blue-400 font-extrabold text-center">Bizning professional model tizim bilan bog'lanmoqda, tahlil yakunlanmoqda...</p>
                      </div>
                    )}

                    {/* AI RESULTS CONTAINER */}
                    {result && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-xs md:text-sm text-slate-100 whitespace-pre-line leading-relaxed font-semibold space-y-4 shadow-inner mt-4 text-left"
                        id="ai-results-panel"
                      >
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                          <Sparkles className="h-4.5 w-4.5 text-cyan-400 animate-pulse" />
                          <span className="font-extrabold text-cyan-405">TopGrand AI Tahlil Hisoboti</span>
                        </div>
                        <p className="whitespace-pre-wrap text-slate-100">{result}</p>
                      </motion.div>
                    )}
                  </div>
                );
              })()}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
