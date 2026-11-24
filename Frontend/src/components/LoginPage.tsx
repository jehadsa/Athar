import {motion} from 'motion/react';
import {FormEvent, useState} from 'react';
import {ATHAR_LOGO_URL, SYRIAN_GOVERNORATES} from '../data/atharData';
import {AppIcon} from './AppIcon';

export type AuthRole = 'donor' | 'patient' | 'hospital' | 'charity' | 'admin';

export interface AuthenticatedUser {
  name: string;
  identifier: string;
  role: AuthRole;
  phone?: string;
  email?: string;
  city?: string;
  avatarUrl?: string;
}

interface LoginPageProps {
  onLoginSuccess: (user: AuthenticatedUser) => void;
  onBrowseAsGuest: () => void;
  onOpenSupport: () => void;
  lockedRole?: AuthRole | null;
}

const ROLE_CONFIG: Record<
  AuthRole,
  {
    label: string;
    shortLabel: string;
    badge: string;
    guidance: string;
    icon: string;
    quickColor: string;
  }
> = {
  donor: {
    label: 'المتبرع',
    shortLabel: 'المتبرع',
    badge: 'بوابة المتبرعين',
    guidance: 'تابع تبرعاتك، حمّل السندات الإلكترونية، وتبرع للحالات الحرجة مباشرة.',
    icon: 'favorite',
    quickColor: 'text-error',
  },
  patient: {
    label: 'المريض',
    shortLabel: 'المريض',
    badge: 'بوابة المستفيدين',
    guidance: 'ارفع تقاريرك الطبية وتابع مراحل التدقيق والموافقة الجراحية خطوة بخطوة.',
    icon: 'medical_services',
    quickColor: 'text-secondary',
  },
  hospital: {
    label: 'المستشفى الشريك',
    shortLabel: 'المستشفى',
    badge: 'بوابة المنشآت الطبية',
    guidance: 'إصدار القسائم الطبية المعتمدة ورفع الفواتير الجراحية للسداد المباشر.',
    icon: 'local_hospital',
    quickColor: 'text-primary',
  },
  charity: {
    label: 'الجمعية الخيرية',
    shortLabel: 'الجمعية',
    badge: 'بوابة الجمعيات',
    guidance: 'مراجعة البحث الاجتماعي الميداني واعتماد أولوية الحالات الأشد حاجة.',
    icon: 'handshake',
    quickColor: 'text-on-surface',
  },
  admin: {
    label: 'الإشراف والحوكمة',
    shortLabel: 'الإشراف',
    badge: 'لوحة الرقابة المركزية',
    guidance: 'مراقبة التحويلات البنكية المغلقة والامتثال الطبي والشرعي لحظياً.',
    icon: 'verified_user',
    quickColor: 'text-secondary',
  },
};

