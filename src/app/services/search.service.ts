import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { Result } from '../models/result.model'
import { SearchResults } from '../models/search-results.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { SearchParams } from '../models/search-params.model';
import { Season } from '../models/season.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly API_KEY = '8148b372';
  private readonly BASE_URL = 'http://www.omdbapi.com/';

  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private errorService = inject(ErrorService);
  private router = inject(Router);

  private searchData = new BehaviorSubject<SearchResults>({} as any);
  searchData$ = this.searchData.asObservable();

  private resultData = new BehaviorSubject<Result>({} as any);
  resultData$ = this.resultData.asObservable();

  private seasonData = new BehaviorSubject<Season>({} as any);
  seasonData$ = this.seasonData.asObservable();

  private currentSearchUrl = '';
  private currentSearchTitle = '';
  private currentSearchPage = 1;

  /**
   * Constructs the URL to do a search.
   * @param params Search parameters.
   */
  newSearch(params: SearchParams) {
    this.currentSearchTitle = params.title;
    this.currentSearchUrl = this.BASE_URL + '?apikey=' + this.API_KEY + '&s=' + this.currentSearchTitle;
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
   * Constructs an URL to get content using by its IMDb id, does an GET request, and returns the result to the 
   * components subscribed to it.
   * @param id IMDb id of the content.
   */
  getByImdbId(id: string) {
    const url = this.BASE_URL + '?apikey=' + this.API_KEY + '&i=' + id + '&plot=full';

    const subscription = this.httpClient.get<Result>(url).subscribe({
      next: (result) => this.resultUpdated(result),
      error: (error) => this.errorService.showError(error.message)
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
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
   * GET request to fetch the search results, and returns the results to the components subscribed to it
   */
  private searchRequest() {
    const subscription = this.httpClient.get<SearchResults>(this.currentSearchUrl).subscribe({
      next: (searchResults) => this.searchResultsUpdated(searchResults),
      error: (error) => this.errorService.showError(error.message)
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
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
   * GET request to fetch the season of a show, and returns the result to the components subscribed to it.
   * @param imdbID IMDb id of the series.
   * @param season Number of the season to fetch.
   */
  fetchShowSeason(imdbID: string, season: number) {
    const url = this.BASE_URL + '?apikey=' + this.API_KEY + '&i=' + imdbID + '&Season=' + season.toString();

    const subscription = this.httpClient.get<Season>(url).subscribe({
      next: (season) => this.showSeasonUpdated(season),
      error: (error) => this.errorService.showError(error.message)
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  /**
   * Sends the season result to whomever is subscribed (ResultSeasonComponent), and navigates to ResultSeasonComponent.
   * @param season Object with the season content.
   */
  showSeasonUpdated(season: Season) {
    this.seasonData.next(season);
    this.router.navigate(['season']);
  }
}
