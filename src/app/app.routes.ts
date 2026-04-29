import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { FeaturesComponent } from './components/features/features.component';
import { InformationComponent } from './components/information/information.component';
import { FarmerCornerBulletinsComponent } from './components/farmer-corner-bulletins/farmer-corner-bulletins.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'information', component: InformationComponent },
  { path: 'farmer-corner/bulletins', component: FarmerCornerBulletinsComponent },
  { path: '**', redirectTo: '' },
];
