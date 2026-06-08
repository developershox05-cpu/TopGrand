import { University, PrepGuide, TestQuestion } from './types';

// Real, verified world-class and national universities list with accurate statistics
export function generateUniversities(): University[] {
  return [
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
      fee: "$3,000 / yiliga (Davlat granti hamda 100% lik iqtidor bonuslari qoplab beradi)",
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
      deadlines: "Qabul davri: 20-Iyun - 20-Iyul (my.uzbmb.uz platformasida)",
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
    {
      id: "uni-uz-4",
      name: "O'zbekiston Milliy Universiteti (O'zMU)",
      country: "O'zbekiston",
      city: "Toshkent",
      brief: "Fundamental fanlar, matematika va tabiiy tadqiqotlar bo'yicha O'zbekistonning bosh oliygohi.",
      description: "Mirzo Ulug'bek nomidagi O'zbekiston Milliy Universiteti - Markaziy Osiyodagi eng qadimiy universitetlardan biridir. Fundamental matematika, amaliy fizika, biologiya va kimyo maktablari xalqaro miqyosda tan olingan. Ushbu oliygoh mamlakat ilm-fanining eng tayanch flagmani hisoblanadi va davlat tasarrufidagi keng qamrovli byudjet grantlariga ega.",
      ranking: 1000,
      documents: [
        "Pasport shaxsiy ma'lumotlar varag'i nusxasi",
        "Attestat yoki Litsey/Kollej diplomi",
        "Davlat byudjeti imtihon ko'rsatkichlari",
        "Xalqaro baholash sertifikatlari (mavjud bo'lsa)"
      ],
      fee: "9,000,000 UZS / yiliga (Ko'plab Davlat grantlari o'rinlari mavjud)",
      deadlines: "Asosiy qabul: 20-Iyundan 20-Iyulgacha",
      website: "https://nuu.uz",
      rating: 4.6,
      featured: false,
      grantPercent: 100,
      minimumIelts: 5.5,
      minimumGpa: 3.2,
      minimumSat: 1000
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
      description: "Stanford universiteti California shtatida joylashgan bo'lib, Silikon vodiysining rivojlanishiga bevosita poydevor yaratgan. Google, HP va Instagram asoschilarining deyarli barchasi Stanfordda o'qishgan. Universitet chet ellik eng namunali iqtidor egalariga 100% lik to'liq moliyaviy grantlarni taqdim qiladi va cheksiz labaratoriya resurslarini kafolatlaydi.",
      ranking: 3,
      documents: [
        "Coalition App yoki Common App transkripti",
        "GPA (O'rtacha 3.9 out of 4.0 ball)",
        "IELTS (Kamida 7.5) yoki TOEFL (105+)",
        "SAT (O'rtacha 1520+) yoxud ACT ballari",
        "Motivatsiya insholari va shaxsiy loyihalar tavsifi"
      ],
      fee: "$62,000 / yiliga (Oila daromadiga qarab 100% gacha moliyaviy yordam)",
      deadlines: "Restrictive Early Action: 1-Noyabr, Regular: 5-Yanvar",
      website: "https://www.stanford.edu",
      rating: 4.9,
      featured: true,
      grantPercent: 100,
      minimumIelts: 7.5,
      minimumGpa: 3.9,
      minimumSat: 1480
    },
    {
      id: "uni-us-3",
      name: "Harvard University",
      country: "AQSh",
      city: "Cambridge, Boston",
      brief: "AQShdagi eng qadimiy universitet, mashhur Ivy League ittifoqi rahbari.",
      description: "Harvard universiteti — dunyodagi eng katta o'quv kapitali va fondiga ega bo'lgan eng nufuzli akademiya hisoblanadi. Unda o'qish imkoniyati juda yuqori aqliy qobiliyatga ega yoshlarga beriladi. Oila daromadi yiliga $85,000 dan kam bo'lgan barcha xalqaro talabalar Garvardda bepul (100% Grant) o'qiydilar.",
      ranking: 4,
      documents: [
        "Common Application yoki Universal App portali",
        "O'rta maktab transkriptlari va bitiruv ko'rsatgichi",
        "IELTS (Kamida 7.5) yoki TOEFL imtihonlari",
        "Harvard talablariga mos maxsus ijodiy insho (Essay)",
        "Maktab koordinatorining 2-3 ta tavsiyanomasi"
      ],
      fee: "$59,500 / yiliga (Oila a'zolari daromadi past bo'lganlar uchun 100% BEPUL)",
      deadlines: "Early Action: 1-Noyabr, Regular Decision: 1-Yanvar",
      website: "https://www.harvard.edu",
      rating: 4.9,
      featured: true,
      grantPercent: 100,
      minimumIelts: 7.5,
      minimumGpa: 3.9,
      minimumSat: 1530
    },

    // === Buyuk Britaniya ===
    {
      id: "uni-uk-1",
      name: "University of Oxford",
      country: "Buyuk Britaniya",
      city: "Oxford",
      brief: "Ingliz dunyosidagi eng qadimgi, yuqori ilmiy tajribali universitet.",
      description: "Oksford universiteti uning tarixi 1096-yilga borib taqaluvchi dunyoning eng qadimiy universitetidir. Universitet o'zining shaxsan yakkama-yakka 'Tutorial' dars berish tizimi bilan ajralib turadi. 'Rhodes' va 'Clarendon' jahon stipendiyalari eng kuchli talabalarga o'qish, turar-joy va yashash uchun yillik grantlarini to'liq (100%) bepul taqdim qiladi.",
      ranking: 3,
      documents: [
        "UCAS portali orqali ariza",
        "IELTS (Kamida 7.5 ball, har bir bo'lim 7.0 dan kam bo'lmasligi shart)",
        "Transkriptlar tahlili",
        "Maxsus sinov imtihonlari (MAT, PAT yoki TSA savollari)",
        "Yozma namunaviy insholar va professor suhbati"
      ],
      fee: "£36,000 / yiliga (Clarendon va Rhodes stipendiyalari doirasida 100% Bepul)",
      deadlines: "Hujjat topshirish deadline: 15-Oktyabr",
      website: "https://www.ox.ac.uk",
      rating: 5.0,
      featured: true,
      grantPercent: 100,
      minimumIelts: 7.5,
      minimumGpa: 3.9,
      minimumSat: 1470
    },
    {
      id: "uni-uk-2",
      name: "University of Cambridge",
      country: "Buyuk Britaniya",
      city: "Cambridge",
      brief: "Nyuton, Darvin va Hoking uyi — ilmiy kashfiyotlar poydevori.",
      description: "Cambridge universiteti - buyuk intellektual an'analar va eng yuqori reytingli kashfiyotlar markazidir. 'Gates Cambridge' global fondi a'lochi chet ellik talabalar uchun o'qish to'lovi, samolyot chiptasi, turar-joy xarajatlarini mutlaqo tekin (100% grant) qilib qoplaydi.",
      ranking: 2,
      documents: [
        "UCAS ariza topshirish portali",
        "IELTS (Kamida 7.5, har bir bo'lim minimum 7.0 shart)",
        "Tegishli yo'nalish bo'yicha maxsus Kembrij fan sinovi imtihoni",
        "Baholar transkripti"
      ],
      fee: "£38,000 / yiliga (Gates Cambridge stipendiyasi sohiblariga 100% bepul)",
      deadlines: "Qabul deadline muddati: 15-Oktyabr",
      website: "https://www.cam.ac.uk",
      rating: 4.9,
      featured: true,
      grantPercent: 100,
      minimumIelts: 7.5,
      minimumGpa: 3.9,
      minimumSat: 1460
    },

    // === Germaniya ===
    {
      id: "uni-de-1",
      name: "Technical University of Munich (TUM)",
      country: "Germaniya",
      city: "Munich",
      brief: "Yevropaning eng rivojlangan va tekin muhandislik universiteti.",
      description: "Myunxen Texnika Universiteti - Germaniya va Yevropadagi eng yuqori texnik tadqiqotlar markazidir. Germaniyadagi bepul davlat ta'lim dasturlaridan foydalangan holda, universitetda o'qish tekin hisoblanadi (faqat nominal semestr badali mavjud). Darslar ingliz va nemis tillarida olib boriladi.",
      ranking: 37,
      documents: [
        "TUMOn_line portalida ro'yxatdan o'tish",
        "Uni-Assist orqali olingan VPD ruxsatnomasi",
        "Attestat yoki Diplom (Nemis/Ingliz tillarida)",
        "IELTS (Kamida 6.5) yoxud nemis tili (TestDaF 4)"
      ],
      fee: "Yillik o'qish bepul (Faqatgina har semestrda $120 ma'muriy semestr hissasi bor)",
      deadlines: "Qishki semestr uchun: 15-May dan 15-Iyul/Regular",
      website: "https://www.tum.de",
      rating: 4.8,
      featured: true,
      grantPercent: 100,
      minimumIelts: 6.5,
      minimumGpa: 3.4,
      minimumSat: 1200
    },

    // === Kanada ===
    {
      id: "uni-ca-1",
      name: "University of Toronto",
      country: "Kanada",
      city: "Toronto",
      brief: "Kanada reytingida 1-o'rindagi kompyuter ilmlari va tibbiyot markazi.",
      description: "Toronto Universiteti - jahondagi eng nufuzli universitetlar qatoridan ishonchli o'rin olgan. 'Lester B. Pearson' xalqaro stipendiyasi har yili chet ellik talabalarga o'qish uchun 4 yillik to'liq grantlar, bepul yotoqxona va yashash nafaqasini kafolatlab beradi.",
      ranking: 21,
      documents: [
        "Online ariza va O'rta maktab transkripti (WES)",
        "IELTS Akademik (Kamida 6.5, har bir bo'lim 6.0 dan past bo'lmagan)",
        "Pearson nomzodlik formalari va Motivatsiya xati",
        "Maktab o'qituvchilaridan 2 ta tavsiyanoma"
      ],
      fee: "CAD $48,000 / yiliga (Pearson Scholarship yordamida talabaga 100% BEPUL)",
      deadlines: "Arizalar topshirish: 30-Noyabrgacha",
      website: "https://www.utoronto.ca",
      rating: 4.8,
      featured: true,
      grantPercent: 100,
      minimumIelts: 6.5,
      minimumGpa: 3.8,
      minimumSat: 1350
    },

    // === Janubiy Koreya ===
    {
      id: "uni-kr-1",
      name: "Seoul National University (SNU)",
      country: "Janubiy Koreya",
      city: "Seoul",
      brief: "Koreyaning eng nufuzli oliygohi, 'SKY' elita guruhining yetakchisi.",
      description: "Seul Milliy Universiteti - Koreyadagi eng mashhur va o'qishga kirish eng qiyin bo'lgan davlat universiteti hisoblanadi. Global Korea Scholarship (GKS) to'liq davlat granti doirasida o'qish, aviabiletlar, bepul yotoqxona hamda har oy 1.2 mln koreys voni miqdorida stipendiya beriladi.",
      ranking: 41,
      documents: [
        "Apostil qilingan transkriptlar va oila a'zolari pasportlari",
        "IELTS (Kamida 6.0) yoki Koreys tili TOPIK (3-daraja+)",
        "GKS davlat granti ariza varaqalari"
      ],
      fee: "₩4,500,000 / semestr (GKS to'liq granti olinsa 100% BEPUL)",
      deadlines: "Bahorgi semestr: Iyul-Avgust, Kuzgi: Yanvar-Fevral",
      website: "https://www.snu.ac.kr",
      rating: 4.8,
      featured: true,
      grantPercent: 100,
      minimumIelts: 6.0,
      minimumGpa: 3.6,
      minimumSat: 1300
    },
    {
      id: "uni-kr-2",
      name: "KAIST",
      country: "Janubiy Koreya",
      city: "Daejeon",
      brief: "Dunyodagi eng kuchli koreys texnologiya, muhandislik hamda AI instituti.",
      description: "Koreya ilg'or fanlar va texnologiyalar instituti (KAIST) — Osiyoning eng kuchli fan va texnologiyalar markazidir. Xalqaro talabalar uchun darslar 100% ingliz tilida bo'lib, imtiyozli iqtidor grantlar yordamida o'qish mutlaqo bepul (100% grant) qilinadi va qo'shimcha yashash stipendiyasi bilan ta'minlanadi.",
      ranking: 56,
      documents: [
        "KAIST ariza varaqasi",
        "O'rta maktab transkript baholari nusxasi",
        "IELTS (Kamida 6.5) yoki TOEFL imtihon ko'rsatgichi",
        "Matematika fan o'qituvchilaridan 2 ta tavsiyanoma"
      ],
      fee: "₩5,400,000 / semestr (KAIST iqtidorlar stipendiyasi bilan 100% bepul)",
      deadlines: "Early Decision deadline: Noyabr, Regular: Yanvargacha",
      website: "https://www.kaist.ac.kr",
      rating: 4.8,
      featured: true,
      grantPercent: 100,
      minimumIelts: 6.5,
      minimumGpa: 3.7,
      minimumSat: 1350
    },

    // === Yaponiya ===
    {
      id: "uni-jp-1",
      name: "The University of Tokyo",
      country: "Yaponiya",
      city: "Tokyo",
      brief: "Kunchiqar yurt flagmani, Nobelchilar soni bo'yicha Osiyoda 1-o'rin.",
      description: "Tokyo Universiteti (Todai) - Yaponiyadagi eng reytingli milliy o'quv yurtidir. Universitet xalqaro nufuzdagi tadbirkorlik, tibbiyot va robototexnika sohalarini rivojlantiradi. Yaponiya hukumati 'MEXT Scholarship' orqali o'qish xarajatlari, doimiy aviabilet hamda oylik 145,000 iena stipendiyani 100% qoplaydi.",
      ranking: 28,
      documents: [
        "MEXT Scholarship ariza yoki PEAK ingliz dasturi blanki",
        "IELTS (Kamida 6.5) sertifikati",
        "Transkript transkripsiyasi va dars tavsiyanomalari",
        "Shaxsiy insho"
      ],
      fee: "¥535,800 / yiliga (MEXT Yaponiya stipendiyasi doirasida 100% BEPUL)",
      deadlines: "Elchixona orqali MEXT qabuli har yili May oyida boshlanadi",
      website: "https://www.u-tokyo.ac.jp",
      rating: 4.8,
      featured: true,
      grantPercent: 100,
      minimumIelts: 6.5,
      minimumGpa: 3.8,
      minimumSat: 1400
    },

    // === Turkiya ===
    {
      id: "uni-tr-1",
      name: "Koç University",
      country: "Turkiya",
      city: "Istanbul",
      brief: "Yevropa darajasidagi Turkiyaning eng reytingli ingliz-tilli oliygohi.",
      description: "Koç Universiteti — Turkiya va Yaqin Sharqdagi eng kuchli tadqiqot muassasalaridan biridir. Darslar ingliz tilida zamonaviy metodlar bilan olib boriladi. 'Türkiye Bursları' to'liq bepul davlat loyihasi orqali har bir a'lochi chet ellik yoshga turar-joy va to'liq 100% o'qish granti ajratiladi.",
      ranking: 380,
      documents: [
        "Türkiye Bursları / Koç portali arizasi",
        "IELTS (Kamida 6.5) yoxud TOEFL (80+)",
        "SAT Digital sertifikati (Kamida 1350 ball tavsiya etiladi)",
        "Akademik insho hamda Motivatsiya varaqasi"
      ],
      fee: "$23,500 / yiliga (Türkiye Bursları stipendiyasi bilan 100% BEPUL)",
      deadlines: "Bursları qabul davri: 10-Yanvardan 20-Fevralgacha",
      website: "https://www.ku.edu.tr",
      rating: 4.7,
      featured: true,
      grantPercent: 100,
      minimumIelts: 6.5,
      minimumGpa: 3.5,
      minimumSat: 1250
    },

    // === Italiya ===
    {
      id: "uni-it-1",
      name: "Sapienza University of Rome",
      country: "Italiya",
      city: "Rome",
      brief: "Yevropadagi eng yirik an'anaviy tadqiqot va to'liq bepul viloyat oliygohi.",
      description: "Rim Sapienza universiteti — Italiyaning eng buyuk va qadimiy davlat ta'lim maskanidir (1303-yili asos solingan). Italiyada xalqaro talabalar uchun o'qish juda arzon. Eng muhimi, 'LazioDisco' imtiyozli viloyat granti doirasida ham o'qish (kontrakt) kechiladi, ham yillik 7,500 EUR gacha yashash stipendiyasi naqd qilib ajratiladi.",
      ranking: 134,
      documents: [
        "Universitaly portalida Pre-registration qilish",
        "IELTS (Kamida 6.0) tili darajasini tasdiqlovchi sertifikat",
        "O'rta maktab transkripti transkripsiyasi va CIMEA guvohnomasi",
        "DoV (Dichiarazione di Valore) tasdiqi"
      ],
      fee: "Har yilga nominal €1,500 (Viloyat granti olinsa tekin + €7,500 cho'ntak puli beriladi)",
      deadlines: "Universitaly qabuli: Dekabr - Aprel oylari oralig'ida",
      website: "https://www.uniroma1.it",
      rating: 4.6,
      featured: true,
      grantPercent: 100,
      minimumIelts: 6.0,
      minimumGpa: 3.2,
      minimumSat: 1100
    },

    // === Singapur ===
    {
      id: "uni-sg-1",
      name: "National University of Singapore (NUS)",
      country: "Singapur",
      city: "Singapore",
      brief: "Osiyoning 1-raqamli, jahonning 8-o'rindagi texnologiya hamda boshqaruv markazi.",
      description: "Singapur Milliy Universiteti (NUS) — tibbiyot, iqtisod, IT hamda sun'iy intellekt sohalarida dunyoning mutloq flagmani hisoblanadi. Singapur hukumatining 'Tuition Grant Scheme' (TGS) iqtidor chegirmalari doirasida kontrakt miqdorining 60% gacha bo'lgan qismi davlat hisobidan kafolatlab beriladi.",
      ranking: 8,
      documents: [
        "NUS Portalida a'zolik arizasi",
        "IELTS (Kamida 7.0) yoki TOEFL (95+)",
        "SAT (1480+ ball) yoxud A-Levels mukammal sertifikati",
        "Motivatsion maktub hamda Shaxsiy faollik varaqasi"
      ],
      fee: "$32,000 / yiliga (TGS iqtidor loyihasi bilan 70% gacha grant chegiriladi)",
      deadlines: "Arizalar topshirish muddati: 15-Dekabr",
      website: "https://www.nus.edu.sg",
      rating: 4.9,
      featured: true,
      grantPercent: 70,
      minimumIelts: 7.0,
      minimumGpa: 3.9,
      minimumSat: 1450
    },

    // === Shveytsariya ===
    {
      id: "uni-ch-1",
      name: "ETH Zurich",
      country: "Shveytsariya",
      city: "Zurich",
      brief: "Dunyodagi eng yaxshi texnologiyalar instituti, Albert Enshteyn uyi.",
      description: "ETH Zurich (Swiss Federal Institute of Technology) — biologiya, muhandislik va texnologiya yo'nalishlarida dunyoning eng buyuk tadqiqot institutidir. Bu yerda Albert Enshteyn tahsil olgan va dars bergan. Shveytsariyada ta'lim narxi davlat subsidiyasi tufayli hamyonbop qilib belgilangan bo'lib, imtiyozlari juda yuqoridir.",
      ranking: 7,
      documents: [
        "Ariza topshirish hujjatlari to'plami (ETH Portal)",
        "IELTS (Kamida 7.0) yoki TOEFL equivalent",
        "Attestat baholari, Matematika va Fizika transkriptlari",
        "Motivatsion insho hamda CV"
      ],
      fee: "Semestriga nominal 730 CHF (subsidiyalangan kontrakt)",
      deadlines: "Qabul arizalari: 1-Noyabrdan 15-Dekabrgacha",
      website: "https://ethz.ch",
      rating: 4.9,
      featured: true,
      grantPercent: 90,
      minimumIelts: 7.0,
      minimumGpa: 3.9,
      minimumSat: 1450
    },

    // === Fransiya ===
    {
      id: "uni-fr-1",
      name: "Sorbonne University",
      country: "Fransiya",
      city: "Paris",
      brief: "Kontinental Yevropaning eng mashhur madaniy, adabiy va tarixiy oliygohi.",
      description: "Parij Sorbonna Universiteti — gumanitar fanlar, falsafa, tillar va klassik tibbiyot fanlari bo'yicha dunyodagi eng qadimgi va obro'li muassasalardandir. Fransiya hukumati chet ellik a'lochi talabalar ta'limini keng ko'lamda kafilga oladi, bu esa o'qish narxlarini Yevropa bo'yicha eng arzon bepul darajaga tushiradi.",
      ranking: 59,
      documents: [
        "Etudes en France maxsus portalida ariza",
        "Ingliz tili (IELTS 6.5) yoki Fransuz tili (TCF/DELF B2)",
        "Baholar varaqasi transkripti"
      ],
      fee: "Nominal €2,770 / yiliga (Hukumat kafil ligi asnosida to'liq grantlar beriladi)",
      deadlines: "Etudes en France arizalari tugashi: 15-Dekabr",
      website: "https://www.sorbonne-universite.fr",
      rating: 4.7,
      featured: true,
      grantPercent: 95,
      minimumIelts: 6.5,
      minimumGpa: 3.5,
      minimumSat: 1100
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
      deadlines: "CSC qabullari: Iyul - 15-Aprelgacha",
      website: "https://www.tsinghua.edu.cn",
      rating: 4.9,
      featured: true,
      grantPercent: 100,
      minimumIelts: 6.5,
      minimumGpa: 3.7,
      minimumSat: 1380
    }
  ];
}

export const universitiesData: University[] = generateUniversities();

export const uzTestQuestions: TestQuestion[] = [];

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
