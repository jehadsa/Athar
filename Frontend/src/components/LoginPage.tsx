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
}

interface LoginPageProps {
  onLoginSuccess: (user: AuthenticatedUser) => void;
  onBrowseAsGuest: () => void;
  onOpenSupport: () => void;
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

export function LoginPage({onLoginSuccess, onBrowseAsGuest, onOpenSupport}: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<AuthRole>('donor');
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

  const activeRoleInfo = ROLE_CONFIG[selectedRole];

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
      role: selectedRole,
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
        role: selectedRole,
        city: 'دمشق',
      });
    }, 900);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-gradient-to-b from-surface to-surface-container-lowest flex items-center justify-center p-4 sm:p-8"
    >
      <div className="w-full max-w-[1216px] bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[780px]">
        {/* Right Side (Columns: 5): Deep Nautical Brand & Sovereign Verification Story */}
        <aside className="lg:col-span-5 bg-gradient-to-br from-[#002b46] via-primary to-[#00575b] text-on-primary p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden isolate gap-7">
          {/* Ambient Medical & Architectural Geometric Overlays */}
          <div className="absolute w-96 h-96 -right-28 -top-28 bg-secondary/35 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute w-80 h-80 -left-24 bottom-6 bg-tertiary-fixed-dim/15 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute w-[420px] h-[420px] -left-44 -top-44 border border-white/10 rounded-full pointer-events-none" />
          <div className="absolute w-[300px] h-[300px] -right-32 -bottom-32 border border-secondary-fixed/15 rounded-full pointer-events-none" />

          {/* Top Header & Brand Identity */}
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center justify-between gap-3">
              <div className="bg-surface-container-lowest rounded-2xl px-3.5 py-2.5 shadow-lg ring-1 ring-white/25 flex items-center gap-3">
                <img
                  src={ATHAR_LOGO_URL}
                  alt="شعار منصة أثر"
                  className="h-10 w-auto object-contain shrink-0"
                />
                <div className="flex flex-col leading-tight">
                  <span className="font-headline-sm text-[21px] font-extrabold text-primary leading-none">
                    أثر
                  </span>
                  <span className="font-label-sm text-[11px] font-semibold text-secondary whitespace-nowrap mt-1">
                    للعطاء الصحي الموثق
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-secondary-fixed/30 rounded-full px-3.5 py-1.5 flex items-center gap-2 shrink-0 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
                <span className="text-secondary-fixed font-label-sm text-[11px] font-bold">
                  منصة موثقة
                </span>
              </div>
            </div>

            {/* Quranic Spiritual Anchor Card */}
            <div className="bg-gradient-to-b from-white/14 to-white/[0.06] backdrop-blur-md border border-tertiary-fixed/25 rounded-2xl p-5 text-center shadow-lg relative overflow-hidden">
              <div className="w-12 h-1 rounded-full bg-gradient-to-r from-transparent via-tertiary-fixed-dim to-transparent mx-auto mb-3" />
              <p className="font-headline-sm text-[19px] font-bold text-tertiary-fixed leading-relaxed">
                ﴿وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا﴾
              </p>
              <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/10 border border-white/10">
                <span className="font-label-sm text-[11px] font-semibold text-primary-fixed">
                  سورة المائدة — الآية 32
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Transparency & Security Matrix */}
          <div className="relative z-10 space-y-3">
            <div className="bg-white/[0.07] hover:bg-white/[0.11] transition-colors border border-white/12 rounded-2xl p-4 flex items-start gap-3.5 backdrop-blur-sm">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-secondary-fixed/25 to-white/5 border border-secondary-fixed/25 flex items-center justify-center shrink-0 text-secondary-fixed shadow-xs">
                <AppIcon name="account_balance" size={20} />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-body-lg text-[15px] font-bold text-on-primary">
                  تحويل مباشر 100% للمستشفيات
                </h3>
                <p className="font-body-sm text-[12px] text-primary-fixed/85 leading-relaxed">
                  لا استقطاع إداري أو وسطاء ماليين على تبرعك العلاجي
                </p>
              </div>
            </div>

            <div className="bg-white/[0.07] hover:bg-white/[0.11] transition-colors border border-white/12 rounded-2xl p-4 flex items-start gap-3.5 backdrop-blur-sm">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-tertiary-fixed/25 to-white/5 border border-tertiary-fixed/25 flex items-center justify-center shrink-0 text-tertiary-fixed shadow-xs">
                <AppIcon name="health_and_safety" size={20} />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-body-lg text-[15px] font-bold text-on-primary">
                  تدقيق طبي وشرعي مستقل
                </h3>
                <p className="font-body-sm text-[12px] text-primary-fixed/85 leading-relaxed">
                  اعتماد كل حالة من لجان استشارية وشرعية مرخصة رسمياً
                </p>
              </div>
            </div>

            <div className="bg-white/[0.07] hover:bg-white/[0.11] transition-colors border border-white/12 rounded-2xl p-4 flex items-start gap-3.5 backdrop-blur-sm">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-secondary-fixed-dim/25 to-white/5 border border-secondary-fixed-dim/25 flex items-center justify-center shrink-0 text-secondary-fixed-dim shadow-xs">
                <AppIcon name="verified_user" size={20} />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-body-lg text-[15px] font-bold text-on-primary">
                  حماية البيانات وخصوصية المرضى
                </h3>
                <p className="font-body-sm text-[12px] text-primary-fixed/85 leading-relaxed">
                  تشفير كامل وسجل شفاف لتقارير الأثر والشفاء والسندات في سوريا
                </p>
              </div>
            </div>
          </div>

          {/* Trust Metrics & Footer Audit Indicator */}
          <div className="relative z-10 space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-center">
                <div className="font-numeral-md text-[17px] font-extrabold text-tertiary-fixed">
                  100%
                </div>
                <div className="font-body-sm text-[11px] text-primary-fixed/85">
                  وصول مباشر للعلاج
                </div>
              </div>
              <div className="bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-center">
                <div className="font-numeral-md text-[17px] font-extrabold text-secondary-fixed">
                  0.0%
                </div>
                <div className="font-body-sm text-[11px] text-primary-fixed/85">
                  رسوم أو استقطاع إداري
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3.5 border-t border-white/15">
              <div className="flex items-center gap-2 text-[12px] text-primary-fixed">
                <AppIcon name="verified" size={16} className="text-secondary-fixed" />
                <span>بوابة موثقة ومعتمدة 100%</span>
              </div>
              <span className="font-numeral-md text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-white/10 text-primary-fixed">
                ATHAR v2.4
              </span>
            </div>
          </div>
        </aside>

        {/* Left Side (Columns: 7): Interactive Role-Based Auth Core */}
        <section className="lg:col-span-7 bg-gradient-to-b from-surface-container-lowest to-surface/60 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="w-full max-w-xl mx-auto space-y-6">
            {/* Header Sub-Bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 text-[12px]">
                <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span className="font-label-md text-[12px] font-bold text-secondary">
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

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="font-headline-lg text-[28px] sm:text-[32px] font-extrabold text-primary tracking-tight leading-tight">
                    {authMode === 'login' ? 'تسجيل الدخول الموحد' : 'إنشاء حساب جديد'}
                  </h1>
                  <p className="font-body-md text-[14px] text-on-surface-variant">
                    {authMode === 'login'
                      ? 'اختر صفتك في منصة أثر للوصول إلى لوحتك المخصصة'
                      : 'أنشئ حسابك الموثق للمساهمة في صناعة الشفاء ومتابعة الأثر'}
                  </p>
                </div>

                {/* Auth Mode Segmented Switch */}
                <div className="flex items-center bg-surface-container p-1.5 rounded-2xl border border-surface-variant/60">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMsg('');
                    }}
                    className={`px-3.5 py-2 rounded-xl font-label-md text-[12px] transition-all cursor-pointer whitespace-nowrap ${
                      authMode === 'login'
                        ? 'bg-surface-container-lowest text-primary font-bold shadow-sm ring-1 ring-primary/10'
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
                    className={`px-3.5 py-2 rounded-xl font-label-md text-[12px] transition-all cursor-pointer whitespace-nowrap ${
                      authMode === 'register'
                        ? 'bg-surface-container-lowest text-primary font-bold shadow-sm ring-1 ring-primary/10'
                        : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    حساب جديد
                  </button>
                </div>
              </div>
            </div>

            {/* Role Switcher Cards Bar */}
            <div className="grid grid-cols-3 gap-2.5">
              {(['donor', 'patient', 'charity'] as AuthRole[]).map((roleKey) => {
                const role = ROLE_CONFIG[roleKey];
                const isActive = selectedRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => setSelectedRole(roleKey)}
                    className={`px-3 py-2.5 rounded-xl text-[13px] border flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-l from-primary to-[#005559] text-on-primary font-bold border-transparent shadow-md'
                        : 'bg-surface-container-low/80 border-surface-variant/70 text-on-surface-variant hover:text-primary hover:border-secondary/40 hover:bg-surface-container'
                    }`}
                  >
                    <AppIcon name={role.icon} size={16} />
                    <span>{role.shortLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Role Guidance Micro-banner */}
            <div className="bg-gradient-to-l from-surface-container-low via-surface-container/80 to-secondary/[0.07] border border-secondary/15 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-[12.5px] text-on-surface min-w-0">
                <div className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                  <AppIcon name={activeRoleInfo.icon} size={16} />
                </div>
                <span className="leading-snug">{activeRoleInfo.guidance}</span>
              </div>
              <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-2xs">
                {activeRoleInfo.badge}
              </span>
            </div>

            {/* Credential Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="bg-error-container border border-error/20 text-on-error-container px-4 py-3 rounded-xl text-[13px] font-semibold flex items-center gap-2">
                  <AppIcon name="emergency" size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {authMode === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="auth-fullname"
                      className="block font-label-md text-[13px] font-semibold text-on-surface"
                    >
                      الاسم الكامل
                    </label>
                    <input
                      id="auth-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: محمد بن عبدالله"
                      className="w-full h-12 bg-surface-container-low/70 border border-surface-variant/80 hover:border-secondary/40 rounded-xl px-4 font-body-md text-[14px] text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="auth-city"
                      className="block font-label-md text-[13px] font-semibold text-on-surface"
                    >
                      المدينة / المحافظة
                    </label>
                    <select
                      id="auth-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-12 bg-surface-container-low/70 border border-surface-variant/80 hover:border-secondary/40 rounded-xl px-3 font-body-md text-[14px] text-on-surface focus:bg-surface-container-lowest focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all cursor-pointer"
                    >
                      {SYRIAN_GOVERNORATES.map((gov) => (
                        <option key={gov.key} value={gov.label}>
                          {gov.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="auth-phone"
                      className="block font-label-md text-[13px] font-semibold text-on-surface"
                    >
                      رقم الجوال (اختياري)
                    </label>
                    <input
                      id="auth-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09XXXXXXXX"
                      className="w-full h-12 bg-surface-container-low/70 border border-surface-variant/80 hover:border-secondary/40 rounded-xl px-4 font-numeral-md text-[14px] text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Identity / Email Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="auth-identifier"
                    className="font-label-md text-[13px] font-semibold text-on-surface"
                  >
                    رقم الهوية الوطنية أو البريد الإلكتروني
                  </label>
                  <span className="font-label-sm text-[11px] font-semibold text-secondary bg-secondary/10 px-2 py-0.5 rounded-md">
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
                    className="w-full h-12 bg-surface-container-low/70 border border-surface-variant/80 hover:border-secondary/40 rounded-xl pr-4 pl-11 font-body-md text-[14px] text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline">
                    <AppIcon name="person" size={18} />
                  </span>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="auth-password"
                    className="font-label-md text-[13px] font-semibold text-on-surface"
                  >
                    كلمة المرور
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={onOpenSupport}
                      className="font-label-md text-[13px] font-semibold text-secondary hover:text-primary hover:underline transition-colors cursor-pointer"
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
                    className="w-full h-12 bg-surface-container-low/70 border border-surface-variant/80 hover:border-secondary/40 rounded-xl pr-4 pl-11 font-numeral-md text-[14px] text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'عرض كلمة المرور'}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    <AppIcon name="visibility" size={18} />
                  </button>
                </div>
              </div>

              {/* Remember Me & Trust Device */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <label className="flex items-center gap-2 text-[12.5px] text-on-surface-variant cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-4 h-4 accent-secondary rounded cursor-pointer"
                  />
                  <span>تذكرني على هذا الجهاز الموثوق</span>
                </label>

                <div className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
                  <span>اتصال مشفر SSL</span>
                  <AppIcon name="lock" size={13} />
                </div>
              </div>

              {/* Primary Submission Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-13 bg-gradient-to-l from-tertiary-fixed-dim via-tertiary-fixed to-tertiary-fixed-dim hover:brightness-[0.97] active:scale-[0.99] text-on-tertiary-fixed font-title-md text-[17px] font-extrabold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>
                    {authMode === 'login'
                      ? `تسجيل الدخول (${activeRoleInfo.shortLabel})`
                      : `إنشاء حساب (${activeRoleInfo.shortLabel})`}
                  </span>
                  <AppIcon name="arrow_right_alt" size={18} className="rotate-180" />
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
