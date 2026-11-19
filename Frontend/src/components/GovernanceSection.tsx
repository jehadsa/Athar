import {AppIcon} from './AppIcon';

interface GovernanceSectionProps {
  onOpenReportModal: () => void;
}

export function GovernanceSection({onOpenReportModal}: GovernanceSectionProps) {
  return (
    <section
      id="governance-section"
      className="w-full bg-primary text-on-primary py-space-xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-l from-primary-container/40 via-transparent to-transparent pointer-events-none" />
      <div className="w-full max-w-[1280px] mx-auto px-margin-sm md:px-margin relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          {/* Text & Core Pillars */}
          <div className="lg:col-span-7 space-y-space-md text-start">
            <span className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-primary-container text-secondary-fixed font-label-md text-label-md">
              <AppIcon name="gavel" size={16} />
              <span>حوكمة مالية وشرعية صارمة</span>
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-primary">
              نظام القسائم الطبية المباشرة: <br />
              <span className="text-tertiary-fixed">لا تسليم نقدي لأي مستفيد</span>
            </h2>
            <p className="font-body-lg text-body-lg text-primary-fixed">
              التزاماً بأعلى معايير النزاهة وأحكام الشريعة الإسلامية في صرف أموال الزكاة والصدقات،
              صممت منصة &quot;أثر&quot; نظام الصرف المغلق؛ حيث تُحول التبرعات بموجب أوامر صرف مصرفية
              إلكترونية حصراً إلى حساب المنشأة الطبية المرخصة المشرفة على الإجراء.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
              <div className="bg-primary-container/60 p-space-md rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-space-xs text-secondary-fixed mb-1">
                  <AppIcon name="account_balance" size={18} />
                  <span className="font-title-md text-title-md">صفر استقطاع إداري</span>
                </div>
                <p className="font-body-sm text-body-sm text-primary-fixed">
                  تصل تبرعاتكم بنسبة 100% لفاتورة العلاج وتكاليف الأدوية والأجهزة التعويضية دون أي
                  عمولات تشغيلية.
                </p>
              </div>
              <div className="bg-primary-container/60 p-space-md rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-space-xs text-tertiary-fixed mb-1">
                  <AppIcon name="auto_stories" size={18} />
                  <span className="font-title-md text-title-md">فتوى شرعية معتمدة</span>
                </div>
                <p className="font-body-sm text-body-sm text-primary-fixed">
                  مجازة من هيئة الرقابة الشرعية لمصارف الزكاة، كفالة العلاج، وتفريج كربات العاجزين
                  والفقراء.
                </p>
              </div>
            </div>
          </div>

          {/* Cost Breakdown Ledger Graphic */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-lowest text-on-surface rounded-2xl p-space-lg shadow-2xl">
              <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-surface-container">
                <div>
                  <span className="font-label-sm text-label-sm text-secondary font-bold">
                    نموذج الشفافية الحية
                  </span>
                  <h4 className="font-title-md text-title-md text-primary">
                    توزيع تبرعك بالليرة السورية
                  </h4>
                </div>
                <AppIcon name="donut_large" size={26} className="text-secondary" />
              </div>

              <div className="space-y-space-sm font-body-md text-body-md">
                <div className="flex items-center justify-between p-space-xs rounded-lg bg-surface-container-low">
                  <div className="flex items-center gap-space-xs">
                    <div className="w-3 h-3 rounded-full bg-primary shrink-0" />
                    <span>العمليات الجراحية وغرف العمليات</span>
                  </div>
                  <span className="font-numeral-md text-numeral-md font-bold text-primary">60%</span>
                </div>
                <div className="flex items-center justify-between p-space-xs rounded-lg bg-surface-container-low">
                  <div className="flex items-center gap-space-xs">
                    <div className="w-3 h-3 rounded-full bg-secondary shrink-0" />
                    <span>الأجهزة التعويضية والمستلزمات</span>
                  </div>
                  <span className="font-numeral-md text-numeral-md font-bold text-primary">25%</span>
                </div>
                <div className="flex items-center justify-between p-space-xs rounded-lg bg-surface-container-low">
                  <div className="flex items-center gap-space-xs">
                    <div className="w-3 h-3 rounded-full bg-tertiary-fixed-dim shrink-0" />
                    <span>الأدوية والتأهيل بعد الجراحة</span>
                  </div>
                  <span className="font-numeral-md text-numeral-md font-bold text-primary">15%</span>
                </div>
                <div className="flex items-center justify-between p-space-xs rounded-lg bg-secondary-fixed/30 font-bold text-secondary">
                  <div className="flex items-center gap-space-xs">
                    <AppIcon name="verified" size={17} />
                    <span>رسوم إدارية مقتطعة من التبرع</span>
                  </div>
                  <span className="font-numeral-md text-numeral-md">0.0%</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenReportModal}
                className="mt-space-md w-full py-space-sm rounded-xl bg-surface-container-high hover:bg-surface-container text-primary font-title-md text-title-md flex items-center justify-center gap-space-xs transition-colors cursor-pointer"
              >
                <AppIcon name="download" size={18} />
                <span>تحميل تقرير الحوكمة والتدقيق المالي 2024</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
