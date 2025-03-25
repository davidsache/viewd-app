import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private httpClient = inject(HttpClient);

  searchByTitle(title: string) {
    return this.httpClient.get('http://www.omdbapi.com/?apikey=8148b372&t=' + title);
  }
}
