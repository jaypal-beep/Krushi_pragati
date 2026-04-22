import { Component, inject, signal } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

interface Offering {
  key: string;
  iconDefault: string;
  iconHover: string;
  title: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-offerings',
  standalone: true,
  templateUrl: './offerings.component.html',
  styleUrl: './offerings.component.scss',
})
export class OfferingsComponent {
  private theme = inject(ThemeService);
  asset = (p: string) => this.theme.asset(p);

  /** Which offering is currently highlighted (hovered OR default). */
  activeKey = signal<string>('left-top');

  treeImage = 'assets/images/What_We_Offer_Tree.svg';

  leftOfferings: Offering[] = [
    {
      key: 'left-top',
      iconDefault: 'assets/images/Crop_Acreage_Production_Monitoring_Default.svg',
      iconHover: 'assets/images/Crop_Acreage_Production_Monitoring_Hover.svg',
      title: 'Crop Acreage & Production Monitoring',
      description:
        'Real-time crop acreage evaluation and yield forecasting provide accurate information…',
      link: '#',
    },
    {
      key: 'left-mid',
      iconDefault: 'assets/images/Crop Loss_Assessment_Default.svg',
      iconHover: 'assets/images/Crop Loss_Assessment_Hover.svg',
      title: 'Crop Loss\nAssessment',
      description:
        'The primary goal of the Crop Damage Assessment system is to provide accurate and detailed…',
      link: '#',
    },
    {
      key: 'left-bot',
      iconDefault: 'assets/images/Krushi_Pragati_Mobile_Application_Default.svg',
      iconHover: 'assets/images/Krushi_Pragati_Mobile_Application_Hover.svg',
      title: 'Krushi Pragati Mobile Application',
      description:
        "The 'Krushi Pragati' mobile app opens the door to accurate information, quick solutions…",
      link: '#',
    },
  ];

  rightOfferings: Offering[] = [
    {
      key: 'right-top',
      iconDefault: 'assets/images/Weather_Pattern_Monitoring_Default.svg',
      iconHover: 'assets/images/Weather_Pattern_Monitoring_Hover.svg',
      title: 'Weather Pattern\nMonitoring',
      description:
        'The Weather Pattern Monitoring feature leverages advanced technology to analyze and predict…',
      link: '#',
    },
    {
      key: 'right-mid',
      iconDefault: 'assets/images/Agricultural_Advisory_Services_Default.svg',
      iconHover: 'assets/images/Agricultural_Advisory_Services_Hover.svg',
      title: 'Agricultural Advisory\nServices',
      description:
        'The Agricultural Advisory Services provide data-driven, scientific guidance to all stakeholders…',
      link: '#',
    },
    {
      key: 'right-bot',
      iconDefault: 'assets/images/AOCC_Default.svg',
      iconHover: 'assets/images/AOCC_Hover.svg',
      title: 'Agriculture Command Control Center (AOCC)',
      description:
        'The Krushi Pragati Agriculture Command Control Center (AOCC) is envisioned as a centralized…',
      link: '#',
    },
  ];

  activate(key: string): void {
    this.activeKey.set(key);
  }
}
