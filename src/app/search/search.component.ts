import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchTitle = '';
  private searchService = inject(SearchService);

  onSubmit() {
    this.searchService.searchByTitle(this.searchTitle);
  }
}
