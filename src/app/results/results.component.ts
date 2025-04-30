import { Component, computed, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { SearchResults } from '../models/search-results.model';
import { OmdbApiService } from '../services/omdb-api.service';
import { DarkModeService } from '../services/dark-mode.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: true,
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent implements OnInit {
  @Input({ required: true }) searchResults!: SearchResults;
  private omdbApiService = inject(OmdbApiService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  darkModeService = inject(DarkModeService);

  ngOnInit() {
    const subscription = this.omdbApiService.searchData$
      .subscribe(searchData => this.searchResultsReceived(searchData));

    this.destroyRef.onDestroy(() => subscription.unsubscribe);
  }

  /**
   * Receives the search results, and if they are "undefined" navigate back to main page.
   * @param searchData Object with the search results data.
   */
  private searchResultsReceived(searchData: SearchResults) {
    this.searchResults = searchData;

    if (Object.keys(this.searchResults).length === 0)
      this.router.navigate(['']);
  }

  /**
   * Returns whether it should show the page navigation buttons.
   * @returns True if more than one page (more than 10 search results).
   */
  shouldHavePages(): boolean {
    if (parseInt(this.searchResults.totalResults) > 10)
      return true;

    return false;
  }

  /**
   * Returns the total number of pages that can be navigated to, according to the total results.
   * @returns Total number of pages.
   */
  totalPages(): number {
    return Math.ceil(parseInt(this.searchResults.totalResults) / 10);
  }

  /**
   * Navigates to a page.
   * @param page Navigates to the page specified out of the 4 posible values.
   */
  navigateToPage(page: 'next' | 'prev' | 'first' | 'last') {
    switch (page) {
      case 'next': {
        if (this.searchResults.CurrentPage < parseInt(this.searchResults.totalResults) / 10)
          this.omdbApiService.changeSearchPage(this.searchResults.CurrentPage + 1);

        break;
      }
      case 'prev': {
        if (this.searchResults.CurrentPage !== 1)
          this.omdbApiService.changeSearchPage(this.searchResults.CurrentPage - 1);

        break;
      }
      case 'first': {
        if (this.searchResults.CurrentPage !== 1)
          this.omdbApiService.changeSearchPage(1);

        break;
      }
      case 'last': {
        if (this.searchResults.CurrentPage !== this.totalPages())
          this.omdbApiService.changeSearchPage(this.totalPages());

        break;
      }
    }
  }

  /**
   * Loads the clicked content.
   * @param id IMDb id of the clicked content.
   */
  loadResult(id: string) {
    this.omdbApiService.getByImdbId(id);
  }
}