export function LoginPage({
  onLoginSuccess,
  onBrowseAsGuest,
  onOpenSupport,
  lockedRole = null,
}: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<AuthRole>(lockedRole ?? 'donor');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('دمشق');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [nafathWaiting, setNafathWaiting] = useState(false);

  const effectiveRole: AuthRole = lockedRole ?? selectedRole;
  const activeRoleInfo = ROLE_CONFIG[effectiveRole];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authMode === 'register' && !fullName.trim()) {
      setErrorMsg('يرجى إدخال الاسم الكامل لإنشاء الحساب.');
      return;
    }
    if (!identifier.trim()) {
      setErrorMsg('يرجى إدخال رقم الهوية الوطنية أو البريد الإلكتروني.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setErrorMsg('يرجى إدخال كلمة مرور لا تقل عن 4 أحرف.');
      return;
    }

    const trimmedId = identifier.trim();
    const isEmail = trimmedId.includes('@');

    onLoginSuccess({
      name: authMode === 'register' ? fullName.trim() : 'أحمد العتيبي',
      identifier: trimmedId,
      role: effectiveRole,
      phone: phone.trim() || '0931234567',
      email: isEmail ? trimmedId : 'donor@athar-sy.org',
      city: authMode === 'register' ? city : 'دمشق',
    });
  };

  const handleNafathLogin = () => {
    setErrorMsg('');
    setNafathWaiting(true);
    setTimeout(() => {
      setNafathWaiting(false);
      onLoginSuccess({
        name: 'عبدالرحمن الحلبي',
        identifier: '0104829102',
        role: effectiveRole,
        city: 'دمشق',
      });
    }, 900);
  };

  return (
    <motion.div
      dir="rtl"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.28, ease: 'easeOut'}}
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-[#001d32]/35 backdrop-blur-sm"
    >
      <div
        style={{perspective: 1400}}
        className="min-h-full w-full flex items-center justify-center p-3 sm:p-5"
      >
        <motion.div
          initial={{opacity: 0, rotateX: 8, y: 44, scale: 0.91}}
          animate={{opacity: 1, rotateX: 0, y: 0, scale: 1}}
          exit={{opacity: 0, y: 24, scale: 0.94}}
          transition={{type: 'spring', stiffness: 120, damping: 16, mass: 0.9}}
          className="relative w-full max-w-[960px] bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12"
        >
        {/* Close Login Screen Button */}
        <button
          type="button"
          onClick={onBrowseAsGuest}
          aria-label="إغلاق صفحة تسجيل الدخول"
          title="إغلاق"
          className="absolute top-3 left-3 z-30 w-9 h-9 rounded-full bg-surface-container-low/95 hover:bg-surface-container-high text-on-surface-variant hover:text-primary border border-surface-variant/70 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <AppIcon name="close" size={18} />
        </button>

        {/* Right Side (Columns: 5): Deep Nautical Brand & Sovereign Verification Story */}
        <motion.aside
          initial={{opacity: 0, x: 70}}
          animate={{opacity: 1, x: 0}}
          transition={{type: 'spring', stiffness: 115, damping: 18, delay: 0.08}}
          className="lg:col-span-5 bg-gradient-to-br from-[#002b46] via-primary to-[#00575b] text-on-primary p-5 lg:p-6 flex flex-col justify-between relative overflow-hidden isolate gap-4"
        >
          {/* Ambient Medical & Architectural Geometric Overlays */}
          <div className="absolute w-72 h-72 -right-24 -top-24 bg-secondary/35 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute w-64 h-64 -left-20 bottom-4 bg-tertiary-fixed-dim/15 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute w-[340px] h-[340px] -left-36 -top-36 border border-white/10 rounded-full pointer-events-none" />
          <div className="absolute w-[240px] h-[240px] -right-24 -bottom-24 border border-secondary-fixed/15 rounded-full pointer-events-none" />

          {/* Top Header & Brand Identity */}
          <motion.div
            initial={{opacity: 0, scale: 0.92, y: -14}}
            animate={{opacity: 1, scale: 1, y: 0}}
            transition={{type: 'spring', stiffness: 150, damping: 17, delay: 0.18}}
            className="relative z-10 flex flex-col gap-3.5"
          >
            <div className="flex items-center justify-between gap-2 pl-11 lg:pl-0">
              <div className="bg-surface-container-lowest rounded-xl px-3 py-2 shadow-lg ring-1 ring-white/25 flex items-center gap-2.5">
                <img
                  src={ATHAR_LOGO_URL}
                  alt="شعار منصة أثر"
                  className="h-8 w-auto object-contain shrink-0"
                />
                <div className="flex flex-col leading-tight">
                  <span className="font-headline-sm text-[18px] font-extrabold text-primary leading-none">
                    أثر
                  </span>
                  <span className="font-label-sm text-[10px] font-semibold text-secondary whitespace-nowrap mt-0.5">
                    للعطاء الصحي الموثق
                  </span>
                </div>
              </div>

              <div className="bg-white/12 border border-secondary-fixed/30 rounded-full px-3 py-1 flex items-center gap-1.5 shrink-0 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
                <span className="text-secondary-fixed font-label-sm text-[10.5px] font-bold">
                  منصة موثقة
                </span>
              </div>
            </div>

            {/* Quranic Spiritual Anchor Card */}
            <div className="bg-gradient-to-b from-white/14 to-white/[0.07] border border-tertiary-fixed/25 rounded-xl p-3.5 text-center shadow-lg relative overflow-hidden">
              <motion.div
                initial={{x: '-140%'}}
                animate={{x: '240%'}}
                transition={{duration: 0.95, delay: 0.45, ease: 'easeInOut'}}
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
              />
              <div className="w-10 h-0.5 rounded-full bg-gradient-to-r from-transparent via-tertiary-fixed-dim to-transparent mx-auto mb-2" />
              <p className="font-headline-sm text-[16px] font-bold text-tertiary-fixed leading-relaxed">
                ﴿وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا﴾
              </p>
              <div className="mt-1.5 inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10">
                <span className="font-label-sm text-[10px] font-semibold text-primary-fixed">
                  سورة المائدة — الآية 32
                </span>
              </div>
            </div>
          </motion.div>

          {/* Clinical Transparency & Security Matrix */}
          <div className="relative z-10 space-y-2">
            <motion.div
              initial={{opacity: 0, x: 32, scale: 0.95}}
              animate={{opacity: 1, x: 0, scale: 1}}
              transition={{type: 'spring', stiffness: 145, damping: 16, delay: 0.26}}
              className="bg-white/[0.08] hover:bg-white/[0.12] transition-colors border border-white/12 rounded-xl p-3 flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-secondary-fixed/25 to-white/5 border border-secondary-fixed/25 flex items-center justify-center shrink-0 text-secondary-fixed shadow-xs">
                <AppIcon name="account_balance" size={18} />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-body-lg text-[13.5px] font-bold text-on-primary">
                  تحويل مباشر 100% للمستشفيات
                </h3>
                <p className="font-body-sm text-[11px] text-primary-fixed/85 leading-snug">
                  لا استقطاع إداري أو وسطاء ماليين على تبرعك العلاجي
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{opacity: 0, x: 32, scale: 0.95}}
              animate={{opacity: 1, x: 0, scale: 1}}
              transition={{type: 'spring', stiffness: 145, damping: 16, delay: 0.34}}
              className="bg-white/[0.08] hover:bg-white/[0.12] transition-colors border border-white/12 rounded-xl p-3 flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-tertiary-fixed/25 to-white/5 border border-tertiary-fixed/25 flex items-center justify-center shrink-0 text-tertiary-fixed shadow-xs">
                <AppIcon name="health_and_safety" size={18} />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-body-lg text-[13.5px] font-bold text-on-primary">
                  تدقيق طبي وشرعي مستقل
                </h3>
                <p className="font-body-sm text-[11px] text-primary-fixed/85 leading-snug">
                  اعتماد كل حالة من لجان استشارية وشرعية مرخصة رسمياً
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{opacity: 0, x: 32, scale: 0.95}}
              animate={{opacity: 1, x: 0, scale: 1}}
              transition={{type: 'spring', stiffness: 145, damping: 16, delay: 0.42}}
              className="bg-white/[0.08] hover:bg-white/[0.12] transition-colors border border-white/12 rounded-xl p-3 flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-secondary-fixed-dim/25 to-white/5 border border-secondary-fixed-dim/25 flex items-center justify-center shrink-0 text-secondary-fixed-dim shadow-xs">
                <AppIcon name="verified_user" size={18} />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-body-lg text-[13.5px] font-bold text-on-primary">
                  حماية البيانات وخصوصية المرضى
                </h3>
                <p className="font-body-sm text-[11px] text-primary-fixed/85 leading-snug">
                  تشفير كامل وسجل شفاف لتقارير الأثر والشفاء والسندات في سوريا
                </p>
              </div>
            </motion.div>
          </div>

          {/* Trust Metrics & Footer Audit Indicator */}
          <motion.div
            initial={{opacity: 0, y: 18}}
            animate={{opacity: 1, y: 0}}
            transition={{type: 'spring', stiffness: 140, damping: 18, delay: 0.48}}
            className="relative z-10 space-y-2.5"
          >
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-1.5 text-center">
                <div className="font-numeral-md text-[15px] font-extrabold text-tertiary-fixed">
                  100%
                </div>
                <div className="font-body-sm text-[10.5px] text-primary-fixed/85">
                  وصول مباشر للعلاج
                </div>
              </div>
              <div className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-1.5 text-center">
                <div className="font-numeral-md text-[15px] font-extrabold text-secondary-fixed">
                  0.0%
                </div>
                <div className="font-body-sm text-[10.5px] text-primary-fixed/85">
                  رسوم أو استقطاع إداري
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-white/15">
              <div className="flex items-center gap-1.5 text-[11px] text-primary-fixed">
                <AppIcon name="verified" size={14} className="text-secondary-fixed" />
                <span>بوابة موثقة ومعتمدة 100%</span>
              </div>
              <span className="font-numeral-md text-[10.5px] font-semibold px-2 py-0.5 rounded-md bg-white/10 text-primary-fixed">
                ATHAR v2.4
              </span>
            </div>
          </motion.div>
        </motion.aside>

        {/* Left Side (Columns: 7): Interactive Role-Based Auth Core */}
        <motion.section
          initial={{opacity: 0, x: -70}}
          animate={{opacity: 1, x: 0}}
          transition={{type: 'spring', stiffness: 115, damping: 18, delay: 0.12}}
          className="lg:col-span-7 bg-gradient-to-b from-surface-container-lowest to-surface/60 px-5 pb-5 pt-11 sm:px-7 sm:pb-7 sm:pt-12 lg:px-8 lg:pb-7 lg:pt-12 flex flex-col justify-center"
        >
          <motion.div
            initial={{opacity: 0, y: 18}}
            animate={{opacity: 1, y: 0}}
            transition={{type: 'spring', stiffness: 140, damping: 18, delay: 0.22}}
            className="w-full max-w-lg mx-auto space-y-4"
          >
            {/* Header Sub-Bar */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2 text-[11.5px]">
                <div className="inline-flex items-center gap-1.5 bg-secondary/10 border border-secondary/20 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  <span className="font-label-md text-[11px] font-bold text-secondary">
                    بوابة الدخول الموحد الآمنة
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-on-surface-variant">تحتاج مساعدة؟</span>
                  <button
                    type="button"
                    onClick={onOpenSupport}
                    className="font-bold text-primary hover:text-secondary hover:underline transition-colors cursor-pointer"
                  >
                    مركز الدعم
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h1 className="font-headline-lg text-[22px] sm:text-[26px] font-extrabold text-primary tracking-tight leading-tight">
                    {authMode === 'login' ? 'تسجيل الدخول الموحد' : 'إنشاء حساب جديد'}
                  </h1>
                  <p className="font-body-md text-[13px] text-on-surface-variant">
                    {authMode === 'login'
                      ? lockedRole === 'donor'
                        ? 'سجّل دخولك كمتبرع للمساهمة في الحالات الحرجة ومتابعة تبرعاتك'
                        : lockedRole === 'patient'
                          ? 'سجّل دخولك كمريض لتقديم طلب مساعدة علاجية ومتابعة ملفك الطبي'
                          : 'اختر صفتك في منصة أثر للوصول إلى لوحتك المخصصة'
                      : lockedRole === 'patient'
                        ? 'أنشئ حساب مريض موثق لتقديم طلب مساعدة علاجية ومتابعة المراجعة الطبية'
                        : 'أنشئ حسابك الموثق للمساهمة في صناعة الشفاء ومتابعة الأثر'}
                  </p>
                </div>

                {/* Auth Mode Segmented Switch */}
                <div className="relative grid grid-cols-2 items-center bg-surface-container p-1 rounded-xl border border-surface-variant/60">
                  <span
                    aria-hidden="true"
                    className={`absolute top-1 bottom-1 right-1 w-[calc(50%-4px)] rounded-lg bg-surface-container-lowest shadow-sm ring-1 ring-primary/10 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      authMode === 'register' ? '-translate-x-full' : 'translate-x-0'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMsg('');
                    }}
                    className={`relative z-10 px-3 py-1.5 rounded-lg font-label-md text-[11.5px] transition-colors duration-200 cursor-pointer whitespace-nowrap text-center ${
                      authMode === 'login'
                        ? 'text-primary font-bold'
                        : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    تسجيل الدخول
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setErrorMsg('');
                    }}
                    className={`relative z-10 px-3 py-1.5 rounded-lg font-label-md text-[11.5px] transition-colors duration-200 cursor-pointer whitespace-nowrap text-center ${
                      authMode === 'register'
                        ? 'text-primary font-bold'
                        : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    حساب جديد
                  </button>
                </div>
              </div>
            </div>

            {/* Role Switcher Cards Bar */}
            {!lockedRole && (
              <div className="grid grid-cols-3 gap-2">
                {(['donor', 'patient', 'charity'] as AuthRole[]).map((roleKey) => {
                  const role = ROLE_CONFIG[roleKey];
                  const isActive = effectiveRole === roleKey;
                  return (
                    <button
                      key={roleKey}
                      type="button"
                      onClick={() => setSelectedRole(roleKey)}
                      className={`px-2.5 py-2 rounded-xl text-[12.5px] border flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-gradient-to-l from-primary to-[#005559] text-on-primary font-bold border-transparent shadow-md'
                          : 'bg-surface-container-low/80 border-surface-variant/70 text-on-surface-variant hover:text-primary hover:border-secondary/40 hover:bg-surface-container'
                      }`}
                    >
                      <AppIcon name={role.icon} size={15} />
                      <span>{role.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Dynamic Role Guidance Micro-banner */}
            <div className="bg-gradient-to-l from-surface-container-low via-surface-container/80 to-secondary/[0.07] border border-secondary/15 rounded-xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-[12px] text-on-surface min-w-0">
                <div className="w-7 h-7 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                  <AppIcon name={activeRoleInfo.icon} size={15} />
                </div>
                <span className="leading-snug">{activeRoleInfo.guidance}</span>
              </div>
              <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10.5px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-2xs">
                {activeRoleInfo.badge}
              </span>
            </div>

            {/* Credential Form */}
            <form onSubmit={handleSubmit} className="flex flex-col">
              {errorMsg && (
                <div className="mb-3 bg-error-container border border-error/20 text-on-error-container px-4 py-3 rounded-xl text-[13px] font-semibold flex items-center gap-2">
                  <AppIcon name="emergency" size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div
                aria-hidden={authMode !== 'register'}
                className={`grid transition-[grid-template-rows,opacity,transform,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  authMode === 'register'
                    ? 'grid-rows-[1fr] opacity-100 translate-y-0 mb-3'
                    : 'grid-rows-[0fr] opacity-0 -translate-y-2 mb-0 pointer-events-none'
                }`}
              >
                <div className="overflow-hidden min-h-0">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-0.5 pb-1">
                    <div className="space-y-1">
                      <label
                        htmlFor="auth-fullname"
                        className="block font-label-md text-[12.5px] font-semibold text-on-surface"
                      >
                        الاسم الكامل
                      </label>
                      <input
                        id="auth-fullname"
                        type="text"
                        tabIndex={authMode === 'register' ? 0 : -1}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="مثال: محمد بن عبدالله"
                        className="w-full h-10 bg-surface-container-low/70 border border-surface-variant/80 hover:border-secondary/40 rounded-xl px-3.5 font-body-md text-[13px] text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="auth-city"
                        className="block font-label-md text-[12.5px] font-semibold text-on-surface"
                      >
                        المدينة / المحافظة
                      </label>
                      <select
                        id="auth-city"
                        tabIndex={authMode === 'register' ? 0 : -1}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-10 bg-surface-container-low/70 border border-surface-variant/80 hover:border-secondary/40 rounded-xl px-2.5 font-body-md text-[13px] text-on-surface focus:bg-surface-container-lowest focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all cursor-pointer"
                      >
                        {SYRIAN_GOVERNORATES.map((gov) => (
                          <option key={gov.key} value={gov.label}>
                            {gov.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="auth-phone"
                        className="block font-label-md text-[12.5px] font-semibold text-on-surface"
                      >
                        رقم الجوال (اختياري)
                      </label>
                      <input
                        id="auth-phone"
                        type="tel"
                        tabIndex={authMode === 'register' ? 0 : -1}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="09XXXXXXXX"
                        className="w-full h-10 bg-surface-container-low/70 border border-surface-variant/80 hover:border-secondary/40 rounded-xl px-3.5 font-numeral-md text-[13px] text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
              {/* Identity / Email Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="auth-identifier"
                    className="font-label-md text-[12.5px] font-semibold text-on-surface"
                  >
                    رقم الهوية الوطنية أو البريد الإلكتروني
                  </label>
                  <span className="font-label-sm text-[10.5px] font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-md">
                    إلزامي
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="auth-identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="أدخل البريد الإلكتروني أو رقم الهوية..."
                    className="w-full h-10 bg-surface-container-low/70 border border-surface-variant/80 hover:border-secondary/40 rounded-xl pr-3.5 pl-10 font-body-md text-[13px] text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                    <AppIcon name="person" size={17} />
                  </span>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="auth-password"
                    className="font-label-md text-[12.5px] font-semibold text-on-surface"
                  >
                    كلمة المرور
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={onOpenSupport}
                      className="font-label-md text-[12px] font-semibold text-secondary hover:text-primary hover:underline transition-colors cursor-pointer"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full h-10 bg-surface-container-low/70 border border-surface-variant/80 hover:border-secondary/40 rounded-xl pr-3.5 pl-10 font-numeral-md text-[13px] text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'عرض كلمة المرور'}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-primary p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    <AppIcon name="visibility" size={17} />
                  </button>
                </div>
              </div>

              {/* Remember Me & Trust Device */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                <label className="flex items-center gap-2 text-[12px] text-on-surface-variant cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-3.5 h-3.5 accent-secondary rounded cursor-pointer"
                  />
                  <span>تذكرني على هذا الجهاز الموثوق</span>
                </label>

                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full">
                  <span>اتصال مشفر SSL</span>
                  <AppIcon name="lock" size={12} />
                </div>
              </div>

              {/* Primary Submission Action */}
              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-l from-tertiary-fixed-dim via-tertiary-fixed to-tertiary-fixed-dim hover:brightness-[0.97] active:scale-[0.99] text-on-tertiary-fixed font-title-md text-[15px] font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {authMode === 'login'
                      ? `تسجيل الدخول (${activeRoleInfo.shortLabel})`
                      : `إنشاء حساب (${activeRoleInfo.shortLabel})`}
                  </span>
                  <AppIcon name="arrow_right_alt" size={17} className="rotate-180" />
                </button>
              </div>
              </div>
            </form>
          </motion.div>
        </motion.section>
        </motion.div>
      </div>
    </motion.div>
  );
}
