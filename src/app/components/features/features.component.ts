import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Theme, ThemeService } from '../../services/theme.service';

interface FeatureTab {
  key: string;
  label: string;      // full label e.g. "Crop Acreage\n& Production Monitoring"
  icon: string;
}

interface FeatureCard {
  title: string;
  description: string;
  /** Filename only (theme folder is prepended at render time) */
  imageFile: string;
  link: string;
}

interface FeatureContent {
  title: string;         // e.g. "Crop Acreage & "
  titleAccent: string;   // e.g. "Production Monitoring"
  description: string;
  cards: FeatureCard[];
}

@Component({
  selector: 'app-features',
  standalone: true,
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturesComponent {
  private theme = inject(ThemeService);
  asset = (p: string) => this.theme.asset(p);

  readonly activeKey = signal<string>('crop-acreage');

  private readonly tabIconBase = 'assets/images/Features_Page/tab-icons';

  readonly tabs: FeatureTab[] = [
    { key: 'crop-acreage', label: 'Crop Acreage\n& Production Monitoring', icon: `${this.tabIconBase}/crop-acreage.svg` },
    { key: 'weather',      label: 'Weather\nPattern Monitoring',           icon: `${this.tabIconBase}/weather-pattern.svg` },
    { key: 'crop-loss',    label: 'Crop Loss\nAssessment',                  icon: `${this.tabIconBase}/crop-loss.svg` },
    { key: 'advisory',     label: 'Agricultural\nAdvisory Services',        icon: `${this.tabIconBase}/advisory.svg` },
    { key: 'mobile',       label: 'Krushi Pragati\nMobile Application',     icon: `${this.tabIconBase}/mobile.svg` },
    { key: 'aocc',         label: 'Agriculture Command Control Center (AOCC)', icon: `${this.tabIconBase}/aocc.svg` },
  ];

  /** Theme → subfolder mapping for card GIFs (folders provided by user). */
  private readonly cardThemeFolder: Record<Theme, string> = {
    green: 'Green_Theme',
    blue: 'Blue_Theme',
    orange: 'Saffron_Theme',
    dark: 'Dark_Theme',
  };

  /** Resolve a card image filename to a theme-specific absolute asset path. */
  cardAsset(tabKey: string, filename: string): string {
    const folder = this.cardThemeFolder[this.theme.currentTheme()];
    // Tab key is used as the Figma feature-folder name:
    // crop-acreage → Crop_Acreage_Production_Monitoring
    const folderMap: Record<string, string> = {
      'crop-acreage': 'Crop_Acreage_Production_Monitoring',
    };
    const featureFolder = folderMap[tabKey];
    if (!featureFolder) return '';
    return `assets/images/Features_Page/${featureFolder}/${folder}/${filename}`;
  }

  private readonly contentMap: Record<string, FeatureContent> = {
    'crop-acreage': {
      title: 'Crop Acreage & ',
      titleAccent: 'Production Monitoring',
      description:
        "The Crop Acreage & Production Monitoring system utilizes advanced technologies to provide accurate, real-time insights across Gujarat. The goal of this system is to support efficient planning and decision-making for farmers, government agencies, and stakeholders. This feature aims to ensure efficient planning and informed decision-making for farmers, government bodies, and stakeholders.",
      cards: [
        {
          title: 'Crop Identification',
          description:
            'Advanced classification algorithms are employed to identify and classify crops, heavily relying on extensive ground data. This process identifies crops at the parcel, village, and gra...',
          imageFile: 'card-1-crop-identification.gif',
          link: '#',
        },
        {
          title: 'Detailed Reports on Major Crops',
          description:
            'Detailed reports are generated for Kharif, Rabi, Summer, and Horticulture-Fruit crops, including:',
          imageFile: 'card-2-detailed-reports.gif',
          link: '#',
        },
        {
          title: 'Real-Time Crop Acreage Estimation',
          description:
            "Real-time monitoring and sowing information across Gujarat's districts simplify efficient resource allocation and agricultural planning. The analysis of historical data throug...",
          imageFile: 'card-3-real-time-estimation.gif',
          link: '#',
        },
        {
          title: 'Crop Yield Modelling and Production Forecasting',
          description:
            'Predictive analyses and satellite data are used for crop production. Advanced models integrate crop spectral signatures, weather patterns, agricultural science, and mor...',
          imageFile: 'card-4-crop-yield-modelling.gif',
          link: '#',
        },
      ],
    },
    'weather': {
      title: 'Weather ',
      titleAccent: 'Pattern Monitoring',
      description:
        'Detailed content for Weather Pattern Monitoring will be available here. This section provides real-time weather data, forecasts, and analysis to help farmers and officials make informed decisions.',
      cards: [],
    },
    'crop-loss': {
      title: 'Crop Loss ',
      titleAccent: 'Assessment',
      description:
        'Content describing Crop Loss Assessment methodologies, data collection, and farmer support programs.',
      cards: [],
    },
    'advisory': {
      title: 'Agricultural ',
      titleAccent: 'Advisory Services',
      description:
        'Comprehensive advisory services covering crop selection, pest management, and modern farming practices.',
      cards: [],
    },
    'mobile': {
      title: 'Krushi Pragati ',
      titleAccent: 'Mobile Application',
      description:
        'The Krushi Pragati mobile application brings key features to farmers on the go, in regional languages.',
      cards: [],
    },
    'aocc': {
      title: 'Agriculture Command ',
      titleAccent: 'Control Center (AOCC)',
      description:
        'AOCC is the central monitoring and control facility that coordinates agricultural operations across the state.',
      cards: [],
    },
  };

  readonly activeContent = computed<FeatureContent>(() => this.contentMap[this.activeKey()]);

  setActive(key: string): void {
    this.activeKey.set(key);
  }
}
