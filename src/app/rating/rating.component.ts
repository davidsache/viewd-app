import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, NgForm } from '@angular/forms';
import { UserInteractionsService } from '../services/user-interactions.service';
import { Rating } from '../models/rating.model';

@Component({
  selector: 'app-rating',
  imports: [FormsModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent implements OnInit {
  @Input() imdbID = '';
  private userInteractionsService = inject(UserInteractionsService);
  rating!: Rating;

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
