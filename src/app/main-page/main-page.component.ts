import { Component, inject } from '@angular/core';
import { UserInteractionsService } from '../services/user-interactions.service';
import { Favorite } from '../models/favorite.model';
import { SearchService } from '../services/search.service';
import { Watched } from '../models/watched.model';
import { DatePipe } from '@angular/common';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'app-main-page',
  imports: [DatePipe],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  private searchService = inject(SearchService);
  userInteractionService = inject(UserInteractionsService);
  darkModeService = inject(DarkModeService);
  favorites?: Favorite[];
  watched?: Watched[];

  ngOnInit() {
    this.favorites = this.userInteractionService.getFavorites();
    this.watched = this.userInteractionService.getWatched();
  }

  /**
   * Loads the info page of the clicked content.
   * @param imdbID IMDb id of the content.
   */
  goToContent(imdbID: string) {
    this.searchService.getByImdbId(imdbID);
  }

  /**
   * Sort the watched content ascending/descending, by the watched date.
   */
  sortWatched() {
    this.watched = this.userInteractionService.sortWatched();
  }

  removeEntry(imdbID: string, date: string) {
    this.userInteractionService.removeWatched(imdbID, date);
  }

  removeFavorite(imdbID: string) {
    this.userInteractionService.removeFavorite(imdbID);
  }
}
