import { Component, DestroyRef, inject } from '@angular/core';
import { ModalComponent } from "../../modal.component";
import { List } from '../../../models/list.model';
import { ListsService } from '../../../services/lists-modal.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserInteractionsService } from '../../../services/user-interactions.service';

@Component({
  selector: 'app-edit-list-modal',
  imports: [ModalComponent, ReactiveFormsModule],
  templateUrl: './edit-list-modal.component.html',
  styleUrl: './edit-list-modal.component.css'
})
export class EditListModalComponent {
  userInteractionsService = inject(UserInteractionsService);
  private destroyRef = inject(DestroyRef);
  listsService = inject(ListsService);
  list!: List;
  form: FormGroup;
  selectedImage = '';
  
  ngOnInit() {
    const subscription = this.listsService.list$
      .subscribe(list => this.listReceived(list));

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      image: ['', [Validators.required]]
    })
  }

  private listReceived(list: List) {
    this.list = list;

    this.form.patchValue({
      name: this.list.Name,
      description: this.list.Description,
      image: this.list.Image
    });
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
        listID: this.list.listID,
        Name: this.form.get('name')?.value,
        Description: this.form.get('description')?.value,
        Image: this.form.get('image')?.value,
        Content: this.list.Content
      }

      this.userInteractionsService.editList(listData)
      this.closeAddListForm();
    }
    else {
      this.form.markAllAsTouched();
    }
  }

  closeAddListForm() {
    this.listsService.listVisibility('EditList', false);
  }
}
