import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OmdbApiService } from '../services/omdb-api.service';
import { NumbersOnlyDirective } from '../directives/numbers-only.directive';
import { SearchParams } from '../models/search-params.model';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'app-search',
  imports: [FormsModule, NumbersOnlyDirective],
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  private omdbApiService = inject(OmdbApiService);
  darkModeService = inject(DarkModeService);
  showSortOptions = false;
  searchTitle = '';
  searchYear = '';
  searchType: 'movie' | 'series' | 'episode' | 'none' = 'none';

  /**
   * When the form is "submitted", run service method to begin the search.
   */
  onSubmit() {
    const searchParams: SearchParams = {
      title: this.searchTitle,
      year: this.searchYear,
      type: this.searchType
    }

    this.omdbApiService.newSearch(searchParams);
  }

  /**
   * Show/hide more search sorting options.
   */
  toggleSortOptions() {
    this.showSortOptions = !this.showSortOptions;
  }
}
