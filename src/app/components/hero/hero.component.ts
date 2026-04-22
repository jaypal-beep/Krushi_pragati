import { Component, signal, OnInit, OnDestroy, HostListener } from '@angular/core';

interface HeroSlide {
  headingPart1: string;
  headingPart2: string;
  subtext: string;
  image: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit, OnDestroy {
  slides: HeroSlide[] = [
    {
      headingPart1: 'Building Resilient Agriculture with ',
      headingPart2: 'Advanced Monitoring',
      subtext:
        'Protecting crops with timely interventions against moisture stress, pests, and diseases through high-resolution satellite data.',
      image: '/assets/images/hero-1.jpg',
    },
    {
      headingPart1: 'Technology-Driven Farming for a ',
      headingPart2: 'Prosperous Agriculture of Gujarat',
      subtext:
        'Transforming agriculture with advanced technologies (Remote sensing, AI/ML etc.) for accurate crop monitoring, acreage estimation, yield prediction and supporting farmers with advisory.',
      image: '/assets/images/hero-2.jpg',
    },
    {
      headingPart1: 'Connecting Farmers and Agriculture Officials ',
      headingPart2: 'Through Technology',
      subtext:
        'Bridging the gap between farmers and the agriculture department for efficient decision-making and better resource allocation.',
      image: '/assets/images/hero-3.jpg',
    },
  ];

  activeSlide = signal(0);
  isPaused = signal(false);

  private readonly intervalMs = 6000;
  private autoplayTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  @HostListener('mouseenter') onEnter(): void {
    this.isPaused.set(true);
  }

  @HostListener('mouseleave') onLeave(): void {
    this.isPaused.set(false);
  }

  startAutoplay(): void {
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => {
      if (!this.isPaused()) this.nextSlide();
    }, this.intervalMs);
  }

  stopAutoplay(): void {
    if (this.autoplayTimer) clearInterval(this.autoplayTimer);
  }

  nextSlide(): void {
    this.activeSlide.update((i) => (i + 1) % this.slides.length);
  }

  prevSlide(): void {
    this.activeSlide.update((i) => (i - 1 + this.slides.length) % this.slides.length);
    this.restart();
  }

  goToSlide(index: number): void {
    this.activeSlide.set(index);
    this.restart();
  }

  private restart(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }
}
