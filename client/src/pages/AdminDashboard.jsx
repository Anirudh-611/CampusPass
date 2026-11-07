import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  Search,
  Filter,
  Eye,
  Check,
  X,
  FileSpreadsheet,
  Loader2,
} from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import api from '../services/api';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState({
    totalStudents: '1,420',
    pendingCards: '18',
    approvedCards: '1,385',
    revokedCards: '17',
    totalVerifications: '4,290',
  });

  const [pendingApplications, setPendingApplications] = useState([
    {
      id: 'app-1',
      studentName: 'Elena Rostova',
      rollNumber: 'ENG-2024-9102',
      department: 'Computer Science & Engineering',
      appliedAt: '12 mins ago',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      template: 'Modern Minimal',
    },
    {
      id: 'app-2',
      studentName: 'Marcus Chen',
      rollNumber: 'ENG-2024-8841',
      department: 'Electronics & Communication',
      appliedAt: '45 mins ago',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      template: 'Premium Dark',
    },
    {
      id: 'app-3',
      studentName: 'Aisha Al-Mansoor',
      rollNumber: 'ENG-2024-7719',
      department: 'Mechanical Engineering',
      appliedAt: '2 hours ago',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      template: 'University Classic',
    },
  ]);

  // Pull live statistics on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard-stats');
        if (res.data.success && res.data.data) {
          const { stats, recentPending } = res.data.data;
          setStatsData({
            totalStudents: stats.totalStudents.toLocaleString(),
            pendingCards: stats.pendingCards.toString(),
            approvedCards: stats.approvedCards.toLocaleString(),
            revokedCards: stats.revokedCards.toString(),
            totalVerifications: stats.totalVerifications.toLocaleString(),
          });
          if (recentPending && recentPending.length > 0) {
            setPendingApplications(
              recentPending.map((c) => ({
                id: c._id,
                studentName: c.student?.fullName || 'Student',
                rollNumber: c.student?.rollNumber || 'PENDING',
                department: c.student?.department || 'Department',
                appliedAt: new Date(c.createdAt).toLocaleDateString(),
                avatarUrl: c.student?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
                template: c.template,
              }))
            );
          }
        }
      } catch (err) {
        console.warn('Backend admin stats note:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Registered Students', count: statsData.totalStudents, change: 'Enrolled Registry', icon: Users, color: 'text-brand-600 bg-brand-50' },
    { label: 'Pending Card Reviews', count: statsData.pendingCards, change: 'Awaiting Action', icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Active Verified Cards', count: statsData.approvedCards, change: 'Live Passports', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Revoked / Flagged', count: statsData.revokedCards, change: 'Security Action', icon: ShieldAlert, color: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Administrator Command Center
          </h1>
          <p className="text-xs text-slate-500">
            Real-time student identity verification, issuance queue, and fraud audit dashboard
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/cards">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Clock className="w-4 h-4" />}
            >
              Open Review Queue ({statsData.pendingCards})
            </Button>
          </Link>
          <Link to="/admin/students">
            <Button variant="outline" size="sm" leftIcon={<Users className="w-4 h-4" />}>
              All Students Directory
            </Button>
          </Link>
        </div>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-extrabold text-slate-900">{stat.count}</p>
                <span className="text-[11px] font-semibold text-emerald-600">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Triage Fast Action Queue */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Applications Awaiting Approval
            </h2>
            <p className="text-xs text-slate-500">
              Review photograph compliance and academic credentials before granting active QR status
            </p>
          </div>
          <Link
            to="/admin/cards"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All Applications</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {pendingApplications.map((app) => (
            <div
              key={app.id}
              className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={app.avatarUrl}
                  alt={app.studentName}
                  className="w-12 h-14 object-cover rounded-xl border border-slate-200 shadow-sm"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{app.studentName}</h4>
                    <span className="text-xs font-mono text-brand-600 font-semibold">
                      {app.rollNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{app.department}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>Applied: {app.appliedAt}</span>
                    <span>•</span>
                    <span className="capitalize">Template: {app.template}</span>
                  </div>
                </div>
              </div>

              {/* Triage Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Link to="/admin/cards">
                  <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                    Inspect in Queue
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
