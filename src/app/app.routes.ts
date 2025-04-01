import { Routes } from '@angular/router';
import { NoResultsComponent } from './no-results/no-results.component';
import { ResultItemComponent } from './results/result-item/result-item.component';
import { ResultsComponent } from './results/results.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  {
    path: '', 
    component: NoResultsComponent
  },
  {
    path: 'search',
    component: ResultsComponent
  },
  {
    path: 'result',
    component: ResultItemComponent,
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
