import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

interface ScenarioCard {
  iconDefault: string;
  iconHover: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
}

@Component({
  selector: 'app-agriculture-scenario',
  standalone: true,
  templateUrl: './agriculture-scenario.component.html',
  styleUrl: './agriculture-scenario.component.scss',
})
export class AgricultureScenarioComponent {
  private theme = inject(ThemeService);
  asset = (p: string) => this.theme.asset(p);

  cards: ScenarioCard[] = [
    {
      iconDefault: 'assets/images/Diverse_Topography_Default.svg',
      iconHover: 'assets/images/Diverse_Topography_Hover.svg',
      title: 'Diverse Topography',
      shortDesc: 'Gujarat encompasses a variety of landscapes, ranging from...',
      fullDesc:
        'Gujarat encompasses a variety of landscapes ranging from coastal plains, semi-arid regions to hilly terrains, supporting diverse agricultural practices.',
    },
    {
      iconDefault: 'assets/images/Geographical_Area_Default.svg',
      iconHover: 'assets/images/Geographical_Area_Hover.svg',
      title: 'Geographical Area',
      shortDesc: 'Gujarat having 196 lakh hectares of Geographical area, out of this...',
      fullDesc:
        'Gujarat having 196 lakh hectares of Geographical area, out of this 105 lakh hectares is (54%) under net cultivable.',
    },
    {
      iconDefault: 'assets/images/Agricultural_Extent_Default.svg',
      iconHover: 'assets/images/Agricultural_Extent_Hover.svg',
      title: 'Agricultural Extent',
      shortDesc:
        'Gross cropped area of 147 lakh hectares reflects extensive agricultural activities...',
      fullDesc:
        'Gross cropped area of 147 lakh hectares reflects extensive agricultural activities, with multiple cropping cycles boosting productivity across the state.',
    },
    {
      iconDefault: 'assets/images/Administrative_Division_Default.svg',
      iconHover: 'assets/images/Administrative_Division_Hover.svg',
      title: 'Administrative Division',
      shortDesc: 'Gujarat is divided into more than 33 districts, encompassing over 250...',
      fullDesc:
        'Gujarat is divided into more than 33 districts, encompassing over 250 talukas with a dedicated agricultural administrative structure.',
    },
    {
      iconDefault: 'assets/images/Agro_Climatic_Zones_Default.svg',
      iconHover: 'assets/images/Agro_Climatic_Zones_Hover.svg',
      title: 'Agro Climatic Zones',
      shortDesc: "Gujarat's agro-climatic zones support diverse crops and farming...",
      fullDesc:
        "Gujarat's 8 agro-climatic zones support diverse crops and farming practices spanning arid, semi-arid, coastal and humid regions.",
    },
    {
      iconDefault: 'assets/images/Farmers_Default.svg',
      iconHover: 'assets/images/Farmers_Hover.svg',
      title: 'Farmers',
      shortDesc: 'Gujarat having 196 lakh hectares of Geographical area, out of this...',
      fullDesc:
        'Gujarat is home to millions of farmers cultivating 105 lakh hectares of net cultivable land with a growing focus on sustainable practices.',
    },
    {
      iconDefault: 'assets/images/State_Contribution_Default.svg',
      iconHover: 'assets/images/State_Contribution_Hover.svg',
      title: 'State Contribution',
      shortDesc: "Gujarat plays a leading role in India's cotton, groundnut, and horticulture...",
      fullDesc:
        "Gujarat plays a leading role in India's cotton, groundnut, and horticulture production, contributing substantially to national agricultural GDP.",
    },
    {
      iconDefault: 'assets/images/Weather_Scenario_Default.svg',
      iconHover: 'assets/images/Weather_Scenario_Hover.svg',
      title: 'Weather Scenario',
      shortDesc: "Gujarat's diverse climatic conditions, ranging from arid to coastal...",
      fullDesc:
        "Gujarat's diverse climatic conditions — ranging from arid to coastal — directly influence cropping patterns, irrigation choices and yields.",
    },
  ];
}
