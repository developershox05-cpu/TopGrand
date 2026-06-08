import React, { useState, useEffect } from 'react';
import { 
  Sparkles, FileText, MessageSquare, Clock, Lock, Check, ArrowRight, DollarSign, 
  Award, BookOpen, AlertCircle, Mail, Compass, Layers, Send, Gem, Trash2, ArrowLeft,
  FileCheck, CheckCircle, RefreshCw
} from 'lucide-react';
import { User } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface AIPrepCenterProps {
  user: User;
  onOpenAuth: () => void;
  onOpenPremium: () => void;
  onUpdateUsage: (toolKey: string) => void;
}

interface ToolConfig {
  key: string;
  category: 'architect' | 'executioner' | 'simulator' | 'strategist';
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
  const [usageTrigger, setUsageTrigger] = useState(0); 

  // Countdown timer relative to local midnight
  const [countdownText, setCountdownText] = useState('23:59:59');

  // Active Category filter state ('all' or 'architect' etc...)
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Unified Form Values for all non-chat form inputs
  const [formValues, setFormValues] = useState<Record<string, string>>({
    gpa: '4.8 / 5.0',
    ielts_score: 'IELTS 7.0 (SAT Yo\'q)',
    accomplishments: 'Matematika burchagi tashkilotchisi, maktab futbol sardori, kitobxonlar klubi faoli',
    annual_income: '$4,000',
    max_affordable: '$500',
    rough_experience: 'Maktabda sardor bo\'lganman, hammasiga yordam beraman, ingliz tilini bilaman, robototexnika klubiga qatnashganman',
    essay_text: 'I have always dreamed of solving world-class software challenges in a prestigious global environment...',
    target_major: 'Computer Science & Software Engineering',
    professor_name: 'Dr. John Harrison',
    professor_interests: 'Distributed database systems and cloud query speed optimizations',
    student_interest: 'Graph databases and database caching layers in edge instances',
    simple_lor: 'Ushbu talaba juda yaxshi va bilimga qiziqadi. Uni tavsiya qilaman.',
    simple_hobbies: 'Rasm chizaman, maktab bog\'iga daraxtlar ekaman, futbol o\'ynayman',
    rejection_letter: 'We regret to inform you that we are unable to offer you admission to our university for the Fall semester...'
  });

