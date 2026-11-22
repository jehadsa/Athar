import {animate, motion, useInView} from 'motion/react';
import {useEffect, useRef, useState} from 'react';
import {AppIcon} from './AppIcon';

interface ImpactStatsProps {
  totalDonations: number;
  completedSurgeries: number;
}

function CountUpNumber({value}: {value: number}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, {once: true, amount: 0.5});
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!isInView) return;
    const fromValue = hasAnimatedRef.current ? displayValue : 0;
    hasAnimatedRef.current = true;
    const controls = animate(fromValue, value, {
      duration: 1.65,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return <span ref={ref}>{displayValue.toLocaleString('en-US')}</span>;
}

export function ImpactStats({totalDonations, completedSurgeries}: ImpactStatsProps) {
  const cards = [
    {
      icon: 'payments',
      iconWrapperClass: 'bg-primary-fixed text-primary',
      label: 'إجمالي التبرعات الموجهة',
      value: totalDonations,
      suffix: 'ل.س',
      suffixBold: true,
      footerIcon: 'arrow_circle_up',
      footerText: 'نسبة تحويل 100% مباشرة للعمليات',
    },
    {
      icon: 'medical_services',
      iconWrapperClass: 'bg-secondary-fixed text-on-secondary-fixed-variant',
      label: 'العمليات الجراحية المنجزة',
      value: completedSurgeries,
      suffix: 'عملية ناجحة',
      suffixBold: false,
      footerIcon: 'check_circle',
      footerText: 'بنسبة نجاح طبي بلغت 98.4%',
    },
    {
      icon: 'groups',
      iconWrapperClass: 'bg-tertiary-fixed text-tertiary',
      label: 'المرضى المستفيدون وأسرهم',
      value: 4120,
      suffix: 'مستفيد مباشر',
      suffixBold: false,
      footerIcon: 'verified_user',
      footerText: 'تدقيق اجتماعي مسحي شامل',
    },
    {
      icon: 'domain',
      iconWrapperClass: 'bg-surface-container-highest text-primary',
      label: 'المستشفيات والشركاء المعتمدون',
      value: 78,
      suffix: 'منشأة ومجمع تخصصي',
      suffixBold: false,
      footerIcon: 'handshake',
      footerText: 'تغطية لـ 14 محافظة سورية',
    },
  ];

  return (
    <section className="w-full bg-surface-container-low py-space-xl overflow-hidden">
      <div className="w-full max-w-[1280px] mx-auto px-margin-sm md:px-margin">
        <motion.div
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.15}}
          transition={{duration: 0.75, ease: [0.16, 1, 0.3, 1]}}
          className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm"
        >
          <div>
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider font-semibold">
              المؤشرات المباشرة للشفافية
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary">
              أثر عطائكم بالأرقام الحية
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            تُحدّث البيانات بصورة لحظية ومباشرة من خلال الربط التقني مع المنظومة المالية للمستشفيات
            الشريكة.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {cards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{opacity: 0, y: 22, scale: 0.98}}
              whileInView={{opacity: 1, y: 0, scale: 1}}
              viewport={{once: true, amount: 0.12}}
              transition={{
                duration: 0.8,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{y: -4, transition: {duration: 0.3, ease: [0.16, 1, 0.3, 1]}}}
              className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <motion.div
                initial={{scale: 0.85}}
                whileInView={{scale: 1}}
                viewport={{once: true, amount: 0.12}}
                transition={{
                  duration: 0.65,
                  delay: index * 0.08 + 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`w-12 h-12 rounded-xl ${card.iconWrapperClass} flex items-center justify-center mb-space-md`}
              >
                <AppIcon name={card.icon} size={26} />
              </motion.div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {card.label}
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-numeral-lg text-numeral-lg text-primary font-bold">
                  <CountUpNumber value={card.value} />
                </span>
                <span
                  className={`font-body-sm text-body-sm text-on-surface-variant ${card.suffixBold ? 'font-bold' : ''}`}
                >
                  {card.suffix}
                </span>
              </div>
              <div className="mt-space-sm flex items-center gap-1 text-secondary font-label-sm text-label-sm">
                <AppIcon name={card.footerIcon} size={16} />
                <span>{card.footerText}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
