import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  darkModeOn = signal<boolean>(false);

  constructor() {
    this.darkModeOn.set(JSON.parse(localStorage.getItem('viewdDarkMode') || 'false'));  // JSON.parse can convert a string to a boolean.
  }

  /**
   * Toggles on and off the dark mode of the site.
   */
  toggleDarkMode() {
    this.darkModeOn.update((value) => (value == true ? false : true));
    localStorage.setItem('viewdDarkMode', this.darkModeOn().toString());
  }
}
