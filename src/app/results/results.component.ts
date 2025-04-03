import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { SearchResults } from '../models/search-results.model';
import { SearchService } from '../search/search.service';

@Component({
  selector: 'app-results',
  standalone: true,
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent implements OnInit {
  @Input({ required: true }) searchResults!: SearchResults;
  private searchService = inject(SearchService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const searchSubscription = this.searchService.searchData$.subscribe(
      searchData => this.searchResults = searchData
    );

    this.destroyRef.onDestroy(() => searchSubscription.unsubscribe);
  }

  /**
   * Returns wheter it should show the page navigation buttons.
   * @returns True if more than one page (more than 10 results).
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
          this.searchService.changeSearchPage(this.searchResults.CurrentPage + 1);

        break;
      }
      case 'prev': {
        if (this.searchResults.CurrentPage !== 1)
          this.searchService.changeSearchPage(this.searchResults.CurrentPage - 1);

        break;
      }
      case 'first': {
        if (this.searchResults.CurrentPage !== 1)
          this.searchService.changeSearchPage(1);

        break;
      }
      case 'last': {
        if (this.searchResults.CurrentPage !== this.totalPages())
          this.searchService.changeSearchPage(this.totalPages());

        break;
      }
    }
  }

  /**
   * Loads the clicked movie, show etc...
   * @param id Imdb ID of the movie, show...
   */
  loadResult(id: string) {
    this.searchService.getByImdbId(id);
  }
}
