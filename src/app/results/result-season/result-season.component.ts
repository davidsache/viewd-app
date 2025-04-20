import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { Season } from '../../models/season.model';
import { SearchService } from '../../services/search.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-result-season',
  imports: [DatePipe],
  templateUrl: './result-season.component.html',
  styleUrl: './result-season.component.css'
})
export class ResultSeasonComponent implements OnInit {
  private searchService = inject(SearchService);
  private destroyRef = inject(DestroyRef);
  darkModeService = inject(DarkModeService);
  @Input({ required: true }) season!: Season;

  ngOnInit() {
    const subscription = this.searchService.seasonData$.subscribe(
      season => this.season = season
    );

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  /**
   * Loads the clicked episode.
   * @param imdbID IMDb id of the episode.
   */
  loadEpisode(imdbID: string) {
    this.searchService.getByImdbId(imdbID);
  }
}
