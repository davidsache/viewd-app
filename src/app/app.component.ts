import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { DarkModeService } from './services/dark-mode.service';
import { ErrorService } from './services/error.service';
import { ErrorModalComponent } from "./modal/error-modal/error-modal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, ErrorModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private darkModeService = inject(DarkModeService);
  private errorService = inject(ErrorService);

  darkModeOn = computed(() => (this.darkModeService.darkModeOn() ? 'dark' : 'light'));
  error = this.errorService.error;
}
