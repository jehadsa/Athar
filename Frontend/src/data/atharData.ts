export type PortalRole =
  | 'home'
  | 'patient-portal'
  | 'donor-portal'
  | 'hospital-portal'
  | 'charity-portal'
  | 'admin-portal';

export type SpecialtyKey =
  | ''
  | 'heart'
  | 'oncology'
  | 'dialysis'
  | 'eyes'
  | 'pediatrics'
  | 'hearing';

export type RegionKey =
  | ''
  | 'damascus'
  | 'rif_dimashq'
  | 'aleppo'
  | 'homs'
  | 'hama'
  | 'latakia'
  | 'tartus'
  | 'idlib'
  | 'daraa'
  | 'suwayda'
  | 'quneitra'
  | 'deir_ez_zor'
  | 'hasakah'
  | 'raqqa';

export const SYRIAN_GOVERNORATES: {key: Exclude<RegionKey, ''>; label: string}[] = [
  {key: 'damascus', label: 'دمشق'},
  {key: 'rif_dimashq', label: 'ريف دمشق'},
  {key: 'aleppo', label: 'حلب'},
  {key: 'homs', label: 'حمص'},
  {key: 'hama', label: 'حماة'},
  {key: 'latakia', label: 'اللاذقية'},
  {key: 'tartus', label: 'طرطوس'},
  {key: 'idlib', label: 'إدلب'},
  {key: 'daraa', label: 'درعا'},
  {key: 'suwayda', label: 'السويداء'},
  {key: 'quneitra', label: 'القنيطرة'},
  {key: 'deir_ez_zor', label: 'دير الزور'},
  {key: 'hasakah', label: 'الحسكة'},
  {key: 'raqqa', label: 'الرقة'},
];

export type PriorityKey = '' | 'critical' | 'urgent' | 'nearly_completed';

export interface MedicalCase {
  id: string;
  code: string;
  title: string;
  description: string;
  specialty: SpecialtyKey;
  specialtyLabel: string;
  specialtyIcon: string;
  region: RegionKey;
  hospital: string;
  urgencyLabel: string;
  urgencyTone: 'error' | 'tertiary';
  isPulsing?: boolean;
  priority: PriorityKey;
  raised: number;
  target: number;
  presets: number[];
  progressBarClass: string;
  remainingTone: 'secondary' | 'error';
  imageUrl: string;
  imageAlt: string;
  featured: boolean;
}

export interface PartnerItem {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  iconColorClass: string;
  region: RegionKey;
  casesCount: number;
}

export const ATHAR_LOGO_URL = '/assets/aistudio/Athar_icon_586679a2.png';

export const HERO_VISUAL_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBAGa1HcJKF0HO-y5ac5jw_eHcyOwl3u9TlL-TFdC7zGveA93Ms_JPrMYWMMUwzLgf18M6Pz65mHJOQOU5MbeXgUo1PH_B2RpXeCiFeC28jLdcNa7VbAWVDjD5UnNLdg5s2V7Ynxblal9tsx0kBP_2xEOSjHyMZSBkFRUZR8Tucmt-S6U3HchueMqeh_bqZ8gy9XoMSUZQGafsD5uqL3N6Lap3lELTbEjr9t-Z1M0NV';

export const PORTAL_LINKS: {key: PortalRole; label: string; description: string}[] = [
  {
    key: 'home',
    label: 'عام',
    description: 'الواجهة العامة للمتبرعين واستعراض الحالات الطبية العاجلة.',
  },
  {
    key: 'patient-portal',
    label: 'المريض',
    description: 'متابعة حالة الطلب الطبي، المواعيد الجراحية، والتحقق الموثق.',
  },
  {
    key: 'donor-portal',
    label: 'المتبرع',
    description: 'سجل التبرعات، السندات الإلكترونية، وتقارير الشفاء المباشرة.',
  },
  {
    key: 'hospital-portal',
    label: 'المستشفى',
    description: 'إدارة القسائم الطبية المعتمدة ورفع الفواتير الجراحية المباشرة.',
  },
  {
    key: 'charity-portal',
    label: 'الجمعية',
    description: 'مراجعة البحث الاجتماعي واعتماد حالات الأسر الأشد حاجة.',
  },
  {
    key: 'admin-portal',
    label: 'الإشراف',
    description: 'لوحة الحوكمة والتدقيق الطبي والمالي اللحظي في جميع المحافظات السورية.',
  },
];

