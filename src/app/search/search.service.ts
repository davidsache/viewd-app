import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { Result } from '../models/result.model'
import { SearchResults } from '../models/search-results.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { SearchParams } from '../models/search-params';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  private searchData = new BehaviorSubject<SearchResults>({} as any);
  searchData$ = this.searchData.asObservable();

  private resultData = new BehaviorSubject<Result>({} as any);
  resultData$ = this.resultData.asObservable();

  /**
   * Does a search using the title, and returns the results to the components subscribed to it.
   * @param params Search parameters.
   */
  search(params: SearchParams) {
    let searchUrl = 'http://www.omdbapi.com/?apikey=8148b372&s=' + params.title;

    if (params.type !== 'none')
      searchUrl += '&type=' + params.type;

    if (params.year !== '')
      searchUrl += '&y=' + params.year

    const subscription = this.httpClient.get<SearchResults>(searchUrl + '&page=1').subscribe(
      searchResults => this.searchResultsUpdated(searchResults, params.title)
    );

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  /**
   * Gets a movie/show using its Imdb ID, and returns the result to the components subscribed to it.
   * @param id Imdb ID of the movie/show.
   */
  getByImdbId(id: string) {
    const subscription = this.httpClient.get<Result>('http://www.omdbapi.com/?apikey=8148b372&i=' + id + '&plot=full')
      .subscribe(result => this.resultUpdated(result));

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  /**
   * Sends the search results to whomever is subscribed (ResultsComponent), and navigates to ResultsComponent.
   * @param newSearchResults Object with the result of the search.
   * @param searchTitle Title of what was searched.
   */
  private searchResultsUpdated(newSearchResults: SearchResults, searchTitle: string) {
    newSearchResults.SearchTitle = searchTitle;
    this.searchData.next(newSearchResults);
    this.router.navigate(['search']);
  }

  /**
   * Sends the movie/show result to whomever is subscribed (ResultItemComponent), and navigates to ResultItemComponent.
   * @param newResult Object with the info of the result.
   */
  private resultUpdated(newResult: Result) {
    this.resultData.next(newResult);
    this.router.navigate(['result']);
  }
}
