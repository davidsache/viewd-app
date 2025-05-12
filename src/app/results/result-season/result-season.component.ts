import { Component, computed, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { Season } from '../../models/season.model';
import { OmdbApiService } from '../../services/omdb-api.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ListsService } from '../../services/lists-modal.service';
import { ContentDataModel } from '../../models/content-data.model';

@Component({
  selector: 'app-result-season',
  imports: [DatePipe],
  templateUrl: './result-season.component.html',
  styleUrl: './result-season.component.css'
})
export class ResultSeasonComponent implements OnInit {
  private omdbApiService = inject(OmdbApiService);
  private listsService = inject(ListsService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  darkModeService = inject(DarkModeService);
  @Input({ required: true }) season!: Season;

  ngOnInit() {
    const subscription = this.omdbApiService.seasonData$
      .subscribe(season => this.seasonReceived(season));

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  /**
   * Receives the season, and if it's "undefined" navigate back to main page.
   * @param season Object with the season data.
   */
  private seasonReceived(season: Season) {
    this.season = season;

    if (Object.keys(this.season).length === 0 || this.season.Response !== 'True')
      this.router.navigate(['']);
  }

  /**
   * Loads the clicked episode.
   * @param imdbID IMDb id of the episode.
   */
  loadEpisode(imdbID: string) {
    this.omdbApiService.getByImdbId(imdbID);
  }

  /**
   * Adds an episode to a list.
   * @param episode Object with the episode data.
   */
  addToList(episode: { Episode: string, Released: string, Title: string, imdbID: string, imdbRating: string }) {
    this.listsService.listVisibility('AddToList', true);
    this.listsService.contentToAdd({
      imdbID: episode.imdbID,
      Poster: 'N/A',
      Title: episode.Title,
      Type: 'episode',
      Year: new Date(episode.Released).getFullYear().toString()
    });
  }
}
