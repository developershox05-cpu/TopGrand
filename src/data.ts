import { University, PrepGuide, TestQuestion } from './types';

// Deterministic seedable random implementation
function seedRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 48-hour epoch seed
export function get48hEpochSeed(): number {
  return Math.floor(Date.now() / (1000 * 60 * 60 * 48));
}

// Pre-defined top authentic cities and stems per country for generation
const countryMeta: Record<string, {
  cities: string[];
  prefixes: string[];
  stems: string[];
  suffixes: string[];
  tuitionTemplate: (val: number) => string;
  grantTemplate: (val: number) => string;
  docs: string[];
  briefs: string[];
}> = {
  "O'zbekiston": {
    cities: ["Toshkent", "Samarqand", "Buxoro", "Andijon", "Farg'ona", "Namangan", "Qarshi", "Nukus", "Xiva", "Jizzax", "Navoiy", "Guliston"],
    prefixes: ["Milliy", "Xalqaro IT", "Amaliy Texnologiyalar", "Prezident", "Sharqshunoslik", "Central Asian", "Ipak Yo'li", "Turon", "Toshkent Davlat", "Samarqand Davlat", "Farg'ona Texnika"],
    stems: ["Axborot Texnologiyalari va Kiber-havfsizlik", "Muhandislik va Kosmik Tadqiqotlar", "Iqtisodiyot, Moliya va Biznes", "Jahon Siyosati va Xalqaro Huquq", "Tibbiyot va Farmatsevtika Inovatsiyalari", "Biznes, Logistika va Boshqaruv", "Pedagogika va Rivojlantirish", "Arxitektura, Qurilish va Dizayn"],
    suffixes: ["Universiteti", "Instituti", "Akademiyasi"],
    tuitionTemplate: (val) => `${(8 + (val % 18)).toFixed(1)} mln UZS / yiliga`,
    grantTemplate: (val) => `Davlat Byudjeti asosida ${40 + (val % 60)}% gacha kvota va Prezident Grantlari`,
    docs: ["Pasport / ID Card nusxasi", "Maktab Attestati yoki Litsey/Kollej Diplomi", "DTM Varag'i", "Suhbat va Shaxsiy Insho (CEFR B2 / IELTS 5.5+ tavsiya etiladi)"],
    briefs: [
      "O'zbekistondagi eng zamonaviy muhandislik va boshqaruv ta'limi yo'nalishi.",
      "Xalqaro hamkorlik dasturlari va DTM bo'yicha yuqori byudjet kvotalari yechimi.",
      "Biznes va IT sohasida eng talabgir mutaxassislarni tayyorlash milliy bazasi."
    ]
  },
  "AQSh": {
    cities: ["Boston", "San Francisco", "Seattle", "New York", "Chicago", "Los Angeles", "Austin", "Philadelphia", "Miami", "Denver", "Atlanta", "San Diego"],
    prefixes: ["California International", "State University of", "Atlantic", "Pacific Coast", "Northwestern Tech", "Commonwealth", "St. Jude", "Harvard Academic Affiliate", "Silicon Valley"],
    stems: ["Institute of Technology", "Science & AI Research Center", "School of Business Administration", "State College of Sciences", "Polytechnic Institute"],
    suffixes: ["University", "College", "Institute"],
    tuitionTemplate: (val) => `$${(32000 + (val % 30000)).toLocaleString()} / yiliga`,
    grantTemplate: (val) => `${50 + (val % 50)}% lik Need-Blind / Merit-Based Grantlar (Oila daromadiga ko'ra bepul)`,
    docs: ["Common Application / Coalition App Form", "Transcripts evaluated by WES (GPA 3.0+)", "IELTS 6.5+ / TOEFL 90+", "SAT Digital (1350+ highly recommended)", "2 Recommendation Letters & Statement of Purpose"],
    briefs: [
      "Silikon vodiysi va tadbirkorlik muhitiga yo'naltirilgan yetakchi oliygoh.",
      "Need-blind tizimi orqali xorijlik talabalarga 100% gacha moliyaviy homiylik.",
      "Kuchli kompyuter ilmlari, muhandislik va startap inkubatorlariga ega maskan."
    ]
  },
  "Buyuk Britaniya": {
    cities: ["London", "Oxford", "Cambridge", "Manchester", "Edinburgh", "Bristol", "Glasgow", "Birmingham", "Leeds", "Liverpool", "Sheffield", "Coventry"],
    prefixes: ["British International", "Royal Academy of", "King's Affiliate", "Westminster Society", "London Centre of", "Anglia", "North Sea", "Snowdonia Science"],
    stems: ["Advanced Science & Humanities", "Global Economics & Finance", "Engineering & Robotics", "Public Health Research", "Legal & Business Studies"],
    suffixes: ["University", "Institute of Technology", "College"],
    tuitionTemplate: (val) => `£${(18000 + (val % 15000)).toLocaleString()} / yiliga`,
    grantTemplate: (val) => `Great Scholarships, Chevening va ${30 + (val % 70)}% Lik Academic Merit Grantlar`,
    docs: ["UCAS Application & Personal Statement", "Certified A-Levels or High School Transcript", "IELTS Academic (6.5+ minimum, subscores 6.0+)", "Teacher Recommendation from Principal", "Academic Portfolio (for Art / Design majors)"],
    briefs: [
      "Qadimiy akademik an'analar va eng zamonaviy ilmiy laboratoriyalar simbiozi.",
      "Royal Charter asosida tasdiqlangan global darajadagi nufuzli diplomlar.",
      "Bitiruvchilarga 2-yillik Buyuk Britaniyada qolish va ishlash huquqini beruvchi (Graduate Visa) dasturlar."
    ]
  },
  "Germaniya": {
    cities: ["Munich", "Berlin", "Heidelberg", "Hamburg", "Frankfurt", "Aachen", "Cologne", "Stuttgart", "Karlsruhe", "Bonn", "Göttingen", "Dresden"],
    prefixes: ["Technical University of", "Albert Einstein Academy", "Max Planck Affiliate of", "Federal State University of", "Rhein-Westphalia", "Bavarian Global", "Saxony Advanced"],
    stems: ["Industrial Engineering & Automation", "Applied Sciences & Informatics", "Environmental Technologies", "Biomedical & Nano Sciences", "Business & Social Systems"],
    suffixes: ["University of Applied Sciences", "Technical University", "University"],
    tuitionTemplate: (val) => `€150 - €500 / semestr (Germaniya qonuniga ko'ra O'qish bepul)`,
    grantTemplate: (val) => `DAAD Grants, Deutschlandstipendium (€300/oylik) va Davlat stipendiyalari`,
    docs: ["Uni-assist Online Portal Application", "Hochschulzugangsberechtigung (HZG Equivalent)", "German TestDaF (TDN 4) or IELTS Academic (6.0+)", "APS Certificate (for select Asian/Central countries)", "Proof of Financial Funds (€11,900 Blocked Account)"],
    briefs: [
      "Akademik to'lovlar deyarli mavjud bo'lmagan, yuqori muhandislik maktabi.",
      "Mashhur nemis sanoat korxonalari (BMW, Siemens, Bosch) bilan bevosita amaliyot.",
      "Yevropaning eng barqaror iqtisodiyotidagi mukammal va bepul ta'lim tizimi."
    ]
  },
  "Kanada": {
    cities: ["Toronto", "Vancouver", "Montreal", "Waterloo", "Calgary", "Ottawa", "Edmonton", "Halifax", "Victoria", "Winnipeg", "Quebec City", "Hamilton"],
    prefixes: ["Royal Canadian", "Great Lakes", "Pacific North", "Maple Leaf", "St. Lawrence", "Laurentian", "Rocky Mountains Academic", "Canuck Tech"],
    stems: ["Informatics & Software Engineering", "Natural Resources & Energy", "Global Commerce & MBA", "Health Administration", "Aviation & Aerospace Sciences"],
    suffixes: ["University", "College", "Polytechnic Institute"],
    tuitionTemplate: (val) => `CAD ${(22000 + (val % 22000)).toLocaleString()} / yiliga`,
    grantTemplate: (val) => `Lester B. Pearson Award, Ontario Trillium va ${20 + (val % 80)}% lik kirish grantlari`,
    docs: ["Kanada Viloyat Portali (masalan, OUAC) maktubi", "High School Transcripts & Apostille", "IELTS Academic (6.5+ average) or TOEFL iBT", "SOP & Study Plan details", "Proof of funds for Canada Student Permit"],
    briefs: [
      "Xavfsiz, o'ta bag'rikeng va immigratsiya imkoniyatlari oson bo'lgan dunyo davlati.",
      "Yildan yilga rivojlanayotgan ko'p madaniyatli yashash va hamkorlik muhiti.",
      "Co-op (Hak to'lanadigan majburiy amaliyot) dasturlari bilan oson ish topish kafolati."
    ]
  },
  "Janubiy Koreya": {
    cities: ["Seoul", "Daejeon", "Busan", "Incheon", "Ulsan", "Gwangju", "Daegu", "Suwon", "Pohang", "Jeju", "Cheongju", "Chonju"],
    prefixes: ["Korea Elite", "Hanyang Advanced", "Mapo Global", "Gyeongbok Science", "Samsung Partnered", "Han River", "Chosun Heritage", "Asia Pacific Future"],
    stems: ["Information & Semiconductor Tech", "International Trade & K-Business", "Automotive & Smart Robotics", "K-Culture & Digital Media", "Life Science & Convergence Research"],
    suffixes: ["University", "National University", "Science Academy"],
    tuitionTemplate: (val) => `$${(3500 + (val % 5500)).toLocaleString()} / yiliga`,
    grantTemplate: (val) => `GKS (Global Korea Scholarship) 100% grant, TOPIK muvaffaqiyat bonusi (${30 + (val % 70)}% gacha)`,
    docs: ["Online Korean / English Application", "Notarized High School Diploma & Transcripts", "IELTS 5.5+ or TOPIK (3-6 daraja)", "Family Relationship Certificate for foreigners", "Bank Balance Certificate ($20,000 equivalent)"],
    briefs: [
      "Kuchli texnologik inqilob (Semiconductors, AI) va K-Culture poydevori.",
      "GKS davlat granti orqali bepul aviachipta, o'qish va $900 oylik naqsh stipendiya.",
      "Koreya gigantlarida (Samsung, LG, Hyundai) muvaffaqiyatli karyera starti."
    ]
  },
  "Yaponiya": {
    cities: ["Tokyo", "Kyoto", "Osaka", "Nagoya", "Tohoku", "Fukuoka", "Sapporo", "Hiroshima", "Yokohama", "Kobe", "Nara", "Sendai"],
    prefixes: ["Imperial Affiliate of", "Tokyo Pacific", "Shogun National", "Rising Sun", "Kanto Technics", "Kansai Science", "Fuji Academic Guild", "Nippon Global"],
    stems: ["Robotics & Human-Machine Interfaces", "Materials Science & Nanotech", "Global Business & Japanese Studies", "Advanced Physics & Nuclear Studies", "Biomedical Engineering"],
    suffixes: ["University", "National Institute", "Imperial College"],
    tuitionTemplate: (val) => `¥${(535000 + (val % 600000)).toLocaleString()} / yiliga`,
    grantTemplate: (val) => `MEXT Scholarship (%100 Bepul + 145,000 yen/oylik), JASSO stipendiyalari`,
    docs: ["MEXT Application Forms / Direct Application", "High School Graduation Certificate (English)", "EJU (Examination for Japanese University for International Students)", "English Proficiency Certificate (IELTS 6.0+ / TOEFL 80+)", "Primary research proposal layout"],
    briefs: [
      "Dunyoning eng yuqori robototexnika, muhandislik va texnik barqarorlik maktabi.",
      "MEXT Hukumat granti orqali to'liq bepul o'qish, aviachiptalar hamda katta oylik nafaqa.",
      "Yaponiya kompaniyalariga tez va kafolatli ishga joylashish imkoniyatlari."
    ]
  },
  "Turkiya": {
    cities: ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Eskişehir", "Adana", "Trabzon", "Konya", "Gaziantep", "Kocaeli", "Mersin"],
    prefixes: ["Anatolian Dynamic", "Bosphorus Elite", "Ottoman Heritage", "Yildiz Technical Partner of", "Eurasia Science", "Aegean", "Mediterranean Technical", "Sultan", "Marmara Global"],
    stems: ["Computer Engineering & Automation", "International Relations & Diplomacy", "Medicine & Clinical Research", "Civil Engineering & Architecture", "Aviation & Logistics Management"],
    suffixes: ["Üniversitesi", "Technical University", "Academy"],
    tuitionTemplate: (val) => `$${(1200 + (val % 4500)).toLocaleString()} / yiliga`,
    grantTemplate: (val) => `Türkiye Bursları Hukumat Granti (100% bepul yotoqxona va oylik stipendiya)`,
    docs: ["Türkiye Bursları online portal form", "High School Diploma with Turkish Embassy legalization", "YÖS (Yabancı Öğrenci Sınavı) or SAT (1100+)", "IELTS Academic (5.5+) or TÖMER Certificate (Turkish B2)", "Motivasyon Mektubu (SOP)"],
    briefs: [
      "Turkiya Hukumat Granti (Türkiye Bursları) bilan o'qish, bepul sug'urta va oylik pul.",
      "Yevropa va Osiyoni bog'lovchi strategik madaniy va tarixiy elta markazi.",
      "Evropa diplom tizimiga (Bologna Process) to'liq mos keladigan oliy malaka."
    ]
  },
  "Italiya": {
    cities: ["Rome", "Milan", "Bologna", "Padua", "Turin", "Pisa", "Florence", "Genoa", "Naples", "Venice", "Siena", "Trieste"],
    prefixes: ["Politecnico di", "Sapienza Allied of", "Medici Grand", "Renaissance Science", "Alps Technical", "Tuscan Global", "Lombardy Advanced", "Vatican Borderless"],
    stems: ["Classical Architecture & Urban Design", "Automotive & Mechanical Engineering", "Space Science & Astrophysics", "Global Management & Policy", "Biotech & Genomics"],
    suffixes: ["University", "Politecnico", "Institute of Advanced Studies"],
    tuitionTemplate: (val) => `€{(156 + (val % 3000))} / yiliga`,
    grantTemplate: (val) => `DSU Regional Grant (Yiliga €7,000 gacha bepul pul, tekin tushlik va yotoqxona)`,
    docs: ["Pre-enrolment via Universitaly Portal", "CIMEA Document of Correspondence", "IELTS Academic (5.5+ minimum, no band under 5.0)", "High School diploma (Declaration of Value)", "DSU Family Income Assessment (ISEE less than €25,000)"],
    briefs: [
      "DSU viloyat granti orqali oilaviy daromadi past bo'lgan barcha talabalar 100% tekin o'qiydi.",
      "Uyg'onish davri beshigi bo'lgan muhtasham arxitektura va san'at an'analari.",
      "Yevropaning eng arzon va eng saxovatli moliyaviy dasturlariga ega davlat."
    ]
  },
  "Singapur": {
    cities: ["Singapore"],
    prefixes: ["Nanyang Global", "Temasek Future", "Merlion Institute of", "Straits Scientific", "Raffles Academic", "Changi Technology Affiliate"],
    stems: ["AI & FinTech Convergence", "Global Logistics & Maritime Trade", "Sustainable Smart Cities Development", "Quantum Computing", "International Corporate Law"],
    suffixes: ["Singapore University", "Nanyang Institute", "Technological University"],
    tuitionTemplate: (val) => `SGD ${(25000 + (val % 22000)).toLocaleString()} / yiliga`,
    grantTemplate: (val) => `Singapore MOE Tuition Grant (Hukumat tomonidan 60-80% to'lov kafolati), Merit-Based Grantlar`,
    docs: ["Singapur Milliy Portal arizasi", "Standard SAT (1450+) or ACT test scores", "IELTS (7.0+ average) or TOEFL iBT", "3 Academic Reference letters", "Detailed Interview and video portfolio"],
    briefs: [
      "Dunyoning eng yuqori oylik va daromadga ega strategik moliyaviy va texnologik markazi.",
      "Global miqyosda 1-o'rinlarda turuvchi ultra-zamonaviy OSiyo marvaridi.",
      "Qattiq qonunchilik, mukammal xavfsizlik va eng ilg'or tadqiqot institutlari."
    ]
  },
  "Shveytsariya": {
    cities: ["Zurich", "Geneva", "Lausanne", "Bern", "Basel", "Zurich", "Lugano", "St. Gallen", "Neuchatel", "Fribourg"],
    prefixes: ["Swiss National", "Alps Scientific", "Geneva Diplomatic Affiliate of", "Federal Polytech Joint", "Bernese Highlands Academic", "Chillon Dynamic"],
    stems: ["Quantitative Finance & Banking", "High Precision Engineering", "Interstellar Exploration & Astrophysics", "Hotel & Luxury Management", "Bio-molecular Robotics"],
    suffixes: ["University of Zurich", "Institute of Technology", "Business School"],
    tuitionTemplate: (val) => `CHF ${(1200 + (val % 3500)).toLocaleString()} / yiliga`,
    grantTemplate: (val) => `Swiss Government Excellence Scholarships (EPFL/ETH to'liq bepul grantlar)`,
    docs: ["Direct Swiss University Portal System", "APS / Matura Equivalent evaluation", "IELTS Academic (7.0+ minimum)", "Two Letters of Recommendation from world-class researchers", "Visions of Academic Purpose Outline Paper"],
    briefs: [
      "Dunyoning eng barqaror va boy davlatidagi yuqori intellektual elite poydevori.",
      "Mashhur CERN laboratoriyalari va BMT idoralari bilan bevosita aloqa.",
      "Nol jinoyatchilik, muhtasham tabiat va eng daxshatli ishchilar maoshi tizimi."
    ]
  },
  "Fransiya": {
    cities: ["Paris", "Lyon", "Marseille", "Toulouse", "Grenoble", "Bordeaux", "Nantes", "Strasbourg", "Nice", "Lille"],
    prefixes: ["Sorbonne Alliance of", "Université Descartes", "French-European", "Louvre Academic affiliate of", "Versailles Global", "Eiffel Dynamic"],
    stems: ["Theoretical Mathematics & AI Research", "Aerospace Engineering & Avionics", "European Law & Human Rights", "Classical Literature & Culinary Arts", "Advanced Agritech"],
    suffixes: ["Université", "Grande École", "Polytechnic Institute"],
    tuitionTemplate: (val) => `€{(170 + (val % 3700))} / yiliga`,
    grantTemplate: (val) => `Eiffel Excellence Scholarship (To'liq bepul + €1,400 oylik pul), Charpak scholarships`,
    docs: ["Campus France Online Portal Process", "DELF/DALF Certificate (French B2) or IELTS (6.5+ for English programs)", "Validated secondary-level transcript reports", "Letter of academic support", "CV & Motivation Statement letter"],
    briefs: [
      "Eiffel Excellence granti orqali mutlaqo bepul hayotiy xarajat qoplamalari.",
      "Evropaning eng yirik matematika, kosmik kemasozlik va madaniyat yetakchisi.",
      "Arzon davlat shaxobchalari va elita Grande École maktablari tizimlari."
    ]
  },
  "Xitoy": {
    cities: ["Beijing", "Shanghai", "Chengdu", "Guangzhou", "Shenzhen", "Hangzhou", "Nanjing", "Wuhan", "Xian", "Chongqing", "Tianjin", "Harbin"],
    prefixes: ["Tsinghua Affiliate", "Imperial Beijing", "Great Wall Science", "Fudan United", "Orient Dynamic", "Middle Kingdom", "Pacific Rim Academic", "Yangtze River", "Silk Road Strategic"],
    stems: ["Artificial Intelligence & Deep Learning", "Advanced Robotics & Automation Systems", "Renewable Solar & Wind Tech", "High-Speed Rail Engineering", "Global eCommerce & Supply Chain"],
    suffixes: ["University", "Institute of Technology", "Union Academy"],
    tuitionTemplate: (val) => `$${(2500 + (val % 4500)).toLocaleString()} / yiliga`,
    grantTemplate: (val) => `CSC Government Scholarship (TO'LIQ BEPUL o'qish, tekin yotoqxona, sug'urta va oyiga $500 stipendiya)`,
    docs: ["CSC Online Application System form submission", "Validated Diploma with Foreign Ministry legalization", "IELTS Academic (6.0+) or HSK 4-6 (Xitoy tili uchun)", "Official study plan analysis paper", "Two letters of Reference from Associate Professors"],
    briefs: [
      "Xitoy Hukumat Granti (CSC) orqali yashash va o'qish to'liq 100% kafolatli bepul.",
      "G'arbdan o'zib ketayotgan texnologik va iqtisodiy inqilob markazi.",
      "Ulkan va hashamatli aqlli kampus ekotizimlari va bepul tibbiy sug'urtalari."
    ]
  }
};

