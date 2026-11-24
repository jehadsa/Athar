import {AnimatePresence, motion} from 'motion/react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {AppIcon} from './components/AppIcon';
import {
  ApplyCaseModal,
  DonationFlags,
  DonationModal,
  UtilityModal,
} from './components/AtharModals';
import {
  DonorPortalPage,
  DonorReceipt,
  INITIAL_DONOR_RECEIPTS,
} from './components/DonorPortalPage';
import {Footer} from './components/Footer';
import {GovernanceSection} from './components/GovernanceSection';
import {Header} from './components/Header';
import {HeroSection} from './components/HeroSection';
import {HowItWorksSection} from './components/HowItWorksSection';
import {ImpactStats} from './components/ImpactStats';
import {AuthenticatedUser, AuthRole, LoginPage} from './components/LoginPage';
import {MedicalCasesSection} from './components/MedicalCasesSection';
import {PartnersSection} from './components/PartnersSection';
import {StickyDonationBar} from './components/StickyDonationBar';
import {
  ATHAR_LOGO_URL,
  INITIAL_MEDICAL_CASES,
  MedicalCase,
  PortalRole,
  PriorityKey,
  RegionKey,
  SpecialtyKey,
} from './data/atharData';

const PORTAL_PREVIEW_DETAILS: Record<
  Exclude<AuthenticatedUser['role'], 'donor'>,
  {title: string; subtitle: string; icon: string; badge: string}
