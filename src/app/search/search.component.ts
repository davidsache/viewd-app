import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from './search.service';
import { NumbersOnlyDirective } from './number-restrict.directive';
import { SearchParams } from '../models/search-params';

@Component({
  selector: 'app-search',
  imports: [FormsModule, NumbersOnlyDirective],
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  showSortOptions = false;
  searchTitle = '';
  searchYear = '';
  searchType: 'movie' | 'series' | 'episode' | 'none' = 'none';
  private searchService = inject(SearchService);

  /**
   * When the form is "submitted", run service method to begin the search.
   */
  onSubmit() {
    const searchParams: SearchParams = {
      title: this.searchTitle,
      year: this.searchYear,
      type: this.searchType
    }

    this.searchService.newSearch(searchParams);
  }

  /**
   * Show/hide more search sorting options.
   */
  toggleSortOptions() {
    this.showSortOptions = !this.showSortOptions;
  }
}
