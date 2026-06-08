import React, { useState, useEffect } from 'react';
import { 
  Sparkles, FileText, MessageSquare, Clock, Lock, Check, ArrowRight, DollarSign, 
  Award, BookOpen, AlertCircle, Mail, Compass, Layers, Send, Gem, Trash2, ArrowLeft,
  FileCheck, CheckCircle, RefreshCw, Shield, Heart, Trophy, User as UserIcon
} from 'lucide-react';
import { User } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface AIPrepCenterProps {
  user: User;
  onOpenAuth: () => void;
  onOpenPremium: () => void;
  onUpdateUsage: (toolKey: string) => void;
}

interface ToolConfig {
  key: string;
  category: 'strategist' | 'content_lab' | 'simulator' | 'future_path';
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
  const [countdownText, setCountdownText] = useState('23:59:59');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);

  const [formValues, setFormValues] = useState<Record<string, string>>({
    character_traits: 'Tashabbuskor, tartibli, guruhda ishlashni sevadigan, mantiqiy fikrlovchi',
    weaknesses: 'Profilimda olimpiada g\'olibliklari yo\'q, IELTS balim hozircha 6.5, SAT topshirmaganman',
    target_major: 'Data Science & Applied Artificial Intelligence',
    gpa: '4.85 / 5.0 (Oliygoh bitiruvchisi)',
    annual_income: '$4,500',
    max_affordable: '$0 (Faqat to\'liq grantlar)',
    essay_text: 'Since my childhood, I always loved learning coding. That is why I want to apply to this computer program because it makes my future successful...',
    professor_name: 'Dr. John Harrison',
    professor_interests: 'Distributed database systems and cloud query optimizations',
    student_interest: 'Graph database performance bottlenecks on edge systems',
    simple_lor: 'Ushbu talaba juda intiluvchan va darslarda faol. Uni o\'qishga qabul qilishingizni qattiq tavsiya etaman.',
    simple_hobbies: 'Mahallada bepul matematika darsi beraman, telegramda bot tuzganman, maktab bog\'ida ko\'chatlar ekkanman',
    rejection_letter: 'Dear student, after reviewing your academic achievements, we regret to inform you that we cannot offer admission...',
    cliche_sample: 'Since my childhood I am deeply passionate about economics because it is the cornerstone of societal progress...'
  });

  // Countdown relative to midnight
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (3600 * 1000));
      const mins = Math.floor((diffMs % (3600 * 1000)) / (60 * 1000));
      const secs = Math.floor((diffMs % (60 * 1000)) / 1000);
      setCountdownText(`${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    };
    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  // 30 Core "Daxshatli" AI tools covering requested sections
  const tools: ToolConfig[] = [
    // 1-BO‘LIM: "THE STRATEGIST" (Akademik Razvedka)
    { 
      key: 'university_vibe_matcher', 
      category: 'strategist', 
      title: "University Vibe Matcher", 
      description: "Xarakteringizga qarab mos universitet muhitini (konservativ, liberal, party-oriented) tahlil qiladi.", 
      icon: Compass, 
      color: 'from-blue-500 to-sky-450', 
      popular: true 
    },
    { 
      key: 'admission_officer_persona', 
      category: 'strategist', 
      title: "Admission Officer Persona", 
      description: "Qattiqqo'l qabul komissiyasi a'zosi rolida profilingizdagi barcha kamchiliklarni yuzingizga soladi.", 
      icon: AlertCircle, 
      color: 'from-indigo-500 to-purple-400' 
    },
    { 
      key: 'trend_predictor', 
      category: 'strategist', 
      title: "Trend Predictor", 
      description: "Oxirgi 2 yillik xalqaro tendensiyalarga qarab qaysi yo'nalishda grant ko'p bo'lishini bashorat qiladi.", 
      icon: Sparkles, 
      color: 'from-sky-500 to-cyan-400',
      popular: true
    },
    { 
      key: 'acceptance_rate_hacker', 
      category: 'strategist', 
      title: "Acceptance Rate Hacker", 
      description: "Universitetning umumiy emas, aynan Markaziy Osiyolik talabalar uchun real qabul foizini hisoblaydi.", 
      icon: CheckCircle, 
      color: 'from-blue-600 to-teal-400' 
    },
    { 
      key: 'hidden_major_finder', 
      category: 'strategist', 
      title: "Hidden Major Finder", 
      description: "Raqobati o'ta yuqori yo'nalishlar o'rniga raqobat kam bo'lgan istiqbolli yashirin sohalarni topadi.", 
      icon: BookOpen, 
      color: 'from-purple-600 to-pink-500' 
    },
    { 
      key: 'safety_reach_matrix', 
      category: 'strategist', 
      title: "Safety vs Reach Matrix", 
      description: "Siz tanlagan oliygohlarni 'Aniq kiradi', 'Imkoniyat bor' va 'Mo'jiza kerak' guruhlariga ajratadi.", 
      icon: Layers, 
      color: 'from-cyan-500 to-blue-500' 
    },
    { 
      key: 'financial_aid_sniper', 
      category: 'strategist', 
      title: "Financial Aid Sniper", 
      description: "Universitetning moliyaviy zaxiralarini va bu yil sizga grant bera olish ehtimolini aniqlaydi.", 
      icon: DollarSign, 
      color: 'from-emerald-500 to-teal-400',
      popular: true 
    },
    { 
      key: 'waitlist_escape_plan', 
      category: 'strategist', 
      title: "Waitlist Escape Plan", 
      description: "Kutish ro'yxatidan qutulish va qabul a'zolarini hayratda qoldiruvchi daxshatli qaynoq xat yozadi.", 
      icon: Mail, 
      color: 'from-rose-500 to-orange-400' 
    },

    // 2-BO‘LIM: "THE CONTENT LAB" (Psixologik Ta'sir)
    { 
      key: 'emotional_arc_analyzer', 
      category: 'content_lab', 
      title: "Emotional Arc Analyzer", 
      description: "Insho tahriri: jozibadorlik, zerikarli jumlalar va inshoning hissiy rivojlanish grafigini chizadi.", 
      icon: Heart, 
      color: 'from-pink-500 to-rose-400', 
      popular: true 
    },
    { 
      key: 'hook_generator', 
      category: 'content_lab', 
      title: "Essay Hook Generator", 
      description: "Inshoning birinchi jumlalarini qabul a'zolarini ohanrabo kabi jalb etuvchi darajaga ko'taradi.", 
      icon: Sparkles, 
      color: 'from-yellow-400 to-orange-500' 
    },
    { 
      key: 'cultural_sensitivity', 
      category: 'content_lab', 
      title: "Western Cultural Sensitiver", 
      description: "Inshodagi G'arb madaniyatiga to'g'ri kelmaydigan, noto'g'ri ohang beruvchi muloqot xatolarini tuzatadi.", 
      icon: Shield, 
      color: 'from-teal-500 to-emerald-400' 
    },
    { 
      key: 'why_us_architect', 
      category: 'content_lab', 
      title: "Why Us Essay Architect", 
      description: "Oliygohdagi unikal resurslar, professorlar va klublarni tahlil qilib, daxshatli 'Why Us' matni tayyorlaydi.", 
      icon: Award, 
      color: 'from-blue-600 to-indigo-500' 
    },
    { 
      key: 'narrative_threader', 
      category: 'content_lab', 
      title: "Narrative Threader", 
      description: "Hayotingizdagi kichik bir voqeani kelajakdagi orzularingiz bilan mantiqiy bog'lab, insho g'oyasini beradi.", 
      icon: Compass, 
      color: 'from-orange-500 to-red-400' 
    },
    { 
      key: 'vocabulary_punch', 
      category: 'content_lab', 
      title: "Vocabulary Punch Editor", 
      description: "Matndagi sodda, maktab darajasidagi so'zlarni g'arb professorlari hayratlanadigan leksikaga o'tkazadi.", 
      icon: FileText, 
      color: 'from-sky-500 to-blue-600' 
    },
    { 
      key: 'cliche_detector', 
      category: 'content_lab', 
      title: "Cliché & Plagiarism Detector", 
      description: "Inshodagi barcha andozaviy klishelarni aniqlaydi va o'rniga original daxshatli g'oyalarni taklif etadi.", 
      icon: Trash2, 
      color: 'from-gray-500 to-slate-400' 
    },
    { 
      key: 'tone_shifter', 
      category: 'content_lab', 
      title: "Essay Tone Shifter", 
      description: "Xohishingizga qarab insho ohangini 'Liderona', 'Kamtarin' yoki 'Ilmiy' darajaga shift qiladi.", 
      icon: RefreshCw, 
      color: 'from-cyan-500 to-teal-400' 
    },

    // 3-BO‘LIM: "THE SIMULATOR" (Virtual Dunyo)
    { 
      key: 'blind_interviewer', 
      category: 'simulator', 
      title: "Blind Admission Interviewer", 
      description: "Sizning erkin muloqotingizni, gaplardagi dalilsiz joylarni ayovsiz tanqid qiluvchi simulyator.", 
      icon: MessageSquare, 
      color: 'from-blue-700 to-indigo-600', 
      popular: true 
    },
    { 
      key: 'stump_questioner', 
      category: 'simulator', 
      title: "Stump Questioner Master", 
      description: "Universitet suhbatlaridagi kutilmagan, eng qiyin mantiqiy savollarga javob berish sirlarini o'rgatadi.", 
      icon: Clock, 
      color: 'from-indigo-600 to-violet-500' 
    },
    { 
      key: 'body_language_text', 
      category: 'simulator', 
      title: "Textual Behavior & Tone", 
      description: "Yozma muloqotingizdagi shubha, qo'rquv va tayyorgarliksizlik alomatlarini aniqlab beradi.", 
      icon: FileText, 
      color: 'from-teal-600 to-emerald-500' 
    },
    { 
      key: 'scholarship_panel', 
      category: 'simulator', 
      title: "Scholarship Panel Simulator", 
      description: "3 xil shaxsiyat (Professor, Donor, Lider) nomidan sizga savol beradigan sun'iy intellekt komissiyasi.", 
      icon: DollarSign, 
      color: 'from-emerald-600 to-cyan-500',
      popular: true 
    },
    { 
      key: 'thank_you_sniper', 
      category: 'simulator', 
      title: "Thank You Note Sniper", 
      description: "Suhbatdan so'ng professorlarni jalb qiluvchi daxshatli minnatdorchilik xatlarini andozasiz yozadi.", 
      icon: Check, 
      color: 'from-blue-500 to-sky-450' 
    },
    { 
      key: 'group_discussion_leader', 
      category: 'simulator', 
      title: "Group Discussion Leader", 
      description: "Guruhli suhbatlarda odob bilan liderlikni qo'lga olish va qabulda qolish taktikalarini o'rgatadi.", 
      icon: Layers, 
      color: 'from-purple-500 to-indigo-400' 
    },

    // 4-BO‘LIM: "THE FUTURE PATH" (Bitiruvdan keyingi reja)
    { 
      key: 'job_market_matcher', 
      category: 'future_path', 
      title: "Global Job Market Matcher", 
      description: "Tanlangan yo'nalish bo'yicha dunyo gigantlari (Google, Tesla) talablari tahlilini beradi.", 
      icon: Award, 
      color: 'from-blue-600 to-cyan-500', 
      popular: true 
    },
    { 
      key: 'roi_calculator', 
      category: 'future_path', 
      title: "Academic ROI Calculator", 
      description: "O'qish xarajatlari va bitirgandan so'ng necha yilda mablag'ingiz sizga qaytishini iqtisodiy hisoblaydi.", 
      icon: DollarSign, 
      color: 'from-emerald-500 to-green-600' 
    },
    { 
      key: 'alumni_bio_scraper', 
      category: 'future_path', 
      title: "Alumni Insights Roadmap", 
      description: "Ushbu oliygohni bitirib ulkan muvaffaqiyatga erishgan bitiruvchilar izidan yo'l xaritasi tuzadi.", 
      icon: BookOpen, 
      color: 'from-purple-500 to-rose-450' 
    },
    { 
      key: 'visa_policy_advisor', 
      category: 'future_path', 
      title: "Visa & Post-Grad Advisor", 
      description: "Bitirgandan so'ng qolish, OPT, H1-B ishlash vizalari va yangi qonunlarning tahlilini beradi.", 
      icon: Shield, 
      color: 'from-rose-500 to-red-650' 
    },
    { 
      key: 'networking_script', 
      category: 'future_path', 
      title: "LinkedIn Sniper Scripts", 
      description: "Bitiruvchilardan recommendation hamda referral maktubi olish uchun LinkedIn aloqa xatlarini yozadi.", 
      icon: Mail, 
      color: 'from-sky-500 to-indigo-400',
      popular: true 
    },
    { 
      key: 'startup_potential', 
      category: 'future_path', 
      title: "Startup Incubator Selector", 
      description: "G'oyangizni universitet inkubatoriga taqdim etish (pitching) va moliyaviy dastaklar yozadi.", 
      icon: Sparkles, 
      color: 'from-amber-400 to-orange-500' 
    },
    { 
      key: 'skill_bridge', 
      category: 'future_path', 
      title: "Enterprise Skill Bridge", 
      description: "Darslikda yo'q, ammo mehnat bozorida eng ko'p haq to'lanadigan ko'nikmalarni va sertifikatlarni ko'rsatadi.", 
      icon: Layers, 
      color: 'from-teal-500 to-cyan-400' 
    },
    { 
      key: 'mental_health_guardian', 
      category: 'future_path', 
      title: "Mental Health Guardian", 
      description: "Akademik zo'riqish, stress va yotoqxona tushkunliklariga berilmay a'lo natijalarni daxshatli saqlash sirlari.", 
      icon: Heart, 
      color: 'from-pink-500 to-rose-500' 
    }
  ];

  const categories = [
    { key: 'all', label: "Barcha Modullar ⚡" },
    { key: 'strategist', label: "THE STRATEGIST 🧭" },
    { key: 'content_lab', label: "THE CONTENT LAB ✍️" },
    { key: 'simulator', label: "THE SIMULATOR 🗣️" },
    { key: 'future_path', label: "THE FUTURE PATH 🚀" }
  ];

  const toolFields: Record<string, FormField[]> = {
    university_vibe_matcher: [
      { id: 'character_traits', label: "O'zingizning xarakteringiz, o'qish uslubingiz va qiziqishlaringiz", type: 'textarea', placeholder: "Masalan: Tashabusskor, rahbarlikni sevaman, shovqinli yoki tinch..." }
    ],
    admission_officer_persona: [
      { id: 'weaknesses', label: "Profilingizdagi sizga xavfli ko'rinayotgan barcha kamchiliklar", type: 'textarea', placeholder: "IELTS 6.5, GPA pasligi yoki darsdan tashqari faoliyat yo'qligi..." }
    ],
    trend_predictor: [
      { id: 'target_major', label: "Siz qiziqayotgan va grant olmoqchi bo'lgan asosiy soha", type: 'text', placeholder: "Masalan: Data Science, Renewable Energy" }
    ],
    acceptance_rate_hacker: [
      { id: 'target_major', label: "Siz topshirayotgan universitetlar va yo'nalishingiz", type: 'text', placeholder: "Masalan: NYU computer science, Bocconi economics" }
    ],
    hidden_major_finder: [
      { id: 'target_major', label: "Siz avval tanlagan an'anaviy o'ta raqobatli soha", type: 'text', placeholder: "Masalan: Computer Science, Economics" }
    ],
    safety_reach_matrix: [
      { id: 'gpa', label: "Mavjud GPA ballaringiz va IELTS darajangiz", type: 'text', placeholder: "GPA: 4.8, IELTS 7.0, SAT 1400..." }
    ],
    financial_aid_sniper: [
      { id: 'annual_income', label: "Oilaviy o'rtacha yillik daromadingiz ($ USD)", type: 'text', placeholder: "Masalan: $5,000" }
    ],
    waitlist_escape_plan: [
      { id: 'weaknesses', label: "Sizni kutish ro'yxatiga (waitlist) qo'ygan universitet", type: 'text', placeholder: "Masalan: Boston University, software engineering" }
    ],
    emotional_arc_analyzer: [
      { id: 'essay_text', label: "Sizning motivatsiya (SOP) inshongiz", type: 'textarea', placeholder: "Inshoni shu yerga kiriting..." }
    ],
    hook_generator: [
      { id: 'cliche_sample', label: "Inshongizning hozirgi yozilgan sodda va andozaviy birinchi jumlalari", type: 'textarea', placeholder: "Since my childhood, I..." }
    ],
    cultural_sensitivity: [
      { id: 'essay_text', label: "G'arb madaniyati nuqtai nazaridan tekshirish uchun motivatsiya yozuvlaringiz", type: 'textarea', placeholder: "Draft or fragment of your SOP..." }
    ],
    why_us_architect: [
      { id: 'target_major', label: "Universitet nomi va hujjat topshirayotgan yo'nalishingiz", type: 'text', placeholder: "Masalan: Harvard University, Applied Mathematics" }
    ],
    narrative_threader: [
      { id: 'simple_hobbies', label: "Shaxsiy hayotingiz, bolaligingizdan esda qolgan qiziqarli ko'chat-voqea", type: 'textarea', placeholder: "Uydagilar bilan bepul bino qurganmiz, maktabda narsa tuzganman..." }
    ],
    vocabulary_punch: [
      { id: 'essay_text', label: "Lug'at boyligini akademik darajaga ko'tarish uchun insho matni", type: 'textarea', placeholder: "Enter paragraph to enrich vocabulary..." }
    ],
    cliche_detector: [
      { id: 'cliche_sample', label: "Andozaviylikni qidirish uchun inshongiz", type: 'textarea', placeholder: "Draft here..." }
    ],
    tone_shifter: [
      { id: 'essay_text', label: "Insho matni", type: 'textarea', placeholder: "Paragraph to shift style..." }
    ],
    blind_interviewer: [],
    stump_questioner: [
      { id: 'target_major', label: "Siz topshirayotgan mutaxassislik", type: 'text', placeholder: "Masalan: Cyber Security" }
    ],
    body_language_text: [
      { id: 'essay_text', label: "Xat yoki javobingiz matni", type: 'textarea', placeholder: "Type what you wrote..." }
    ],
    scholarship_panel: [],
    thank_you_sniper: [
      { id: 'weaknesses', label: " پروفیسر yoki suhbatdoshingizning qiziqarli aytgan gaplari", type: 'text', placeholder: "Ular distributed files haqida gapirdi..." }
    ],
    group_discussion_leader: [
      { id: 'character_traits', label: "Guruhda asosan qanday gaplashmoqchisiz", type: 'text', placeholder: "Fikrimni chiroyli beraman..." }
    ],
    job_market_matcher: [
      { id: 'target_major', label: "Mutaxassislik va oliygohingiz", type: 'text', placeholder: "Masalan: MIT, Data Science" }
    ],
    roi_calculator: [
      { id: 'annual_income', label: "Siz to'lamoqchi bo'lgan o'rtacha bir yillik kontrakt narxi ($)", type: 'text', placeholder: "Masalan: $5,005" }
    ],
    alumni_bio_scraper: [
      { id: 'target_major', label: "Karyeraviy maqsadingiz", type: 'text', placeholder: "Masalan: AI startap yoki FAANG engineer" }
    ],
    visa_policy_advisor: [
      { id: 'target_major', label: "Hujjat topshirayotgan maqsadli davlatingiz", type: 'text', placeholder: "Masalan: AQSh, Germaniya, Janubiy Koreya" }
    ],
    networking_script: [
      { id: 'character_traits', label: "Siz suhbatlashmoqchi bo'lgan shaxsning lavozimi", type: 'text', placeholder: "Masalan: Google tech lead bitiruvchi" }
    ],
    startup_potential: [
      { id: 'simple_hobbies', label: "Startap g'oyangizning qisqacha mazmuni", type: 'textarea', placeholder: "Masalan: maktablar uchun sun'iy dars beruvchi bot..." }
    ],
    skill_bridge: [
      { id: 'target_major', label: "O'qimoqchi bo'lgan soha", type: 'text', placeholder: "Business Economics" }
    ],
    mental_health_guardian: [
      { id: 'weaknesses', label: "Hozirdagi eng ko'p tashvishlanayotgan va qiynayotgan narsalaringiz", type: 'textarea', placeholder: "IELTS topshira olmayapman, vaqtim juda kam..." }
    ]
  };

  const isInteractiveChat = (toolKey: string) => {
    return ['blind_interviewer', 'scholarship_panel'].includes(toolKey);
  };

  const getToolLimit = (toolKey: string) => {
    return isInteractiveChat(toolKey) ? 5 : 1;
  };

  // Limit Check synchronized perfectly with localStorage and user context
  const [limits, setLimits] = useState<Record<string, { count: number; limit: number; remaining: number; isLocked: boolean }>>({});

  const checkCurrentLimit = async (toolKey: string) => {
    if (user.isPremium) {
      return { isLocked: false, remaining: Infinity, limit: Infinity, count: 0 };
    }
    const limitValue = getToolLimit(toolKey);

    // Read from local storage (extremely fast & error-free fallback)
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

    // Also write to users usage DB (Optional & caught)
    if (user.isLoggedIn && user.id) {
      try {
        const docRef = doc(db, "users", user.id, "usage", toolKey);
        await setDoc(docRef, {
          userId: user.id,
          toolKey,
          timestamps
        });
      } catch (e) {
        console.warn("Firestore usage write skipped:", e);
      }
    }

    setUsageTrigger(p => p + 1);
    onUpdateUsage(toolKey);
  };

  const clearUsageStats = () => {
    if (window.confirm("Barcha bepul limitlarni qayta tiklashni xohlaysizmi (SINOV)?")) {
      tools.forEach(tool => {
        const key = `topgrand_usage_${user.id || 'guest'}_${tool.key}`;
        localStorage.removeItem(key);
      });
      setUsageTrigger(p => p + 1);
    }
  };

  const handleSelectTool = (tool: ToolConfig) => {
    if (!user.isLoggedIn) {
      onOpenAuth();
      return;
    }
    setSelectedTool(tool);
    setResult('');
    setChatMessage('');

    if (tool.key === 'blind_interviewer') {
      setChatHistory([
        { sender: 'ai', text: `🎓 Assalomu alaykum, ${user.name || 'Talaba'}! Men xalqaro oliygoh Qabul Komissiyasi rahbariman. Men sizing arizangizni ayovsiz, hech qanday andishasiz tanqidiy suhbat o'tkazish uchun kutyapman.\n\n"Nima sababli biz siz kabi o'rtacha profilingiz bor talabaga minglab dollarlik grant taqdim etishimiz mantiqli deb hisoblaysiz?"` }
      ]);
    } else if (tool.key === 'scholarship_panel') {
      setChatHistory([
        { sender: 'ai', text: `🏛️ **[Scholarship Panel Simulator]**\nDavra komissiyasi qoshiga hush kelibsiz. Biz 3 kishimiz: Professor Harrison, Donor vakili Lady Gwendolyn va Tizim administratori.\n\n"Suhbatimiz boshlanishida sizning hayotingizdagi eng katta mag'lubiyatingiz haqida so'ramoqchimiz hamda undan olingan xulosani bilmoqshimiz. Qulog'imiz sizda."` }
      ]);
    }
  };

  const executeAIRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTool || loading) return;

    const currentStatus = await checkCurrentLimit(selectedTool.key);
    if (currentStatus.isLocked) {
      onOpenPremium();
      return;
    }

    setLoading(true);
    const isChat = isInteractiveChat(selectedTool.key);

    const inputDataMap: Record<string, string> = {};
    const configuredFields = toolFields[selectedTool.key] || [];
    configuredFields.forEach(f => {
      inputDataMap[f.id] = formValues[f.id] || '';
    });

    if (isChat) {
      inputDataMap['userMessage'] = chatMessage;
      inputDataMap['history'] = JSON.stringify(chatHistory.slice(-6));
    }

    try {
      if (isChat) {
        setChatHistory(prev => [...prev, { sender: 'user', text: chatMessage }]);
        setChatMessage('');
      }

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: selectedTool.key,
          inputData: inputDataMap,
          userContext: {
            name: user.name,
            surname: user.surname,
            isPremium: user.isPremium
          }
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        if (isChat) {
          setChatHistory(prev => [...prev, { sender: 'ai', text: data.text }]);
        } else {
          setResult(data.text);
        }
        await recordUsageLocallyAndRemote(selectedTool.key);
      } else {
        alert(data.error || "Ulanishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
      }
    } catch (err) {
      console.error(err);
      alert("Platforma sun'iy intellekti bilan kutilmagan ulanish xatosi. Qaytadan urining.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTools = activeCategory === 'all' 
    ? tools 
    : tools.filter(t => t.category === activeCategory);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-12 text-white" id="ai-center-root">
      
      <AnimatePresence mode="wait">
        {!selectedTool ? (
          /* TOOL DIRECTORY GRID WITH TRANSLUCENT PREMIUM CARDS */
          <motion.div 
            key="catalog"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-12"
          >
            {/* HERO PANELS HEADER */}
            <div className="text-center max-w-3xl mx-auto space-y-5">
              <span className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/30 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest text-cyan-300 uppercase font-mono">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                <span>TOPGRAND COGNITIVE SUITE v3.0</span>
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Chet elga <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
                  Daxshatli 30 ta AI Funksiya
                </span>
              </h2>
              <p className="text-xs md:text-sm text-blue-200/70 max-w-xl mx-auto leading-relaxed font-semibold">
                Konsalting firmalarsiz, sun'iy intellekt orqali profilingizni xavfsiz mukammallikka ko'taring va haqiqiy dunyo grantlarini qo'lga kiriting!
              </p>

              {/* METRIC BADGES */}
              <div className="flex flex-wrap justify-center items-center gap-3 pt-3 text-[10px] font-mono font-bold">
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm text-cyan-300 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>INTELLIGENCE:</span>
                  <span className="font-extrabold text-white">ACTIVE (GEMINI 2.5)</span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm text-blue-300 backdrop-blur-md">
                  <Clock className="h-3.5 w-3.5 text-blue-400" />
                  <span>SINOV RESETGACHA:</span>
                  <span className="text-yellow-400 font-extrabold">{countdownText}</span>
                </div>

                <button 
                  onClick={clearUsageStats}
                  title="Limits reset"
                  className="p-2 bg-white/5 border border-white/10 hover:border-red-500 hover:bg-red-500/10 text-blue-300 rounded-xl transition cursor-pointer backdrop-blur-md"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Glass Category Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 bg-white/5 border border-white/10 p-2 rounded-3xl max-w-2xl mx-auto backdrop-blur-lg">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2.5 rounded-2xl text-[11px] font-extrabold tracking-wider transition cursor-pointer border uppercase ${
                    activeCategory === cat.key
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-white/25 shadow-lg shadow-cyan-500/10'
                      : 'bg-transparent text-blue-200 border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid display cards */}
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
                    whileHover={{ scale: 1.015, y: -3 }}
                    className="relative group rounded-3xl border border-white/10 bg-slate-900/15 p-6 flex flex-col justify-between shadow-xl backdrop-blur-xl hover:border-cyan-405/40 hover:bg-slate-900/30 transition-all duration-300"
                    id={`tool-card-${tool.key}`}
                  >
                    <div>
                      {/* Popular & category badges */}
                      <div className="flex justify-between items-center mb-5">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-cyan-300 bg-cyan-500/10 border border-cyan-400/20 px-3 py-1 rounded-full">
                          {tool.category === 'strategist' && '🧭 THE STRATEGIST'}
                          {tool.category === 'content_lab' && '✍️ THE CONTENT LAB'}
                          {tool.category === 'simulator' && '🗣️ THE SIMULATOR'}
                          {tool.category === 'future_path' && '🚀 THE FUTURE PATH'}
                        </span>
                        {tool.popular && (
                          <span className="flex items-center gap-1 text-[8px] font-black tracking-widest text-amber-300 bg-amber-500/10 border border-amber-400/20 px-2.5 py-1 rounded-full uppercase animate-pulse">
                            <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                            Mashhur
                          </span>
                        )}
                      </div>

                      {/* Icon with Title */}
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-tr ${tool.color} text-white shadow-lg shrink-0`}>
                          <IconComp className="h-5.5 w-5.5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-white leading-snug group-hover:text-cyan-400 transition text-sm sm:text-base">
                            {tool.title}
                          </h3>
                          <p className="text-xs text-blue-200/50 font-normal mt-2 leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer bar indicators */}
                    <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between gap-4">
                      <div className="text-[10px] font-mono">
                        {user.isPremium ? (
                          <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
                            <Gem className="h-3 w-3 animate-bounce" /> PRO REJA (ONLINE)
                          </span>
                        ) : (
                          <span className={`${isLimitLocked ? 'text-red-400' : 'text-blue-300/80'} font-bold`}>
                            Bepul limit: {limitRemaining} / {limitMax}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleSelectTool(tool)}
                        className={`px-4 py-2 rounded-xl text-[10px] uppercase font-bold flex items-center gap-1.5 cursor-pointer transition ${
                          isLimitLocked && !user.isPremium
                            ? 'bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30'
                            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-cyan-400/30'
                        }`}
                        id={`btn-select-tool-${tool.key}`}
                      >
                        <span>Tekshirish</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* SINGLE DETAILED WORKSPACE VIEW (FULL SCREEN OVERLAY WITH ONY BACK BUTTON AT TOP) */
          <motion.div
            key="workspace"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full max-w-6xl mx-auto rounded-3xl border border-white/10 bg-[#0a0f26]/60 p-6 md:p-8 shadow-2xl backdrop-blur-2xl"
            id="detailed-workspace"
          >
            {/* ONLY elegant back button at the very top as requested! */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8" id="workspace-back-header">
              <button
                onClick={() => setSelectedTool(null)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition cursor-pointer"
                id="btn-back-to-catalog"
              >
                <ArrowLeft className="h-4 w-4 text-cyan-400" />
                <span>Orqaga Qaytish</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-extrabold tracking-widest text-cyan-400 font-mono uppercase bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 rounded-full">
                  {selectedTool.title}
                </span>
                {user.isPremium ? (
                  <span className="inline-flex items-center gap-1 bg-yellow-400/25 text-yellow-300 border border-yellow-400/20 px-3 py-1 rounded-full text-[9px] font-black uppercase">
                    <Gem className="h-3 w-3 text-yellow-400 shrink-0" /> PRO Obuna
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 text-blue-200 px-3 py-1 rounded-full text-[9px] font-bold uppercase">
                    TEKIN SINOV
                  </span>
                )}
              </div>
            </div>

            {/* Split layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Form entries for specific tools */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${selectedTool.color} text-white shadow-xl`}>
                      {React.createElement(selectedTool.icon, { className: 'h-6 w-6' })}
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-white leading-tight">{selectedTool.title}</h3>
                      <p className="text-xs text-blue-200/50 mt-1 font-semibold capitalize">
                        Yo'nalish: <span className="text-cyan-400">{selectedTool.category.replace(/_/g, " ")}</span>
                      </p>
                    </div>
                  </div>

                  {!isInteractiveChat(selectedTool.key) ? (
                    // static form inputs mapping
                    <form onSubmit={executeAIRequest} className="space-y-4">
                      {toolFields[selectedTool.key]?.map((field) => (
                        <div key={field.id} className="space-y-1.5 text-left">
                          <label className="block text-xs font-bold text-blue-200/80">
                            {field.label}
                          </label>
                          {field.type === 'textarea' ? (
                            <textarea
                              rows={5}
                              value={formValues[field.id] || ''}
                              onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 px-4 text-xs font-semibold text-white placeholder-blue-300/20 outline-none focus:border-cyan-400 transition"
                              placeholder={field.placeholder}
                            ></textarea>
                          ) : (
                            <input
                              type="text"
                              value={formValues[field.id] || ''}
                              onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 px-4 text-xs font-semibold text-white placeholder-blue-300/20 outline-none focus:border-cyan-400 transition"
                              placeholder={field.placeholder}
                            />
                          )}
                        </div>
                      ))}

                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-xs text-white uppercase tracking-widest shadow-lg transition duration-200 cursor-pointer ${
                          loading 
                            ? 'bg-slate-800 border border-white/5 shadow-none cursor-not-allowed opacity-[0.8]' 
                            : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 active:scale-95'
                        }`}
                        id="btn-execute-static"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <RefreshCw className="animate-spin h-4 w-4 text-cyan-300" />
                            AI Tahlil qilmoqda...
                          </span>
                        ) : (
                          "AI Tahlilini olish ⚡"
                        )}
                      </button>
                    </form>
                  ) : (
                    // Interactive Chat Simulators
                    <div className="space-y-4">
                      <p className="text-xs text-blue-200/70 leading-relaxed font-semibold">
                        Siz jonli tarzda TopGrand virtual suhbat komissiyasi bilan muloqot qilyapsiz. Quyida javobingizni mantiqiy va asoslangan bering.
                      </p>
                      <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-300 leading-relaxed">
                        ⚠️ **Suhbat qoidasi**: Bepul foydalanuvchi variantida suhbat {getToolLimit(selectedTool.key)} marta xabar almashishdan so'ng to'xtaydi. Natijani bepul reja yakunida PDF yuklash imkoni berilmaydi. Cheksiz suhbat uchun PRO obunani olganingiz ma'qul.
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/5 mt-8 text-[10px] text-blue-200/30 font-mono font-bold">
                  TopGrand AI Model is hosted securely. Encrypted pipeline.
                </div>
              </div>

              {/* Real-time responses pane (Translucent sapphire element, crystal clear text) */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="flex-1 flex flex-col rounded-3xl border border-white/15 bg-white/5 p-6 md:p-8 min-h-[420px] max-h-[600px] overflow-hidden text-white shadow-2xl justify-between">
                  {/* Panel logs bar */}
                  <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-4 shrink-0 font-mono text-[9px] text-cyan-300/60 font-black tracking-widest uppercase">
                    <span>AI Central Live Stream Outputs</span>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  </div>

                  {/* Body depends on interactive type */}
                  <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs font-semibold leading-relaxed">
                    {!isInteractiveChat(selectedTool.key) ? (
                      result ? (
                        <div className="whitespace-pre-line text-xs font-semibold text-white leading-relaxed font-sans prose prose-invert">
                          {result}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40 p-5 space-y-3">
                          <Compass className="h-9 w-9 text-cyan-300 animate-bounce" />
                          <p className="text-blue-100 text-xs font-bold leading-normal">
                            Chap tomondagi jadval maydonlarini to'ldiring va tahlil tugmasini bosing.
                          </p>
                        </div>
                      )
                    ) : (
                      // Interactive chats display
                      <div className="space-y-4">
                        {chatHistory.map((msg, i) => (
                          <div 
                            key={i} 
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                                msg.sender === 'user' 
                                  ? 'bg-cyan-500/20 border border-cyan-400/30 text-white font-bold ml-auto' 
                                  : 'bg-white/5 border border-white/5 text-blue-50 mr-auto whitespace-pre-line'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        {loading && (
                          <div className="flex justify-start animate-pulse">
                            <span className="p-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] uppercase font-mono tracking-wider">
                              Sun'iy intellekt tahlili yozilmoqda...
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Form input messaging box at footer for chatbot mode */}
                  {isInteractiveChat(selectedTool.key) && (
                    <form onSubmit={executeAIRequest} className="mt-4 pt-3 border-t border-white/5 flex gap-2 shrink-0">
                      <input
                        type="text"
                        value={chatMessage}
                        disabled={loading}
                        onChange={(e) => setChatMessage(e.target.value)}
                        className="flex-1 rounded-xl bg-white/5 border border-white/10 py-3 px-4 text-xs font-semibold text-white placeholder-blue-300/40 outline-none focus:border-cyan-400 transition"
                        placeholder="Komissiyaga javob maktub yoki suhbatni kiriting..."
                      />
                      <button
                        type="submit"
                        disabled={loading || !chatMessage.trim()}
                        className="p-3 rounded-xl bg-cyan-550/80 hover:bg-cyan-500 border border-white/10 font-bold text-white shadow-md active:scale-95 transition flex items-center justify-center cursor-pointer"
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
