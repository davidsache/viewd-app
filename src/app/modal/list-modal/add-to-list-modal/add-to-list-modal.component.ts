import { Component, DestroyRef, inject } from '@angular/core';
import { ModalComponent } from '../../modal.component';
import { UserInteractionsService } from '../../../services/user-interactions.service';
import { List } from '../../../models/list.model';
import { ListsService } from '../../../services/lists-modal.service';
import { ContentDataModel } from '../../../models/content-data.model';
import { ErrorService } from '../../../services/error-modal.service';

@Component({
  selector: 'app-add-to-list-modal',
  imports: [ModalComponent],
  templateUrl: './add-to-list-modal.component.html',
  styleUrl: './add-to-list-modal.component.css'
})
export class AddToListModalComponent {
  private userInteractionsService = inject(UserInteractionsService);
  private errorService = inject(ErrorService);
  private listsService = inject(ListsService);
  private destroyRef = inject(DestroyRef);
  contentToAdd!: ContentDataModel;
  lists?: List[];

  ngOnInit() {
    this.lists = this.userInteractionsService.getLists();

    const subscription = this.listsService.content$
      .subscribe(content => this.contentToAdd = content);

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  listClicked(listID: string) {
    const result = this.userInteractionsService.addToList(listID, this.contentToAdd);
    this.closeAddToListModal();

    switch (result) {
      case 'alreadyAdded':
        this.errorService.showError('El contenido ya existe en la lista.');
        break;

      case 'listNotFound':
        this.errorService.showError('El contenido no pudo ser añadido.');
        break;

      default: 
        break;
    }
  }

  closeAddToListModal() {
    this.listsService.listVisibility('AddToList', false);
  }

  showAddListModal() {
    this.listsService.listVisibility('AddList', true);
  }
}
