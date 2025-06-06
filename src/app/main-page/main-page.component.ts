import { Component, computed, inject } from '@angular/core';
import { UserInteractionsService } from '../services/user-interactions.service';
import { OmdbApiService } from '../services/omdb-api.service';
import { Watched } from '../models/watched.model';
import { DatePipe, NgClass } from '@angular/common';
import { DarkModeService } from '../services/dark-mode.service';
import { ListsService } from '../services/lists-modal.service';
import { List } from '../models/list.model';
import { ContentDataModel } from '../models/content-data.model';
import { ConfirmModalService } from '../services/confirm-modal.service';

@Component({
  selector: 'app-main-page',
  imports: [DatePipe, NgClass],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  private omdbApiService = inject(OmdbApiService);
  userInteractionService = inject(UserInteractionsService);
  darkModeService = inject(DarkModeService);
  listsService = inject(ListsService);
  confirmService = inject(ConfirmModalService);
  favorites: ContentDataModel[] = [];
  watched: Watched[] = [];
  lists: List[] = [];

  buttonSvgFill = computed(() => this.darkModeService.darkModeOn() ? '#6ea8fe' : '#052c65');
  separatorHrFill = computed(() => this.darkModeService.darkModeOn() ? 'topSeparatorDark' : 'topSeparatorLight');
  badgeBackground = computed(() => this.darkModeService.darkModeOn() ? 'text-bg-dark' : 'text-bg-info');

  ngOnInit() {
    this.favorites = this.userInteractionService.getFavorites();
    this.watched = this.userInteractionService.getWatched();
    this.lists = this.userInteractionService.getLists();
  }

  /**
   * Loads the info page of the clicked content.
   * @param imdbID IMDb id of the content.
   */
  goToContent(imdbID: string) {
    this.omdbApiService.getByImdbId(imdbID);
  }

  /**
   * Sort the watched content ascending/descending, by the watched date.
   */
  sortWatched() {
    this.watched = this.userInteractionService.sortWatched();
  }

  removeEntry(imdbID: string, title: string, date: string) {
    this.confirmService.confirm('¿Deseas eliminar "' + title +  '" de Actividad?', (confirmed) => {
      if (confirmed) {
        this.userInteractionService.removeWatched(imdbID, date);
      }
    });
  }

  removeFavorite(imdbID: string, title: string) {
    this.confirmService.confirm('¿Deseas eliminar "' + title + '" de Favoritos?', (confirmed) => {
      if (confirmed) {
        this.userInteractionService.removeFavorite(imdbID);
      }
    });
  }

  showAddListForm() {
    this.listsService.listVisibility('AddList', true);
  }

  openList(listID: string) {
    this.userInteractionService.openList(listID);
  }

  addContentToList(content: ContentDataModel) {
    this.listsService.listVisibility('AddToList', true);
    this.listsService.contentToAdd(content);
  }

  removeList(listID: string, name: string) {
    this.confirmService.confirm('¿Deseas eliminar la lista "' + name + '"?', (confirmed) => {
      if (confirmed) {
        this.userInteractionService.removeList(listID);
      }
    });
  }

  editList(list: List) {
    this.listsService.editList(list);
  }
}
