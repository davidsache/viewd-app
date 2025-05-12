import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({ 
  providedIn: 'root' 
})
export class ConfirmModalService {
  private confirmSubject = new Subject<{ message: string; callback: (confirmed: boolean) => void; }>();

  get confirmRequests$(): Observable<{ message: string; callback: (confirmed: boolean) => void; }> {
    return this.confirmSubject.asObservable();
  }

  /**
   * Shows a confirmation window.
   * @param message Message of confirmation to show to the user.
   * @param callback Function that should be executed if the confirmation is successful.
   */
  confirm(message: string, callback: (confirmed: boolean) => void) {
    this.confirmSubject.next({ message, callback });
  }
}