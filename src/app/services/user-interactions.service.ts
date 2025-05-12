import { inject, Injectable } from '@angular/core';
import { Watched } from '../models/watched.model';
import { Result } from '../models/result.model';
import { Rating } from '../models/rating.model';
import { List } from '../models/list.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ContentDataModel } from '../models/content-data.model';

@Injectable({
  providedIn: 'root'
})
export class UserInteractionsService {
  private favoriteContent: ContentDataModel[];
  private watchedFilms: Watched[];
  private ratings: Rating[];
  private lists: List[];
  private sort: 'asc' | 'desc' = 'desc';
  private listData = new BehaviorSubject<List>({} as any);
  private router = inject(Router);
  listData$ = this.listData.asObservable();
  
  constructor() {
    this.favoriteContent = JSON.parse(localStorage.getItem('viewdFavorites') || '[]');
    this.watchedFilms = JSON.parse(localStorage.getItem('viewdWatched') || '[]');
    this.ratings = JSON.parse(localStorage.getItem('viewdRatings') || '[]');
    this.lists = JSON.parse(localStorage.getItem('viewdLists') || '[]');
  }

  /**
   * Returns the array of all the favorite content.
   * @returns The favorite content array.
   */
  getFavorites(): ContentDataModel[] {
    return this.favoriteContent;
  }

  /**
   * Adds content to favorite, and removes it if it was already a favorite.
   * @param favorite Object with the content.
   */
  addFavorite(favorite: ContentDataModel) {
    const index = this.favoriteContent.findIndex(item => item.imdbID === favorite.imdbID);
    
    if (index !== -1) {
      this.favoriteContent.splice(index, 1);
    }
    else {
      this.favoriteContent.push(favorite);
    }

    localStorage.setItem('viewdFavorites', JSON.stringify(this.favoriteContent));
  }

  /**
   * Finds if a content is already a favorite.
   * @param imdbID IMDb id of the content.
   * @returns True if it was added as a favorite, false otherwise.
   */
  findFavorite(imdbID: string): boolean {
    const index = this.favoriteContent.findIndex(favorite => favorite.imdbID === imdbID);
    return index !== -1 ? true : false;
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
        Year: result.Year,
        Poster: result.Poster,
        Type: result.Type
      });

      this.watchedFilms.push(watched);
    }
    else {
      this.watchedFilms[arrIndex].Content.push({
        imdbID: result.imdbID,
        Title: result.Title,
        Year: result.Year,
        Poster: result.Poster,
        Type: result.Type
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

  /**
   * Returns the array of all the lists.
   * @returns Array of lists.
   */
  getLists(): List[] {
    return this.lists;
  }

  /**
   * Adds a new list to the array of lists.
   * @param listData Data of the list to add.
   */
  addList(listData: List) {
    const arrIndex = this.lists.findIndex(list => list.listID === listData.listID);

    if (arrIndex === -1) {
      this.lists.push(listData);
      localStorage.setItem('viewdLists', JSON.stringify(this.lists));
    }
  }

  /**
   * Opens the clicked list.
   * @param listID ID of the list to show.
   */
  openList(listID: string) {
    const list = this.lists.find(list => list.listID === listID);

    if (list !== undefined) {
      this.listData.next(list);
      this.router.navigate(['list']);
    }
  }

  /**
   * Adds content to a specific list.
   * @param listID ID of the list.
   * @param contentToAdd Content to add to the list.
   * @returns 'ok' if no errors / 'alreadyAdded' is the content is added already / 'listNotFound' if the list to add the content to doesn't exist.
   */
  addToList(listID: string, contentToAdd: ContentDataModel): 'ok' | 'alreadyAdded' | 'listNotFound' {
    const index = this.lists.findIndex(list => list.listID === listID);

    if (index !== -1) {
      const contentIndex = this.lists[index].Content
        .findIndex(content => content.imdbID === contentToAdd.imdbID);

      if (contentIndex === -1) {
        this.lists[index].Content.push(contentToAdd);
        localStorage.setItem('viewdLists', JSON.stringify(this.lists));
        return 'ok';
      }
      else {
        return 'alreadyAdded'
      }
    }
    else {
      return 'listNotFound';
    }
  }

  /**
   * Removes a list of the array of lists.
   * @param listID ID of the list to delete.
   */
  removeList(listID: string) {
    const index = this.lists.findIndex(list => list.listID === listID);

    if (index !== -1) {
      this.lists.splice(index, 1);
      localStorage.setItem('viewdLists', JSON.stringify(this.lists));
    }
  }

  /**
   * Removes content from a list.
   * @param imdbID ID of the content.
   * @param listID ID of the list.
   */
  removeFromList(imdbID: string, listID: string) {
    const listIndex = this.lists.findIndex(list => list.listID === listID);

    if (listIndex !== -1) {
      const contentIndex = this.lists[listIndex].Content.findIndex(content => content.imdbID === imdbID);

      if (contentIndex !== -1) {
        this.lists[listIndex].Content.splice(contentIndex, 1);
        localStorage.setItem('viewdLists', JSON.stringify(this.lists));
      }
    }
  }

  /**
   * To save the changes made to a list (title, description, image).
   * @param editedList List that has been edited.
   */
  editList(editedList: List) {
    const listIndex = this.lists.findIndex(list => list.listID === editedList.listID);

    if (listIndex != -1) {
      this.lists[listIndex] = {
        listID: editedList.listID,
        Content: editedList.Content,
        Description: editedList.Description,
        Image: editedList.Image,
        Name: editedList.Name
      };

      localStorage.setItem('viewdLists', JSON.stringify(this.lists));
    }
  }
}