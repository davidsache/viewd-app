import { Component, computed, DestroyRef, inject, Input, OnChanges } from '@angular/core';
import { Result } from '../../models/result.model';
import { OmdbApiService } from '../../services/omdb-api.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { UserInteractionsService } from '../../services/user-interactions.service';
import { RatingComponent } from "../../rating/rating.component";
import { ListsService } from '../../services/lists-modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result-item',
  imports: [RatingComponent],
  templateUrl: './result-item.component.html',
  styleUrl: './result-item.component.css'
})
export class ResultItemComponent implements OnChanges {
  private userInteractionsService = inject(UserInteractionsService);
  private omdbApiService = inject(OmdbApiService);
  private listsService = inject(ListsService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  darkModeService = inject(DarkModeService);
  @Input({ required: true }) result!: Result;
  seasonsNumber?: number[];
  tab: 'cast' | 'details' | 'off' = 'off';
  isFavoriteAlready = false;
  addedToWatched = false;

  imagePoster = computed(() => this.result.Poster !== 'N/A' ? this.result.Poster : './no-image.png');
  svgFillWatched = computed(() => this.darkModeService.darkModeOn() ? '#3cb371' : '#32cd32');
  svgFillFavorite = computed(() => this.darkModeService.darkModeOn() ? '#ff0000' : '#d10000');
  svgFillAddToList = computed(() => this.darkModeService.darkModeOn() ? '#007bd1' : '#1e90ff');

  ngOnInit() {
    const subscription = this.omdbApiService.resultData$
      .subscribe(result => this.resultReceived(result));

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  /**
   * When there is a change in the page, reset the tab to off.
   */
  ngOnChanges() {
    if (this.tab !== 'off')
      this.tabStatus('off');
  }

  /**
   * Receives result, and checks whether it was watched today, and also if it is a series (to show it's seasons).
   * @param result Content of the result.
   */
  private resultReceived(result: Result) {
    this.result = result;

    if (Object.keys(this.result).length === 0) {
      this.router.navigate(['']);
    }
    else {
      this.addedToWatched = this.userInteractionsService.findIfWatchedToday(this.result.imdbID);

      if (this.result.Type === 'series' && this.result.totalSeasons !== undefined) {
        this.seasonsNumber = Array.from({ length: parseInt(this.result.totalSeasons) }, (_, i) => i + 1);
      }
      
      this.isFavoriteAlready = this.userInteractionsService.findFavorite(this.result.imdbID);
    }
  }

  /**
   * Gets a season of a show.
   * @param seasonNumber Number of the season.
   */
  loadSeason(seasonNumber: number) {
    this.omdbApiService.fetchShowSeason(this.result.imdbID, seasonNumber);
  }
  
  /**
   * Change the info tab status.
   * @param status 'cast': Show tab with the cast info / 'details': Shows tab with info about the content / 'off': Hides the tab completely.
   */
  tabStatus(status: 'cast' | 'details' | 'off') {
    this.tab === status ? this.tab = 'off' : this.tab = status;
  }

  /**
   * Returns text according with the content rating.
   * @returns Text according to the rating.
   */
  ratedText(): string {
    switch (this.result.Rated) {
      case 'G':
        return '(Todas las edades)';

      case 'PG':
        return '(Se sugiere la orientación de los padres)';

      case 'PG-13':
        return '(No recomendado a menores de 13 años)';

      case 'R': 
        return '(No recomendado a menores de 17 años)';

      case 'NC-17':
        return '(Recomendado a partir de 18 años)';

      case 'TV-PG':
        return '(7-10 años en adelante)';
    
      case 'TV-14':
        return '(14 años en adelante)';
    
      case 'TV-MA':
        return '(17-18 años en adelante)';
    
      default:
        return '';
    }
  }

  /**
   * Add content to the favorites tab.
   */
  addFavorite() {
    this.isFavoriteAlready = !this.isFavoriteAlready;
    this.userInteractionsService.addFavorite({
      imdbID: this.result.imdbID,
      Title: this.result.Title,
      Year: this.result.Year,
      Type: this.result.Type,
      Poster: 'N/A'
    });
  }

  /**
   * Add content to the watched tab, or removes it if it was logged today.
   */
  addToWatched() {
    if (!this.addedToWatched) {
      this.addedToWatched = true;
      this.userInteractionsService.addWatched(this.result);
    }
    else {
      this.addedToWatched = false;
      this.userInteractionsService.removeWatched(this.result.imdbID , new Date().toDateString());
    }
  }

  addContentToList(content: Result) {
    this.listsService.contentToAdd(content);
  }
}
