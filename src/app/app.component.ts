import { Component, HostListener, signal } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AgricultureScenarioComponent } from './components/agriculture-scenario/agriculture-scenario.component';
import { OfferingsComponent } from './components/offerings/offerings.component';
import { SmartDecisionsComponent } from './components/smart-decisions/smart-decisions.component';
import { ObjectivesComponent } from './components/objectives/objectives.component';
import { InsightsAdvisoriesComponent } from './components/insights-advisories/insights-advisories.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    AgricultureScenarioComponent,
    OfferingsComponent,
    SmartDecisionsComponent,
    ObjectivesComponent,
    InsightsAdvisoriesComponent,
    FooterComponent,
  ],
  template: `
    <app-navbar />
    <main>
      <app-hero />
      <app-agriculture-scenario />
      <app-offerings />
      <div class="cta-section">
        <app-smart-decisions />
        <app-objectives />
      </div>
      <app-insights-advisories />
    </main>
    <app-footer />

    <!-- Sticky floating buttons (bottom-right) -->
    <div class="sticky-fab" aria-label="Quick actions">
      <button
        type="button"
        class="fab fab--top"
        [class.fab--visible]="showBackToTop()"
        (click)="scrollToTop()"
        aria-label="Scroll to top"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M9 14V4M4 9l5-5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button type="button" class="fab fab--access" aria-label="Accessibility options">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="4" r="2" />
          <path d="M5 9l4 1v5l-1 6h2l1-5 1 5h2l-1-6v-5l4-1V7l-5 1h-2l-5-1z" />
        </svg>
      </button>
    </div>
  `,
  styles: [
    `
      .cta-section {
        position: relative;
        background: url('/assets/images/CTA_Background.jpg') center / cover no-repeat;
        background-color: #9fbe98;
        overflow: hidden;
      }
      .cta-section::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, var(--primary-light) 0%, transparent 18%);
        pointer-events: none;
        z-index: 0;
      }
      .cta-section::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 55%;
        width: 140%;
        height: 680px;
        transform: translateX(-50%);
        background: radial-gradient(ellipse at center, rgba(7, 20, 5, 0.7) 0%, rgba(7, 20, 5, 0) 70%);
        filter: blur(60px);
        pointer-events: none;
        z-index: 0;
      }
      .cta-section > * { position: relative; z-index: 1; }

      /* ---- Sticky floating action buttons (bottom-right) ---- */
      .sticky-fab {
        position: fixed;
        right: 20px;
        bottom: 24px;
        z-index: 998;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .fab {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.3s ease, visibility 0.3s;
      }

      .fab:hover {
        transform: scale(1.08);
        box-shadow: 0 8px 22px rgba(0, 0, 0, 0.35);
      }

      .fab:active { transform: scale(0.95); }

      .fab--top {
        background: #ffffff;
        color: var(--primary, #17412c);
        opacity: 0;
        visibility: hidden;
        transform: translateY(12px);
      }

      .fab--top.fab--visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .fab--access {
        background: var(--highlight, #6fd460);
        color: var(--login-text, var(--primary, #17412c));
      }

      @media (max-width: 560px) {
        .sticky-fab { right: 14px; bottom: 18px; gap: 10px; }
        .fab { width: 42px; height: 42px; }
      }
    `,
  ],
})
export class AppComponent {
  readonly showBackToTop = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.showBackToTop.set(window.scrollY > 400);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
