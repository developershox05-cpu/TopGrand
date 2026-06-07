import React, { useState, useEffect } from 'react';
import { 
  Sparkles, FileText, MessageSquare, Terminal, RefreshCw, Key, Shield, Clock, Lock, 
  Check, ArrowRight, CornerDownRight, DollarSign, Award, BookOpen, AlertCircle, Heart,
  FileCheck, ShieldCheck, Mail, Compass, Layers, Milestone, Send
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

export default function AIPrepCenter({ user, onOpenAuth, onOpenPremium, onUpdateUsage }: AIPrepCenterProps) {
  const [selectedTool, setSelectedTool] = useState<ToolConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [lastUsageBlock, setLastUsageBlock] = useState<string | null>(null); // ISO string of block

  // Form Inputs State
  const [essayText, setEssayText] = useState('');
  const [essayTopic, setEssayTopic] = useState('');
  const [cvText, setCvText] = useState('');
  const [cvRegion, setCvRegion] = useState('Yevropa');
  const [lorStrengths, setLorStrengths] = useState('');
  const [lorRecommender, setLorRecommender] = useState('Maktab direktori');
  const [motSkills, setMotSkills] = useState('');
  const [motUniv, setMotUniv] = useState('');
  const [motTone, setMotTone] = useState('Professional va Jiddiy');
  const [scholarshipAge, setScholarshipAge] = useState('18');
  const [scholarshipGpa, setScholarshGPA] = useState('4.8');
  const [scholarshipScores, setScholarshipScores] = useState('IELTS 7.0 / SAT Yo\'q');
  const [scholarshipMajor, setScholarshipMajor] = useState('Biznes va IT');
  const [vocabTopic, setVocabTopic] = useState('Sog\'liqni saqlash');
  const [vocabLevel, setVocabLevel] = useState('Intermediate');
  const [budgetCountry, setBudgetCountry] = useState('Germaniya');
  const [budgetLifestyle, setBudgetLifestyle] = useState('Tejamkor (Yotoqxona)');
  const [sopText, setSopText] = useState('');
  const [sopCountry, setSopCountry] = useState('AQSh F-1');
  const [courseFavorites, setCourseFavorites] = useState('Matematika, Fizika, Dasturlash');
  const [courseHobbies, setCourseHobbies] = useState('Startaplar, Robototexnika, Shaxmat');
  const [enhancerGrade, setEnhancerGrade] = useState('10-sinf');
  const [enhancerHistory, setEnhancerHistory] = useState('Faqat standart darslar');
  const [predictorScores, setPredictorScores] = useState('IELTS 6.0 / SAT 1200');
  const [predictorTarget, setPredictorTarget] = useState('IELTS 7.5 / SAT 1450');
  const [predictorTime, setPredictorTime] = useState('3 oy');
  const [plannerExam, setPlannerExam] = useState('IELTS Academic');
  const [plannerHours, setPlannerHours] = useState('4 soat');
  const [plannerAreas, setPlannerAreas] = useState('Writing Task 1 & Task 2');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);

  // Interview Multi-step states
  const [interviewMajor, setInterviewMajor] = useState('Kompyuter Ilmlari (Computer Science)');
  const [interviewHistory, setInterviewHistory] = useState<Array<{ question: string; answer?: string }>>([
    { question: "Assalomu alaykum! TopGrand xalqaro suhbat xonasiga xush kelibsiz. O'zingizni tanishtiring va nega aynan ushbu oliygoh hamda mutaxassislikni tanlaganingizni aytib bering." }
  ]);
  const [currentInterviewAnswer, setCurrentInterviewAnswer] = useState('');

  // 14 Ultimate academic AI tools configured dynamically
  const tools: ToolConfig[] = [
    { key: 'essay', title: 'AI Essay Proofreader', description: "Insholarni IELTS kriteriyalari bo'yicha tahlil qilish, ball berish va grammatik xatolarni topib beruvchi daxshatli tekshiruvchi.", icon: FileCheck, color: 'from-blue-600 to-cyan-500', popular: true },
    { key: 'interview', title: 'AI Mock Interview Simulator', description: "Nufuzli oliygohlar (Harvard, Oxford, MIT) qabul komissiyasi a'zolari bilan interaktiv, suhbatdosh mock-intervyu darsi.", icon: Terminal, color: 'from-cyan-500 to-blue-600', popular: true },
    { key: 'chat', title: 'AI Smart Academic Advisor', description: "Konsalting firmalarsiz, bevosita topshirish, grant va stipendiya yutish bo'yicha to'g'ridan-to'g'ri universal maslahatchi.", icon: MessageSquare, color: 'from-blue-500 to-cyan-400', popular: true },
    { key: 'cv_optimizer', title: 'AI CV & Resume Optimizer', description: "Hozirgi rezyumeingizni xalqaro darajada raqobatbardosh (ATS-friendly) qilish uchun tahlil va optimallashtirish takliflari.", icon: FileText, color: 'from-cyan-400 to-blue-500' },
    { key: 'scholarship_matcher', title: 'AI Global Scholarship Finder', description: "Sizning GPA va sertifikatlaringizga mos keladigan to'liq (100% GKS, DSU, Burslari) va qisman grantlarni saralash.", icon: Award, color: 'from-blue-600 to-indigo-500', popular: true },
    { key: 'lor_generator', title: 'AI Letter of Recommendation Writer', description: "Professor yoki akademik rahbar nomidan jahon standartlariga to'liq mos keladigan professional Tavsiyanomalar tuzish.", icon: ShieldCheck, color: 'from-cyan-500 to-indigo-600' },
    { key: 'motivation_generator', title: 'AI Motivation Letter Masterclass', description: "Yutuqlaringiz, qiziqishlaringiz va maqsadlaringiz asosida qabul komissiyasini lol qildiradigan professional motivatsiya xati inshosi.", icon: Sparkles, color: 'from-indigo-500 to-cyan-400' },
    { key: 'vocab_booster', title: 'IELTS Vocabulary Booster', description: "IELTS Writing va Speaking bo'limlarida 8.0+ ball beradigan eng yuqori darajadagi akademik so'zlar tahlili.", icon: BookOpen, color: 'from-blue-500 to-purple-500' },
    { key: 'student_budget', title: 'Student Budget & Cost Planner', description: "Borayotgan xorijiy davlatingiz bo'yicha batafsil oylik moliyaviy xarajatlar tahlili va tejash sirlari.", icon: DollarSign, color: 'from-cyan-500 to-green-500' },
    { key: 'visa_sop', title: 'Visa Statement of Purpose (SOP) Expert', description: "Elchixonada viza rad etilishi xavfini baholash va uni minimallashtirish uchun inshoni daxshat tahlil etish.", icon: Compass, color: 'from-purple-500 to-blue-600' },
    { key: 'course_matcher', title: 'AI Course & University Matcher', description: "Qiziqishlaringiz va eng yaxshi ko'rgan fanlaringizga asoslanib eng mos keladigan sohalar va oliygohlar generatori.", icon: Layers, color: 'from-blue-400 to-cyan-500' },
    { key: 'profile_enhancer', title: 'Extracurricular Profile Enhancer', description: "Maktab davrida bajarishingiz kerak bo'lgan qabul komissiyasiga daxshatli ta'sir ko'rsatuvchi darsdan tashqari premium loyihalar.", icon: Milestone, color: 'from-cyan-400 to-indigo-500' },
    { key: 'score_predictor', title: 'AI IELTS & SAT Score Predictor', description: "Hozirgi tayyorgarligingiz va amaldagi imtihon ko'rsatkichlaringiz asosida maqsadli ball prognozi va kamchiliklar tahlili.", icon: Key, color: 'from-indigo-600 to-cyan-400' },
    { key: 'study_planner', title: '30-Day Intensive Study Planner', description: "Belgilangan qisqa vaqt ichida eng yaxshi ko'rsatkichga olib chiquvchi kunlik soatbay xalqaro imtihon o'quv rejalashtiruvchisi.", icon: Clock, color: 'from-cyan-500 to-blue-600' }
  ];

  // Logic to handle 24h usage log restriction
  const handleSelectTool = (tool: ToolConfig) => {
    // 1. Authorization requirement check
    if (!user.isLoggedIn) {
      alert("Tizimdan foydalanish va AI modullarini ishlatish uchun avval ro'yxatdan o'ting!");
      onOpenAuth();
      return;
    }

    setResult('');
    setLastUsageBlock(null);

    // 2. Limit restriction verification if user is not premium
    if (!user.isPremium) {
      const lastUsedStr = user.usageLog[tool.key];
      if (lastUsedStr) {
        const lastUsed = new Date(lastUsedStr);
        const now = new Date();
        const diffHours = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60);

        if (diffHours < 24) {
          // Less than 24h since last execution
          setLastUsageBlock(new Date(lastUsed.getTime() + 24*60*60*1000).toLocaleTimeString());
          setSelectedTool(tool);
          return;
        }
      }
    }

    setSelectedTool(tool);
  };

  const executeAIRequest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedTool) return;

    setLoading(true);
    setResult('');

    let inputData: any = {};

    // Gather specific form fields dynamically based on active tool code
    switch (selectedTool.key) {
      case 'essay':
        inputData = { essayText, topic: essayTopic };
        break;
      case 'cv_optimizer':
        inputData = { cvText, targetRegion: cvRegion };
        break;
      case 'lor_generator':
        inputData = { strengths: lorStrengths, recommenderRole: lorRecommender };
        break;
      case 'motivation_generator':
        inputData = { skillsMajor: motSkills, targetUniversity: motUniv, tone: motTone };
        break;
      case 'scholarship_matcher':
        inputData = { age: scholarshipAge, gpa: scholarshipGpa, languageScore: scholarshipScores, major: scholarshipMajor };
        break;
      case 'vocab_booster':
        inputData = { topic: vocabTopic, currentLevel: vocabLevel };
        break;
      case 'student_budget':
        inputData = { country: budgetCountry, lifestyle: budgetLifestyle };
        break;
      case 'visa_sop':
        inputData = { sopText, country: sopCountry };
        break;
      case 'course_matcher':
        inputData = { favorites: courseFavorites, hobbies: courseHobbies };
        break;
      case 'profile_enhancer':
        inputData = { grade: enhancerGrade, history: enhancerHistory };
        break;
      case 'score_predictor':
        inputData = { currentScore: predictorScores, targetScore: predictorTarget, timeLeft: predictorTime };
        break;
      case 'study_planner':
        inputData = { examType: plannerExam, dailyHours: plannerHours, weakAreas: plannerAreas };
        break;
      case 'chat':
        inputData = { userMessage: chatMessage };
        // append user message instantly to history
        setChatHistory(prev => [...prev, { sender: 'user', text: chatMessage }]);
        const currentMsg = chatMessage;
        setChatMessage('');
        break;
      case 'interview':
        // send full interview history + latest response
        const newHistory = [...interviewHistory];
        newHistory[newHistory.length - 1].answer = currentInterviewAnswer;
        setInterviewHistory(newHistory);
        inputData = { major: interviewMajor, history: newHistory };
        setCurrentInterviewAnswer('');
        break;
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
          // append new question from interviewer
          setInterviewHistory(prev => [...prev, { question: data.text }]);
        } else {
          setResult(data.text);
        }

        // Register last usage in memory and storage (unless premium which has unlimited)
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
      
      {/* HEADER SECTION FOR TAYYORLOV PLATFORM */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl font-black text-blue-950 tracking-tight">
          Chet El Universitetlariga Tayyorlov Bo'limi
        </h2>
        <p className="text-sm text-blue-600 font-black tracking-widest uppercase mt-1 font-mono">Shaffof va Zamonaviy AI Yordamchilari Majmuasi</p>
        <p className="text-xs md:text-sm text-slate-600 mt-3 font-semibold leading-relaxed">
          Xalqaro oliygohlarga hujjat topshirishni rejalashtirayotgan talabalar uchun daxshatli 14 ta sun'iy intellekt (AI) modullari. Har bir modul to'liq bepul bo'lib, imtihon materiallarini tahlil qiladi va xatolarsiz yechim beradi.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedTool ? (
          /* TOOL SELECTION GRID */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            id="ai-tools-grid"
          >
            {tools.map((tool) => {
              const ToolIcon = tool.icon;
              // Unlock all tools to make 100% free as requested
              const isLocked = false;

              return (
                <div
                  key={tool.key}
                  onClick={() => handleSelectTool(tool)}
                  className="relative p-6 rounded-[2.5rem] border border-white/60 bg-white/70 transition duration-300 backdrop-blur-md shadow-lg shadow-blue-500/5 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Top alignment row */}
                    <div className="flex items-start justify-between">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr ${tool.color} p-2.5 text-white shadow-lg`}>
                        <ToolIcon className="h-5 w-5" />
                      </div>
                      
                      {tool.popular && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-mono font-black text-blue-700 border border-blue-200 uppercase">
                          Popular
                        </span>
                      )}

                      {isLocked && (
                        <span className="flex items-center gap-1 text-[10px] text-red-650 bg-red-100 px-2 py-0.5 rounded-full border border-red-200/50 font-bold">
                          <Lock className="h-3 w-3" />
                          <span>Locked</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-black text-blue-950 group-hover:text-blue-700 transition duration-150">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium mt-1.5 leading-relaxed min-h-[50px]">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                      Status: {isLocked ? "24soat to'siq" : "Faol bepul"}
                    </span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition duration-150">
                      Modulni boshlash <ArrowRight className="h-4 w-4 text-blue-600" />
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          /* SINGLE TOOL WORKSPACE */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="w-full max-w-4xl mx-auto rounded-[2.5rem] border border-white/60 bg-white/85 p-6 md:p-8 backdrop-blur-xl space-y-6 shadow-2xl relative z-10 text-slate-800"
            id="ai-workspace"
          >
            {/* Header / Nav-back */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-150">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedTool(null)}
                  className="px-4 py-2 rounded-xl border border-blue-200 bg-white text-xs font-bold text-blue-700 hover:bg-blue-50 transition cursor-pointer shadow-sm"
                  id="btn-workspace-back"
                >
                  ← Katalogga qaytish
                </button>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-xs text-slate-300">/</span>
                  <span className="text-xs text-blue-700 font-extrabold">{selectedTool.title}</span>
                </div>
              </div>

              {!user.isPremium && (
                <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold font-mono">
                  <Clock className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>24soat ichida 1 marta limit statusi</span>
                </div>
              )}
            </div>

            {/* Check if Locked due to 24-hour limit - permanently disabled to make 100% free */}
            {(() => {
              const isLocked = false;
              const lastUsedStr = "";

              if (isLocked) {
                return (
                  <div className="text-center py-10 space-y-6 max-w-md mx-auto" id="tool-locked-warning">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-600 border border-red-200 p-4 shadow-sm">
                      <Lock className="h-10 w-10 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">24 soatlik bepul limit tugadi</h3>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed font-semibold">
                        Ushbu AI modulidan har 24 soatda faqat 1 marta bepul foydalanish mumkin! Yana foydalanish uchun 24 soat kuting yoki Premium ruxsatni oling!
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-bold font-mono shadow-inner">
                      Navbatdagi imkoniyat: <span className="text-blue-700 font-black">{new Date(new Date(lastUsedStr).getTime() + 24*60*60*1000).toLocaleString()}</span>
                    </div>

                    <button
                      onClick={onOpenPremium}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:brightness-110 active:scale-95 transition font-black text-white shadow-lg shadow-blue-500/25"
                    >
                      Daxshatli Premium Olish
                    </button>
                  </div>
                );
              }

              return (
                /* ACTUAL TOOL ACTIVE INPUT FORM & RESULTS */
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-blue-950 flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-105 text-blue-700">
                      {React.createElement(selectedTool.icon, { className: "h-5 w-5" })}
                    </span>
                    {selectedTool.title}
                  </h3>

                  <form onSubmit={executeAIRequest} className="space-y-4">
                    {/* DYNAMIC FORM ACCORDING TO TOOL KEY */}
                    {selectedTool.key === 'essay' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-blue-200 uppercase mb-1">Insho Mavzusi (Majburiy emas)</label>
                          <input
                            type="text"
                            placeholder="Masalan: Should artificial intelligence replace teachers?"
                            value={essayTopic}
                            onChange={(e) => setEssayTopic(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-xs md:text-sm text-white placeholder-blue-350/40 outline-none focus:border-cyan-400 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-blue-200 uppercase mb-1">Inshongizni kiriting</label>
                          <textarea
                            required
                            rows={8}
                            placeholder="Insho matnini bu yerga daxshat darajada to'liq yozing yoki nusxalang..."
                            value={essayText}
                            onChange={(e) => setEssayText(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-xs md:text-sm text-white placeholder-blue-350/40 outline-none focus:border-cyan-400 transition"
                          />
                        </div>
                      </div>
                    )}

                    {selectedTool.key === 'interview' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-semibold text-blue-200 uppercase">Suhbat Mutaxassisligi:</label>
                          <select
                            value={interviewMajor}
                            onChange={(e) => setInterviewMajor(e.target.value)}
                            className="bg-blue-950 text-white rounded-xl border border-white/10 p-2 text-xs outline-none focus:border-cyan-405"
                          >
                            <option value="Computer Science & AI">Kompyuter Ilmlari va Sun'iy Intellekt</option>
                            <option value="Business Administration & MBA">Biznes Boshqaruvi va MBA</option>
                            <option value="Medicine & Biology">Tibbiyot va Biologiya</option>
                            <option value="Humanities & International Relations">Siyosatshunoslik va Xalqaro munosabatlar</option>
                            <option value="Engineering & Robotics">Muhandislik va Robototexnika</option>
                          </select>
                        </div>

                        {/* Interview Chat Bubble Container */}
                        <div className="space-y-3.5 max-h-[300px] overflow-y-auto p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
                          {interviewHistory.map((chat, idx) => (
                            <div key={idx} className="space-y-2">
                              {/* Interviewer side */}
                              <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-3 text-cyan-300">
                                <p className="font-bold flex items-center gap-1">
                                  <Milestone className="h-3 w-3 animate-pulse" />
                                  <span>TopGrand Qabul Komissiyasi A'zosi</span>
                                </p>
                                <p className="mt-1 font-light leading-relaxed whitespace-pre-line">{chat.question}</p>
                              </div>

                              {/* Student response side if exists */}
                              {chat.answer && (
                                <div className="rounded-2xl bg-cyan-400/10 border border-cyan-400/20 p-3 text-right max-w-lg ml-auto">
                                  <p className="font-bold text-white">Siz ({user.name})</p>
                                  <p className="mt-1 font-light leading-relaxed">{chat.answer}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Input if loading is not active and interview hasn't reached 6 turns */}
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="O'zbek tilida o'z javobingizni ravon kiritib yuboring..."
                            value={currentInterviewAnswer}
                            onChange={(e) => setCurrentInterviewAnswer(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-12 text-xs md:text-sm text-white placeholder-blue-350/40 outline-none focus:border-cyan-405 transition"
                          />
                          <button
                            type="submit"
                            disabled={loading || !currentInterviewAnswer}
                            className="absolute right-2 top-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 p-1.5 text-blue-950 transition"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedTool.key === 'chat' && (
                      <div className="space-y-4">
                        <div className="space-y-3.5 max-h-[300px] overflow-y-auto p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
                          {chatHistory.length === 0 && (
                            <p className="text-blue-200 text-center py-6 font-light">Mutaxassis maslahatchiga istalgan savolingizni yo'llang. Masalan: Italiya grantiga qay tartibda tekin hujjat topshiraman?</p>
                          )}
                          {chatHistory.map((bubble, i) => (
                            <div
                              key={i}
                              className={`p-3 rounded-2xl border ${
                                bubble.sender === 'user'
                                  ? 'bg-cyan-400/10 border-cyan-400/20 text-right max-w-lg ml-auto'
                                  : 'bg-blue-500/10 border-blue-500/20 text-left text-cyan-200 whitespace-pre-line'
                              }`}
                            >
                              <p className="font-bold">{bubble.sender === 'user' ? `Siz (${user.name})` : 'AI Konsalting Mutaxassisi'}</p>
                              <p className="mt-1 font-light leading-relaxed">{bubble.text}</p>
                            </div>
                          ))}
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="Savolingizni kiriting..."
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-12 text-xs md:text-sm text-white placeholder-blue-350/40 outline-none focus:border-cyan-405 transition"
                          />
                          <button
                            type="submit"
                            disabled={loading || !chatMessage}
                            className="absolute right-2 top-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 p-1.5 text-blue-950 transition"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedTool.key === 'cv_optimizer' && (
                      <div className="space-y-3">
                        <div className="flex gap-3 items-center">
                          <label className="text-xs font-semibold text-blue-200">Maqsadli o'qish mintaqangiz:</label>
                          <input
                            type="text"
                            placeholder="Masalan: AQSh, Germaniya yoki Koreya"
                            value={cvRegion}
                            onChange={(e) => setCvRegion(e.target.value)}
                            className="rounded-xl border border-white/10 bg-white/5 py-2 px-3 text-xs text-white"
                          />
                        </div>
                        <textarea
                          required
                          rows={6}
                          placeholder="Hozirgi mavjud rezyume yoki portfolio ma'lumotlaringizni kiriting (ta'lim, kurslar va ko'nikmalar)..."
                          value={cvText}
                          onChange={(e) => setCvText(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-xs md:text-sm text-white placeholder-blue-350/40 outline-none focus:border-cyan-400 transition"
                        />
                      </div>
                    )}

                    {selectedTool.key === 'lor_generator' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-3 sm:col-span-2">
                          <label className="block text-xs font-semibold text-blue-200 uppercase mb-1">Tavsiya beradigan shaxs unvoni (Masalan: Matematika o'qituvchisi)</label>
                          <input
                            type="text"
                            required
                            value={lorRecommender}
                            onChange={(e) => setLorRecommender(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-xs md:text-sm text-white"
                          />
                        </div>
                        <div className="space-y-3 sm:col-span-2">
                          <label className="block text-xs font-semibold text-blue-200 uppercase mb-1">Sizning asosiy akademik kuchli tomonlaringiz va qobiliyatlariz</label>
                          <textarea
                            required
                            rows={4}
                            placeholder="Masalan: Fizika olimpiadasi g'olibi, intizomli, liderlik qobiliyati kuchli..."
                            value={lorStrengths}
                            onChange={(e) => setLorStrengths(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-xs md:text-sm text-white"
                          />
                        </div>
                      </div>
                    )}

                    {selectedTool.key === 'motivation_generator' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-blue-200 uppercase mb-1">Maqsadli Oliyogoh</label>
                            <input
                              type="text"
                              required
                              placeholder="Masalan: Stanford University"
                              value={motUniv}
                              onChange={(e) => setMotUniv(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-blue-200 uppercase mb-1">Insho Ohangi</label>
                            <input
                              type="text"
                              required
                              value={motTone}
                              onChange={(e) => setMotTone(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-xs text-white"
                            />
                          </div>
                        </div>
                        <textarea
                          required
                          rows={4}
                          placeholder="Qiziqishlaringiz, asosiy yutuq va ishtiyoqingizni kiritgan holda insho asosi yarating..."
                          value={motSkills}
                          onChange={(e) => setMotSkills(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-xs md:text-sm text-white"
                        />
                      </div>
                    )}

                    {selectedTool.key === 'scholarship_matcher' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-blue-200 font-semibold uppercase">Yoshingiz:</label>
                          <input type="number" required value={scholarshipAge} onChange={(e) => setScholarshipAge(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs" />
                        </div>
                        <div>
                          <label className="text-xs text-blue-200 font-semibold uppercase">GPA balingiz (5 likda):</label>
                          <input type="text" required value={scholarshipGpa} onChange={(e) => setScholarshGPA(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs" />
                        </div>
                        <div>
                          <label className="text-xs text-blue-200 font-semibold uppercase">IELTS / SAT native ballari:</label>
                          <input type="text" required value={scholarshipScores} onChange={(e) => setScholarshipScores(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs" />
                        </div>
                        <div>
                          <label className="text-xs text-blue-200 font-semibold uppercase">Sohangiz (Major):</label>
                          <input type="text" required value={scholarshipMajor} onChange={(e) => setScholarshipMajor(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs" />
                        </div>
                      </div>
                    )}

                    {selectedTool.key === 'vocab_booster' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-blue-200 font-semibold">Qaysi akademiyada yoki mavzuda so'z kerak:</label>
                          <input type="text" value={vocabTopic} onChange={(e) => setVocabTopic(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs" />
                        </div>
                        <div>
                          <label className="text-xs text-blue-200 font-semibold">Hozirgi taxminiy darajangiz:</label>
                          <input type="text" value={vocabLevel} onChange={(e) => setVocabLevel(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs" />
                        </div>
                      </div>
                    )}

                    {selectedTool.key === 'student_budget' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-blue-200 font-semibold">Maqsadli Davlat:</label>
                          <input type="text" value={budgetCountry} onChange={(e) => setBudgetCountry(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs" />
                        </div>
                        <div>
                          <label className="text-xs text-blue-200 font-semibold">Yashash talabi (Lifestyle):</label>
                          <input type="text" value={budgetLifestyle} onChange={(e) => setBudgetLifestyle(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs" />
                        </div>
                      </div>
                    )}

                    {selectedTool.key === 'visa_sop' && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-blue-200 font-semibold">Maqsadli Viza Olmoqchi Bo'lgan Davlatingiz:</label>
                          <input type="text" value={sopCountry} onChange={(e) => setSopCountry(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs" />
                        </div>
                        <textarea required rows={5} placeholder="Statement of purpose yoki inshongizni bu yerga joylashtiring..." value={sopText} onChange={(e) => setSopText(e.target.value)} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs" />
                      </div>
                    )}

                    {selectedTool.key === 'course_matcher' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-blue-200 font-semibold">Eng sevimli fanlaringiz:</label>
                          <input type="text" value={courseFavorites} onChange={(e) => setCourseFavorites(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs" />
                        </div>
                        <div>
                          <label className="text-xs text-blue-200 font-semibold">Qiziqish va sevimli mashg'ulotlar:</label>
                          <input type="text" value={courseHobbies} onChange={(e) => setCourseHobbies(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs" />
                        </div>
                      </div>
                    )}

                    {selectedTool.key === 'profile_enhancer' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-blue-200 font-semibold">Hozirgi sinfingiz/kursingiz:</label>
                          <input type="text" value={enhancerGrade} onChange={(e) => setEnhancerGrade(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs" />
                        </div>
                        <div>
                          <label className="text-xs text-blue-200 font-semibold">Bajarilgan darsdan tashqari premium ishlar:</label>
                          <input type="text" value={enhancerHistory} onChange={(e) => setEnhancerHistory(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs" />
                        </div>
                      </div>
                    )}

                    {selectedTool.key === 'score_predictor' && (
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-blue-200 font-semibold">Mock Ballar (IELTS/SAT):</label>
                          <input type="text" value={predictorScores} onChange={(e) => setPredictorScores(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2 rounded-xl text-[11px]" />
                        </div>
                        <div>
                          <label className="text-xs text-blue-200 font-semibold">Maqsad (Target):</label>
                          <input type="text" value={predictorTarget} onChange={(e) => setPredictorTarget(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2 rounded-xl text-[11px]" />
                        </div>
                        <div>
                          <label className="text-xs text-blue-200 font-semibold">Imtihongacha vaqt:</label>
                          <input type="text" value={predictorTime} onChange={(e) => setPredictorTime(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2 rounded-xl text-[11px]" />
                        </div>
                      </div>
                    )}

                    {selectedTool.key === 'study_planner' && (
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-blue-200 font-semibold">Maqsadli Imtihon turi:</label>
                          <input type="text" value={plannerExam} onChange={(e) => setPlannerExam(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2 rounded-xl text-[11px]" />
                        </div>
                        <div>
                          <label className="text-xs text-blue-200 font-semibold">Kuniga soat (Hours):</label>
                          <input type="text" value={plannerHours} onChange={(e) => setPlannerHours(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2 rounded-xl text-[11px]" />
                        </div>
                        <div>
                          <label className="text-xs text-blue-200 font-semibold">Zaif tomonlaringiz:</label>
                          <input type="text" value={plannerAreas} onChange={(e) => setPlannerAreas(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2 rounded-xl text-[11px]" />
                        </div>
                      </div>
                    )}

                    {/* Submit action (hidden or customized for chat inputs) */}
                    {selectedTool.key !== 'chat' && selectedTool.key !== 'interview' && (
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:brightness-110 active:scale-[0.98] transition font-black text-white shadow-xl shadow-blue-500/20 cursor-pointer"
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
                      <p className="text-xs text-blue-600 font-extrabold text-center">Bizning professional model tizim bilan bog'lanmoqda, tahlil yakunlanmoqda...</p>
                    </div>
                  )}

                  {/* AI RESULTS CONTAINER */}
                  {result && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 rounded-3xl bg-[#f8fafc] border border-blue-150 text-xs md:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-semibold space-y-4 shadow-inner mt-4"
                      id="ai-results-panel"
                    >
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                        <Sparkles className="h-4.5 w-4.5 text-blue-600 animate-pulse" />
                        <span className="font-extrabold text-blue-800">TopGrand AI Tahlil Hisoboti</span>
                      </div>
                      <p className="whitespace-pre-wrap">{result}</p>
                    </motion.div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Minimal placeholder function for X representing close icon or generic delete
function X({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
