import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchTitle = signal('');
  private destroyRef = inject(DestroyRef);
  private moviesService = inject(MoviesService);

  onSubmit() {
    const subscription = this.moviesService.searchByTitle(this.searchTitle()).subscribe(
      movies => console.log(movies)
    )

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
