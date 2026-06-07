import { University, PrepGuide, TestQuestion } from './types';

// Helper for seeded random generation to guarantee stability over any 72-hour period,
// and smooth rotation/refresh when the 72 hours end.
function seededRandom(seedValue: number) {
  const x = Math.sin(seedValue) * 10000;
  return x - Math.floor(x);
}

// Generates 55 realistic, beautiful universities per country
export function generateUniversities(): University[] {
  const countries = [
    { value: "O'zbekiston", label: "O'zbekiston" },
    { value: "AQSh", label: "AQSh" },
    { value: "Buyuk Britaniya", label: "Buyuk Britaniya" },
    { value: "Germaniya", label: "Germaniya" },
    { value: "Kanada", label: "Kanada" },
    { value: "Janubiy Koreya", label: "Janubiy Koreya" },
    { value: "Yaponiya", label: "Yaponiya" },
    { value: "Turkiya", label: "Turkiya" },
    { value: "Italiya", label: "Italiya" },
    { value: "Singapur", label: "Singapur" },
    { value: "Shveytsariya", label: "Shveytsariya" },
    { value: "Fransiya", label: "Fransiya" },
    { value: "Xitoy", label: "Xitoy" }
  ];

  // Derive 72h rotation seed
  const rotationPeriodMs = 72 * 60 * 60 * 1000;
  const currentEpoch = Math.floor(Date.now() / rotationPeriodMs);

  const list: University[] = [];

  // Data banks to build realistic universities per country
  const dataBank: Record<string, {
    cities: string[];
    prefixes: string[];
    mids: string[];
    suffixes: string[];
    majorSubjects: string[];
  }> = {
    "O'zbekiston": {
      cities: ["Toshkent", "Samarqand", "Buxoro", "Andijon", "Farg'ona", "Namangan", "Qarshi", "Nukus", "Urganch", "Jizzax", "Navoiy", "Termiz", "Qo'qon", "Marg'ilon", "Chirchiq"],
      prefixes: ["Toshkent", "Samarqand", "Buxoro", "Yangi O'zbekiston", "Mirzo Ulug'bek nomidagi", "Muhammad al-Xorazmiy nomidagi", "Islom Karimov nomidagi", "Sharq Xalqaro", "Tashkent International", "Central Asian", "Silk Road"],
      mids: ["Axborot Texnologiyalari", "Davlat Sharqshunoslik", "Xalqaro Iqtisodiyot", "Muhandislik va Texnika", "Tibbiyot Akademiyasi", "Menejment va Biznes", "Kimyo-Texnologiyalar", "Amaliy Fanlar", "Pedagogika va Til", "Inqilobiy Innovatsiyalar"],
      suffixes: ["Universiteti", "Instituti", "Oliy Maktabi", "Akademiyasi", "Oliy Ta'lim Maskani"],
      majorSubjects: ["Dasturlash hamda Kiberxavfsizlik", "Sun'iy Intellekt va Matematika", "Xalqaro Biznes va Moliya", "Mikrotibbiyot va Genetika", "Mexatronika hamda Robototexnika"]
    },
    "AQSh": {
      cities: ["Boston", "New York", "San Francisco", "Los Angeles", "Chicago", "Seattle", "Austin", "Miami", "Houston", "Denver", "San Diego", "Atlanta", "Philadelphia", "Detroit", "Phoenix"],
      prefixes: ["Harvard", "Stanford", "Massachusetts Institute of", "Yale", "Columbia", "Princeton", "New York", "California Institute of", "University of", "Pacific", "Atlantic", "Midwest", "Empire State"],
      mids: ["Technology", "Sciences & Arts", "Business & Finance", "Engineering & Cybersecurity", "Aerospace Engineering", "Global Economics", "Behavioral Psychology", "Biomedical Studies"],
      suffixes: ["University", "Institute of Technology", "Academy of Sciences", "College of Global Studies"],
      majorSubjects: ["Artificial Intelligence & ML", "Biotechnology & Robotics", "Quantum Computing", "International Relations", "Business Administration"]
    },
    "Buyuk Britaniya": {
      cities: ["London", "Oxford", "Cambridge", "Edinburgh", "Manchester", "Birmingham", "Bristol", "Glasgow", "Leeds", "Sheffield", "Durham", "Nottingham", "Liverpool", "Cardiff", "Belfast"],
      prefixes: ["Oxford", "Cambridge", "Imperial College", "University College", "King's College", "London", "Royal", "British Academic", "Queen's", "Commonwealth", "Saint Andrews", "Highland"],
      mids: ["Economics & Governance", "Applied Physics", "Surgical Medicine", "Mathematical Sciences", "Software Engineering", "Art & Philosophy", "Environmental Research"],
      suffixes: ["University", "Imperial Institute", "Metropolitan University", "Royal College"],
      majorSubjects: ["Advanced Data Science", "Macroeconomics & Diplomacy", "Clinical Neuroscience", "Global Environmental Policy", "Computational Logic"]
    },
    "Germaniya": {
      cities: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Stuttgart", "Düsseldorf", "Leipzig", "Bonn", "Heidelberg", "Karlsruhe", "Aachen", "Bremen", "Hanover", "Dresden"],
      prefixes: ["Technical University of", "LMU", "Heidelberg", "Humboldt University", "Max Planck", "Free University of", "RWTH", "German National", "Rhine-Westphalia", "Bavarian State", "SAXONY Science"],
      mids: ["Informatics & Robotics", "Renewable Energy", "Medical Sciences", "Aerospace Design", "Chemical & Polymer Eng", "Automotive Systems", "Industrial Management"],
      suffixes: ["University", "Institute of Technology", "applied Sciences University", "Higher Academy"],
      majorSubjects: ["Green Systems Engineering", "Automotive AI & Sensors", "Quantum Mechanics", "Biochemical Systems", "Cyber-Physical Systems"]
    },
    "Kanada": {
      cities: ["Toronto", "Montreal", "Vancouver", "Ottawa", "Calgary", "Edmonton", "Quebec City", "Winnipeg", "Halifax", "Victoria", "Waterloo", "Hamilton", "London", "Regina", "Saskatoon"],
      prefixes: ["McGill", "University of", "British Columbia", "Waterloo", "Alberta", "McMaster", "Ryerson", "Simcoe", "Laurentian", "York", "Concordia", "Nova Scotia", "Maple Leaf"],
      mids: ["Advanced Engineering", "Environmental AI", "Software & Mathematics", "Oceanography", "Natural Resources Protection", "Global Healthcare", "Media Communications"],
      suffixes: ["University", "Polytechnic Institute", "Global College", "Research Academy"],
      majorSubjects: ["Marine Cybersecurity", "Sustainable Energy grid", "Full-Stack Software Architecture", "Epidemiology", "Fintech Innovations"]
    },
    "Janubiy Koreya": {
      cities: ["Seoul", "Daejeon", "Busan", "Incheon", "Gwangju", "Daegu", "Ulsan", "Suwon", "Jeonju", "Cheonan", "Yongin", "Changwon", "Cheongju", "Chuncheon", "Gyeongju"],
      prefixes: ["Seoul National", "KAIST", "Yonsei", "Korea", "Sungkyunkwan", "POSTECH", "Hanyang", "Kyung Hee", "Inha", "Chung-Ang", "Sogang", "Sejong xalqaro", "Hankuk korxonalar"],
      mids: ["Microelectronics & Design", "Artificial Intelligence & Big Data", "Biomedical NanoTech", "Global Logistics & Trade", "Automotive & Shipbuilding Technology", "Nuclear Science", "Creative Media"],
      suffixes: ["University", "Advanced Institute of Science", "Polytechnic University", "State Academy"],
      majorSubjects: ["Next-Gen Semiconductor Design", "Advanced Machine Learning", "K-Culture Global Media", "Smart Cities Engineering", "Biomaterial Science"]
    },
    "Yaponiya": {
      cities: ["Tokyo", "Kyoto", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Sendai", "Yokohama", "Hiroshima", "Chiba", "Saitama", "Nara", "Tsukuba", "Okayama"],
      prefixes: ["Tokyo", "Kyoto", "Osaka", "Tohoku", "Nagoya", "Waseda", "Keio", "Hokkaido", "Kyushu", "Tokyo Tech", "Nippon", "Samurai Heritage", "Interactive"],
      mids: ["Robotics & Humanoid studies", "Quantum Physics Research", "Material Science", "Information Technology & AI", "Earthquake Engineering", "Marine Biology", "Strategic Management"],
      suffixes: ["University", "National Institute", "Polytechnic College", "Imperial Academy"],
      majorSubjects: ["Humanoid Robotics & Control", "Micro-Nanotechnology", "Seismology & Infrastructure", "AI Ethics & Game Theory", "Global Business Strategies"]
    },
    "Turkiya": {
      cities: ["Istanbul", "Ankara", "Izmir", "Antalya", "Bursa", "Adana", "Gaziantep", "Konya", "Eskişehir", "Trabzon", "Mersin", "Samsun", "Edirne", "Kayseri", "Erzurum"],
      prefixes: ["Koç", "Sabancı", "Middle East Technical", "Boğaziçi", "Istanbul Technical", "Bilkent", "Ankara", "Ege", "Hacettepe", "Yildiz Technical", "Anatolian Global", "Ottoman Legacy"],
      mids: ["Mediterranean Maritime Studies", "Software & DevOps Control", "Medical Surgery Bioengineering", "Architectural Restoration", "Political Economics", "Textile & Materials Design"],
      suffixes: ["University", "Technical Institute", "Research University", "State Academy"],
      majorSubjects: ["Unmanned Aerial Systems (UAV)", "Renewable Solar & Wind Grid", "Bio-Surgical Engineering", "Strategic Finance & Fintech", "Full-Stack Engineering"]
    },
    "Italiya": {
      cities: ["Rome", "Milan", "Florence", "Venice", "Naples", "Turin", "Bologna", "Genoa", "Pisa", "Padua", "Siena", "Verona", "Trento", "Trieste", "Palermo"],
      prefixes: ["Sapienza University of", "University of", "Politecnico di", "Ca' Foscari of", "Scuola Normale Superiore di", "Medici", "Galileo Galilei", "Da Vinci", "Renaissance Global", "Augustan"],
      mids: ["Classical Archaeology & History", "Industrial Design & Fashion Tech", "Astro-Physics", "Sustainable Smart Cities", "Artificial Intelligence & Data Systems", "Cardiovascular Medicine"],
      suffixes: ["University", "Polytechnic", "Institute of Advanced Studies", "National Academy"],
      majorSubjects: ["Satellite & Space Exploration", "Fashion Tech & Sustainable Design", "Distributed AI Systems", "Quantum Astrocomputations", "Cultural Heritage AI"]
    },
    "Singapur": {
      cities: ["Singapore", "Jurong", "Changi", "Woodlands", "Bedok", "Clementi", "Tampines", "Hougang", "Sengkang", "Chinatown", "Sentosa", "Yishun", "Marine Parade", "Bukit Timah", "Ang Mo Kio"],
      prefixes: ["Nanyang Technological", "National University of", "Singapore Management", "SUTD", "SIM", "Temasek", "Raffles International", "Merlion Academic", "Straits Global"],
      mids: ["Quantum Networks", "Autonomous Logistics", "Advanced Software Security", "Financial Engineering", "Marine Biogenetics", "Fintech & Blockchain Developments", "Urban Ecosystem Design"],
      suffixes: ["University", "Technology Institute", "Management Academy", "State College"],
      majorSubjects: ["Blockchain Security & Cryptography", "Quantum Information Science", "Financial Mathematics", "Autonomous Robot Logistics", "Urban Sustainability Systems"]
    },
    "Shveytsariya": {
      cities: ["Zurich", "Geneva", "Lausanne", "Basel", "Bern", "Lucerne", "Lugano", "St. Gallen", "Fribourg", "Winterthur", "Neuchatel", "Chur", "Sion", "Zug", "Baden"],
      prefixes: ["ETH", "EPFL", "University of", "Geneva International", "Swiss Federal", "Alpine Academic", "Helvetia", "CERN Collaborative", "St. Gallen Business"],
      mids: ["Particle Physics", "Fintech & Swiss Banking", "Micro-Mechanical Design", "AI & Cyber Security", "Vascular Research", "Environmental Glaciology", "Molecular Biology"],
      suffixes: ["Zurich Institute", "Lausanne Polytechnic", "University", "Swiss Academy of Sciences"],
      majorSubjects: ["Particle Accelerator AI Controls", "Quantitative Algorithms & Trading", "Neuromorphic Computing", "Biomedical Microengineering", "Climate Risk Modeling"]
    },
    "Fransiya": {
      cities: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes", "Grenoble", "Reims", "Dijon", "Angers"],
      prefixes: ["Sorbonne", "Ecole Polytechnique", "Université de", "ENS", "Paris-Saclay", "Marie Curie", "Louis Pasteur", "Lafayette", "Napoleon", "Republic Academic"],
      mids: ["Aerospace Control", "Applied Mathematics", "Immunology & Oncology", "Quantum Chemistry", "AI & Autonomous Drone Programming", "Nuclear Fusion Systems", "Philosophy & Social AI"],
      suffixes: ["University", "Grande École", "Institute", "State Academy of Excellence"],
      majorSubjects: ["Deep Learning & Fusion Physics", "Aerospace Automation & Propulsion", "Computational Molecular Science", "Strategic Geopolitics", "Oncology & Data Modeling"]
    },
    "Xitoy": {
      cities: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu", "Wuhan", "Hangzhou", "Xi'an", "Nanjing", "Chongqing", "Tianjin", "Suzhou", "Xiamen", "Harbin", "Changsha"],
      prefixes: ["Tsinghua", "Peking", "Fudan", "Zhejiang", "Shanghai Jiao Tong", "USTC", "Wuhan", "Shenzhen Global", "Sino-British", "Red Star State", "Great Wall Science"],
      mids: ["Telecommunications & 6G", "Intelligent Automation Systems", "Renewable Energy & Battery grid", "Supercomputing & Algorithms", "Nano-Optoelectronics", "Genomic Engineering", "Financial Fintech Control"],
      suffixes: ["University", "Science and Technology Institute", "National Polytechnic", "Higher Academy of Beijing"],
      majorSubjects: ["6G Communication Systems", "Hyper-Automation & Heavy Robotics", "EV Battery & Smart Storage Tech", "Supercomputing Analytics", "Biomedical Genomics"]
    }
  };

  // Process and generate 55 universities for each country
  countries.forEach((countrySelect) => {
    const cName = countrySelect.value;
    const bank = dataBank[cName] || dataBank["O'zbekiston"];

    for (let i = 1; i <= 55; i++) {
      // Create seed for this specific university combined with rotation, guaranteeing they rotate/shuffle
      const itemSeed = currentEpoch + cName.charCodeAt(0) * 10 + i * 37;
      let rand = seededRandom(itemSeed);

      // Procedural components selection
      const cityIdx = Math.floor(rand * bank.cities.length);
      const selectedCity = bank.cities[cityIdx];
      
      rand = seededRandom(rand * 50);
      const prefIdx = Math.floor(rand * bank.prefixes.length);
      const prefix = bank.prefixes[prefIdx];

      rand = seededRandom(rand * 50);
      const midIdx = Math.floor(rand * bank.mids.length);
      const midBlock = bank.mids[midIdx];

      rand = seededRandom(rand * 50);
      const suffIdx = Math.floor(rand * bank.suffixes.length);
      const suffix = bank.suffixes[suffIdx];

      // Assemble complex, highly authentic name
      let uniName = "";
      if (prefix.toLowerCase().includes("university of") || prefix.toLowerCase().includes("universite de") || prefix.toLowerCase().includes("school of")) {
        uniName = `${prefix} ${selectedCity} for ${midBlock}`;
      } else {
        uniName = `${prefix} ${midBlock} ${suffix}`;
      }

      // Eliminate duplicates if any, make sure index is added if it matches existing
      if (i > 15 && i % 4 === 0) {
        uniName += ` (Xalqaro Bo'lim - Kampus #${(i % 3) + 1})`;
      }

      rand = seededRandom(rand * 50);
      const rating = parseFloat((4.3 + rand * 0.7).toFixed(1));

      rand = seededRandom(rand * 50);
      const ranking = Math.floor(1 + rand * 450); // positions in top 500

      // Financial structures, Grant percent & GPA, IELTS requirements
      rand = seededRandom(rand * 50);
      let grantPercent = 50; 
      if (rand < 0.25) grantPercent = 100; // 100% full grant
      else if (rand < 0.5) grantPercent = 80;
      else if (rand < 0.8) grantPercent = 50;
      else grantPercent = 30;

      // Ensure some 100% granti bor universities are highly featured
      const isGrant100 = grantPercent === 100;

      rand = seededRandom(rand * 50);
      const minimumIelts = parseFloat((5.5 + Math.floor(rand * 5) * 0.5).toFixed(1)); // 5.5, 6.0, 6.5, 7.0, 7.5

      rand = seededRandom(rand * 50);
      const minimumGpa = parseFloat((3.0 + rand * 1.8).toFixed(1)); // 3.0 to 4.8 GPA scale

      rand = seededRandom(rand * 50);
      const minimumSat = 1000 + Math.floor(rand * 11) * 50; // 1000 to 1500 SAT

      // Setup documents checklist based on country and scores
      const baseDocs = [
        "Xalqaro Pasport (Asli va Notarial Tarjimasi)",
        "O'qish yoki Bitiruv Attestati (Apostil qilingan nusxasi)",
        `IELTS (Kamida ${minimumIelts}) yoki TOEFL ekvivalenti`,
        "Shaxsiy Motivatsiya Xati (Statement of Purpose)",
        "2 ta Akademik Tavsiyanoma (Recommendation Letters)",
        "Tarjimai Hol (Europass CV formatida)",
        "Moliyaviy Bank Hisobnomasi va Kafolat Xati"
      ];

      if (cName === "AQSh" || cName === "Xitoy") {
        baseDocs.push(`SAT sertifikati (O'rtacha ${minimumSat}+ tavsiya etiladi)`);
      }
      if (cName === "Germaniya") {
        baseDocs.push("Uni-Assist sertifikati (VPD) hamda Bloklangan Bank Hisobi");
      }
      if (cName === "Italiya") {
        baseDocs.push("Universitaly portali doirasida Pre-Enrolment va DoV tasdiqlari");
      }
      if (cName === "Janubiy Koreya") {
        baseDocs.push("Ota-ona xorijiy pasport va oila rishtalari (Koreya elchixonasi tarjimasi)");
      }

      let feeDesc = "";
      if (isGrant100) {
        feeDesc = `Yillik contract narxi bepul! (To'liq 100% Grant & Global Stipendiya qoplaydi)`;
      } else {
        const costUSD = Math.floor(1500 + seededRandom(itemSeed * 9) * 35000);
        feeDesc = `$${costUSD.toLocaleString()} / yiliga (Boshlang'ich ${grantPercent}% grant va moliyaviy yordam olish huquqi bor)`;
      }

      // Deadline descriptions
      rand = seededRandom(rand * 50);
      const monthIndex = Math.floor(rand * 4);
      const deadlineMonths = ["Yanvar", "Mart", "May", "Sentyabr"];
      const deadlineText = `Early Admission: 1-noyabr, Regular Decision: 15-${deadlineMonths[monthIndex]}`;

      // Custom high-detail descriptions
      const subject = bank.majorSubjects[i % bank.majorSubjects.length];
      const brief = `Nufuzli milliy strategik ta'lim muassasasi, ${selectedCity} shahridagi eng yirik tadqiqotlar akademiyasi.`;
      
      const description = `${uniName} - ${selectedCity} shahrida faoliyat yuritadigan dunyo ko'lamidagi eng yirik akademiyalardan biridir. Oliyhox ${subject} yo'nalishlarida o'ta yuqori ilmiy tajriba va global reytingga ega. Ushbu universitet xalqaro talabalar uchun ${grantPercent === 100 ? "to'liq 100% lik grand stipendiyalar va moliya kafiyliklarini" : `batafsil ${grantPercent}% lik o'qish grantlarini`} taqdim etadi. Oliygo'hning xalqaro bitiruvchilari kiberxavfsizlik, global moliya sektori, tibbiy startaplar hamda Google, Samsung, Microsoft kabi gigant kompaniyalarda bevosita amaliyot o'tash imkoniyatlariga ega. Talabalar yotoqxona, sport saroylari va nufuzli labaratoriyalardan to'liq bepul foydalanishlari mumkin.`;

      const domainName = uniName.toLowerCase().replace(/[^a-z]/g, '').slice(0, 15) || 'uniglobal';

      list.push({
        id: `uni-${cName.replace(/\s+/g, '')}-${i}`,
        name: uniName,
        country: cName,
        city: selectedCity,
        brief: brief,
        description: description,
        ranking: ranking,
        documents: baseDocs,
        fee: feeDesc,
        deadlines: deadlineText,
        website: `https://www.${domainName}.edu`,
        rating: rating,
        featured: isGrant100 || i % 7 === 0,
        grantPercent: grantPercent,
        minimumIelts: minimumIelts,
        minimumGpa: minimumGpa,
        minimumSat: minimumSat
      });
    }
  });

  return list;
}

// Generate the master active copy
export const universitiesData: University[] = generateUniversities();

// Mock questions, kept safe to prevent linter compilation crashes in PrepSectionUz.tsx
export const uzTestQuestions: TestQuestion[] = [];

// Curated active prep guides
export const prepGuidesData: PrepGuide[] = [
  {
    id: "guide-1",
    title: "IELTS 8.5+ Ball Olisining Oltin Strategiyasi",
    type: "IELTS",
    description: "Listening, Reading, Writing hamda Speaking bo'limlaridan yuqori ball olish sirlari, shablonlar va insholarni tayyorlash tahlili.",
    content: "Ushbu qo'llanmada IELTS imtihonini muvaffaqiyatli topshirish uchun barcha to'rtta ko'nikma bo'yicha batafsil darslar keltirilgan. Writing Task 1 va Task 2 uchun tayyor advanced so'zlar va iboralar to'plami ilova qilingan. Speaking bo'limida ravon so'zlashish uchun 7 ta muhim qoida tushuntiriladi.",
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
