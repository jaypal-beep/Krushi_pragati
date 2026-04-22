import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

interface Objective {
  image: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-objectives',
  standalone: true,
  templateUrl: './objectives.component.html',
  styleUrl: './objectives.component.scss',
})
export class ObjectivesComponent {
  private theme = inject(ThemeService);
  asset = (p: string) => this.theme.asset(p);

  scroller = viewChild<ElementRef<HTMLDivElement>>('scroller');

  canPrev = signal(false);
  canNext = signal(true);

  objectives: Objective[] = [
    {
      image: 'assets/images/Crop_Acreage_Production_Monitoring.jpg',
      title: 'Crop Acreage &\nProduction Monitoring',
      description:
        'Providing timely guidance to farmers to mitigate climate impacts, promote sustainable development, and enhance income.',
    },
    {
      image: 'assets/images/Real_Time_Data.jpg',
      title: 'Real-Time\nData',
      description:
        "Enhance the agriculture department's decision-making capabilities by equipping them with real-time data from advanced remote sensing.",
    },
    {
      image: 'assets/images/Geospatial_Information_Integration.jpg',
      title: 'Geospatial\nInformation Integration',
      description:
        "To strengthen research, agricultural extension activities, and education in the state's agricultural universities, develop geospatial data and algorithms.",
    },
    {
      image: 'assets/images/Cluster_Wise_Crop_Health_Assessment.jpg',
      title: 'Cluster-Wise Crop Health\nAssessment',
      description:
        'Use satellite imagery and AI to assess real-time crop health in different regions.',
    },
    {
      image: 'assets/images/Tailored_Real_Time_Advisories.jpg',
      title: 'Tailored Real-Time\nAdvisories',
      description:
        'Local advisory recommendations for farmers to improve agricultural practices and outcomes based on real-time data.',
    },
  ];

  scroll(direction: 'prev' | 'next'): void {
    const el = this.scroller()?.nativeElement;
    if (!el) return;
    const delta = (direction === 'next' ? 1 : -1) * (el.clientWidth * 0.9);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  }

  onScroll(): void {
    const el = this.scroller()?.nativeElement;
    if (!el) return;
    this.canPrev.set(el.scrollLeft > 4);
    this.canNext.set(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }
}
