import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import dashboardImg from '../../assets/dashboard-screenshot.png';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState('sellostore@company.com');
  const [password, setPassword] = useState('5ellostore.');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-card">

      {/* ── LEFT: Form Panel ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col justify-between w-full lg:w-[46%] h-full px-10 md:px-16 py-10 bg-card"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[17px] font-bold text-text-main tracking-tight">Sellora</span>
        </div>

        {/* Form */}
        <div className="w-full max-w-[380px] mx-auto">
          <h1 className="text-[30px] font-bold text-text-main mb-1.5 leading-tight">Welcome Back</h1>
          <p className="text-[14px] text-text-muted mb-8">Enter your email and password to access your account.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[12px] font-semibold text-text-muted mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-transparent w-full px-4 py-3 border border-border rounded-lg text-[14px] text-text-main placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                style={{ background: 'transparent' }}
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[12px] font-semibold text-text-muted mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-transparent w-full px-4 py-3 pr-11 border border-border rounded-lg text-[14px] text-text-main placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  style={{ background: 'transparent' }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-3.5 h-3.5 accent-primary rounded"
                />
                <span className="text-[13px] text-text-muted font-medium">Remember Me</span>
              </label>
              <button type="button" onClick={() => navigate('/forgot-password')} className="text-[13px] font-semibold text-primary hover:opacity-75 transition-opacity">
                Forgot Your Password?
              </button>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full mt-2 py-3.5 bg-primary hover:opacity-90 text-white rounded-lg text-[14px] font-bold tracking-wide shadow-lg shadow-primary/25 transition-all"
            >
              Log In
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-card px-3 mx-auto block w-fit text-[12px] text-text-muted font-medium">
              Or Login With
            </span>
          </div>

          {/* Social */}
          <div className="grid grid-cols-1 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 border border-border bg-card rounded-lg text-[13px] font-semibold text-text-main hover:bg-page transition-all">
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
          </div>

          {/* Register */}
          <p className="text-center text-[13px] text-text-muted mt-6">
            Don't Have An Account?{' '}
            <Link to="/signup" className="text-primary font-bold hover:opacity-75 transition-opacity">
              Register Now.
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between text-[12px] text-text-muted">
          <span>Copyright © 2025 Sellora Enterprises LTD.</span>
          <button className="hover:text-text-main transition-colors">Privacy Policy</button>
        </div>
      </motion.div>

      {/* ── RIGHT: Brand Panel ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        className="hidden lg:flex flex-col justify-between flex-1 h-full p-10 relative overflow-hidden"
        style={{ background: 'var(--primary)' }}
      >
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-15%] right-[-10%] w-96 h-96 rounded-full opacity-20" style={{ background: 'white' }} />
          <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 rounded-full opacity-10" style={{ background: 'white' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5" style={{ background: 'white' }} />
        </div>

        {/* Text */}
        <div className="relative z-10 max-w-lg mt-16">
          <h2 className="text-[36px] font-bold text-white leading-[1.2] mb-4">
            Effortlessly manage your team and operations.
          </h2>
          <p className="text-[15px] text-white/70 font-medium leading-relaxed">
            Log in to access your dashboard and track hours, projects, and tasks — all in one place.
          </p>
        </div>

        {/* Dashboard Preview Screenshot */}
        <div className="relative z-10 flex-1 flex items-center pb-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.35 }}
            className="w-full max-h-[60vh] rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.35)] border border-white/10"
          >
            <img
              src={dashboardImg}
              alt="Dashboard Preview"
              className="w-[1000px] h-auto object-cover object-top"
              draggable={false}
            />
          </motion.div>
        </div>
      </motion.div>

    </div>
  );
};

export default LoginPage;