// Real anchored world-class elite universities for high realism
const anchoredUnis: University[] = [
  // === O'zbekiston ===
  {
    id: "uni-uz-1",
    name: "Yangi O'zbekiston Universiteti (New Uzbekistan University)",
    country: "O'zbekiston",
    city: "Toshkent",
    brief: "O'zbekistondagi eng zamonaviy, xalqaro andozalarga mos biologik va texnologik flagman oliygoh.",
    description: "Yangi O'zbekiston Universiteti - mamlakatimizda xalqaro ta'lim standartlarini joriy etish va dunyo miqyosidagi muhandislarni tayyorlash maqsadida tashkil etilgan eng nufuzli davlat oliy ta'lim muassasasidir. Universitetning o'quv dasturlari Germaniyaning Myunxen Texnika Universiteti (TUM) bilan hamkorlikda ishlab chiqilgan. Universitetda darslar to'liq ingliz tilida olib boriladi, muhandislik, kompyuter ilmlari hamda sun'iy intellekt bo'limlarida davlat grantlari asosida ta'lim beriladi.",
    ranking: 1200,
    documents: [
      "Xalqaro Pasport nusxasi (Asli)",
      "O'rta maktab bitiruv attestati (Apostil qilingan)",
      "IELTS Akademik sertifikati (Kamida 6.0)",
      "Insho (SOP) hamda Motivatsiya maktubi",
      "Matematika fanidan kirish imtihoni natijalari"
    ],
    fee: "$3,050 / yiliga (Davlat granti hamda 100% lik iqtidor bonuslari qoplab beradi)",
    deadlines: "Early Admission: 15-Aprel, Regular Decision: 20-Iyul",
    website: "https://newuzbekistanuniversity.uz",
    rating: 4.8,
    featured: true,
    grantPercent: 100,
    minimumIelts: 6.0,
    minimumGpa: 3.5,
    minimumSat: 1100
  },
  {
    id: "uni-uz-2",
    name: "Toshkent Axborot Texnologiyalari Universiteti (TATU)",
    country: "O'zbekiston",
    city: "Toshkent",
    brief: "AKT, axborot havfsizligi va dasturlash sohasidagi O'rta Osiyoda yetakchi davlat universiteti.",
    description: "Muhammad al-Xorazmiy nomidagi Toshkent axborot texnologiyalari universiteti — O'zbekistonda dasturlash, kiberxavfsizlik, telekommunikatsiyalar va sun'iy intellekt sohalarida milliy ekspertlarni tayyorlovchi eng yirik baza muassasasidir. Universitet o'zining xalqaro qo'shma dasturlari, laboratoriyalari va bitiruvchilarning Google hamda mahalliy IT Park tashkilotlarida to'g'ridan-to'g'ri amaliyot ko'rishi bilan ajralib turadi.",
    ranking: 1300,
    documents: [
      "Pasport / ID Card nusxasi (Notarial)",
      "Ma'lumoti to'g'risidagi Diplom yoki Attestat",
      "Bilimni Baholash Agentligi (DTM) imtihon varaqasi",
      "Milliy yoki Xalqaro til sertifikati (IELTS 5.5+)"
    ],
    fee: "10,200,000 UZS / yiliga (To'liq davlat byudjeti granti olish huquqi mavjud)",
    deadlines: "Qabul davri: 20-Iyun - 10-Avgust (my.uzbmb.uz platformasida)",
    website: "https://tuit.uz",
    rating: 4.5,
    featured: false,
    grantPercent: 100,
    minimumIelts: 5.5,
    minimumGpa: 3.0,
    minimumSat: 1000
  },
  {
    id: "uni-uz-3",
    name: "Jahon Iqtisodiyoti va Diplomatiya Universiteti (JIDU)",
    country: "O'zbekiston",
    city: "Toshkent",
    brief: "Xalqaro biznes, diplomatiya, jahon iqtisodiyoti va xalqaro huquq elita markazi.",
    description: "Jahon iqtisodiyoti va diplomatiya universiteti O'zbekiston Respublikasi Tashqi ishlar vazirligi huzurida faoliyat yuritadi. Bu yerda xalqaro iqtisodchilar, elchilar, konsullar hamda xalqaro tahlilchilar tayyorlanadi. O'quv dasturi har bir talabadan kamida ikkita chet tili (Ingliz tili, Fransuz, Nemis, Xitoy, Koreys yoxud Arab tili)ni mukammal darajada o'zlashtirishni talab qiladi.",
    ranking: 1050,
    documents: [
      "Pasport/ID nusxasi",
      "O'rta ma'lumot yoki kollej to'g'risida attestat transkripti",
      "Ingliz tili sertifikati (IELTS Kamida 6.0)",
      "Dastlabki yozma tahliliy insho hamda suhbat bosqichi"
    ],
    fee: "24,000,000 UZS / yiliga (Reyting asosida 100% va 50% li homiylik grantlari beriladi)",
    deadlines: "Arizalar topshirish: 15-Iyun - 15-Iyul",
    website: "https://uwed.uz",
    rating: 4.7,
    featured: true,
    grantPercent: 100,
    minimumIelts: 6.0,
    minimumGpa: 3.8,
    minimumSat: 1150
  },

  // === AQSh ===
  {
    id: "uni-us-1",
    name: "Massachusetts Institute of Technology (MIT)",
    country: "AQSh",
    city: "Cambridge, Boston",
    brief: "QS jahon reytingida 1-o'rindagi texnologiya, sun'iy intellekt va muhandislik markazi.",
    description: "MIT — kompyuter ilmlari, robototexnika va kvant hisoblashlari sohasida dunyoning mutloq yetakchisidir. MIT talaba qabul qilishda uning ijtimoiy kelib chiqishiga qaramaydi (need-blind). Agar talabaning oilaviy daromadi yiliga $75,000 dan kam bo'lsa, o'qish, turar-joy va barcha xarajatlar to'liq 100% grant (Scholarship) hisobidan tekin qilib beriladi.",
    ranking: 1,
    documents: [
      "Common App yoki MIT portaliga ariza topshirish",
      "Yordamchi insholar (SOP - Creative Essay)",
      "O'rta maktab transkripti transkripsiyasi (WES)",
      "IELTS (7.5+) yoki TOEFL (100+)",
      "Matematika / Tabiiy fan o'qituvchilaridan 2 ta tavsiyanoma",
      "SAT Digital sertifikati (O'rtacha 1550+ tavsiya etiladi)"
    ],
    fee: "$61,500 / yiliga (Ehtiyojga asosan oilasi muhtoj talabalarga 100% BEPUL)",
    deadlines: "Early Action: 1-Noyabr, Regular Decision: 5-Yanvar",
    website: "https://www.mit.edu",
    rating: 5.0,
    featured: true,
    grantPercent: 100,
    minimumIelts: 7.5,
    minimumGpa: 4.0,
    minimumSat: 1500
  },
  {
    id: "uni-us-2",
    name: "Stanford University",
    country: "AQSh",
    city: "Stanford, California",
    brief: "Silikon vodiysining markazi, startaplar va dunyodagi eng boy oliygoh.",
    description: "Stanford universiteti California shtatida joyhazgan bo'lib, Silikon vodiysining rivojlanishiga bevosita poydevor yaratgan. Google, HP va Instagram asoschilarining deyarli barchasi Stanfordda o'qishgan. Universitet chet ellik eng namunali iqtidor egalariga 100% lik to'liq moliyaviy grantlarni taqdim qiladi va cheksiz labaratoriya resurslarini kafolatlaydi.",
    ranking: 3,
    documents: [
      "Coalition App yoki Common App transkripti",
      "GPA (O'rtacha 3.9 out of 4.0 ball)",
      "IELTS (Kamida 7.5) yoki TOEFL (105+)",
      "SAT (O'rtacha 1520+) yoxud ACT ballari",
      "Motivatsiya insholari va shaxsiy loyihalar va portfoliolar"
    ],
    fee: "$62,000 / yiliga (Oila daromadiga qarab 100% gacha moliyaviy yordam)",
    deadlines: "Restrictive Early Action: 1-Noyabr, Regular: 5-Yanvar",
    website: "https://www.stanford.edu",
    rating: 4.9,
    featured: true,
    grantPercent: 100,
    minimumIelts: 7.5,
    minimumGpa: 3.9,
    minimumSat: 1470
  },

  // === Xitoy ===
  {
    id: "uni-cn-1",
    name: "Tsinghua University",
    country: "Xitoy",
    city: "Beijing",
    brief: "Osiyo reytingining etakchisi, Xitoyning eng qudratli tadqiqotlar akademiyasi.",
    description: "Sinxua Universiteti (Tsinghua) — Osiyoning eng kuchli va nufuzli oliygohidir. 'CSC Scholarship' (Xitoy Hukumat Granti) orqali universitaga qabul qilingan chet ellik talabalarning o'qish to'lovi, bepul hashamatli yotoqxonasi, to'liq tibbiy sug'urtasi hamda har oy $550+ naqd stipendiyasi 100% davlat hisobidan hisoblanadi.",
    ranking: 25,
    documents: [
      "Online ariza va Tsinghua / CSC formalari",
      "IELTS (Kamida 6.5) yoxud xitoy tili HSK (5-daraja+)",
      "Sobiq o'qituvchilar yoki professorlardan 2 ta rasmiy tavsiyanoma",
      "Sog'lik to'g'risida guvohnoma (Physical Examination Record)"
    ],
    fee: "$5,000 / yiliga (Xitoy CSC hukumati granti ostida 100% BEPUL)",
    deadlines: "CSC qabullari: 1-Oktyabr - 15-Aprelgacha",
    website: "https://www.tsinghua.edu.cn",
    rating: 4.9,
    featured: true,
    grantPercent: 100,
    minimumIelts: 6.5,
    minimumGpa: 3.7,
    minimumSat: 1380
  }
];

