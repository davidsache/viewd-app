import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  darkModeOn = signal(true);
  svgFill = computed(() => this.darkModeOn() ? '#e3e3e3' : '#000000');

  constructor() {
    this.darkModeOn.set(JSON.parse(localStorage.getItem('viewdDarkMode') || 'false'));  // JSON.parse can convert a string to a boolean.
  }

  /**
   * Toggles on and off the dark mode of the site.
   */
  toggleDarkMode() {
    this.darkModeOn.update((value) => value == true ? false : true);
    localStorage.setItem('viewdDarkMode', this.darkModeOn().toString());
  }
}
