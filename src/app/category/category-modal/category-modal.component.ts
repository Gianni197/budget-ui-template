import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActionSheetService } from '../../shared/service/action-sheet.service';
import { filter, from, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category, CategoryCriteria, SortOption } from '../../shared/domain';
import { CategoryService } from '../category.service';
import { ToastService } from '../../shared/service/toast.service';
import { save } from 'ionicons/icons';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
})
export class CategoryModalComponent {
  categories: Category[] | null = null;
  readonly categoryForm: FormGroup;
  submitting = false;
  readonly initialSort = 'name,asc';
  searchCriteria: CategoryCriteria = { page: 0, size: 25, sort: this.initialSort };
  readonly searchForm: FormGroup;
  readonly sortOptions: SortOption[] = [
    { label: 'Created at (newest first)', value: 'createdAt,desc' },
    { label: 'Created at (oldest first)', value: 'createdAt,asc' },
    { label: 'Name (A-Z)', value: 'name,asc' },
    { label: 'Name (Z-A)', value: 'name,desc' },
  ];
  private readonly unsubscribe = new Subject<void>();

  // Passed into the component by the ModalController, available in the ngOnInit
  category: Category = {} as Category;

  constructor(
    private readonly actionSheetService: ActionSheetService,
    private readonly categoryService: CategoryService,
    private readonly formBuilder: FormBuilder,
    private readonly modalCtrl: ModalController,
    private readonly toastService: ToastService
  ) {
    this.searchForm = this.formBuilder.group({ name: [], sort: [this.initialSort] });
    this.categoryForm = this.formBuilder.group({
      id: [], // hidden
      name: ['', [Validators.required, Validators.maxLength(40)]],
    });
  }

  ngOnInit(): void {
    this.categoryForm.patchValue(this.category);
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save(): void {
    this.submitting = true;
    this.categoryService.upsertCategory(this.categoryForm.value).subscribe({
      next: () => {
        this.toastService.displaySuccessToast('Category saved');
        this.modalCtrl.dismiss(null, 'refresh');
        this.submitting = false;
      },
      error: (error) => {
        this.toastService.displayErrorToast('Could not save category', error);
        this.submitting = false;
      },
    });
  }

  // Passed into the component by the ModalController, available in the ngOnInit

  delete(): void {
    from(this.actionSheetService.showDeletionConfirmation('Are you sure you want to delete this category?'))
      .pipe(filter((action) => action === 'delete'))
      .subscribe({
        next: () => {
          this.modalCtrl.dismiss(null, 'delete');
        },
      });
  }
}
