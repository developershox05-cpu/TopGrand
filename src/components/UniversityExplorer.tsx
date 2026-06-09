import React, { useState } from 'react';
import { Search, MapPin, Calendar, DollarSign, Globe, FileText, CheckCircle, Flame, Star, Sparkles, Send, GraduationCap, ArrowUpRight, ArrowRight, ArrowLeft } from 'lucide-react';
import { University, User } from '../types';
import { universitiesData } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { getApiUrl } from '../lib/api';

interface UniversityExplorerProps {
  user: User;
  onOpenPremium: () => void;
  onToggleFullScreen?: (isOpen: boolean) => void;
  currentLang?: 'uz' | 'en' | 'ru';
}

export default function UniversityExplorer({ user, onOpenPremium, onToggleFullScreen, currentLang = 'uz' }: UniversityExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('barchasi');
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    onToggleFullScreen?.(!!selectedUni);
    return () => {
      onToggleFullScreen?.(false);
    };
  }, [selectedUni, onToggleFullScreen]);

  const [activeSubTab, setActiveSubTab] = useState<'katalog' | 'qaynoq' | 'favorite'>('katalog');
  const [modalSubTab, setModalSubTab] = useState<'info' | 'steps' | 'chat'>('info');
  const [uniChatInput, setUniChatInput] = useState('');
  const [uniChatHistory, setUniChatHistory] = useState<Record<string, Array<{sender: 'user' | 'ai', text: string}>>>({});
  const [uniChatLoading, setUniChatLoading] = useState(false);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('favorite_unis');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [uniQuestionsCount, setUniQuestionsCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('uni_chat_count');
      const storedDate = localStorage.getItem('uni_chat_date');
      const today = new Date();
      if (storedDate) {
        const lastDate = new Date(storedDate);
        if (lastDate.toDateString() !== today.toDateString()) {
          localStorage.setItem('uni_chat_count', '0');
          localStorage.setItem('uni_chat_date', today.toISOString());
          return 0;
        }
      } else {
        localStorage.setItem('uni_chat_date', today.toISOString());
      }
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const incrementUniChatCount = () => {
    const nextCount = uniQuestionsCount + 1;
    setUniQuestionsCount(nextCount);
    localStorage.setItem('uni_chat_count', String(nextCount));
    localStorage.setItem('uni_chat_date', new Date().toISOString());
  };

  const toggleFavorite = (uniId: string) => {
    const updated = favorites.includes(uniId)
      ? favorites.filter(id => id !== uniId)
      : [...favorites, uniId];
    setFavorites(updated);
    localStorage.setItem('favorite_unis', JSON.stringify(updated));
  };

  const handleSelectUni = (uni: University | null) => {
    setSelectedUni(uni);
    setModalSubTab('info');
    setErrorMessage(null);
  };

  // Localization Dictionary
  const langText = {
    uz: {
      allCountries: "Barcha Davlatlar",
      ozb: "O'zbekiston (UZB)",
      aqsh: "AQSh",
      uk: "UK (Britaniya)",
      ger: "Germaniya",
      kan: "Kanada",
      kor: "Koreya",
      yap: "Yaponiya",
      tur: "Turkiya",
      ita: "Italiya",
      sin: "Singapur",
      shv: "Shveytsariya",
      fra: "Fransiya",
      xit: "Xitoy",
      tabKatalog: "Universitetlar Katalogi",
      tabQaynoq: "Qaynoq Takliflar",
      tabFavorite: "Saralangan Oliygohlar",
      searchPlaceholder: "Universitet nomi, shahar yoki kalit so'z bo'yicha qidirish...",
      helperBadge: "Siz hozirda bevosita topshira oladigan eng yirik va oliy global universitetlar hisobotini ko'rib turibsiz.",
      tgTitle: "Bizni Telegram kanalda kuzating va so'nggi yangiliklardan habardor bo'ling!",
      tgDesc: "@Topgrands telegram kanaliga a'zo bo'lib eng so'nggi grant va viza takliflarini qo'lga kiriting.",
      tgBtn: "Qo'shilish @Topgrands",
      detailsBtn: "Batafsil ma'lumot",
      backBtn: "Orqaga Qaytish",
      subTabInfo: "Oliygoh haqida",
      subTabSteps: "0-dan Qabul Yo'li 🧭",
      subTabChat: "AI Maslahatchi",
      infoTitle: "Batafsil ma'lumotlar va statistikalar",
      feeLabel: "Yillik Kontrakt va Grantlar",
      deadlineLabel: "Ariza topshirish oxirgi muddatlari (Deadlines)",
      docsLabel: "Qabul komissiyasiga talab qilinadigan hujjatlar:",
      guideTitle: "da O'qishga Kirishning 0-dan Batafsil Yo'riqnomasi 🧭",
      guideSub: "Ushbu qavatda aynan oliygoh joylashgan mamlakatning rasмий va real o'qish qoidalari ketma-ketlikda tushuntiriladi.",
      warningNote: "⚠️ **Eslatma**: Ushbu yo'llanmalar TopGrand akademik kengashi tomonidan so'nggi qabul hisobotlaridan mustaqil yig'ilgan real shablonlar hisoblanadi. Har bir hujjat va esse xatlarini topshirishdan oldin rasmiy veb-saytdan tekshirish tavsiya etiladi.",
      chatTitle: "Rasmiy AI Vakili",
      limitRemaining: "Limit remaining: {count} / 5",
      chatPlaceholder: "Universitet haqida savol bering (masalan: GPA qancha bo'lishi kerak?)...",
      chatSend: "Yuborish",
      warningLimitMsg: "Siz bugungi 5 ta bepul savol limitidan foydalandingiz! Pro versiyani sotib olish orqali cheksiz savollar berishingiz mumkin.",
      errorLoad: "Ulanishda xatolik yuz berdi.",
      contactConsultant: "Biz bilan Hamkorlik Taklifini Ko'rish",
      favoritesEmpty: "Hozircha biror oliygoh saralanganlarga qo'shilmagan."
    },
    en: {
      allCountries: "All Countries",
      ozb: "Uzbekistan",
      aqsh: "USA",
      uk: "United Kingdom",
      ger: "Germany",
      kan: "Canada",
      kor: "South Korea",
      yap: "Japan",
      tur: "Turkey",
      ita: "Italy",
      sin: "Singapore",
      shv: "Switzerland",
      fra: "France",
      xit: "China",
      tabKatalog: "Universities Catalog",
      tabQaynoq: "Hot Offers",
      tabFavorite: "Saved Universities",
      searchPlaceholder: "Search by university name, city or keyword...",
      helperBadge: "You are browsing the premium catalog of top global academic institutions and requirements.",
      tgTitle: "Follow our official Telegram and stay updated instantly on new scholarships!",
      tgDesc: "Join @Topgrands community and trace the latest admission checklists and visa hints.",
      tgBtn: "Join @Topgrands",
      detailsBtn: "View Details",
      backBtn: "Back to Catalog",
      subTabInfo: "About University",
      subTabSteps: "0-to-Hero Admission Guide 🧭",
      subTabChat: "AI Academic Advisor",
      infoTitle: "Comprehensive University Analytics & Metrics",
      feeLabel: "Annual Tuition Cost & Funding Pools",
      deadlineLabel: "Application Deadline Milestones (Deadlines)",
      docsLabel: "Required application credentials and checklists:",
      guideTitle: " Admission Guidelines & Milestones 🧭",
      guideSub: "Step-by-step roadmap tailored specifically for domestic regulations and admissions policies of the country.",
      warningNote: "⚠️ **Disclaimer**: These guidelines are compiled by TopGrand scientific board based on the latest admission trends. Please always verify specific dates and terms on the university official portal.",
      chatTitle: "Official AI Counselor",
      limitRemaining: "Remaining queries: {count} / 5",
      chatPlaceholder: "Ask anything about classes (e.g. Can I get a full waiver with 6.5 IELTS?)...",
      chatSend: "Submit",
      warningLimitMsg: "You have used up all 5 free daily queries. Complete premium upgrade to enjoy unconstrained access!",
      errorLoad: "A connection timeout or error occurred.",
      contactConsultant: "View Collaboration Benefits",
      favoritesEmpty: "No universities saved to your favorites yet."
    },
    ru: {
      allCountries: "Все страны",
      ozb: "Узбекистан",
      aqsh: "США",
      uk: "Великобритания",
      ger: "Германия",
      kan: "Канада",
      kor: "Южная Корея",
      yap: "Япония",
      tur: "Турция",
      ita: "Италия",
      sin: "Сингапур",
      shv: "Швейцария",
      fra: "Франция",
      xit: "Китай",
      tabKatalog: "Каталог Вузов",
      tabQaynoq: "Горячие Предложения",
      tabFavorite: "Избранные Вузы",
      searchPlaceholder: "Поиск по названию вуза, городу или ключевым словам...",
      helperBadge: "Вы просматриваете крупнейшую базу критериев и условий прямого поступления в международные вузы.",
      tgTitle: "Следите за нами в Telegram и будьте в курсе всех горячих грантов!",
      tgDesc: "Присоединяйтесь к сообществу @Topgrands и забирайте эксклюзивные учебники бесплатно.",
      tgBtn: "Вступить в @Topgrands",
      detailsBtn: "Подробнее",
      backBtn: "Вернуться назад",
      subTabInfo: "Об университете",
      subTabSteps: "Путь поступления с нуля 🧭",
      subTabChat: "ИИ-Консультант",
      infoTitle: "Подробные сведения и аналитические данные",
      feeLabel: "Годовое обучение и стипендиальные квоты",
      deadlineLabel: "Сроки окончания приема документов (Deadlines)",
      docsLabel: "Документы, запрашиваемые приемной комиссией:",
      guideTitle: " - пошаговое руководство по зачислению с нуля 🧭",
      guideSub: "Здесь последовательно описана официальная процедура поступления в выбранную страну.",
      warningNote: "⚠️ **Примечание**: Эти шаги составлены академическим советом TopGrand по последним отчетам. Рекомендуем дополнительно свериться с сайтом вуза.",
      chatTitle: "Официальный ИИ-Ассистент",
      limitRemaining: "Осталось запросов: {count} / 5",
      chatPlaceholder: "Спросите о поступлении (например: Нужен ли SAT для 100% гранта?)...",
      chatSend: "Отправить",
      warningLimitMsg: "Вы исчерпали лимит из 5 бесплатных вопросов на сегодня. Обновитесь до Premium для безлимитной связи!",
      errorLoad: "Произошла ошибка при отправке запроса.",
      contactConsultant: "Посмотреть предложение о сотрудничестве",
      favoritesEmpty: "Вы еще не сохранили ни одного учебного заведения."
    }
  };

  const text = langText[currentLang] || langText['uz'];

  // Country translations helper
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
    { value: 'barchasi', label: text.allCountries },
    { value: "O'zbekiston", label: text.ozb },
    { value: 'AQSh', label: text.aqsh },
    { value: 'Buyuk Britaniya', label: text.uk },
    { value: 'Germaniya', label: text.ger },
    { value: 'Kanada', label: text.kan },
    { value: 'Janubiy Koreya', label: text.kor },
    { value: 'Yaponiya', label: text.yap },
    { value: 'Turkiya', label: text.tur },
    { value: 'Italiya', label: text.ita },
    { value: 'Singapur', label: text.sin },
    { value: 'Shveytsariya', label: text.shv },
    { value: 'Fransiya', label: text.fra },
    { value: 'Xitoy', label: text.xit }
  ];

  const sendUniChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUni || !uniChatInput.trim() || uniChatLoading) return;

    if (!user.isPremium && uniQuestionsCount >= 5) {
      setErrorMessage(text.warningLimitMsg);
      onOpenPremium();
      return;
    }

    const typedMsg = uniChatInput;
    setUniChatInput('');
    setErrorMessage(null);

    const currentHist = uniChatHistory[selectedUni.id] || [];
    const updatedUserHist = [...currentHist, { sender: 'user' as const, text: typedMsg }];
    setUniChatHistory(prev => ({
      ...prev,
      [selectedUni.id]: updatedUserHist
    }));

    setUniChatLoading(true);

    try {
      const response = await fetch(getApiUrl("/api/ai/generate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: "university_chat",
          inputData: {
            userMessage: typedMsg,
            uniName: selectedUni.name,
            uniCountry: selectedUni.country,
            uniCity: selectedUni.city,
            uniBrief: selectedUni.brief,
            uniDescription: selectedUni.description,
            uniFee: selectedUni.fee,
            uniDeadlines: selectedUni.deadlines,
            uniWebsite: selectedUni.website,
            uniDocuments: selectedUni.documents,
            history: updatedUserHist.slice(-8)
          },
          userContext: user
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setUniChatHistory(prev => ({
          ...prev,
          [selectedUni.id]: [...updatedUserHist, { sender: 'ai' as const, text: data.text }]
        }));
        if (!user.isPremium) {
          incrementUniChatCount();
        }
      } else {
        setErrorMessage(data.error || text.errorLoad);
      }
    } catch {
      setErrorMessage(text.errorLoad);
    } finally {
      setUniChatLoading(false);
    }
  };

  // Filter and search logic
  const filteredUniversities = universitiesData.filter((uni) => {
    if (activeSubTab === 'favorite' && !favorites.includes(uni.id)) {
      return false;
    }
    const matchesCountry = selectedCountry === 'barchasi' || uni.country === selectedCountry;
    const matchesSearch = 
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.brief.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  // Country step custom localized guidelines
  const getLocalizedAdmissionSteps = (country: string) => {
    const stepsUz = country === "AQSh" ? [
      { badge: "Tizim", title: "1-Qadam: Common App orqali Ro'yxatdan O'tish", desc: "AQSh oliygohlarining 90% qismi yagona Common Application portali orqali arizalarni qabul qiladi. Umumiy profilingiz, oilaviy ma'lumotlar hamda maktab baholar tizimini kiriting." },
      { badge: "Til ko'rsatgichi", title: "2-Qadam: IELTS Academic yoki TOEFL imtihonlari", desc: "Top-100 universitetlar uchun kamida IELTS 6.5 (subscores 6.0+) yoki TOEFL iBT 85-90 darajalari talab qilinadi. Ba'zi gumanitar yo'nalishlar undan ham yuqori ballni maqsad qiladi." },
      { badge: "Test imtihonlari", title: "3-Qadam: SAT yoki ACT imtihon hujjatlari", desc: "Garchi ko'plab maktablar 'Test-Optional' bo'lsa-da, nufuzli grant olish yoki yuqori reytinglar (MIT, Harvard, NYU) uchun SAT ballari (1400+) taqdim etish g'alaba kalitidir." },
      { badge: "Esse yozish", title: "4-Qadam: Shaxsiy insho (Personal Statement) va Why Us", desc: "Komissiya sinf baholaringizdan tashqari shaxsiyatingizga qaraydi. Kuchli inshoni yozish uchun platformamizning 'THE CONTENT LAB' daxshatli AI yordamchilaridan to'liq foydalaning." },
      { badge: "Tavsiyanoma", title: "5-Qadam: LOR va Maktab baholar transkripti", desc: "Sinf rahbaringiz hamda o'qituvchilardan jami 2-3 ta ingliz tilida tavsiyanoma yuklang. Maktabning so'nggi 3 yildagi choraklik va yillik baholar transkriptini ilova qiling." }
    ] : country === "Germaniya" ? [
      { badge: "Tizim", title: "1-Qadam: Uni-assist portalidan ekvivalentlik tekshiruvi", desc: "O'zbekistondagi 11 yillik maktab Germaniya uchun ba'zida yetarli hisoblanmaydi (Studienkolleg talab qilinishi mumkin). Uni-assist tizimida attestatingiz nemis 'HZB' standartiga tenglashtirilish darajasini tekshiring." },
      { badge: "Viza kafolati", title: "2-Qadam: Bloklangan bank hisobi (Blocked Account) ochish", desc: "Germaniya elchixonasidan talabalik vizasini olish uchun maxsus Bloklangan Hisob ochib, unga yiliga €11,900 miqdorida kafolatlangan pul o'tkazishingiz lozim." },
      { badge: "Til darajasi", title: "3-Qadam: Til sertifikatlarini biriktirish", desc: "Nemis tili o'quv yo'nalishlari uchun TestDaF kamida C1 darajasi, ingliz tilidagi xalqaro dasturlar uchun esa IELTS Academic kamida 6.0/6.5 darajalari joriy qilinadi." },
      { badge: "Grantlar", title: "4-Qadam: DAAD va Deutschlandstipendium bepul yashash stipendiyalari", desc: "Germaniyada davlat oliygohlarida kontrakt to'lovi yo'q, o'qish bepul! Ammo turar-joy xarajatlarini qoplash uchun DAAD yoki Deutschlandstipendium (€300/oylik) grantlariga ariza topshirasiz." }
    ] : country === "Janubiy Koreya" ? [
      { badge: "GKS granti", title: "1-Qadam: GKS (Global Korea Scholarship) To'liq Grant arizasi", desc: "Koreyada 100% tekin o'qish, bepul yotoqxona va oyiga $900 naqd nafaqa olish uchun har yili fevral/sentyabr oylarida Global Koreya Granti (GKS) xizmatiga ariza bering." },
      { badge: "Til ko'rsatgichi", title: "2-Qadam: TOPIK yoki IELTS sertifikatlariga ega bo'lish", desc: "Koreys tili darslari uchun TOPIK kamida 3-4 daraja, ingliz tili darslari uchun esa IELTS 5.5 - 6.5 yetarli. TOPIK sertifikati bo'lsa, oliygohlar ichki kontrakt grantlarini ham beradi." },
      { badge: "Apostil", title: "3-Qadam: Guvohnomalar va baholarni Apostil qilish", desc: "Koreya qonunlariga binoan, maktab attestatingiz va oilaviy munosabatlarni tasdiqlovchi FHDYo guvohnomalarini rasmиy notarial tarjima qildirib, Apostil muhrlari bilan tasdiqlashingiz shart." },
      { badge: "Moliya", title: "4-Qadam: Viza uchun bankda $20,000 kafolat ko'rsatish", desc: "Agar siz to'liq GKS granti sohibi bo'lmasangiz, Koreya elchixonasidan viza olish uchun bank hisobingizda doimiy kamida $20,000 pul turganligini isbotlovchi bank guvohnomasi taqdim qilinadi." }
    ] : [
      { badge: "Tanlov", title: "1-Qadam: Oliygoh rasmiy ariza sahifasidagi talablarni o'rganish", desc: "Universitetning rasmiy saytida 'Admissions -> International Students' sahifasiga kirib, kerakli yo'llanmalarni va hujjat topshirish muddatlarini ko'rib chiqing." },
      { badge: "Baholar", title: "2-Qadam: GPA va til ko'rsatkichlarini rasmiylashtirish", desc: "Attestat yoki diplomni ingliz tiliga rasmiy tarjima qildiring, o'rtacha GPA ballaringizni baholab, IELTS Akademik sertifikatini biriktiring." },
      { badge: "Maktub", title: "3-Qadam: Motivatsion xat va tavsiyanoma loyihalari", desc: "Nega aynan ushbu oliygoh va mutaxassislikni tanlaganingiz haqida batafsil motivatsion insho tayyorlab, sobiq professorlardan tavsiyanoma oling." },
      { badge: "Intervyu", title: "4-Qadam: Suhbat va viza hujjatlari poydevori", desc: "Ariza tasdiqlangach, onlayn intervyuga kirasiz. Keyin universitet taqdim etgan rasmiy elektron yo'llanma asosida talabalik vizasini rasmiylashtirasiz." }
    ];

    const stepsEn = country === "AQSh" ? [
      { badge: "System", title: "Step 1: Universal Registration via Common App", desc: "About 90% of US universities accept student applications via the joint Common App portal. Complete your profile, parental asset info, and high school transcript details." },
      { badge: "Language", title: "Step 2: English Language Proficiency (IELTS/TOEFL)", desc: "A score of at least 6.5 IELTS (6.0+ subscores) or 85 TOEFL is generally requested. Ivy Leagues and elite colleges prioritize higher thresholds." },
      { badge: "Testing", title: "Step 3: Standardized Academic SAT / ACT Exams", desc: "Though many colleges remain Test-Optional, presenting a high SAT score (1400+) vastly expands your probability of landing a merit-based full-ride scholarship." },
      { badge: "Essay", title: "Step 4: Personal Statement & Why Us Essay Drafts", desc: "Admissions officers care heavily about your personality beyond GPA score grids. Polish your essays using TopGrand's premium Content Lab AI tools." },
      { badge: "Letters", title: "Step 5: Letters of Recommendation & Counselor Transcripts", desc: "Submit 2 to 3 solid recommendation letters (LOR) from high school educators, alongside certified transcripts from the last three Academic years." }
    ] : country === "Germaniya" ? [
      { badge: "Equivalency", title: "Step 1: Check High School Equivalency via Uni-assist", desc: "A standard high school certificate from Central Asia might require a preliminary one-year preparatory college (Studienkolleg). Run your 'HZB' equivalency status via Uni-assist." },
      { badge: "Funds", title: "Step 2: Initialize a Certified Blocked Account", desc: "To legally secure a German Study Visa, you must host student funds of around €11,900 in a certified German escrow account (Expatrio or Fintiba)." },
      { badge: "Language", title: "Step 3: Meet Specific Language Testing Standards", desc: "German-taught streams require standard TestDaF (C1) or DSH, while international undergraduate profiles ask for IELTS Academic averages starting from 6.0." },
      { badge: "Stipends", title: "Step 4: Secure DAAD or Deutschlandstipendium Funding", desc: "German public institutions do not charge tuition. To easily offset living and rent expenses, submit proposals to DAAD or Deutschlandstipendium (€300/mo)." }
    ] : [
      { badge: "Inquiry", title: "Step 1: Explore admissions page on official portal", desc: "Visit the official university admissions page, analyze requirements, and note the targeted submission dates." },
      { badge: "Grades", title: "Step 2: Certify GPA averages and language certificates", desc: "Translate high school grades and scan your IELTS Academic or TOEFL iBT certificates carefully." },
      { badge: "Drafting", title: "Step 3: Compose Motivation & Recommendation letters", desc: "Write a high-quality Statement of Purpose explaining why you fit this specific program and ask instructors for references." },
      { badge: "Interview", title: "Step 4: Practice mock interview with AI & Apply for Visa", desc: "After submitting your portfolio, pass the Zoom interviewer, and schedule your embassy student visa appointment." }
    ];

    const stepsRu = country === "AQSh" ? [
      { badge: "Система", title: "Шаг 1: Единая регистрация в Common App", desc: "Более 90% университетов США принимают заявки через портал Common Application. Заполните личный профиль, данные о семье и школьные оценки." },
      { badge: "Язык", title: "Шаг 2: Сертификаты IELTS Academic или TOEFL", desc: "Для ведущих 100 вузов требуется минимум балл 6.5 по IELTS или 85 по TOEFL iBT. Гуманитарные направления могут запрашивать более высокие отметки." },
      { badge: "Тесты", title: "Шаг 3: Экзамены SAT или ACT", desc: "Хотя многие вузы перешли на формат 'Test-Optional', высокие результаты SAT (1400+) являются весомым аргументом для получения гранта." },
      { badge: "Эссе", title: "Шаг 4: Персональное эссе и Why Us", desc: "Комиссия исследует вашу личность, а не просто сухие оценки. Напишите эссе с помощью передовых ИИ-ассистентов в модуле 'THE CONTENT LAB'." },
      { badge: "Рекомендации", title: "Шаг 5: Рекомендательные письма и транскрипты", desc: "Загрузите 2-3 рекомендательных письма (LOR) от преподавателей на английском языке и выписку квартальных оценок за последние 3 года." }
    ] : [
      { badge: "Отбор", title: "Шаг 1: Изучение официального сайта выбранного вуза", desc: "Перейдите на официальный сайт вуза в раздел International Admissions и изучите дедлайны по международным квотам." },
      { badge: "Оценки", title: "Шаг 2: Подготовка школьного GPA и языковых баллов", desc: "Нотариально переведите аттестат или диплом и приложите готовый сертификат IELTS Academic / TOEFL." },
      { badge: "Письма", title: "Шаг 3: Написание сопроводительных документов", desc: "Подготовьте сильное мотивационное письмо и договоритесь с преподавателями о составлении рекомендательных писем." },
      { badge: "Виза", title: "Шаг 4: Собеседование и оформление студенческой визы", desc: "После успешного рассмотрения портфолио пройдите онлайн-собеседование и подайте заявление на визу по форме I-20 / CAS." }
    ];

    if (currentLang === 'en') return stepsEn;
    if (currentLang === 'ru') return stepsRu;
    return stepsUz;
  };

  const applyHelpSteps = selectedUni ? getLocalizedAdmissionSteps(selectedUni.country) : [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12" id="explorer-root">
      
      {activeSubTab !== 'qaynoq' ? (
        <>
          {/* Sub tabs bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 p-1.5 bg-slate-100/80 rounded-[1.75rem] max-w-2xl mx-auto border border-slate-200">
            <button
              onClick={() => setActiveSubTab('katalog')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm transition-all duration-200 ${
                activeSubTab === 'katalog'
                  ? 'bg-white text-blue-700 shadow-md border border-blue-100'
                  : 'text-slate-650 hover:text-blue-700'
              }`}
              id="btn-subtab-katalog"
            >
              <GraduationCap className="h-4.5 w-4.5 text-blue-600 shrink-0" />
              <span>{text.tabKatalog}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('favorite')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm transition-all duration-200 ${
                activeSubTab === 'favorite'
                  ? 'bg-white text-blue-700 shadow-md border border-blue-100'
                  : 'text-slate-650 hover:text-blue-700'
              }`}
              id="btn-subtab-favorites"
            >
              <Star className={`h-4.5 w-4.5 shrink-0 ${activeSubTab === 'favorite' ? 'fill-yellow-500 text-yellow-500' : 'text-slate-400'}`} />
              <span>{text.tabFavorite} ({favorites.length})</span>
            </button>
          </div>

          {/* Search and Filters Segment */}
          <div className="mb-10 p-6 rounded-3xl border border-white/60 bg-white/75 backdrop-blur-xl space-y-4 shadow-xl shadow-blue-500/5">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Search Box */}
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-blue-500" />
                <input
                  type="text"
                  placeholder={text.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-blue-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 placeholder-blue-900/40 outline-none focus:border-blue-500 transition shadow-inner"
                />
              </div>

              {/* Country select option */}
              <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                >
                  {countries.map((c) => (
                    <option key={c.value} value={c.value} className="bg-white text-slate-800">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Helper Badge */}
            <p className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>{text.helperBadge}</span>
            </p>
          </div>

          {/* CENTRAL TELEGRAM FOLLOW BANNER */}
          <div className="mb-10 bg-gradient-to-r from-blue-600 to-sky-600 rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden transition-all hover:scale-[1.005] duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="space-y-1 text-center sm:text-left">
                <span className="bg-white/20 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  TOPGRAND HAMKORLIK
                </span>
                <h4 className="text-base md:text-lg font-black text-white leading-snug">
                  {text.tgTitle}
                </h4>
                <p className="text-xs text-blue-100 font-bold">
                  {text.tgDesc}
                </p>
              </div>
              <a
                href="https://t.me/Topgrands"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white text-blue-700 hover:bg-blue-50 transition rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 shrink-0 self-center cursor-pointer"
                style={{ minHeight: '44px' }}
                id="btn-telegram-uni-explore"
              >
                <Send className="h-4 w-4 text-blue-700 shrink-0" />
                <span>{text.tgBtn}</span>
              </a>
            </div>
          </div>

          {/* Grid Layout of Universities */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((uni) => {
              return (
                <div
                  key={uni.id}
                  className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 transition duration-300 backdrop-blur-md flex flex-col justify-between shadow-lg hover:border-blue-250 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <div className="p-6 space-y-4">
                    {/* Header attributes */}
                    <div className="flex items-start justify-between gap-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-105 border border-blue-200 px-2.5 py-1 text-[10px] font-mono font-bold text-blue-700">
                        Rank #{uni.ranking}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold uppercase font-sans">
                        <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        {translateCountry(uni.country)}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-blue-950 leading-tight min-h-[50px] flex items-center">
                        {uni.name}
                      </h3>
                      <p className="text-xs text-slate-650 mt-2 font-medium leading-relaxed line-clamp-3">
                        {uni.brief}
                      </p>
                    </div>

                    {/* Ratings and stars */}
                    <div className="flex items-center gap-1 mt-1 text-xs text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(uni.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                          }`}
                        />
                      ))}
                      <span className="text-[10px] font-mono text-slate-500 font-bold ml-1">( {uni.rating.toFixed(1)} )</span>
                    </div>
                  </div>

                  {/* Footer actions with 44px mobile spacing */}
                  <div className="p-6 pt-0 border-t border-slate-100 mt-auto flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 font-semibold truncate max-w-[130px]">
                      {uni.city}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSelectUni(uni)}
                        className="px-4 py-2.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition rounded-xl cursor-pointer shadow-sm flex items-center gap-1"
                        style={{ minHeight: '44px' }}
                        id={`btn-view-uni-${uni.id}`}
                      >
                        <span>{text.detailsBtn}</span>
                        <ArrowRight className="h-3 w-3 stroke-[2.5px] text-white shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredUniversities.length === 0 && (
            <div className="text-center py-16 bg-white/50 rounded-3xl border border-dashed border-slate-300 max-w-sm mx-auto space-y-2">
              <GraduationCap className="h-10 w-10 text-slate-450 mx-auto animate-pulse" />
              <p className="text-slate-600 text-xs font-bold font-sans">
                {activeSubTab === 'favorite' ? text.favoritesEmpty : "Oliygoh topilmadi."}
              </p>
            </div>
          )}
        </>
      ) : null}

      {/* SINGLE DETAILED WORKSPACE VIEW (FULL SCREEN OVERLAY) */}
      <AnimatePresence>
        {selectedUni && (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="fixed inset-0 z-50 bg-[#f0f9ff] text-slate-900 flex flex-col h-screen w-screen overflow-hidden"
            id="uni-fullscreen-panel"
          >
            {/* FIXED HIGH CONTRAST HEADER WITH BOLD BACK BUTTON AND EXIT CONTROL */}
            <div className="sticky top-0 bg-white border-b border-blue-100 px-6 py-4 flex items-center justify-between z-30 shadow-md shrink-0">
              <button
                onClick={() => handleSelectUni(null)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-extrabold text-xs md:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
                id="btn-close-uni-detail-fullscreen"
                style={{ minHeight: '44px' }}
              >
                <ArrowLeft className="h-5 w-5 text-blue-700 stroke-[3px] shrink-0" />
                <span>{text.backBtn}</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-blue-100 border border-blue-200 px-3.5 py-1 text-xs font-black text-blue-800">
                  QS Rank: #{selectedUni.ranking}
                </span>
                
                <button
                  onClick={() => toggleFavorite(selectedUni.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-center`}
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <Star className={`h-5 w-5 ${favorites.includes(selectedUni.id) ? 'fill-yellow-400 text-yellow-500' : 'text-slate-400'}`} />
                </button>
              </div>
            </div>

            {/* OVERALL PORTAL LAYOUT GRID */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
              
              {/* UNIVERSITY TITLE HERO CONTAINER */}
              <div className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-[2.5rem] p-6 md:p-10 text-white shadow-xl relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-white/10 border border-white/20 text-cyan-250 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                      {translateCountry(selectedUni.country)} • {selectedUni.city}
                    </span>
                    <span className="bg-cyan-500/20 border border-cyan-400/30 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                      QS Level: #{selectedUni.ranking}
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
                    {selectedUni.name}
                  </h1>

                  <p className="text-xs md:text-sm text-cyan-50/90 leading-relaxed max-w-4xl font-medium">
                    {selectedUni.brief}
                  </p>
                </div>
              </div>

              {/* MODAL NAVIGATION SUBTABS BAR WITH FULL RESPONSIVE FLEX-WRAP FOR MOBILE SCREEN OVERLAPS */}
              <div className="flex flex-col sm:flex-row gap-2 border border-blue-200/60 bg-white p-2 rounded-[1.75rem] shadow-sm max-w-2xl mx-auto shrink-0">
                <button
                  onClick={() => setModalSubTab('info')}
                  className={`flex-1 py-3 text-center text-xs md:text-sm font-black rounded-2xl transition-all duration-200 uppercase tracking-widest cursor-pointer ${
                    modalSubTab === 'info'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  {text.subTabInfo}
                </button>

                <button
                  onClick={() => setModalSubTab('steps')}
                  className={`flex-1 py-3 text-center text-xs md:text-sm font-black rounded-2xl transition-all duration-200 uppercase tracking-widest cursor-pointer ${
                    modalSubTab === 'steps'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  {text.subTabSteps}
                </button>

                <button
                  onClick={() => setModalSubTab('chat')}
                  className={`flex-1 py-3 text-center text-xs md:text-sm font-black rounded-2xl transition-all duration-200 uppercase tracking-widest cursor-pointer flex items-center justify-center gap-1.5 ${
                    modalSubTab === 'chat'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  <Sparkles className="h-4 w-4 text-amber-400 animate-pulse shrink-0" />
                  <span>{text.subTabChat}</span>
                </button>
              </div>

              {/* Error messages if any */}
              {errorMessage && (
                <div className="max-w-2xl mx-auto p-4 bg-red-550 border border-red-250 rounded-2xl bg-rose-50 border-rose-100 text-xs text-rose-800 font-bold flex items-center justify-between shrink-0">
                  <span>{errorMessage}</span>
                  <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700">✕</button>
                </div>
              )}

              {/* TAB SWITCH CONTENTS */}
              <div className="bg-white rounded-[2.5rem] border border-blue-100/60 p-6 md:p-8 shadow-xl shadow-blue-900/[0.02] shrink-0">
                
                {modalSubTab === 'info' && (
                  <div className="space-y-8">
                    <div className="space-y-3 text-left">
                      <h3 className="text-lg md:text-xl font-black text-blue-950">
                        {text.infoTitle}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-semibold">
                        {selectedUni.description}
                      </p>
                    </div>

                    {/* Financial Metrics and Deadlines details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      <div className="rounded-3xl border border-blue-100 bg-[#f8fafc] p-6 flex items-start gap-4 shadow-sm">
                        <div className="p-3.5 bg-blue-100 border border-blue-200 text-blue-700 rounded-2xl shrink-0">
                          <DollarSign className="h-6 w-6 stroke-[2.5px]" />
                        </div>
                        <div className="space-y-1 text-left">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{text.feeLabel}</h4>
                          <p className="text-xs md:text-sm text-blue-950 font-black leading-snug">
                            {selectedUni.fee}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-blue-100 bg-[#f8fafc] p-6 flex items-start gap-4 shadow-sm">
                        <div className="p-3.5 bg-blue-100 border border-blue-200 text-blue-700 rounded-2xl shrink-0">
                          <Calendar className="h-6 w-6 stroke-[2.5px]" />
                        </div>
                        <div className="space-y-1 text-left">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{text.deadlineLabel}</h4>
                          <p className="text-xs md:text-sm text-blue-950 font-black leading-snug">
                            {selectedUni.deadlines}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Required Documents checklist for Admissions */}
                    <div className="rounded-3xl border border-blue-100 bg-[#f8fafc] p-6 md:p-8 space-y-4">
                      <h4 className="font-extrabold text-sm md:text-base text-blue-950 flex items-center gap-2 text-left">
                        <FileText className="h-5 w-5 text-blue-700 shrink-0" />
                        <span>{text.docsLabel}</span>
                      </h4>
                      
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs md:text-sm text-slate-800 font-bold text-left">
                        {selectedUni.documents.map((doc, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle className="h-4.5 w-4.5 text-green-600 shrink-0 mt-0.5" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                )}

                {modalSubTab === 'steps' && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-4 text-left">
                      <h3 className="text-lg md:text-xl font-extrabold text-blue-950 leading-tight">
                        {translateCountry(selectedUni.country)}{text.guideTitle}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-semibold leading-relaxed">
                        {text.guideSub}
                      </p>
                    </div>

                    <div className="relative border-l-2 border-blue-105 pl-6 ml-4 space-y-8">
                      {applyHelpSteps.map((step, sIdx) => (
                        <div key={sIdx} className="relative text-left">
                          
                          {/* Number Indicator Pill */}
                          <span className="absolute -left-[37px] top-1 flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 border-2 border-white text-white text-[10px] font-black shadow-sm font-mono z-10">
                            {sIdx + 1}
                          </span>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm md:text-base font-black text-blue-950 leading-snug">
                                {step.title}
                              </h4>
                              <span className="bg-blue-50 border border-blue-150 text-blue-800 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                {step.badge}
                              </span>
                            </div>
                            <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-semibold font-sans">
                              {step.desc}
                            </p>
                          </div>

                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs md:text-sm text-amber-900 font-bold leading-normal text-left">
                      {text.warningNote}
                    </div>
                  </div>
                )}

                {modalSubTab === 'chat' && (
                  /* INTERACTIVE AI CHAT COUNSELOR */
                  <div className="flex flex-col h-full min-h-[400px]">
                    
                    <div className="border-b border-slate-100 pb-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-left gap-2">
                      <div>
                        <h3 className="text-base font-extrabold text-blue-950 flex items-center gap-1.5">
                          <Sparkles className="h-4.5 w-4.5 text-cyan-600 shrink-0" />
                          <span>{selectedUni.name} {text.chatTitle}</span>
                        </h3>
                        <p className="text-[10px] text-slate-500 font-semibold font-mono">
                          OFFICIAL ACADEMIC COGNITIVE CONSOLE
                        </p>
                      </div>

                      <span className="bg-blue-550/10 text-blue-800 text-[10px] font-black px-3 py-1 rounded-full border border-blue-100 self-start sm:self-center font-mono">
                        {text.limitRemaining.replace("{count}", String(5 - (user.isPremium ? 0 : uniQuestionsCount)))}
                      </span>
                    </div>

                    {/* Chat messaging display area */}
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[300px] bg-slate-50/50 p-4 rounded-2xl border border-slate-150 shadow-inner">
                      {/* Initial message */}
                      <div className="flex flex-col items-start text-left">
                        <div className="max-w-[85%] bg-blue-100 text-blue-950 text-xs sm:text-sm p-3.5 rounded-2xl border border-blue-150 rounded-tl-none font-semibold">
                          Hello! I am the official AI cognitive advisor of {selectedUni.name}. You can ask me any specific question regarding application documents, scholarships, standard TOEFL scores, GPA requirements, or campus living guidelines.
                        </div>
                      </div>

                      {/* History */}
                      {(uniChatHistory[selectedUni.id] || []).map((msg, mIdx) => (
                        <div key={mIdx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} text-left`}>
                          <div className={`max-w-[85%] text-xs sm:text-sm p-3.5 rounded-2xl font-semibold leading-normal border ${
                            msg.sender === 'user' 
                              ? 'bg-blue-600 text-white rounded-tr-none border-blue-600' 
                              : 'bg-white text-[#1e293b] rounded-tl-none border-[#e2e8f0] shadow-sm'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}

                      {uniChatLoading && (
                        <div className="flex items-start text-left animate-pulse">
                          <div className="max-w-[80%] bg-blue-50 text-blue-600 text-xs p-3.5 rounded-2xl border border-blue-100 rounded-tl-none font-extrabold tracking-wider font-mono">
                            ⚡ AI VAKILI TAHLIL QILMOQDA...
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat form control with 44px mobile input elements */}
                    <form onSubmit={sendUniChatMessage} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={text.chatPlaceholder}
                        value={uniChatInput}
                        onChange={(e) => setUniChatInput(e.target.value)}
                        disabled={uniChatLoading}
                        className="flex-1 bg-white border border-slate-250 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 disabled:opacity-50 shadow-inner"
                        id="uni-chat-input-text"
                        style={{ minHeight: '44px' }}
                      />
                      <button
                        type="submit"
                        disabled={uniChatLoading || !uniChatInput.trim()}
                        className="px-4.5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-1 min-h-[44px]"
                        style={{ minHeight: '44px' }}
                      >
                        <span>{text.chatSend}</span>
                        <Send className="h-4 w-4 text-white shrink-0" />
                      </button>
                    </form>

                  </div>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
