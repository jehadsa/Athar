import {motion, useScroll, useSpring, useTransform} from 'motion/react';
import {FormEvent, useRef} from 'react';
import {
  HERO_VISUAL_URL,
  PriorityKey,
  RegionKey,
  SpecialtyKey,
  SYRIAN_GOVERNORATES,
} from '../data/atharData';
import {AppIcon} from './AppIcon';
import {ResilientImage} from './ResilientImage';

interface HeroSectionProps {
  specialtyFilter: SpecialtyKey;
  regionFilter: RegionKey;
  priorityFilter: PriorityKey;
  onSpecialtyChange: (val: SpecialtyKey) => void;
  onRegionChange: (val: RegionKey) => void;
  onPriorityChange: (val: PriorityKey) => void;
  onApplyFilterSubmit: () => void;
  onDonateUrgentClick: () => void;
  onOpenApplyModal: () => void;
  lang: 'ar' | 'en';
}

export function HeroSection({
  specialtyFilter,
  regionFilter,
  priorityFilter,
  onSpecialtyChange,
  onRegionChange,
  onPriorityChange,
  onApplyFilterSubmit,
  onDonateUrgentClick,
  onOpenApplyModal,
  lang,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const softScrollProgress = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 22,
    mass: 0.8,
    restDelta: 0.001,
  });

  const orbRightY = useTransform(softScrollProgress, [0, 1], [0, 80]);
  const orbLeftY = useTransform(softScrollProgress, [0, 1], [0, -60]);
  const visualCardY = useTransform(softScrollProgress, [0, 1], [0, 36]);
  const visualCardScale = useTransform(softScrollProgress, [0, 1], [1, 0.975]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onApplyFilterSubmit();
  };

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      className="relative w-full overflow-hidden pb-space-xl pt-space-lg"
    >
      {/* Atmospheric Ambient Circles with Soft Scroll Parallax */}
      <motion.div
        style={{y: orbRightY}}
        className="absolute -top-32 right-10 w-96 h-96 rounded-full bg-secondary-fixed/20 blur-3xl pointer-events-none"
      />
      <motion.div
        style={{y: orbLeftY}}
        className="absolute top-48 left-0 w-[500px] h-[500px] rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none"
      />

      <div className="w-full max-w-[1280px] mx-auto px-margin-sm md:px-margin relative z-10">
        {/* Status Pill */}
        <motion.div
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.65, ease: [0.16, 1, 0.3, 1]}}
          className="flex items-center justify-start gap-space-xs mb-space-md"
        >
          <span className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high text-primary font-label-md text-label-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping shrink-0" />
            {lang === 'ar'
              ? 'المنصة الوطنية المعتمدة للإسناد العلاجي التشاركي'
              : 'National Certified Collaborative Medical Support Platform'}
          </span>
        </motion.div>

        {/* Main Asymmetric Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center mb-space-xl">
          <motion.div
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1]}}
            className="lg:col-span-7 flex flex-col items-start space-y-space-md text-start"
          >
            <h1 className="w-full font-display text-display-mobile md:text-display text-primary leading-tight">
              أثر — مجتمع متكامل <br />
              <span className="text-secondary">لصناعة الشفاء</span> وتفريج الكرب الطبي
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              نجسّر المسافة بأعلى معايير الشفافية بين أصحاب الأيادي البيضاء والمرضى الأشد حاجة،
              بإشراف طبي محكم وسداد مباشر بنسبة 100% للمستشفيات والمراكز الجراحية المعتمدة دون أي
              وسيط نقدي.
            </p>

            {/* Dual Primary CTAs */}
            <div className="w-full flex flex-wrap items-center justify-start gap-space-md pt-space-xs">
              <button
                type="button"
                onClick={onDonateUrgentClick}
                className="px-space-lg py-space-md rounded-xl bg-tertiary-fixed text-tertiary font-title-md text-title-md hover:bg-tertiary-fixed-dim shadow-lg shadow-tertiary-fixed/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-space-xs cursor-pointer whitespace-nowrap"
              >
                <AppIcon name="volunteer_activism" size={22} />
                <span>تبرع الآن للحالات الحرجة</span>
              </button>
              <button
                type="button"
                onClick={onOpenApplyModal}
                className="px-space-lg py-space-md rounded-xl bg-surface-container-lowest text-secondary font-title-md text-title-md hover:bg-surface-container-low shadow-md shadow-primary/5 border border-surface-container/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-space-xs cursor-pointer whitespace-nowrap"
              >
                <AppIcon name="medical_bag" size={22} />
                <span>تقديم طلب مساعدة علاجية</span>
              </button>
            </div>

            {/* Trust Badges Strip */}
            <div className="w-full pt-space-md flex flex-wrap items-center justify-start gap-space-sm md:gap-space-md text-on-surface-variant font-label-md text-label-md">
              <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-xs rounded-lg whitespace-nowrap">
                <AppIcon name="verified" size={18} className="text-secondary" />
                <span>مرخص رسمياً</span>
              </div>
              <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-xs rounded-lg whitespace-nowrap">
                <AppIcon name="health_and_safety" size={18} className="text-secondary" />
                <span>إشراف طبي مستقل</span>
              </div>
              <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-xs rounded-lg whitespace-nowrap">
                <AppIcon name="fact_check" size={18} className="text-secondary" />
                <span>توثيق الحالات بنسبة 100%</span>
              </div>
              <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-xs rounded-lg whitespace-nowrap">
                <AppIcon name="balance" size={18} className="text-secondary" />
                <span>متوافق مع الهيئة الشرعية</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual / Clinical Compass Card with Soft Scroll Parallax */}
          <motion.div
            initial={{opacity: 0, y: 18, scale: 0.98}}
            animate={{opacity: 1, y: 0, scale: 1}}
            transition={{duration: 0.8, delay: 0.14, ease: [0.16, 1, 0.3, 1]}}
            style={{y: visualCardY, scale: visualCardScale}}
            className="lg:col-span-5 relative"
          >
            <div className="relative bg-surface-container-lowest rounded-2xl p-space-md shadow-xl overflow-hidden">
              <div className="relative h-72 w-full rounded-xl overflow-hidden mb-space-md">
                <ResilientImage
                  src={HERO_VISUAL_URL}
                  alt="فريق طبي سوري متخصص يتابع حالة مريض داخل مشفى حديث"
                  className="w-full h-full object-cover"
                  fallbackIcon="local_hospital"
                  fallbackTitle="مشفى المواساة الجامعي - دمشق"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-space-md">
                  <div className="text-on-primary">
                    <span className="inline-block px-space-xs py-0.5 rounded bg-tertiary-fixed text-tertiary font-label-sm text-label-sm mb-1">
                      تدخل فوري معتمد
                    </span>
                    <p className="font-headline-sm text-headline-sm">
                      المسار الجراحي التعجيلي رقم #8491
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini Live Ticker inside visual module */}
              <div className="bg-surface-container-low rounded-xl p-space-sm flex items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant shrink-0">
                    <AppIcon name="local_hospital" size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      الجهة الطبية المنفذة
                    </p>
                    <p className="font-title-md text-title-md text-primary truncate">
                      مشفى المواساة الجامعي - دمشق
                    </p>
                  </div>
                </div>
                <span className="text-secondary font-label-md text-label-md flex items-center gap-1 whitespace-nowrap shrink-0">
                  <AppIcon name="lock" size={16} />
                  <span>تحويل مباشر</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Triage Filter Bar */}
        <motion.div
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.15}}
          transition={{duration: 0.75, ease: [0.16, 1, 0.3, 1]}}
          className="bg-surface-container-lowest rounded-2xl p-space-md shadow-md"
        >
          <form
            className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center"
            onSubmit={handleSubmit}
          >
            <div className="md:col-span-4 flex flex-col gap-1">
              <label
                htmlFor="triage-specialty"
                className="font-label-sm text-label-sm text-on-surface-variant"
              >
                التخصص الطبي الدقيق
              </label>
              <div className="flex items-center bg-surface-container-low rounded-xl px-space-sm py-space-xs">
                <AppIcon name="cardiology" size={18} className="text-secondary ml-space-xs" />
                <select
                  id="triage-specialty"
                  value={specialtyFilter}
                  onChange={(e) => onSpecialtyChange(e.target.value as SpecialtyKey)}
                  className="bg-transparent w-full font-body-md text-body-md text-on-surface focus:outline-none cursor-pointer"
                >
                  <option value="">كافة التخصصات الطبية</option>
                  <option value="heart">جراحة وزراعة القلب</option>
                  <option value="oncology">علاج الأورام والكيماوي</option>
                  <option value="dialysis">غسيل ورعاية الفشل الكلوي</option>
                  <option value="eyes">جراحة العيون والشبكية</option>
                  <option value="pediatrics">جراحات الأطفال الدقيقة</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-3 flex flex-col gap-1">
                <label
                  htmlFor="triage-region"
                  className="font-label-sm text-label-sm text-on-surface-variant"
                >
                  المحافظة والمدينة
                </label>
                <div className="flex items-center bg-surface-container-low rounded-xl px-space-sm py-space-xs">
                  <AppIcon name="location_on" size={18} className="text-secondary ml-space-xs" />
                  <select
                    id="triage-region"
                    value={regionFilter}
                    onChange={(e) => onRegionChange(e.target.value as RegionKey)}
                    className="bg-transparent w-full font-body-md text-body-md text-on-surface focus:outline-none cursor-pointer"
                  >
                    <option value="">جميع المحافظات السورية</option>
                    {SYRIAN_GOVERNORATES.map((gov) => (
                      <option key={gov.key} value={gov.key}>
                        {gov.label}
                      </option>
                    ))}
                  </select>
                </div>
            </div>

            <div className="md:col-span-3 flex flex-col gap-1">
              <label
                htmlFor="triage-priority"
                className="font-label-sm text-label-sm text-on-surface-variant"
              >
                أولوية التدخل
              </label>
              <div className="flex items-center bg-surface-container-low rounded-xl px-space-sm py-space-xs">
                <AppIcon name="speed" size={18} className="text-secondary ml-space-xs" />
                <select
                  id="triage-priority"
                  value={priorityFilter}
                  onChange={(e) => onPriorityChange(e.target.value as PriorityKey)}
                  className="bg-transparent w-full font-body-md text-body-md text-on-surface focus:outline-none cursor-pointer"
                >
                  <option value="">جميع درجات الخطورة</option>
                  <option value="critical">حالات حرجة جداً (تدخل أسبوعي)</option>
                  <option value="urgent">حالات مستعجلة</option>
                  <option value="nearly_completed">أوشكت على الاكتمال</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col justify-end pt-5 md:pt-0">
              <button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-title-md text-title-md rounded-xl shadow-md transition-all flex items-center justify-center gap-space-xs cursor-pointer"
              >
                <AppIcon name="search" size={18} />
                <span>تصفية الحالات</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
