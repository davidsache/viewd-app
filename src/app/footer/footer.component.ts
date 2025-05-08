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
  private darkModeService = inject(DarkModeService);

  buttonIcon = computed(() => 
    (this.darkModeService.darkModeOn() ? './icons/light_mode.svg' : './icons/dark_mode.svg')
  );

  githubLogoFill = computed(() => 
    (this.darkModeService.darkModeOn() ? '#fff' : '#24292f')
  );

  buttonClass = computed(() => 
    (this.darkModeService.darkModeOn() ? 'bg-dark' : 'bg-info')
  );

  /**
   * Toggle the dark mode in the entire site.
   */
  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }
}
