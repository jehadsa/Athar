import {useState} from 'react';
import {ATHAR_LOGO_URL, PortalRole} from '../data/atharData';
import {AppIcon} from './AppIcon';
import type {AuthenticatedUser} from './LoginPage';

interface HeaderProps {
  activePortal?: PortalRole;
  onSelectPortal?: (portal: PortalRole) => void;
  activeNav: string;
  onNavigateSection: (sectionId: string, navKey: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenDonateModal: () => void;
  onOpenApplyModal?: () => void;
  onOpenLoginModal: () => void;
  currentUser?: AuthenticatedUser | null;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
}

export function Header({
  activeNav,
  onNavigateSection,
  searchQuery,
  onSearchChange,
  onOpenDonateModal,
  onOpenLoginModal,
  currentUser,
  lang,
  onToggleLang,
}: HeaderProps) {
  const [logoError, setLogoError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {key: 'home', label: lang === 'ar' ? 'الرئيسية' : 'Home', target: 'hero-section'},
    {key: 'medical-cases', label: lang === 'ar' ? 'الحالات الطبية' : 'Medical Cases', target: 'cases-section'},
    {key: 'how-it-works', label: lang === 'ar' ? 'كيف نعمل' : 'How It Works', target: 'how-it-works-section'},
    {key: 'medical-partners', label: lang === 'ar' ? 'شركاؤنا الطبيون' : 'Partners', target: 'partners-section'},
    {key: 'transparency-reports', label: lang === 'ar' ? 'تقارير الأثر والشفافية' : 'Transparency', target: 'governance-section'},
    {key: 'about-athar', label: lang === 'ar' ? 'عن المنصة' : 'About', target: 'footer-section'},
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Main Navigation Bar */}
      <div className="h-20 w-full max-w-[1280px] mx-auto px-margin-sm md:px-margin flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-md min-w-0">
          <button
            type="button"
            onClick={() => onNavigateSection('hero-section', 'home')}
            className="flex items-center gap-space-xs cursor-pointer shrink-0"
          >
            {!logoError ? (
              <img
                alt="Athar Brand Logo"
                className="h-11 w-auto object-contain shrink-0"
                src={ATHAR_LOGO_URL}
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-secondary-fixed">
                <AppIcon name="volunteer_activism" size={18} />
              </div>
            )}
            <div className="flex flex-col items-start leading-tight text-start">
              <span className="font-headline-sm text-headline-sm text-primary whitespace-nowrap leading-none">
                {lang === 'ar' ? 'أثر' : 'Athar'}
              </span>
              <span className="font-label-sm text-label-sm text-secondary whitespace-nowrap mt-0.5">
                {lang === 'ar' ? 'للعطاء الصحي الموثق' : 'Trusted Medical Giving'}
              </span>
            </div>
          </button>

          <nav className="hidden xl:flex items-center gap-1" aria-label="التنقل الرئيسي">
            {navItems.map((item) => {
              const isActive = activeNav === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onNavigateSection(item.target, item.key)}
                  className={`px-2.5 py-space-xs transition-colors rounded-lg cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-surface-container text-primary font-bold'
                      : 'font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-space-xs sm:gap-space-sm shrink-0">
          <div className="hidden md:flex items-center bg-surface-container-low rounded-xl px-space-sm py-space-xs focus-within:ring-2 focus-within:ring-secondary/40">
            <AppIcon name="search" size={18} className="text-outline ml-space-xs" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (e.target.value.trim().length > 0) {
                  const el = document.getElementById('cases-section');
                  if (el) {
                    el.scrollIntoView({behavior: 'smooth', block: 'start'});
                  }
                }
              }}
              placeholder={lang === 'ar' ? 'ابحث عن حالة أو تخصص...' : 'Search case or specialty...'}
              className="bg-transparent font-body-sm text-body-sm text-on-surface focus:outline-none w-36 xl:w-40 placeholder:text-outline-variant"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-outline hover:text-primary transition-colors cursor-pointer"
                aria-label="مسح البحث"
              >
                <AppIcon name="close" size={16} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenDonateModal}
            className="px-space-sm sm:px-space-md py-space-xs rounded-xl bg-tertiary-fixed text-tertiary font-label-md text-label-md hover:bg-tertiary-fixed-dim hover:text-on-tertiary-fixed-variant transition-all flex items-center gap-space-xs cursor-pointer whitespace-nowrap shrink-0"
          >
            {lang === 'ar' ? 'تبرع الآن' : 'Donate Now'}
          </button>

          <button
            type="button"
            onClick={onOpenLoginModal}
            aria-label={currentUser ? `الحساب: ${currentUser.name}` : 'تسجيل الدخول'}
            title={currentUser ? `${currentUser.name} — الحساب الموثق` : 'تسجيل الدخول'}
            className="relative p-1 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <AppIcon name="person" size={18} />
            </div>
            {currentUser && (
              <span
                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest"
                aria-hidden="true"
              />
            )}
          </button>

          <button
            type="button"
            onClick={onToggleLang}
            aria-label="تبديل اللغة"
            className="px-space-sm py-space-xs rounded-xl bg-surface-container-low text-primary font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="القائمة"
            className="xl:hidden p-space-xs rounded-lg bg-surface-container-low text-primary hover:bg-surface-container-high transition-colors cursor-pointer shrink-0"
          >
            <AppIcon name={mobileMenuOpen ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      {/* Responsive Mobile/Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface-container-lowest border-t border-surface-container px-margin py-space-sm shadow-md">
          <div className="flex flex-wrap gap-space-xs">
            {navItems.map((item) => {
              const isActive = activeNav === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    onNavigateSection(item.target, item.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-space-sm py-space-xs rounded-lg text-body-md transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-surface-container text-primary font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
