'use client';

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getLandingContent } from "@/lib/i18n/landing";
import { ArrowLeftIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function SignInPage() {
  const { language } = useLanguage();
  const content = getLandingContent(language);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement sign in logic
    console.log('Sign in:', { email, password });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header with back button */}
      <div className="px-4 sm:px-6 py-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start sm:items-center justify-center px-4 sm:px-6 pb-12">
        <div className="w-full max-w-md space-y-8">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-center">
            {content.auth.signIn.title}
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-3">
              <label className="block text-sm sm:text-base text-white/90">
                {content.auth.signIn.emailLabel}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                  <EnvelopeIcon className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={content.auth.signIn.emailPlaceholder}
                  className="w-full bg-transparent border border-white/20 rounded-xl px-12 py-4 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-3">
              <label className="block text-sm sm:text-base text-white/90">
                {content.auth.signIn.passwordLabel}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                  <LockClosedIcon className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={content.auth.signIn.passwordPlaceholder}
                  className="w-full bg-transparent border-2 border-accent rounded-xl px-12 py-4 text-white placeholder:text-white/40 focus:border-accent focus:outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-left">
              <Link 
                href="/forgot-password"
                className="text-sm text-accent hover:text-red-400 transition"
              >
                {content.auth.signIn.forgotPassword}
              </Link>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              className="w-full bg-accent hover:bg-red-600 text-white font-semibold py-4 rounded-xl transition shadow-[0_10px_40px_rgba(229,9,20,0.35)] hover:shadow-[0_15px_50px_rgba(229,9,20,0.5)]"
            >
              {content.auth.signIn.signInButton}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black text-white/50">
                {content.auth.signIn.orDivider}
              </span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full bg-transparent border border-white/20 hover:border-white/40 text-white font-medium py-4 rounded-xl transition flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              {content.auth.signIn.continueWithApple}
            </button>

            <button
              type="button"
              className="w-full bg-transparent border border-white/20 hover:border-white/40 text-white font-medium py-4 rounded-xl transition flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {content.auth.signIn.continueWithGoogle}
            </button>
          </div>

          {/* Sign up link */}
          <div className="text-center text-sm text-white/60">
            {content.auth.signIn.noAccount}{' '}
            <Link
              href="/signup"
              className="text-accent hover:text-red-400 font-medium transition"
            >
              {content.auth.signIn.signUp}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


