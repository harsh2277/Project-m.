import React, { useState } from 'react';
import { CheckCircle, Send, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import dashboardImg from '../../assets/dashboard-screenshot.png';
import { useAuth } from '../../contexts/AuthContext';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email);
      setShowPopup(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-[30px] font-bold text-text-main mb-1.5 leading-tight">
            Forgot Password?
          </h1>
          <p className="text-[14px] text-text-muted mb-8">
            No worries! Enter your email and we'll send you a reset link right away.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error banner */}
            {error && (
              <div className="px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-[13px] font-semibold">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[12px] font-semibold text-text-muted mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent w-full px-4 py-3 border border-border rounded-lg text-[14px] text-text-main placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                style={{ background: 'transparent' }}
                placeholder="your@email.com"
              />
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-primary hover:opacity-90 text-white rounded-lg text-[14px] font-bold tracking-wide shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : 'Send Reset Link'}
            </motion.button>
          </form>

          {/* Back to Login */}
          <p className="text-center text-[13px] text-text-muted mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-primary font-bold hover:opacity-75 transition-opacity">
              Back to Login.
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
            Secure account recovery in seconds.
          </h2>
          <p className="text-[15px] text-white/70 font-medium leading-relaxed">
            We'll send a secure reset link to your inbox so you can get back to managing your team without any hassle.
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

      {/* ── Success Popup ── */}
      <AnimatePresence>
        {showPopup && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowPopup(false)}
            />

            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="pointer-events-auto w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Glow */}
                <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-56 h-56 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

                {/* Close button */}
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Animated icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
                  className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mb-5 relative z-10"
                >
                  <CheckCircle className="w-8 h-8 text-primary" strokeWidth={1.8} />
                </motion.div>

                <h2 className="text-[22px] font-bold text-text-main mb-2">Check your inbox!</h2>
                <p className="text-[13px] text-text-muted leading-relaxed mb-1">
                  We've sent a password reset link to
                </p>
                <p className="text-primary font-semibold text-[13px] mb-4 truncate max-w-full px-2">
                  {email}
                </p>
                <p className="text-[12px] text-text-muted mb-7">
                  Didn't receive it? Check your spam folder or try again in a few minutes.
                </p>

                {/* Actions */}
                <div className="w-full flex flex-col gap-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/login')}
                    className="w-full py-3 bg-primary hover:opacity-90 text-white rounded-lg font-bold text-[14px] shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Back to Login
                  </motion.button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="w-full py-3 border border-border hover:bg-page text-text-muted rounded-lg font-semibold text-[14px] transition-all"
                  >
                    Resend Email
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ForgotPasswordPage;
