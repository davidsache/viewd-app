import { Component, inject, Input, signal } from '@angular/core';
import { ModalComponent } from "../modal.component";
import { ConfirmModalService } from '../../services/confirm-modal.service';

@Component({
  selector: 'app-confirm-modal',
  imports: [ModalComponent],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  message = '';
  visible = false;
  private callback: (confirmed: boolean) => void = () => {};
  private confirmService = inject(ConfirmModalService);

  ngOnInit() {
    this.confirmService.confirmRequests$.subscribe(({ message, callback }) => {
      this.message = message;
      this.callback = callback;
      this.visible = true;
    });
  }

  respond(result: boolean) {
    this.visible = false;
    this.callback(result);
  }
}
