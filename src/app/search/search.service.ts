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
  private readonly API_KEY = '8148b372';

  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  private searchData = new BehaviorSubject<SearchResults>({} as any);
  searchData$ = this.searchData.asObservable();

  private resultData = new BehaviorSubject<Result>({} as any);
  resultData$ = this.resultData.asObservable();

  private currentSearchUrl = '';
  private currentSearchTitle = '';
  private currentSearchPage = 1;

  /**
   * Constructs the URL to do a search.
   * @param params Search parameters.
   */
  newSearch(params: SearchParams) {
    this.currentSearchTitle = params.title;
    this.currentSearchUrl = 'http://www.omdbapi.com/?apikey=' + this.API_KEY + '&s=' + this.currentSearchTitle;
    this.currentSearchPage = 1;

    if (params.type !== 'none')
      this.currentSearchUrl += '&type=' + params.type;

    if (params.year !== '')
      this.currentSearchUrl += '&y=' + params.year;

    this.currentSearchUrl += '&page=1'; 
    this.searchRequest();
  }

  /**
   * Fetch data of the specified page (each page means it's going to fetch the next 10 results).
   * @param page Number of the page.
   */
  changeSearchPage(page: number) {
    if (this.currentSearchUrl !== '') {
      this.currentSearchPage = page;
      this.currentSearchUrl = this.currentSearchUrl.split('&page=')[0] + '&page=' + page.toString();
      this.searchRequest();
    }
  }

  /**
   * Sends the search results to whomever is subscribed (ResultsComponent), and navigates to ResultsComponent.
   * @param newSearchResults Object with the result of the search.
   */
  private searchResultsUpdated(newSearchResults: SearchResults) {
    newSearchResults.SearchTitle = this.currentSearchTitle;
    newSearchResults.CurrentPage = this.currentSearchPage;
    
    this.searchData.next(newSearchResults);
    this.router.navigate(['search']);
  }

  /**
   * Sends the content result to whomever is subscribed (ResultItemComponent), and navigates to ResultItemComponent.
   * @param newResult Object with the info of the result.
   */
  private resultUpdated(newResult: Result) {
    this.resultData.next(newResult);
    this.router.navigate(['result']);
  }

  /**
   * Constructs an URL to get content using by its IMDb id, does an GET request, and returns the result to the 
   * components subscribed to it.
   * @param id IMDb id of the content.
   */
  getByImdbId(id: string) {
    const contentUrl = 'http://www.omdbapi.com/?apikey=' + this.API_KEY + '&i=' + id + '&plot=full';

    const subscription = this.httpClient.get<Result>(contentUrl).subscribe(
      result => this.resultUpdated(result)
    );

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  /**
   * GET request to fetch the search results, and returns the results to the components subscribed to it
   */
  private searchRequest() {
    const subscription = this.httpClient.get<SearchResults>(this.currentSearchUrl).subscribe(
      searchResults => this.searchResultsUpdated(searchResults)
    );

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