export const INITIAL_MEDICAL_CASES: MedicalCase[] = [
  {
    id: 'ath-4091',
    code: '#ATH-4091',
    title: 'زراعة قوقعة أذن إلكترونية لطفل (4 سنوات)',
    description:
      'فقدان سمع حسي عصبي حاد ومزدوج. إجراء العملية قبل سن الخامسة يضمن استعادة النطق والاندماج الطبيعي في الحياة.',
    specialty: 'pediatrics',
    specialtyLabel: 'جراحة الأذن والسمع',
    specialtyIcon: 'hearing',
    region: 'damascus',
    hospital: 'مشفى المواساة الجامعي - دمشق',
    urgencyLabel: 'متبقي 6 أيام',
    urgencyTone: 'error',
    priority: 'critical',
    raised: 68000000,
    target: 85000000,
    presets: [50000, 100000, 500000],
    progressBarClass: 'bg-gradient-to-l from-secondary to-tertiary-fixed-dim',
    remainingTone: 'secondary',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCmGHdRCUK8TR0GsNnKh2FPqET3lubbpmDL4vVY-L2d30wSlvnsV4S17jXiC-zG_WRvRPIqvdHavNAXB3uWTPo-BjksuuhVTC-oFD7Fj3AkdwO5AinJkGeEwN3AbGEgRGgv_vYkfwUnidRDkNV4KpfqIDcNlZiVbi4gd2rkE1wXxS483NtfY72zjlXgS_Bq0VgsdJOcrstGhgbPkbD05SWHA1w5sAINExy4hqTmNScA',
    imageAlt: 'طفل في عيادة السمعيات أثناء فحص زراعة القوقعة الطبية',
    featured: true,
  },
  {
    id: 'ath-8219',
    code: '#ATH-8219',
    title: 'جلسات غسيل كلى ورعاية مستمرة لمسن (67 سنة)',
    description:
      'فشل كلوي مزمن من المرحلة الخامسة يتطلب 3 جلسات غسيل كلى أسبوعياً مع الأدوية المثبطة لمنع حدوث تسمم دموي حاد.',
    specialty: 'dialysis',
    specialtyLabel: 'غسيل الكلى المستمر',
    specialtyIcon: 'water_drop',
    region: 'aleppo',
    hospital: 'مشفى حلب الجامعي - حلب',
    urgencyLabel: 'متبقي 9 أيام',
    urgencyTone: 'tertiary',
    priority: 'nearly_completed',
    raised: 32400000,
    target: 36000000,
    presets: [50000, 200000, 500000],
    progressBarClass: 'bg-gradient-to-l from-secondary to-secondary-fixed',
    remainingTone: 'secondary',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuABQm0Uvl_oSpQ2w6TJ3WEn_R6KsWSWcYyRynw4fPVPu3MfwuLhJ6BJaY3iOgojRU25uML47rt61Gfet68FMmpep8yC2aNaWYjynRx9_kMzl3TnX3y7v3QRercHIw9MIEgedSA4FugM5kMPKZd_AA1BCyEUmOcD8JFPl8Y0njluIlC19iV6P3mtaOxdAKSKtrnbwfcGLbIEvXAzQ22TXu0yyR_A_w9Yk_2Ntkkxb3Q_',
    imageAlt: 'مريض مسن يتلقى جلسة غسيل كلى في مركز طبي متخصص بحلب',
    featured: true,
  },
  {
    id: 'ath-5502',
    code: '#ATH-5502',
    title: 'استئصال ورم حميد ضاغط على النخاع الشوكي',
    description:
      'تدهور حركي سريع يستوجب تدخلاً ميكروسكوبياً لإزالة الورم وتفادي الشلل التام، الحالة خضعت للتدقيق الطبي السريري.',
    specialty: 'oncology',
    specialtyLabel: 'جراحة أورام دقيقة',
    specialtyIcon: 'biotech',
    region: 'latakia',
    hospital: 'مشفى تشرين الجامعي - اللاذقية',
    urgencyLabel: 'حالة عاجلة جداً',
    urgencyTone: 'error',
    isPulsing: true,
    priority: 'critical',
    raised: 45000000,
    target: 120000000,
    presets: [100000, 500000, 1000000],
    progressBarClass: 'bg-gradient-to-l from-error to-tertiary-fixed',
    remainingTone: 'error',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBrHDz0KeWHnzCsgI0-WNkE3R2yYJyaOB_ulyfq0vbbIFsFwY4KlLzB5FXdNF_UOa3c9L9q277D0lsMfUuslYQHdOMjpIQErXLAKvUzu_s9K21oCx4WVXDpPCtXmSyP7QIEdnYsp07e40gVOCerZEeYUx5qP671emx_mO-TQmx12tTkCuYANzY6KCBM-9DfjaiteHOzoyjZUpdT2HkU-ocje3yYxkJDhU_vou9gjjPA',
    imageAlt: 'غرفة عمليات جراحية مجهزة بميكروسكوب جراحة الأعصاب والأورام باللاذقية',
    featured: true,
  },
  {
    id: 'ath-6104',
    code: '#ATH-6104',
    title: 'قسطرة قلبية عاجلة وإغلاق ثقب بطيني لطفلة (6 سنوات)',
    description:
      'تعاني من قصور في تدفق الدم الرئوي ويتطلب التدخل القسطري الدقيق تثبيت صمام قلبي دون جراحة مفتوحة.',
    specialty: 'heart',
    specialtyLabel: 'جراحة وزراعة القلب',
    specialtyIcon: 'cardiology',
    region: 'damascus',
    hospital: 'مركز جراحة القلب الجامعي - دمشق',
    urgencyLabel: 'متبقي 4 أيام',
    urgencyTone: 'error',
    priority: 'critical',
    raised: 54000000,
    target: 70000000,
    presets: [100000, 300000, 1000000],
    progressBarClass: 'bg-gradient-to-l from-secondary to-tertiary-fixed-dim',
    remainingTone: 'secondary',
    imageUrl: HERO_VISUAL_URL,
    imageAlt: 'فريق طبي متخصص في أمراض وجراحة قلب الأطفال في دمشق',
    featured: false,
  },
  {
    id: 'ath-7390',
    code: '#ATH-7390',
    title: 'جراحة تثبيت الشبكية بالليزر لمريضة سكري متقدمة',
    description:
      'انفصال جزئي في الشبكية يهدد بفقدان البصر الدائم في كلتا العينين، مع جاهزية الفريق الجراحي للتنفيذ الفوري.',
    specialty: 'eyes',
    specialtyLabel: 'جراحة العيون والشبكية',
    specialtyIcon: 'visibility',
    region: 'homs',
    hospital: 'المشفى الوطني التخصصي - حمص',
    urgencyLabel: 'حالة مستعجلة',
    urgencyTone: 'tertiary',
    priority: 'urgent',
    raised: 19500000,
    target: 24000000,
    presets: [25000, 100000, 300000],
    progressBarClass: 'bg-gradient-to-l from-secondary to-secondary-fixed',
    remainingTone: 'secondary',
    imageUrl: HERO_VISUAL_URL,
    imageAlt: 'قسم جراحة العيون والشبكية التخصصي في حمص',
    featured: false,
  },
  {
    id: 'ath-9115',
    code: '#ATH-9115',
    title: 'تأهيل علاجي وجراحي لكسور مضاعفة إثر حادث سير',
    description:
      'تثبيت داخلي متقدم للمفصل مع برنامج تأهيل حركي لمدة 12 أسبوعاً لاستعادة القدرة على المشي وإعالة الأسرة.',
    specialty: 'pediatrics',
    specialtyLabel: 'جراحة العظام والتأهيل',
    specialtyIcon: 'medical_services',
    region: 'hama',
    hospital: 'مشفى حماة الوطني - حماة',
    urgencyLabel: 'حالة مستعجلة',
    urgencyTone: 'tertiary',
    priority: 'urgent',
    raised: 28000000,
    target: 42000000,
    presets: [50000, 200000, 500000],
    progressBarClass: 'bg-gradient-to-l from-secondary to-tertiary-fixed-dim',
    remainingTone: 'secondary',
    imageUrl: HERO_VISUAL_URL,
    imageAlt: 'مركز جراحة العظام والتأهيل الطبي في حماة',
    featured: false,
  },
];

