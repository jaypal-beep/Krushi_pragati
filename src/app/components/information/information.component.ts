import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

interface FeatureTab {
  key: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-information',
  standalone: true,
  templateUrl: './information.component.html',
  styleUrl: './information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationComponent {
  private theme = inject(ThemeService);
  asset = (p: string) => this.theme.asset(p);

  private readonly iconBase = 'assets/images';

  readonly tabs: FeatureTab[] = [
    { key: 'crop-acreage',  label: 'Crop\nAcreage Estimation',                    icon: `${this.iconBase}/Crop_Acerage_Estimation.svg` },
    { key: 'crop-yield',    label: 'Crop Yield\nModelling and Production',         icon: `${this.iconBase}/Crop_Yield_Modelling_and_Production.svg` },
    { key: 'droughts',      label: 'Monitoring\nof Droughts',                      icon: `${this.iconBase}/Monitoring_Droughts.svg` },
    { key: 'flood',         label: 'Flood\nMapping & Monitoring',                  icon: `${this.iconBase}/Flood_Mapping_and_Monitoring.svg` },
    { key: 'crop-loss',     label: 'Crop Loss\nAssessment',                        icon: `${this.iconBase}/Crop_Loss_Assessment.svg` },
    { key: 'pest-disease',  label: 'Identification of\nPest and Disease Infestation', icon: `${this.iconBase}/Identification_of_Pest_and_Disease.svg` },
  ];

  readonly activeKey = signal<string>('crop-acreage');

  setActive(key: string): void {
    this.activeKey.set(key);
  }

  /**
   * Returns the correct Information card image path for the active theme.
   * Dark theme uses _Drk / _Dark suffix variants; all light themes share the base image.
   */
  cardImage(name: string): string {
    const isDark = this.theme.currentTheme() === 'dark';
    if (isDark) {
      const suffix = name === 'Cotton_Crop_Ahmedabad' ? '_Drk' : '_Dark';
      return `assets/images/Information/${name}${suffix}.png`;
    }
    return `assets/images/Information/${name}.png`;
  }
}
