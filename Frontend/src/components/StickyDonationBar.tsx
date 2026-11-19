import {AppIcon} from './AppIcon';

interface StickyDonationBarProps {
  urgentCount: number;
  onQuickDonate: () => void;
  onLearnMore: () => void;
}

export function StickyDonationBar({
  urgentCount,
  onQuickDonate,
  onLearnMore,
}: StickyDonationBarProps) {
  return (
    <div className="w-full bg-surface-container-lowest/95 backdrop-blur-md border-t border-surface-container shadow-[0_-6px_24px_rgba(0,61,96,0.10)] py-space-md sticky bottom-0 z-40">
      <div className="w-full max-w-[1280px] mx-auto px-margin-sm md:px-margin flex flex-col sm:flex-row items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-sm">
          <span className="flex h-3 w-3 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
          </span>
          <span className="font-body-md text-body-md text-primary font-semibold">
            {urgentCount} حالة حرجة تحتاج اكتمال تغطيتها قبل نهاية اليوم
          </span>
        </div>

        <div className="flex items-center gap-space-md w-full sm:w-auto">
          <button
            type="button"
            onClick={onQuickDonate}
            className="flex-1 sm:flex-none px-space-lg py-space-xs rounded-xl bg-tertiary-fixed text-tertiary font-title-md text-title-md hover:bg-tertiary-fixed-dim shadow-sm flex items-center justify-center gap-space-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <AppIcon name="favorite" size={18} />
            <span>تبرع سريع</span>
          </button>
          <button
            type="button"
            onClick={onLearnMore}
            className="px-space-md py-space-xs rounded-xl bg-surface-container-low text-on-surface font-title-md text-title-md hover:bg-surface-container-high transition-colors cursor-pointer whitespace-nowrap"
          >
            معرفة المزيد
          </button>
        </div>
      </div>
    </div>
  );
}
