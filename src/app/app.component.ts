import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ResultsComponent } from "./results/results.component";
import { SearchService } from './search/search.service';
import { SearchResults } from './results/models/search-results.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private searchService = inject(SearchService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  searchResultsData!: SearchResults;

  ngOnInit() {
    const searchSubscription = this.searchService.searchResults
      .subscribe(searchResults => this.showResults(searchResults));

    this.destroyRef.onDestroy(() => searchSubscription.unsubscribe());
  }

  showResults(searchResults: SearchResults) {
    this.searchResultsData = searchResults;

    if (this.searchResultsData.Response === 'True') {
      this.router.navigate(['results']);
    }
  }

  onOutletLoaded(component: ResultsComponent) {
    if (component instanceof ResultsComponent) {
      component.searchResults = this.searchResultsData;
    }
  }
}
