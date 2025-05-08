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

  editList(list: List) {
    this.list.next(list);
    this.listVisibility('EditList', true);
  }

  contentToAdd(content: ContentDataModel) {
    this.content.next(content);
    this.listVisibility('AddToList', true);
  }
}
