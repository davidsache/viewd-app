import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { DarkModeService } from './services/dark-mode.service';
import { ErrorService } from './services/error-modal.service';
import { ErrorModalComponent } from "./modal/error-modal/error-modal.component";
import { ListsService } from './services/lists-modal.service';
import { AddListModalComponent } from './modal/list-modal/add-list-modal/add-list-modal.component';
import { AddToListModalComponent } from './modal/list-modal/add-to-list-modal/add-to-list-modal.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, ErrorModalComponent, AddListModalComponent, AddToListModalComponent, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private darkModeService = inject(DarkModeService);
  private errorService = inject(ErrorService);
  private listsService = inject(ListsService);

  mode = computed(() => 
    (this.darkModeService.darkModeOn() ? 'dark' : 'light')
  );
  
  backgroundStyle = computed(() => 
    (this.darkModeService.darkModeOn() ? 'backgroundDark' : 'backgroundLight')
  );

  error = this.errorService.error;
  addList = this.listsService.addListVisible;
  addToList = this.listsService.addToListVisible;
}
