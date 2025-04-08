import { Component, computed, DestroyRef, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Result } from '../../models/result.model';
import { SearchService } from '../../services/search.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-result-item',
  imports: [NgClass],
  templateUrl: './result-item.component.html',
  styleUrl: './result-item.component.css'
})
export class ResultItemComponent implements OnChanges {
  private searchService = inject(SearchService);
  private destroyRef = inject(DestroyRef);
  @Input({ required: true }) result!: Result;
  tab: 'cast' | 'details' | 'off' = 'off';
  imagePoster = computed(() => (this.result.Poster !== 'N/A' ? this.result.Poster : './no-image.png'));
  
  ngOnInit() {
    const subscription = this.searchService.resultData$.subscribe(
      result => this.result = result
    );

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  /**
   * When there is a change in the page, reset the tab to off.
   * @param changes Changes object.
   */
  ngOnChanges(changes: SimpleChanges) {
    this.tabStatus('off');
  }
  
  /**
   * Change the info tab status.
   * @param status 'cast': Show tab with the cast info / 'details': Shows tab with info about the content / 'off': Hides the tab completely.
   */
  tabStatus(status: 'cast' | 'details' | 'off') {
    if (this.tab === status) {
      this.tab = 'off';
    }
    else {
      this.tab = status;
    }
  }
}
