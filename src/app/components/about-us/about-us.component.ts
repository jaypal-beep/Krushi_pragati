import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

interface Stat { value: string; label: string; }
interface Responsibility { title: string; titleAccent?: string; description: string; }

@Component({
  selector: 'app-about-us',
  standalone: true,
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUsComponent {
  private theme = inject(ThemeService);
  asset = (p: string) => this.theme.asset(p);

  stats: Stat[] = [
    { value: '95%',  label: 'Data Accuracy Insights' },
    { value: '5M+',  label: 'Crop Coverage' },
    { value: '20K+', label: 'Farmer Reach to Our App' },
  ];

  /**
   * 2-row layout per Figma Frame 24 (59:10873):
   *   Row 1 (Frame 78): 2 text blocks (LEFT) | farmer image (RIGHT)
   *   Row 2 (Frame 81): aerial field image (LEFT) | 3 text blocks (RIGHT)
   */
  respRow1: Responsibility[] = [
    {
      title: 'Key',
      titleAccent: ' Responsibilities',
      description:
        'Key Responsibilities of the Directorate include policy formulation, promoting sustainable farming practices, maintaining soil health, managing water resources, establishing robust market linkages, offering assistance packages and agricultural loans, and developing safe farming methods to address climate change and natural disasters.',
    },
    {
      title: 'Technology and',
      titleAccent: ' Research',
      description:
        'Technology and Research are vital for supporting farmers. The Directorate actively promotes organic farming, remote sensing, GIS technology, agricultural machinery, and smart farming techniques. It also employs satellite imagery, data analytics, and remote sensing methods to monitor crop production. Moreover, the Directorate provides farmers with guidance on crop selection, fertilizer management, crop protection, and irrigation planning.',
    },
  ];

  respRow2: Responsibility[] = [
    {
      title: 'Water Management and',
      titleAccent: ' Irrigation',
      description:
        'Water Management and Irrigation are critical aspects. The Directorate collaborates with the state government and water resource departments to develop advanced irrigation methods (such as drip and sprinkler irrigation), rainwater harvesting, and water-saving techniques. The focus is on creating strong, sustainable irrigation systems and water management plans for farmers.',
    },
    {
      title: 'Agricultural Market',
      titleAccent: ' Management',
      description:
        'Agricultural Market Management is another core function of the Directorate. Ensuring that farmers receive fair market prices, it implements market linkages and export assistance schemes.',
    },
    {
      title: 'Farmer Assistance and',
      titleAccent: ' Safety Programs',
      description:
        "Farmer Assistance and Safety Programs, including natural disaster relief packages, are central to the Directorate's initiatives. These programs help farmers mitigate future risks and maintain financial stability.",
    },
  ];
}
