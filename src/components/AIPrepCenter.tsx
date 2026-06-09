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
import { getApiUrl } from '../lib/api';

interface AIPrepCenterProps {
  user: User;
  onOpenAuth: () => void;
  onOpenPremium: () => void;
  onUpdateUsage: (toolKey: string) => void;
  onToggleFullScreen?: (isOpen: boolean) => void;
  currentLang?: 'uz' | 'en' | 'ru';
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

export default function AIPrepCenter({ user, onOpenAuth, onOpenPremium, onUpdateUsage, onToggleFullScreen, currentLang = 'uz' }: AIPrepCenterProps) {
  // LANGUAGE LOCALIZATION AND COGNITIVE TRANSCRIPTION DICTIONARIES
  const l10n = {
    uz: {
      backToCatalog: "Katalogga qaytish",
      activeSession: "MULOQOT FAOL",
      tipTitle: "Tahlil yakunlandi!",
      tipDesc: "Navbatdagi savollaringizni muloqot oynasida bemalol bering.",
      restartBtn: "Muloqotni qayta boshlash",
      placeholderMsg: "Savolingiz yoki xabaringizni yozing...",
      yourInput: "Siz kiritgan ma'lumot",
      aiAdviser: "AI Maslahatchi",
      analyzing: "AI Tahlil qilmoqda...",
      btnAction: "AI Tahlilini olish ⚡",
      formAnalyzing: "Komissiya tahlil qilmoqda...",
      activeToolsCount: "30 ta Daxshatli AI Funksiya",
      limitText: "Limit"
    },
    en: {
      backToCatalog: "Back to Catalog",
      activeSession: "SESSION ACTIVE",
      tipTitle: "Analysis Complete!",
      tipDesc: "Feel free to ask any follow-up questions directly in the chat.",
      restartBtn: "Restart Conversation",
      placeholderMsg: "Write your question or message here...",
      yourInput: "Your Input",
      aiAdviser: "AI Advisor",
      analyzing: "AI Analyzing...",
      btnAction: "Get AI Analysis ⚡",
      formAnalyzing: "Faculty board examining info...",
      activeToolsCount: "30 Epic AI Tools",
      limitText: "Limit"
    },
    ru: {
      backToCatalog: "Назад к каталогу",
      activeSession: "ДИАЛОГ АКТИВЕН",
      tipTitle: "Анализ завершен!",
      tipDesc: "Вы можете свободно задавать следующие вопросы в чате.",
      restartBtn: "Начать диалог сначала",
      placeholderMsg: "Напишите ваш вопрос или сообщение...",
      yourInput: "Введенные данные",
      aiAdviser: "ИИ-Консультант",
      analyzing: "ИИ анализирует...",
      btnAction: "Получить ИИ-Анализ ⚡",
      formAnalyzing: "Приемная комиссия анализирует...",
      activeToolsCount: "30 Крутых ИИ-Модулей",
      limitText: "Лимит"
    }
  };

  const getToolTitle = (key: string, defaultTitle: string) => {
    if (currentLang === 'uz') return defaultTitle;
    const titles: Record<string, Record<'en' | 'ru', string>> = {
      university_vibe_matcher: { en: "University Vibe Matcher", ru: "Поиск атмосферы вуза" },
      admission_officer_persona: { en: "Admission Officer Persona", ru: "Имитация сотрудника приемной" },
      trend_predictor: { en: "Trend Predictor", ru: "Прогнозирование трендов" },
      acceptance_rate_hacker: { en: "Acceptance Rate Hacker", ru: "Центральноазиатский шанс" },
      hidden_major_finder: { en: "Hidden Major Finder", ru: "Поиск скрытых специальностей" },
      safety_reach_matrix: { en: "Safety vs Reach Matrix", ru: "Матрица шансов" },
      financial_aid_sniper: { en: "Financial Aid Sniper", ru: "Анализатор финансовой помощи" },
      waitlist_escape_plan: { en: "Waitlist Escape Plan", ru: "Выход из листа ожидания" },
      emotional_arc_analyzer: { en: "Emotional Arc Analyzer", ru: "Анализатор эмоций эссе" },
      hook_generator: { en: "Essay Hook Generator", ru: "Генератор цепляющих вступлений" },
      cultural_sensitivity: { en: "Western Cultural Sensitizer", ru: "Западный культурный сенсибилизатор" },
      why_us_architect: { en: "Why Us Essay Architect", ru: "Архитектор эссе 'Почему мы'" },
      narrative_threader: { en: "Narrative Threader", ru: "Связующий повествователь" },
      vocabulary_punch: { en: "Vocabulary Punch Editor", ru: "Редактор лексического арсенала" },
      cliche_detector: { en: "Cliché & Plagiarism Detector", ru: "Детектор клише и плагиата" },
      tone_shifter: { en: "Essay Tone Shift Editor", ru: "Редактор тона эссе" },
      blind_interviewer: { en: "Blind Admission Interviewer", ru: "Слепой приемный интервьюер" },
      stump_questioner: { en: "Stump Questioner Master", ru: "Мастер каверзных вопросов" },
      body_language_text: { en: "Textual Behavior & Tone", ru: "Текстовое поведение и тон" },
      scholarship_panel: { en: "Scholarship Panel Simulator", ru: "Симулятор грантовой комиссии" },
      thank_you_sniper: { en: "Thank You Note Sniper", ru: "Снайпер писем благодарности" },
      group_discussion_leader: { en: "Group Discussion Leader", ru: "Лидер групповой дискуссии" },
      job_market_matcher: { en: "Global Job Market Matcher", ru: "Анализатор рынка труда" },
      roi_calculator: { en: "Academic ROI Calculator", ru: "Калькулятор окупаемости вуза" },
      alumni_bio_scraper: { en: "Alumni Insights Roadmap", ru: "Инструкции по пути выпускников" },
      visa_policy_advisor: { en: "Visa & Post-Grad Advisor", ru: "Советник по визам и OPT" },
      networking_script: { en: "LinkedIn Sniper Scripts", ru: "LinkedIn Скрипты связи" },
      startup_potential: { en: "Startup Incubator Selector", ru: "Инкубатор стартапов вуза" },
      skill_bridge: { en: "Enterprise Skill Bridge", ru: "Мост профессиональных навыков" },
      mental_health_guardian: { en: "Mental Health Guardian", ru: "Страж ментального здоровья" },
    };
    return titles[key]?.[currentLang] || defaultTitle;
  };

  const getToolDescription = (key: string, defaultDesc: string) => {
    if (currentLang === 'uz') return defaultDesc;
    const descs: Record<string, Record<'en' | 'ru', string>> = {
      university_vibe_matcher: {
        en: "Analyzes matching university environments (conservative, liberal, party-oriented) based on your personality.",
        ru: "Анализирует наиболее подходящую атмосферу вуза (консервативную, либеральную, тусовочную) по вашему характеру."
      },
      admission_officer_persona: {
        en: "Acts as a strict admissions officer and directly details all the gaps and weaknesses in your application.",
        ru: "Имитирует строгого члена приемной комиссии и жестко указывает на все уязвимости вашей анкеты."
      },
      trend_predictor: {
        en: "Predicts paths with the highest scholarship chances based on the last 2 years of global academic trends.",
        ru: "Прогнозирует, на каких направлениях будет больше всего грантов на основе трендов последних двух лет."
      },
      acceptance_rate_hacker: {
        en: "Calculates the real admissions rates specifically for Central Asian students, not just the general average.",
        ru: "Рассчитывает реальные шансы на поступление именно для студентов из Центральной Азии."
      },
      hidden_major_finder: {
        en: "Recommends highly prospective secret/niche majors instead of hyper-competitive traditional branches.",
        ru: "Помогает найти скрытые перспективные специальности вместо высококонкурентных стандартных направлений."
      },
      safety_reach_matrix: {
        en: "Categorizes your target universities into 'Guaranteed', 'Possible', and 'Miracle Required' tiers.",
        ru: "Красиво делит выбранные вузы по категориям: 'Точно поступит', 'Есть шанс', 'Нужно чудо'."
      },
      financial_aid_sniper: {
        en: "Detects university financial reserves and estimates likelihood of full need-based grant awards this season.",
        ru: "Определяет финансовые резервы каждого университета и ваши шансы получить его гранты."
      },
      waitlist_escape_plan: {
        en: "Writes a captivating Love Letter (LOCI) to help you instantly escape the waitlist and secure admission.",
        ru: "Составляет мощное сопроводительное письмо (LOCI), чтобы помочь выйти из листа ожидания."
      },
      emotional_arc_analyzer: {
        en: "Analyzes essay flow, highlights boring sentences, and maps your essay's psychological emotional curve.",
        ru: "Оценивает эмоциональный накал, находит скучные моменты и моделирует карту эмпатии вашего эссе."
      },
      hook_generator: {
        en: "Re-creates your statement's introductory hook to immediately capture admission officers' attention like a magnet.",
        ru: "Превращает скучные первые предложения эссе в завораживающее вступление, от которого невозможно оторваться."
      },
      cultural_sensitivity: {
        en: "Analyzes Western cultural tone-checks, flags subtle offensive phrasing, and aligns logic with modern campus values.",
        ru: "Анализирует соответствие текста западной культуре и ценностям кампуса, убирая любые неуместные намеки."
      },
      why_us_architect: {
        en: "Links your specific profile to actual unique labs, clubs, and professors of the target campus for the perfect Why Us essay.",
        ru: "Связывает ваш профиль с реальными ресурсами, лабораториями и профессорами для идеального эссе 'Почему мы'."
      },
      narrative_threader: {
        en: "Transforms a simple personal struggle or memory into a highly coherent story linked directly to your career aims.",
        ru: "Превращает простую личную историю из вашей жизни в связную и трогательную нить мотивации."
      },
      vocabulary_punch: {
        en: "Upgrades basic daily verbs and terms in your drafts into scholarly, powerful vocabulary that impresses professors.",
        ru: "Повышает лексический уровень вашего письма, заменяя простые слова на сильный научный лексикон."
      },
      cliche_detector: {
        en: "Flags passive clichés 'Since my childhood...' and provides highly unique alternatives to stand out.",
        ru: "Выявляет все банальные шаблоны и заменяет их оригинальными, яркими идеями."
      },
      tone_shifter: {
        en: "Dramatically shifts your statement's tone to make it sound highly 'Leader-like', 'Scientific', or 'Humble'.",
        ru: "Быстро перестраивает стилистику мотивационного письма под лидерский, научный или скромный формат."
      },
      blind_interviewer: {
        en: "Simulates an intensive interview with an examiner who aggressively critiques unsupported claims or hesitation.",
        ru: "Интенсивный тренажер собеседования, жестко критикующий ваши аргументы и неуверенность."
      },
      stump_questioner: {
        en: "Teaches you tactical secrets on how to handle the most complex brain-teasers and tricky logic requests.",
        ru: "Учит вас тактическим секретам ответов на самые непредсказуемые и каверзные вопросы интервью."
      },
      body_language_text: {
        en: "Spots anxiety, self-doubt, or over-preparedness gaps simply by analyzing your written/spoken phrasing.",
        ru: "Выявляет скрытую тревогу, сомнения или заученность просто по характеру построения ваших фраз."
      },
      scholarship_panel: {
        en: "Simulates a panel of 3 admissions authorities (Strict Professor, Major Donor, Community Leader).",
        ru: "Симулирует комитет из 3 разных личностей (Академик, Спонсор, Лидер), давая разносторонние вопросы."
      },
      thank_you_sniper: {
        en: "Generates custom follow-up thank you emails referencing actual discussion points with zero clichés.",
        ru: "Создает уникальные, бесшаблонные благодарственные письма после интервью, цепляющие профессора."
      },
      group_discussion_leader: {
        en: "Advises on diplomatic hacks to lead group tasks, share ideas cleanly, and stand out in peer groups.",
        ru: "Показывает хитрые дипломатические приемы для лидерства в групповых созвонах и кейсах."
      },
      job_market_matcher: {
        en: "Correlates your target major to live corporate expectations from tech giants to match career readiness.",
        ru: "Анализирует реальный спрос технологических гигантов на специалистов вашей дисциплины."
      },
      roi_calculator: {
        en: "Calculates total tuition investments and estimates payback periods based on average global graduate salaries.",
        ru: "Сравнивает расходы на обучение и период окупаемости на основе рыночных зарплат."
      },
      alumni_bio_scraper: {
        en: "Maps a structured postgraduate growth journey from successful alumni files who took your specific degree.",
        ru: "Моделирует структурированную дорожную карту карьеры по успешным стопам выдающихся выпускников."
      },
      visa_policy_advisor: {
        en: "Updates on work visas, OPT paths, H1-B application policies, and latest immigration regulations.",
        ru: "Детализирует правила рабочей визы, периодов OPT и новых иммиграционных ограничений после вуза."
      },
      networking_script: {
        en: "Generates laser-focused messages to connect with alumni and professors for organic referral requests.",
        ru: "Пишет броские и лаконичные сообщения для связи с выпускниками на LinkedIn по поводу рекомендаций."
      },
      startup_potential: {
        en: "Identifies pitching scripts and strategies to submit your idea to university accelerators and incubator programs.",
        ru: "Определяет стратегии питчинга идеи для включения в университетские инкубаторы и акселераторы."
      },
      skill_bridge: {
        en: "Highlights essential technical certificates and hot in-demand tools that are omitted in universities.",
        ru: "Показывает редкие технические сертификаты и горячие навыки, о которых забывают в университетах."
      },
      mental_health_guardian: {
        en: "Provides tools to counter academic fatigue, stress, and imposter syndrome without dropping grades.",
        ru: "Рассказывает секреты борьбы с выгоранием, стрессового давления в общежитиях и синдрома самозванца."
      }
    };
    return descs[key]?.[currentLang] || defaultDesc;
  };

  const getFieldLabel = (id: string, defaultLabel: string) => {
    if (currentLang === 'uz') return defaultLabel;
    const translations: Record<string, Record<'en' | 'ru', string>> = {
      character_traits: {
        en: "Your character traits, learning style, and interests",
        ru: "Ваши черты характера, стиль обучения и интересы"
      },
      weaknesses: {
        en: "Any weaknesses in your profile that feel risky to you",
        ru: "Любые недостатки в вашем профиле, которые кажутся вам рискованными"
      },
      target_major: {
        en: "The main major/field you are interested in and want a scholarship for",
        ru: "Основная специальность/направление, которое вас интересует"
      },
      gpa: {
        en: "Your GPA scores and IELTS/SAT levels if any",
        ru: "Ваш средний балл (GPA) и уровень IELTS/SAT"
      },
      annual_income: {
        en: "Your average family annual income ($ USD)",
        ru: "Средний годовой доход вашей семьи ($ USD)"
      },
      essay_text: {
        en: "Your statement of purpose / motivation essay text",
        ru: "Текст вашего мотивационного эссе (SOP)"
      },
      cliche_sample: {
        en: "The current simple or cliché introductory sentences of your essay",
        ru: "Текущие простые или шаблонные первые предложения вашего эссе"
      },
      simple_hobbies: {
        en: "Personal life, memorable hobbies, or interesting youth activities",
        ru: "Личная жизнь, запоминающиеся хобби или интересные занятия"
      },
      school_activities: {
        en: "Dozens of academic and non-academic activities, research or simple startups",
        ru: "Академическая и внеучебная деятельность, исследования или стартапы"
      },
      target_uni: {
        en: "The name of the target university you want to query",
        ru: "Название целевого университета, который вы хотите запросить"
      },
      professor_name: {
         en: "The full name of the professor you want to contact",
         ru: "Полное имя профессора, к которому вы хотите обратиться"
      },
      professor_interests: {
         en: "Scientific topics and academic interests of the professor",
         ru: "Научные темы и академические интересы профессора"
      },
      student_interest: {
         en: "Your specific academic interest matching the professor",
         ru: "Ваш конкретный академический интерес, соответствующий профессору"
      },
      simple_lor: {
         en: "The current draft of your simple recommendation letter (LOR)",
         ru: "Текущий черновик вашего рекомендательного письма (LOR)"
      },
      rejection_letter: {
         en: "The formal text of the rejection letter you received",
         ru: "Официальный текст полученного письма об отказе"
      }
    };
    return translations[id]?.[currentLang] || defaultLabel;
  };

  const getFieldPlaceholder = (id: string, defaultPlaceholder: string) => {
    if (currentLang === 'uz') return defaultPlaceholder;
    const placeholders: Record<string, Record<'en' | 'ru', string>> = {
      character_traits: {
        en: "E.g., Initiative taker, organized, loves teamwork, logical thinker...",
        ru: "Например: Инициативный, организованный, люблю работать в команде..."
      },
      weaknesses: {
        en: "E.g., IELTS 6.5, low GPA, or lack of extracurricular activities...",
        ru: "Например: IELTS 6.5, низкий GPA или отсутствие внеучебной активности..."
      },
      target_major: {
        en: "E.g., Computer Science, Renewable Energy, Business Administration...",
        ru: "Например: Компьютерные науки, возобновляемая энергия, бизнес..."
      },
      gpa: {
        en: "E.g., GPA: 4.8/5.0, IELTS 7.0, SAT 1400...",
        ru: "Например: GPA: 4.8, IELTS 7.0, SAT 1400..."
      },
      annual_income: {
        en: "E.g., $5,000",
        ru: "Например: 5,000$"
      },
      essay_text: {
        en: "Paste or type your essay draft here...",
        ru: "Вставьте или введите черновик вашего эссе сюда..."
      },
      cliche_sample: {
        en: "E.g., Since my childhood, I am deeply passionate about economics...",
        ru: "Например: С детства я глубоко увлечен экономикой..."
      },
      simple_hobbies: {
        en: "E.g., Provided free math classes, coded bots, planted trees in school garden...",
        ru: "Например: Проводил бесплатные уроки математики, писал ботов..."
      },
      target_uni: {
        en: "E.g., NYU Computer Science, Bocconi Economics...",
        ru: "Например: NYU Computer Science, Bocconi Economics..."
      },
      professor_name: {
         en: "E.g., Dr. John Harrison",
         ru: "Например: Доктор Джон Харрисон"
      },
      simple_lor: {
         en: "Paste draft of your LOR here...",
         ru: "Вставьте черновик рекомендации..."
      },
      rejection_letter: {
         en: "E.g., We regret to inform you...",
         ru: "Например: К сожалению, мы вынуждены сообщить..."
      }
    };
    return placeholders[id]?.[currentLang] || defaultPlaceholder;
  };

  const currentL10n = l10n[currentLang] || l10n.uz;

  const [selectedTool, setSelectedTool] = useState<ToolConfig | null>(null);

  useEffect(() => {
    onToggleFullScreen?.(!!selectedTool);
    return () => {
      onToggleFullScreen?.(false);
    };
  }, [selectedTool, onToggleFullScreen]);

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
    { key: 'all', label: currentLang === 'en' ? "All Modules ⚡" : currentLang === 'ru' ? "Все Модули ⚡" : "Barcha Modullar ⚡" },
    { key: 'strategist', label: currentLang === 'en' ? "THE STRATEGIST 🧭" : currentLang === 'ru' ? "СТРАТЕГ 🧭" : "THE STRATEGIST 🧭" },
    { key: 'content_lab', label: currentLang === 'en' ? "THE CONTENT LAB ✍️" : currentLang === 'ru' ? "ЛАБОРАТОРИЯ ЭССЕ ✍️" : "THE CONTENT LAB ✍️" },
    { key: 'simulator', label: currentLang === 'en' ? "THE SIMULATOR 🗣️" : currentLang === 'ru' ? "ТРЕНАЖЕР СОБЕСЕДОВАНИЯ 🗣️" : "THE SIMULATOR 🗣️" },
    { key: 'future_path', label: currentLang === 'en' ? "THE FUTURE PATH 🚀" : currentLang === 'ru' ? "КАРЬЕРА И ВИЗА 🚀" : "THE FUTURE PATH 🚀" }
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
    return 3;
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
    setChatHistory([]); // Reset conversation logs for all tools

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
    const isInteractive = isInteractiveChat(selectedTool.key);
    const isChatMode = isInteractive || chatHistory.length > 0;

    const inputDataMap: Record<string, string> = {};
    const configuredFields = toolFields[selectedTool.key] || [];
    configuredFields.forEach(f => {
      inputDataMap[f.id] = formValues[f.id] || '';
    });

    let primaryUserMsgText = '';
    if (!isInteractive && chatHistory.length === 0) {
      // First submission of forms - convert to initial chat log
      const promptParts = configuredFields.map(f => `• **${f.label}**: ${formValues[f.id] || "(Kiritilmadi)"}`);
      primaryUserMsgText = `Tahlil uchun kiritilgan boshlang'ich ma'lumotlar:\n\n${promptParts.join("\n")}`;
    }

    if (isChatMode) {
      inputDataMap['userMessage'] = chatMessage;
      inputDataMap['history'] = JSON.stringify(chatHistory.slice(-6));
    }

    try {
      if (isInteractive) {
        setChatHistory(prev => [...prev, { sender: 'user', text: chatMessage }]);
        setChatMessage('');
      } else if (chatHistory.length === 0) {
        setChatHistory([{ sender: 'user', text: primaryUserMsgText }]);
      } else {
        setChatHistory(prev => [...prev, { sender: 'user', text: chatMessage }]);
        setChatMessage('');
      }

      const response = await fetch(getApiUrl('/api/ai/generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: selectedTool.key,
          inputData: isChatMode ? inputDataMap : { ...inputDataMap, userMessage: primaryUserMsgText },
          userContext: {
            name: user.name,
            surname: user.surname,
            isPremium: user.isPremium
          }
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        if (isInteractive) {
          setChatHistory(prev => [...prev, { sender: 'ai', text: data.text }]);
        } else if (chatHistory.length === 0) {
          setChatHistory([
            { sender: 'user', text: primaryUserMsgText },
            { sender: 'ai', text: data.text }
          ]);
        } else {
          setChatHistory(prev => [...prev, { sender: 'ai', text: data.text }]);
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
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-12 text-slate-900 animate-fade-in" id="ai-center-root">
      
      <AnimatePresence mode="wait">
        {!selectedTool ? (
          /* TOOL DIRECTORY GRID WITH CLEAN DETAILED HIGH CONTRAST CARDS */
          <motion.div 
            key="catalog"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-12"
          >
            {/* HERO PANELS HEADER */}
            <div className="text-center max-w-3xl mx-auto space-y-5">
              <span className="inline-flex items-center gap-2 bg-blue-105 border border-blue-200/60 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest text-blue-800 uppercase font-mono shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                <span>TOPGRAND COGNITIVE SUITE v3.0</span>
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                {currentLang === 'uz' ? (
                  <>Chet elga <br /><span className="bg-gradient-to-r from-blue-700 via-indigo-900 to-sky-850 bg-clip-text text-transparent">Daxshatli 30 ta AI Funksiya</span></>
                ) : currentLang === 'ru' ? (
                  <>Обучение за рубежом <br /><span className="bg-gradient-to-r from-blue-700 via-indigo-900 to-sky-850 bg-clip-text text-transparent">30 крутых ИИ-функций</span></>
                ) : (
                  <>Study Abroad <br /><span className="bg-gradient-to-r from-blue-700 via-indigo-900 to-sky-850 bg-clip-text text-transparent">30 Epic AI Superpowers</span></>
                )}
              </h2>
              <p className="text-xs md:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed font-bold">
                {currentLang === 'uz' ? (
                  "Konsalting firmalarsiz, sun'iy intellekt orqali profilingizni xavfsiz mukammallikka ko'taring va haqiqiy dunyo grantlarini qo'lga kiriting!"
                ) : currentLang === 'ru' ? (
                  "Откажитесь от дорогостоящих агентств. Используйте 30 когнитивных моделей ИИ, чтобы идеально подготовить документы и получить гранты самостоятельно!"
                ) : (
                  "Ditch expensive agencies. Use our 30 cognitive model layers to safely polish your profile and secure real global scholarships!"
                )}
              </p>

              {/* METRIC BADGES */}
              <div className="flex flex-wrap justify-center items-center gap-3 pt-3 text-[10px] font-mono font-bold">
                <div className="bg-white border border-blue-200 rounded-xl px-4 py-2 flex items-center gap-2 shadow-xs text-blue-900 font-extrabold">
                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                  <span>INTELLIGENCE:</span>
                  <span className="font-extrabold text-blue-900">ACTIVE (GEMINI 3.5)</span>
                </div>

                <div className="bg-white border border-blue-200 rounded-xl px-4 py-2 flex items-center gap-2 shadow-xs text-slate-800 font-extrabold">
                  <Clock className="h-3.5 w-3.5 text-blue-600 stroke-[2.5px]" />
                  <span>{currentLang === 'uz' ? 'SINOV RESETGACHA:' : currentLang === 'ru' ? 'СБРОС ЛИМИТОВ ЧЕРЕЗ:' : 'LIMIT RESET IN:'}</span>
                  <span className="text-amber-800 font-extrabold">{countdownText}</span>
                </div>

                <button 
                  onClick={clearUsageStats}
                  title="Limits reset"
                  className="p-2 bg-white border border-blue-200 hover:border-red-500 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-xl transition cursor-pointer shadow-xs"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Category Filter Tabs with clean contrast */}
            <div className="flex flex-wrap justify-center gap-2 bg-white border border-blue-150 p-2 rounded-[1.75rem] max-w-2xl mx-auto shadow-sm">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2.5 rounded-2xl text-[11px] font-extrabold tracking-wider transition-all duration-200 cursor-pointer border uppercase ${
                    activeCategory === cat.key
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-transparent text-slate-600 border-transparent hover:text-blue-900 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid display cards - Pure High Contrast White Cards */}
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
                    className="relative group rounded-[2rem] border border-blue-100 bg-white p-6 flex flex-col justify-between shadow-md shadow-blue-500/[0.02] hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
                    id={`tool-card-${tool.key}`}
                  >
                    <div>
                      {/* Popular & category badges */}
                      <div className="flex justify-between items-center mb-5">
                        <span className="text-[9px] uppercase font-black tracking-widest text-blue-800 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                          {tool.category === 'strategist' && '🧭 THE STRATEGIST'}
                          {tool.category === 'content_lab' && '✍️ THE CONTENT LAB'}
                          {tool.category === 'simulator' && '🗣️ THE SIMULATOR'}
                          {tool.category === 'future_path' && '🚀 THE FUTURE PATH'}
                        </span>
                        {tool.popular && (
                          <span className="flex items-center gap-1 text-[8px] font-black tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full uppercase animate-pulse">
                            <Sparkles className="h-2.5 w-2.5 text-amber-500" />
                            {currentLang === 'uz' ? 'Mashhur' : currentLang === 'ru' ? 'Популярно' : 'Popular'}
                          </span>
                        )}
                      </div>

                      {/* Icon with Title */}
                      <div className="flex items-start gap-4">
                        <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${tool.color} text-white shadow-lg shrink-0`}>
                          <IconComp className="h-5.5 w-5.5 stroke-[2.5px]" />
                        </div>
                        <div>
                          <h3 className="font-black text-blue-950 leading-snug group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                            {getToolTitle(tool.key, tool.title)}
                          </h3>
                          <p className="text-xs text-slate-705 font-medium mt-2 leading-relaxed">
                            {getToolDescription(tool.key, tool.description)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer bar indicators */}
                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                      <div className="text-[10px] font-mono">
                        {user.isPremium ? (
                          <span className="text-blue-600 flex items-center gap-1.5 font-bold">
                            <Gem className="h-3.5 w-3.5 text-blue-500" /> {currentLang === 'uz' ? 'PRO REJA (ONLINE)' : currentLang === 'ru' ? 'PRO ТАРИФ (ОНЛАЙН)' : 'PRO PLAN (ONLINE)'}
                          </span>
                        ) : (
                          <span className={`text-[10px] font-black ${isLimitLocked ? 'text-red-600' : 'text-slate-600'}`}>
                            {currentLang === 'uz' ? 'Bepul limit:' : currentLang === 'ru' ? 'Бесплатный лимит:' : 'Free limit:'} {limitRemaining} / {limitMax}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleSelectTool(tool)}
                        className={`px-4 py-2 rounded-xl text-[10px] uppercase font-black tracking-wider flex items-center gap-1.5 cursor-pointer border transition-all ${
                          isLimitLocked && !user.isPremium
                            ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                            : 'bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-800'
                        }`}
                        id={`btn-select-tool-${tool.key}`}
                      >
                        <span>{currentLang === 'uz' ? 'Tekshirish' : currentLang === 'ru' ? 'Открыть' : 'Verify'}</span>
                        <ArrowRight className="h-3 w-3 stroke-[2.5px]" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* SINGLE DETAILED WORKSPACE VIEW (INLINE COMPACT SECURE SUITE IN LIGHT BLUE & WHITE WITH COMPACT MOBIL CONSOLE) */
          <motion.div
            key="workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full bg-sky-50/70 border border-sky-200/60 rounded-[1.75rem] p-4 sm:p-6 text-slate-900 flex flex-col space-y-4 shadow-sm"
            id="detailed-workspace"
          >
            {/* COMPACT TOP NAVIGATION BAR - DESIGNED FOR 1-TAP ACTION ON MOBILE */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-sky-100" id="workspace-back-header">
              <button
                onClick={() => setSelectedTool(null)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-sky-200 hover:bg-sky-50 text-sky-850 font-extrabold text-xs transition cursor-pointer active:scale-98 shadow-xs"
                id="btn-back-to-catalog"
              >
                <ArrowLeft className="h-4 w-4 text-sky-600 stroke-[2.5px]" />
                <span>{currentL10n.backToCatalog}</span>
              </button>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1 bg-white border border-sky-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 shadow-3xs">
                  {getToolTitle(selectedTool.key, selectedTool.title)}
                </span>
                {user.isPremium ? (
                  <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-xl text-xs font-extrabold uppercase">
                    <Gem className="h-3.5 w-3.5 text-amber-500 shrink-0" /> PRO
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-white border border-sky-200 text-sky-900 px-2.5 py-1 rounded-xl text-xs font-bold uppercase font-mono">
                    {currentLang === 'uz' ? 'Limit:' : currentLang === 'ru' ? 'Лимит:' : 'Limit:'} {limits[selectedTool.key]?.remaining ?? 3} / 3
                  </span>
                )}
              </div>
            </div>

            {/* RESPONSIVE LIGHT LAYOUT - INTEGRATED TO THE SCROLL FLOW WITHOUT ANY FIXED VIEWPORT JUMPS */}
            <div className="w-full flex flex-col text-slate-900 bg-white border border-sky-100 rounded-2xl p-4 sm:p-5 shadow-inner" id="detailed-workspace-redesign">
              
              {chatHistory.length === 0 ? (
                // INTRO & FORM ENTRY LAYOUT - Sleek, Thin, Centered
                <div className="w-full py-4 flex items-center justify-center" id="intro-entry-stage">
                  <div className="w-full max-w-xl space-y-5 text-center">
                    
                    {/* Tool Icon & Description */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`p-3 rounded-xl bg-gradient-to-tr ${selectedTool.color} text-white shadow-md`}>
                        {(() => {
                          const IconComp = selectedTool.icon;
                          return <IconComp className="h-6 w-6 stroke-[2px]" />;
                        })()}
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold text-sky-700 uppercase tracking-wider bg-sky-150 border border-sky-200 px-2.5 py-0.5 rounded-full">{typeof selectedTool.category === 'string' ? selectedTool.category.replace(/_/g, " ").toUpperCase() : ""}</span>
                        <h3 className="text-base font-black text-slate-900 pt-1 leading-tight">{getToolTitle(selectedTool.key, selectedTool.title)}</h3>
                        <p className="text-xs text-slate-605 max-w-sm mx-auto leading-normal">{getToolDescription(selectedTool.key, selectedTool.description)}</p>
                      </div>
                    </div>

                    {/* Highly Compounded Input Forms with Thinner Inputs and Controls */}
                    <form onSubmit={executeAIRequest} className="space-y-4 text-left max-w-md mx-auto">
                      {toolFields[selectedTool.key]?.map((field) => (
                        <div key={field.id} className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                            {getFieldLabel(field.id, field.label)}
                          </label>
                          {field.type === 'textarea' ? (
                            <textarea
                              rows={3}
                              value={formValues[field.id] || ''}
                              onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                              className="w-full rounded-xl border border-sky-200 bg-white py-2 px-3 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-550/20 transition-all shadow-inner"
                              placeholder={getFieldPlaceholder(field.id, field.placeholder)}
                            ></textarea>
                          ) : (
                            <input
                              type="text"
                              value={formValues[field.id] || ''}
                              onChange={(e) => setFormValues({ ...formValues, [field.id]: e.target.value })}
                              className="w-full rounded-xl border border-sky-200 bg-white py-2 px-3 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-550/20 transition-all shadow-inner"
                              placeholder={getFieldPlaceholder(field.id, field.placeholder)}
                            />
                          )}
                        </div>
                      ))}

                      {/* Launch Button - Thin, Elegant, High Contrast */}
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2.5 rounded-xl font-extrabold text-xs text-white uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                          loading 
                            ? 'bg-slate-350 border border-slate-300 text-slate-500 cursor-not-allowed opacity-75' 
                            : 'bg-sky-600 hover:bg-sky-700 active:scale-[0.98]'
                        }`}
                        id="btn-execute-static"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-1.5">
                            <RefreshCw className="animate-spin h-3.5 w-3.5 text-white" />
                            {currentL10n.formAnalyzing}
                          </span>
                        ) : (
                          currentL10n.btnAction
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                // MULTI-SCREEN INTERACTIVE LIGHT DIALOGUE - HIGHER DENSITY FOR PHONE VIEW
                <div className="w-full flex flex-col lg:flex-row gap-4 h-full" id="interactive-conversation-stage">
                  
                  {/* Floating Action Sidebar - Now Extremely Sleek and Compact */}
                  <div className="w-full lg:w-[220px] bg-sky-50/50 border border-sky-100 p-3.5 rounded-xl flex flex-col gap-3 shrink-0 text-left">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-tr ${selectedTool.color} text-white`}>
                          {(() => {
                            const IconComp = selectedTool.icon;
                            return <IconComp className="h-4.5 w-4.5 stroke-[2px]" />;
                          })()}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900">{getToolTitle(selectedTool.key, selectedTool.title)}</h4>
                          <span className="text-[8px] font-mono text-emerald-700 font-extrabold">{currentL10n.activeSession}</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white border border-sky-100 rounded-xl text-[10px] text-slate-800 leading-relaxed font-semibold">
                        💡 **{currentL10n.tipTitle}** {currentL10n.tipDesc}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setChatHistory([]);
                        setResult('');
                      }}
                      className="w-full py-2 rounded-xl border border-sky-200 bg-white hover:bg-sky-50 text-sky-850 font-extrabold text-[10px] transition cursor-pointer text-center active:scale-[0.98]"
                    >
                      {currentL10n.restartBtn}
                    </button>
                  </div>

                  {/* Message viewport and lightweight messaging control on the right */}
                  <div className="flex-1 flex flex-col min-h-[380px] justify-between">
                    
                    {/* Compact scrolling area for message history */}
                    <div className="max-h-[350px] overflow-y-auto p-2 space-y-3.5 text-left border-b border-sky-100 pb-4 scrollbar-thin">
                      {chatHistory.map((msg, i) => (
                        <div 
                          key={i} 
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                        >
                          <div 
                            className={`max-w-[90%] sm:max-w-lg rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                              msg.sender === 'user' 
                                ? 'bg-sky-600 border border-sky-550 text-white font-extrabold ml-auto shadow-xs' 
                                : 'bg-slate-50 border border-sky-150 text-slate-950 mr-auto shadow-3xs'
                            }`}
                          >
                            <div className={`text-[8px] uppercase tracking-wider font-mono font-bold mb-1 ${
                              msg.sender === 'user' ? 'text-sky-100' : 'text-sky-700'
                            }`}>
                              {msg.sender === 'user' ? currentL10n.yourInput : currentL10n.aiAdviser}
                            </div>
                            <div className="prose max-w-none text-xs leading-normal break-words whitespace-pre-line text-slate-900">
                              {msg.text}
                            </div>
                          </div>
                        </div>
                      ))}

                      {loading && (
                        <div className="flex justify-start animate-pulse">
                          <span className="px-3.5 py-2.5 bg-slate-50 border border-sky-100 text-sky-700 rounded-2xl text-[11px] font-bold font-mono tracking-wider flex items-center gap-1.5 shadow-2xs">
                            <RefreshCw className="animate-spin h-3.5 w-3.5 text-sky-500" />
                            {currentL10n.analyzing}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* COMPACT STYLISH SEND INPUT BOX FOR SECURE COMPILATION IN SINGLE TOUCH */}
                    <div className="pt-3">
                      <form onSubmit={executeAIRequest} className="flex gap-1.5 w-full items-center">
                        <input
                          type="text"
                          value={chatMessage}
                          disabled={loading}
                          onChange={(e) => setChatMessage(e.target.value)}
                          className="flex-1 rounded-xl bg-white border border-sky-200 py-2 px-3.5 text-xs font-semibold text-slate-950 placeholder-slate-450 outline-none focus:border-sky-550 transition-all shadow-inner"
                          placeholder={currentL10n.placeholderMsg}
                        />
                        <button
                          type="submit"
                          disabled={loading || !chatMessage.trim()}
                          className="p-2 ml-[1px] h-9 w-9 shrink-0 rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-xs active:scale-95 transition flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Send className="h-4.5 w-4.5" />
                        </button>
                      </form>
                    </div>

                  </div>

                </div>
              )}
              
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
