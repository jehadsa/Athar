import {useMemo, useState} from 'react';
import {AppIcon} from './components/AppIcon';
import {
  ApplyCaseModal,
  DonationModal,
  UtilityModal,
} from './components/AtharModals';
import {Footer} from './components/Footer';
import {GovernanceSection} from './components/GovernanceSection';
import {Header} from './components/Header';
import {HeroSection} from './components/HeroSection';
import {HowItWorksSection} from './components/HowItWorksSection';
import {ImpactStats} from './components/ImpactStats';
import {AuthenticatedUser, LoginPage} from './components/LoginPage';
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
  const [currentPage, setCurrentPage] = useState<'login' | 'donor' | 'portal-preview'>('login');
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);

  const [cases, setCases] = useState<MedicalCase[]>(INITIAL_MEDICAL_CASES);
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
  const [applyModalOpen, setApplyModalOpen] = useState<boolean>(false);
  const [utilityModal, setUtilityModal] = useState<
    'login' | 'report' | 'privacy' | 'support' | 'portal' | null
  >(null);

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
    if (user.role === 'donor') {
      setActivePortal('donor-portal');
      setActiveNav('home');
      setCurrentPage('donor');
    } else {
      setCurrentPage('portal-preview');
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleBrowseAsGuest = () => {
    setCurrentUser(null);
    setUtilityModal(null);
    setActivePortal('donor-portal');
    setActiveNav('home');
    setCurrentPage('donor');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleLogout = () => {
    setUtilityModal(null);
    setDonateModalOpen(false);
    setApplyModalOpen(false);
    setCurrentUser(null);
    setCurrentPage('login');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleNavigateSection = (sectionId: string, navKey: string) => {
    setActiveNav(navKey);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  const handleSelectPortal = (portal: PortalRole) => {
    setActivePortal(portal);
    if (portal === 'donor-portal') {
      setCurrentPage('donor');
      window.scrollTo({top: 0, behavior: 'smooth'});
      return;
    }
    if (portal !== 'home') {
      setUtilityModal('portal');
    }
  };

  const handleApplyTriageFilter = () => {
    setShowAllCases(true);
    const el = document.getElementById('cases-section');
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
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
    const el = document.getElementById('cases-section');
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  const handleOpenDonateForCase = (medicalCase: MedicalCase | null, amount?: number) => {
    setSelectedDonateCase(medicalCase);
    setSelectedDonateAmount(amount);
    setDonateModalOpen(true);
  };

  const handleCompleteDonation = (caseId: string, amount: number) => {
    setTotalDonations((prev) => prev + amount);
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

  if (currentPage === 'login') {
    return (
      <>
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onBrowseAsGuest={handleBrowseAsGuest}
          onOpenSupport={() => setUtilityModal('support')}
        />
        <UtilityModal
          modalType={utilityModal}
          activePortal={activePortal}
          currentUser={currentUser}
          onLogout={handleLogout}
          onClose={() => setUtilityModal(null)}
        />
      </>
    );
  }

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
                setCurrentPage('donor');
              }}
              className="flex-1 h-12 rounded-xl bg-tertiary-fixed-dim hover:bg-tertiary-fixed text-on-tertiary-fixed font-title-md text-title-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <AppIcon name="favorite" size={18} />
              <span>الانتقال إلى صفحة المتبرع</span>
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
            onDonateUrgentClick={() => handleNavigateSection('cases-section', 'medical-cases')}
            onOpenApplyModal={() => setApplyModalOpen(true)}
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
            onDonateToCase={(c, amount) => handleOpenDonateForCase(c, amount)}
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

      <StickyDonationBar
        urgentCount={urgentCount}
        onQuickDonate={() => handleOpenDonateForCase(null)}
        onLearnMore={() => handleNavigateSection('how-it-works-section', 'how-it-works')}
      />

      <DonationModal
        isOpen={donateModalOpen}
        selectedCase={selectedDonateCase}
        allCases={cases}
        initialAmount={selectedDonateAmount}
        onClose={() => setDonateModalOpen(false)}
        onCompleteDonation={handleCompleteDonation}
      />

      <ApplyCaseModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
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
    </div>
  );
}
