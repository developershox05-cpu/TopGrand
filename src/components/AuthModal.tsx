import React, { useState } from 'react';
import { Mail, Lock, User, Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: { id: string; name: string; surname: string; email: string; isPremium: boolean }) => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>((initialMode as any) === 'verify' ? 'register' : initialMode);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !surname || !email || !password || !confirmPassword) {
      setError("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Parollar bir-biriga mos kelmadi.");
      return;
    }

    if (password.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    setIsLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userProfile = {
        id: user.uid,
        name,
        surname,
        email,
        isPremium: false
      };

      // Save user profile in Firestore
      await setDoc(doc(db, "users", user.uid), userProfile);

      // Save user temporarily in LocalStorage too
      localStorage.setItem('current_user', JSON.stringify({ ...userProfile, isLoggedIn: true, usageLog: {} }));

      onSuccess(userProfile);
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Ushbu email allaqachon ro'yxatdan o'tkazilgan.");
      } else if (err.code === 'auth/weak-password') {
        setError("Parol juda zaif. Kamida 6 ta belgi kiriting.");
      } else {
        setError(err.message || "Ro'yxatdan o'tishda xatolik yuz berdi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError("Iltimos, email va parolni to'ldiring.");
      return;
    }

    setIsLoading(true);

    try {
      // Sign in via Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Read from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      let nameVal = "Talaba";
      let surnameVal = "";
      let premiumVal = false;

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        nameVal = data.name || "Talaba";
        surnameVal = data.surname || "";
        premiumVal = data.isPremium || false;
      } else {
        // If not exists, restore or backfill
        const fallbackProfile = {
          id: user.uid,
          name: "Talaba",
          surname: "",
          email: user.email || email,
          isPremium: false
        };
        await setDoc(userDocRef, fallbackProfile);
      }

      const activeProfile = {
        id: user.uid,
        name: nameVal,
        surname: surnameVal,
        email: user.email || email,
        isPremium: premiumVal
      };

      localStorage.setItem('current_user', JSON.stringify({ ...activeProfile, isLoggedIn: true, usageLog: {} }));
      onSuccess(activeProfile);
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError("Email yoki parol noto'g'ri kiritildi.");
      } else {
        setError("Kirishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/45 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
      >
        {/* Background glow dots */}
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl font-semibold"></div>
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-2xl"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-200 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
          id="btn-close-auth"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-2.5 shadow-lg shadow-blue-500/30">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
            {mode === 'login' ? "Xush Kelibsiz" : "Ro'yxatdan O'tish"}
          </h2>
          <p className="text-sm text-blue-200 text-center mt-1">
            {mode === 'login' 
              ? "Akkauntingizga kirib, sun'iy intellekt xizmatlaridan foydalaning" 
              : "Platforma imkoniyatlaridan to'liq foydalanish uchun hisob yarating"}
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-500/30 p-3 text-xs text-red-200" id="auth-err">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4" id="form-login">
            <div>
              <label className="block text-xs font-semibold text-blue-200 mb-1.5 uppercase tracking-wider">Email Manzil</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-blue-300" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white placeholder-blue-300/50 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-blue-200 mb-1.5 uppercase tracking-wider">Parol</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-blue-300" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white placeholder-blue-300/50 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold text-white shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98] transition duration-150 relative overflow-hidden group cursor-pointer"
              id="btn-login-submit"
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Kirilmoqda...
                  </>
                ) : (
                  <>
                    Kirish <Check className="h-4 w-4" />
                  </>
                )}
              </span>
              {!isLoading && <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-transform duration-300 group-hover:translate-x-0"></div>}
            </button>

            <div className="text-center mt-4">
              <span className="text-xs text-blue-200">Hisobingiz yo'qmi? </span>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
              >
                Ro'yxatdan o'tish
              </button>
            </div>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4" id="form-register">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-blue-200 mb-1.5 uppercase tracking-wider">Ism</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
                  <input
                    type="text"
                    required
                    placeholder="Ismingiz"
                    value={name}
                    disabled={isLoading}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-blue-300/50 outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-200 mb-1.5 uppercase tracking-wider">Familiya</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
                  <input
                    type="text"
                    required
                    placeholder="Familiyangiz"
                    value={surname}
                    disabled={isLoading}
                    onChange={(e) => setSurname(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-blue-300/50 outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-blue-200 mb-1.5 uppercase tracking-wider">Email Manzil</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-blue-300/50 outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-blue-200 mb-1.5 uppercase tracking-wider">Parol</label>
                <input
                  type="password"
                  required
                  placeholder="Kamida 6 belgi"
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3.5 text-sm text-white placeholder-blue-300/50 outline-none focus:border-cyan-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-200 mb-1.5 uppercase tracking-wider">Qayta yozing</label>
                <input
                  type="password"
                  required
                  placeholder="Parolni takrorlang"
                  value={confirmPassword}
                  disabled={isLoading}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3.5 text-sm text-white placeholder-blue-300/50 outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-2 w-full py-3 rounded-xl font-semibold text-white shadow-lg transition duration-150 relative overflow-hidden group cursor-pointer ${
                isLoading 
                  ? "bg-slate-700/50 cursor-not-allowed opacity-80 border border-white/5" 
                  : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-cyan-500/20 active:scale-[0.98]"
              }`}
              id="btn-register-submit"
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Ro'yxatdan O'tkazilmoqda...
                  </>
                ) : (
                  <>
                    Ro'yxatdan O'tish <Sparkles className="h-4 w-4" />
                  </>
                )}
              </span>
              {!isLoading && <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-transform duration-300 group-hover:translate-x-0"></div>}
            </button>

            <div className="text-center mt-4">
              <span className="text-xs text-blue-200">Hisobingiz bormi? </span>
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
              >
                Kirish
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
