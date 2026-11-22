import {motion} from 'motion/react';
import {useState} from 'react';
import {CHARITY_PARTNERS, RegionKey} from '../data/atharData';
import {AppIcon} from './AppIcon';

interface PartnersSectionProps {
  onFilterByRegion: (region: RegionKey) => void;
}

export function PartnersSection({onFilterByRegion}: PartnersSectionProps) {
  const [selectedCharityId, setSelectedCharityId] = useState<string>('all');

  const visibleCharities =
    selectedCharityId === 'all'
      ? CHARITY_PARTNERS
      : CHARITY_PARTNERS.filter((c) => c.id === selectedCharityId);

  return (
    <section id="partners-section" className="w-full py-space-xl bg-surface overflow-hidden">
      <div className="w-full max-w-[1280px] mx-auto px-margin-sm md:px-margin">
        <motion.div
          initial={{opacity: 0, y: 16}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.15}}
          transition={{duration: 0.75, ease: [0.16, 1, 0.3, 1]}}
          className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-md"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 font-label-md text-label-md text-secondary font-bold">
              <AppIcon name="handshake" size={16} />
              <span>الجمعيات الخيرية والمشافي المتعاقدة</span>
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary mt-space-xs">
              الجمعيات المشتركة وشبكة المشافي المتعاملة معها
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl">
              تعمل الجمعيات الخيرية المعتمدة في المحافظات السورية بشراكة مباشرة مع مشافٍ ومراكز
              طبية محددة لتنفيذ العمليات وسداد التكاليف دون أي وسطاء.
            </p>
          </div>

          {/* Quick Charity Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <label
              htmlFor="charity-filter"
              className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap"
            >
              تصفية حسب الجمعية:
            </label>
            <select
              id="charity-filter"
              value={selectedCharityId}
              onChange={(e) => setSelectedCharityId(e.target.value)}
              className="bg-surface-container-lowest border border-surface-variant/80 rounded-xl px-space-sm py-space-xs font-body-sm text-body-sm text-primary font-semibold focus:outline-none focus:ring-2 focus:ring-secondary/30 cursor-pointer"
            >
              <option value="all">جميع الجمعيات ({CHARITY_PARTNERS.length})</option>
              {CHARITY_PARTNERS.map((charity) => (
                <option key={charity.id} value={charity.id}>
                  {charity.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {visibleCharities.map((charity, index) => (
            <motion.article
              key={charity.id}
              initial={{opacity: 0, y: 22, scale: 0.985}}
              whileInView={{opacity: 1, y: 0, scale: 1}}
              viewport={{once: true, amount: 0.08}}
              transition={{
                duration: 0.8,
                delay: (index % 3) * 0.09,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{y: -4, transition: {duration: 0.3, ease: [0.16, 1, 0.3, 1]}}}
              className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-lg border border-surface-container transition-shadow flex flex-col justify-between gap-space-md"
            >
              <div className="space-y-space-md">
                {/* Charity Header */}
                <div className="flex items-start justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div
                      className={`w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0 ${charity.iconColorClass}`}
                    >
                      <AppIcon name={charity.icon} size={24} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-title-md text-title-md text-primary font-bold truncate">
                        {charity.name}
                      </h3>
                      <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm mt-0.5">
                        <AppIcon name="location_on" size={14} className="text-secondary" />
                        <span>{charity.governorate}</span>
                      </div>
                    </div>
                  </div>
                  <span className="bg-secondary-fixed/60 text-on-secondary-fixed font-numeral-md text-[12px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                    {charity.casesCount} حالة
                  </span>
                </div>

                {/* Specialty Tag */}
                <div className="bg-surface-container-low/70 rounded-xl px-3 py-2 flex items-center justify-between gap-2 text-[12px]">
                  <span className="text-on-surface-variant">مجال التركيز:</span>
                  <span className="font-bold text-primary">{charity.specialtyFocus}</span>
                </div>

                {/* Contracted Hospitals List */}
                <div className="space-y-2">
                  <p className="font-label-sm text-label-sm text-secondary font-bold flex items-center gap-1.5">
                    <AppIcon name="local_hospital" size={15} />
                    <span>المشافي المتعاملة مع الجمعية ({charity.hospitals.length}):</span>
                  </p>
                  <ul className="space-y-2">
                    {charity.hospitals.map((hospital) => (
                      <li
                        key={hospital.name}
                        className="bg-surface-container-low rounded-xl px-3 py-2.5 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="font-body-sm text-[13px] font-bold text-primary truncate">
                            {hospital.name}
                          </p>
                          <p className="font-label-sm text-[11px] text-on-surface-variant truncate">
                            {hospital.specialty}
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-secondary bg-surface-container-lowest px-2 py-0.5 rounded-md whitespace-nowrap shrink-0">
                          {hospital.city}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Footer */}
              <button
                type="button"
                onClick={() => onFilterByRegion(charity.region)}
                className="w-full py-space-sm rounded-xl bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>استعراض حالات {charity.governorate}</span>
                <AppIcon name="arrow_right_alt" size={16} className="rotate-180" />
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
