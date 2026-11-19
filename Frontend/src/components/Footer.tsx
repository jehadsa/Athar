import {ATHAR_LOGO_URL, PortalRole} from '../data/atharData';
import {AppIcon} from './AppIcon';

interface FooterProps {
  onSelectPortal: (portal: PortalRole) => void;
  onOpenReportModal: () => void;
  onNavigateHowItWorks: () => void;
  onOpenInfoModal: (topic: 'privacy' | 'support') => void;
}

export function Footer({
  onSelectPortal,
  onOpenReportModal,
  onNavigateHowItWorks,
  onOpenInfoModal,
}: FooterProps) {
  return (
    <footer
      id="footer-section"
      className="w-full bg-gradient-to-b from-[#002e4b] via-primary to-[#001d32] text-on-primary relative overflow-hidden"
    >
      {/* Top Golden-Teal Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-l from-secondary-fixed via-tertiary-fixed-dim to-secondary" />

      {/* Subtle Ambient Geometric Accents */}
      <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-tertiary-fixed-dim/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1280px] mx-auto px-margin-sm md:px-margin pt-space-xl pb-space-lg relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-lg pb-space-xl">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="bg-surface-container-lowest rounded-xl p-2 shadow-md shrink-0">
                <img
                  src={ATHAR_LOGO_URL}
                  alt="شعار منصة أثر"
                  className="h-9 w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-headline-sm text-headline-sm text-on-primary font-extrabold block leading-none">
                  منصة أثر الخيرية
                </span>
                <span className="font-label-sm text-[11px] text-secondary-fixed font-semibold mt-1 block">
                  للعطاء الصحي الموثق في سوريا
                </span>
              </div>
            </div>

            <p className="font-body-md text-[13.5px] leading-relaxed text-primary-fixed/90">
              منصة سورية موثوقة للتمويل الجماعي الطبي وإعانة المرضى غير القادرين في جميع المحافظات
              السورية، تحت إشراف الجمعيات الخيرية والمشافي المعتمدة.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-secondary-fixed/25 text-secondary-fixed font-label-sm text-[11px] font-semibold">
                <AppIcon name="verified_user" size={14} />
                <span>متوافق مع الضوابط الشرعية</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenInfoModal('support')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-tertiary-fixed font-numeral-md text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <AppIcon name="phone_in_talk" size={13} />
                <span>+963 11 000 0000</span>
              </button>
            </div>
          </div>

          {/* Portals Column */}
          <div className="lg:col-span-2">
            <h4 className="font-title-md text-[16px] font-bold text-tertiary-fixed mb-space-md">
              بوابات المنصة
            </h4>
            <ul className="space-y-2.5 font-body-md text-[13.5px] text-primary-fixed/85">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPortal('patient-portal')}
                  className="hover:text-secondary-fixed transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed/70" />
                  <span>بوابة المريض</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPortal('donor-portal')}
                  className="hover:text-secondary-fixed transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed/70" />
                  <span>لوحة المتبرع وشهادات الأثر</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPortal('hospital-portal')}
                  className="hover:text-secondary-fixed transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed/70" />
                  <span>بوابة المستشفيات والكوادر</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPortal('charity-portal')}
                  className="hover:text-secondary-fixed transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed/70" />
                  <span>بوابة الجمعيات الشريكة</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Governance Column */}
          <div className="lg:col-span-3">
            <h4 className="font-title-md text-[16px] font-bold text-tertiary-fixed mb-space-md">
              الشفافية والحوكمة
            </h4>
            <ul className="space-y-2.5 font-body-md text-[13.5px] text-primary-fixed/85">
              <li>
                <button
                  type="button"
                  onClick={onOpenReportModal}
                  className="hover:text-secondary-fixed transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <AppIcon name="receipt_long" size={15} className="text-secondary-fixed" />
                  <span>التقارير المالية والتدقيق</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateHowItWorks}
                  className="hover:text-secondary-fixed transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <AppIcon name="fact_check" size={15} className="text-secondary-fixed" />
                  <span>آلية التحقق من الحالات</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('privacy')}
                  className="hover:text-secondary-fixed transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <AppIcon name="lock" size={15} className="text-secondary-fixed" />
                  <span>الشروط والأحكام والخصوصية</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('support')}
                  className="hover:text-secondary-fixed transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <AppIcon name="health_and_safety" size={15} className="text-secondary-fixed" />
                  <span>الدعم والمساعدة الطارئة</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Payment Methods Card */}
          <div className="lg:col-span-3">
            <div className="bg-white/[0.07] border border-white/12 rounded-2xl p-space-md space-y-3 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-title-md text-[15px] font-bold text-on-primary">
                  طرق الدفع والتبرع الآمن
                </h4>
                <AppIcon name="lock" size={16} className="text-secondary-fixed" />
              </div>

              <p className="font-body-sm text-[12px] leading-relaxed text-primary-fixed/85">
                وسائل دفع وتحويل محلية معتمدة لضمان وصول 100% من تبرعك للمشفى دون أي اقتطاع.
              </p>

              <div className="grid grid-cols-2 gap-2 font-body-sm text-[12px] font-bold">
                <span className="px-2.5 py-2 rounded-xl bg-white/10 border border-white/10 text-center text-on-primary">
                  شام كاش
                </span>
                <span className="px-2.5 py-2 rounded-xl bg-white/10 border border-white/10 text-center text-on-primary">
                  سيريتل كاش
                </span>
                <span className="px-2.5 py-2 rounded-xl bg-white/10 border border-white/10 text-center text-on-primary">
                  MTN كاش
                </span>
                <span className="px-2.5 py-2 rounded-xl bg-white/10 border border-white/10 text-center text-on-primary">
                  حوالة بنكية
                </span>
              </div>

              <div className="pt-1 flex items-center gap-1.5 text-[11px] font-semibold text-secondary-fixed">
                <AppIcon name="verified" size={14} />
                <span>سداد مباشر بنسبة 100% بالليرة السورية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Strip */}
        <div className="pt-space-md border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-space-sm font-body-sm text-[12.5px] text-primary-fixed/80">
          <p>جميع الحقوق محفوظة لمنصة أثر الطبية في سوريا © 2025 — مرخصة ومعتمدة</p>
          <div className="flex items-center gap-space-md">
            <button
              type="button"
              onClick={() => onOpenInfoModal('privacy')}
              className="hover:text-tertiary-fixed transition-colors cursor-pointer"
            >
              سياسة الخصوصية
            </button>
            <span className="text-white/25">•</span>
            <button
              type="button"
              onClick={onOpenReportModal}
              className="hover:text-tertiary-fixed transition-colors cursor-pointer"
            >
              حوكمة التبرعات
            </button>
            <span className="text-white/25">•</span>
            <button
              type="button"
              onClick={() => onOpenInfoModal('support')}
              className="hover:text-tertiary-fixed transition-colors cursor-pointer"
            >
              تواصل معنا
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
