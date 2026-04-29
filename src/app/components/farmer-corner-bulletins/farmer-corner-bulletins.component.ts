import { ChangeDetectionStrategy, Component, computed, HostListener, inject, signal } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

interface BulletinTab {
  key: string;
  label: string;
  icon: string;
}

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

interface ForecastDay {
  date: string;
  rainfall: string;
  maxTemp: string;
  minTemp: string;
  humidity: string;
  windSpeed: string;
  cloudPosition: string;
}

interface CropCard {
  id: string;
  name: string;
  image: string;
  cropStage: string;
  description: string;
  advisoryItems: string[];
}

interface PestCard {
  id: string;
  name: string;
  image: string;
  pestType: string;
  description: string;
  advisoryItems: string[];
}

@Component({
  selector: 'app-farmer-corner-bulletins',
  standalone: true,
  templateUrl: './farmer-corner-bulletins.component.html',
  styleUrl: './farmer-corner-bulletins.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FarmerCornerBulletinsComponent {
  private theme = inject(ThemeService);
  asset = (p: string) => this.theme.asset(p);

  private readonly iconBase = 'assets/images';

  readonly tabs: BulletinTab[] = [
    { key: 'weather-advisory', label: 'Weather Pattern Advisory', icon: `${this.iconBase}/Weather_pattern_Advisory.svg`      },
    { key: 'crop-advisory',    label: 'Crop Advisory',             icon: `${this.iconBase}/Crop_Advisory.svg`                 },
    { key: 'pest-disease',     label: 'Pest & Disease Infestation', icon: `${this.iconBase}/Pest_and_Disease_Infestation.svg` },
    { key: 'soil-moisture',    label: 'Soil Moisture Status',      icon: `${this.iconBase}/Soil_Moisture_Status.svg`          },
    { key: 'crop-stress',      label: 'Crop Stress Status',        icon: `${this.iconBase}/Crop_Stress_Status.svg`            },
  ];

  readonly activeKey = signal<string>('weather-advisory');
  setActive(key: string): void { this.activeKey.set(key); }

  readonly activeTab = computed(() => this.tabs.find(t => t.key === this.activeKey()) ?? this.tabs[0]);

  readonly showFilter = signal(true);
  toggleFilter(): void { this.showFilter.update(v => !v); }

  // ── Custom dropdown state ──────────────────────────────────────────────────
  readonly openDropdown = signal<string | null>(null);
  readonly searchQuery   = signal('');

  readonly selectedYear     = signal('2024-2025');
  readonly selectedSeason   = signal('Summer');
  readonly selectedDate     = signal('2025-03-07');
  readonly selectedDistrict = signal('Junagadh');
  readonly selectedTaluk    = signal('Junagadh City');

  readonly yearOptions: string[]     = ['2023-2024', '2024-2025', '2025-2026'];
  readonly seasonOptions: string[]   = ['Kharif', 'Rabi', 'Summer'];
  readonly districtOptions: string[] = [
    'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha',
    'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod',
    'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath',
    'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar',
    'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal',
    'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat',
    'Surendranagar', 'Tapi', 'Vadodara', 'Valsad',
  ];
  readonly talukOptions: string[] = [
    'Bhesan', 'Junagadh City', 'Mangrol', 'Mendarda', 'Vanthali', 'Visavadar',
  ];

  toggleDropdown(key: string): void {
    this.openDropdown.set(this.openDropdown() === key ? null : key);
    this.searchQuery.set('');
  }

  selectOption(key: string, value: string): void {
    switch (key) {
      case 'year':     this.selectedYear.set(value);     break;
      case 'season':   this.selectedSeason.set(value);   break;
      case 'district': this.selectedDistrict.set(value); break;
      case 'taluk':    this.selectedTaluk.set(value);    break;
    }
    this.openDropdown.set(null);
    this.searchQuery.set('');
  }

  filteredOptions(options: string[]): string[] {
    const q = this.searchQuery().toLowerCase().trim();
    return q ? options.filter(o => o.toLowerCase().includes(q)) : options;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    if (!(e.target as HTMLElement).closest('.fc-select')) {
      this.openDropdown.set(null);
    }
  }

  // ── Calendar / date picker ─────────────────────────────────────────────────
  readonly weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  private readonly monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  readonly calendarViewYear  = signal(2025);
  readonly calendarViewMonth = signal(2);   // 0-indexed → March

  readonly calendarMonthName = computed(() => this.monthNames[this.calendarViewMonth()]);

  readonly formattedDate = computed(() => {
    const d = this.selectedDate();
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  });

  readonly calendarDays = computed((): CalendarDay[] => {
    const year  = this.calendarViewYear();
    const month = this.calendarViewMonth();
    const selStr = this.selectedDate();
    const today  = new Date();
    const [sy, sm, sd] = selStr ? selStr.split('-').map(Number) : [0, 0, 0];

    const firstDow = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const days: CalendarDay[] = [];

    // Leading days from previous month
    for (let i = firstDow - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, day: d.getDate(), isCurrentMonth: false, isToday: false, isSelected: false });
    }
    // Current month
    for (let d = 1; d <= lastDate; d++) {
      const isToday    = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
      const isSelected = sy === year && (sm - 1) === month && sd === d;
      days.push({ date: new Date(year, month, d), day: d, isCurrentMonth: true, isToday, isSelected });
    }
    // Trailing days to complete 42 cells
    let nd = 1;
    while (days.length < 42) {
      const d = new Date(year, month + 1, nd++);
      days.push({ date: d, day: d.getDate(), isCurrentMonth: false, isToday: false, isSelected: false });
    }
    return days;
  });

  toggleCalendar(): void {
    if (this.openDropdown() === 'date') {
      this.openDropdown.set(null);
    } else {
      const [y, m] = this.selectedDate().split('-').map(Number);
      this.calendarViewYear.set(y);
      this.calendarViewMonth.set(m - 1);
      this.openDropdown.set('date');
    }
  }

  prevCalMonth(): void {
    if (this.calendarViewMonth() === 0) { this.calendarViewMonth.set(11); this.calendarViewYear.update(y => y - 1); }
    else { this.calendarViewMonth.update(m => m - 1); }
  }

  nextCalMonth(): void {
    if (this.calendarViewMonth() === 11) { this.calendarViewMonth.set(0); this.calendarViewYear.update(y => y + 1); }
    else { this.calendarViewMonth.update(m => m + 1); }
  }

  selectCalDate(day: CalendarDay): void {
    const d = day.date;
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    this.selectedDate.set(str);
    this.openDropdown.set(null);
  }

  goToToday(): void {
    const t = new Date();
    this.calendarViewYear.set(t.getFullYear());
    this.calendarViewMonth.set(t.getMonth());
    const str = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    this.selectedDate.set(str);
    this.openDropdown.set(null);
  }
  // ──────────────────────────────────────────────────────────────────────────

  readonly filterChips: string[] = ['2024-25', 'Summer', '07/03/2025', 'Junagadh', 'Junagadh City'];

  readonly forecastDays: ForecastDay[] = [
    { date: '07-03-2025', rainfall: '0.00 mm', maxTemp: '37.34 °C', minTemp: '23.22 °C', humidity: '17.00 %', windSpeed: '15.59 m/s', cloudPosition: '0.00 %' },
    { date: '08-03-2025', rainfall: '0.00 mm', maxTemp: '37.34 °C', minTemp: '23.22 °C', humidity: '17.00 %', windSpeed: '15.59 m/s', cloudPosition: '0.00 %' },
    { date: '09-03-2025', rainfall: '0.00 mm', maxTemp: '37.34 °C', minTemp: '23.22 °C', humidity: '17.00 %', windSpeed: '15.59 m/s', cloudPosition: '0.00 %' },
    { date: '10-03-2025', rainfall: '0.00 mm', maxTemp: '37.34 °C', minTemp: '23.22 °C', humidity: '17.00 %', windSpeed: '15.59 m/s', cloudPosition: '0.00 %' },
    { date: '11-03-2025', rainfall: '0.00 mm', maxTemp: '37.34 °C', minTemp: '23.22 °C', humidity: '17.00 %', windSpeed: '15.59 m/s', cloudPosition: '0.00 %' },
  ];

  readonly tickerMessages: string[] = [
    'આગામી ૭ દિવસ દરમિયાન તાલુકામાં મહત્તમ તાપમાન 37.3 થી 40.9 °સે, લઘુત્તમ તાપમાન 21.6 થી 26.2°સે જેટલું રહેવાની શક્યતા છે.',
    'પવનની ગતિ અંદાજિત 15 થી 26 કિમી/કલાક જેટલી રહેવાની શક્યતા છે. દિવસનો સરેરાશ સાપેક્ષ ભેજ 11% થી 20% જેટલો રહેવાની શકયતા છે.',
    'વરસાદની કોઈ શક્યતા નથી.',
  ];

  readonly weatherSummaryTitle = 'હવામાન સારાંશ';
  readonly weatherSummaryBullets: string[] = [
    'આગામી ૭ દિવસ દરમિયાન તાલુકામાં મહત્તમ તાપમાન 37.3 થી 40.9 °સે, લઘુત્તમ તાપમાન 21.6 થી 26.2°સે જેટલું રહેવાની શક્યતા છે.',
    'પવનની ગતિ અંદાજિત 15 થી 26 કિમી/કલાક જેટલી રહેવાની શક્યતા છે. દિવસનો સરેરાશ સાપેક્ષ ભેજ 11% થી 20% જેટલો રહેવાની શકયતા છે.',
    'વરસાદની કોઈ શક્યતા નથી.',
  ];

  readonly agriAdviceTitle = 'સામાન્ય કૃષિ સલાહ';
  readonly agriAdviceBullets: string[] = [
    'તા. ૧૦ થી ૧૨ માર્ચ દરમિયાન તાપમાનમાં વધારો થવાની શક્યતા હોવાથી ઉનાળુ પાકોમાં ભેજની ખેંચ વર્તાય તો હળવું પિયત આપવું.',
    'જમીનમાં ભેજ સંરક્ષણ અને નિંદણ નિયંત્રણ માટે પ્લાસ્ટિક મલ્ય (આવરણ) અથવા પાક અવશેષોના આવરણનો ઉપયોગ કરવો.',
    'પરિપક્વ થયેલા શિયાળુ પાકોની સમયસર કાપણી કરવી.',
  ];

  // ── Crop Advisory ─────────────────────────────────────────────────────────
  readonly cropAdvisoryDesc = 'જૂનાગઢ જિલ્લાના જૂનાગઢ તાલુકામાં હાલની પાક અવસ્થા અને પરિસ્થિતિને ધ્યાનમાં રાખીને નીચે મુજબના ખેત કાર્યો માટે ભલામણ કરવામાં આવે છે.';
  readonly cropStageLabelGu   = 'પાક અવસ્થા:';
  readonly cropAdvisoryBtnText = 'કૃષિ સલાહ';

  // ── Crop Advisory Popup state ─────────────────────────────────────────────
  readonly activePopupCard = signal<CropCard | null>(null);

  openPopup(card: CropCard): void {
    this.activePopupCard.set(card);
    document.body.style.overflow = 'hidden';
  }

  closePopup(): void {
    this.activePopupCard.set(null);
    document.body.style.overflow = '';
  }

  // ── Pest & Disease Infestation ────────────────────────────────────────────
  readonly pestDiseaseDesc = 'જૂનાગઢ જિલ્લાના જૂનાગઢ તાલુકામાં હાલની પાક અવસ્થા અને હવામાન પરિસ્થિતિને ધ્યાનમાં રાખીને, રોગ અને જીવાતના ઉપદ્રવની સંભાવના જોવા મળી શકે છે. તેના અસરકારક નિયંત્રણ માટે નીચે દર્શાવેલા પગલાં લેવા જરૂરી છે.';
  readonly pestLabelGu     = 'રોગ/જીવાત:';
  readonly pestBtnText     = 'રોગ/જીવાત નિયંત્રણ';

  // ── Pest & Disease Popup state ────────────────────────────────────────────
  readonly activePestPopupCard = signal<PestCard | null>(null);

  openPestPopup(card: PestCard): void {
    this.activePestPopupCard.set(card);
    document.body.style.overflow = 'hidden';
  }

  closePestPopup(): void {
    this.activePestPopupCard.set(null);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.activePopupCard())     { this.closePopup();     }
    if (this.activePestPopupCard()) { this.closePestPopup(); }
  }

  // Shared advisory items — Figma node 129:15755 (all 4 theme variants identical)
  private readonly sharedAdvisoryItems: string[] = [
    'બાજરીના વાવેતર બાદ ૧૨ થી ૧૫ દિવસમાં નિંદણનો ઉગાવો દેખાય તો પારવણી પહેલા એટ્રાઝીન હેકટર દીઠ ૦.૪૦૦ કિ.ગ્રા. સક્રિય તત્વ મુજબ (પોસ્ટ-ઇમરજન્સ તરીકે) ૫૦૦ લીટર પાણીમાં ઓગાળીને છંટકાવ કરવાની ભલામણ કરવમાં આવે છે.',
    'વાવેતરના પંદર દિવસ બાદ હારમાં બે છોડ વચ્ચે ૧૦ થી ૧૨ સે.મી. અંતર રાખી પારવણી કરવી જોઈએ. જે હારોમાં મોટા ગામા-ખાલાં હોય ત્યાં ભેજની યોગ્ય પરિસ્થિતિમાં પારવણીની સાથોસાથ નિકળેલા તંદુરસ્ત છોડની ફેરરોપણી કરી છોડની પુરતી સંખ્યા જાળવવી.',
    'બાજરીના પાકને વાનસ્પ\u0aa4\u0abf\u0a95 \u0ab5\u0ac3\u0aa6\u0acd\u0aa7\u0abf \u0a85\u0ab5\u0ab8\u0acd\u0aa5\u0abe (50 \u0aa6\u0abf\u0ab5\u0ab8) \u0ab8\u0ac1\u0aa7\u0ac0 \u0aa8\u0ac0\u0a82\u0aa6\u0aa3\u0aa5\u0ac0 \u0aae\u0ac1\u0a95\u0acd\u0aa4 \u0ab0\u0abe\u0a96\u0ab5\u0acb \u0a96\u0ac1\u0aac \u0a9c \u0a9c\u0ab0\u0ac2\u0ab0\u0ac0 \u0a9b\u0ac7 \u0aa4\u0acb \u0a9c\u0ab0\u0ac2\u0ab0\u0abf\u0aaf\u0abe\u0aa4 \u0aae\u0ac1\u0a9c\u0aac \u0a9c\u0aae\u0ac0\u0aa8\u0aae\u0abe\u0a82 \u0ab5\u0ab0\u0abe\u0aaa \u0aa5\u0aae\u0ac7 \u0a86\u0a82\u0aa4\u0ab0\u0a96\u0ac7\u0aa1 \u0a85\u0aa8\u0ac7 \u0ab9\u0abe\u0aa5 \u0aa8\u0abf\u0a82\u0aa6\u0abe\u0aae\u0aa3 \u0a95\u0ab0\u0ab5\u0ac1\u0a82.',
    'પાક એક માસનો થાય ત્યારે નિંદામણ અને પારવણી કર્યા બાદ પૂરતો ભેજ હોઈ ત્યારે નાઈટ્રોજન ખાતર ૩૦ કિ.ગ્રા/હે. (૬૫ કિ.ગ્રા. યુરીયા પ્રતિ હેક\u0a9f\u0ab0) \u0aaa\u0acd\u0ab0\u0aae\u0abe\u0aa3\u0ac7 \u0aaa\u0ac2\u0ab0\u0acd\u0aa4\u0abf \u0a96\u0abe\u0aa4\u0ab0 \u0aa4\u0ab0\u0ac0\u0a95\u0ac7 \u0a86\u0aaa\u0ab5\u0acb. \u0aaa\u0ac2\u0ab0\u0acd\u0aa4\u0abf \u0a96\u0abe\u0aa4\u0ab0 \u0a86\u0aaa\u0aa4\u0ac0 \u0ab5\u0a96\u0aa4\u0ac7 \u0a9c\u0aae\u0ac0\u0aa8\u0aae\u0abe\u0a82 \u0aad\u0ac7\u0a9c \u0ab9\u0acb\u0ab5\u0acb \u0a9c\u0ab0\u0ac2\u0ab0\u0ac0 \u0a9b\u0ac7.',
    'કાતરાની માદા ફૂદી ખેતરનાં શેઢાપાળે ઉગી નીકળેલ કુમળા ઘાસ પર ઇંડાં મૂકે છે માટે પ્રથમ વરસાદ બાદ શેઢા- પાળા સાફ રાખવા.',
    'સુક\u0acd\u0ab7\u0aae\u0aa4\u0aa4\u0acd\u0ab5\u0acb\u0aa8\u0ac0 \u0a89\u0aa3\u0aaa \u0ab5\u0abe\u0ab3\u0abe \u0ab5\u0abf\u0ab8\u0acd\u0aa4\u0abe\u0ab0\u0aae\u0abe\u0a82 \u0ab8\u0ac1\u0a95\u0acd\u0ab7\u0aae\u0aa4\u0aa4\u0acd\u0ab5\u0acb\u0aa8\u0ac1\u0a82 1% \u0aae\u0abf\u0ab6\u0acd\u0ab0\u0aa3 (\u0ab2\u0acb\u0ab9 4%, \u0aae\u0ac7\u0a82\u0a97\u0aa8\u0ac0\u0a9d 0. 1%, \u0a9c\u0ab8\u0aa4 6%, \u0aa4\u0abe\u0a82\u0aac\u0ac1 0.5% \u0a85\u0aa8\u0ac7 \u0aac\u0acb\u0ab0\u0acb\u0aa8 0.5%) \u0a95\u0ac7 \u0a9c\u0ac7 \u0a97\u0ab0\u0acd\u0ab5\u0aae\u0ac7\u0aa8\u0acd\u0a9f \u0aa8\u0acb\u0a9f\u0ac0\u0a95\u0abe\u0a87\u0aa1 \u0a97\u0acd\u0ab0\u0ac7-4 \u0ab5\u0abe\u0ab5\u0ac7\u0aa4\u0ab0 \u0aac\u0abe\u0aa6 20, 30 \u0a85\u0aa8\u0ac7 40 \u0aa6\u0abf\u0ab5\u0ab8\u0ac7 \u0a9b\u0a82\u0a9f\u0a95\u0abe\u0ab5 \u0a95\u0ab0\u0ab5\u0abe\u0aa5\u0ac0 \u0ab5\u0aa7\u0ac1 \u0a89\u0aa4\u0acd\u0aaa\u0abe\u0aa6\u0aa8 \u0aae\u0ac7\u0ab3\u0ab5\u0ac0 \u0ab6\u0a95\u0abe\u0aaf \u0a9b\u0ac7.',
  ];

  readonly cropCards: CropCard[] = [
    {
      id: 'bajra',
      name: 'Bajra',
      image: 'assets/images/crop_bajra.png',
      cropStage: 'વાનસ્પ\u0aa4\u0abf\u0a95 \u0ab5\u0ac1\u0aa7\u0acd\u0aa7\u0abf \u0a85\u0ab5\u0ab8\u0acd\u0aa5\u0abe',
      description: 'કાતરાની માદા ફૂદી ખેતરનાં શેઢાપાળે ઉગી નીકળેલ કુમળા ઘાસ પર ઇંડાં મૂકે છે માટે પ્રથમ વરસાદ બાદ શેઢા- પાળા સાફ રાખવા.',
      advisoryItems: this.sharedAdvisoryItems,
    },
    {
      id: 'sorghum',
      name: 'Sorghum',
      image: 'assets/images/crop_sorghum.png',
      cropStage: 'વાવ\u0ac7\u0aa4\u0ab0 \u0a85\u0ab5\u0ab8\u0acd\u0aa5\u0abe',
      description: 'એક કાપ\u0aa3\u0ac0\u0aa3 \u0a8f\u0ab8.1049 (\u0ab8\u0ac1\u0a82\u0aa2\u0ac0\u0aaf\u0ac1), \u0ab8\u0ac0.10.2 (\u0a9b\u0abe\u0ab8\u0a9f\u0abf\u0aaf\u0acb) \u0a9c\u0ac0.\u0a8f\u0aab.\u0a8f\u0ab8.3, \u0a9c\u0ac0.\u0a8f\u0aab.\u0a8f\u0ab8.4, \u0a9c\u0ac0.\u0a8f\u0aab.\u0a8f\u0ab8.5 \u0a85\u0aa8\u0ac7 \u0a97\u0ac1.\u0a86.\u0a98\u0abe.\u0a9c\u0ac1\u0ab5\u0abe\u0ab0-11',
      advisoryItems: this.sharedAdvisoryItems,
    },
    {
      id: 'sesamum',
      name: 'Sesamum',
      image: 'assets/images/crop_sesamum.png',
      cropStage: 'વાનસ્પ\u0aa4\u0abf\u0a95 \u0ab5\u0ac1\u0aa7\u0acd\u0aa7\u0abf \u0a85\u0ab5\u0ab8\u0acd\u0aa5\u0abe',
      description: 'તલના પ\u0abe\u0a95\u0aa8\u0ac0 \u0ab5\u0ac3\u0aa6\u0acd\u0aa7\u0abf \u0ab6\u0ab0\u0ac2\u0a86\u0aa4\u0aa8\u0abe \u0ab8\u0aae\u0aaf\u0aae\u0abe\u0a82 \u0a93\u0a9b\u0ac0 \u0ab9\u0acb\u0ab5\u0abe\u0aa5\u0ac0 \u0a9c\u0acb \u0ab8\u0aae\u0aaf\u0ab8\u0ab0 \u0aa8\u0ac0\u0a82\u0aa6\u0aa3 \u0aa8\u0abf\u0aaf\u0a82\u0aa4\u0acd\u0ab0\u0aa3 \u0a95\u0ab0\u0ab5\u0abe\u0aae\u0abe\u0a82 \u0aa8 \u0a86\u0ab5\u0ac7 \u0aa4\u0acb 50 \u0aa5\u0ac0 70 \u0a9f\u0a95\u0abe \u0a89\u0aa4\u0acd\u0aaa\u0abe\u0aa6\u0aa8\u0aae\u0abe\u0a82 \u0a98\u0a9f\u0abe\u0aa1\u0acb \u0aa5\u0a88 \u0ab6\u0a95\u0ac7.',
      advisoryItems: this.sharedAdvisoryItems,
    },
    {
      id: 'urid',
      name: 'Urid',
      image: 'assets/images/crop_urid.png',
      cropStage: 'વ\u0abe\u0ab5\u0aa3\u0ac0\u0aa8\u0ac0 \u0aa4\u0ac8\u0aaf\u0abe\u0ab0\u0ac0',
      description: 'વ\u0abe\u0ab5\u0aa3\u0ac0 \u0ab8\u0aae\u0aaf: 25 \u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1\u0a86\u0ab0\u0ac0\u0aa5\u0ac0 25 \u0aae\u0abe\u0ab0\u0acd\u0a9a \u0ab8\u0ac1\u0aa7\u0ac0\u0aa8\u0abe \u0ab8\u0aae\u0aaf\u0a97\u0abe\u0ab3\u0abe \u0aa6\u0ab0\u0aae\u0acd\u0aaf\u0abe\u0aa8 \u0ab5\u0abe\u0ab5\u0ac7\u0aa4\u0ab0 \u0a95\u0ab0\u0ab5\u0abe\u0aa5\u0ac0 \u0ab5\u0aa7\u0ac1 \u0a89\u0aa4\u0acd\u0aaa\u0abe\u0aa6\u0aa8 \u0aae\u0ab3\u0ac7 \u0a9b\u0ac7.',
      advisoryItems: this.sharedAdvisoryItems,
    },
  ];

  // ── Pest & Disease advisory items (Figma node 140:25502 — all theme variants identical)
  private readonly pestAdvisoryItems: string[] = [
    'બાજરી પાકમાં પાનના ટપકાં (લીફ બ્લાસ્ટ)નો રોગ જોવા મળે તો તેના નિયંત્રણ માટે કાર્બેન્ડાઝીમ ૫૦% વે.પા. (૧૦ ગ્રામ/૧૦ લિટર પાણી) નો છંટકાવ કરવો.',
    'કુતુલ (તળછારો) રોગ ફેલાવા માટે પણ અનુકૂળ સ્થિતિ હોઈ જેથી વરસાદ ન હોય ત્યારે ખુલ્લા અને સૂકા દિવસોમાં મેટાલેક્ષીલ ૮ ટકા + મેન્કોઝેબ ૬૪ ટકા વે.પા. ૨૦ ગ્રામ/૧૦ લિટર પાણીમાં ઓગાળી વાવેતર બાદ ૨૦ અને ૩૫ દિવસે છંટકાવ કરવાથી કુતુલ રોગને વધતો અટકાવી શકાય છે.',
    'સાંઠાની માખીનો ઉપદ્રવની શરૂઆતમાં બ્યૂવેરીયા બેસીયાના ૧.૧૫ વેપા કૂગનો પાઉડર ૬૦ ગ્રામ ૧૦ લિટર પાણીમાં ઉમેરી છંટકાવ કરવો',
  ];

  // ── Soil Moisture Status ──────────────────────────────────────────────────
  readonly soilMoistureDesc = 'જૂનાગઢ તાલુકાના 62 ગામોમાં જમીનમાં ભેજની ખેંચ જણાઈ રહી છે/વર્તાય રહી છે તો તેને નિવારવા માટે';
  readonly soilMoistureBadge = 'Dry Moisture';
  readonly soilMoisturePanelTitle = 'સારાંશ';

  // Flat array ordered as left/right interleaved (grid auto-flow: row, 2 cols)
  readonly soilMoistureBullets: string[] = [
    'વાતાવરણ અને જમીનની પ્રત અનુસાર જરૂર મુજબનું પિયત આપવું.',
    'પાણીની સગવડતા ઓછી હોય તેવા સંજોગોમાં સૂક્ષ્મ પિયત પદ્ધતિનો ઉપયોગ કરવો.',
    'જમીન પરથી થતું પાણીનું બાષ્પીભવન ઘટાડવા માટે જમીન ઉપર પાક અવશેષોનું આવરણ (મલચિંગ) કરવું.',
    'ખેતરના શેઢાપાળે પવન અવરોધક વૃક્ષો ઉછેરવા, જેથી પવન દ્વારા થતો ભેજનો વ્યય થતો અટકાવી શકાય.',
    'વરસાદી પાણીના સંગ્રહ માટે ખેત તલાવડી બનાવવી.',
    'જમીનમાં ભેજ સંરક્ષણ કરવા માટેની તાલીમો કરવી.',
    'ખેડૂતના ખેતર પર ભેજ જાળવણી માટેના નિદર્શનો ગોઠવવા.',
    'અસરગ્રસ્ત ગામોના ખેડૂતોને પ્રગતિશીલ ખેડૂતોના ખેતર પર \'ફિલ્ડ ડે\' નું આયોજન કરવું.',
    'સરકારશ્રીની વિવિધ સિંચાઇ તેમજ ખેતીલક્ષી યોજનાઓની માહિતી ખેડૂતો સુધી પહોંચાડવી.',
  ];

  // ── Crop Stress Status ─────────────────────────────────────────────────────
  readonly cropStressDesc = 'જૂનાગઢ જિલ્લાના જૂનાગઢ તાલુકાના ગામોમાં ખેતીપાકોના સ્વાસ્થ્યનો સેટેલાઈટ આધારિત અહેવાલ નીચે મુજબ છે.';
  readonly cropStressBadge = 'Low Stress';
  readonly cropStressPanelTitle = 'સારાંશ';
  readonly cropStressSatelliteText = 'સેટેલાઈટ અહેવાલ મુજબ તાલુકાના મુખ્ય પાકોમાં તણાવ હોવાની શક્યતા નહીવત્ત છે, તેમ છતાં પાકોનું યોગ્ય નિરીક્ષણ કરી, જો નીચે જણાવેલ પૈકી કોઈ તણાવ જોવા મળે તો તેના નિવારણ માટે નીચે જણાવેલ પગલાં લેવા.';

  readonly cropStressStats: { value: string; label: string }[] = [
    { value: '0',  label: 'ભારે તણાવyukt (પાણીની ખેંચ/ રોગ જીવાત/ પોષક તત્વોની ઉણપ ધરાવતા) ગામો' },
    { value: '2',  label: 'મધ્યમ તણાવyukt ગામો' },
    { value: '0',  label: 'આંશિક તણાવyukt ગામો' },
    { value: '60', label: 'પાકનું સારું સ્વાસ્થ્ય ધરાવતા ગામો' },
  ];

  readonly cropStressBullets: string[] = [
    'બાજરાનો પાક વાનસ્પતિક વૃદ્ધિ અવસ્થાએ હોવાથી ભેજની ખેંચ જણાય તો જરૂરિયાત મુજબ પિયત આપવું.',
    'જુવારનો પાક વાનસ્પતિક વૃદ્ધિ અવસ્થાએ હોવાથી ભેજની ખેંચ જણાય તો જરૂરિયાત મુજબ પિયત આપવું.',
    'તલનો પાક વાનસ્પતિક વૃદ્ધિ અવસ્થાએ હોવાથી ભેજની ખેંચ જણાય તો જરૂરિયાત મુજબ પિયત આપવું.',
    'અડદનો પાક વાનસ્પતિક વૃદ્ધિ અવસ્થાએ હોવાથી ભેજની ખેંચ જણાય તો જરૂરિયાત મુજબ પિયત આપવું તેમજ ચુસીયા જીવાતનો ઉપદ્રવ જણાય તો પાક સરંક્ષણના પગલા લેવા.',
    'મગફળીનો પાક વાનસ્પતિક વૃદ્ધિ અવસ્થાએ હોવાથી ભેજની ખેંચ જણાય તો જરૂરિયાત મુજબ પિયત આપવું તેમજ ચુસીયા જીવાતનો ઉપદ્રવ જણાય તો પાક સરંક્ષણના પગલા લેવા.',
    'અડદનો પાક વાનસ્પતિક વૃદ્ધિ અવસ્થાએ હોવાથી ભેજની ખેંચ જણાય તો જરૂરિયાત મુજબ પિયત આપવું તેમજ ચુસીયા જીવાતનો ઉપદ્રવ જણાય તો પાક સરંક્ષણના પગલા લેવા.',
    'મગફળીનો પાક વાનસ્પતિક વૃદ્ધિ અવસ્થાએ હોવાથી ભેજની ખેંચ જણાય તો જરૂરિયાત મુજબ પિયત આપવું તેમજ ચુસીયા જીવાતનો ઉપદ્રવ જણાય તો પાક સરંક્ષણના પગલા લેવા.',
    'અસરગ્રસ્ત ગામોના ખેડૂતોને પ્રગતિશીલ ખેડૂતોના ખેતર પર \'ફિલ્ડ ડે\' નું આયોજન કરવું.',
  ];

  readonly pestCards: PestCard[] = [
    {
      id: 'pd-bajra',
      name: 'Bajra',
      image: 'assets/images/crop_bajra.png',
      pestType: 'પાનના ટપકા નો રોગ',
      description: 'બાજરી પાકમાં પાનના ટપકાં (લીફ બ્લાસ્ટ)નો રોગ જોવા મળે તો તેના નિયંત્રણ માટે કાર્બેન્ડાઝીમ ૫૦% વે.પા. (૧૦ ગ્રામ/૧૦ લિટર પાણી) નો છંટકાવ કરવો.',
      advisoryItems: this.pestAdvisoryItems,
    },
    {
      id: 'pd-sesamum',
      name: 'Sesamum',
      image: 'assets/images/crop_sesamum.png',
      pestType: 'મોલો,અને થ્રીપ્સ',
      description: 'મોલો અને થ્રીપ્સ ચુસીયા પ્રકારની જીવાત પાનની નીચે રહી રસ ચૂસે છે જેથી છોડ ફીકો પડે છે અને ઉત્પાદન ઘટે છે.',
      advisoryItems: this.pestAdvisoryItems,
    },
    {
      id: 'pd-groundnut',
      name: 'Groundnut',
      image: 'assets/images/crop_sorghum.png',   // TODO: replace with crop_groundnut.png when asset is added
      pestType: 'મોલો / લીલા તડતડીયાં',
      description: 'ચુસીયા જીવાતના પ્રાથમિક નિયંત્રણ માટે લીમડાની લીંબોળીની મીંજમાંથી તૈયાર કરેલ ૫% નો અર્ક અથવા લીમડાનું તેલ ૩૦ મિ.લિ. અથવા લીમડાયુકત તૈયાર દવાઓ ૨૦ મિ.લિ. (૧ ઈસી) થી ૪૦ મિ.લિ. (૦.૧૫ ઈસી) ૧૦ લિટર પાણીમાં ભેળવી છંટકાવ કરવો.',
      advisoryItems: this.pestAdvisoryItems,
    },
    {
      id: 'pd-urid',
      name: 'Urid',
      image: 'assets/images/crop_urid.png',
      pestType: 'મોલો / લીલા તડતડીયાં',
      description: 'બાજરી પાકમાં પાનના ટપકાં (લીફ બ્લાસ્ટ)નો રોગ જોવા મળે તો તેના નિયંત્રણ માટે કાર્બેન્ડાઝીમ ૫૦% વે.પા. (૧૦ ગ્રામ/૧૦ લિટર પાણી) નો છંટકાવ કરવો.',
      advisoryItems: this.pestAdvisoryItems,
    },
  ];
}
