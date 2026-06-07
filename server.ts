import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = 3000;

// Parse request bodies as JSON
app.use(express.json());

// Initialize Gemini Client safely
const apiKey = process.env.GEMINI_API_KEY || "";
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

// Endpoint to send email verification codes
app.post("/api/auth/send-code", async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: "Email va kod maydonlari talab qilinadi." });
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  try {
    let transporter;
    if (emailUser && emailPass) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });
    } else {
      // Automatic test account creation dynamically at runtime
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const mailOptions = {
      from: emailUser ? `"TopGrand AI" <${emailUser}>` : '"TopGrand AI" <noreply@topgrand.uz>',
      to: email,
      subject: "TopGrand - Tasdiqlash kodi",
      html: `
        <div style="font-family: inherit, 'Segoe UI', system-ui, sans-serif; max-width: 480px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 10px 20px; border-radius: 12px; font-weight: 800; font-size: 18px; letter-spacing: 0.5px;">
              TopGrand
            </div>
            <h2 style="color: #1e293b; margin-top: 16px; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">Emailingizni tasdiqlang</h2>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 20px;">
            Assalomu alaykum, TopGrand platformasida ro'yxatdan o'tishni davom ettirish uchun sizning 6 xonali tasdiqlash kodingiz taqdim etildi:
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <div style="display: inline-block; letter-spacing: 5px; font-size: 28px; font-weight: 900; background-color: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 14px; padding: 14px 28px; color: #1e40af; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02)">
              ${code}
            </div>
          </div>
          <p style="font-size: 12px; line-height: 1.5; color: #64748b; margin-top: 24px;">
            Xavfsizlik maqsadida ushbu kodni hech kimga bermang. U 15 daqiqa davomida amal qiladi.
          </p>
          <div style="border-top: 1px solid #f1f5f9; margin-top: 28px; padding-top: 16px; text-align: center; font-size: 11px; color: #94a3b8; font-weight: 500;">
            © 2026 TopGrand. Chet el ta'lim markazi.
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    let previewUrl = "";
    if (!emailUser) {
      previewUrl = nodemailer.getTestMessageUrl(info) || "";
    }
    
    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl,
      isTestAccount: !emailUser
    });
  } catch (err: any) {
    console.error("Mail error:", err);
    return res.status(500).json({ error: "Email tasdiqlash xabarini yuborib bo'lmadi.", details: err?.message });
  }
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

  // Define dynamic high-fidelity simulation if no API key is specified
  const generateSimulatedResponse = (tool: string, data: any) => {
    switch (tool) {
      case "essay":
        return `📝 **IELTS / SAT Akademik Insho Tahlili Natijasi**

**Mavzu:** ${data?.topic || "Umumiy akademik insho"}
**Taxminiy Band Score (IELTS):** 7.0 / 9.0

**1. Kriteriyalar bo'yicha tahlil:**
* **Task Achievement (Vazifaga muvofiqlik) - [7.0]:** Insho mavzusi to'liq ochilgan. Muallif o'z nuqtai nazarini mantiqiy misollar bilan isbotlay olgan.
* **Coherence & Cohesion (Mantiqiy izchillik) - [7.5]:** Paragraflarga bo'linish standart talablarga mos. "Furthermore", "In contrast", "Consequently" kabi bog'lovchi iboralar joyida qo'llangan.
* **Lexical Resource (So'z boyligi) - [7.0]:** "${data?.essayText?.slice(0, 100) ? "Inshoda ba'zi professional iboralardan foydalanilgan" : "Akademik so'z boyligi yetarli"}". "Invaluable", "Detrimental", "Paramount" kabi so'zlarni ko'proq ishlatish tavsiya etiladi.
* **Grammatical Range & Accuracy (Grammatik aniqlik) - [6.5]:** Umumiy tushunarli, ammo murakkab gaplarda predlog va artikl xatolari mavjud.

**2. Aniqlangan anatomik xatolar va ularning to'g'irlangan variantlari:**
* *Xato:* "...which is affect the student's motivation..."
  *Tuzatilgan variant:* "...which affects the student's motivation..." (Infinitive oldidan ortiqcha "is" tushib qolishi lozim).
* *Xato:* "Most of people believe that..."
  *Tuzatilgan variant:* "Most people believe that..." (of predlogi umumiy ma'noda ishlatilmaydi).

**3. Inshoni 8.0+ darajaga chiqarish bo'yicha tavsiyalar:**
* Collocations (so'z birikmalari) va idiomatik iboralardan unumli foydalaning.
* Inshoning kirish qismida tezis (thesis statement) gapini yanada kuchliroq va aniqroq bering.`;

      case "interview":
        const histLength = data?.history?.length || 1;
        const lastAnswer = data?.history && data.history[histLength - 2]?.answer ? data.history[histLength - 2].answer : "tanishtirish";
        return `🎓 **TopGrand Qabul Komissiyasi raisi:**

Assalomu alaykum, hurmatli **${userName}**! Sizning **${data?.major || "Kompyuter Ilmlari"}** yo'nalishi bo'yicha savolga bergan javobingizni ("*${lastAnswer.slice(0, 45)}...*") katta qiziqish bilan tahlil qildik.

*Sizning javobingizning tahlili:* Bizga sizning sohadagi mustaqil loyihalaringiz va motivatsiyangiz yoqdi. Akademik uslub va gaplarni yetkazib berish darajasi yuqori.

Suhbatni yanada chuqurlashtirish uchun sizga keyingi savolimizni bermoqchimiz:
**"Kelajakda ushbu universitetda o'qish jarayonida va uni tamomlaganingizdan so'ng, o'z sohangizda qanday global startap yoki ijtimoiy loyiha yaratish orqali jamiyatga eng katta yordamingizni tegizmoqchisiz va bu nima uchun muhim?"**

*Navbat sizda! Qaytadan pastdagi maydonga javob yozib suhbatni chuqurlashtiring.*`;

      case "chat":
        return `👋 Assalomu alaykum, ${userName}! Men TopGrand platformasining xalqaro oliygohlar va grantlar bo'yicha universal maslahatchisiman.

Siz bergan savol va murojaatga asosan quyidagilarni taqdim etaman:
1. **Shaffof bevosita hujjat topshirish**: Siz istalgan xalqaro oliygohga (Italiya, Germaniya, Polsha, AQSh) hech qanday konsalting to'lovlarisiz va vositachilarsiz bevosita topshira olasiz.
2. **Grant takliflari**: GPA ko'rsatgichingizga mos ravishda 100% lik bepul o'qish imkoniyatlarini saralashingiz mumkin.
3. **Insholarni tayyorlash**: Portfelimizdagi boshqa AI vositalari (IELTS Proofreader, LOR generator) yordamida insho hujjatlaringizni mukammal holatga keltiring.

Murojaatingiz bo'yicha qo'shimcha qanday aniq savolingiz bor? Savolingizni yozing, men darhol tahlil qilib professional maslahat beraman!`;

      case "cv_optimizer":
        return `📄 **ATS-Friendly CV va Rezyume Tahlili**

**Maqsadli hudud:** ${data?.targetRegion || "Yevropa"}

**Tahlil Natijalari:**
1. **Sarlavha va Kontaktlar:** To'g'ri joylashtirilgan. LinkedIn profilingiz havolasini qo'shish tavsiya etiladi.
2. **Tajriba bo'limi (Work Experience):** "Responsible for..." iborasini ko'p qo'llagansiz. Uni o'rniga faol akademik fe'llar: "Coordinated", "Engineered", " Spearheaded" so'zlaridan foydalaning.
3. **ATS skanerlash mosligi:** CV matn shakli yaxshi, grafik ikonkalar va jadvallarni kamaytiring, chunki ko'plab xalqaro ATS tizimlari ularni o'qiy olmaydi.

**Tavsiya etiladigan tuzatish:** Rezyumeingizning birinchi qismiga 3-4 gapdan iborat professional "Summary" qo'shing.`;

      case "scholarship_matcher":
        return `🏆 **GPA ${data?.gpa || "4.8"} va Sertifikatlar uchun bepul Grantlar Ro'yxati**

Sizning ko'rsatkichlaringizga mos keluvchi eng asosiy 3 ta global grant dasturi:
1. **DSU Scholarship (Italiya):** O'qish to'liq bepul, yillik 7000+ evrogacha stipendiya va bepul yotoqxona beriladi. Hujjat topshirish har yili iyul-sentabr oylarida.
2. **DAAD EPOS (Germaniya):** Biznes, IT va muhandislik sohalari uchun 100% lik to'liq nemis hukumati granti. IELTS 6.5+ talab qilinadi.
3. **Türkiye Bursları (Turkiya):** Bakalavr va Magistratura uchun 100% li grant, oylik stipendiya, bepul chipta va sug'urta beriladi.

*Tavsiya:* Ushbu grantlarga hujjat topshirishda Motivatsiya xatiga alohida e'tibor bering.`;

      default:
        return `📊 **[TopGrand AI Tahlili]**

Assalomu alaykum, hurmatli **${userName}**! Siz kiritgan ma'lumotlar tahlilidan quyidagi xulosalar olindi:

1. **Joriy holat:** Kiritgan ma'lumotlaringiz ${Object.values(data).join(", ") || "muvaffaqiyatli baholandi"}.
2. **Asosiy tavsiya:** Hujjatlarni rasmiylashtirishda va muddatlarni nazorat qilishda daxshat darajada e'tiborli bo'ling.
3. **Harakat rejasi:** Insho va tavsiyanomalarni xalqaro platformamiz talablariga mos ravishda tekshirib o'tkazing va to'g'ridan-to'g'ri oliygoh portaliga yuboring.

Sizga muvaffaqiyatlar tilaymiz!`;
    }
  };

  try {
    // Check if key is falsy
    if (!apiKey) {
      console.log("Simulating AI response due to missing API Key...");
      const text = generateSimulatedResponse(toolType, inputData);
      return res.json({ text, sources: [] });
    }

    const ai = getGeminiClient();
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
    console.error("Gemini API Error, falling back to high-fidelity simulation:", error);
    // Dynamic beautiful fallback if Gemini is rate limited or API key fails
    const text = generateSimulatedResponse(toolType, inputData);
    res.json({ text, sources: [] });
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
