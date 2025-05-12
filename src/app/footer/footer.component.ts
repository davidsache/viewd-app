import { Component, computed, inject } from '@angular/core';
import { DarkModeService } from '../services/dark-mode.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [NgClass],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  darkModeService = inject(DarkModeService);
  
  buttonClass = computed(() => this.darkModeService.darkModeOn() ? 'bg-dark' : 'bg-info');
  githubLogoFill = computed(() => this.darkModeService.darkModeOn() ? '#fff' : '#24292f');
 
  /**
   * Toggle the dark mode in the entire site.
   */
  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }
}