> = {
  patient: {
    title: 'بوابة المستفيدين والمريض',
    subtitle: 'متابعة حالة الطلبات العلاجية، التقارير الطبية المرفوعة، ومواعيد اللجان.',
    icon: 'medical_services',
    badge: 'بوابة المريض',
  },
  hospital: {
    title: 'بوابة المستشفيات والكوادر الطبية',
    subtitle: 'إصدار القسائم الجراحية المعتمدة ومتابعة التحويلات البنكية المباشرة.',
    icon: 'local_hospital',
    badge: 'بوابة المنشآت',
  },
  charity: {
    title: 'بوابة الجمعيات الخيرية الشريكة',
    subtitle: 'تدقيق البحث الاجتماعي الميداني وتحديد أولويات التدخل العلاجي العاجل.',
    icon: 'handshake',
    badge: 'بوابة الجمعيات',
  },
  admin: {
    title: 'لوحة الإشراف والحوكمة المركزية',
    subtitle: 'مراقبة التحويلات المغلقة والامتثال الطبي والشرعي لحظياً.',
    icon: 'verified_user',
    badge: 'الرقابة والحوكمة',
  },
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<
    'login' | 'donor' | 'donor-portal' | 'portal-preview'
  >('donor');
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [loginLockedRole, setLoginLockedRole] = useState<AuthRole | null>(null);
  const [pendingTargetSection, setPendingTargetSection] = useState<string | null>(null);
  const [pendingDonation, setPendingDonation] = useState<{
    medicalCase: MedicalCase;
    amount?: number;
  } | null>(null);
  const [pendingApplyCase, setPendingApplyCase] = useState<boolean>(false);

  const [cases, setCases] = useState<MedicalCase[]>(INITIAL_MEDICAL_CASES);
  const [donationsHistory, setDonationsHistory] = useState<DonorReceipt[]>(INITIAL_DONOR_RECEIPTS);
  const [walletBalance, setWalletBalance] = useState<number>(850000);
  const [totalDonations, setTotalDonations] = useState<number>(4825900000);
  const [completedSurgeries, setCompletedSurgeries] = useState<number>(1842);

  const [activePortal, setActivePortal] = useState<PortalRole>('donor-portal');
  const [activeNav, setActiveNav] = useState<string>('home');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [specialtyFilter, setSpecialtyFilter] = useState<SpecialtyKey>('');
  const [regionFilter, setRegionFilter] = useState<RegionKey>('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityKey>('');
  const [showAllCases, setShowAllCases] = useState<boolean>(false);

  const [donateModalOpen, setDonateModalOpen] = useState<boolean>(false);
  const [selectedDonateCase, setSelectedDonateCase] = useState<MedicalCase | null>(null);
  const [selectedDonateAmount, setSelectedDonateAmount] = useState<number | undefined>(undefined);
  const [selectedDonateFlags, setSelectedDonateFlags] = useState<DonationFlags | undefined>(
    undefined,
  );
  const [applyModalOpen, setApplyModalOpen] = useState<boolean>(false);
  const [utilityModal, setUtilityModal] = useState<
    'login' | 'report' | 'privacy' | 'support' | 'portal' | null
  >(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  const isOverlayOpen =
    currentPage === 'login' || donateModalOpen || applyModalOpen || utilityModal !== null;

  useEffect(() => {
    if (!isOverlayOpen) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isOverlayOpen]);

  const softScrollFnRef = useRef<((y: number) => void) | null>(null);

  const smoothScrollToY = useCallback((y: number) => {
    if (softScrollFnRef.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      softScrollFnRef.current(y);
    } else {
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  }, []);

  const smoothScrollToElement = useCallback(
    (elementId: string) => {
      const el = document.getElementById(elementId);
      if (!el) return;
      const headerOffset = 84;
      const targetTop = Math.max(
        0,
        el.getBoundingClientRect().top + window.scrollY - headerOffset,
      );
      smoothScrollToY(targetTop);
    },
    [smoothScrollToY],
  );

  // Ultra-soft frame-rate-independent inertial scrolling for mouse wheel & navigation on main page
  useEffect(() => {
    if (currentPage !== 'donor' || isOverlayOpen) {
      softScrollFnRef.current = null;
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      softScrollFnRef.current = null;
      return;
    }

    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let lastAppliedY = window.scrollY;
    let lastTime = performance.now();
    let rafId: number | null = null;

    const getMaxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const isNestedScrollable = (target: EventTarget | null): boolean => {
      let el = target instanceof HTMLElement ? target : null;
      while (el && el !== document.documentElement && el !== document.body) {
        if (el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') return true;
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        if (
          (overflowY === 'auto' || overflowY === 'scroll') &&
          el.scrollHeight > el.clientHeight
        ) {
          return true;
        }
        el = el.parentElement;
      }
      return false;
    };

    const step = (now: number) => {
      // Yield immediately if user dragged scrollbar or another scroll moved the page externally
      if (Math.abs(window.scrollY - lastAppliedY) > 16) {
        rafId = null;
        return;
      }

      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const diff = targetY - currentY;
      if (Math.abs(diff) < 0.35) {
        currentY = targetY;
        window.scrollTo({top: targetY, behavior: 'instant' as ScrollBehavior});
        lastAppliedY = window.scrollY;
        rafId = null;
        return;
      }

      // Soft exponential damping (~5.6/sec gives a cushioned, buttery Lenis-style glide)
      const easeFactor = 1 - Math.exp(-5.6 * dt);
      currentY += diff * easeFactor;
      window.scrollTo({top: currentY, behavior: 'instant' as ScrollBehavior});
      lastAppliedY = window.scrollY;
      rafId = requestAnimationFrame(step);
    };

    const startLoopIfNeeded = () => {
      if (rafId === null) {
        currentY = window.scrollY;
        lastAppliedY = window.scrollY;
        lastTime = performance.now();
        rafId = requestAnimationFrame(step);
      }
    };

    softScrollFnRef.current = (y: number) => {
      const clamped = Math.min(getMaxScroll(), Math.max(0, y));
      if (rafId === null) {
        targetY = clamped;
        startLoopIfNeeded();
      } else {
        targetY = clamped;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (isNestedScrollable(e.target)) return;

      e.preventDefault();

      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 18;
      else if (e.deltaMode === 2) delta *= window.innerHeight;

      // Slightly soften high-impulse mouse wheel steps
      delta *= 0.92;

      if (rafId === null) {
        currentY = window.scrollY;
        targetY = window.scrollY;
        lastAppliedY = window.scrollY;
      }

      targetY = Math.min(getMaxScroll(), Math.max(0, targetY + delta));
      startLoopIfNeeded();
    };

    window.addEventListener('wheel', onWheel, {passive: false});
    return () => {
      softScrollFnRef.current = null;
      window.removeEventListener('wheel', onWheel);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [currentPage, isOverlayOpen]);

  // Track active section and scroll-to-top visibility while scrolling
  useEffect(() => {
    if (currentPage !== 'donor') return;

    const sections: Array<{id: string; nav: string}> = [
      {id: 'hero-section', nav: 'home'},
      {id: 'cases-section', nav: 'medical-cases'},
      {id: 'how-it-works-section', nav: 'how-it-works'},
      {id: 'partners-section', nav: 'medical-partners'},
      {id: 'governance-section', nav: 'transparency-reports'},
      {id: 'footer-section', nav: 'about-athar'},
    ];

    let ticking = false;
    const updateOnScroll = () => {
      ticking = false;
      const y = window.scrollY;
      setShowScrollTop(y > 460);

      const triggerLine = y + 180;
      let matched = 'home';
      for (const item of sections) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= triggerLine) {
          matched = item.nav;
        }
      }
      setActiveNav((prev) => (prev === matched ? prev : matched));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateOnScroll);
      }
    };

    window.addEventListener('scroll', onScroll, {passive: true});
    updateOnScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [currentPage]);

  const hasActiveFilter = Boolean(
    searchQuery.trim() || specialtyFilter || regionFilter || priorityFilter,
  );

  const filteredCases = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return cases.filter((item) => {
      if (!hasActiveFilter && !showAllCases && !item.featured) {
        return false;
      }
      if (specialtyFilter && item.specialty !== specialtyFilter) {
        return false;
      }
      if (regionFilter && item.region !== regionFilter) {
        return false;
      }
      if (priorityFilter && item.priority !== priorityFilter) {
        return false;
      }
      if (query) {
        const haystack =
          `${item.title} ${item.description} ${item.hospital} ${item.specialtyLabel} ${item.code}`.toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [cases, hasActiveFilter, showAllCases, specialtyFilter, regionFilter, priorityFilter, searchQuery]);

  const handleLoginSuccess = (user: AuthenticatedUser) => {
    setCurrentUser(user);
    setUtilityModal(null);
    setLoginLockedRole(null);
    if (user.role === 'donor') {
      setActivePortal('donor-portal');
      setPendingApplyCase(false);
      if (pendingDonation) {
        const nextDonation = pendingDonation;
        setPendingDonation(null);
        setPendingTargetSection(null);
        setCurrentPage('donor-portal');
        setSelectedDonateCase(nextDonation.medicalCase);
        setSelectedDonateAmount(nextDonation.amount);
        setSelectedDonateFlags(undefined);
        setDonateModalOpen(true);
        window.scrollTo({top: 0, behavior: 'smooth'});
      } else if (pendingTargetSection === 'donor-portal') {
        setPendingTargetSection(null);
        setCurrentPage('donor-portal');
        window.scrollTo({top: 0, behavior: 'smooth'});
      } else if (pendingTargetSection === 'cases-section') {
        setActiveNav('medical-cases');
        setCurrentPage('donor');
        setPendingTargetSection(null);
        setTimeout(() => {
          const el = document.getElementById('cases-section');
          if (el) {
            el.scrollIntoView({behavior: 'smooth', block: 'start'});
          }
        }, 80);
      } else {
        setPendingTargetSection(null);
        setCurrentPage('donor-portal');
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    } else if (user.role === 'patient' && pendingApplyCase) {
      setPendingApplyCase(false);
      setPendingTargetSection(null);
      setPendingDonation(null);
      setCurrentPage('donor');
      setApplyModalOpen(true);
    } else {
      setPendingApplyCase(false);
      setPendingTargetSection(null);
      setPendingDonation(null);
      setCurrentPage('portal-preview');
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  const handleBrowseAsGuest = () => {
    setUtilityModal(null);
    setLoginLockedRole(null);
    setPendingTargetSection(null);
    setPendingDonation(null);
    setPendingApplyCase(false);
    setActivePortal('donor-portal');
    setCurrentPage('donor');
  };

  const handleLogout = () => {
    setUtilityModal(null);
    setDonateModalOpen(false);
    setApplyModalOpen(false);
    setCurrentUser(null);
    setLoginLockedRole(null);
    setPendingTargetSection(null);
    setPendingDonation(null);
    setPendingApplyCase(false);
    setCurrentPage('login');
  };

  const handleNavigateSection = (sectionId: string, navKey: string) => {
    setActiveNav(navKey);
    smoothScrollToElement(sectionId);
  };

  const handleSelectPortal = (portal: PortalRole) => {
    setActivePortal(portal);
    if (portal === 'donor-portal') {
      if (currentUser?.role === 'donor') {
        setCurrentPage('donor-portal');
        window.scrollTo({top: 0, behavior: 'smooth'});
      } else {
        setPendingApplyCase(false);
        setPendingDonation(null);
        setLoginLockedRole('donor');
        setPendingTargetSection('donor-portal');
        setCurrentPage('login');
      }
      return;
    }
    if (portal !== 'home') {
      setUtilityModal('portal');
    }
  };

  const handleApplyTriageFilter = () => {
    setShowAllCases(true);
    smoothScrollToElement('cases-section');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSpecialtyFilter('');
    setRegionFilter('');
    setPriorityFilter('');
  };

  const handleFilterByPartnerRegion = (region: RegionKey) => {
    setRegionFilter(region);
    setShowAllCases(true);
    smoothScrollToElement('cases-section');
  };

  const handleOpenDonateForCase = (
    medicalCase: MedicalCase | null,
    amount?: number,
    flags?: DonationFlags,
  ) => {
    setSelectedDonateCase(medicalCase);
    setSelectedDonateAmount(amount);
    setSelectedDonateFlags(flags);
    setDonateModalOpen(true);
  };

  const handleCompleteDonation = (
    caseId: string,
    amount: number,
    method: string,
    flags?: DonationFlags,
  ) => {
    setTotalDonations((prev) => prev + amount);
    if (method === 'محفظة الأثر') {
      setWalletBalance((prev) => Math.max(0, prev - amount));
    }

    const matchedCase = cases.find((c) => c.id === caseId);
    if (matchedCase) {
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '/');
      const randomNum = Math.floor(100000 + Math.random() * 899999);
      const nextRaised = Math.min(matchedCase.target, matchedCase.raised + amount);
      const newReceipt: DonorReceipt = {
        id: `rec-${Date.now()}`,
        receiptCode: `ATH-REC-${randomNum}`,
        caseCode: matchedCase.code,
        caseTitle: matchedCase.title,
        hospital: matchedCase.hospital,
        specialty: matchedCase.specialtyLabel,
        amount,
        paymentMethod: method,
        date: today,
        status: nextRaised >= matchedCase.target ? 'مكتمل الأثر' : 'تم التحويل للمستشفى',
        isSadaqah: flags?.isSadaqah,
        isZakat: flags?.isZakat,
      };
      setDonationsHistory((prev) => [newReceipt, ...prev]);
    }

    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c;
        const wasIncomplete = c.raised < c.target;
        const nextRaised = Math.min(c.target, c.raised + amount);
        if (wasIncomplete && nextRaised >= c.target) {
          setCompletedSurgeries((s) => s + 1);
        }
        return {...c, raised: nextRaised};
      }),
    );
  };

  const urgentCount = useMemo(
    () => 11 + cases.filter((c) => c.raised < c.target && c.priority === 'critical').length,
    [cases],
  );

  if (currentPage === 'portal-preview' && currentUser && currentUser.role !== 'donor') {
    const portalMeta = PORTAL_PREVIEW_DETAILS[currentUser.role];
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-gradient-to-b from-surface to-surface-container-low flex items-center justify-center p-4 sm:p-8"
      >
        <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-xl p-8 space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-surface-container pb-5">
            <div className="flex items-center gap-3">
              <img
                src={ATHAR_LOGO_URL}
                alt="شعار أثر"
                className="h-11 w-auto object-contain shrink-0"
              />
              <div>
                <h2 className="font-headline-sm text-headline-sm text-primary leading-none">
                  أثر
                </h2>
                <p className="font-label-sm text-label-sm text-secondary mt-1">
                  للعطاء الصحي الموثق
                </p>
              </div>
            </div>
            <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold px-3 py-1 rounded-full">
              {portalMeta.badge}
            </span>
          </div>

          <div className="flex items-start gap-4 bg-surface-container-low rounded-xl p-5">
            <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
              <AppIcon name={portalMeta.icon} size={24} />
            </div>
            <div className="space-y-1">
              <h1 className="font-headline-md text-headline-md text-primary">
                {portalMeta.title}
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                مرحباً <strong>{currentUser.name}</strong> ({currentUser.identifier})
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant pt-1">
                {portalMeta.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setCurrentUser({...currentUser, role: 'donor'});
                setActivePortal('donor-portal');
                setCurrentPage('donor-portal');
              }}
              className="flex-1 h-12 rounded-xl bg-tertiary-fixed-dim hover:bg-tertiary-fixed text-on-tertiary-fixed font-title-md text-title-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <AppIcon name="favorite" size={18} />
              <span>الانتقال إلى بوابة المتبرع</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 h-12 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-title-md text-title-md transition-colors cursor-pointer"
            >
              العودة إلى تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'donor-portal' && currentUser) {
    return (
      <>
        <DonorPortalPage
          currentUser={currentUser}
          cases={cases}
          donationsHistory={donationsHistory}
          walletBalance={walletBalance}
          onTopUpWallet={(amount) => setWalletBalance((prev) => prev + amount)}
          onOpenDonateModal={(medicalCase, amount, flags) =>
            handleOpenDonateForCase(medicalCase, amount, flags)
          }
          onOpenAccountModal={() => setUtilityModal('login')}
          onUpdateUser={(updated) => setCurrentUser(updated)}
          onOpenSupport={() => setUtilityModal('support')}
          onBackToHome={() => {
            setActiveNav('home');
            setCurrentPage('donor');
            window.scrollTo({top: 0, behavior: 'smooth'});
          }}
          onLogout={handleLogout}
        />

        <DonationModal
          isOpen={donateModalOpen}
          selectedCase={selectedDonateCase}
          allCases={cases}
          initialAmount={selectedDonateAmount}
          initialFlags={selectedDonateFlags}
          walletBalance={walletBalance}
          onClose={() => setDonateModalOpen(false)}
          onCompleteDonation={handleCompleteDonation}
        />

        <UtilityModal
          modalType={utilityModal}
          activePortal={activePortal}
          currentUser={currentUser}
          onUpdateUser={(updated) => setCurrentUser(updated)}
          onLogout={handleLogout}
          onGoToLogin={handleLogout}
          onClose={() => setUtilityModal(null)}
        />
      </>
    );
  }

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="bg-surface font-body-md text-on-surface min-h-screen">
      <Header
        activePortal={activePortal}
        onSelectPortal={handleSelectPortal}
        activeNav={activeNav}
        onNavigateSection={handleNavigateSection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenDonateModal={() => handleOpenDonateForCase(null)}
        onOpenApplyModal={() => setApplyModalOpen(true)}
        onOpenLoginModal={() => setUtilityModal('login')}
        currentUser={currentUser}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))}
      />

      <main className="w-full pt-20 bg-surface">
        <div className="flex flex-col w-full">
          <HeroSection
            specialtyFilter={specialtyFilter}
            regionFilter={regionFilter}
            priorityFilter={priorityFilter}
            onSpecialtyChange={setSpecialtyFilter}
            onRegionChange={setRegionFilter}
            onPriorityChange={setPriorityFilter}
            onApplyFilterSubmit={handleApplyTriageFilter}
            onDonateUrgentClick={() => {
              if (!currentUser || currentUser.role !== 'donor') {
                setPendingApplyCase(false);
                setPendingDonation(null);
                setLoginLockedRole('donor');
                setPendingTargetSection('donor-portal');
                setCurrentPage('login');
                return;
              }
              setActivePortal('donor-portal');
              setCurrentPage('donor-portal');
              window.scrollTo({top: 0, behavior: 'smooth'});
            }}
            onOpenApplyModal={() => {
              if (!currentUser || currentUser.role !== 'patient') {
                setPendingApplyCase(true);
                setPendingTargetSection(null);
                setPendingDonation(null);
                setLoginLockedRole('patient');
                setCurrentPage('login');
                return;
              }
              setApplyModalOpen(true);
            }}
            lang={lang}
          />

          <ImpactStats
            totalDonations={totalDonations}
            completedSurgeries={completedSurgeries}
          />

          <MedicalCasesSection
            cases={filteredCases}
            showAll={showAllCases}
            onToggleShowAll={() => setShowAllCases((prev) => !prev)}
            hasActiveFilter={hasActiveFilter}
            onResetFilters={handleResetFilters}
            onDonateToCase={(c, amount) => {
              if (!currentUser) {
                setPendingApplyCase(false);
                setPendingDonation({medicalCase: c, amount});
                setLoginLockedRole('donor');
                setPendingTargetSection('donor-portal');
                setCurrentPage('login');
                return;
              }
              handleOpenDonateForCase(c, amount);
            }}
          />

          <HowItWorksSection />

          <PartnersSection onFilterByRegion={handleFilterByPartnerRegion} />

          <GovernanceSection onOpenReportModal={() => setUtilityModal('report')} />
        </div>
      </main>

      <Footer
        onSelectPortal={handleSelectPortal}
        onOpenReportModal={() => setUtilityModal('report')}
        onNavigateHowItWorks={() => handleNavigateSection('how-it-works-section', 'how-it-works')}
        onOpenInfoModal={(topic) => setUtilityModal(topic)}
      />

      <AnimatePresence>
        {showScrollTop && !isOverlayOpen && (
          <motion.button
            type="button"
            initial={{opacity: 0, y: 14, scale: 0.9}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 14, scale: 0.9}}
            transition={{duration: 0.35, ease: [0.16, 1, 0.3, 1]}}
            whileHover={{scale: 1.06, y: -2}}
            whileTap={{scale: 0.95}}
            onClick={() => smoothScrollToY(0)}
            aria-label="العودة إلى الأعلى"
            title="العودة إلى الأعلى"
            className="fixed bottom-24 left-5 z-40 w-11 h-11 rounded-full bg-primary text-on-primary shadow-lg shadow-primary/25 hover:bg-primary-container flex items-center justify-center cursor-pointer border border-white/15"
          >
            <AppIcon name="arrow_upward" size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <StickyDonationBar
        urgentCount={urgentCount}
        onQuickDonate={() => {
          if (!currentUser || currentUser.role !== 'donor') {
            setPendingApplyCase(false);
            setPendingDonation(null);
            setLoginLockedRole('donor');
            setPendingTargetSection('donor-portal');
            setCurrentPage('login');
            return;
          }
          setActivePortal('donor-portal');
          setCurrentPage('donor-portal');
          window.scrollTo({top: 0, behavior: 'smooth'});
        }}
        onLearnMore={() => handleNavigateSection('how-it-works-section', 'how-it-works')}
      />

      <DonationModal
        isOpen={donateModalOpen}
        selectedCase={selectedDonateCase}
        allCases={cases}
        initialAmount={selectedDonateAmount}
        initialFlags={selectedDonateFlags}
        walletBalance={currentUser?.role === 'donor' ? walletBalance : undefined}
        onClose={() => setDonateModalOpen(false)}
        onCompleteDonation={handleCompleteDonation}
      />

      <ApplyCaseModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />

      <AnimatePresence>
        {currentPage === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onBrowseAsGuest={handleBrowseAsGuest}
            onOpenSupport={() => setUtilityModal('support')}
            lockedRole={loginLockedRole}
          />
        )}
      </AnimatePresence>

      <UtilityModal
        modalType={utilityModal}
        activePortal={activePortal}
        currentUser={currentUser}
        onUpdateUser={(updated) => setCurrentUser(updated)}
        onOpenDonorPortal={() => {
          setActivePortal('donor-portal');
          setCurrentPage('donor-portal');
          window.scrollTo({top: 0, behavior: 'smooth'});
        }}
        onLogout={handleLogout}
        onGoToLogin={handleLogout}
        onClose={() => setUtilityModal(null)}
      />
    </div>
  );
}
