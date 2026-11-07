import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  User,
  CheckCircle2,
  Clock,
  Download,
  QrCode,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Calendar,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function StudentDashboard() {
  const { user, student: authStudent, card: authCard, setStudent, setCard } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    name: user?.name || 'Alex Rivera',
    rollNumber: authStudent?.rollNumber || 'ENG-2024-8921',
    department: authStudent?.department || 'Computer Science & Engineering',
    course: authStudent?.course || 'B.Tech Artificial Intelligence',
    batch: authStudent?.academicBatch || '2023 - 2027',
    semester: authStudent?.currentSemester ? `Semester ${authStudent.currentSemester}` : 'Semester 4',
    email: user?.email || 'alex.rivera@campuspass.edu',
    cardStatus: authCard?.status || 'APPROVED', // 'APPROVED' | 'PENDING' | 'REJECTED' | 'REVOKED'
    validUntil: authCard?.validUntil || 'July 2027',
    cardNumber: authCard?.cardNumber || 'CP-8921-2024',
    verificationId: authCard?.verificationId || 'CAMPUSPASS-DEMO',
    photo: authStudent?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    rejectionReason: authCard?.rejectionReason,
  });

  // Calculate profile completeness percentage dynamically
  const calculateCompleteness = (s) => {
    if (!s) return 85;
    const fields = [
      s.fullName,
      s.rollNumber,
      s.department,
      s.course,
      s.academicBatch,
      s.avatarUrl,
      s.phone,
      s.dateOfBirth,
      s.bloodGroup && s.bloodGroup !== 'Not Specified',
      s.address,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const [profileCompletion, setProfileCompletion] = useState(85);

  // Fetch live student profile and card on mount
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        setLoading(true);
        const [profileRes, cardRes] = await Promise.allSettled([
          api.get('/students/profile'),
          api.get('/id-cards/my-card'),
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value.data.success) {
          const s = profileRes.value.data.data;
          setStudent(s);
          setProfileCompletion(calculateCompleteness(s));
          setDashboardData((prev) => ({
            ...prev,
            name: s.fullName || prev.name,
            rollNumber: s.rollNumber || prev.rollNumber,
            department: s.department || prev.department,
            course: s.course || prev.course,
            batch: s.academicBatch || prev.batch,
            photo: s.avatarUrl || prev.photo,
          }));
        }

        if (cardRes.status === 'fulfilled' && cardRes.value.data.success) {
          const c = cardRes.value.data.data;
          setCard(c);
          setDashboardData((prev) => ({
            ...prev,
            cardStatus: c.status,
            cardNumber: c.cardNumber || 'PENDING-ISSUANCE',
            verificationId: c.verificationId,
            validUntil: c.validUntil || prev.validUntil,
            rejectionReason: c.rejectionReason,
          }));
        }
      } catch (err) {
        console.warn('Backend API offline or using demo state:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();
  }, [setStudent, setCard]);

  const statusVariant = {
    APPROVED: 'success',
    PENDING: 'warning',
    REJECTED: 'danger',
    REVOKED: 'danger',
  }[dashboardData.cardStatus] || 'neutral';

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Academic Session 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {dashboardData.name}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              {dashboardData.cardStatus === 'APPROVED'
                ? 'Your official digital campus identity pass is active. You can present this badge for library access, exam hall verification, and campus transit.'
                : dashboardData.cardStatus === 'PENDING'
                ? 'Your ID card application is currently awaiting administrator review. Verification QR will activate upon approval.'
                : 'Attention required on your campus identity credential. Review remarks below.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/dashboard/id-card">
              <Button
                variant="primary"
                size="md"
                leftIcon={<CreditCard className="w-4 h-4" />}
              >
                Open ID Studio
              </Button>
            </Link>
            <Link to={`/verify/${dashboardData.verificationId}`} target="_blank">
              <Button
                variant="outline"
                size="md"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                rightIcon={<ExternalLink className="w-4 h-4" />}
              >
                Test Verification
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Rejection Alert Banner if applicable */}
      {dashboardData.cardStatus === 'REJECTED' && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-4 text-rose-900">
          <ShieldAlert className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">ID Card Application Rejected by Administrator</h4>
            <p className="text-xs text-rose-700">
              Reason: {dashboardData.rejectionReason || 'Uploaded photograph or academic details need revision.'}
            </p>
            <div className="pt-2">
              <Link to="/dashboard/id-card">
                <Button variant="danger" size="sm">
                  Update and Resubmit Application
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Metrics & Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: ID Card Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Identity Card Status
            </span>
            <Badge variant={statusVariant} size="sm" dot>
              {dashboardData.cardStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                dashboardData.cardStatus === 'APPROVED'
                  ? 'bg-emerald-100 text-emerald-700'
                  : dashboardData.cardStatus === 'PENDING'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {dashboardData.cardStatus === 'APPROVED' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : dashboardData.cardStatus === 'PENDING' ? (
                <Clock className="w-5 h-5" />
              ) : (
                <ShieldAlert className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {dashboardData.cardStatus === 'APPROVED'
                  ? 'Card Verified & Active'
                  : dashboardData.cardStatus === 'PENDING'
                  ? 'Application Under Review'
                  : 'Card Inactive / Flagged'}
              </p>
              <p className="text-xs text-slate-500 font-mono">
                ID: {dashboardData.cardNumber}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Valid Until: {dashboardData.validUntil}</span>
            <Link to="/dashboard/id-card" className="text-brand-600 font-semibold hover:underline">
              Open Pass →
            </Link>
          </div>
        </div>

        {/* Card 2: Profile Completeness */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Profile Completeness
            </span>
            <span className="text-xs font-bold text-brand-600">
              {profileCompletion}%
            </span>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-brand-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">
              {profileCompletion === 100
                ? 'Your student record is 100% complete!'
                : 'Add your emergency contact or blood group to reach 100%.'}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <Link to="/dashboard/profile" className="text-xs text-brand-600 font-semibold hover:underline">
              Manage Profile Details →
            </Link>
          </div>
        </div>

        {/* Card 3: Zero-Trust Security Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verification Engine
            </span>
            <Badge variant="brand" size="sm">
              Zero-Trust
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Dynamic Public QR</p>
              <p className="text-xs text-slate-500">Sub-second scan validation</p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Token</span>
            <span className="text-brand-600 font-mono text-[10px] truncate max-w-[120px]">
              {dashboardData.verificationId}
            </span>
          </div>
        </div>
      </div>

      {/* Academic Record Dossier Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Official Academic Dossier</h2>
            <p className="text-xs text-slate-500">
              Institutional records officially associated with your CampusPass credential
            </p>
          </div>
          <Link to="/dashboard/profile">
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Roll Number</p>
            <p className="font-mono font-bold text-slate-900 mt-1">{dashboardData.rollNumber}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Department</p>
            <p className="font-semibold text-slate-900 mt-1">{dashboardData.department}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Program / Course</p>
            <p className="font-semibold text-slate-900 mt-1">{dashboardData.course}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Academic Batch</p>
            <p className="font-semibold text-slate-900 mt-1">{dashboardData.batch}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
