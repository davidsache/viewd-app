import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { DarkModeService } from './services/dark-mode.service';
import { ErrorService } from './services/error-modal.service';
import { ErrorModalComponent } from "./modal/error-modal/error-modal.component";
import { ListsService } from './services/lists-modal.service';
import { AddListModalComponent } from './modal/list-modal/add-list-modal/add-list-modal.component';
import { AddToListModalComponent } from './modal/list-modal/add-to-list-modal/add-to-list-modal.component';
import { DOCUMENT, NgClass } from '@angular/common';
import { ConfirmModalComponent } from './modal/confirm-modal/confirm-modal.component';
import { SearchComponent } from './search/search.component';
import { FooterComponent } from "./footer/footer.component";
import { EditListModalComponent } from './modal/list-modal/edit-list-modal/edit-list-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent, SearchComponent, RouterOutlet, ErrorModalComponent, AddListModalComponent,
    EditListModalComponent, AddToListModalComponent, ConfirmModalComponent, FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private darkModeService = inject(DarkModeService);
  private errorService = inject(ErrorService);
  private listsService = inject(ListsService);
  private document = inject(DOCUMENT);
  mode = signal<'dark' | 'light'>('dark');

  ngOnInit() {
    this.document.body.classList.add(this.darkModeService.darkModeOn() ? 'backgroundDark' : 'backgroundLight');
  }

  constructor() {
    effect(() => {
      const darkModeOn = this.darkModeService.darkModeOn();
      this.changeDarkMode(darkModeOn);
    });
  }

  changeDarkMode(darkModeOn: boolean) {
    if (darkModeOn) {
      this.document.body.classList.remove('backgroundLight');
      this.document.body.classList.add('backgroundDark');
    }
    else {
      this.document.body.classList.remove('backgroundDark');
      this.document.body.classList.add('backgroundLight');
    }

    this.mode.set(darkModeOn ? 'dark' : 'light');
  }

  error = this.errorService.error;
  addList = this.listsService.addListVisible;
  addToList = this.listsService.addToListVisible;
}
