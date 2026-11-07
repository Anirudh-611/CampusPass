import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Loader2,
} from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import api from '../services/api';

export default function AdminStudentsDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  const [students, setStudents] = useState([
    {
      id: 's-1',
      fullName: 'Alex Rivera',
      rollNumber: 'ENG-2024-8921',
      email: 'alex.rivera@campuspass.edu',
      phone: '+1 (555) 234-5678',
      department: 'Computer Science & Engineering',
      course: 'B.Tech in Artificial Intelligence',
      semester: '4',
      batch: '2023 - 2027',
      cardStatus: 'APPROVED',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 's-2',
      fullName: 'Elena Rostova',
      rollNumber: 'ENG-2024-9102',
      email: 'elena.rostova@campuspass.edu',
      phone: '+1 (555) 987-6543',
      department: 'Computer Science & Engineering',
      course: 'B.Tech Artificial Intelligence',
      semester: '4',
      batch: '2023 - 2027',
      cardStatus: 'PENDING',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 's-3',
      fullName: 'Marcus Chen',
      rollNumber: 'ENG-2024-8841',
      email: 'marcus.chen@campuspass.edu',
      phone: '+1 (555) 345-6789',
      department: 'Electronics & Communication',
      course: 'B.Tech Robotics & Embedded',
      semester: '4',
      batch: '2023 - 2027',
      cardStatus: 'PENDING',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 's-4',
      fullName: 'Jordan Smith',
      rollNumber: 'ENG-2024-6632',
      email: 'jordan.smith@campuspass.edu',
      phone: '+1 (555) 456-7890',
      department: 'Mechanical Engineering',
      course: 'B.Tech Automobile Systems',
      semester: '4',
      batch: '2023 - 2027',
      cardStatus: 'REVOKED',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    },
  ]);

  const departments = [
    'ALL',
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Information Technology',
    'Civil Engineering',
    'Business Administration',
  ];

  // Fetch live students from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(
          `/admin/students?department=${departmentFilter}&search=${searchQuery}`
        );
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          setStudents(
            res.data.data.map((s) => ({
              id: s._id,
              fullName: s.fullName,
              rollNumber: s.rollNumber,
              email: s.user?.email || `${s.rollNumber.toLowerCase()}@campuspass.edu`,
              phone: s.phone || 'Not Provided',
              department: s.department,
              course: s.course,
              semester: s.currentSemester?.toString() || '1',
              batch: s.academicBatch,
              cardStatus: s.card?.status || 'APPROVED',
              avatarUrl: s.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            }))
          );
        }
      } catch (err) {
        console.warn('Backend student directory note:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [departmentFilter, searchQuery]);

  const handleExportCSV = () => {
    const headers = ['Full Name', 'Roll Number', 'Department', 'Course', 'Batch', 'Phone'];
    const rows = students.map((s) => [
      `"${s.fullName}"`,
      `"${s.rollNumber}"`,
      `"${s.department}"`,
      `"${s.course}"`,
      `"${s.batch}"`,
      `"${s.phone}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CampusPass-Student-Directory-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = students.filter((s) => {
    const matchDept = departmentFilter === 'ALL' || s.department === departmentFilter;
    const matchQuery =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchQuery;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Student Directory</h1>
          <p className="text-xs text-slate-500">
            Official institutional register of all enrolled students and their digital credential lifecycle
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={handleExportCSV}
        >
          Export CSV Registry
        </Button>
      </div>

      {/* Search & Department Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Department:
          </span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <img
                  src={s.avatarUrl}
                  alt={s.fullName}
                  className="w-14 h-16 object-cover rounded-xl border border-slate-200 shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{s.fullName}</h3>
                  <p className="text-xs font-mono font-semibold text-brand-600">
                    {s.rollNumber}
                  </p>
                  <p className="text-xs text-slate-500">{s.department}</p>
                </div>
              </div>
              <Badge
                variant={
                  s.cardStatus === 'APPROVED'
                    ? 'success'
                    : s.cardStatus === 'PENDING'
                    ? 'warning'
                    : 'danger'
                }
                size="sm"
                dot
              >
                {s.cardStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-600 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{s.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 truncate">
                <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{s.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 truncate">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{s.course}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 truncate">
                <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>Batch: {s.batch}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
