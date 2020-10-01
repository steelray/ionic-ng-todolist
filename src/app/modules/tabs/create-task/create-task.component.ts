import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Self, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ITag } from 'src/app/core/interfaces/tag.interface';
import { ITaskCreate, ITaskUpdate } from 'src/app/core/interfaces/task.interface';
import { NgOnDestroy } from 'src/app/core/services/destroy.service';
import { TaskService } from 'src/app/core/services/task.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgOnDestroy]
})
export class CreateTaskComponent implements OnInit {
  @Input() id: number; // for editing existing task
  title = 'Create new task';
  form: FormGroup;
  isLoading = false;
  selectedTags: string[] = [];
  tags$: Observable<ITag[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagSearchString$ = new BehaviorSubject<string>(null);
  tagSelectedState = false; // if tag is adding by selecting from list
  @ViewChild('formDirective') formDirective: NgForm;
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  constructor(
    private taskService: TaskService,
    private fb: FormBuilder,
    @Self() private onDestroy$: NgOnDestroy,
    private snackbar: MatSnackBar,
    private modalController: ModalController,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getTags();

    this.controls.tagValues.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.onDestroy$)
    ).subscribe(res => this.tagSearchString$.next(res));

    if (this.id) {
      this.isLoading = true;
      this.taskService.fetchOne(this.id).pipe(
        takeUntil(this.onDestroy$)
      ).subscribe(task => {


        this.isLoading = false;

        this.selectedTags = task.tags.map(tag => tag.title);
        this.form.patchValue(task);
        if (task.start_at) {
          this.controls.start_at.setValue(new Date(task.start_at * 1000).toISOString());
        }
      });
    }
    this.cdRef.markForCheck();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    const body: ITaskCreate = { ...this.form.value };
    body.start_at = Math.round(new Date(body.start_at).getTime() / 1000);
    body.tagValues = this.selectedTags;
    if (this.id) {
      this.updateTask(body);
    } else {
      this.createTask(body);
    }
  }

  get controls() {
    return this.form.controls;
  }

  dismiss(updateList = null) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss(updateList);
  }


  onTagAdd(event: MatChipInputEvent): void {

    setTimeout(() => {
      if (!this.tagSelectedState) {

        const input = event.input;
        const value: string = event.value;

        // Add our tag
        if ((value || '').trim() && !this.selectedTags.find(val => value === val)) {
          this.selectedTags.push(value);
        }

        // Reset the input value
        if (input) {
          input.value = '';
        }
        this.controls.tagValues.setValue(null);
      } else {
        this.tagSelectedState = false;
      }
    }, 200);


  }

  onTagRemove(tag: string): void {
    const index = this.selectedTags.indexOf(tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  onTagSelect(event: MatAutocompleteSelectedEvent): void {
    this.tagSelectedState = true;
    const value = event.option.viewValue;
    // only uniques
    if (this.selectedTags.find(val => value === val)) {
      return;
    } else {
      this.selectedTags.push(value);
      this.tagInput.nativeElement.value = '';
    }
    this.controls.tagValues.setValue(null);
  }


  private updateTask(body: ITaskUpdate): void {
    this.taskService.update(this.id, body).pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(() => {
      this.isLoading = false;
      this.snackbar.open('Task updated successfully', 'close', {
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      this.formDirective.resetForm();
      this.dismiss(true);
    });
  }

  private createTask(body: ITaskCreate): void {
    this.taskService.create(body).pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(() => {
      this.isLoading = false;
      this.snackbar.open('Task created successfully', 'close', {
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      this.formDirective.resetForm();
      this.selectedTags = [];
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      start_at: [''],
      priority: ['', Validators.required],
      tagValues: ''
    });
  }

  private getTags(): void {
    this.tags$ = this.tagSearchString$.pipe(
      switchMap((value: string) => this.taskService.getTags(value)),
      map(tags => {
        return tags.filter(tagObj => !this.selectedTags.find(tag => tagObj.title === tag));
      })
    );
  }

}
