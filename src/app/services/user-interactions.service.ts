import { Injectable } from '@angular/core';
import { Favorite } from '../models/favorite.model';
import { Watched } from '../models/watched.model';
import { Result } from '../models/result.model';
import { Rating } from '../models/rating.model';

@Injectable({
  providedIn: 'root'
})
export class UserInteractionsService {
  private favoriteContent: Favorite[];
  private watchedFilms: Watched[];
  private ratings: Rating[];
  private sort: 'asc' | 'desc' = 'desc';

  constructor() {
    this.favoriteContent = JSON.parse(localStorage.getItem('viewdFavorites') || '[]');
    this.watchedFilms = JSON.parse(localStorage.getItem('viewdWatched') || '[]');
    this.ratings = JSON.parse(localStorage.getItem('viewdRatings') || '[]');
  }

  /**
   * Returns the array of all the favorite content.
   * @returns The favorite content array.
   */
  getFavorites(): Favorite[] {
    return this.favoriteContent;
  }

  /**
   * Adds content to favorite, and removes it if it was already a favorite.
   * @param favorite Object with the content.
   */
  addFavorite(favorite: Favorite) {
    const fav = this.findFavorite(favorite.imdbID, true)
    
    if (fav.alreadyFav) {
      this.favoriteContent.splice(fav.itemIndex, 1);
    }
    else {
      this.favoriteContent.push(favorite);
    }

    localStorage.setItem('viewdFavorites', JSON.stringify(this.favoriteContent));
  }

  /**
   * Finds if a favorite its already added.
   * @param imdbID IMDb id of the content.
   * @param returnIndex Should return the index where is located within the array (if not then returns -1).
   * @returns
   */
  findFavorite(imdbID: string, returnIndex: boolean) {
    const index = this.favoriteContent.map(item => item.imdbID).indexOf(imdbID);

    return {
      alreadyFav: index > -1 ? true : false,
      itemIndex: returnIndex ? index : -1
    };
  }

  removeFavorite(imdbID: string) {
    const index = this.favoriteContent.findIndex(item => item.imdbID === imdbID);

    if (index !== -1) {
      this.favoriteContent.splice(index, 1);
      localStorage.setItem('viewdFavorites', JSON.stringify(this.favoriteContent));
    }
  }
  
  /**
   * Returns the array of all the watched content.
   * @returns The watched content array.
   */
  getWatched(): Watched[] {
    return this.watchedFilms;
  }

  /**
   * Returns if the current content has been watched (logged) today.
   * @param imdbID IMDb id of the content
   * @returns True if watched today, false otherwise.
   */
  findIfWatchedToday(imdbID: string): boolean {
    const today = new Date().toDateString();
    const index = this.watchedFilms.findIndex(item => item.WatchedDate === today);

    if (index !== -1) {
      return this.watchedFilms[index].Content.some(item => item.imdbID === imdbID);
    }
    else {
      return false;
    }
  }

  /**
   * Adds new content to the watched array.
   * @param result Info of the content to add.
   */
  addWatched(result: Result) {
    const date = new Date().toDateString();
    const arrIndex = this.watchedFilms
      .findIndex(item => new Date(item.WatchedDate).toDateString() === date);

    if (arrIndex === -1) {
      const watched: Watched = {
        WatchedDate: date,
        Content: []
      };

      watched.Content.push({
        imdbID: result.imdbID,
        Title: result.Title,
        Year: result.Year
      });

      this.watchedFilms.push(watched);
    }
    else {
      this.watchedFilms[arrIndex].Content.push({
        imdbID: result.imdbID,
        Title: result.Title,
        Year: result.Year
      });
    }

    localStorage.setItem('viewdWatched', JSON.stringify(this.watchedFilms));
  }

  /**
   * Removes logged content from the watched array.
   * @param imdbID IMDb id of the content.
   * @param date String of the logged date.
   */
  removeWatched(imdbID: string, date: string) {
    const arrIndex = this.watchedFilms.findIndex(item => new Date(item.WatchedDate).toDateString() === date);

    if (arrIndex !== -1) {
      const index = this.watchedFilms[arrIndex].Content.findIndex(item => item.imdbID === imdbID);
      
      if (index !== -1) {
        this.watchedFilms[arrIndex].Content.splice(index, 1);

        // If it is the only content logged on that date, delete the entire element of that date.
        if (this.watchedFilms[arrIndex].Content.length < 1) {
          this.watchedFilms.splice(arrIndex, 1);
        }
        
        localStorage.setItem('viewdWatched', JSON.stringify(this.watchedFilms));
      }
    }
  }

  /**
   * Sorts by ascending/descending using the watched date.
   * @returns Sorted watched array.
   */
  sortWatched() {
    this.sort === 'asc' ? 'desc' : 'asc';

    if (this.sort === 'desc') {
      this.watchedFilms.reverse();
    }
    else {
      this.watchedFilms.sort((a, b) => Date.parse(a.WatchedDate) - Date.parse(b.WatchedDate));
    }
    
    return this.watchedFilms;
  }

  /**
   * Returns the rating according to the provided id.
   * @param imdbID IMDb id of the content.
   * @returns Rating.
   */
  findRating(imdbID: string): Rating | undefined {
    return this.ratings.find(item => item.imdbID === imdbID);
  }

  /**
   * Adds new rating from 1 to 5, otherwise it will be adjusted to either 1 or 5.
   * @param rating Number of the rating.
   */
  addRating(rating: Rating) {
    if (rating.Rating < 1) {
      rating.Rating = 1;
    }
    else if (rating.Rating > 5) {
      rating.Rating = 5;
    }

    const ratingIndex = this.ratings.findIndex(item => item.imdbID === rating.imdbID);

    if (ratingIndex !== -1) {
      this.ratings[ratingIndex].Rating = rating.Rating;
    }
    else {
      this.ratings.push(rating);
    }

    localStorage.setItem('viewdRatings', JSON.stringify(this.ratings));
  }
}