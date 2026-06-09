import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, GraduationCap, FileText, Sparkles, BookOpen } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Task {
  id: string;
  label: Record<'uz' | 'en' | 'ru', string>;
  desc: Record<'uz' | 'en' | 'ru', string>;
  icon: any;
  weight: number;
}

const tasks: Task[] = [
  {
    id: 'ielts',
    label: { uz: "IELTS Prep (Ingliz tili tayyorgarligi)", en: "IELTS Prep & English Readiness", ru: "Подготовка к IELTS и языковой аудит" },
    desc: { uz: "Sertifikat bor yoki tayyorgarlik kursi boshlangan", en: "Certificate achieved or test prep course in progress", ru: "Сертификат на руках или курс подготовки запущен" },
    icon: BookOpen,
    weight: 34
  },
  {
    id: 'uniselect',
    label: { uz: "University Selection (Oliygohlar tanlovi)", en: "University Selection & Target List", ru: "Выбор вузов и составление списка" },
    desc: { uz: "Katalogdan kamida 3 ta mos universitet belgilandi", en: "At least 3 matches selected from university catalog", ru: "Выбрано не менее 3 подходящих вузов из каталога" },
    icon: GraduationCap,
    weight: 33
  },
  {
    id: 'docs',
    label: { uz: "Documents Ready (SOP, CV, LOR Portfolio)", en: "Documents Ready & Portfolio Assets", ru: "Документы собраны (SOP, резюме, рекомендации)" },
    desc: { uz: "30 ta AI moduli yordamida hujjatlar to'g'rilandi", en: "Resumes polished, recommendation drafts optimized by AI", ru: "Мотивационные письма и эссе отредактированы с помощью ИИ" },
    icon: FileText,
    weight: 33
  }
];

interface PrepProgressProps {
  currentLang: 'uz' | 'en' | 'ru';
  userEmail: string;
  userId?: string;
}

export default function PrepProgress({ currentLang, userEmail, userId }: PrepProgressProps) {
  // Use unique key storage based on student email for cross-session database persistence
  const prefix = userEmail ? `topgrand_prep_${userEmail}` : 'topgrand_prep_guest';
  
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(prefix);
      return saved ? JSON.parse(saved) : ['ielts']; // Default preset so they immediately see the progress indicator in action!
    } catch {
      return ['ielts'];
    }
  });

  // Load progress from Firebase Firestore if user gets authenticated
  useEffect(() => {
    let active = true;
    async function loadFirebaseProgress() {
      if (!userId) return;
      try {
        const userDocRef = doc(db, "users", userId);
        const snapshot = await getDoc(userDocRef);
        if (snapshot.exists() && active) {
          const data = snapshot.data();
          if (Array.isArray(data?.completedTasks)) {
            setCompletedTaskIds(data.completedTasks);
            localStorage.setItem(prefix, JSON.stringify(data.completedTasks));
          }
        }
      } catch (err) {
        console.warn("Could not load Firestore prep statistics:", err);
      }
    }
    loadFirebaseProgress();
    return () => {
      active = false;
    };
  }, [userId, prefix]);

  const toggleTask = async (id: string) => {
    const isChecked = completedTaskIds.includes(id);
    const updated = isChecked 
      ? completedTaskIds.filter(t => t !== id) 
      : [...completedTaskIds, id];

    // Local response first
    setCompletedTaskIds(updated);
    localStorage.setItem(prefix, JSON.stringify(updated));

    // Async save to Firestore
    if (userId) {
      try {
        const userDocRef = doc(db, "users", userId);
        await setDoc(userDocRef, { completedTasks: updated }, { merge: true });
      } catch (err) {
        console.warn("Could not save Firestore prep statistics:", err);
      }
    }
  };

  // Calculate percentage dynamically
  const progressPercent = tasks.reduce((sum, task) => {
    if (completedTaskIds.includes(task.id)) {
      return sum + task.weight;
    }
    return sum;
  }, 0);

  // Circle SVG metrics
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercent / 100) * circumference;

  const labels = {
    progressHeader: { uz: "Tayyorgarlik Samaradorligi Metrikasi", en: "Preparation Success Metrics", ru: "Метрика вашей готовности" },
    progressDesc: { uz: "Hujjatlar tayyorligini belgilang va g'arbiy oliygohlarga kirish ehtimolingizni onlayn kuzatib boring.", en: "Check your task readiness and track your direct admission probability live.", ru: "Отмечайте готовность задач и отслеживайте вероятность успешного зачисления." },
    statusNice: { uz: "Daxshatli! Tez orada grant sizniki!", en: "Outstanding! Premium scholarship is near!", ru: "Отлично! Вы близки к получению полного гранта!" },
    statusStart: { uz: "Harakatni boshlang va AI daxshatli yopiq eshiklarini o'rganing!", en: "Get started and unlock the power of premium study guides!", ru: "Начните действовать и воспользуйтесь инструкциями ИИ!" }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-sky-100 p-6 md:p-8 shadow-lg max-w-4xl mx-auto" id="preparation-progress-card">
      <div className="flex flex-col md:flex-row items-center gap-8">
        
        {/* Circle dial Left column */}
        <div className="relative flex flex-col items-center justify-center select-none shrink-0" id="prep-circle-box">
          <svg className="w-40 h-40 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-slate-100 fill-none"
              strokeWidth="10"
            />
            {/* Active animated stroke circular progress path */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-blue-600 fill-none"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </svg>
          
          {/* Centered percentage text inside sphere */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black tracking-tight text-blue-900">{progressPercent}%</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">READY</span>
          </div>
        </div>

        {/* Checked/unchecked tasks list Right column */}
        <div className="flex-1 text-left space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#2563eb] font-black block">STUDENT TRACKER</span>
            <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight">
              {labels.progressHeader[currentLang] || labels.progressHeader['uz']}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {labels.progressDesc[currentLang] || labels.progressDesc['uz']}
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {tasks.map((task) => {
              const TaskIcon = task.icon;
              const isChecked = completedTaskIds.includes(task.id);
              return (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`w-full p-3.5 rounded-2xl border transition-all text-left flex items-start gap-3.5 select-none hover:bg-slate-50 cursor-pointer ${
                    isChecked 
                      ? 'bg-blue-50/40 border-blue-150 shadow-sm' 
                      : 'bg-white border-slate-150'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  <div className="shrink-0 mt-0.5">
                    {isChecked ? (
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <TaskIcon className={`h-4 w-4 ${isChecked ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className={`text-xs md:text-sm font-extrabold ${isChecked ? 'text-blue-950' : 'text-slate-700'}`}>
                        {task.label[currentLang] || task.label['uz']}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-semibold leading-normal">
                      {task.desc[currentLang] || task.desc['uz']}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2.5 animate-pulse mt-1 shrink-0">
            <Sparkles className="h-4.5 w-4.5 text-blue-600 shrink-0" />
            <span className="text-[11px] text-[#2563eb] font-black">
              {progressPercent >= 66 
                ? (labels.statusNice[currentLang] || labels.statusNice['uz']) 
                : (labels.statusStart[currentLang] || labels.statusStart['uz'])}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