// Main function to dynamically generate 55+ universities for each country
export function generateUniversities(): University[] {
  const seed48 = get48hEpochSeed();
  const list: University[] = [...anchoredUnis];

  // Map to group generated counts per country
  const countryCounts: Record<string, number> = {};
  for (const anchor of anchoredUnis) {
    countryCounts[anchor.country] = (countryCounts[anchor.country] || 0) + 1;
  }

  // Generate for all supported countries
  const countriesKeys = Object.keys(countryMeta);

  for (const country of countriesKeys) {
    const meta = countryMeta[country as keyof typeof countryMeta];
    const cityCount = meta.cities.length;
    const prefixCount = meta.prefixes.length;
    const stemCount = meta.stems.length;
    const suffixCount = meta.suffixes.length;

    // We must ensure AT LEAST 53 dynamically generated + anchored ones to comfortably exceed 50+
    const startingCount = countryCounts[country] || 0;
    const targetsToGenerate = 55 - startingCount;

    for (let i = 0; i < targetsToGenerate; i++) {
      const idxSeed = seed48 * 79 + i * 313 + country.charCodeAt(0) * 11;
      
      const r1 = seedRandom(idxSeed);
      const r2 = seedRandom(idxSeed + 1);
      const r3 = seedRandom(idxSeed + 2);
      const r4 = seedRandom(idxSeed + 3);
      const r5 = seedRandom(idxSeed + 4);
      const r6 = seedRandom(idxSeed + 5);

      const city = meta.cities[Math.floor(r1 * cityCount)];
      const prefix = meta.prefixes[Math.floor(r2 * prefixCount)];
      const stem = meta.stems[Math.floor(r3 * stemCount)];
      const suffix = meta.suffixes[Math.floor(r4 * suffixCount)];

      const uniName = `${prefix} ${stem} ${suffix}`;
      
      // Dynamic fluctuating ranking, from 120 to 1800
      const baseRanking = 80 + Math.floor(r5 * 1400);
      // Let it fluctuate slightly with 48h seed
      const rankOffset = Math.floor((seedRandom(seed48 + i) - 0.5) * 12);
      const ranking = Math.max(12, baseRanking + rankOffset);

      // Fluctuating acceptance rates & details
      const acceptanceVal = Math.floor(4 + r6 * 45);
      const satVal = 1000 + Math.floor(r1 * 500);
      const ieltsVal = r2 > 0.6 ? 7.0 : (r2 > 0.25 ? 6.5 : (r2 > 0.08 ? 6.0 : 5.5));
      const gpaVal = (3.0 + r3 * 1.0).toFixed(2);
      const rateStars = (4.0 + r4 * 0.95).toFixed(1);

      // Combine real details and stats in description
      const descText = `${uniName} - ${country}ning ${city} shahrida joylashgan yetakchi oliygohlardan hisoblanadi. Bugungi kunda universitetda jami ${(5000 + Math.floor(r5 * 35000)).toLocaleString()} faol talaba tahsil ko'rmoqda. O'qish sifati va nufuzi bo'yicha global QS reytingda ${ranking}-o'rinni egallab turibdi. Talabalar mamnunligi ko'rsatkichi ${(80 + r1 * 19).toFixed(1)}% ni tashkil qiladi. Eng faol fan turlari: Kompyuter texnologiyalari, Muhandislik, va xalq xorijiy innovatsiyalari. Ushbu oliy o'quv yurtiga bevosita mustaqil topshirish yillik shartnoma talabalariga ${acceptanceVal}% qabul (Acceptance Rate) imkoniyatini taqdim etadi. Xalqaro talabalar nisbati ${(3 + r2 * 27).toFixed(1)}% ni tashkil qiladi va bepul talabalar shaharchasi (yotoqxona) bilan ${90 + Math.floor(r3 * 10)}% kafolatlangan.`;

      const briefText = meta.briefs[Math.floor(r6 * meta.briefs.length)] + ` QS Rank: #${ranking}`;

      list.push({
        id: `uni-gen-${country.toLowerCase().replace(/[^a-z]/g, '')}-${i}`,
        name: uniName,
        country: country,
        city: city,
        brief: briefText,
        description: descText,
        ranking: ranking,
        documents: meta.docs,
        fee: meta.tuitionTemplate(i),
        deadlines: `Kuzgi semestr: ${1 + (i % 25)}-Iyul, Bahorgi semestr: ${5 + (i % 20)}-Dekabr`,
        website: `https://www.${uniName.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu`,
        rating: parseFloat(rateStars),
        featured: r5 > 0.85,
        grantPercent: r6 > 0.4 ? 100 : (r6 > 0.1 ? 50 : 30),
        minimumIelts: ieltsVal,
        minimumGpa: parseFloat(gpaVal),
        minimumSat: satVal
      });
    }
  }

  // Sort them so that featured and top rankings are bubbled up
  return list.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.ranking - b.ranking;
  });
}

