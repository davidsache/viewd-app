import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { SearchResults } from '../results/models/search-results.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  searchResults = new BehaviorSubject<SearchResults>({} as any);

  searchByTitle(title: string) {
    const subscription = this.httpClient.get<SearchResults>('http://www.omdbapi.com/?apikey=8148b372&s=' + title + '&page=1')
      .subscribe(searchResults => this.searchResultsUpdated(searchResults, title));

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  private searchResultsUpdated(newSearchResults: SearchResults, searchTitle: string) {
    newSearchResults.SearchTitle = searchTitle;
    this.searchResults.next(newSearchResults);
  }
}
