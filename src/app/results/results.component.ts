import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SearchResults } from './models/search-results.model';

@Component({
  selector: 'app-results',
  imports: [],
  standalone: true,
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent implements OnChanges {
  @Input({ required: true }) searchResults!: SearchResults;

  ngOnInit() {
    console.log(this.searchResults)
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.searchResults)
  }
}
