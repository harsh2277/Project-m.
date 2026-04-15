import React from 'react';
import { Layout, Mail, Lock, Chrome, Apple, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#f5f5f5]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-[2rem] overflow-hidden premium-shadow min-h-[700px]"
      >
        {/* Left Side - Form */}
        <div className="flex-1 p-8 md:p-16 flex flex-col">
          <div className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Layout className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Sellora</span>
          </div>

          <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-semibold mb-2 text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 mb-10">Enter your email and password to access your account.</p>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="email" 
                    placeholder="sellostore@company.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-slate-600">Remember Me</span>
                </label>
                <a href="#" className="text-blue-600 font-medium hover:underline">Forgot Your Password?</a>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                onClick={() => window.location.href = '/dashboard'}
              >
                Log In
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="relative my-10 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative px-4 bg-white text-sm text-slate-400">Or Login With</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium">
                <Chrome className="w-5 h-5 text-red-500" />
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium">
                <Apple className="w-5 h-5" />
                Apple
              </button>
            </div>

            <p className="mt-10 text-center text-slate-500">
              Don't Have An Account? <a href="#" className="text-blue-600 font-semibold hover:underline">Register Now.</a>
            </p>
          </div>

          <div className="mt-auto pt-10 flex justify-between text-xs text-slate-400">
            <span>Copyright © 2025 Sellora Enterprises LTD.</span>
            <div className="flex gap-4">
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="hidden md:flex flex-1 bg-blue-600 p-16 flex-col justify-center relative overflow-hidden">
          {/* Mockup Elements */}
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Effortlessly manage your team and operations.
            </h2>
            <p className="text-blue-100 text-lg mb-12 opacity-80">
              Log in to access your CRM dashboard and manage your team.
            </p>

            {/* Dashboard Mockup Representation */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl">
              <div className="flex gap-4 mb-6">
                <div className="h-2 w-12 bg-white/30 rounded-full"></div>
                <div className="h-2 w-8 bg-white/20 rounded-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-32 bg-white/10 rounded-2xl"></div>
                <div className="h-32 bg-white/10 rounded-2xl"></div>
              </div>
              <div className="mt-4 h-48 bg-white/5 rounded-2xl border border-white/10"></div>
            </div>
          </div>

          {/* Abstract circles */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