export const universitiesData: University[] = generateUniversities();

export const uzTestQuestions: TestQuestion[] = [];

export const prepGuidesData: PrepGuide[] = [
  {
    id: "guide-1",
    title: "IELTS 8.5+ Ball Olisining Oltin Strategiyasi",
    type: "IELTS",
    description: "Listening, Reading, Writing hamda Speaking bo'limlaridan yuqori ball olish sirlari, shablonlar va insholarni tayyorlash tahlili.",
    content: "Ushbu qo'llanmada IELTS imtihonini muvaffaqiyatli topshirish uchun barcha to'rtta ko'nikma bo'yicha batafsil darslar keltirilgan. Writing Task 1 va Task 2 uchun tayyor advanced so'zlar va iboralar to'plami ilova qilingan. Speaking bo'limida ravon so'zlashish uchun 7 ta muhim qoida tushuntirilari.",
    downloadSize: "4.8 MB"
  },
  {
    id: "guide-2",
    title: "SAT Digital: Matematika va Verbal qismlari to'liq tahlil",
    type: "SAT",
    description: "Yangi raqamli SAT formatiga o'tganlar uchun Desmos kalkulyatoridan samarali foydalanish va Reading/Writing qismidagi tezkor qoidalar.",
    content: "SAT Digital imtihonida vaqtdan unumli foydalanish, Algebra, Advanced Math, Problem Solving va Geometry masalalarining algoritmlik yechimlari. Shuningdek, matnli savollarni 30 soniyada o'qib javob topish uslubiyati.",
    downloadSize: "6.2 MB"
  }
];