export const MEDICAL_PARTNERS: PartnerItem[] = [
  {
    id: 'mowasat',
    name: 'مشفى المواساة',
    subtitle: 'الجامعي - دمشق',
    icon: 'apartment',
    iconColorClass: 'text-primary',
    region: 'damascus',
    casesCount: 312,
  },
  {
    id: 'aleppo-univ',
    name: 'مشفى حلب الجامعي',
    subtitle: 'حلب',
    icon: 'local_hospital',
    iconColorClass: 'text-secondary',
    region: 'aleppo',
    casesCount: 284,
  },
  {
    id: 'tishreen',
    name: 'مشفى تشرين',
    subtitle: 'الجامعي - اللاذقية',
    icon: 'health_and_safety',
    iconColorClass: 'text-tertiary',
    region: 'latakia',
    casesCount: 245,
  },
  {
    id: 'homs-nat',
    name: 'المشفى الوطني',
    subtitle: 'التخصصي - حمص',
    icon: 'medication',
    iconColorClass: 'text-secondary',
    region: 'homs',
    casesCount: 198,
  },
  {
    id: 'heart-damascus',
    name: 'مركز جراحة القلب',
    subtitle: 'دمشق',
    icon: 'healing',
    iconColorClass: 'text-primary',
    region: 'damascus',
    casesCount: 164,
  },
  {
    id: 'hama-nat',
    name: 'مشفى حماة الوطني',
    subtitle: 'حماة',
    icon: 'favorite_border',
    iconColorClass: 'text-secondary',
    region: 'hama',
    casesCount: 139,
  },
];

