import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

interface IconCard {
  icon: string;
  label: string;
}

@Component({
  selector: 'app-insights-advisories',
  standalone: true,
  templateUrl: './insights-advisories.component.html',
  styleUrl: './insights-advisories.component.scss',
})
export class InsightsAdvisoriesComponent {
  private theme = inject(ThemeService);
  asset = (p: string) => this.theme.asset(p);

  insights: IconCard[] = [
    { icon: 'assets/images/Crop_Acerage_Estimation.svg', label: 'Crop Acerage\nEstimation' },
    {
      icon: 'assets/images/Crop_Yield_Modelling_and_Production.svg',
      label: 'Crop Yield Modelling\nand Production',
    },
    { icon: 'assets/images/Monitoring_Droughts.svg', label: 'Monitoring of\nDroughts' },
    {
      icon: 'assets/images/Flood_Mapping_and_Monitoring.svg',
      label: 'Flood Mapping and\nMonitoring',
    },
    { icon: 'assets/images/Crop_Loss_Assessment.svg', label: 'Crop Loss\nAssessment' },
    {
      icon: 'assets/images/Identification_of_Pest_and_Disease.svg',
      label: 'Identification of Pest\nand Disease',
    },
  ];

  advisories: IconCard[] = [
    { icon: 'assets/images/Weather_pattern_Advisory.svg', label: 'Weather pattern\nAdvisory' },
    { icon: 'assets/images/Crop_Advisory.svg', label: 'Crop\nAdvisory' },
    {
      icon: 'assets/images/Pest_and_Disease_Infestation.svg',
      label: 'Pest and Disease\nInfestation',
    },
    { icon: 'assets/images/Soil_Moisture_Status.svg', label: 'Soil Moisture\nStatus' },
    { icon: 'assets/images/Crop_Stress_Status.svg', label: 'Crop Stress\nStatus' },
    { icon: 'assets/images/Generalised_Bulletins.svg', label: 'Generalised\nBulletins' },
  ];
}
