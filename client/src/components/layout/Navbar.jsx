import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Sparkles, ArrowRight, ScanLine } from 'lucide-react';
import Button from '../common/Button';

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
              Campus<span className="text-brand-600">Pass</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              Identity Platform
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link
            to="/#features"
            className="hover:text-brand-600 transition-colors py-1"
          >
            Features
          </Link>
          <Link
            to="/#how-it-works"
            className="hover:text-brand-600 transition-colors py-1"
          >
            How it Works
          </Link>
          <Link
            to="/#templates"
            className="hover:text-brand-600 transition-colors py-1"
          >
            Card Templates
          </Link>
          <Link
            to="/verify/CAMPUSPASS-DEMO"
            className="flex items-center gap-1.5 text-slate-700 hover:text-brand-600 transition-colors py-1"
          >
            <ScanLine className="w-4 h-4 text-brand-600" />
            <span>Verify Demo</span>
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Get Your Pass
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

