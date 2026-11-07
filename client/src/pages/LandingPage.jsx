import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Download,
  Lock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  RotateCw,
  Building2,
  Users2,
  FileCheck,
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function LandingPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');
  const [isFlipped, setIsFlipped] = useState(false);

  // Demo preview card state
  const demoStudent = {
    fullName: 'Alex Rivera',
    rollNumber: 'ENG-2024-8921',
    department: 'Computer Science & Engineering',
    course: 'B.Tech in Artificial Intelligence',
    batch: '2023 - 2027',
    semester: 'Semester 4',
    bloodGroup: 'O+',
    validUntil: 'July 2027',
    cardNumber: 'CP-8921-2024',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    verificationId: 'CAMPUSPASS-DEMO',
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-brand-100/50 via-indigo-50/30 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-12 pb-20 lg:pt-20 lg:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: SaaS Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Next-Gen Campus Identity Management</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Smart digital campus identity,{' '}
              <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-800 bg-clip-text text-transparent">
                cryptographically verified.
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Replace vulnerable plastic cards with tamper-proof digital passes.
              Live multi-template generation, real-time administrative authorization,
              and sub-second QR identity verification.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto shadow-lg shadow-brand-500/25"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Create Your CampusPass
                </Button>
              </Link>
              <Link to="/verify/CAMPUSPASS-DEMO" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  leftIcon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
                >
                  Live QR Scan Demo
                </Button>
              </Link>
            </div>

            {/* Quick Metrics / Trust Indicators */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-2xl font-bold text-slate-900">0.2s</p>
                <p className="text-xs text-slate-500">QR Verify Speed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">100%</p>
                <p className="text-xs text-slate-500">Tamper Proof</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">300 DPI</p>
                <p className="text-xs text-slate-500">Print Ready PDF</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Animated Live Card Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Interactive Template Selector Controls */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm mb-4">
              <button
                onClick={() => setSelectedTemplate('minimal')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedTemplate === 'minimal'
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Modern Minimal
              </button>
              <button
                onClick={() => setSelectedTemplate('dark')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedTemplate === 'dark'
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Premium Dark
              </button>
              <button
                onClick={() => setSelectedTemplate('classic')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedTemplate === 'classic'
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                University Classic
              </button>
            </div>

            {/* 3D Flip Card Container */}
            <div className="perspective-1000 w-full max-w-sm">
              <div
                className={`relative w-full aspect-[1.586/1] transition-transform duration-700 transform-style-3d cursor-pointer ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                onClick={() => setIsFlipped(!isFlipped)}
                title="Click to flip card"
              >
                {/* FRONT FACE */}
                <div
                  className={`absolute inset-0 rounded-2xl p-5 backface-hidden flex flex-col justify-between shadow-card-lift transition-colors border ${
                    selectedTemplate === 'dark'
                      ? 'bg-slate-950 text-white border-slate-800'
                      : selectedTemplate === 'classic'
                      ? 'bg-amber-50/50 text-slate-900 border-amber-200'
                      : 'bg-white text-slate-900 border-slate-200'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b pb-2.5 border-slate-200/40">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-wider leading-none">
                          Apex State Institute of Tech
                        </p>
                        <p className="text-[9px] opacity-60">Accredited Academic Identity</p>
                      </div>
                    </div>
                    <Badge variant="success" size="sm" dot>
                      ACTIVE
                    </Badge>
                  </div>

                  {/* Card Body */}
                  <div className="flex items-center gap-4 py-2">
                    <img
                      src={demoStudent.photo}
                      alt={demoStudent.fullName}
                      className="w-20 h-24 object-cover rounded-xl border-2 border-brand-500/30 shadow-sm"
                    />
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="text-xs font-mono font-semibold text-brand-600">
                        {demoStudent.rollNumber}
                      </p>
                      <h3 className="font-bold text-base leading-tight truncate">
                        {demoStudent.fullName}
                      </h3>
                      <p className="text-[11px] opacity-75 font-medium truncate">
                        {demoStudent.department}
                      </p>
                      <div className="pt-1 flex items-center gap-3 text-[10px] opacity-70">
                        <span>Batch: {demoStudent.batch}</span>
                        <span>Blood: {demoStudent.bloodGroup}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/40 text-[9px] font-mono">
                    <span className="opacity-60">ID: {demoStudent.cardNumber}</span>
                    <span className="text-brand-600 font-semibold">Valid: {demoStudent.validUntil}</span>
                  </div>
                </div>

                {/* BACK FACE */}
                <div
                  className={`absolute inset-0 rounded-2xl p-5 backface-hidden rotate-y-180 flex flex-col justify-between shadow-card-lift border ${
                    selectedTemplate === 'dark'
                      ? 'bg-slate-900 text-white border-slate-800'
                      : selectedTemplate === 'classic'
                      ? 'bg-amber-100/50 text-slate-900 border-amber-300'
                      : 'bg-slate-100 text-slate-900 border-slate-300'
                  }`}
                >
                  <div className="text-center border-b pb-2 border-slate-300/40">
                    <p className="text-[10px] font-bold uppercase tracking-wider">
                      Official Campus Verification Token
                    </p>
                    <p className="text-[9px] opacity-70">Scan using any standard smartphone camera</p>
                  </div>

                  {/* Simulated QR Code */}
                  <div className="flex items-center justify-center gap-4 py-2">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-300 shadow-inner flex flex-col items-center">
                      <QrCode className="w-20 h-20 text-slate-900" />
                      <span className="text-[8px] font-mono text-slate-500 mt-1">
                        CP-VERIFY-ID
                      </span>
                    </div>
                    <div className="space-y-1.5 text-[10px] text-left opacity-80 max-w-[150px]">
                      <p className="font-semibold text-brand-600">Tamper-Proof Guarantee</p>
                      <p className="text-[9px] leading-tight">
                        Encodes cryptographic pointer verified against campus servers in real time.
                      </p>
                      <p className="text-[8px] font-mono opacity-50">SHA-256 Validated</p>
                    </div>
                  </div>

                  <div className="text-center text-[8px] opacity-60">
                    Property of Apex State Institute. If found, please return to Student Affairs.
                  </div>
                </div>
              </div>
            </div>

            {/* Flip helper indicator */}
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 transition-colors font-medium"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Click card to inspect reverse verification side</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Pillars Section */}
      <section id="features" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Engineered For Academic Institutions
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Why CampusPass outperforms physical plastic badges
            </h3>
            <p className="text-slate-600 text-sm sm:text-base">
              A comprehensive system architected to eliminate manual printing queues,
              prevent card forgery, and provide instant administrative governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-brand-300 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Zero-Trust QR Verification</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cards never store private or forgeable status inside the QR image. Scanning triggers a live cryptographic lookup against backend database states.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-brand-300 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">3 Designer Templates</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Switch seamlessly between Modern Minimal, Premium Dark, and University Classic layouts with instant live state synchronization.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-brand-300 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Download className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">300 DPI Vector PDF Export</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generates dual-sided ISO/IEC 7810 ID-1 standard PDF documents calibrated for physical thermal sublimation printers or mobile wallet storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              End-to-End Lifecycle
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              From onboarding to instant verification
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-extrabold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900">Submit Academic Record</h4>
              <p className="text-sm text-slate-600">
                Student registers, enters enrollment details, uploads a verified photo, and selects their preferred ID card design template.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-extrabold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900">Admin Approval Triage</h4>
              <p className="text-sm text-slate-600">
                College administrators inspect incoming requests, review photo compliance, verify roll numbers, and grant signed approval with 1 click.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-extrabold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900">Instant Verification & PDF</h4>
              <p className="text-sm text-slate-600">
                Approved card receives an active cryptographic QR badge. Campus guards scan the pass to confirm identity in under 200 milliseconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Architecture Callout */}
      <section className="py-16 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Enterprise Security Standard</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Built with zero-trust verification architecture.
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                Unlike simple student project demos, CampusPass enforces strict server-side validation.
                If a student drops out, is suspended, or loses their credential, administrators can revoke the card instantly.
                The very next scan reflects the revocation in real time.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link to="/register">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold"
                >
                  Start Building Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

