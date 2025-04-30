import { Component, DestroyRef, inject, Input } from '@angular/core';
import { UserInteractionsService } from '../../services/user-interactions.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { List } from '../../models/list.model';
import { OmdbApiService } from '../../services/omdb-api.service';
import { ContentDataModel } from '../../models/content-data.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result-list',
  imports: [],
  templateUrl: './result-list.component.html',
  styleUrl: './result-list.component.css'
})
export class ResultListComponent {
  private userInteractionsService = inject(UserInteractionsService);
  private omdbApiService = inject(OmdbApiService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  darkModeService = inject(DarkModeService);
  @Input({ required: true }) list!: List;
  favorites: ContentDataModel[] = [];

  ngOnInit() {
    const subscription = this.userInteractionsService.listData$
      .subscribe(list => this.listReceived(list));

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  /**
   * Receives the list, and if it's "undefined" navigate back to main page.
   * @param list Object with the list data.
   */
  private listReceived(list: List) {
    this.list = list;

    if (Object.keys(this.list).length === 0)
      this.router.navigate(['']);
  }

  /**
   * Loads the clicked content.
   * @param imdbID IMDb id of the content.
   */
  loadContent(imdbID: string) {
    this.omdbApiService.getByImdbId(imdbID);
  }

  /**
   * Gets whether a content is marked as favorite or not.
   * @param imdbID IMDb id of the content.
   * @returns True if marked as favorite, false if not.
   */
  isFavorite(imdbID: string): boolean {
    return this.userInteractionsService.findFavorite(imdbID);
  }

  /**
   * Remove content from favorite.
   * @param imdbID IMDb id of the content.
   */
  removeFav(imdbID: string) {
    this.userInteractionsService.removeFavorite(imdbID);
  }

  /**
   * Adds content as favorite.
   * @param content Object with the content data.
   */
  addFav(content: ContentDataModel) {
    this.userInteractionsService.addFavorite(content);
  }

  /**
   * Removes content from the current list.
   * @param imdbID IMDb id of the content to remove.
   * @param listID ID of the list the content it's in.
   */
  removeFromList(imdbID: string, listID: string) {
    this.userInteractionsService.removeFromList(imdbID, listID);
  }
}
