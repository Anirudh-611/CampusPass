import React, { useState, useEffect, useRef } from 'react';
import IDCard from '../components/id-card/IDCard';
import IDCardActions from '../components/id-card/IDCardActions';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { generateIDCardPDF } from '../utils/pdfGenerator';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  CreditCard,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function IDCardStudioPage() {
  const { user, student: authStudent, card: authCard, setCard } = useAuth();
  const [template, setTemplate] = useState(authCard?.template || 'minimal'); // 'minimal' | 'dark' | 'classic'
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [notification, setNotification] = useState('');
  const cardRef = useRef(null);

  // Student card state
  const [cardData, setCardData] = useState({
    fullName: authStudent?.fullName || user?.name || 'Alex Rivera',
    avatarUrl: authStudent?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    rollNumber: authStudent?.rollNumber || 'ENG-2024-8921',
    collegeName: authStudent?.collegeName || 'Apex State Institute of Technology',
    department: authStudent?.department || 'Computer Science & Engineering',
    course: authStudent?.course || 'B.Tech Artificial Intelligence',
    currentSemester: authStudent?.currentSemester?.toString() || '4',
    academicBatch: authStudent?.academicBatch || '2023 - 2027',
    bloodGroup: authStudent?.bloodGroup || 'O+',
    validUntil: authCard?.validUntil || 'July 2027',
    cardNumber: authCard?.cardNumber || 'CP-8921-2024',
    status: authCard?.status || 'APPROVED',
    verificationId: authCard?.verificationId || 'CAMPUSPASS-DEMO',
  });

  // Pull latest card and profile from backend
  useEffect(() => {
    const fetchLatestCard = async () => {
      try {
        const res = await api.get('/id-cards/my-card');
        if (res.data.success) {
          const c = res.data.data;
          setCard(c);
          if (c.template) setTemplate(c.template);
          setCardData((prev) => ({
            ...prev,
            status: c.status,
            cardNumber: c.cardNumber || prev.cardNumber,
            validUntil: c.validUntil || prev.validUntil,
            verificationId: c.verificationId || prev.verificationId,
            fullName: c.student?.fullName || prev.fullName,
            rollNumber: c.student?.rollNumber || prev.rollNumber,
            department: c.student?.department || prev.department,
            course: c.student?.course || prev.course,
            academicBatch: c.student?.academicBatch || prev.academicBatch,
            avatarUrl: c.student?.avatarUrl || prev.avatarUrl,
          }));
        }
      } catch (err) {
        console.warn('Backend card fetch note:', err.message);
      }
    };

    fetchLatestCard();
  }, [setCard]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  // Switch and persist template
  const handleSelectTemplate = async (selectedTmpl) => {
    setTemplate(selectedTmpl);
    setIsSavingTemplate(true);

    try {
      const res = await api.post('/id-cards/apply', { template: selectedTmpl });
      if (res.data.success) {
        setCard(res.data.data);
        setNotification(`Design template updated to ${selectedTmpl.toUpperCase()} in database.`);
        setTimeout(() => setNotification(''), 3000);
      }
    } catch (err) {
      // Offline mode preview continues seamlessly
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const cardEl = cardRef.current;
      await generateIDCardPDF(cardEl, `CampusPass-${cardData.rollNumber}.pdf`);
    } catch (err) {
      alert('Could not generate PDF. Please ensure images are fully loaded.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Studio Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Digital ID Card Studio</h1>
            <Badge variant="brand" size="sm">
              Live Reactive Engine
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time reactive canvas preview. Choose between 3 templates, inspect the back QR face, and export print-ready PDFs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/verify/${cardData.verificationId}`} target="_blank">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
              rightIcon={<ExternalLink className="w-3.5 h-3.5 text-slate-400" />}
            >
              Test Public QR Page
            </Button>
          </Link>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: The Live ID Card Canvas & Actions (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-100/80 border border-slate-200/80 p-6 sm:p-10 rounded-3xl flex flex-col items-center justify-center min-h-[380px] shadow-inner relative">
            {/* Visual background watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <CreditCard className="w-96 h-96" />
            </div>

            {/* The Live Interactive IDCard */}
            <IDCard
              cardRef={cardRef}
              student={cardData}
              template={template}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
            />

            {/* Hint below card */}
            <p className="text-[11px] text-slate-500 mt-4 flex items-center gap-1.5 font-medium">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Click card or use button below to flip front/back</span>
            </p>
          </div>

          {/* Template Selector & Action Bar */}
          <IDCardActions
            currentTemplate={template}
            onSelectTemplate={handleSelectTemplate}
            isFlipped={isFlipped}
            onToggleFlip={() => setIsFlipped(!isFlipped)}
            onDownloadPDF={handleDownloadPDF}
            isDownloading={isDownloading}
          />
        </div>

        {/* Right Column: Dynamic Form Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Live Data Synchronizer
              </h3>
              <p className="text-xs text-slate-500">
                Type in the fields below to see the card update immediately
              </p>
            </div>
            <Sparkles className="w-4 h-4 text-brand-600" />
          </div>

          <div className="space-y-3.5">
            <Input
              label="Student Name"
              name="fullName"
              value={cardData.fullName}
              onChange={handleInputChange}
            />

            <Input
              label="Roll Number / ID"
              name="rollNumber"
              value={cardData.rollNumber}
              onChange={handleInputChange}
            />

            <Input
              label="College Name"
              name="collegeName"
              value={cardData.collegeName}
              onChange={handleInputChange}
            />

            <Input
              label="Department"
              name="department"
              value={cardData.department}
              onChange={handleInputChange}
            />

            <Input
              label="Course / Program"
              name="course"
              value={cardData.course}
              onChange={handleInputChange}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Academic Batch"
                name="academicBatch"
                value={cardData.academicBatch}
                onChange={handleInputChange}
              />

              <Input
                label="Blood Group"
                name="bloodGroup"
                value={cardData.bloodGroup}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Card Number"
                name="cardNumber"
                value={cardData.cardNumber}
                onChange={handleInputChange}
                disabled
              />

              <Input
                label="Validity Period"
                name="validUntil"
                value={cardData.validUntil}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="p-3 bg-brand-50 rounded-xl border border-brand-100 text-xs text-brand-800 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
              <span>Reactive Synchronizer Active</span>
            </p>
            <p className="text-[11px] leading-tight text-brand-700">
              Changes reflect live on the canvas. When satisfied, click "Download PDF Pass" to generate an ISO/IEC 7810 ID-1 standard document calibrated for PVC card printers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
