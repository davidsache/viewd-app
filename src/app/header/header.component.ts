import { Component, computed, inject } from '@angular/core';
import { SearchComponent } from "../search/search.component";
import { DarkModeService } from '../services/dark-mode.service';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [SearchComponent, NgClass, RouterLink],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  darkModeService = inject(DarkModeService);
  
  buttonIcon = computed(() => (
    this.darkModeService.darkModeOn() ? './icons/light_mode.svg' : './icons/dark_mode.svg')
  );
  headerLogo = computed(() => (
    this.darkModeService.darkModeOn() ? './viewd-logo-wtext.png' : './viewd-logo-btext.png')
  );

  /**
   * Toggle the dark mode in the entire site.
   */
  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }
}