export interface ContractedHospital {
  name: string;
  city: string;
  specialty: string;
}

export interface CharityPartnerItem {
  id: string;
  name: string;
  governorate: string;
  region: RegionKey;
  specialtyFocus: string;
  icon: string;
  iconColorClass: string;
  casesCount: number;
  hospitals: ContractedHospital[];
}

export const CHARITY_PARTNERS: CharityPartnerItem[] = [
  {
    id: 'shifa-damascus',
    name: 'جمعية شفاء الخيرية',
    governorate: 'دمشق وريف دمشق',
    region: 'damascus',
    specialtyFocus: 'جراحات القلب والأذن الدقيقة',
    icon: 'handshake',
    iconColorClass: 'text-primary',
    casesCount: 312,
    hospitals: [
      {name: 'مشفى المواساة الجامعي', city: 'دمشق', specialty: 'جراحة الأذن والسمع'},
      {name: 'مركز جراحة القلب الجامعي', city: 'دمشق', specialty: 'قسطرة وجراحة القلب'},
      {name: 'مشفى البيروني التخصصي', city: 'ريف دمشق', specialty: 'علاج الأورام'},
    ],
  },
  {
    id: 'saai-aleppo',
    name: 'جمعية الساعي للرعاية الصحية',
    governorate: 'حلب',
    region: 'aleppo',
    specialtyFocus: 'غسيل الكلى والجراحة العامة',
    icon: 'volunteer_activism',
    iconColorClass: 'text-secondary',
    casesCount: 284,
    hospitals: [
      {name: 'مشفى حلب الجامعي', city: 'حلب', specialty: 'غسيل الكلى المستمر'},
      {name: 'مشفى الرازي الجراحي', city: 'حلب', specialty: 'جراحة العظام والطوارئ'},
      {name: 'مركز أمراض الكلى التخصصي', city: 'حلب', specialty: 'زرع ورعاية الكلى'},
    ],
  },
  {
    id: 'tarahum-coast',
    name: 'جمعية تراحم الطبية',
    governorate: 'اللاذقية وطرطوس',
    region: 'latakia',
    specialtyFocus: 'جراحة الأعصاب والأورام',
    icon: 'health_and_safety',
    iconColorClass: 'text-tertiary',
    casesCount: 245,
    hospitals: [
      {name: 'مشفى تشرين الجامعي', city: 'اللاذقية', specialty: 'جراحة الأعصاب والأورام'},
      {name: 'مشفى الباسل التخصصي', city: 'طرطوس', specialty: 'الجراحات التنظيرية'},
    ],
  },
  {
    id: 'albirr-homs',
    name: 'جمعية البر والخدمات الطبية',
    governorate: 'حمص',
    region: 'homs',
    specialtyFocus: 'جراحة العيون والشبكية',
    icon: 'visibility',
    iconColorClass: 'text-secondary',
    casesCount: 198,
    hospitals: [
      {name: 'المشفى الوطني التخصصي', city: 'حمص', specialty: 'جراحة العيون والليزر'},
      {name: 'مشفى الباسل الجراحي', city: 'حمص', specialty: 'الجراحة التخصصية'},
    ],
  },
  {
    id: 'alamal-hama',
    name: 'جمعية الأمل للإسناد الطبي',
    governorate: 'حماة وإدلب',
    region: 'hama',
    specialtyFocus: 'جراحة العظام والتأهيل الحركي',
    icon: 'healing',
    iconColorClass: 'text-primary',
    casesCount: 164,
    hospitals: [
      {name: 'مشفى حماة الوطني', city: 'حماة', specialty: 'جراحة العظام والتأهيل'},
      {name: 'مشفى سلمية الوطني', city: 'ريف حماة', specialty: 'الرعاية الإسعافية'},
    ],
  },
  {
    id: 'awon-south',
    name: 'جمعية العون الصحي الخيرية',
    governorate: 'درعا والسويداء',
    region: 'daraa',
    specialtyFocus: 'رعاية الأطفال والحالات الحرجة',
    icon: 'favorite_border',
    iconColorClass: 'text-secondary',
    casesCount: 139,
    hospitals: [
      {name: 'مشفى درعا الوطني', city: 'درعا', specialty: 'طب وجراحة الأطفال'},
      {name: 'مشفى السويداء الوطني', city: 'السويداء', specialty: 'الجراحة القلبية والباطنية'},
    ],
  },
];
