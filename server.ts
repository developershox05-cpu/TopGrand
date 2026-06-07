import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Parse request bodies as JSON
app.use(express.json());

// Initialize Gemini Client safely
const apiKey = process.env.GEMINI_API_KEY || "AQ.Ab8RN6KEVj81rU8U8oOIjYGHB64USSlR-lQ_UiFYdyuO4Dr5_w";
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey || apiKey === "MOCK_KEY") {
      console.warn("⚠️ Warning: GEMINI_API_KEY is not defined. AI features will fall back to simulated responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "alive", code: 200, time: new Date().toISOString() });
});

// Main AI Central Processing Endpoint
app.post("/api/ai/generate", async (req, res) => {
  const { toolType, inputData, userContext } = req.body;

  if (!toolType) {
    return res.status(400).json({ error: "toolType parametr topilmadi." });
  }

  // Define specialized system instructions for all 14 tools
  let systemInstruction = "";
  let prompt = "";

  const userName = userContext?.name ? `${userContext.name} ${userContext?.surname || ""}` : "Talaba";

  switch (toolType) {
    case "essay":
      systemInstruction = "Siz xalqaro darajadagi akademik insho analitigi va IELTS/SAT Writing bo'yicha Senior Examiner hisoblanasiz. Berilgan inshoni grammatika, so'z boyligi, mantiqiy tuzilish (cohesion) va topshiriq mosligi bo'yicha tahlil qiling. Xatolarni o'zbek tilida aniq misollar bilan tuzatib bering, taxminiy Band score (1-9) qo'ying va inshoni 8.0+ darajaga olib chiqish bo'yicha tavsiyalar ulashing.";
      prompt = `Foydalanuvchi inshosi: ${inputData?.essayText || ""}\nMavzu (agar bor bo'lsa): ${inputData?.topic || "Umumiy akademik insho"}`;
      break;

    case "interview":
      systemInstruction = "Siz Harvard, Oxford kabi eng nufuzli jahon universitetlarining qabul komissiyasi bosh suhbatdoshisiz (Admission Interviewer). Talaba bilan qiziqarli va professional suhbat olib boring. Qisqa, lo'nda va samimiy gapiring. O'zbek tilida, uning javoblarini professional va xushmuomalalik bilan tahlil qilib, suhbatni chuqurlashtiruvchi keyingi mantiqiy, daxshatli qiziqarli savolni bering.";
      prompt = `Talabaning ismi: ${userName}\nTopshirayotgan mutaxassisligi: ${inputData?.major || "Ixtiyoriy"}\nSuhbat bosqichi: ${inputData?.history?.length || 0}-savol javobi.\nSuhbat tarixi/javoblar: ${JSON.stringify(inputData?.history || [])}\n\nIltimos, oldingi javoblarni baholang va diqqatni jalb qiladigan yangi bitta savol yoki xulosa bering.`;
      break;

    case "chat":
      systemInstruction = "Siz TopGrand platformasining xalqaro oliygohlar, grantlar va viza masalalari bo'yicha daxshatli tajribali sun'iy intellekt maslahatchisisiz. Shaffof, litsenziyasiz yoki bepul o'qish yo'llari, hujjatlarni konsultinglarsiz bevosita topshirish sirlarini bilasiz. Maqsadingiz o'quvchilarga to'g'ri, xolis, bepul va aniq yechimlarni taqdim etishdir.";
      prompt = `Talaba ismi: ${userName}\nSavol: ${inputData?.userMessage || "Xalqaro grantlar haqida qisqacha ma'lumot bering."}`;
      break;

    // 10+ Extra Interactive AI functions
    case "cv_optimizer":
      systemInstruction = "Siz professional xalqaro HR va akademik Resume/CV optimizatori mutaxassisisiz. Talaba taqdim etgan hozirgi rezyume ma'lumotlarini tahlil qiling, ularni xalqaro darajada raqobatbardosh (ATS-friendly, akademik) qilish uchun o'zgartirishlar, kuchli ta'sirchan fe'llar ro'yxatini va professional o'zbekcha/inglizcha tavsiyalar bering.";
      prompt = `Talaba CV matni: ${inputData?.cvText || ""}\nMaqsadli davlatlar: ${inputData?.targetRegion || "Barcha"}`;
      break;

    case "lor_generator":
      systemInstruction = "Siz nufuzli professor, maktab direktori yoki akademik rahbar rolining egasisiz (Recommender). Talabaning ko'rsatilgan fazilatlari, fan sohalari va yutuqlari asosida jahon standartlariga 100% javob beradigan, mukammal, o'ziga jalb qiluvchi Tavsiyanoma (Recommendation Letter - LOR) matnini (ingliz tilida, uning tarkibiy qismlarini o'zbekcha izohlar bilan) yozib bering.";
      prompt = `Talabaning ismi: ${userName}\nUshbu talabaning yutuqlari va xislatlari: ${inputData?.strengths || ""}\nTavsiya berayotgan shaxs (professor/o'qituvchi): ${inputData?.recommenderRole || "Fizika o'qituvchisi"}`;
      break;

    case "motivation_generator":
      systemInstruction = "Siz xalqaro insho maslahatchisisiz. Berilgan ma'lumotlardan foydalanib, qabul komissiyasi a'zolarini uning shaxsi va ishtiyoqiga ishontiradigan mukammal va realistik Motivatsiya xati (Motivation Letter - statement of purpose) matnini (Ingliz tilida, darslik izohlarini o'zbekcha qilib) generatsiya qiling.";
      prompt = `Talabaning yutuqlari va tanlagan mutaxassisligi: ${inputData?.skillsMajor || ""}\nTanlagan davlat/oliygoh: ${inputData?.targetUniversity || "Xalqaro universitet"}\nInsho uslubi: ${inputData?.tone || "Professional va samimiy"}`;
      break;

    case "scholarship_matcher":
      systemInstruction = "Siz global stipendiyalar va xalqaro moliya grantlari bo'yicha yetakchi dasturchi-inspektorsiz. Foydalanuvchining GPA (o'rtacha bahosi), til bilish sertifikati (IELTS/TOEFL) va darajasiga qarab, dunyodagi eng nufuzli 100% grant dasturlarini (Italiya DSU, Germaniya bepul, Koreya GKS, Turkiya Burslari, Ruminiya hukumati granti, Chexiya) saralab bering.";
      prompt = `Talaba yoshi: ${inputData?.age || "18"}\nGPA balingiz: ${inputData?.gpa || "4.5"}\nIELTS/SAT native ballari: ${inputData?.languageScore || "Yo'q"}\nQiziqayotgan yo'nalishi: ${inputData?.major || "Ixtiyoriy"}`;
      break;

    case "vocab_booster":
      systemInstruction = "Siz IELTS lug'atini unikal o'rgatuvchi tizimsiz. Foydalanuvchiga muayyan mavzu yoki so'z bering va u bo'yicha Writing/Speaking bo'limlarida 8.5+ ball beradigan yuqori saviyadagi (Collocations, Idioms, Academic words) sinonimlar to'plami hamda o'zbek tilidagi mukammal darsini taqdim eting.";
      prompt = `Qaysi mavzuda so'z boyligi kerak: ${inputData?.topic || "Sog'liqni saqlash yoki Ta'lim"}\nHozirgi darajasi: ${inputData?.currentLevel || "Intermediate"}`;
      break;

    case "student_budget":
      systemInstruction = "Siz xalqaro talabalar uchun shaxsiy moliyaviy budjet rejalashtiruvchi mutaxassissiz. Talaba borayotgan yoki maqsad qilgan davlatda (masalan, AQSh, Polsha, Italiya, Janubiy Koreya, Yaponiya) oylik va yillik yashash qiymatini (uy-joy, oziq-ovqat, sug'urta, transport) daxshat darajada hisob-kitob qilib, studentlar uchun pullarni tejash sirlarini yozing.";
      prompt = `Maqsadli davlat: ${inputData?.country || "Germaniya"}\nYashash uslubi: ${inputData?.lifestyle || "Tejamkor (Xonadosh bilan/Yotoqxona)"}`;
      break;

    case "visa_sop":
      systemInstruction = "Siz Elchixonalarda Vizuallik va Statement of Purpose tahlilchisisiz. Talaba viza uchun (masalan, AQSh F-1, Janubiy Koreya D-2, Germaniya milliy vizasi) tayyorlayotgan reja yoki inshosini tekshiring va rad javobi (Visa Refusal) xavfini tahlil qiling. Home ties (vatan bilan bog'liqlik) darajasini oshirish bo'yicha daxshatli foydali o'zbekcha yo'l yo'riqlar bering.";
      prompt = `SOP matni yoki viza rejasi: ${inputData?.sopText || ""}\nQaysi davlat vizasi uchun: ${inputData?.country || "AQSh (F-1)"}`;
      break;

    case "course_matcher":
      systemInstruction = "Siz kelajak kasblari va oliygoh fan darsliklari bo'yicha mutaxassissiz. Talabaning qiziqishlari va eng yaxshi ko'rgan fanlariga asosan unga jahonda eng yuqori maoshli va nufuzli 5 ta zamonaviy yo'nalishlarni (va ularga mos keladigan dunyo oliygohlarini) tavsiya eting.";
      prompt = `Eng yoqtirgan fanlari: ${inputData?.favorites || ""}\nQiziqishlari (masalan startap, kodlash, chizish, dori-darmon): ${inputData?.hobbies || ""}`;
      break;

    case "profile_enhancer":
      systemInstruction = "Siz Harvard va Oxford darajasidagi elita maktablardagi Akademik Profil Kuchaytiruvchi mutaxassissiz. Talabaga xalqaro universitetlarda birinchi o'ringa chiqish uchun maktab/litsey davrida bajarishi tavsiya etiladigan darsdan tashqari premium loyihalar (Extracurricular activities - masalan loyihalar, olimpiadalar, startaplar, maqolalar va ko'ngillilar tashkiloti) ro'yxatini tuzing.";
      prompt = `Talabaning sinfi: ${inputData?.grade || "11-sinf"}\nHozir qilgan eng asosiy ishlari: ${inputData?.history || "Faqat maktab darslari"}`;
      break;

    case "score_predictor":
      systemInstruction = "Siz SAT va IELTS natijalarini prognoz qiluvchi va tahlil qiluvchi daxshatli murabbiysiz. Talabaning hozirgi mock test ballarini olib, uning imtihon kunigacha bo'lgan zaif nuqtalarini bartaraf etuvchi strategiya va yakuniy ball uchun prognoz tuzib bering.";
      prompt = `Hozirgi Mock IELTS / SAT ballari: ${inputData?.currentScore || "IELTS 6.0"}\nMaqsadli ball: ${inputData?.targetScore || "IELTS 7.5"}\nImtihongacha qolgan vaqt: ${inputData?.timeLeft || "2 oy"}`;
      break;

    case "study_planner":
      systemInstruction = "Siz til va imtihon o'quv rejasini tuzuvchi shaxsiy metodistsiz. Talaba uchun belgilangan muddatga asosan kunlik va haftalik, soatbay rejalashtirilgan, o'ta samarali 30 kunlik o'quv dasturini (o'zbek tilida) tayyorlab bering.";
      prompt = `Maqsadli imtihon: ${inputData?.examType || "IELTS"}\nKuniga ajrata oladigan vaqti: ${inputData?.dailyHours || "3 soat"}\nZaif bo'limlari (masalan Vocabulary yoki Writing): ${inputData?.weakAreas || "Barchasi"}`;
      break;

    default:
      return res.status(400).json({ error: "Noma'lum toolType." });
  }

  try {
    const ai = getGeminiClient();

    // Fallback to simulated response if no GEMINI_API_KEY is found (mock flow to prevent crashes)
    if (!apiKey) {
      console.log("Simulating AI response due to missing API Key...");
      return res.json({
        text: `📊 **[Simulyatsiya Qilingan AI Javobi]**\n\nSiz tanlagan modul: **${toolType.toUpperCase()}**\n\nAssalomu alaykum, hurmatli ${userName}! Hozirda platformada API kalit o'rnatilmagan yoki yuklanmoqda, ammo siz amalga oshirmoqchi bo'lgan harakat uchun to'liq tavsiyalarimiz tayyor!\n\n🎓 Xalqaro universitetlarga topshirayotganda ushbu bo'lim sizga 100% beg'araz va chuqur yo'nalish beradi. Asosiy maqsadlaringizga o'sha sohadagi eng kuchli portfellar, mantiqiy insholar va bepul hujjat topshirish strategiyalari bilan erisha olasiz.\n\n🔗 Qo'shimcha yordam va to'liq bog'lanish uchun istalgan vaqtda **Hamkorlik** bo'limidan bizning telegram-profilimiz '@studytime_uz' ga bog'lanishingiz mumkin.`,
        sources: []
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.75,
      }
    });

    const aiText = response.text;
    res.json({ text: aiText, sources: [] });

  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    res.status(500).json({ 
      error: "Sun'iy intellekt bilan bog'lanishda muammo yuz berdi.",
      details: error?.message || error
    });
  }
});

// Serve frontend assets in production/development
if (process.env.NODE_ENV !== "production") {
  const initVite = async () => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Development Server running at http://localhost:${PORT}`);
    });
  };
  initVite();
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  
  app.get("*all", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Production Server running on port ${PORT}`);
  });
}
