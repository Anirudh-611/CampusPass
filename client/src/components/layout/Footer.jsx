import React from 'react';
import { ShieldCheck, Heart, Github, Lock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 tracking-tight">CampusPass</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enterprise digital campus identity and zero-trust verification platform engineered for colleges, universities, and polytechnics.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Verification Systems Operational</span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/#features" className="hover:text-brand-600 transition-colors">Features</Link></li>
              <li><Link to="/#templates" className="hover:text-brand-600 transition-colors">3D Card Templates</Link></li>
              <li><Link to="/verify/CAMPUSPASS-DEMO" className="hover:text-brand-600 transition-colors">Public QR Verification</Link></li>
              <li><Link to="/#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Access Portals</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/login" className="hover:text-brand-600 transition-colors">Student Login</Link></li>
              <li><Link to="/register" className="hover:text-brand-600 transition-colors">Student Registration</Link></li>
              <li><Link to="/login?role=admin" className="hover:text-brand-600 transition-colors">Administrator Console</Link></li>
              <li><Link to="/verify/CAMPUSPASS-DEMO" className="hover:text-brand-600 transition-colors">Campus Guard Scanner</Link></li>
            </ul>
          </div>

          {/* Security & Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Security</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-brand-600" />
                <span>Zero-Trust Cryptographic UUIDs</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bcrypt Salted Hashes (12 Rounds)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                <span>Role-Based Access Control (RBAC)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ISO/IEC 7810 ID-1 PDF Vector Export</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} CampusPass. Smart Digital Campus Identity Platform.</p>
          <div className="flex items-center gap-1">
            <span>Engineered with precision for portfolio & hackathons</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

