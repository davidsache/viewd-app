import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { ResultItemComponent } from './results/result-item/result-item.component';
import { ResultsComponent } from './results/results.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ResultSeasonComponent } from './results/result-season/result-season.component';

export const routes: Routes = [
  {
    path: '', 
    component: MainPageComponent
  },
  {
    path: 'search',
    component: ResultsComponent
  },
  {
    path: 'result',
    component: ResultItemComponent
  },
  {
    path: 'season',
    component: ResultSeasonComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
