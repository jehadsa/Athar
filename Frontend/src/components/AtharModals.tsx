import {FormEvent, useEffect, useState} from 'react';
import {MedicalCase, PORTAL_LINKS, PortalRole, SYRIAN_GOVERNORATES} from '../data/atharData';
import {AppIcon} from './AppIcon';
import type {AuthenticatedUser} from './LoginPage';

export interface DonationFlags {
  isSadaqah?: boolean;
  isZakat?: boolean;
}

interface DonationModalProps {
  isOpen: boolean;
  selectedCase: MedicalCase | null;
  allCases: MedicalCase[];
  initialAmount?: number;
  initialFlags?: DonationFlags;
  walletBalance?: number;
  onClose: () => void;
  onCompleteDonation: (
    caseId: string,
    amount: number,
    method: string,
    flags?: DonationFlags,
  ) => void;
}

export function DonationModal({
  isOpen,
  selectedCase,
  allCases,
  initialAmount,
  initialFlags,
  walletBalance,
  onClose,
  onCompleteDonation,
}: DonationModalProps) {
  const activeCases = allCases.filter((c) => c.raised < c.target);
  const targetCase = selectedCase || activeCases[0] || allCases[0];

  const [caseId, setCaseId] = useState<string>(targetCase?.id || '');
  const [amount, setAmount] = useState<number>(initialAmount || 100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('شام كاش');
  const [isSadaqah, setIsSadaqah] = useState<boolean>(Boolean(initialFlags?.isSadaqah));
  const [isZakat, setIsZakat] = useState<boolean>(Boolean(initialFlags?.isZakat));
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [receiptCode, setReceiptCode] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setCaseId((selectedCase || activeCases[0] || allCases[0])?.id || '');
      setAmount(initialAmount || (selectedCase?.presets?.[1] ?? 100000));
      setCustomAmount('');
      setReceiptCode(null);
      setPaymentError('');
      setIsSadaqah(Boolean(initialFlags?.isSadaqah));
      setIsZakat(Boolean(initialFlags?.isZakat));
    }
  }, [isOpen, selectedCase, initialAmount, initialFlags]);

  if (!isOpen) return null;

  const currentCase =
    allCases.find((c) => c.id === (selectedCase ? selectedCase.id : caseId)) || targetCase;
  const finalAmount = customAmount ? Number(customAmount) : amount;
  const presets = currentCase?.presets || [50000, 100000, 500000];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!currentCase || !finalAmount || finalAmount <= 0) return;
    if (
      paymentMethod === 'محفظة الأثر' &&
      typeof walletBalance === 'number' &&
      finalAmount > walletBalance
    ) {
      setPaymentError(
        `رصيد محفظة الأثر الحالي (${walletBalance.toLocaleString('en-US')} ل.س) غير كافٍ لهذا المبلغ.`,
      );
      return;
    }
    setPaymentError('');
    onCompleteDonation(currentCase.id, finalAmount, paymentMethod, {isSadaqah, isZakat});
    const randomNum = Math.floor(100000 + Math.random() * 899999);
    setReceiptCode(`ATH-REC-${randomNum}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-sm flex items-center justify-center p-space-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg p-space-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={() => {
            setReceiptCode(null);
            onClose();
          }}
          aria-label="إغلاق"
          className="absolute top-space-md left-space-md w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer"
        >
          <AppIcon name="close" size={18} />
        </button>

        {receiptCode ? (
          <div className="text-center py-space-md space-y-space-md">
            <div className="w-16 h-16 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center mx-auto">
              <AppIcon name="verified" size={34} />
            </div>
            <h3 className="font-headline-md text-headline-md text-primary">
              تم استلام تبرعكم بنجاح
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              جزاكم الله خيراً. تم تحويل مبلغ{' '}
              <span className="font-numeral-md font-bold text-primary">
                {finalAmount.toLocaleString('en-US')} ل.س
              </span>{' '}
              مباشرة لصالح الحالة <span className="font-bold">{currentCase?.code}</span> عبر{' '}
              {paymentMethod}.
            </p>
            <div className="bg-surface-container-low rounded-xl p-space-md text-start space-y-1 font-body-sm text-body-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">رقم السند الإلكتروني:</span>
                <span className="font-numeral-md font-bold text-primary">{receiptCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">الجهة المستفيدة:</span>
                <span className="font-bold text-primary">{currentCase?.hospital}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">الرسوم الإدارية:</span>
                <span className="font-bold text-secondary">0.0% (وصول كامل للمستشفى)</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setReceiptCode(null);
                onClose();
              }}
              className="w-full py-space-sm rounded-xl bg-primary text-on-primary font-title-md text-title-md hover:bg-primary-container transition-colors cursor-pointer"
            >
              العودة للمنصة
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-space-md">
            <div>
              <span className="font-label-sm text-label-sm text-secondary font-bold">
                تحويل مباشر للمستشفى — 0% استقطاع
              </span>
              <h3 className="font-headline-sm text-headline-sm text-primary mt-1">
                تبرع إلكتروني آمن
              </h3>
            </div>

            {!selectedCase && (
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant block">
                  اختر الحالة الطبية
                </label>
                <select
                  value={currentCase?.id || ''}
                  onChange={(e) => setCaseId(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl px-space-sm py-space-sm font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
                >
                  {activeCases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {currentCase && (
              <div className="bg-surface-container-low rounded-xl p-space-sm">
                <div className="flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant mb-1">
                  <span>{currentCase.hospital}</span>
                  <span className="font-numeral-md text-primary font-bold">{currentCase.code}</span>
                </div>
                <p className="font-title-md text-title-md text-primary">{currentCase.title}</p>
                <p className="font-body-sm text-body-sm text-secondary mt-1">
                  المبلغ المتبقي لاكتمال الحالة:{' '}
                  <span className="font-numeral-md font-bold">
                    {Math.max(0, currentCase.target - currentCase.raised).toLocaleString('en-US')} ل.س
                  </span>
                </p>
              </div>
            )}

            <div className="space-y-space-xs">
              <label className="font-label-md text-label-md text-on-surface-variant block">
                مبلغ التبرع (ليرة سورية)
              </label>
              <div className="grid grid-cols-3 gap-space-xs">
                {presets.map((p) => {
                  const active = !customAmount && amount === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setAmount(p);
                        setCustomAmount('');
                      }}
                      className={`py-space-sm rounded-xl font-numeral-md text-numeral-md font-bold transition-all cursor-pointer ${
                        active
                          ? 'bg-secondary text-on-secondary shadow-sm'
                          : 'bg-surface-container-low text-primary hover:bg-secondary-fixed/40'
                      }`}
                    >
                      {p.toLocaleString('en-US')} ل.س
                    </button>
                  );
                })}
              </div>
              <input
                type="number"
                min={1000}
                placeholder="أو أدخل مبلغاً آخر (ل.س)..."
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full mt-space-xs bg-surface-container-low rounded-xl px-space-sm py-space-sm font-numeral-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>

            <div className="space-y-space-xs">
              <label className="font-label-md text-label-md text-on-surface-variant block">
                وسيلة الدفع المعتمدة
              </label>
              <div
                className={`grid grid-cols-2 ${
                  typeof walletBalance === 'number' ? 'sm:grid-cols-5' : 'sm:grid-cols-4'
                } gap-space-xs`}
              >
                {[
                  ...(typeof walletBalance === 'number' ? ['محفظة الأثر'] : []),
                  'شام كاش',
                  'سيريتل كاش',
                  'MTN كاش',
                  'حوالة بنكية',
                ].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(method);
                      setPaymentError('');
                    }}
                    className={`py-space-xs px-1.5 rounded-xl font-body-sm text-[12px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      paymentMethod === method
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
              {typeof walletBalance === 'number' && paymentMethod === 'محفظة الأثر' && (
                <p className="font-body-sm text-[12px] text-secondary font-semibold pt-0.5">
                  الرصيد المتاح في المحفظة: {walletBalance.toLocaleString('en-US')} ل.س
                </p>
              )}
              {paymentError && (
                <p className="font-body-sm text-[12px] text-error font-semibold">{paymentError}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-0.5 text-[12.5px] text-on-surface-variant">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isSadaqah}
                  onChange={(e) => setIsSadaqah(e.target.checked)}
                  className="w-4 h-4 accent-secondary rounded cursor-pointer"
                />
                <span>صدقة جارية / عن الغير</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isZakat}
                  onChange={(e) => setIsZakat(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
                <span>احتساب من الزكاة</span>
              </label>
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant block">
                رقم الجوال لإرسال السند وتقرير الأثر (اختياري)
              </label>
              <input
                type="tel"
                placeholder="09XXXXXXXX"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                className="w-full bg-surface-container-low rounded-xl px-space-sm py-space-xs font-numeral-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-tertiary-fixed text-tertiary font-title-md text-title-md hover:bg-tertiary-fixed-dim shadow-md flex items-center justify-center gap-space-xs transition-all cursor-pointer"
            >
              <AppIcon name="favorite" size={18} />
              <span>إتمام التبرع بمبلغ {(finalAmount || 0).toLocaleString('en-US')} ل.س</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

interface ApplyCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyCaseModal({isOpen, onClose}: ApplyCaseModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('جراحة وزراعة القلب');
  const [region, setRegion] = useState('دمشق');
  const [notes, setNotes] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmittedRef(`REQ-${Math.floor(10000 + Math.random() * 89999)}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-sm flex items-center justify-center p-space-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg p-space-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={() => {
            setSubmittedRef(null);
            onClose();
          }}
          aria-label="إغلاق"
          className="absolute top-space-md left-space-md w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer"
        >
          <AppIcon name="close" size={18} />
        </button>

        {submittedRef ? (
          <div className="text-center py-space-md space-y-space-md">
            <div className="w-16 h-16 rounded-full bg-primary-fixed text-primary flex items-center justify-center mx-auto">
              <AppIcon name="task_alt" size={32} />
            </div>
            <h3 className="font-headline-md text-headline-md text-primary">
              تم تسجيل طلب المساندة العلاجية
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              سيتم مراجعة الملف الطبي والاجتماعي من قبل اللجنة الاستشارية خلال 24 ساعة عمل. رقم
              متابعة الطلب: <span className="font-numeral-md font-bold text-primary">{submittedRef}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmittedRef(null);
                onClose();
              }}
              className="w-full py-space-sm rounded-xl bg-primary text-on-primary font-title-md text-title-md hover:bg-primary-container transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-space-md">
            <div>
              <span className="font-label-sm text-label-sm text-secondary font-bold">
                بوابة المستفيد المشفرة — تحقق موثق
              </span>
              <h3 className="font-headline-sm text-headline-sm text-primary mt-1">
                تقديم طلب مساعدة علاجية
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                  اسم المريض أو ولي الأمر
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="الاسم الثلاثي"
                  className="w-full bg-surface-container-low rounded-xl px-space-sm py-space-xs font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
                />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                  رقم الجوال للتواصل
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09XXXXXXXX"
                  className="w-full bg-surface-container-low rounded-xl px-space-sm py-space-xs font-numeral-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                  التخصص الطبي
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl px-space-sm py-space-xs font-body-md text-body-md text-on-surface focus:outline-none"
                >
                  <option>جراحة وزراعة القلب</option>
                  <option>علاج الأورام والكيماوي</option>
                  <option>غسيل ورعاية الفشل الكلوي</option>
                  <option>جراحة العيون والشبكية</option>
                  <option>جراحات الأطفال الدقيقة</option>
                </select>
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                  المحافظة
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl px-space-sm py-space-xs font-body-md text-body-md text-on-surface focus:outline-none"
                >
                  {SYRIAN_GOVERNORATES.map((gov) => (
                    <option key={gov.key} value={gov.label}>
                      {gov.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                ملخص الحالة الطبية والمستشفى المعالج
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="اذكر التشخيص الطبي واسم المستشفى وتقدير التكلفة إن وجد..."
                className="w-full bg-surface-container-low rounded-xl px-space-sm py-space-xs font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-secondary text-on-secondary font-title-md text-title-md hover:bg-on-secondary-container transition-colors cursor-pointer"
            >
              إرسال الطلب للمراجعة الطبية
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

interface UtilityModalProps {
  modalType: 'login' | 'report' | 'privacy' | 'support' | 'portal' | null;
  activePortal: PortalRole;
  currentUser?: AuthenticatedUser | null;
  onUpdateUser?: (user: AuthenticatedUser) => void;
  onOpenDonorPortal?: () => void;
  onLogout?: () => void;
  onGoToLogin?: () => void;
  onClose: () => void;
}

const ROLE_LABELS: Record<AuthenticatedUser['role'], string> = {
  donor: 'المتبرع',
  patient: 'المريض',
  hospital: 'المستشفى الشريك',
  charity: 'الجمعية الخيرية',
  admin: 'الإشراف والحوكمة',
};

export function UtilityModal({
  modalType,
  activePortal,
  currentUser,
  onUpdateUser,
  onOpenDonorPortal,
  onLogout,
  onGoToLogin,
  onClose,
}: UtilityModalProps) {
  const [nationalId, setNationalId] = useState('');
  const [loginSent, setLoginSent] = useState(false);

  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editName, setEditName] = useState('');
  const [editIdentifier, setEditIdentifier] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('');
  const [accountError, setAccountError] = useState('');
  const [accountSavedMsg, setAccountSavedMsg] = useState(false);

  useEffect(() => {
    if (modalType === 'login' && currentUser) {
      setEditName(currentUser.name || '');
      setEditIdentifier(currentUser.identifier || '');
      setEditEmail(currentUser.email || '');
      setEditPhone(currentUser.phone || '');
      setEditCity(currentUser.city || 'دمشق');
      setAccountError('');
    }
    if (modalType !== 'login') {
      setIsEditingAccount(false);
      setAccountSavedMsg(false);
      setAccountError('');
    }
  }, [modalType, currentUser]);

  if (!modalType) return null;

  const portalInfo = PORTAL_LINKS.find((p) => p.key === activePortal);

  const handleSaveAccount = (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser || !onUpdateUser) return;
    if (!editName.trim()) {
      setAccountError('يرجى إدخال الاسم الكامل.');
      return;
    }
    if (!editIdentifier.trim()) {
      setAccountError('يرجى إدخال رقم الهوية أو المعرّف.');
      return;
    }
    setAccountError('');
    onUpdateUser({
      ...currentUser,
      name: editName.trim(),
      identifier: editIdentifier.trim(),
      email: editEmail.trim() || undefined,
      phone: editPhone.trim() || undefined,
      city: editCity.trim() || undefined,
    });
    setIsEditingAccount(false);
    setAccountSavedMsg(true);
  };

  const handleDownloadReport = () => {
    const reportText = [
      'تقرير الحوكمة والتدقيق المالي السنوي 2024 - منصة أثر الطبية',
      '======================================================',
      'إجمالي التبرعات الموجهة للمستشفيات: 4,825,900,000 ل.س',
      'العمليات الجراحية المنجزة: 1,842 عملية (نسبة النجاح 98.4%)',
      'توزيع التبرع بالليرة السورية:',
      '- 60% العمليات الجراحية وغرف العمليات',
      '- 25% الأجهزة التعويضية والمستلزمات',
      '- 15% الأدوية والتأهيل بعد الجراحة',
      '- 0.0% رسوم إدارية مقتطعة من التبرع',
    ].join('\n');

    const blob = new Blob([reportText], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'athar-governance-report-2024.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-sm flex items-center justify-center p-space-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg p-space-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={() => {
            setLoginSent(false);
            setIsEditingAccount(false);
            setAccountSavedMsg(false);
            onClose();
          }}
          aria-label="إغلاق"
          className="absolute top-space-md left-space-md w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer"
        >
          <AppIcon name="close" size={18} />
        </button>

        {modalType === 'login' && (
          <div className="space-y-space-md">
            {currentUser ? (
              <>
                {/* Account Header */}
                <div className="flex items-center gap-space-sm pl-10">
                  <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                    <AppIcon name="verified_user" size={24} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-headline-sm text-headline-sm text-primary truncate">
                        {currentUser.name}
                      </h3>
                      <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {ROLE_LABELS[currentUser.role]}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      معلومات الحساب الشخصي الموثق
                    </p>
                  </div>
                </div>

                {accountSavedMsg && !isEditingAccount && (
                  <div className="bg-secondary/10 border border-secondary/20 text-secondary rounded-xl px-4 py-2.5 text-[13px] font-bold flex items-center gap-2">
                    <AppIcon name="check_circle" size={18} />
                    <span>تم حفظ تعديلات معلومات الحساب بنجاح</span>
                  </div>
                )}

                {isEditingAccount ? (
                  <form onSubmit={handleSaveAccount} className="space-y-3">
                    {accountError && (
                      <div className="bg-error-container text-on-error-container rounded-xl px-3.5 py-2 text-[12.5px] font-semibold flex items-center gap-2">
                        <AppIcon name="emergency" size={16} />
                        <span>{accountError}</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label
                        htmlFor="account-edit-name"
                        className="font-label-sm text-label-sm text-on-surface block"
                      >
                        الاسم الكامل
                      </label>
                      <input
                        id="account-edit-name"
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full h-11 bg-surface-container-low border border-surface-variant/70 rounded-xl px-3.5 font-body-md text-[14px] text-on-surface focus:bg-surface-container-lowest focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/25"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label
                          htmlFor="account-edit-id"
                          className="font-label-sm text-label-sm text-on-surface block"
                        >
                          رقم الهوية / المعرّف
                        </label>
                        <input
                          id="account-edit-id"
                          type="text"
                          value={editIdentifier}
                          onChange={(e) => setEditIdentifier(e.target.value)}
                          className="w-full h-11 bg-surface-container-low border border-surface-variant/70 rounded-xl px-3.5 font-numeral-md text-[14px] text-on-surface focus:bg-surface-container-lowest focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/25"
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="account-edit-phone"
                          className="font-label-sm text-label-sm text-on-surface block"
                        >
                          رقم الجوال
                        </label>
                        <input
                          id="account-edit-phone"
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="09XXXXXXXX"
                          className="w-full h-11 bg-surface-container-low border border-surface-variant/70 rounded-xl px-3.5 font-numeral-md text-[14px] text-on-surface focus:bg-surface-container-lowest focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/25"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label
                          htmlFor="account-edit-email"
                          className="font-label-sm text-label-sm text-on-surface block"
                        >
                          البريد الإلكتروني
                        </label>
                        <input
                          id="account-edit-email"
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full h-11 bg-surface-container-low border border-surface-variant/70 rounded-xl px-3.5 font-body-md text-[14px] text-on-surface focus:bg-surface-container-lowest focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/25"
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="account-edit-city"
                          className="font-label-sm text-label-sm text-on-surface block"
                        >
                          المدينة / المحافظة
                        </label>
                        <select
                          id="account-edit-city"
                          value={editCity}
                          onChange={(e) => setEditCity(e.target.value)}
                          className="w-full h-11 bg-surface-container-low border border-surface-variant/70 rounded-xl px-3 font-body-md text-[14px] text-on-surface focus:bg-surface-container-lowest focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/25 cursor-pointer"
                        >
                          {SYRIAN_GOVERNORATES.map((gov) => (
                            <option key={gov.key} value={gov.label}>
                              {gov.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="submit"
                        className="flex-1 h-11 rounded-xl bg-tertiary-fixed-dim hover:bg-tertiary-fixed text-on-tertiary-fixed font-title-md text-[15px] font-bold transition-colors cursor-pointer"
                      >
                        حفظ التعديلات
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingAccount(false);
                          setAccountError('');
                          setEditName(currentUser.name || '');
                          setEditIdentifier(currentUser.identifier || '');
                          setEditEmail(currentUser.email || '');
                          setEditPhone(currentUser.phone || '');
                          setEditCity(currentUser.city || 'دمشق');
                        }}
                        className="px-5 h-11 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-title-md text-[15px] transition-colors cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="bg-surface-container-low rounded-xl p-space-md space-y-3 font-body-sm text-[13px]">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-surface-variant/60">
                        <span className="text-on-surface-variant">الاسم الكامل</span>
                        <span className="font-bold text-primary">{currentUser.name}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-surface-variant/60">
                        <span className="text-on-surface-variant">رقم الهوية / المعرّف</span>
                        <span className="font-numeral-md text-[13px] font-bold text-primary">
                          {currentUser.identifier}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-surface-variant/60">
                        <span className="text-on-surface-variant">البريد الإلكتروني</span>
                        <span className="font-medium text-on-surface">
                          {currentUser.email || 'غير محدد'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-surface-variant/60">
                        <span className="text-on-surface-variant">رقم الجوال</span>
                        <span className="font-numeral-md text-[13px] font-medium text-on-surface">
                          {currentUser.phone || 'غير محدد'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-surface-variant/60">
                        <span className="text-on-surface-variant">المدينة / المحافظة</span>
                        <span className="font-medium text-on-surface">
                          {currentUser.city || 'دمشق'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-on-surface-variant">حالة الحساب</span>
                        <span className="font-bold text-secondary">موثق ونشط</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {onUpdateUser && (
                        <button
                          type="button"
                          onClick={() => {
                            setAccountSavedMsg(false);
                            setIsEditingAccount(true);
                          }}
                          className="w-full h-11 rounded-xl bg-tertiary-fixed hover:bg-tertiary-fixed-dim text-on-tertiary-fixed font-title-md text-[15px] font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>تعديل معلومات الحساب</span>
                        </button>
                      )}
                      {onOpenDonorPortal && currentUser.role === 'donor' && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenDonorPortal();
                          }}
                          className="w-full h-11 rounded-xl bg-secondary text-on-secondary font-title-md text-[15px] font-bold hover:bg-on-secondary-container transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <AppIcon name="dashboard" size={18} />
                          <span>فتح بوابة المتبرع ولوحة الأثر</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={onClose}
                        className="w-full h-11 rounded-xl bg-primary text-on-primary font-title-md text-[15px] hover:bg-primary-container transition-colors cursor-pointer"
                      >
                        متابعة التصفح
                      </button>
                      {onLogout && (
                        <button
                          type="button"
                          onClick={() => {
                            setLoginSent(false);
                            onLogout();
                          }}
                          className="w-full h-11 rounded-xl bg-surface-container-low text-error font-title-md text-[15px] hover:bg-error-container/60 transition-colors cursor-pointer"
                        >
                          تسجيل الخروج / تبديل الحساب
                        </button>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-space-sm">
                  <div className="w-11 h-11 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
                    <AppIcon name="verified_user" size={24} />
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">
                      أنت تتصفح كزائر
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      سجّل دخولك لمتابعة تبرعاتك وتعديل بيانات حسابك
                    </p>
                  </div>
                </div>

                {loginSent ? (
                  <div className="bg-surface-container-low rounded-xl p-space-md text-center space-y-space-xs">
                    <div className="flex justify-center text-secondary">
                      <AppIcon name="phonelink_lock" size={32} />
                    </div>
                    <p className="font-title-md text-title-md text-primary">
                      تم إرسال رمز التحقق إلى جوالك
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      الرجاء إدخال رمز التأكيد <span className="font-numeral-md font-bold text-primary">42</span>{' '}
                      المرسل عبر رسالة نصية لإكمال الدخول.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-space-sm">
                    {onGoToLogin && (
                      <button
                        type="button"
                        onClick={() => {
                          setLoginSent(false);
                          onGoToLogin();
                        }}
                        className="w-full h-11 rounded-xl bg-tertiary-fixed text-tertiary font-title-md text-title-md hover:bg-tertiary-fixed-dim transition-colors cursor-pointer"
                      >
                        فتح صفحة تسجيل الدخول الموحد
                      </button>
                    )}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (nationalId.trim()) setLoginSent(true);
                      }}
                      className="space-y-space-sm pt-2 border-t border-surface-container"
                    >
                      <label className="font-label-sm text-label-sm text-on-surface-variant block">
                        أو التحقق السريع عبر الرقم الوطني السوري
                      </label>
                      <input
                        required
                        type="text"
                        maxLength={11}
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                        placeholder="010XXXXXXXX"
                        className="w-full bg-surface-container-low rounded-xl px-space-sm py-space-sm font-numeral-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
                      />
                      <button
                        type="submit"
                        className="w-full h-11 rounded-xl bg-primary text-on-primary font-title-md text-title-md hover:bg-primary-container transition-colors cursor-pointer"
                      >
                        متابعة التحقق
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {modalType === 'report' && (
          <div className="space-y-space-md">
            <h3 className="font-headline-sm text-headline-sm text-primary">
              تقرير الحوكمة والتدقيق المالي 2024
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              تخضع كافة العمليات المالية في منصة أثر لتدقيق محاسبي مستقل وإشراف شرعي يضمن وصول
              100% من التبرعات مباشرة لحسابات المستشفيات الشريكة في سوريا.
            </p>
            <div className="bg-surface-container-low rounded-xl p-space-md space-y-2 font-body-sm text-body-sm">
              <div className="flex justify-between">
                <span>مجموع المنصرف العلاجي:</span>
                <span className="font-numeral-md font-bold text-primary">4,825,900,000 ل.س</span>
              </div>
              <div className="flex justify-between">
                <span>الحالات المكتملة والمغلقة:</span>
                <span className="font-numeral-md font-bold text-primary">1,842 حالة</span>
              </div>
              <div className="flex justify-between">
                <span>نسبة الاستقطاع الإداري:</span>
                <span className="font-numeral-md font-bold text-secondary">0.0%</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownloadReport}
              className="w-full h-11 rounded-xl bg-tertiary-fixed text-tertiary font-title-md text-title-md hover:bg-tertiary-fixed-dim flex items-center justify-center gap-space-xs transition-colors cursor-pointer"
            >
              <AppIcon name="download" size={18} />
              <span>تنزيل نسخة التقرير المالي</span>
            </button>
          </div>
        )}

        {modalType === 'portal' && portalInfo && (
          <div className="space-y-space-md">
            <span className="font-label-sm text-label-sm text-secondary font-bold">
              معاينة البوابة المختارة
            </span>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              بوابة {portalInfo.label}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {portalInfo.description}
            </p>
            <div className="bg-surface-container-low rounded-xl p-space-sm font-body-sm text-body-sm text-primary">
              أنت الآن في وضع المعاينة السريعة لبوابة <strong>{portalInfo.label}</strong>. جميع
              الإحصاءات والتدقيقات مرتبطة بالمنظومة الموحدة للمستشفيات.
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full h-11 rounded-xl bg-primary text-on-primary font-title-md text-title-md hover:bg-primary-container transition-colors cursor-pointer"
            >
              متابعة التصفح
            </button>
          </div>
        )}

        {(modalType === 'privacy' || modalType === 'support') && (
          <div className="space-y-space-md">
            <h3 className="font-headline-sm text-headline-sm text-primary">
              {modalType === 'privacy'
                ? 'سياسة الخصوصية وحوكمة التبرعات'
                : 'الدعم والمساعدة الطارئة'}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {modalType === 'privacy'
                ? 'تلتزم منصة أثر بحماية خصوصية المرضى والمتبرعين وفق المعايير المعتمدة في الجمهورية العربية السورية، ولا يتم نشر أي بيانات تعريفية للمريض.'
                : 'للحالات الحرجة والاستفسارات العاجلة، فريق الطوارئ الطبية متاح على مدار الساعة عبر الرقم +963 11 000 0000.'}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full h-11 rounded-xl bg-primary text-on-primary font-title-md text-title-md hover:bg-primary-container transition-colors cursor-pointer"
            >
              حسناً
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
