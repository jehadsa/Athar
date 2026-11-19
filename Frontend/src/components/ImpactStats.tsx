import {AppIcon} from './AppIcon';

interface ImpactStatsProps {
  totalDonations: number;
  completedSurgeries: number;
}

export function ImpactStats({totalDonations, completedSurgeries}: ImpactStatsProps) {
  return (
    <section className="w-full bg-surface-container-low py-space-xl">
      <div className="w-full max-w-[1280px] mx-auto px-margin-sm md:px-margin">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Stat Card 1 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center mb-space-md">
              <AppIcon name="payments" size={26} />
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              إجمالي التبرعات الموجهة
            </span>
            <div className="flex items-baseline gap-space-xs mt-1">
              <span className="font-numeral-lg text-numeral-lg text-primary font-bold">
                {totalDonations.toLocaleString('en-US')}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant font-bold">
                ل.س
              </span>
            </div>
            <div className="mt-space-sm flex items-center gap-1 text-secondary font-label-sm text-label-sm">
              <AppIcon name="arrow_circle_up" size={16} />
              <span>نسبة تحويل 100% مباشرة للعمليات</span>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center mb-space-md">
              <AppIcon name="medical_services" size={26} />
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              العمليات الجراحية المنجزة
            </span>
            <div className="flex items-baseline gap-space-xs mt-1">
              <span className="font-numeral-lg text-numeral-lg text-primary font-bold">
                {completedSurgeries.toLocaleString('en-US')}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">عملية ناجحة</span>
            </div>
            <div className="mt-space-sm flex items-center gap-1 text-secondary font-label-sm text-label-sm">
              <AppIcon name="check_circle" size={16} />
              <span>بنسبة نجاح طبي بلغت 98.4%</span>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center mb-space-md">
              <AppIcon name="groups" size={26} />
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              المرضى المستفيدون وأسرهم
            </span>
            <div className="flex items-baseline gap-space-xs mt-1">
              <span className="font-numeral-lg text-numeral-lg text-primary font-bold">4,120</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">مستفيد مباشر</span>
            </div>
            <div className="mt-space-sm flex items-center gap-1 text-secondary font-label-sm text-label-sm">
              <AppIcon name="verified_user" size={16} />
              <span>تدقيق اجتماعي مسحي شامل</span>
            </div>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-surface-container-highest text-primary flex items-center justify-center mb-space-md">
              <AppIcon name="domain" size={26} />
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              المستشفيات والشركاء المعتمدون
            </span>
            <div className="flex items-baseline gap-space-xs mt-1">
              <span className="font-numeral-lg text-numeral-lg text-primary font-bold">78</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                منشأة ومجمع تخصصي
              </span>
            </div>
            <div className="mt-space-sm flex items-center gap-1 text-secondary font-label-sm text-label-sm">
              <AppIcon name="handshake" size={16} />
              <span>تغطية لـ 14 محافظة سورية</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
