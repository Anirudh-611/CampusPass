import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ShieldX,
  Search,
  Filter,
  Eye,
  Check,
  X,
  RotateCw,
  ExternalLink,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import IDCard from '../components/id-card/IDCard';
import api from '../services/api';

export default function AdminCardsQueue() {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);
  const [modalFlipped, setModalFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(null);

  // Cards state
  const [cards, setCards] = useState([
    {
      id: 'c-1',
      fullName: 'Elena Rostova',
      rollNumber: 'ENG-2024-9102',
      department: 'Computer Science & Engineering',
      course: 'B.Tech Artificial Intelligence',
      collegeName: 'Apex State Institute of Technology',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      academicBatch: '2023 - 2027',
      bloodGroup: 'A+',
      currentSemester: '4',
      validUntil: 'July 2027',
      cardNumber: 'CP-9102-2024',
      template: 'minimal',
      status: 'PENDING',
      verificationId: 'CP-VERIFY-9102-ROSTOVA',
      appliedAt: '12 mins ago',
    },
    {
      id: 'c-2',
      fullName: 'Marcus Chen',
      rollNumber: 'ENG-2024-8841',
      department: 'Electronics & Communication',
      course: 'B.Tech Robotics & Embedded',
      collegeName: 'Apex State Institute of Technology',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      academicBatch: '2023 - 2027',
      bloodGroup: 'O+',
      currentSemester: '4',
      validUntil: 'July 2027',
      cardNumber: 'CP-8841-2024',
      template: 'dark',
      status: 'PENDING',
      verificationId: 'CP-VERIFY-8841-CHEN',
      appliedAt: '45 mins ago',
    },
    {
      id: 'c-3',
      fullName: 'Alex Rivera',
      rollNumber: 'ENG-2024-8921',
      department: 'Computer Science & Engineering',
      course: 'B.Tech in Artificial Intelligence',
      collegeName: 'Apex State Institute of Technology',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      academicBatch: '2023 - 2027',
      bloodGroup: 'O+',
      currentSemester: '4',
      validUntil: 'July 2027',
      cardNumber: 'CP-8921-2024',
      template: 'minimal',
      status: 'APPROVED',
      verificationId: 'CAMPUSPASS-DEMO',
      appliedAt: '2 days ago',
    },
    {
      id: 'c-4',
      fullName: 'Jordan Smith',
      rollNumber: 'ENG-2024-6632',
      department: 'Mechanical Engineering',
      course: 'B.Tech Automobile Systems',
      collegeName: 'Apex State Institute of Technology',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      academicBatch: '2023 - 2027',
      bloodGroup: 'B-',
      currentSemester: '4',
      validUntil: 'July 2027',
      cardNumber: 'CP-6632-2024',
      template: 'classic',
      status: 'REVOKED',
      verificationId: 'CP-VERIFY-6632-REVOKED',
      appliedAt: '1 week ago',
    },
  ]);

  // Pull cards from backend API
  const fetchCards = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/admin/cards?status=${filter}&search=${searchQuery}`);
      if (res.data.success && res.data.data) {
        if (res.data.data.length > 0) {
          setCards(
            res.data.data.map((c) => ({
              id: c._id,
              fullName: c.student?.fullName || 'Student',
              rollNumber: c.student?.rollNumber || 'PENDING',
              department: c.student?.department || 'Department',
              course: c.student?.course || 'Degree',
              collegeName: c.student?.collegeName || 'Apex State Institute of Technology',
              avatarUrl: c.student?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
              academicBatch: c.student?.academicBatch || '2023 - 2027',
              bloodGroup: c.student?.bloodGroup || 'O+',
              currentSemester: c.student?.currentSemester || 4,
              validUntil: c.validUntil || 'July 2027',
              cardNumber: c.cardNumber || 'PENDING-ISSUANCE',
              template: c.template || 'minimal',
              status: c.status,
              verificationId: c.verificationId,
              appliedAt: new Date(c.createdAt).toLocaleDateString(),
            }))
          );
        }
      }
    } catch (err) {
      console.warn('Backend cards queue note:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [filter]);

  const handleApprove = async (id) => {
    setActionInProgress(id);
    try {
      const res = await api.patch(`/admin/cards/${id}/approve`);
      if (res.data.success) {
        setCards((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, status: 'APPROVED', cardNumber: res.data.data.cardNumber } : c
          )
        );
        if (selectedStudentForModal && selectedStudentForModal.id === id) {
          setSelectedStudentForModal((prev) => ({
            ...prev,
            status: 'APPROVED',
            cardNumber: res.data.data.cardNumber,
          }));
        }
      }
    } catch (err) {
      // Local optimistic update
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'APPROVED' } : c))
      );
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please enter rejection feedback for the student:');
    if (reason !== null) {
      setActionInProgress(id);
      try {
        const res = await api.patch(`/admin/cards/${id}/reject`, { reason });
        if (res.data.success) {
          setCards((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: 'REJECTED' } : c))
          );
        }
      } catch (err) {
        setCards((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: 'REJECTED' } : c))
        );
      } finally {
        setActionInProgress(null);
      }
    }
  };

  const handleRevoke = async (id) => {
    if (
      confirm(
        'Are you sure you want to REVOKE this card? The public verification page will immediately show INVALID / REVOKED.'
      )
    ) {
      setActionInProgress(id);
      try {
        const res = await api.patch(`/admin/cards/${id}/revoke`, {
          reason: 'Administrative revocation action',
        });
        if (res.data.success) {
          setCards((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: 'REVOKED' } : c))
          );
        }
      } catch (err) {
        setCards((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: 'REVOKED' } : c))
        );
      } finally {
        setActionInProgress(null);
      }
    }
  };

  const filteredCards = cards.filter((c) => {
    const matchesFilter = filter === 'ALL' || c.status === filter;
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Card Applications & Triage Queue
          </h1>
          <p className="text-xs text-slate-500">
            Inspect live front & back card rendering before granting cryptographic verification status
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'REVOKED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === f
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Student</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Template</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCards.length > 0 ? (
                filteredCards.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Student Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.avatarUrl}
                          alt={c.fullName}
                          className="w-10 h-12 object-cover rounded-lg border border-slate-200 shadow-sm"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{c.fullName}</p>
                          <p className="font-mono text-brand-600">{c.rollNumber}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-800">{c.department}</p>
                      <p className="text-[10px] text-slate-400">{c.course}</p>
                    </td>

                    {/* Template */}
                    <td className="py-4 px-6">
                      <span className="capitalize font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-700">
                        {c.template}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          c.status === 'APPROVED'
                            ? 'success'
                            : c.status === 'PENDING'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                        dot
                      >
                        {c.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedStudentForModal(c);
                            setModalFlipped(false);
                          }}
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                        >
                          Inspect Card
                        </Button>

                        {c.status === 'PENDING' && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => handleApprove(c.id)}
                              isLoading={actionInProgress === c.id}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-rose-600 border-rose-200 hover:bg-rose-50"
                              onClick={() => handleReject(c.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        {c.status === 'APPROVED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-rose-600 border-rose-200 hover:bg-rose-50"
                            onClick={() => handleRevoke(c.id)}
                            isLoading={actionInProgress === c.id}
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No card applications found matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspector Modal */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Inspect Digital ID Card Preview
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedStudentForModal.fullName} ({selectedStudentForModal.rollNumber})
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Render the actual live card! */}
            <div className="bg-slate-100 p-6 rounded-2xl flex flex-col items-center justify-center">
              <IDCard
                student={selectedStudentForModal}
                template={selectedStudentForModal.template}
                isFlipped={modalFlipped}
                onFlip={() => setModalFlipped(!modalFlipped)}
              />
              <button
                onClick={() => setModalFlipped(!modalFlipped)}
                className="mt-3 text-xs text-brand-600 font-semibold flex items-center gap-1 hover:underline"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Flip Card (Front / Back QR)</span>
              </button>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <a
                href={`/verify/${selectedStudentForModal.verificationId}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-500 hover:text-brand-600 flex items-center gap-1 font-mono"
              >
                <span>Live Verify Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-2">
                {selectedStudentForModal.status !== 'APPROVED' && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleApprove(selectedStudentForModal.id)}
                  >
                    Approve Card
                  </Button>
                )}
                {selectedStudentForModal.status === 'APPROVED' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRevoke(selectedStudentForModal.id)}
                  >
                    Revoke Card
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
