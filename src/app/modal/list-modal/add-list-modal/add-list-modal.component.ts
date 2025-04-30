import { Component, inject } from '@angular/core';
import { ModalComponent } from '../../modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListsService } from '../../../services/lists-modal.service';
import { UserInteractionsService } from '../../../services/user-interactions.service';
import { List } from '../../../models/list.model';

@Component({
  selector: 'app-add-list-modal',
  imports: [ModalComponent, ReactiveFormsModule],
  templateUrl: './add-list-modal.component.html',
  styleUrl: './add-list-modal.component.css'
})
export class AddListModalComponent {
  private listsService = inject(ListsService);
  private userInteractionsService = inject(UserInteractionsService);
  form: FormGroup;
  selectedImage = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      image: ['', [Validators.required]]
    })
  }

  onFileSelected(event: any) {
    const file = event.target.files[0] as Blob;

    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selectedImage = reader.result as string;
        this.form.patchValue({ image: this.selectedImage });
        this.form.get('image')?.setErrors(null);
      };
    }
    else {
      this.selectedImage = '';
      this.form.patchValue({ image: '' });
      this.form.get('image')?.setErrors({ invalidType: true });
    }
  }

  get nameIsInvalid() {
    return (
      this.form.get('name')?.touched &&
      this.form.get('name')?.dirty &&
      this.form.get('name')?.invalid
    );
  }

  get descriptionIsInvalid() {
    return (
      this.form.get('description')?.touched &&
      this.form.get('description')?.dirty &&
      this.form.get('description')?.invalid
    );
  }

  get imageIsInvalid() {
    return (
      this.form.get('image')?.touched && 
      this.form.get('image')?.dirty ||
      this.form.get('image')?.errors?.['invalidType']
    );
  }

  formSubmit() {
    if (this.form.valid) {
      const listData: List = {
        listID: crypto.randomUUID(),
        Name: this.form.get('name')?.value,
        Description: this.form.get('description')?.value,
        Image: this.form.get('image')?.value,
        Content: []
      }

      this.userInteractionsService.addList(listData)
      this.closeAddListForm();
    }
    else {
      this.form.markAllAsTouched();
    }
  }

  closeAddListForm() {
    this.listsService.listVisibility('AddList', false);
  }
}
