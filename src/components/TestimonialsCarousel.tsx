import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, GraduationCap, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  university: string;
  scholarship: string;
  lang: 'uz' | 'en' | 'ru';
  text: Record<string, string>;
  image: string;
  ielts: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Diyorbek Murodov",
    university: "University of Rome, Sapienza (Italy)",
    scholarship: "100% Free Tuition + €7,400 Stipend",
    lang: "uz",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
    ielts: "IELTS 7.5",
    text: {
      uz: "TopGrand AI yordamida bepul motivatsiya xatlarini tahrirladim va o'zim to'g'ridan-to'g'ri Sapienza universitetiga topshirdim. Natija daxshatli! Konsaltorlik uchun so'ralgan $2,000 ni to'liq tejab qoldim.",
      en: "With TopGrand AI, I edited my motivation letters for free and applied directly to Sapienza University. Incredible result! Saved the full $2,000 consulting fee.",
      ru: "С помощью TopGrand ИИ я абсолютно бесплатно отредактировал мотивационные письма и поступил напрямую в Сапиенцу. Сэкономил $2000, которые просили агентства."
    }
  },
  {
    id: 2,
    name: "Madina Alimova",
    university: "Munich Technical University (Germany)",
    scholarship: "DAAD Fully Funded Scholarship",
    lang: "uz",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    ielts: "IELTS 7.0 / TestDaF 4",
    text: {
      uz: "TUMga hujjat topshirishni juda murakkab deb o'ylardim. TopGrand AI ning 'Why Us Essay Builder' moduli menga Germaniyadagi professorlar yoqtiradigan insho yozishga ko'maklashdi. Hammaga tavsiya qilaman!",
      en: "I thought applying to TUM was impossible. The 'Why Us Essay' helper guided me to craft an outstanding piece that professors loved. Highly recommended!",
      ru: "Я думала, что сложно поступить в TUM. Модуль 'Why Us Essay' помог написать именно то, что нравится немецким профессорам. Теперь я учусь на полном гранте!"
    }
  },
  {
    id: 3,
    name: "Shokhrukh Karimov",
    university: "KAIST (South Korea)",
    scholarship: "GKS Scholarship (100% Tuition + $900/mo)",
    lang: "uz",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    ielts: "GPA 3.8 / IELTS 8.0",
    text: {
      uz: "KAIST intervyusida qisilib qolishim mumkin edi. Lekin 'Blind Admission Interviewer' simulyatori bilan 10 martalab mashq qildim. Real elchixona va universitet vakili so'ragan deyarli hamma savollarga tayyor edim.",
      en: "I was extremely anxious about the KAIST interview. The 'Blind Admission Interviewer' simulator let me practice dozens of times. When the real interview came, I was 100% ready.",
      ru: "Очень переживал за интервью в KAIST. Благодаря симулятору интервью я потренировался более 10 раз. На реальной комиссии чувствовал себя абсолютно уверенно."
    }
  }
];

interface TestimonialsCarouselProps {
  currentLang: 'uz' | 'en' | 'ru';
}

export default function TestimonialsCarousel({ currentLang }: TestimonialsCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[index];

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-8" id="testimonials-carousel">
      {/* Testimonial Box */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 rounded-[2.5rem] border border-white/10 p-6 md:p-10 shadow-2xl min-h-[340px] flex flex-col justify-between">
        {/* Floating Accent Glows */}
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-45 w-45 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Big Quote Icons */}
        <Quote className="absolute top-6 right-8 h-12 w-12 text-white/5 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6 flex-1 flex flex-col justify-between"
          >
            {/* Header profile section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img
                src={current.image}
                alt={current.name}
                className="w-16 h-16 rounded-full border-2 border-indigo-400/40 object-cover shadow-lg"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <h4 className="text-white font-black text-sm md:text-base">{current.name}</h4>
                  <span className="bg-indigo-505/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider font-mono bg-indigo-900/30 ml-1.5 shrink-0">
                    {current.ielts}
                  </span>
                </div>
                <p className="text-xs text-blue-200/80 font-bold flex items-center justify-center sm:justify-start gap-1">
                  <GraduationCap className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>{current.university}</span>
                </p>
                <p className="text-[11px] font-black tracking-wide text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full inline-block">
                  {current.scholarship}
                </p>
              </div>
            </div>

            {/* Quote content */}
            <div className="text-slate-100 italic font-semibold text-xs md:text-sm leading-relaxed max-w-3xl border-l-2 border-cyan-400 pl-4 py-1 text-left">
              "{current.text[currentLang] || current.text['uz']}"
            </div>

            {/* Five Star review bars */}
            <div className="flex items-center justify-center sm:justify-start gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
              ))}
              <span className="text-[11px] text-white/50 ml-1 font-mono">100% Verification Checked</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons inside card */}
        <div className="flex items-center justify-end gap-2.5 mt-4 pt-4 border-t border-white/5 shrink-0">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer border border-white/10 active:scale-90"
            id="testimonial-prev-btn"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          <span className="text-xs font-mono text-white/40 tracking-wider">
            {index + 1} / {testimonials.length}
          </span>
          <button
            onClick={handleNext}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer border border-white/10 active:scale-90"
            id="testimonial-next-btn"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
