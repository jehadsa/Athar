import {AnimatePresence, motion} from 'motion/react';
import {ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState} from 'react';
import {ATHAR_LOGO_URL, MedicalCase} from '../data/atharData';
import {AppIcon} from './AppIcon';
import type {DonationFlags} from './AtharModals';
import type {AuthenticatedUser} from './LoginPage';
import {ResilientImage} from './ResilientImage';

export interface DonorReceipt {
  id: string;
  receiptCode: string;
  caseCode: string;
  caseTitle: string;
  hospital: string;
  specialty: string;
  amount: number;
  paymentMethod: string;
  date: string;
  status: 'تم التحويل للمستشفى' | 'قيد التدقيق الطبي' | 'مكتمل الأثر';
  isSadaqah?: boolean;
  isZakat?: boolean;
}

export const INITIAL_DONOR_RECEIPTS: DonorReceipt[] = [
  {
    id: 'rec-1',
    receiptCode: 'ATH-REC-904821',
    caseCode: '#ATH-4091',
    caseTitle: 'زراعة قوقعة أذن إلكترونية للطفل ريان',
    hospital: 'مشفى المواساة الجامعي - دمشق',
    specialty: 'جراحة الأذن والسمع',
    amount: 4500000,
    paymentMethod: 'شام كاش',
    date: '2026/11/18',
    status: 'تم التحويل للمستشفى',
    isSadaqah: true,
  },
  {
    id: 'rec-2',
    receiptCode: 'ATH-REC-883104',
    caseCode: '#ATH-5502',
    caseTitle: 'استئصال ورم حميد ضاغط — السيدة سارة',
    hospital: 'مشفى تشرين الجامعي - اللاذقية',
    specialty: 'جراحة أورام دقيقة',
    amount: 3200000,
    paymentMethod: 'حوالة بنكية',
    date: '2026/11/09',
    status: 'تم التحويل للمستشفى',
    isZakat: true,
  },
  {
    id: 'rec-3',
    receiptCode: 'ATH-REC-841920',
    caseCode: '#ATH-8219',
    caseTitle: 'جلسات غسيل كلى ورعاية مستمرة',
    hospital: 'مشفى حلب الجامعي - حلب',
    specialty: 'غسيل الكلى المستمر',
    amount: 2750000,
    paymentMethod: 'سيريتل كاش',
    date: '2026/10/27',
    status: 'مكتمل الأثر',
    isSadaqah: true,
  },
  {
    id: 'rec-4',
    receiptCode: 'ATH-REC-810542',
    caseCode: '#ATH-6104',
    caseTitle: 'قسطرة قلبية عاجلة وإغلاق ثقب بطيني',
    hospital: 'مركز جراحة القلب الجامعي - دمشق',
    specialty: 'جراحة وزراعة القلب',
    amount: 2000000,
    paymentMethod: 'MTN كاش',
    date: '2026/10/14',
    status: 'مكتمل الأثر',
    isZakat: true,
  },
];

interface DonorPortalPageProps {
  currentUser: AuthenticatedUser;
  cases: MedicalCase[];
  donationsHistory: DonorReceipt[];
  walletBalance: number;
  onTopUpWallet: (amount: number, method: string) => void;
  onOpenDonateModal: (
    medicalCase: MedicalCase | null,
    amount?: number,
    flags?: DonationFlags,
  ) => void;
  onOpenAccountModal: () => void;
  onUpdateUser?: (user: AuthenticatedUser) => void;
  onOpenSupport: () => void;
  onBackToHome: () => void;
  onLogout: () => void;
}

type PortalNavSection =
  | 'overview'
  | 'supported-cases'
  | 'curated-cases'
  | 'recurring'
  | 'history';

type OpportunityCategory = 'all' | 'urgent' | 'pediatrics' | 'chronic';

interface ProofModalData {
  title: string;
  caseCode: string;
  hospital: string;
  doctor: string;
  date: string;
  amount: number;
  receiptCode: string;
  summary: string;
  milestones: string[];
}

