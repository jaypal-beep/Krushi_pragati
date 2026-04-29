import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { AgricultureScenarioComponent } from '../agriculture-scenario/agriculture-scenario.component';
import { OfferingsComponent } from '../offerings/offerings.component';
import { SmartDecisionsComponent } from '../smart-decisions/smart-decisions.component';
import { ObjectivesComponent } from '../objectives/objectives.component';
import { InsightsAdvisoriesComponent } from '../insights-advisories/insights-advisories.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    AgricultureScenarioComponent,
    OfferingsComponent,
    SmartDecisionsComponent,
    ObjectivesComponent,
    InsightsAdvisoriesComponent,
  ],
  template: `
    <app-hero />
    <app-agriculture-scenario />
    <app-offerings />
    <div class="cta-section">
      <app-smart-decisions />
      <app-objectives />
    </div>
    <app-insights-advisories />
  `,
  styles: [`
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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
