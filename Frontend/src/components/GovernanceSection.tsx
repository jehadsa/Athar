import {motion} from 'motion/react';
import {AppIcon} from './AppIcon';

interface GovernanceSectionProps {
  onOpenReportModal: () => void;
}

export function GovernanceSection({onOpenReportModal}: GovernanceSectionProps) {
  const breakdownItems = [
    {
      label: 'العمليات الجراحية وغرف العمليات',
      percent: 60,
      percentLabel: '60%',
      dotClass: 'bg-primary',
      barClass: 'bg-primary',
      isZero: false,
    },
    {
      label: 'الأجهزة التعويضية والمستلزمات',
      percent: 25,
      percentLabel: '25%',
      dotClass: 'bg-secondary',
      barClass: 'bg-secondary',
      isZero: false,
    },
    {
      label: 'الأدوية والتأهيل بعد الجراحة',
      percent: 15,
      percentLabel: '15%',
      dotClass: 'bg-tertiary-fixed-dim',
      barClass: 'bg-tertiary-fixed-dim',
      isZero: false,
    },
    {
      label: 'رسوم إدارية مقتطعة من التبرع',
      percent: 0,
      percentLabel: '0.0%',
      dotClass: 'bg-secondary',
      barClass: 'bg-secondary',
      isZero: true,
    },
  ];

  return (
    <section
      id="governance-section"
      className="w-full bg-primary text-on-primary py-space-xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-l from-primary-container/40 via-transparent to-transparent pointer-events-none" />
      <div className="w-full max-w-[1280px] mx-auto px-margin-sm md:px-margin relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          {/* Text & Core Pillars */}
          <motion.div
            initial={{opacity: 0, x: 20}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true, amount: 0.12}}
            transition={{duration: 0.85, ease: [0.16, 1, 0.3, 1]}}
            className="lg:col-span-7 space-y-space-md text-start"
          >
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
              <motion.div
                initial={{opacity: 0, y: 14}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.15}}
                transition={{duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1]}}
                className="bg-primary-container/60 p-space-md rounded-xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-space-xs text-secondary-fixed mb-1">
                  <AppIcon name="account_balance" size={18} />
                  <span className="font-title-md text-title-md">صفر استقطاع إداري</span>
                </div>
                <p className="font-body-sm text-body-sm text-primary-fixed">
                  تصل تبرعاتكم بنسبة 100% لفاتورة العلاج وتكاليف الأدوية والأجهزة التعويضية دون أي
                  عمولات تشغيلية.
                </p>
              </motion.div>
              <motion.div
                initial={{opacity: 0, y: 14}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, amount: 0.15}}
                transition={{duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1]}}
                className="bg-primary-container/60 p-space-md rounded-xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-space-xs text-tertiary-fixed mb-1">
                  <AppIcon name="auto_stories" size={18} />
                  <span className="font-title-md text-title-md">فتوى شرعية معتمدة</span>
                </div>
                <p className="font-body-sm text-body-sm text-primary-fixed">
                  مجازة من هيئة الرقابة الشرعية لمصارف الزكاة، كفالة العلاج، وتفريج كربات العاجزين
                  والفقراء.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Cost Breakdown Ledger Graphic */}
          <motion.div
            initial={{opacity: 0, x: -20, scale: 0.98}}
            whileInView={{opacity: 1, x: 0, scale: 1}}
            viewport={{once: true, amount: 0.12}}
            transition={{duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1]}}
            className="lg:col-span-5"
          >
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
                {breakdownItems.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{opacity: 0, y: 10}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true, amount: 0.15}}
                    transition={{
                      duration: 0.65,
                      delay: 0.15 + idx * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`p-space-xs rounded-lg ${
                      item.isZero
                        ? 'bg-secondary-fixed/30 font-bold text-secondary flex items-center justify-between'
                        : 'bg-surface-container-low space-y-1.5'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-space-xs">
                        {item.isZero ? (
                          <AppIcon name="verified" size={17} />
                        ) : (
                          <div className={`w-3 h-3 rounded-full ${item.dotClass} shrink-0`} />
                        )}
                        <span>{item.label}</span>
                      </div>
                      <span
                        className={`font-numeral-md text-numeral-md ${
                          item.isZero ? '' : 'font-bold text-primary'
                        }`}
                      >
                        {item.percentLabel}
                      </span>
                    </div>
                    {!item.isZero && (
                      <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                        <motion.div
                          initial={{width: 0}}
                          whileInView={{width: `${item.percent}%`}}
                          viewport={{once: true, amount: 0.2}}
                          transition={{
                            duration: 1.1,
                            delay: 0.2 + idx * 0.1,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className={`h-full rounded-full ${item.barClass}`}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
