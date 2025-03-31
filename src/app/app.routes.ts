import { Routes } from '@angular/router';
import { NoResultsComponent } from './no-results/no-results.component';
import { ResultsComponent } from './results/results.component';

export const routes: Routes = [
  {
    path: '', 
    component: NoResultsComponent
  },
  {
    path: 'results',
    component: ResultsComponent
  },
];
