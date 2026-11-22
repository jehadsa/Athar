import {motion} from 'motion/react';
import {AppIcon} from './AppIcon';

export function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      badgeClass: 'bg-primary-fixed text-primary',
      topIcon: 'upload_file',
      topIconClass: 'text-secondary',
      title: 'تقديم الطلب والتقارير',
      description:
        'يقوم المريض أو وليه برفع التقارير الطبية، الهوية، والتقرير الاجتماعي عبر بوابة المستفيد المشفرة.',
      footerIcon: 'verified',
      footerText: 'تحقق آلي موثق',
    },
    {
      num: '02',
      badgeClass: 'bg-secondary-fixed text-on-secondary-fixed-variant',
      topIcon: 'biotech',
      topIconClass: 'text-secondary',
      title: 'التدقيق الطبي والاجتماعي',
      description:
        'لجنة طبية استشارية مستقلة تراجع أهلية الحالة وخطة العلاج، بالتوازي مع بحث الحالة المالية للأسرة.',
      footerIcon: 'health_and_safety',
      footerText: 'اعتماد استشاري معتمد',
    },
    {
      num: '03',
      badgeClass: 'bg-tertiary-fixed text-tertiary',
      topIcon: 'campaign',
      topIconClass: 'text-secondary',
      title: 'إطلاق الحملة الموثقة',
      description:
        'نشر الحالة على المنصة برقم ترخيص رسمي، مع كشف دقيق للتكلفة الفعلية المقدرة من المستشفى.',
      footerIcon: 'visibility',
      footerText: 'شفافية التكاليف 100%',
    },
    {
      num: '04',
      badgeClass: 'bg-primary-container text-on-primary',
      topIcon: 'task_alt',
      topIconClass: 'text-secondary',
      title: 'السداد المباشر والشفاء',
      description:
        'تحويل المبالغ مباشرة لحساب المستشفى المنفذ لإجراء العملية، وتزويد المتبرعين بتقرير الشفاء النهائي.',
      footerIcon: 'receipt_long',
      footerText: 'سند إلكتروني + تقرير أثر',
    },
  ];

  return (
    <section
      id="how-it-works-section"
      className="w-full bg-surface-container-low py-space-xl overflow-hidden"
    >
      <div className="w-full max-w-[1280px] mx-auto px-margin-sm md:px-margin">
        <motion.div
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.15}}
          transition={{duration: 0.75, ease: [0.16, 1, 0.3, 1]}}
          className="text-center max-w-3xl mx-auto mb-space-xl"
        >
          <span className="font-label-md text-label-md text-secondary font-semibold uppercase tracking-wider">
            نموذج الحوكمة المبتكر
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary mt-space-xs">
            كيف تصنع تبرعاتكم الشفاء في أثر؟
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs">
            دورة حياة دقيقة تبدأ من الملف السريري للمريض وتنتهي بإذن الله بتقرير الشفاء، مع انعدام
            الوسطاء الماليين تماماً.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md relative">
          {/* Desktop Animated Timeline Connector */}
          <motion.div
            aria-hidden="true"
            initial={{scaleX: 0}}
            whileInView={{scaleX: 1}}
            viewport={{once: true, amount: 0.2}}
            transition={{duration: 1.15, delay: 0.15, ease: [0.16, 1, 0.3, 1]}}
            style={{transformOrigin: '100% 50%'}}
            className="hidden lg:block absolute top-11 right-12 left-12 h-[2px] bg-gradient-to-l from-primary/25 via-secondary/45 to-tertiary-fixed-dim/55 pointer-events-none"
          />

          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{opacity: 0, y: 22, x: 10, scale: 0.985}}
              whileInView={{opacity: 1, y: 0, x: 0, scale: 1}}
              viewport={{once: true, amount: 0.12}}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{y: -4, transition: {duration: 0.3, ease: [0.16, 1, 0.3, 1]}}}
              className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm relative z-10 flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <motion.span
                    initial={{scale: 0.85}}
                    whileInView={{scale: 1}}
                    viewport={{once: true, amount: 0.12}}
                    transition={{
                      duration: 0.65,
                      delay: index * 0.1 + 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`w-10 h-10 rounded-full ${step.badgeClass} font-numeral-lg text-numeral-lg font-bold flex items-center justify-center`}
                  >
                    {step.num}
                  </motion.span>
                  <AppIcon name={step.topIcon} size={26} className={step.topIconClass} />
                </div>
                <h3 className="font-title-md text-title-md text-primary mb-space-xs">
                  {step.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {step.description}
                </p>
              </div>
              <div className="mt-space-md pt-space-xs flex items-center gap-1 text-secondary font-label-sm text-label-sm">
                <AppIcon name={step.footerIcon} size={15} />
                <span>{step.footerText}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
