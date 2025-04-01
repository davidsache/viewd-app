import { Component, DestroyRef, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Result } from '../../models/result.model';
import { SearchService } from '../../search/search.service';

@Component({
  selector: 'app-result-item',
  imports: [],
  templateUrl: './result-item.component.html',
  styleUrl: './result-item.component.css'
})
export class ResultItemComponent implements OnChanges {
  private searchService = inject(SearchService);
  private destroyRef = inject(DestroyRef);
  @Input({ required: true }) result!: Result;
  tab =  0;
  
  ngOnInit() {
    const resultSubscription = this.searchService.resultData$.subscribe(
      result => this.result = result
    );

    this.destroyRef.onDestroy(() => resultSubscription.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges) {
    this.tab = 0; 
  }

  showCastTab() {
    this.tab = 1;
  }

  showDetailsTab() {
    this.tab = 2;
  }
}
