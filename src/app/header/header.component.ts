import { Component, computed, inject } from '@angular/core';
import { DarkModeService } from '../services/dark-mode.service';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  darkModeService = inject(DarkModeService);
  
  headerLogo = computed(() => (
    this.darkModeService.darkModeOn() ? './viewd-logo-wtext.png' : './viewd-logo-btext.png')
  );
}