export function DonorPortalPage({
  currentUser,
  cases,
  donationsHistory,
  walletBalance,
  onTopUpWallet,
  onOpenDonateModal,
  onOpenAccountModal,
  onUpdateUser,
  onOpenSupport,
  onBackToHome,
  onLogout,
}: DonorPortalPageProps) {
  const [activeNav, setActiveNav] = useState<PortalNavSection>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(true);

  const [opportunityFilter, setOpportunityFilter] = useState<OpportunityCategory>('all');
  const [cardAmounts, setCardAmounts] = useState<Record<string, number>>({});
  const [cardFlags, setCardFlags] = useState<Record<string, DonationFlags>>({});
  const [historyFilter, setHistoryFilter] = useState<'all' | 'transferred' | 'zakat_sadaqah'>('all');

  // Recurring sponsorship interactive state
  const [recurringActive, setRecurringActive] = useState(true);
  const [recurringAmount, setRecurringAmount] = useState(250000);
  const [editingRecurring, setEditingRecurring] = useState(false);
  const [recurringDraft, setRecurringDraft] = useState('250000');

  // Wallet top-up modal state
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(250000);
  const [topUpMethod, setTopUpMethod] = useState('شام كاش');
  const [topUpDone, setTopUpDone] = useState(false);

  // Proof / Clinical Invoice modal state
  const [proofModal, setProofModal] = useState<ProofModalData | null>(null);

  // Profile picture state & upload ref
  const avatarStorageKey = `athar_avatar_${currentUser.identifier}`;
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string>(() => {
    if (currentUser.avatarUrl) return currentUser.avatarUrl;
    try {
      return localStorage.getItem(avatarStorageKey) || '';
    } catch {
      return '';
    }
  });
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  useEffect(() => {
    if (currentUser.avatarUrl) {
      setLocalAvatarUrl(currentUser.avatarUrl);
    }
  }, [currentUser.avatarUrl]);

  const effectiveAvatarUrl = currentUser.avatarUrl ?? localAvatarUrl;

  const userInitials = useMemo(() => {
    const parts = currentUser.name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'م';
    if (parts.length === 1) return parts[0].slice(0, 2);
    return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`;
  }, [currentUser.name]);

  const saveAvatar = (nextUrl: string) => {
    setLocalAvatarUrl(nextUrl);
    setAvatarError('');
    try {
      if (nextUrl) {
        localStorage.setItem(avatarStorageKey, nextUrl);
      } else {
        localStorage.removeItem(avatarStorageKey);
      }
    } catch {
      // Ignore storage quota issues
    }
    onUpdateUser?.({...currentUser, avatarUrl: nextUrl || undefined});
  };

  const handleAvatarFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('يرجى اختيار ملف صورة صالح (PNG أو JPG أو WebP).');
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setAvatarError('حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 6 ميغابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const rawDataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!rawDataUrl) return;

      const img = new Image();
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          saveAvatar(rawDataUrl);
          setAvatarModalOpen(false);
          return;
        }
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        const compressed = canvas.toDataURL('image/jpeg', 0.86);
        saveAvatar(compressed);
        setAvatarModalOpen(false);
      };
      img.onerror = () => {
        saveAvatar(rawDataUrl);
        setAvatarModalOpen(false);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const totalContributed = useMemo(
    () => donationsHistory.reduce((acc, row) => acc + row.amount, 0),
    [donationsHistory],
  );

  const completedLivesCount = useMemo(
    () => 4 + donationsHistory.filter((r) => r.status === 'مكتمل الأثر').length,
    [donationsHistory],
  );

  const curatedOpportunities = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return cases
      .filter((item) => item.raised < item.target)
      .filter((item) => {
        if (opportunityFilter === 'urgent') {
          return item.priority === 'critical' || item.priority === 'urgent';
        }
        if (opportunityFilter === 'pediatrics') {
          return item.specialty === 'pediatrics' || item.specialty === 'heart';
        }
        if (opportunityFilter === 'chronic') {
          return item.specialty === 'dialysis' || item.specialty === 'oncology';
        }
        return true;
      })
      .filter((item) => {
        if (!query) return true;
        return `${item.title} ${item.hospital} ${item.specialtyLabel} ${item.code}`
          .toLowerCase()
          .includes(query);
      })
      .slice(0, 3);
  }, [cases, opportunityFilter, searchTerm]);

  const filteredHistory = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return donationsHistory.filter((row) => {
      if (historyFilter === 'transferred' && row.status !== 'تم التحويل للمستشفى') return false;
      if (historyFilter === 'zakat_sadaqah' && !row.isSadaqah && !row.isZakat) return false;
      if (query) {
        return `${row.receiptCode} ${row.caseCode} ${row.caseTitle} ${row.hospital}`
          .toLowerCase()
          .includes(query);
      }
      return true;
    });
  }, [donationsHistory, historyFilter, searchTerm]);

  const scrollToPortalSection = (sectionId: string, navKey: PortalNavSection) => {
    setActiveNav(navKey);
    setMobileSidebarOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  const handleDownloadImpactStatement = () => {
    const lines = [
      'سجل الأثر السنوي وسندات التبرع المعتمدة — منصة أثر',
      '======================================================',
      `اسم المتبرع: ${currentUser.name}`,
      `المعرف الوطني / الحساب: ${currentUser.identifier}`,
      `المحافظة: ${currentUser.city || 'دمشق'}`,
      `إجمالي المساهمات: ${totalContributed.toLocaleString('en-US')} ل.س`,
      `رصيد محفظة الأثر: ${walletBalance.toLocaleString('en-US')} ل.س`,
      'الرسوم الإدارية المقتطعة: 0.0%',
      '',
      'تفاصيل السندات:',
      ...donationsHistory.map(
        (r) =>
          `- [${r.date}] ${r.receiptCode} | ${r.caseCode} | ${r.hospital} | ${r.amount.toLocaleString('en-US')} ل.س | ${r.status}`,
      ),
    ].join('\n');

    const blob = new Blob([lines], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `athar-impact-statement-${currentUser.identifier}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSingleReceipt = (row: DonorReceipt) => {
    const content = [
      'سند تبرع علاجي موثق — منصة أثر الطبية (سوريا)',
      '============================================',
      `رقم السند: ${row.receiptCode}`,
      `تاريخ التحويل: ${row.date}`,
      `المتبرع: ${currentUser.name}`,
      `الحالة الطبية: ${row.caseCode} — ${row.caseTitle}`,
      `الجهة المستفيدة (المستشفى): ${row.hospital}`,
      `التخصص: ${row.specialty}`,
      `المبلغ المحول: ${row.amount.toLocaleString('en-US')} ل.س`,
      `وسيلة الدفع: ${row.paymentMethod}`,
      `حالة السداد: ${row.status}`,
      `التصنيف الشرعي: ${row.isZakat ? 'زكاة مال معتمدة' : row.isSadaqah ? 'صدقة جارية' : 'تبرع علاجي عام'}`,
      'نسبة الوصول للمشفى: 100% (0.0% استقطاع إداري)',
    ].join('\n');

    const blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${row.receiptCode}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveRecurring = (e: FormEvent) => {
    e.preventDefault();
    const parsed = Number(recurringDraft);
    if (parsed >= 25000) {
      setRecurringAmount(parsed);
    }
    setEditingRecurring(false);
  };

  const handleWalletSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (topUpAmount < 10000) return;
    onTopUpWallet(topUpAmount, topUpMethod);
    setTopUpDone(true);
  };

  const rayanCase = cases[0];
  const saraCase = cases[2] || cases[1];

  const sidebarItems: Array<{
    key: PortalNavSection;
    targetId: string;
    label: string;
    icon: string;
  }> = [
    {key: 'overview', targetId: 'portal-welcome', label: 'لوحة التحكم والأثر', icon: 'dashboard'},
    {key: 'supported-cases', targetId: 'portal-supported', label: 'الحالات المدعومة', icon: 'health_and_safety'},
    {key: 'curated-cases', targetId: 'portal-curated', label: 'فرص تبرع مقترحة', icon: 'favorite'},
    {key: 'recurring', targetId: 'portal-recurring', label: 'الكفالة الدورية', icon: 'refresh'},
    {key: 'history', targetId: 'portal-history', label: 'سجل التبرعات والسندات', icon: 'receipt_long'},
  ];

  const renderSidebarBody = () => (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="space-y-5">
        {/* Brand Row */}
        <div className="flex items-center justify-between gap-2 px-1 pt-1">
          <div className="flex items-center gap-2.5">
            <img
              src={ATHAR_LOGO_URL}
              alt="شعار منصة أثر"
              className="h-10 w-auto object-contain shrink-0"
            />
            <div>
              <span className="font-headline-sm text-[20px] font-extrabold text-[#003D60] leading-none block">
                أثر
              </span>
              <span className="font-label-sm text-[11px] text-[#00696D] font-semibold">
                للعطاء الصحي الموثق
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#94F2F7] text-[#002021] text-[11px] font-bold">
            بوابة المتبرع
          </span>
        </div>

        {/* Profile Card */}
        <div className="bg-[#F0F3FF] rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#003D60] text-white flex items-center justify-center shrink-0 font-bold text-base">
            <AppIcon name="person" size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-title-md text-[14px] font-bold text-[#003D60] truncate">
              {currentUser.name}
            </p>
            <p className="font-label-sm text-[11.5px] text-[#00696D] font-semibold flex items-center gap-1 mt-0.5">
              <AppIcon name="verified" size={13} />
              <span>متبرع موثق • {currentUser.city || 'سوريا'}</span>
            </p>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1.5">
          <p className="px-2 text-[11px] font-bold text-[#72787F] tracking-wide">
            القائمة الرئيسية
          </p>
          <nav className="space-y-1" aria-label="تنقل بوابة المتبرع">
            {sidebarItems.map((item) => {
              const isActive = activeNav === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => scrollToPortalSection(item.targetId, item.key)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#20547A] text-[#99C8F4] font-bold shadow-sm'
                      : 'text-[#41474E] hover:bg-[#F0F3FF] hover:text-[#003D60] font-medium'
                  }`}
                >
                  <AppIcon
                    name={item.icon}
                    size={18}
                    className={isActive ? 'text-[#94F2F7]' : 'text-[#00696D]'}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Secondary Actions */}
        <div className="space-y-1.5 pt-2 border-t border-[#D8E3FB]/70">
          <p className="px-2 text-[11px] font-bold text-[#72787F]">الحساب والدعم</p>
          <button
            type="button"
            onClick={() => {
              setMobileSidebarOpen(false);
              onOpenAccountModal();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] text-[#41474E] hover:bg-[#F0F3FF] hover:text-[#003D60] font-medium transition-colors cursor-pointer"
          >
            <AppIcon name="settings" size={18} className="text-[#003D60]" />
            <span>إدارة بيانات الحساب</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileSidebarOpen(false);
              onOpenSupport();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] text-[#41474E] hover:bg-[#F0F3FF] hover:text-[#003D60] font-medium transition-colors cursor-pointer"
          >
            <AppIcon name="support_agent" size={18} className="text-[#00696D]" />
            <span>مركز الدعم والشفافية</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileSidebarOpen(false);
              onBackToHome();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] text-[#003D60] bg-[#F0F3FF]/80 hover:bg-[#DEE8FF] font-bold transition-colors cursor-pointer"
          >
            <AppIcon name="home" size={18} className="text-[#003D60]" />
            <span>العودة للواجهة العامة</span>
          </button>
        </div>
      </div>

      {/* Bottom Logout */}
      <div className="pt-4 border-t border-[#D8E3FB]/70">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E7EEFF] hover:bg-[#FFDAD6] text-[#BA1A1A] font-bold text-[13.5px] transition-colors cursor-pointer"
        >
          <AppIcon name="logout" size={17} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[#F9F9FF] text-[#111C2D]">
      {/* Fixed Desktop Right Sidebar */}
      <aside className="hidden lg:block fixed top-0 right-0 bottom-0 w-72 bg-white border-l border-[#D8E3FB]/80 shadow-[0_1px_12px_rgba(0,61,96,0.04)] z-30">
        {renderSidebarBody()}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-[#111C2D]/40 backdrop-blur-xs"
            />
            <motion.aside
              initial={{x: '100%'}}
              animate={{x: 0}}
              exit={{x: '100%'}}
              transition={{duration: 0.3, ease: [0.16, 1, 0.3, 1]}}
              className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl z-10 overflow-y-auto"
            >
              {renderSidebarBody()}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Top Sticky Portal Header */}
      <header className="fixed top-0 left-0 right-0 lg:right-72 h-16 bg-white/85 backdrop-blur-xl border-b border-[#D8E3FB]/70 z-20 px-4 sm:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="فتح قائمة البوابة"
            className="lg:hidden p-2 rounded-xl bg-[#F0F3FF] text-[#003D60] hover:bg-[#DEE8FF] cursor-pointer"
          >
            <AppIcon name="menu" size={20} />
          </button>

          <div className="flex items-center bg-[#F0F3FF] rounded-xl px-3.5 py-2 w-full max-w-md focus-within:ring-2 focus-within:ring-[#00696D]/30">
            <AppIcon name="search" size={17} className="text-[#72787F] ml-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث برقم الحالة، المستشفى، أو رقم السند..."
              className="bg-transparent w-full text-[13px] text-[#111C2D] placeholder:text-[#72787F] focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-[#72787F] hover:text-[#003D60] cursor-pointer"
                aria-label="مسح البحث"
              >
                <AppIcon name="close" size={15} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#94F2F7] text-[#002021] text-[12px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#00696D] animate-pulse" />
            <span>اتصال موثق • تحويل 100%</span>
          </div>

          {/* Notifications Popover Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen((prev) => !prev);
                setUnreadNotifications(false);
              }}
              aria-label="الإشعارات الطبية"
              className="relative w-10 h-10 rounded-xl bg-[#F0F3FF] hover:bg-[#DEE8FF] text-[#003D60] flex items-center justify-center transition-colors cursor-pointer"
            >
              <AppIcon name="notifications" size={19} />
              {unreadNotifications && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#BA1A1A] ring-2 ring-white" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#D8E3FB] p-4 space-y-3 z-40">
                <div className="flex items-center justify-between border-b border-[#F0F3FF] pb-2">
                  <span className="font-bold text-[13.5px] text-[#003D60]">تحديثات الأثر المباشرة</span>
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[#72787F] hover:text-[#003D60] cursor-pointer"
                  >
                    <AppIcon name="close" size={15} />
                  </button>
                </div>
                <div className="space-y-2.5 text-[12px]">
                  <div className="p-2.5 rounded-xl bg-[#F0F3FF] space-y-0.5">
                    <p className="font-bold text-[#003D60]">تحديد موعد غرفة العمليات — #ATH-4091</p>
                    <p className="text-[#41474E]">
                      أكد مشفى المواساة الجامعي بدمشق جاهزية الفريق الجراحي للطفل ريان.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F0F3FF] space-y-0.5">
                    <p className="font-bold text-[#00696D]">سند تبرع موثق 0% رسوم</p>
                    <p className="text-[#41474E]">
                      تم تحويل مساهمتك الأخيرة مباشرة لحساب المشفى الشريك وإصدار السند.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenAccountModal}
            title="إعدادات الحساب الشخصي"
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-[#F0F3FF] hover:bg-[#DEE8FF] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#003D60] text-white flex items-center justify-center">
              <AppIcon name="person" size={16} />
            </div>
            <span className="hidden sm:inline text-[12.5px] font-bold text-[#003D60] max-w-[110px] truncate">
              {currentUser.name}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="lg:pr-72 pt-16">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Section 1: Top Welcome & Impact Recognition Strip */}
          <motion.section
            id="portal-welcome"
            initial={{opacity: 0, y: 14}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.55, ease: [0.16, 1, 0.3, 1]}}
            className="relative bg-white rounded-2xl shadow-sm p-6 overflow-hidden border border-[#D8E3FB]/60"
          >
            <div className="absolute -top-16 -left-12 w-56 h-56 rounded-full bg-[#CDE5FF]/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 right-16 w-60 h-60 rounded-full bg-[#94F2F7]/30 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setAvatarError('');
                      setAvatarModalOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setAvatarError('');
                        setAvatarModalOpen(true);
                      }
                    }}
                    aria-label="تغيير صورة البروفايل"
                    title="اضغط لتغيير صورة البروفايل"
                    className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#003D60] to-[#20547A] text-white flex items-center justify-center shadow-md overflow-hidden ring-2 ring-[#CDE5FF] group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00696D]"
                  >
                    {effectiveAvatarUrl ? (
                      <img
                        src={effectiveAvatarUrl}
                        alt={`صورة بروفايل ${currentUser.name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-headline-sm text-[20px] font-extrabold text-[#FFDEA1] select-none">
                        {userInitials}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-[#001D32]/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-0.5">
                      <AppIcon name="photo_camera" size={16} />
                      <span className="text-[10px] font-bold">تغيير</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarError('');
                      setAvatarModalOpen(true);
                    }}
                    aria-label="تعديل صورة الملف الشخصي"
                    className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-[#00696D] hover:bg-[#004F52] text-white flex items-center justify-center ring-2 ring-white shadow-sm transition-colors cursor-pointer"
                  >
                    <AppIcon name="photo_camera" size={12} />
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-headline-md text-[22px] sm:text-[24px] font-extrabold text-[#003D60]">
                      أهلاً بك، {currentUser.name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F0F3FF] text-[#00696D] text-[11.5px] font-bold">
                      عضو موثق • {currentUser.city || 'سوريا'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#FFDEA1] text-[#261900] text-[11.5px] font-bold">
                      <AppIcon name="stars" size={13} />
                      <span>سفير العطاء الصحي — المستوى الذهبي</span>
                    </span>
                  </div>
                  <p className="text-[13.5px] text-[#41474E] max-w-2xl leading-relaxed">
                    بفضلك وصلت مساهماتك بنسبة <strong className="text-[#00696D]">100%</strong>{' '}
                    مباشرة إلى المشافي السورية المعتمدة دون أي استقطاع إداري، مما أسهم في إنقاذ
                    ودعم <strong className="text-[#003D60]">{completedLivesCount + 2} حالات</strong>{' '}
                    علاجية وجراحية موثقة.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadImpactStatement}
                  className="flex-1 sm:flex-none px-4 h-11 rounded-xl bg-[#F0F3FF] hover:bg-[#DEE8FF] text-[#003D60] font-bold text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <AppIcon name="download" size={17} />
                  <span>تحميل سجل الأثر السنوي</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenDonateModal(null)}
                  className="flex-1 sm:flex-none px-5 h-11 rounded-xl bg-[#003D60] hover:bg-[#20547A] text-white font-bold text-[13px] shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <AppIcon name="volunteer_activism" size={17} className="text-[#FFDEA1]" />
                  <span>تبرع سريع لحالة عاجلة</span>
                </button>
              </div>
            </div>
          </motion.section>

          {/* Section 2: 4 Core Indicator Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* KPI 1: Total Donated */}
            <motion.div
              initial={{opacity: 0, y: 14}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.05}}
              className="relative bg-white rounded-2xl p-5 shadow-sm border border-[#D8E3FB]/60 overflow-hidden"
            >
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#CDE5FF]/35 pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12.5px] font-bold text-[#41474E]">إجمالي تبرعاتك</span>
                <div className="w-10 h-10 rounded-xl bg-[#F0F3FF] text-[#003D60] flex items-center justify-center">
                  <AppIcon name="payments" size={19} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-numeral-lg text-[24px] font-extrabold text-[#003D60]">
                  {totalContributed.toLocaleString('en-US')}
                </span>
                <span className="text-[12.5px] font-bold text-[#41474E]">ل.س</span>
              </div>
              <p className="text-[11.5px] font-bold text-[#00696D] mt-2 flex items-center gap-1">
                <AppIcon name="arrow_circle_up" size={14} />
                <span>+{donationsHistory.length} مساهمات موثقة بسندات رسمية</span>
              </p>
            </motion.div>

            {/* KPI 2: Healed Cases */}
            <motion.div
              initial={{opacity: 0, y: 14}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.1}}
              className="relative bg-white rounded-2xl p-5 shadow-sm border border-[#D8E3FB]/60 overflow-hidden"
            >
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#94F2F7]/35 pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12.5px] font-bold text-[#41474E]">حالات تم شفاؤها بفضلك</span>
                <div className="w-10 h-10 rounded-xl bg-[#F0F3FF] text-[#00696D] flex items-center justify-center">
                  <AppIcon name="verified" size={19} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-numeral-lg text-[24px] font-extrabold text-[#00696D]">
                  {completedLivesCount}
                </span>
                <span className="text-[12.5px] font-bold text-[#41474E]">عمليات ناجحة مكتملة</span>
              </div>
              <p className="text-[11.5px] text-[#41474E] mt-2">
                شهادات شفاء وتقارير متابعة متاحة للمعاينة
              </p>
            </motion.div>

            {/* KPI 3: Cases Under Monitoring */}
            <motion.div
              initial={{opacity: 0, y: 14}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.15}}
              className="relative bg-white rounded-2xl p-5 shadow-sm border border-[#D8E3FB]/60 overflow-hidden"
            >
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#DEE8FF]/70 pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12.5px] font-bold text-[#41474E]">حالات قيد المتابعة</span>
                <div className="w-10 h-10 rounded-xl bg-[#F0F3FF] text-[#003D60] flex items-center justify-center">
                  <AppIcon name="medical_services" size={19} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-numeral-lg text-[24px] font-extrabold text-[#003D60]">2</span>
                <span className="text-[12.5px] font-bold text-[#41474E]">تحت الإشراف الطبي</span>
              </div>
              <p className="text-[11.5px] text-[#41474E] mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F2BF50] shrink-0" />
                <span>عمليات مجدولة وتقارير مخبرية محدثة</span>
              </p>
            </motion.div>

            {/* KPI 4: Impact Wallet */}
            <motion.div
              initial={{opacity: 0, y: 14}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.2}}
              className="relative bg-white rounded-2xl p-5 shadow-sm border border-[#D8E3FB]/60 overflow-hidden"
            >
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#FFDEA1]/40 pointer-events-none" />
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[12.5px] font-bold text-[#41474E]">رصيد محفظة الأثر</span>
                <button
                  type="button"
                  onClick={() => {
                    setTopUpDone(false);
                    setWalletModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#00696D] hover:bg-[#004F52] text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <AppIcon name="add_circle" size={13} />
                  <span>شحن المحفظة</span>
                </button>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-numeral-lg text-[24px] font-extrabold text-[#003D60]">
                  {walletBalance.toLocaleString('en-US')}
                </span>
                <span className="text-[12.5px] font-bold text-[#41474E]">ل.س</span>
              </div>
              <p className="text-[11.5px] text-[#00696D] font-semibold mt-2">
                جاهز للتوزيع السريع دون رسوم تحويل
              </p>
            </motion.div>
          </section>

          {/* Section 3: Supported Patients (8 cols) + Recurring & Chart (4 cols) */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Active Supported Patients Timeline */}
            <div id="portal-supported" className="xl:col-span-8 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-headline-sm text-[19px] font-extrabold text-[#003D60]">
                    الحالات التي ساهمت في علاجها
                  </h2>
                  <p className="text-[12.5px] text-[#41474E]">
                    متابعة لحظية لمراحل العلاج الجراحي وتقارير الشفاء من المشافي السورية
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DEE8FF] text-[#003D60] text-[11.5px] font-bold shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#00696D] animate-ping" />
                  <span>تحديث مباشر</span>
                </span>
              </div>

              {/* Patient 1: Rayan */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D8E3FB]/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <ResilientImage
                      src={rayanCase?.imageUrl || ''}
                      alt="الطفل ريان — جراحة الأذن والسمع"
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-[#D8E3FB]"
                      fallbackIcon="hearing"
                      fallbackTitle="الطفل ريان"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-title-md text-[16px] font-extrabold text-[#003D60]">
                          الطفل ريان — زراعة قوقعة أذن إلكترونية
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#94F2F7] text-[#002021] text-[11px] font-bold">
                          مكتمل التمويل
                        </span>
                      </div>
                      <p className="text-[12px] text-[#41474E] flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1">
                          <AppIcon name="local_hospital" size={14} className="text-[#00696D]" />
                          مشفى المواساة الجامعي - دمشق
                        </span>
                        <span className="text-[#C1C7CF]">•</span>
                        <span className="font-numeral-md font-bold text-[#003D60]">#ATH-4091</span>
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-[#F0F3FF] text-[#00696D] text-[11.5px] font-bold self-start sm:self-center shrink-0">
                    تم حجز غرفة العمليات
                  </span>
                </div>

                {/* Progress & 4-Step Milestone Track */}
                <div className="bg-[#F0F3FF] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-[12px] font-bold">
                    <span className="text-[#003D60]">تقدم المسار العلاجي والسريري</span>
                    <span className="font-numeral-md text-[#00696D]">75%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#D8E3FB] rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-[#00696D] rounded-full transition-all" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11.5px]">
                    {[
                      {step: 1, label: 'التدقيق الطبي', state: 'done'},
                      {step: 2, label: 'سداد المشفى', state: 'done'},
                      {step: 3, label: 'تجهيز الجراحة', state: 'active'},
                      {step: 4, label: 'تقرير الشفاء', state: 'pending'},
                    ].map((s) => (
                      <div key={s.step} className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-numeral-md text-[11px] font-bold shrink-0 ${
                            s.state === 'done'
                              ? 'bg-[#00696D] text-white'
                              : s.state === 'active'
                                ? 'bg-[#003D60] text-white ring-4 ring-[#CDE5FF]'
                                : 'bg-white text-[#72787F] border border-[#D8E3FB]'
                          }`}
                        >
                          {s.state === 'done' ? <AppIcon name="check" size={12} /> : s.step}
                        </span>
                        <span
                          className={
                            s.state === 'pending' ? 'text-[#72787F]' : 'text-[#003D60] font-bold'
                          }
                        >
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <p className="text-[12.5px] text-[#41474E]">
                    <strong className="text-[#003D60]">ملاحظة الطبيب المشرف:</strong> أُنهيت الفحوص
                    السمعية والتحاليل المخبرية بنجاح، وموعد الجراحة يوم الخميس القادم.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setProofModal({
                        title: 'فاتورة حجز غرفة العمليات والسند الرسمي',
                        caseCode: '#ATH-4091',
                        hospital: 'مشفى المواساة الجامعي - دمشق',
                        doctor: 'د. مازن الحلبي — استشاري جراحة الأذن الدقيقة',
                        date: '2026/11/18',
                        amount: 4500000,
                        receiptCode: 'ATH-REC-904821',
                        summary:
                          'تم تأكيد استلام الدفعة المالية كاملة من قبل الدائرة المالية في مشفى المواساة وتثبيت جهاز القوقعة المعتمد.',
                        milestones: [
                          'اعتماد اللجنة الطبية والبحث الاجتماعي',
                          'تحويل مبلغ التغطية لحساب مشفى المواساة الجامعي',
                          'جدولة غرفة العمليات وتثبيت الفريق الجراحي',
                        ],
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-[#E7EEFF] hover:bg-[#CDE5FF] text-[#003D60] font-bold text-[12.5px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <AppIcon name="description" size={16} />
                    <span>عرض الفاتورة والسند الرسمي</span>
                  </button>
                </div>
              </div>

              {/* Patient 2: Sara */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D8E3FB]/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <ResilientImage
                      src={saraCase?.imageUrl || ''}
                      alt="السيدة سارة — الرعاية الجراحية والتأهيلية"
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-[#D8E3FB]"
                      fallbackIcon="biotech"
                      fallbackTitle="السيدة سارة"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-title-md text-[16px] font-extrabold text-[#003D60]">
                          السيدة سارة — رعاية الأورام والجلسات التخصصية
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#CDE5FF] text-[#003D60] text-[11px] font-bold">
                          جلسات دورية نشطة
                        </span>
                      </div>
                      <p className="text-[12px] text-[#41474E] flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1">
                          <AppIcon name="local_hospital" size={14} className="text-[#00696D]" />
                          مشفى تشرين الجامعي - اللاذقية
                        </span>
                        <span className="text-[#C1C7CF]">•</span>
                        <span className="font-numeral-md font-bold text-[#003D60]">#ATH-5502</span>
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-[#F0F3FF] text-[#003D60] text-[11.5px] font-bold self-start sm:self-center shrink-0">
                    4 من 6 جلسات مكتملة
                  </span>
                </div>

                <div className="bg-[#F0F3FF] rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-[12px] font-bold">
                    <span className="text-[#003D60]">تقدم البروتوكول العلاجي</span>
                    <span className="font-numeral-md text-[#00696D]">66%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#D8E3FB] rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-[#00696D] rounded-full transition-all" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <p className="text-[12.5px] text-[#41474E]">
                    <strong className="text-[#003D60]">تحديث الجلسة الرابعة:</strong> استجابة سريرية
                    ممتازة وتراجع ملحوظ في الأعراض العصبية مع استقرار المؤشرات الحيوية.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setProofModal({
                        title: 'التقرير الطبي المرحلي — الجلسة الرابعة',
                        caseCode: '#ATH-5502',
                        hospital: 'مشفى تشرين الجامعي - اللاذقية',
                        doctor: 'د. ريم خوري — قسم جراحة الأعصاب والأورام',
                        date: '2026/11/09',
                        amount: 3200000,
                        receiptCode: 'ATH-REC-883104',
                        summary:
                          'أتمت المريضة الجلسة الرابعة من البروتوكول المعتمد بتغطية كاملة دون أي أعباء مالية إضافية.',
                        milestones: [
                          'إقرار الخطة العلاجية من مجلس الأورام',
                          'تغطية الجرعات الدوائية الأربعة الأولى',
                          'موعد التقييم الإشعاعي النهائي خلال 14 يوماً',
                        ],
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-[#E7EEFF] hover:bg-[#CDE5FF] text-[#003D60] font-bold text-[12.5px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <AppIcon name="fact_check" size={16} />
                    <span>عرض التقرير الطبي</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right-Side / Left-in-RTL Column: Recurring Giving & Impact Gauge */}
            <div id="portal-recurring" className="xl:col-span-4 space-y-5">
              {/* Recurring Giving Card */}
              <div
                className="rounded-2xl p-5 text-white shadow-md space-y-4 relative overflow-hidden"
                style={{background: 'linear-gradient(135deg, #003D60 0%, #20547A 100%)'}}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-extrabold ${
                      recurringActive
                        ? 'bg-[#FFDEA1] text-[#261900]'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {recurringActive ? 'صدقة جارية نشطة' : 'الكفالة متوقفة مؤقتاً'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setRecurringActive((prev) => !prev)}
                    aria-label={recurringActive ? 'إيقاف مؤقت' : 'تفعيل الكفالة'}
                    className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <AppIcon name={recurringActive ? 'pause' : 'play_arrow'} size={16} />
                  </button>
                </div>

                <div>
                  <h3 className="font-headline-sm text-[18px] font-extrabold">
                    الكفالة الدورية المستمرة
                  </h3>
                  <p className="text-[12px] text-[#CDE5FF]/90 mt-1">
                    مساهمة شهرية تلقائية لدعم جلسات غسيل الكلى ورعاية الأطفال في سوريا
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 space-y-2 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#CDE5FF]">القسط الشهري</span>
                    <span className="font-numeral-md text-[17px] font-extrabold text-[#FFDEA1]">
                      {recurringAmount.toLocaleString('en-US')} ل.س
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11.5px] text-[#CDE5FF]/90">
                    <span className="inline-flex items-center gap-1">
                      <AppIcon name="calendar_month" size={13} />
                      <span>الاستقطاع القادم</span>
                    </span>
                    <span className="font-semibold text-white">1 كانون الأول 2026</span>
                  </div>
                </div>

                {editingRecurring ? (
                  <form onSubmit={handleSaveRecurring} className="space-y-2.5">
                    <div className="grid grid-cols-3 gap-1.5">
                      {[100000, 250000, 500000].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setRecurringDraft(String(val))}
                          className={`py-1.5 rounded-lg font-numeral-md text-[11.5px] font-bold cursor-pointer ${
                            Number(recurringDraft) === val
                              ? 'bg-[#FFDEA1] text-[#261900]'
                              : 'bg-white/15 text-white hover:bg-white/25'
                          }`}
                        >
                          {(val / 1000).toLocaleString('en-US')} ألف
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={25000}
                        step={25000}
                        value={recurringDraft}
                        onChange={(e) => setRecurringDraft(e.target.value)}
                        className="flex-1 bg-white/15 border border-white/25 rounded-xl px-3 py-1.5 text-[13px] font-numeral-md text-white focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3.5 rounded-xl bg-[#94F2F7] text-[#002021] text-[12px] font-bold cursor-pointer"
                      >
                        حفظ
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setRecurringDraft(String(recurringAmount));
                      setEditingRecurring(true);
                    }}
                    className="w-full h-10 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-[12.5px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <AppIcon name="edit" size={14} />
                    <span>تعديل مبلغ الكفالة الدورية</span>
                  </button>
                )}
              </div>

              {/* Impact Gauge SVG Donut Card */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D8E3FB]/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-title-md text-[15.5px] font-extrabold text-[#003D60]">
                    توزيع أثر تبرعاتك
                  </h3>
                  <span className="text-[11px] font-bold text-[#00696D] bg-[#F0F3FF] px-2.5 py-0.5 rounded-full">
                    محدّث تلقائياً
                  </span>
                </div>

                <div className="flex items-center justify-center py-1">
                  <div className="relative w-40 h-40">
                    <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        fill="transparent"
                        stroke="#F0F3FF"
                        strokeWidth="18"
                      />
                      {/* 52% Urgent Surgeries */}
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        fill="transparent"
                        stroke="#003D60"
                        strokeWidth="18"
                        strokeDasharray="196 377"
                        strokeDashoffset="0"
                        strokeLinecap="round"
                      />
                      {/* 30% Chronic / Dialysis */}
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        fill="transparent"
                        stroke="#00696D"
                        strokeWidth="18"
                        strokeDasharray="113 377"
                        strokeDashoffset="-196"
                        strokeLinecap="round"
                      />
                      {/* 18% Medical Supplies */}
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        fill="transparent"
                        stroke="#F2BF50"
                        strokeWidth="18"
                        strokeDasharray="68 377"
                        strokeDashoffset="-309"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-numeral-lg text-[20px] font-extrabold text-[#003D60]">
                        100%
                      </span>
                      <span className="text-[10.5px] font-bold text-[#00696D]">أثر مباشر</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-[12px]">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-[#41474E]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#003D60]" />
                      <span>جراحات عاجلة ومنقذة للحياة</span>
                    </span>
                    <span className="font-numeral-md font-bold text-[#003D60]">52%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-[#41474E]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00696D]" />
                      <span>رعاية مزمنة وغسيل كلى</span>
                    </span>
                    <span className="font-numeral-md font-bold text-[#00696D]">30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-[#41474E]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F2BF50]" />
                      <span>أدوية ومستلزمات جراحية</span>
                    </span>
                    <span className="font-numeral-md font-bold text-[#5C4300]">18%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Curated Cases Matching Donor Preferences */}
          <section id="portal-curated" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-headline-sm text-[19px] font-extrabold text-[#003D60]">
                  فرص تبرع مقترحة حسب اهتمامك
                </h2>
                <p className="text-[12.5px] text-[#41474E]">
                  حالات عاجلة موثقة في المشافي السورية تتوافق مع مجالات دعمك السابقة
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    {key: 'all', label: 'الكل'},
                    {key: 'urgent', label: 'جراحات عاجلة'},
                    {key: 'pediatrics', label: 'رعاية أطفال'},
                    {key: 'chronic', label: 'غسيل كلى وأورام'},
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setOpportunityFilter(tab.key)}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-colors cursor-pointer ${
                      opportunityFilter === tab.key
                        ? 'bg-[#003D60] text-white'
                        : 'bg-white text-[#41474E] hover:bg-[#F0F3FF] border border-[#D8E3FB]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {curatedOpportunities.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#D8E3FB]/60 space-y-2">
                <p className="font-bold text-[#003D60]">لا توجد حالات مطابقة لبحثك الحالي</p>
                <button
                  type="button"
                  onClick={() => {
                    setOpportunityFilter('all');
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#F0F3FF] text-[#003D60] text-[12.5px] font-bold cursor-pointer"
                >
                  عرض جميع الفرص المقترحة
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {curatedOpportunities.map((item) => {
                  const pct = Math.min(100, Math.round((item.raised / item.target) * 100));
                  const remaining = Math.max(0, item.target - item.raised);
                  const quickPresets = [50000, 100000, 250000, 500000];
                  const selectedAmt = cardAmounts[item.id] ?? 100000;
                  const flags = cardFlags[item.id] ?? {};

                  return (
                    <article
                      key={item.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-[#D8E3FB]/60 flex flex-col"
                    >
                      <div className="relative h-44 w-full overflow-hidden">
                        <ResilientImage
                          src={item.imageUrl}
                          alt={item.imageAlt}
                          className="w-full h-full object-cover"
                          fallbackIcon={item.specialtyIcon}
                          fallbackTitle={item.specialtyLabel}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#001D32]/70 via-transparent to-transparent" />
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#00696D] text-white text-[11px] font-bold">
                          {item.specialtyLabel}
                        </span>
                        <span
                          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            item.priority === 'critical'
                              ? 'bg-[#BA1A1A] text-white animate-pulse'
                              : 'bg-[#FFDEA1] text-[#261900]'
                          }`}
                        >
                          {item.urgencyLabel}
                        </span>
                        <div className="absolute bottom-2.5 right-3 left-3 flex items-center justify-between text-white text-[11.5px]">
                          <span className="truncate font-semibold">{item.hospital}</span>
                          <span className="font-numeral-md font-bold shrink-0">{item.code}</span>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                        <div className="space-y-1.5">
                          <h3 className="font-title-md text-[15px] font-extrabold text-[#003D60] line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-[12px] text-[#41474E] line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="space-y-2.5 bg-[#F0F3FF] rounded-xl p-3">
                          <div className="flex justify-between text-[11.5px] font-bold">
                            <span className="text-[#00696D]">
                              متبقي: {remaining.toLocaleString('en-US')} ل.س
                            </span>
                            <span className="font-numeral-md text-[#003D60]">{pct}%</span>
                          </div>
                          <div className="w-full h-2 bg-[#D8E3FB] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#00696D] rounded-full transition-all duration-500"
                              style={{width: `${pct}%`}}
                            />
                          </div>

                          {/* 4 Preset Pills */}
                          <div className="grid grid-cols-4 gap-1.5 pt-1">
                            {quickPresets.map((preset) => {
                              const active = selectedAmt === preset;
                              return (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() =>
                                    setCardAmounts((prev) => ({...prev, [item.id]: preset}))
                                  }
                                  className={`py-1.5 rounded-lg font-numeral-md text-[11px] font-bold transition-colors cursor-pointer ${
                                    active
                                      ? 'bg-[#00696D] text-white'
                                      : 'bg-white text-[#003D60] hover:bg-[#CDE5FF]/50'
                                  }`}
                                >
                                  {(preset / 1000).toLocaleString('en-US')} ألف
                                </button>
                              );
                            })}
                          </div>

                          {/* Sadaqah & Zakat Checkboxes */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11.5px] text-[#41474E]">
                            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={Boolean(flags.isSadaqah)}
                                onChange={(e) =>
                                  setCardFlags((prev) => ({
                                    ...prev,
                                    [item.id]: {...prev[item.id], isSadaqah: e.target.checked},
                                  }))
                                }
                                className="w-3.5 h-3.5 accent-[#00696D]"
                              />
                              <span>صدقة جارية / عن الغير</span>
                            </label>
                            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={Boolean(flags.isZakat)}
                                onChange={(e) =>
                                  setCardFlags((prev) => ({
                                    ...prev,
                                    [item.id]: {...prev[item.id], isZakat: e.target.checked},
                                  }))
                                }
                                className="w-3.5 h-3.5 accent-[#003D60]"
                              />
                              <span>احتساب من الزكاة</span>
                            </label>
                          </div>

                          <button
                            type="button"
                            onClick={() => onOpenDonateModal(item, selectedAmt, flags)}
                            className="w-full h-11 rounded-xl bg-[#FFDEA1] hover:bg-[#F2BF50] text-[#261900] font-bold text-[13.5px] flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                          >
                            <AppIcon name="favorite" size={16} />
                            <span>تبرع الآن للحالة</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Section 5: Interactive Donation History & Receipts Data Table */}
          <section
            id="portal-history"
            className="bg-white rounded-2xl p-6 shadow-sm border border-[#D8E3FB]/60 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-headline-sm text-[19px] font-extrabold text-[#003D60]">
                  سجل التبرعات والسندات الرسمية
                </h2>
                <p className="text-[12.5px] text-[#41474E]">
                  توثيق كامل لكل مساهمة بالليرة السورية مع قابلية تحميل السند المالي
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    {key: 'all', label: 'جميع العمليات'},
                    {key: 'transferred', label: 'تحويل مباشر'},
                    {key: 'zakat_sadaqah', label: 'زكاة / صدقة جارية'},
                  ] as const
                ).map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setHistoryFilter(f.key)}
                    className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-colors cursor-pointer ${
                      historyFilter === f.key
                        ? 'bg-[#003D60] text-white'
                        : 'bg-[#F0F3FF] text-[#41474E] hover:bg-[#DEE8FF]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleDownloadImpactStatement}
                  className="px-3.5 py-1.5 rounded-xl bg-[#E7EEFF] hover:bg-[#CDE5FF] text-[#003D60] text-[12px] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <AppIcon name="download" size={15} />
                  <span>تصدير كشف التبرعات</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse min-w-[720px]">
                <thead>
                  <tr className="bg-[#F0F3FF] text-[#003D60] text-[12px] font-bold">
                    <th className="py-3 px-3.5 rounded-r-xl">رقم السند</th>
                    <th className="py-3 px-3.5">الحالة الطبية والمستشفى</th>
                    <th className="py-3 px-3.5">التاريخ</th>
                    <th className="py-3 px-3.5">وسيلة الدفع</th>
                    <th className="py-3 px-3.5">المبلغ</th>
                    <th className="py-3 px-3.5">الحالة</th>
                    <th className="py-3 px-3.5 rounded-l-xl text-center">السند الرسمي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F3FF] text-[13px]">
                  {filteredHistory.map((row) => (
                    <tr key={row.id} className="hover:bg-[#F9F9FF] transition-colors">
                      <td className="py-3.5 px-3.5 font-numeral-md font-bold text-[#003D60] whitespace-nowrap">
                        {row.receiptCode}
                      </td>
                      <td className="py-3.5 px-3.5">
                        <div className="font-bold text-[#111C2D]">
                          {row.caseCode} — {row.caseTitle}
                        </div>
                        <div className="text-[11.5px] text-[#41474E] flex items-center gap-2 mt-0.5">
                          <span>{row.hospital}</span>
                          {row.isZakat && (
                            <span className="px-2 py-0.2 rounded bg-[#FFDEA1] text-[#261900] text-[10.5px] font-bold">
                              زكاة
                            </span>
                          )}
                          {row.isSadaqah && (
                            <span className="px-2 py-0.2 rounded bg-[#94F2F7] text-[#002021] text-[10.5px] font-bold">
                              صدقة جارية
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-3.5 font-numeral-md text-[#41474E] whitespace-nowrap">
                        {row.date}
                      </td>
                      <td className="py-3.5 px-3.5 font-semibold text-[#003D60] whitespace-nowrap">
                        {row.paymentMethod}
                      </td>
                      <td className="py-3.5 px-3.5 font-numeral-md font-extrabold text-[#003D60] whitespace-nowrap">
                        {row.amount.toLocaleString('en-US')} ل.س
                      </td>
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            row.status === 'مكتمل الأثر'
                              ? 'bg-[#94F2F7] text-[#002021]'
                              : 'bg-[#DEE8FF] text-[#003D60]'
                          }`}
                        >
                          <AppIcon name="check_circle" size={12} />
                          <span>{row.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDownloadSingleReceipt(row)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F0F3FF] hover:bg-[#CDE5FF] text-[#003D60] text-[12px] font-bold transition-colors cursor-pointer"
                        >
                          <AppIcon name="download" size={14} />
                          <span>تحميل السند</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Wallet Top-up Modal */}
      {walletModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#111C2D]/50 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setWalletModalOpen(false)}
              aria-label="إغلاق"
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#F0F3FF] hover:bg-[#DEE8FF] flex items-center justify-center text-[#41474E] cursor-pointer"
            >
              <AppIcon name="close" size={17} />
            </button>

            {topUpDone ? (
              <div className="text-center py-3 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#94F2F7] text-[#002021] flex items-center justify-center mx-auto">
                  <AppIcon name="verified" size={28} />
                </div>
                <h3 className="font-headline-sm text-[19px] font-extrabold text-[#003D60]">
                  تم شحن محفظة الأثر بنجاح
                </h3>
                <p className="text-[13px] text-[#41474E]">
                  أُضيف مبلغ{' '}
                  <strong className="font-numeral-md text-[#003D60]">
                    {topUpAmount.toLocaleString('en-US')} ل.س
                  </strong>{' '}
                  إلى محفظتك عبر {topUpMethod} لتسهيل التبرع الفوري لاحقاً.
                </p>
                <button
                  type="button"
                  onClick={() => setWalletModalOpen(false)}
                  className="w-full h-11 rounded-xl bg-[#003D60] text-white font-bold text-[14px] cursor-pointer"
                >
                  متابعة في بوابة المتبرع
                </button>
              </div>
            ) : (
              <form onSubmit={handleWalletSubmit} className="space-y-4">
                <div>
                  <span className="text-[11.5px] font-bold text-[#00696D]">
                    رصيد مخصص للطوارئ والحالات العاجلة — 0% عمولة
                  </span>
                  <h3 className="font-headline-sm text-[19px] font-extrabold text-[#003D60] mt-1">
                    شحن محفظة الأثر
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[100000, 250000, 500000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTopUpAmount(val)}
                      className={`py-2.5 rounded-xl font-numeral-md text-[12.5px] font-bold transition-colors cursor-pointer ${
                        topUpAmount === val
                          ? 'bg-[#00696D] text-white'
                          : 'bg-[#F0F3FF] text-[#003D60] hover:bg-[#CDE5FF]/60'
                      }`}
                    >
                      {val.toLocaleString('en-US')} ل.س
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-[#41474E] block">
                    وسيلة الشحن المعتمدة في سوريا
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['شام كاش', 'سيريتل كاش', 'MTN كاش', 'حوالة بنكية'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTopUpMethod(m)}
                        className={`py-2 rounded-xl text-[12px] font-bold transition-colors cursor-pointer ${
                          topUpMethod === m
                            ? 'bg-[#003D60] text-white'
                            : 'bg-[#F0F3FF] text-[#41474E] hover:bg-[#DEE8FF]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-[#00696D] hover:bg-[#004F52] text-white font-bold text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <AppIcon name="wallet" size={17} />
                  <span>تأكيد شحن {topUpAmount.toLocaleString('en-US')} ل.س</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Profile Picture Editor Modal */}
      {avatarModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#111C2D]/50 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative space-y-4 text-center">
            <button
              type="button"
              onClick={() => setAvatarModalOpen(false)}
              aria-label="إغلاق"
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#F0F3FF] hover:bg-[#DEE8FF] flex items-center justify-center text-[#41474E] cursor-pointer"
            >
              <AppIcon name="close" size={17} />
            </button>

            <div>
              <h3 className="font-headline-sm text-[18px] font-extrabold text-[#003D60]">
                صورة البروفايل الشخصي
              </h3>
              <p className="text-[12.5px] text-[#41474E] mt-1">
                اختر صورة شخصية من جهازك لعرضها في لوحة المتبرع
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#003D60] to-[#20547A] text-white flex items-center justify-center overflow-hidden ring-4 ring-[#F0F3FF] shadow-md">
                {effectiveAvatarUrl ? (
                  <img
                    src={effectiveAvatarUrl}
                    alt={`صورة بروفايل ${currentUser.name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-headline-md text-[28px] font-extrabold text-[#FFDEA1] select-none">
                    {userInitials}
                  </span>
                )}
              </div>
            </div>

            {avatarError && (
              <p className="text-[12px] font-bold text-[#BA1A1A] bg-[#FFDAD6]/60 rounded-xl px-3 py-2">
                {avatarError}
              </p>
            )}

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="w-full h-11 rounded-xl bg-[#003D60] hover:bg-[#20547A] text-white font-bold text-[13.5px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <AppIcon name="upload_file" size={17} />
                <span>{effectiveAvatarUrl ? 'تغيير الصورة من الجهاز' : 'اختيار صورة من الجهاز'}</span>
              </button>

              {effectiveAvatarUrl && (
                <button
                  type="button"
                  onClick={() => {
                    saveAvatar('');
                    setAvatarModalOpen(false);
                  }}
                  className="w-full h-10 rounded-xl bg-[#F0F3FF] hover:bg-[#FFDAD6] text-[#BA1A1A] font-bold text-[13px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <AppIcon name="delete" size={15} />
                  <span>إزالة الصورة والعودة للأحرف الأولى</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Proof / Clinical Invoice Modal */}
      {proofModal && (
        <div
          className="fixed inset-0 z-50 bg-[#111C2D]/50 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setProofModal(null)}
              aria-label="إغلاق"
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#F0F3FF] hover:bg-[#DEE8FF] flex items-center justify-center text-[#41474E] cursor-pointer"
            >
              <AppIcon name="close" size={17} />
            </button>

            <div className="flex items-center gap-3 pl-8">
              <div className="w-11 h-11 rounded-xl bg-[#94F2F7] text-[#002021] flex items-center justify-center shrink-0">
                <AppIcon name="verified_user" size={22} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#00696D]">
                  وثيقة سريرية ومالية معتمدة • {proofModal.caseCode}
                </span>
                <h3 className="font-headline-sm text-[17px] font-extrabold text-[#003D60]">
                  {proofModal.title}
                </h3>
              </div>
            </div>

            <div className="bg-[#F0F3FF] rounded-xl p-4 space-y-2 text-[12.5px]">
              <div className="flex justify-between">
                <span className="text-[#41474E]">الجهة الطبية:</span>
                <span className="font-bold text-[#003D60]">{proofModal.hospital}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#41474E]">الطبيب المشرف:</span>
                <span className="font-semibold text-[#111C2D]">{proofModal.doctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#41474E]">رقم السند المالي:</span>
                <span className="font-numeral-md font-bold text-[#003D60]">
                  {proofModal.receiptCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#41474E]">المبلغ الموثق:</span>
                <span className="font-numeral-md font-bold text-[#00696D]">
                  {proofModal.amount.toLocaleString('en-US')} ل.س
                </span>
              </div>
            </div>

            <p className="text-[13px] text-[#41474E] leading-relaxed">{proofModal.summary}</p>

            <div className="space-y-2">
              <p className="text-[12px] font-bold text-[#003D60]">محطات التوثيق المنجزة:</p>
              {proofModal.milestones.map((m) => (
                <div key={m} className="flex items-center gap-2 text-[12.5px] text-[#111C2D]">
                  <AppIcon name="check_circle" size={15} className="text-[#00696D]" />
                  <span>{m}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setProofModal(null)}
              className="w-full h-11 rounded-xl bg-[#003D60] hover:bg-[#20547A] text-white font-bold text-[14px] cursor-pointer"
            >
              إغلاق المعاينة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
