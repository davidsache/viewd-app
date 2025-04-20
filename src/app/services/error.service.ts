import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private _error = signal('');
  error = this._error.asReadonly();

  /**
   * Shows a modal with an error message.
   * @param message String of the error message.
   */
  showError(message: string) {
    console.log(message);
    this._error.set(message);
  }

  /**
   * To clean the error.
   */
  clearError() {
    this._error.set('');
  }
}
