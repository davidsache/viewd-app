import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ContentDataModel } from '../models/content-data.model';
import { List } from '../models/list.model';

@Injectable({
  providedIn: 'root'
})
export class ListsService {
  private _addListVisible = signal(false);
  addListVisible = this._addListVisible.asReadonly();

  private _addToListVisible = signal(false);
  addToListVisible = this._addToListVisible.asReadonly();

  private _editListVisible = signal(false);
  editListVisible = this._editListVisible.asReadonly();

  private content = new BehaviorSubject<ContentDataModel>({} as any);
  content$ = this.content.asObservable();

  private list = new BehaviorSubject<List>({} as any);
  list$ = this.list.asObservable();

  /**
   * Shows or hide a list.
   * @param list List to show/hide.
   * @param visible Show or hide the list.
   */
  listVisibility(list: 'AddList' | 'AddToList' | 'EditList', visible: boolean) {
    switch (list) {
      case 'AddList':
        this._addListVisible.set(visible);
        break;

      case 'AddToList':
        this._addToListVisible.set(visible);
        break;

      case 'EditList':
        this._editListVisible.set(visible);
        break;
    }
  }

  /**
   * Pass the list data to the "edit list" window, and shows it.
   * @param list Data of the list to be edited.
   */
  editList(list: List) {
    this.list.next(list);
    this.listVisibility('EditList', true);
  }

  /**
   * Pass the content to be added and shows the "add to list" window.
   * @param content Data of the content to be added.
   */
  contentToAdd(content: ContentDataModel) {
    this.content.next(content);
    this.listVisibility('AddToList', true);
  }
}
