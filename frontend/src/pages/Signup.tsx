import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/IndianTheme.css';
import Spline from '@splinetool/react-spline';

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

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [petals, setPetals] = useState<{ id: number; delay: number; left: string; size: number }[]>([]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    otp: ''
  });

  useEffect(() => {
    const newPetals = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 10,
      left: `${Math.random() * 100}%`,
      size: 15 + Math.random() * 20
    }));
    setPetals(newPetals);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.fullName || !formData.password) {
      toast.error('Kripya sabhi jaankari bharein (Please fill all details).');
      return;
    }

    setIsLoading(true);
    try {
      await authService.sendLoginOtp({
        email: formData.email,
        role: 'ROLE_CUSTOMER'
      });
      toast.success('Namaste! Verification code sent to your email.');
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp) {
      toast.error('Kripya code darj karein (Please enter the code).');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.signup(formData);

      if (response && response.jwt) {
        localStorage.setItem("jwt_token", response.jwt);
        localStorage.setItem("user_role", response.role);

        toast.success('Swagat Hai! Your account has been created.');
        navigate('/');
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(err.message || 'Signup failed. Check OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-[#050618] overflow-x-hidden relative">
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

        {/* Left Section: Signup UI */}
        <div className="w-full lg:w-[40%] flex items-center justify-center p-4 lg:p-8 relative overflow-y-auto lg:overflow-visible hide-scrollbar">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg glass-premium p-8 sm:p-12 rounded-[2.5rem] relative my-12"
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
                  <Sparkles className="w-4 h-4" /> Swadeshi Marketplace
                </motion.div>
                <h1 className="font-display text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                  SastaaBazaar <br />
                  <span className="text-cyan-400">Se Judiye</span>
                </h1>
                <p className="text-white/60 text-lg leading-relaxed">Join India's premium shopping community today.</p>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.form
                    key="signup-step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSendOtp}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest" htmlFor="fullName">Full Name</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                          <input required id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} type="text" placeholder="Aapka Naam" className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border-2 border-white/10 rounded-2xl focus:border-cyan-500/50 outline-none transition-all placeholder:text-white/20 text-lg" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest" htmlFor="email">Email Address</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                          <input required id="email" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="aapka@email.com" className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border-2 border-white/10 rounded-2xl focus:border-cyan-500/50 outline-none transition-all placeholder:text-white/20 text-lg" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest" htmlFor="mobile">Mobile Number</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                          <input required id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} type="tel" placeholder="+91 98XXX XXXXX" className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border-2 border-white/10 rounded-2xl focus:border-cyan-500/50 outline-none transition-all placeholder:text-white/20 text-lg" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest" htmlFor="password">Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                          <input required id="password" name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Strong password" className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border-2 border-white/10 rounded-2xl focus:border-cyan-500/50 outline-none transition-all placeholder:text-white/20 text-lg" />
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={isLoading}
                      type="submit"
                      className="w-full bg-cyan-500 text-black py-4 rounded-2xl font-black text-lg hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 mt-6 shadow-[0_0_30px_rgba(6,182,212,0.3)] disabled:opacity-70 group"
                    >
                      {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>Create Account <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup-step2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onSubmit={handleSignup}
                    className="space-y-6"
                  >
                    <div className="p-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500 text-black flex justify-center items-center shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-cyan-400 text-sm mb-1">Verify Email</h3>
                        <p className="text-xs text-white/50 leading-relaxed italic">
                          Code sent to <span className="font-bold text-white">{formData.email}</span>.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <input
                        id="otp"
                        required
                        name="otp"
                        value={formData.otp}
                        onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '') }))}
                        type="text"
                        placeholder="••••••"
                        className="w-full px-4 py-5 text-center text-4xl tracking-[0.6em] font-mono bg-white/[0.03] border-2 border-white/10 rounded-2xl focus:border-cyan-500/50 outline-none transition-all"
                        maxLength={6}
                      />
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                      <button
                        disabled={isLoading || formData.otp.length < 6}
                        type="submit"
                        className="w-full bg-cyan-500 text-black py-4 rounded-2xl font-black text-lg hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                      >
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm & Join'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-full bg-white/5 text-white/70 py-3 rounded-xl text-sm font-bold hover:bg-white/10 transition-all border border-white/10"
                      >
                        Go Back
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="mt-10 pt-8 border-t border-dashed border-white/10 flex flex-col items-center gap-6">
                <p className="text-white/50 text-base">
                  Pehle se account hai?{' '}
                  <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-black transition-colors">Log in</Link>
                </p>
                <div className="px-6 text-[10px] text-white/30 font-medium text-center leading-relaxed">
                  By joining, you agree to SastaaBazaar's Swadeshi Terms of Service and Privacy Notice.
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Section: AI Robot Assistant (hidden on small screens for cleaner signup UI) */}
        <div className="hidden lg:flex w-full lg:w-[60%] items-center justify-center p-4 lg:p-8 relative overflow-visible">
          <div className="absolute inset-x-0 top-6 lg:top-12 z-10 pointer-events-none flex flex-col items-center lg:items-end p-6 text-center lg:text-right w-full">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-cyan-400 text-xs font-black uppercase tracking-widest shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" /> 3D Assistant Active
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="max-w-md"
            >
              <h2 className="font-display text-3xl lg:text-5xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
                Pure Blue<br />Experience.
              </h2>
              <p className="text-lg lg:text-xl text-white/50 leading-relaxed drop-shadow-lg">
                Welcome to SastaaBazaar. Interact with your AI companion while we initialize your <span className="text-cyan-400 font-bold">New Account</span>.
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
  );
};

export default Signup;
