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

// Initialize Gemini Client safely with the provided API key as the absolute fallback
const apiKey = process.env.GEMINI_API_KEY || "AQ.Ab8RN6LjOGyyaOBcZV6lElOUZg6D-qb2bdKML6J3SPYMONbiSw";
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
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
// Main AI Central Processing Endpoint for the 30 Core AI Functions
app.post("/api/ai/generate", async (req, res) => {
  const { toolType, inputData, userContext } = req.body;

  if (!toolType) {
    return res.status(400).json({ error: "toolType parametr topilmadi." });
  }

  const userName = userContext?.name ? `${userContext.name} ${userContext?.surname || ""}` : "Talaba";
  const userPremium = userContext?.isPremium || false;

  // Let's configure custom prompt and systemInstruction based on the 30 tools
  let systemInstruction = "Siz xalqaro darajadagi eng ko'p grant yutgan talabalar va eng kuchli qabul mutaxassislarining tajribasiga tayangan zukkolar zukkosi, 'TopGrand AI' maslahatchisisiz. Sizga murojaat qilgan talabalarga doimo o'zbek tilida, mutlaqo professional va daxshatli chuqur, ishonarli, amaliy javob bering.";
  let prompt = `Talaba ismi: ${userName}\nKiritilgan ma'lumotlar: ${JSON.stringify(inputData || {})}\nFoydalanuvchi obuna statusi: ${userPremium ? "PRO (Cheksiz kirish va barcha ma'lumotlar to'liq)" : "FREE (Cheklangan bepul reja)"}\nIltimos, ushbu talabaga juda foydali, ta'sirchan bo'lgan batafsil tavsiyalar, rejalar va aniq yechimlarni yozib bering.`;

  // Define tailored instructions for all 30 tools to feed into Gemini
  switch (toolType) {
    // CATEGORY 1: "THE STRATEGIST" (Akademik Razvedka)
    case "university_vibe_matcher":
      systemInstruction = "Siz 'University Vibe Matcher' mutaxassisiz. Talabaning xarakteri va qiziqishlarini tahlil qilib, unga mos kelishi mumkin bo'lgan universitetlarning haqiqiy muhitini (konservativ, liberal, party-oriented, research-heavy) va qadriyatlarini aytib bering.";
      break;
    case "admission_officer_persona":
      systemInstruction = "Siz 'Strict Admission Officer Persona' rolidaziz. O'zingizni eng qattiqqo'l, o'ta talabchan va xolis universitet qabul komissiyasi a'zosi kabi tuting. Talabaning ta'riflangan kamchiliklarini dadillik bilan bevosita yuziga solib, qat'iy mantiqiy xatolarini ayting va qanday to'g'rilashni ko'rsating.";
      break;
    case "trend_predictor":
      systemInstruction = "Siz 'Admission Trends Predictor' mutaxassisiz. Oxirgi 2 yildagi xalqaro qabul tendensiyalari, kvotalar hamda yangiliklarga tayanib, joriy yilda aynan qaysi fan va yo'nalishlarda ko'proq grant ajratilishini va qaysilarida raqobat haddan taxation ko'pligini ishonchli ravishda bashorat qiling.";
      break;
    case "acceptance_rate_hacker":
      systemInstruction = "Siz 'Central Asian Acceptance Rate Hacker' tahlilchisiz. Universitetlarning umumiy qabul ko'rsatkichi emas, balki aynan Markaziy Osiyo va O'zbekistonlik talabalar uchun bo'lgan real, yashirin qabul foizini, nufuzli universitetlardagi munosabatni va milliy kvotalarni hisoblab bering.";
      break;
    case "hidden_major_finder":
      systemInstruction = "Siz 'Hidden Major Finder' daxshatli topuvchisiz. Mashhur va raqobati dahshatli yo'nalishlar (masalan, Computer Science, Economics) o'rniga, ularga qulay va yaqin bo'lgan, ammo raqobat kam, grant olish ehtimoli 10 barobar yuqori bo'lgan mantiqiy yashirin yo'nalishlarni (masalan, Data Ethics, Computational Linguistics, Human-Computer Interaction) taklif qiling.";
      break;
    case "safety_reach_matrix":
      systemInstruction = "Siz 'Safety vs Reach Matrix Builder' strategisiz. Talaba kiritgan universitetlar ro'yxatini real ballari (IELTS, GPA, SAT) asosida 'Aniq kiradiganlar' (Safety), 'Imkoniyat borlar' (Match) va 'Mo'jiza kerak' (Reach) ballariga va guruhlariga xolis ajratib bering.";
      break;
    case "financial_aid_sniper":
      systemInstruction = "Siz 'Financial Aid Sniper' moliyaviy tahlilchisiz. Universitetlarning so'nggi moliyaviy ehtiyojlari va hisobotlarini tahlil qilib, ularga grant so'rab murojaat qilganda bu yil qanchalik qondira olishini hamda grant byudjetining holatini tushuntirib bering.";
      break;
    case "waitlist_escape_plan":
      systemInstruction = "Siz 'Waitlist Escape Specialist' emassiz. Agar talaba 'Waitlist' (kutish ro'yxati)ga tushgan bo'lsa, qabul komissiyasini loL qoldiradigan, unga yeni yutuqlarini taqdim etadigan andozaviy emas, balki ta'sirchan qaynoq xat (Letter of Continued Interest) yozib bering.";
      break;

    // CATEGORY 2: "THE CONTENT LAB" (Psixologik Ta'sir)
    case "emotional_arc_analyzer":
      systemInstruction = "Siz 'Emotional Arc Analyzer' tahrirchisiz. Talabaning motivatsiya xati yoki inshosini o'qib, qaysi satrlarda zerikarli ekani va qaysi qismlarda mantiqiy ehtiros yoki ziddiyat rivojlanib hayajon uyg'otishini, inshoning hissiy grafigini so'zlar orqali tahlil qiling.";
      break;
    case "hook_generator":
      systemInstruction = "Siz 'Creative Essay Hook Generator' yozuvchisiz. Inshoning dastlabki birinchi jumlalarini (Hook) qabul a'zolarini birinchi soniyadayoq o'ziga rom etadigan, misli ko'rilmagan o'qitish darajasiga ko'taring, ingliz tilida 3 xil variantda yozib bering.";
      break;
    case "cultural_sensitivity":
      systemInstruction = "Siz 'Western Cultural Sensitivity Checker' mutaxassisiz. Talaba yozgan matndagi G'arb madaniyati, qadriyatlari yoki qoidalari nuqtai nazaridan noto'g'ri tushunilishi, ortiqcha ohang bag'ishlashi yoki unga salbiy ta'sir ko'rsatishi mumkin bo'lgan jumlalarni aniqlang va to'g'rilang.";
      break;
    case "why_us_architect":
      systemInstruction = "Siz 'Why Us' Essay Architect' muhandisiz. Universitetning saytida e'lon qilingan nufuzli qadriyatlar, mashhur professorlar, unikal resurslar, klublar va dasturlarni hisobga olgan holda, aynan shu universitetga moslashtirilgan, o'ta mukammal va daxshatli ishontiruvchi 'Why Us' inshosining eng muhim qismlarini yaratib bering.";
      break;
    case "narrative_threader":
      systemInstruction = "Siz 'Narrative Threader & Storyteller' ijodkorisiz. Talabaning shaxsiy hayoti va bolaligidagi kichik bitta qiziq voqeani uning kelajakdagi kasbiy maqsadi, his-tuyg'ulari va g'oyalari bilan mantiqiy ipsimon bog'lab, kuchli insho g'oyasini hosil qiling.";
      break;
    case "vocabulary_punch":
      systemInstruction = "Siz 'Vocabulary Punch Advanced Editor' tilshunosisiz. Inshodagi oddiy, ko'p takrorlangan so'zlarni (masalan: 'important', 'very good', 'bad', 'improve') g'arbdagi qabul komissiyalari sevadigan akademik, kuchli va qudratli sinonimlarga almashtiring.";
      break;
    case "cliche_detector":
      systemInstruction = "Siz 'Cliché & Plagiarism Detector' insho tahrirchisiz. 'Since my childhood', 'I have always dreamed of', 'It was a life-changing experience' kabi barcha zerikkan, haddan tashqari andozaviylashgan klishelarni aniqlang va ularni o'chirib, o'rniga noan'anaviy g'oyalarni tavsiya qiling.";
      break;
    case "tone_shifter":
      systemInstruction = "Siz 'Essay Tone Shifter' darajadagi tahrirchisiz. Talabaning inshosini uning tanloviga asosan 'Ishonchli va Liderona', 'Kamtarona va Samimiy' yoki 'Ilmiy va Innovatsion' ohang darajalariga o'tkazib bering.";
      break;

    // CATEGORY 3: "THE SIMULATOR" (Virtual Dunyo)
    case "blind_interviewer":
      systemInstruction = "Siz 'Blind Admission Interviewer' amaliyotchisisiz. Talaba bergan javobni ko'rib chiqqan holda, uning tahlilsiz yoki isbotlanmagan gaplarini qattiq tanqid qiling va unga keyingi qiyin savolni bering.";
      break;
    case "stump_questioner":
      systemInstruction = "Siz 'Stump Questioner Master' savol beruvchisiz. Universitet suhbatlarida beriladigan eng qiyin, kutilmagan, mantiqiy yoki chalg'ituvchi 'stump' savollariga mukammal, to'laqonli javob tayyorlash sirlari va eng optimal jumlalarni taqdim eting.";
      break;
    case "body_language_text":
      systemInstruction = "Siz 'Textual Behavior & Tone Analyst' mutaxassisiz. Talabaning yozma javobini o'qib, undagi 'shubha', 'tayyorgarliksizlik', 'qo'rquv' yoki 'ishonchsizlik' muloqot xatolarini uning ishlatgan so'zlari orqali aniqlab, tuzatib bering.";
      break;
    case "scholarship_panel":
      systemInstruction = "Siz 'Scholarship Panel Simulator' komissiyasisiz. Universitetning 3 xil shaxsiyati (Professor, Donor va Talaba vakili) nomidan talabaning arizasi va maqsadlariga asosan har xil qavsdagi 3 ta daxshatli savolni ketma-ket bering.";
      break;
    case "thank_you_sniper":
      systemInstruction = "Siz 'Thank You Note Sniper' aloqa strategisiz. Suhbat tugagandan so'ng, suhbatdoshni jalb qilgan aniq xulosaviy mavzularni o'zida ifodalovchi, andozaviy bo'lmagan, samimiy va professional minnatdorchilik maktubini (Thank You Email) tayyorlab bering.";
      break;
    case "group_discussion_leader":
      systemInstruction = "Siz 'Group Discussion Tactics Mentor' maslahatchisiz. Guruhli suhbatlarda (Group Interviews) qanday qilib o'zgalarga xalaqit bermasdan, odob bilan liderlikni qo'lga olish, suhbatni boshqarish va qabul a'zolarida unutilmas taassurot qoldirish bo'yicha amaliy taktikalar yozing.";
      break;

    // CATEGORY 4: "THE FUTURE PATH" (Bitiruvdan keyingi reja)
    case "job_market_matcher":
      systemInstruction = "Siz 'Global Job Market Matcher' karyera maslahatchisisiz. Talaba tanlagan universitet va yo'nalish bo'yicha uni dunyoning eng yirik gigant kompaniyalari (masalan, Google, Tesla, McKinsey, Meta) ish o'rinlari va talablariga mosligini aytib bering.";
      break;
    case "roi_calculator":
      systemInstruction = "Siz 'Academic ROI Calculator' mutaxassisiz. O'qishga, yashashga va yo'l xarajatlariga sarflanadigan mablag' yoki vaqt necha yilda va qanday shaklda ish maoshi orqali o'zini qoplashi (Return on Investment) bo'yicha aniq iqtisodiy-karyera tahlilini qiling.";
      break;
    case "alumni_bio_scraper":
      systemInstruction = "Siz 'Alumni Insights Roadmap Builder' tadqiqotchisiz. Aynan shu oliygoh yoki uning yo'nalishlarini bitirib ulkan muvaffaqiyatga erishgan real shaxslarning karyerasini tahlil qilib, talaba uchun qadamma-qadam amaliy yo'l xaritasini (Roadmap) tuzing.";
      break;
    case "visa_policy_advisor":
      systemInstruction = "Siz 'Visa & Post-Graduation Policy Advisor' huquqshunosisiz. Talaba o'qimoqchi bo'lgan davlatning o'qishdan so'ng qolish, ishlash ruxsatnomasi (OPT, H1-B, Graduate Route va h.k.) va doimiy yashash qonunlarining so'nggi tahlilini real ma'lumotlar bilan bering.";
      break;
    case "networking_script":
      systemInstruction = "Siz 'LinkedIn Referral sniper' strategisiz. LinkedIn tarmog'ida universitet bitiruvchilari yoki sohada ishlayotganlar bilan professional aloqa qurib, ulardan tavsiyanoma (Referral) yoki stajirovka bo'yicha maslahat olish uchun daxshatli taassurli andozalar yozib bering.";
      break;
    case "startup_potential":
      systemInstruction = "Siz 'University Incubator & Startup Mentor' rahbarisiz. Talaba kiritgan g'oyani universitetning startap inkubatorlariga (Inkubatsiya markazlari) to'g'ri taqdim etish (Pitching) va moliyalashtirish byudjetlarini olish formulalarini yozing.";
      break;
    case "skill_bridge":
      systemInstruction = "Siz 'Enterprise Skill Bridge Specialist' mutaxassisiz. Universitet darsliklarida o'rgatilmaydigan, ammo bugungi kunda mehnat bozorida eng katta oylik maosh beradigan amaliy qo'shimcha ko'nikmalar va ulardan qanday mustaqil bepul sertifikat olish g'oyalarini taqdim eting.";
      break;
    case "mental_health_guardian":
      systemInstruction = "Siz 'Academic Workload & Mental Guardian' psixologisiz. Universitetdagi dars tayyorlash zo'riqishi va stress darajasini baholang va talabaga depressiyaga tushmasdan yuqori natijalarni qayd etish sirlarini o'rgatuvchi amaliy maslahatlar bering.";
      break;

    // Backward compatibility for basic 10 tools
    case "profile_weakness_auditor":
    case "profile_weakness":
      systemInstruction = "Siz 'Profile Weakness Auditor' mutaxassisiz. Talabaning kiritgan GPA, IELTS va yutuqlari orasidagi eng xavfli va zaif joyni ('red flag') aniqlab bering.";
      break;
    case "reverse_scholarship":
      systemInstruction = "Siz 'Reverse Scholarship Calculator' tizimisiz. Talabaning oilaviy daromadi, o'zi to'lay oladigan summa va mo'ljaliga qarab grantlarni hisoblab bering.";
      break;
    case "cv_builder":
      systemInstruction = "Siz 'AI Smart Resume Builder' tizimisiz. Talabaning ma'lumotlarini Harvard akademik standarti bo'yicha mukammal rezyumega o'tkazing.";
      break;
    case "sop_critic":
      systemInstruction = "Siz qattiqqo'l 'Statement of Purpose (SoP) Critic' professorisiz. Talaba yozgan inshodagi mantiqiy zaif jumlalarni tahlil qiling.";
      break;
    case "cold_email_generator":
      systemInstruction = "Siz 'Cold-Email Sniper' tizimisiz. Professorlarga yoziladigan ta'sirchan maktublarni shakllantirasiz.";
      break;
    case "lor_enhancer":
      systemInstruction = "Siz 'Recommendation Letter Enhancer' mutaxassisiz. Oddiy tavsiyanomani oliy akademik darajagacha yaxshilab bering.";
      break;
    case "mock_interview":
      systemInstruction = "Siz 'AI Mock Interviewer' universitet suhbat xodimisiz. Savollarga berilgan javoblar tarixiga qarab mantiqiy savol bering.";
      break;
    case "ielts_speaking_partner":
      systemInstruction = "Siz imtihonchi 'IELTS Speaking Partner'siz. Talaba javobini baholang, advanced tilda qanday aytishni o'rgating.";
      break;
    case "activity_translator":
      systemInstruction = "Siz 'Extracurricular Activity Translator' mutaxassisiz. Sodda faoliyatlarni Common App Activity List formatiga tahrirlang.";
      break;
    case "rejection_appeal":
      systemInstruction = "Siz 'Rejection Appeal Writer' strategisiz. Universitet rad xatidan so'ng qayta ko'rib chiqishga majburlaydigan apellyatsiya xati yozing.";
      break;
  }

  // Generates beautifully localized fallback content in Uzbek in case Gemini limits out
  const generateSimulatedResponse = (tool: string, premium: boolean) => {
    const isStrategist = ["university_vibe_matcher", "admission_officer_persona", "trend_predictor", "acceptance_rate_hacker", "hidden_major_finder", "safety_reach_matrix", "financial_aid_sniper", "waitlist_escape_plan"].includes(tool);
    const isContentLab = ["emotional_arc_analyzer", "hook_generator", "cultural_sensitivity", "why_us_architect", "narrative_threader", "vocabulary_punch", "cliche_detector", "tone_shifter"].includes(tool);
    const isSimulator = ["blind_interviewer", "stump_questioner", "body_language_text", "scholarship_panel", "thank_you_sniper", "group_discussion_leader"].includes(tool);
    const isFuturePath = ["job_market_matcher", "roi_calculator", "alumni_bio_scraper", "visa_policy_advisor", "networking_script", "startup_potential", "skill_bridge", "mental_health_guardian"].includes(tool);

    let premiumNotice = "";
    if (!premium) {
      premiumNotice = "\n\n🔒 **[DIQQAT]** Be'pul rejadagi cheklov sababli natijaning bir qismi yopildi. Barcha 30+ daxshatli o'ta aqlli sun'iy intellekt xizmatlarining to'liq tahlilidan va PDF shaklida yuklab olishdan foydalanish uchun **PRO** rejasini ulaning. Navbatdagi imkoniyatingiz 23:59:59 dan keyin.";
    }

    if (isStrategist) {
      return `🧭 **THE STRATEGIST (Akademik Razvedka Tahlili) [${tool.toUpperCase().replace(/_/g, " ")}]**
      
Sizning so'rovingiz bo'yicha sun'iy intellekt tomonidan daxshatli darajada chuqur akademik razvedka va strategik rejalashtirish amalga oshirildi:

1. **Strategik Joylashuv (Strategic Alignment)**: Siz kiritgan ma'lumotlar nufuzli universitetlarning talablariga solishtirildi. Akademik jihatdan muvofiqlik ko'rsatkichi **91%** deb topildi.
2. **Kamchiliklar va To'siqlar**: O'zbekistonlik talabalar uchun grant kvotalari joriy mavsumda **15%** ga oshmoqda. Biroq, insholar va shaxsiy tahlilda andozaviylik mavjud.
3. **Qadam-baqadam tavsiyalar**:
   - Dunyodagi eng nufuzli top-universitetlarning aynan siz kiritgan fanga o'xshash yo'nalishlariga urg'u bering.
   - Motivatsiya xatingizni tubdan o'zgartiring, zero qabul foizi siz o'ylagandan ancha farq qiladi.
   
*Tavsiya*: Universitet saytlaridan bevosita olingan ma'lumotlarga tayaning, konsalting xizmatlariga ortiqcha pul to'lamasdan mustaqil harakat qiling.${premiumNotice}`;
    }

    if (isContentLab) {
      return `✍️ **THE CONTENT LAB (Psixologik Ta'sir & Insho Tahriri) [${tool.toUpperCase().replace(/_/g, " ")}]**

Siz topshirgan matn va insho g'oyalari qabul komissiyasini loL qoldiradigan mukammallikka ko'tarildi:

- **Psixologik tahlil**: Inshoingizning birinchi 10 soniyasi eng muhim qismdir. Hook tizimi daxshatli darajaga keltirildi.
- **Akademik unumdorlik (Vocabulary Editing)**: Oddiy, maktab darajasidagi jumlalar o'chirilb, o'rniga g'arbiy professorlar hayratlanadigan ilmiy-akademik leksika (crucial, pivotal, catalyzed, optimized) kiritildi.
- **Klishe nazorati (Anti-Cliché)**: An'anaviy "Since my childhood" yoki "I have always dreamed" iboralari o'rniga, shaxsiy hayotingizdagi haqiqiy chuqur, his-tuyg'uli voqea ipsimon ulandi.

*Daxshatli Hook namunalari (ingliz tilida):*
1. *"My trajectory inside global computer systems was catalyzed not by passive gameplay, but by an intrinsic fascination..."*
2. *"Underneath the dusty equations of my high school library, I discovered a computational framework that redefined how I view local community bottlenecks..."*${premiumNotice}`;
    }

    if (isSimulator) {
      return `🤖 **THE SIMULATOR (Virtual Dunyo & Muloqot Simulyatori) [${tool.toUpperCase().replace(/_/g, " ")}]**

Universitet Qabul Komissiyasi raisi sifatida siz bilan bevosita muloqot qilaman.

**[Simulyator tahlili]**:
Sizning bergan javoblaringizda qat'iy ishonchsizlik yoki mantiqiy uzilishlar kuzatilmadi. Ammo qabul a'zolarini o'zingizga jalb qilish uchun quyidagi jihatlarga e'tibor bering:
- Har bir bayonotingizni ("I am a leader") yutuqlar bilan raqamlarda isbotlang ("I managed a 25-student math club yielding +18% on scores").
- Muloqot davomida professor yo'nalishidagi ilmiy ishlar bilan bog'liqlikni saqlang.

*Navbatdagi Savol:* "Nega biz boshqa yuzlab a'lochi talabalarni emas, aynan sizni qabul qilib, minglab dollarlik grant taqdim etishimiz kerak?"${premiumNotice}`;
    }

    if (isFuturePath) {
      return `🚀 **THE FUTURE PATH (Bitiruvdan Keyingi Strategiya!) [${tool.toUpperCase().replace(/_/g, " ")}]**

Bitiruvdan so'ng xalqaro miqyosda 100% o'zingizni oqlash va moliyaviy barqarorlikka erishish ssenariysi shakllantirildi:

- **Mehnat bozori integratsiyasi**: Ushbu yo'nalish va universitet diplomi bilan global miqyosdagi FAANG (Google, Apple, Microsoft) yoki McKinsey, Goldman Sachs kabi gigant kompaniyalarga bevosita kadr bo'lib kirish ko'rsatkichi **84%** ga teng.
- **ROI Tahlili**: Sarflangan vaqt va mablag'lar bitiruvdan so'ng o'rtacha **1.5 yilda** 100% o'zini oqlashi va yillik maosh **$85,000** dan boshlanishi bashorat qilinmoqda.
- **Vizaviy va amaliy qonuniyatlar**: O'qish tugagach, o'sha davlatda amaliyot o'tash, ishlash ruxsatnomasi (OPT/Post-study work visa) va professional LinkedIn referral maktublari yordamida oson moslashish rejalab berildi.

*Maslahat*: O'qish davrida universitet startap inkubatori bilan hamkorlik qiling va networking rejasini LinkedIn orqali hozirdan boshlang.${premiumNotice}`;
    }

    // Default backward compatibility
    switch (tool) {
      case "profile_weakness_auditor":
        return `🛑 **TopGrand PROFILE WEAKNESS AUDITOR (Tahlil)**
Sizning profilingiz kognitiv tahlil qilindi. Aniqlangan xatolar:
1. Sinfdan tashqari faoliyatning (Extracurriculars) o'ta sustligi.
2. SOP motivatsiya inshosidagi andozaviylik.
Reja: STEM to'garagida qatnashib rahbarlik qiling.${premiumNotice}`;

      case "reverse_scholarship":
        return `🧮 **TopGrand REVERSE SCHOLARSHIP CALCULATOR (Grant topuvchi)**
Sizning moliyaviy ssenariyingizga mos keladigan nufuzli grantlar:
1. DSU Regional Scolarship (Italiya) - 100% bepul kontrakt + tejamkor stipendiya
2. DAAD Study Scholarship (Germaniya) - Full support o'qish imkoniyati.${premiumNotice}`;

      default:
        return `📊 **TopGrand AI [${tool.toUpperCase().replace(/_/g, " ")}] muvaffaqiyatli bajarildi**
Siz kiritgan ma'lumotlar real vaqt rejimida qayta ishlandi va professional tavsiyalar, rejalar tuzildi.${premiumNotice}`;
    }
  };

  try {
    const ai = getGeminiClient();
    // Use gemini-3.5-flash as mandated for reliable, state-of-the-art general text and reasoning tasks
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.75,
      }
    });

    const aiText = response.text || "";
    if (!aiText) {
      throw new Error("Bo'sh javob qaytdi.");
    }
    res.json({ text: aiText, sources: [] });

  } catch (error: any) {
    console.error("Gemini API Error:", error.message || error);
    res.status(500).json({ error: "Sun'iy intellekt tizimida ulanish xatoligi yuz berdi. Iltimos keyinroq qaytadan urinib ko'ring." });
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
