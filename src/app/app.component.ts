import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AccessibilityPanelComponent } from './components/accessibility-panel/accessibility-panel.component';
import { AccessibilityService } from './services/accessibility.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    AccessibilityPanelComponent,
  ],
  template: `
    <app-navbar />
    <main>
      <router-outlet />
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
      <button type="button" class="fab fab--access" aria-label="Accessibility options" (click)="openA11y()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="4" r="2" />
          <path d="M5 9l4 1v5l-1 6h2l1-5 1 5h2l-1-6v-5l4-1V7l-5 1h-2l-5-1z" />
        </svg>
      </button>
    </div>

    <!-- Accessibility slide-in panel (fixed overlay) -->
    <app-accessibility-panel />
  `,
  styles: [
    `
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
  private a11y = inject(AccessibilityService);

  readonly showBackToTop = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.showBackToTop.set(window.scrollY > 400);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openA11y(): void {
    this.a11y.open();
  }
}
