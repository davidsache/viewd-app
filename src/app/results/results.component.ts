import { Component, DestroyRef, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SearchResults } from './models/search-results.model';
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

  loadResult(id: string) {
    this.searchService.getByImdbId(id);
  }
}