  // Chat message states
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);

  // Live countdown timer effect
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight.getTime() - now.getTime();

      const hours = Math.floor(diffMs / (3600 * 1000));
      const mins = Math.floor((diffMs % (3600 * 1000)) / (60 * 1000));
      const secs = Math.floor((diffMs % (60 * 1000)) / 1000);

      const formatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      setCountdownText(formatted);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  // 10 core AI Functions specified by user
  const tools: ToolConfig[] = [
    // 1-BO‘LIM: "The Architect" (Strategiya paneli)
    { 
      key: 'profile_weakness_auditor', 
      category: 'architect', 
      title: "Profile Weakness Auditor", 
      description: "GPA, IELTS ballari hamda akademik yutuqlaringizni tahlil qilib, eng zaif qizil nuqtalarni va rad etilish xavflarini audit qiladi.", 
      icon: AlertCircle, 
      color: 'from-blue-500 to-sky-400', 
      popular: true 
    },
    { 
      key: 'reverse_scholarship', 
      category: 'architect', 
      title: "Reverse Scholarship Calculator", 
      description: "Oilaviy yillik daromadingiz va maksimal to‘lov imkoniyatingiz asosida 50+ ommaviy xalqaro grantlardan sizga eng moslarini filtrlaydi.", 
      icon: DollarSign, 
      color: 'from-sky-500 to-indigo-400' 
    },

    // 2-BO‘LIM: "The Executioner" (Hujjatlar ustaxonasi)
    { 
      key: 'cv_builder', 
      category: 'executioner', 
      title: "AI Smart Resume (CV) Builder", 
      description: "Tartibsiz faoliyatlar va yozuvlaringizni nufuzli Harvard standartidagi elita akademik rezyumega (CV) aylantiradi.", 
      icon: FileCheck, 
      color: 'from-blue-600 to-purple-500', 
      popular: true 
    },
    { 
      key: 'sop_critic', 
      category: 'executioner', 
      title: "Statement of Purpose (SoP) Critic", 
      description: "Insho (SOP / Motivation letter) matnidagi mantiqsiz, zerikarli va klishe iboralarni qizil rangda belgilab, o'rniga jozibador versiyalarni yozadi.", 
      icon: BookOpen, 
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      key: 'cold_email_generator', 
      category: 'executioner', 
      title: "Cold-Email Generator", 
      description: "Xorijiy professorlarga laboratoriya yoki ilmiy grant yordamchisi bo'lish uchun 99% javob kafolatlaydigan shaxsiy va aqlli xatlar.", 
      icon: Mail, 
      color: 'from-cyan-500 to-blue-500' 
    },
    { 
      key: 'lor_enhancer', 
      category: 'executioner', 
      title: "Recommendation Letter (LoR) Enhancer", 
      description: "O‘qituvchining oddiy tavsiyanomasini g‘arbiy universitetlar muloqot standartlariga va yuqori ilmiy maqullash darajasiga olib chiqadi.", 
      icon: Award, 
      color: 'from-indigo-500 to-sky-500' 
    },

    // 3-BO‘LIM: "The Simulator" (Jonli mashg‘ulot)
    { 
      key: 'mock_interview', 
      category: 'simulator', 
      title: "AI Text-Based Mock Interview", 
      description: "Haqiqiy xalqaro universitet Admissions Officer bilan jonli savol-javob suhbat simulyatsiyasi (Interactive Chat).", 
      icon: MessageSquare, 
      color: 'from-blue-600 to-cyan-500', 
      popular: true 
    },
    { 
      key: 'ielts_speaking_partner', 
      category: 'simulator', 
      title: "IELTS Speaking Partner", 
      description: "IELTS Speaking imtihoni (Part 1, 2 hamda 3) bo'yicha Cue Card savollari va til ravonligi tahlilchi hamkori.", 
      icon: Sparkles, 
      color: 'from-cyan-500 to-indigo-500', 
      popular: true 
    },

    // 4-BO‘LIM: "The Strategist" (Taktik yordam)
    { 
      key: 'activity_translator', 
      category: 'strategist', 
      title: "Extracurricular Activity Translator", 
      description: "Sizning mahalliy kichik sevimli mashg‘ulot yoki ishlaringizni Common App talabiga mos elita liderlik ta'riflariga o‘giradi.", 
      icon: Compass, 
      color: 'from-teal-500 to-blue-500' 
    },
    { 
      key: 'rejection_appeal', 
      category: 'strategist', 
      title: "Rejection Appeal Writer", 
      description: "Universitet rad jamoasini (rejection letter) chuqur tahlil qilib, qabul qarorini qayta ko'rib chiqishga undovchi asoslangan apellyatsiya xati.", 
      icon: Layers, 
      color: 'from-rose-500 to-orange-500' 
    }
  ];

  const categories = [
    { key: 'all', label: "Barcha Modullar ⚡" },
    { key: 'architect', label: "The Architect 🧠" },
    { key: 'executioner', label: "The Ghost Writer ✍️" },
    { key: 'simulator', label: "The Simulator 🗣️" },
    { key: 'strategist', label: "The Strategist 🤝" }
  ];

  const toolFields: Record<string, FormField[]> = {
    profile_weakness_auditor: [
      { id: 'gpa', label: "Mavjud GPA yoki O'rtacha Bahongiz (5.0 yoki 100 lik shkalada)", type: 'text', placeholder: "Masalan: 4.8 / 5.0 or 92%" },
      { id: 'ielts_score', label: "IELTS, TOEFL yoki Duolingo sertifikati bali", type: 'text', placeholder: "Masalan: IELTS 7.0, SAT 1410 (SAT bo'lmasa 'yo'q' deb yozing)" },
      { id: 'accomplishments', label: "Siz qilgan darsdan tashqari barcha ishlar va natijalaringiz (Erkin matn)", type: 'textarea', placeholder: "Masalan: futbol sardori, kitob yozganman, matematika to'garagi..." }
    ],
    reverse_scholarship: [
      { id: 'annual_income', label: "Oilaviy Yillik Jami Daromadingiz ($ USD ekvivalentida)", type: 'text', placeholder: "Masalan: $5,000" },
      { id: 'max_affordable', label: "Siz yoki oilangiz to'lay oladigan o'quv kontraktining YILLIK maksimal summasi ($)", type: 'text', placeholder: "Masalan: $0 (To'liq bepul grantlar kerak), $1,000 va h.k." }
    ],
    cv_builder: [
      { id: 'rough_experience', label: "Barcha maktab yoki universitetdagi tartibsiz faoliyatlaringizni kiriting", type: 'textarea', placeholder: "Maktabda sardor bolganman, o'quvchilarga yordam berganman, futbol oynayman..." }
    ],
    sop_critic: [
      { id: 'target_major', label: "Hujjat topshirayotgan mutaxassisligingiz (Major)", type: 'text', placeholder: "Masalan: Computer Science, Business Analytics" },
      { id: 'essay_text', label: "Sizning Statement of Purpose / Motivation Letter matningiz yoki parchasi", type: 'textarea', placeholder: "Motivation letter / inshoni shu yerga yuklang..." }
    ],
    cold_email_generator: [
      { id: 'target_major', label: "Siz o'qib tatbiq qilmoqchi bo'lgan maqsadli soha", type: 'text', placeholder: "Masalan: Machine Learning & Health Informatics" },
      { id: 'professor_name', label: "Professorning to'liq ismi / unvoni", type: 'text', placeholder: "Masalan: Prof. Dr. Andrew Ng" },
      { id: 'professor_interests', label: "Professorning asosiy tadqiqot focuses yoki ilmiy ishlari", type: 'text', placeholder: "Masalan: Reinforcement learning in robotics safety control" },
      { id: 'student_interest', label: "Sizning aynan shu professor bilan qilishni xohlagan fikringiz yoki mavzuingiz (PRO)", type: 'textarea', placeholder: "Professorning so'nggi ilmiy ishiga bog'lab ssenariy..." }
    ],
    lor_enhancer: [
      { id: 'simple_lor', label: "O'qituvchining yozgan sodda yoki past sifatli Recommendation Letter matni", type: 'textarea', placeholder: "Pasted low quality recommendations..." }
    ],
    activity_translator: [
      { id: 'simple_hobbies', label: "Kichik, oddiy sevimli mashg'ulotlaringiz (Ijtimoiy ishlaringiz)", type: 'textarea', placeholder: "Masalan: futbol o'ynayman, maktab bog'ida daraxtlar ekaman, telegram bot qilaman..." }
    ],
    rejection_appeal: [
      { id: 'rejection_letter', label: "Universitetdan kelgan rad etish xatini (Rejection Letter) to'liq kiriting", type: 'textarea', placeholder: "We regret to inform you..." }
    ]
  };

  // Limit Check algorithm synchronized with Firestore
  const [limits, setLimits] = useState<Record<string, { count: number; limit: number; remaining: number; isLocked: boolean }>>({});

  const isInteractiveChat = (toolKey: string) => {
    return ['mock_interview', 'ielts_speaking_partner'].includes(toolKey);
  };

  const getToolLimit = (toolKey: string) => {
    // IELTS and mock interview are chats, limiting to 5 requests per 24 hours. Form generators are 1 request per 24h.
    return isInteractiveChat(toolKey) ? 5 : 1;
  };

  // Check state usage
  const checkCurrentLimit = async (toolKey: string) => {
    if (user.isPremium) {
      return { isLocked: false, remaining: Infinity, limit: Infinity, count: 0 };
    }

    const limitValue = getToolLimit(toolKey);

    if (user.isLoggedIn && user.id) {
      try {
        const docRef = doc(db, "users", user.id, "usage", toolKey);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const timestampsList: string[] = data.timestamps || [];
          const now = Date.now();
          const oneDayMs = 24 * 60 * 60 * 1000;
          const recent = timestampsList.filter(ts => (now - new Date(ts).getTime()) < oneDayMs);

          const count = recent.length;
          const remaining = Math.max(0, limitValue - count);
          const isLocked = count >= limitValue;

          return { isLocked, remaining, limit: limitValue, count };
        }
      } catch (err) {
        console.error("Firestore limit fetch error, falling back to localStorage", err);
      }
    }

    // Local fallback check
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

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const recent = timestamps.filter(ts => (now - new Date(ts).getTime()) < oneDayMs);

    const count = recent.length;
    const remaining = Math.max(0, limitValue - count);
    const isLocked = count >= limitValue;

    return { isLocked, remaining, limit: limitValue, count };
  };

  // Load all tool limits on mount/trigger
  const refreshAllLimits = async () => {
    const limitsTemp: Record<string, { count: number; limit: number; remaining: number; isLocked: boolean }> = {};
    for (const tool of tools) {
      limitsTemp[tool.key] = await checkCurrentLimit(tool.key);
    }
    setLimits(limitsTemp);
  };

  useEffect(() => {
    refreshAllLimits();
  }, [user.id, user.isPremium, usageTrigger]);

  const recordUsageLocallyAndRemote = async (toolKey: string) => {
    // 1. Update localStorage
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

    // 2. Update Firestore if logged in
    if (user.isLoggedIn && user.id) {
      try {
        const docRef = doc(db, "users", user.id, "usage", toolKey);
        await setDoc(docRef, {
          userId: user.id,
          toolKey: toolKey,
          timestamps: timestamps
        });
      } catch (err) {
        console.error("Firestore error recording usage", err);
      }
    }

    setUsageTrigger(prev => prev + 1);
    onUpdateUsage(toolKey);
  };

  const clearUsageStats = () => {
    if (window.confirm("Barcha bepul limitlarni qayta tiklashni xohlaysizmi (Test uchun)?")) {
      tools.forEach(tool => {
        const key = `topgrand_usage_${user.id || 'guest'}_${tool.key}`;
        localStorage.removeItem(key);
      });
      setUsageTrigger(prev => prev + 1);
    }
  };

  const handleSelectTool = (tool: ToolConfig) => {
    if (!user.isLoggedIn) {
      onOpenAuth();
      return;
    }

    setSelectedTool(tool);
    setResult('');

    // Prepopulate chat histories
    if (tool.key === 'mock_interview') {
      setChatHistory([
        { sender: 'ai', text: `🎓 Assalomu alaykum, ${user.name || 'Talaba'}! Men xalqaro oliygoh Qabul Komissiyasi rahbariman. Siz bilan mock interview suhbatimiz doirasida g'oyat bevosita, ta'sirchan muloqot qilaman.\n\n"O'zingizni tanishtiring, qay qiziqishlaringiz va eng munosib hislatlaringiz evaziga ushbu mutaxassislikni tanlaganingizni aytib bera olasizmi?"` }
      ]);
    } else if (tool.key === 'ielts_speaking_partner') {
      setChatHistory([
        { sender: 'ai', text: `🗣️ *Hello, welcome to the IELTS Speaking simulated interactive session. I am Senior Examiner John.*\n\n"Let's initiate by discussing public transport in your hometown. How frequently do you utilize public transport, and do you feel the government should implement complimentary services for student levels?"` }
      ]);
    }
  };

  const executeAIRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTool || loading) return;

    // Check usage limits locally and remotely
    const currentStatus = await checkCurrentLimit(selectedTool.key);
    if (currentStatus.isLocked) {
      onOpenPremium();
      return;
    }

    setLoading(true);
    setResult('');

    const isChat = isInteractiveChat(selectedTool.key);
    let inputData: any = {};

    if (isChat) {
      inputData = { userMessage: chatMessage, history: chatHistory.slice(-8) };
      setChatHistory(prev => [...prev, { sender: 'user', text: chatMessage }]);
      setChatMessage('');
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
        if (isChat) {
          setChatHistory(prev => [...prev, { sender: 'ai', text: data.text }]);
        } else {
          setResult(data.text);
        }

        // Real limit decrement ONLY ON SUCCESSFUL GENERATION CALL, preventing accidental limits deduction!
        await recordUsageLocallyAndRemote(selectedTool.key);
      } else {
        alert(data.error || "Ulanishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
      }
    } catch (err) {
      console.error(err);
      alert("Platforma sun'iy intellekti bilan bog'lanishda muammo yuz berdi. Qaytadan urining.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTools = activeCategory === 'all' 
    ? tools 
    : tools.filter(t => t.category === activeCategory);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-12" id="ai-center-root">
      
      {/* HEADER HERO AREA */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-400/20 px-4 py-1.5 rounded-full text-xs font-black text-blue-600 uppercase tracking-widest font-mono">
          <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
          <span>TOPGRAND INTELLECT SUITE v3.0</span>
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-blue-900 tracking-tight leading-tight">
          Chet elga <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
            Eksklyuziv 10 ta AI Funksiya
          </span>
        </h2>
        <p className="text-xs md:text-sm text-blue-905/70 font-semibold max-w-xl mx-auto leading-relaxed">
          Konsalting firmalarsiz, bizning 10 xil daxshatli sun'iy intellekt modullarimiz profilingizni xavfsiz tahlil qilib, 100% grant kafolati va vizalarni loyihalaydi!
        </p>

        {/* METRICS & KEY INFORMATION STATUS */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-5 pt-4 text-xs font-mono font-bold">
          <div className="bg-white/80 border border-blue-100 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm text-blue-900">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
            <span>GEMINI_API_KEY:</span>
            <span className="text-blue-600 font-extrabold uppercase bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md text-[10px]">Faol (Server)</span>
          </div>

          <div className="bg-white/80 border border-blue-100 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm text-blue-900">
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            <span>Resetgacha:</span>
            <span className="text-blue-700 font-black text-xs">{countdownText}</span>
          </div>

          <button 
            onClick={clearUsageStats}
            title="Usage limitlarini qayta tiklash (Faqat sinov uchun)"
            className="p-2 bg-white/80 border border-blue-100 hover:border-red-300 text-blue-400 hover:text-red-500 rounded-xl transition cursor-pointer shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedTool ? (
          /* FILTER CATEGORIES & GRID OF 10 TOOLS */
          <motion.div 
            key="catalog"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8" 
            id="catalog-container"
          >
            {/* Transparent elegant tab selection */}
            <div className="flex flex-wrap justify-center gap-2 pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer border ${
                    activeCategory === cat.key
                      ? 'bg-blue-650 text-white border-blue-700/30 shadow-lg shadow-blue-500/10'
                      : 'bg-white/80 text-blue-800 hover:text-blue-600 border-blue-100 hover:bg-white/95 shadow-sm'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid of 10 modern features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => {
                const IconComp = tool.icon;
                const toolLimit = limits[tool.key];
                const isLimitLocked = toolLimit?.isLocked || false;
                const limitRemaining = toolLimit?.remaining ?? getToolLimit(tool.key);
                const limitMax = toolLimit?.limit ?? getToolLimit(tool.key);

                return (
                  <motion.div
                    key={tool.key}
                    whileHover={{ scale: 1.015, y: -2 }}
                    className="relative group rounded-3xl border border-blue-100 bg-white/85 p-6 flex flex-col justify-between shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300 backdrop-blur-md"
                    id={`tool-card-${tool.key}`}
                  >
                    <div>
                      {/* Popular & category indicator */}
                      <div className="flex justify-between items-center mb-5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-blue-500 bg-blue-50 border border-blue-100/40 px-2.5 py-1 rounded-full px-2">
                          {tool.category === 'architect' && '🧠 The Architect'}
                          {tool.category === 'executioner' && '✍️ The Ghost Writer'}
                          {tool.category === 'simulator' && '🗣️ The Simulator'}
                          {tool.category === 'strategist' && '🤝 The Strategist'}
                        </span>
                        {tool.popular && (
                          <span className="flex items-center gap-1.5 text-[9px] font-black tracking-widest text-[#d97706] bg-amber-50 border border-amber-200/40 px-2.5 py-1 rounded-full uppercase">
                            <Sparkles className="h-3 w-3 animate-spin text-amber-500" />
                            Mashhur
                          </span>
                        )}
                      </div>

                      {/* Icon & Title */}
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-tr ${tool.color} text-white shadow-md shadow-blue-500/5 shrink-0`}>
                          <IconComp className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-blue-900 leading-tight group-hover:text-blue-600 transition text-sm sm:text-base">
                            {tool.title}
                          </h3>
                          <p className="text-xs text-blue-950/60 font-semibold mt-1.5 leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Limits bar & Action */}
                    <div className="mt-6 pt-5 border-t border-blue-50/60 flex items-center justify-between gap-4">
                      <div className="text-[11px] font-mono font-bold">
                        {user.isPremium ? (
                          <span className="text-cyan-600 flex items-center gap-1">
                            <Gem className="h-3 w-3" /> PRO: Cheksiz
                          </span>
                        ) : (
                          <span className={`${isLimitLocked ? 'text-red-500' : 'text-blue-600'}`}>
                            Limit: {limitRemaining} / {limitMax} query
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleSelectTool(tool)}
                        className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition ${
                          isLimitLocked && !user.isPremium
                            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                            : 'bg-blue-650 hover:bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        }`}
                      >
                        {isLimitLocked && !user.isPremium ? (
                          <>Pro'ni Sotib Olish <Lock className="h-3.5 w-3.5" /></>
                        ) : (
                          <>Tahlil etish <ArrowRight className="h-3.5 w-3.5" /></>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* THIN, TRANSPARENT, ULTRA POLISHED FULL SCREEN WORKSPACE WITH TOP BACK BUTTON ONLY */
          <motion.div
            key="workspace"
            initial={{ opacity: 0, scale: 0.99, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.99, y: -15 }}
            className="w-full min-h-[75vh] rounded-3xl border border-white/60 bg-white/75 p-6 md:p-10 shadow-2xl backdrop-blur-2xl relative"
            id="workspace-container"
          >
            {/* STRICT DIRECTIVE: SINGLE TOP BACK BUTTON ONLY */}
            <div className="flex items-center justify-between mb-8 pb-5 border-b border-blue-100">
              <button
                onClick={() => setSelectedTool(null)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 font-extrabold text-xs transition cursor-pointer shadow-sm"
              >
                <ArrowLeft className="h-4 w-4 text-blue-600" />
                <span>Orqaga Qaytish</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 font-mono">
                  {selectedTool.title}
                </span>
                {user.isPremium ? (
                  <span className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-705 border border-cyan-200 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                    <Gem className="h-3 w-3 text-cyan-600" /> PRO Faol
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                    Tekin
                  </span>
                )}
              </div>
            </div>

            {/* Split layout: Form Inputs and Real-time detailed result inside Blue container with White letters */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Form Input fields */}
              <div className="lg:col-span-5 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className="p-3 bg-blue-100 rounded-2xl text-blue-700">
                      {React.createElement(selectedTool.icon, { className: 'h-6 w-6' })}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-blue-900 leading-tight">{selectedTool.title}</h3>
                      <p className="text-xs text-blue-800/60 font-semibold mt-1">
                        Chet elga {selectedTool.category === 'architect' ? 'mukammal strategiya' : 'akademik hujjatlar tayyorlash'} moduli
                      </p>
                    </div>
                  </div>

                  {!isInteractiveChat(selectedTool.key) ? (
                    // static form inputs
                    <form onSubmit={executeAIRequest} className="space-y-4">
                      {toolFields[selectedTool.key]?.map((field) => (
                        <div key={field.id} className="space-y-1.5 text-left">
                          <label className="block text-xs font-bold text-blue-900/80">
                            {field.label}
                          </label>
                          {field.type === 'textarea' ? (
                            <textarea
                              rows={5}
                              value={formValues[field.id] || ''}
                              onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                              className="w-full rounded-2xl border border-blue-200 bg-white py-3 px-4 text-xs font-semibold text-slate-800 placeholder-blue-900/30 outline-none focus:border-blue-500 transition shadow-inner"
                              placeholder={field.placeholder}
                            ></textarea>
                          ) : (
                            <input
                              type="text"
                              value={formValues[field.id] || ''}
                              onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                              className="w-full rounded-2xl border border-blue-200 bg-white py-3 px-4 text-xs font-semibold text-slate-800 placeholder-blue-900/30 outline-none focus:border-blue-500 transition shadow-inner"
                              placeholder={field.placeholder}
                            />
                          )}
                        </div>
                      ))}

                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-2xl font-black text-xs text-white uppercase tracking-widest shadow-lg transition duration-200 cursor-pointer ${
                          loading 
                            ? 'bg-slate-350 cursor-not-allowed shadow-none' 
                            : 'bg-blue-650 hover:bg-blue-600 shadow-blue-500/10 active:scale-95'
                        }`}
                        id="btn-execute-static"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <RefreshCw className="animate-spin h-4 w-4" />
                            Xalqaro AI tahlil qilmoqda...
                          </span>
                        ) : (
                          "Sun'iy intellekt tahlilini olish ⚡"
                        )}
                      </button>
                    </form>
                  ) : (
                    // Chat input rules
                    <div className="space-y-4 mt-2">
                      <p className="text-xs text-blue-800/70 leading-relaxed font-semibold">
                        Siz jonli tarzda qabul xodimi yoki IELTS vakili bilan bevosita muloqot qilmoqdasiz. Quyidagi oynada savollarga javob bering va ishonchni sinang!
                      </p>
                      
                      <div className="p-4 bg-teal-50/60 border border-teal-100 rounded-2xl text-xs text-teal-850 font-semibold leading-relaxed">
                        ⚠️ **Suhbat Limitlari**: Bevosita {getToolLimit(selectedTool.key)} ta bepul savol berishingiz mumkin. Hozirda qo'yilgan barcha limitlar siz muvafferiyatli yuborganingizdan so'ng hisoblab chiqiladi.
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-blue-5/30 mt-6 md:mt-0 text-[11px] text-blue-900/40 font-bold font-mono">
                  TopGrand AI Suite is secured by Firestore protection layers.
                </div>
              </div>

              {/* Real-time responses: BLUE CONTAINER WITH WHITE TEXT */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="flex-1 flex flex-col rounded-3xl bg-blue-700/90 border border-blue-900 p-6 md:p-8 min-h-[420px] max-h-[600px] overflow-hidden text-white shadow-inner relative justify-between">
                  {/* Blue container headers */}
                  <div className="flex justify-between items-center pb-3 border-b border-blue-600/40 mb-4 shrink-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-200 font-mono">
                      Real-time AI Auditor outputs
                    </span>
                    <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  </div>

                  {/* Body display depending on interactive state */}
                  <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs font-semibold text-blue-100 leading-relaxed">
                    {!isInteractiveChat(selectedTool.key) ? (
                      // Display content
                      result ? (
                        <div className="whitespace-pre-line text-xs font-semibold text-white leading-relaxed">
                          {result}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-70 p-5 space-y-3">
                          <Compass className="h-10 w-10 text-cyan-300 animate-bounce" />
                          <p className="text-blue-100 text-xs">
                            Chap tomondagi jadval maydonlarini to'ldiring va hisobingiz uchun kuchli xalqaro AI tahlilini bosing.
                          </p>
                        </div>
                      )
                    ) : (
                      // Interactive chats list
                      <div className="space-y-3.5">
                        {chatHistory.map((msg, i) => (
                          <div 
                            key={i} 
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                                msg.sender === 'user' 
                                  ? 'bg-cyan-505/20 border border-cyan-400/30 text-white font-extrabold ml-auto' 
                                  : 'bg-white/10 border border-white/5 text-blue-50 mr-auto whitespace-pre-line'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        {loading && (
                          <div className="flex justify-start">
                            <span className="p-3 bg-white/10 border border-white/5 rounded-2xl text-[10px] uppercase font-mono animate-pulse tracking-wider">
                              AI xodimi tahlillamoqda...
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer interface mapping if interactive chat is used */}
                  {isInteractiveChat(selectedTool.key) && (
                    <form onSubmit={executeAIRequest} className="mt-4 pt-3 border-t border-blue-600/40 flex gap-2 shrink-0">
                      <input
                        type="text"
                        value={chatMessage}
                        disabled={loading}
                        onChange={(e) => setChatMessage(e.target.value)}
                        className="flex-1 rounded-xl bg-white/5 border border-white/10 py-3 px-4 text-xs font-semibold text-white placeholder-blue-200/50 outline-none focus:border-cyan-400 transition"
                        placeholder="Javobingizni yoki fikringizni yozing..."
                      />
                      <button
                        type="submit"
                        disabled={loading || !chatMessage.trim()}
                        className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 font-bold text-white shadow-md active:scale-95 transition flex items-center justify-center cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  )}

                </div>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
