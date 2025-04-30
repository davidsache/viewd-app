import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserInteractionsService } from '../services/user-interactions.service';
import { Rating } from '../models/rating.model';
import { DarkModeService } from '../services/dark-mode.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-rating',
  imports: [FormsModule, NgClass],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent implements OnInit {
  private userInteractionsService = inject(UserInteractionsService);
  darkModeService = inject(DarkModeService);
  @Input() imdbID = '';
  rating!: Rating;

  ratingClass = computed(() => 
    (this.darkModeService.darkModeOn() ? 'ratingDark' : 'ratingLight')
  );

  ngOnInit() {
    const tempRating = this.userInteractionsService.findRating(this.imdbID);

    if (tempRating !== undefined) {
      this.rating = tempRating;
    }
    else {
      this.rating = { imdbID: this.imdbID, Rating: -1 };
    }
  }

  onSubmit() {
    this.rating.Rating = this.rating.Rating;
    this.userInteractionsService.addRating(this.rating);
  }
}
