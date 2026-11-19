import {useState} from 'react';
import {MedicalCase} from '../data/atharData';
import {AppIcon} from './AppIcon';
import {ResilientImage} from './ResilientImage';

interface MedicalCasesSectionProps {
  cases: MedicalCase[];
  showAll: boolean;
  onToggleShowAll: () => void;
  hasActiveFilter: boolean;
  onResetFilters: () => void;
  onDonateToCase: (medicalCase: MedicalCase, amount?: number) => void;
}

export function MedicalCasesSection({
  cases,
  showAll,
  onToggleShowAll,
  hasActiveFilter,
  onResetFilters,
  onDonateToCase,
}: MedicalCasesSectionProps) {
  const [selectedAmounts, setSelectedAmounts] = useState<Record<string, number>>({});

  const handleSelectPreset = (caseId: string, amount: number) => {
    setSelectedAmounts((prev) => ({
      ...prev,
      [caseId]: prev[caseId] === amount ? 0 : amount,
    }));
  };

  return (
    <section id="cases-section" className="w-full py-space-xl">
      <div className="w-full max-w-[1280px] mx-auto px-margin-sm md:px-margin">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
          <div>
            <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm mb-space-xs">
              <AppIcon name="emergency" size={15} />
              <span>أولوية قصوى - وقت الاستجابة حرج</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary">
              حالات طبية حرجة تستوجب التدخل العاجل
            </h2>
          </div>

          <div className="flex items-center gap-space-md">
            {hasActiveFilter && (
              <button
                type="button"
                onClick={onResetFilters}
                className="px-space-sm py-space-xs rounded-lg bg-surface-container-low text-primary font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center gap-1 cursor-pointer"
              >
                <AppIcon name="filter_alt_off" size={16} />
                <span>إعادة ضبط التصفية</span>
              </button>
            )}
            <button
              type="button"
              onClick={onToggleShowAll}
              className="font-title-md text-title-md text-secondary hover:text-on-secondary-container flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{showAll ? 'عرض الحالات العاجلة فقط' : 'عرض كافة الحالات المعتمدة'}</span>
              <AppIcon
                name="arrow_right_alt"
                size={20}
                className={`transition-transform ${showAll ? '-rotate-90' : 'rotate-180'}`}
              />
            </button>
          </div>
        </div>

        {cases.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-space-xl text-center shadow-sm">
            <div className="flex justify-center mb-space-sm text-secondary">
              <AppIcon name="search_off" size={44} />
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-space-xs">
              لا توجد حالات مطابقة لخيارات البحث الحالية
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
              يمكنك إعادة ضبط الفلاتر لعرض جميع الحالات الطبية المعتمدة والمفتوحة للتبرع.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="px-space-lg py-space-sm rounded-xl bg-primary text-on-primary font-title-md text-title-md hover:bg-primary-container transition-colors cursor-pointer"
            >
              عرض جميع الحالات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {cases.map((item) => {
              const remaining = Math.max(0, item.target - item.raised);
              const percentage = Math.min(100, Number(((item.raised / item.target) * 100).toFixed(1)));
              const isCompleted = remaining === 0;
              const selectedAmount = selectedAmounts[item.id] || item.presets[1];

              return (
                <article
                  key={item.id}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <ResilientImage
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackIcon={item.specialtyIcon}
                      fallbackTitle={item.specialtyLabel}
                    />
                    <div className="absolute top-space-sm right-space-sm flex gap-space-xs">
                      <span className="px-space-sm py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-secondary font-label-sm text-label-sm flex items-center gap-1 shadow-sm">
                        <AppIcon name={item.specialtyIcon} size={15} />
                        <span>{item.specialtyLabel}</span>
                      </span>
                    </div>
                    <div className="absolute top-space-sm left-space-sm">
                      <span
                        className={`px-space-sm py-1 rounded-full font-label-sm text-label-sm shadow-sm ${
                          isCompleted
                            ? 'bg-secondary text-on-secondary'
                            : item.urgencyTone === 'error'
                              ? `bg-error text-on-error ${item.isPulsing ? 'animate-pulse' : ''}`
                              : 'bg-tertiary-fixed text-tertiary'
                        }`}
                      >
                        {isCompleted ? 'مكتملة التمويل' : item.urgencyLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-space-lg flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm mb-space-xs gap-space-xs">
                        <span className="flex items-center gap-1 truncate">
                          <AppIcon name="location_on" size={15} className="text-secondary" />
                          <span className="truncate">{item.hospital}</span>
                        </span>
                        <span className="font-numeral-md text-numeral-md text-outline shrink-0">
                          {item.code}
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-primary mb-space-xs">
                        {item.title}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-space-md">
                        {item.description}
                      </p>
                    </div>

                    {/* Financial Bar & Donation Module */}
                    <div className="space-y-space-sm pt-space-xs bg-surface-container-low/50 p-space-sm rounded-xl">
                      <div className="flex justify-between items-baseline font-body-sm text-body-sm">
                        <div>
                          <span className="text-on-surface-variant">تم جمع: </span>
                          <span className="font-numeral-md text-numeral-md text-primary font-bold">
                            {item.raised.toLocaleString('en-US')}
                          </span>
                          <span className="text-on-surface-variant"> ل.س</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant">الهدف: </span>
                          <span className="font-numeral-md text-numeral-md text-on-surface font-semibold">
                            {item.target.toLocaleString('en-US')}
                          </span>
                          <span className="text-on-surface-variant"> ل.س</span>
                        </div>
                      </div>

                      <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden relative">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${item.progressBarClass}`}
                          style={{width: `${percentage}%`}}
                        />
                      </div>

                      <div className="flex justify-between items-center font-label-sm text-label-sm">
                        <span
                          className={`font-bold ${
                            isCompleted
                              ? 'text-secondary'
                              : item.remainingTone === 'error'
                                ? 'text-error'
                                : 'text-secondary'
                          }`}
                        >
                          {isCompleted
                            ? 'تمت تغطية كامل تكلفة العملية بحمد الله'
                            : item.id === 'ath-4091'
                              ? `متبقي: ${remaining.toLocaleString('en-US')} ل.س فقط`
                              : item.id === 'ath-8219'
                                ? `متبقي: ${remaining.toLocaleString('en-US')} ل.س لاكتمال الكفالة`
                                : `متبقي: ${remaining.toLocaleString('en-US')} ل.س`}
                        </span>
                        <span className="font-numeral-md text-numeral-md text-primary font-bold">
                          {percentage}%
                        </span>
                      </div>

                      {/* Quick Presets */}
                      <div className="grid grid-cols-3 gap-space-xs pt-space-xs">
                        {item.presets.map((preset) => {
                          const isSelected = selectedAmounts[item.id] === preset;
                          return (
                            <button
                              key={preset}
                              type="button"
                              disabled={isCompleted}
                              onClick={() => handleSelectPreset(item.id, preset)}
                              className={`py-space-xs rounded-lg font-numeral-md text-numeral-md font-bold transition-colors cursor-pointer disabled:opacity-50 ${
                                isSelected
                                  ? 'bg-secondary text-on-secondary shadow-xs'
                                  : 'bg-surface-container-lowest hover:bg-secondary-fixed/40 text-primary'
                              }`}
                            >
                              {preset.toLocaleString('en-US')} ل.س
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        disabled={isCompleted}
                        onClick={() => onDonateToCase(item, selectedAmount)}
                        className="w-full h-12 mt-space-xs rounded-xl bg-tertiary-fixed text-tertiary font-title-md text-title-md hover:bg-tertiary-fixed-dim transition-all flex items-center justify-center gap-space-xs shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <AppIcon name={isCompleted ? 'check_circle' : 'favorite'} size={18} />
                        <span>{isCompleted ? 'الحالة مكتملة التغطية' : 'تبرع الآن للحالة'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
