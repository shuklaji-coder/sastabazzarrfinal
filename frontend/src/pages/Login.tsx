import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import { Loader2, Mail, KeyRound, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/IndianTheme.css';
import Spline from '@splinetool/react-spline';
import { Footer } from '@/components/Footer';

const Petal = ({ delay, left, size }: { delay: number; left: string; size: number }) => (
  <motion.div
    initial={{ y: -20, x: 0, opacity: 0, rotate: 0 }}
    animate={{
      y: ['0vh', '100vh'],
      x: [0, Math.random() * 100 - 50],
      opacity: [0, 0.6, 0.6, 0],
      rotate: [0, 360]
    }}
    transition={{
      duration: 12 + Math.random() * 8,
      delay,
      repeat: Infinity,
      ease: "linear"
    }}
    className="absolute pointer-events-none z-0"
    style={{ left, width: size, height: size }}
  >
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 15 7 15 11C15 15 12 18 12 22C12 18 9 15 9 11C9 7 12 2 12 2Z" fill="#00f2ff" fillOpacity="0.2" />
    </svg>
  </motion.div>
);

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [petals, setPetals] = useState<{ id: number; delay: number; left: string; size: number }[]>([]);

  useEffect(() => {
    const newPetals = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 10,
      left: `${Math.random() * 100}%`,
      size: 15 + Math.random() * 20
    }));
    setPetals(newPetals);
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await authService.sendLoginOtp({
        email: email,
        role: 'ROLE_CUSTOMER'
      });
      toast.success('Namaste! Verification code sent to your email.');
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || 'Verification failed. Please check your email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setIsLoading(true);
    try {
      const response = await authService.login({ email, otp });

      if (response && response.jwt) {
        toast.success('Swagat Hai! You are now logged in.');
        navigate('/');
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(err.message || 'Invalid code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white bg-[#050618] overflow-x-hidden relative">
      <div className="flex-grow flex items-center justify-center relative">
      {/* Unified Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Background Petals Animation */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {petals.map((petal) => (
            <Petal key={petal.id} {...petal} />
          ))}
        </div>

        {/* Radiant Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/20 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 mandala-bg opacity-[0.03] z-0"></div>
      </div>

      <Link to="/" className="absolute top-6 left-10 font-display font-black text-2xl tracking-tighter text-cyan-400 flex items-center gap-2 z-50">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 1 }}
          className="w-10 h-10 rounded-xl bg-cyan-500 text-black flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(6,182,212,0.5)]"
        >
          S
        </motion.div>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">SastaaBazaar</span>
      </Link>

      {/* Main Content Container: Single parent for both sections */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-stretch justify-center min-h-screen py-12 lg:py-0 overflow-visible">

        {/* Left Section: Login UI */}
        <div className="w-full lg:w-[30%] flex items-center justify-center p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg glass-premium p-8 sm:p-12 rounded-[2.5rem] relative overflow-hidden"
          >
            {/* Subtle Inner Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="mb-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-bold mb-4 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                >
                  <Sparkles className="w-4 h-4" /> Swagat Hai
                </motion.div>
                <h1 className="font-display text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                  Namaste!<br />
                  <span className="text-cyan-400">Swagat Hai</span>
                </h1>
                <p className="text-white/60 text-lg leading-relaxed">Enter your credentials to continue your shopping journey.</p>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.form
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleSendOtp}
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-widest" htmlFor="email">Email Address</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                        </div>
                        <input
                          id="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          placeholder="aapka@email.com"
                          className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border-2 border-white/5 rounded-2xl focus:border-cyan-500/50 outline-none transition-all placeholder:text-white/20 text-lg"
                        />
                      </div>
                    </div>

                    <button
                      disabled={isLoading || !email}
                      type="submit"
                      className="w-full bg-cyan-500 text-black py-4 rounded-2xl font-black text-lg hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.3)] disabled:opacity-70 group"
                    >
                      {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>Continue <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleLogin}
                    className="space-y-6"
                  >
                    <div className="p-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500 text-black flex justify-center items-center shrink-0">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-cyan-400 text-sm mb-1">Check your inbox</h3>
                        <p className="text-xs text-white/50 leading-relaxed italic">
                          Secret code sent to <span className="font-bold text-white">{email}</span>.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <input
                        id="otp"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        type="text"
                        placeholder="••••••"
                        className="w-full px-4 py-5 text-center text-4xl tracking-[0.6em] font-mono bg-white/[0.03] border-2 border-white/10 rounded-2xl focus:border-cyan-500/50 outline-none transition-all"
                        maxLength={6}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <button
                        disabled={isLoading || otp.length < 6}
                        type="submit"
                        className="w-full bg-cyan-500 text-black py-4 rounded-2xl font-black text-lg hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                      >
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Secure Entrance'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-full bg-white/5 text-white/70 py-3 rounded-xl text-sm font-bold hover:bg-white/10 transition-all border border-white/10"
                      >
                        Use different email
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="mt-10 pt-8 border-t border-dashed border-white/10 flex flex-col items-center gap-6">
                <p className="text-white/50 text-base">
                  New to SastaaBazaar?{' '}
                  <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-black transition-colors">Create account</Link>
                </p>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.02] text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-cyan-500" />
                  100% Secure & Passwordless
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Section: AI Robot Assistant (hidden on small screens for cleaner login UI) */}
        <div className="hidden lg:flex w-full lg:w-[70%] items-center justify-center p-4 lg:p-8 relative overflow-visible">
          <div className="absolute inset-x-0 top-6 lg:top-12 z-10 pointer-events-none flex flex-col items-center lg:items-end p-6 text-center lg:text-right w-full">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-cyan-400 text-xs font-black uppercase tracking-widest shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" /> Interactive AI Shopkeeper
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="max-w-md"
            >
              <h2 className="font-display text-3xl lg:text-5xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
                Meet your smart<br />companion.
              </h2>
              <p className="text-lg lg:text-xl text-white/50 leading-relaxed drop-shadow-lg">
                Interact with our AI assistant while we get everything ready for your <span className="text-cyan-400 font-bold">Premium</span> entry.
              </p>
            </motion.div>
          </div>

          <div className="w-full h-[300px] sm:h-[400px] lg:h-full relative z-0 flex items-center justify-center overflow-visible">

            <Spline

              scene="https://prod.spline.design/Ecrb62UIo3eOK8ju/scene.splinecode"

              className="w-full h-full object-contain"

              onLoad={() => {

                // Prevent Spline canvas from stealing focus and scrolling the page down

                setTimeout(() => {

                  if (document.activeElement instanceof HTMLElement) {

                    document.activeElement.blur();

                  }

                  window.scrollTo({ top: 0, behavior: 'instant' });

                }, 50);

              }}

            />

          </div>
        </div>

        </div>

      </div>
      <div className="relative z-50 text-center py-6 border-t border-white/10 bg-[#050618]/80 backdrop-blur-md">
        <p className="text-white/60 text-sm font-medium">
          Developed by Mr Rohan Shukla, Software Engineer
          <br />
          <a
            href="https://www.linkedin.com/in/rohan-shukla-0b8889321"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 hover:underline transition-all mt-2 inline-flex items-center gap-1 font-bold"
          >
            Connect with me on LinkedIn
          </a>
        </p>
      </div>
      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
};

export default Login;
