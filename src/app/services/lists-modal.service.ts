import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ContentDataModel } from '../models/content-data.model';

@Injectable({
  providedIn: 'root'
})
export class ListsService {
  private _addListVisible = signal(false);
  addListVisible = this._addListVisible.asReadonly();

  private _addToListVisible = signal(false);
  addToListVisible = this._addToListVisible.asReadonly();

  private content = new BehaviorSubject<ContentDataModel>({} as any);
  content$ = this.content.asObservable();

  listVisibility(list: 'AddList' | 'AddToList', visible: boolean) {
    switch (list) {
      case 'AddList':
        this._addListVisible.set(visible);
        this._addToListVisible.set(false);
        break;

      case 'AddToList':
        this._addListVisible.set(false);
        this._addToListVisible.set(visible);
        break;
    }
  }

  contentToAdd(content: ContentDataModel) {
    if (this._addToListVisible()) {
      this.content.next(content);
    }
  }
}
