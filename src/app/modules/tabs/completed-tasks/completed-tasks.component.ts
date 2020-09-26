import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Self, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController, IonInfiniteScroll, ModalController } from '@ionic/angular';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounce, debounceTime, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { TasksFilterComponent } from 'src/app/components/tasks-filter/tasks-filter.component';
import { TASK_STATUS } from 'src/app/core/enums/task-status.enum';
import { TaskModel } from 'src/app/core/models/task.model';
import { NgOnDestroy } from 'src/app/core/services/destroy.service';
import { TaskService } from 'src/app/core/services/task.service';
import { getPageCountFromRes } from 'src/app/core/utils/get-header.util';

@Component({
  selector: 'app-completed-tasks',
  templateUrl: './completed-tasks.component.html',
  styleUrls: ['./completed-tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgOnDestroy]
})
export class CompletedTasksComponent implements OnInit {
  title = 'Completed tasks';

  tasks: TaskModel[] = [];
  updateTasks$ = new BehaviorSubject(null);
  firstView = true;

  pageCount = 0;

  filterForm: FormGroup;
  startLimit = 10;
  startPage = 0;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private taskService: TaskService,
    @Self() private onDestroy$: NgOnDestroy,
    private alertController: AlertController,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private modalController: ModalController
  ) { }

  ionViewDidEnter() {
    if (!this.firstView) {
      this.updateTasks$.next(null);
    }
  }

  ionViewDidLeave() {
    this.controls.page.setValue(0);
    this.firstView = false;
  }

  ngOnInit() {
    this.buildFilterForm();

    this.controls.title.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.onDestroy$)
    ).subscribe(() => this.updateTasks$.next(null));

    this.updateTasks$.pipe(
      switchMap(() => this.getData()),
      takeUntil(this.onDestroy$)
    ).subscribe(res => {
      this.tasks = res;
      this.cdRef.detectChanges();
    });

  }

  get controls() {
    return this.filterForm.controls;
  }

  loadData(event: any) {
    this.startPage++;

    if (this.startPage === this.pageCount) {
      event.target.disabled = true;
      return;
    }
    this.filterForm.get('page').setValue(this.startPage);

    this.getData()
      .pipe(
        finalize(() => event.target.complete()),
        takeUntil(this.onDestroy$)
      )
      .subscribe(res => {
        this.tasks = [...this.tasks, ...res];
        // this.addItem();
        this.cdRef.detectChanges();
      });

  }

  async showFilter() {
    const modal = await this.modalController.create({
      cssClass: 'default-modal',
      component: TasksFilterComponent,
      componentProps: {
        form: this.filterForm
      }
    });

    modal.onDidDismiss().then((res) => {
      if (res.data) {
        this.updateTasks$.next(true);
      }
    });

    await modal.present();
  }

  async onTaskDelete(task: TaskModel) {
    const alert = await this.alertController.create({
      cssClass: 'default-alert',
      header: 'Do you really want to delete the task?',
      message: task.title,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          role: 'delete',
          cssClass: 'danger',
          handler: () => {
            this.deleteTask(task.id);
          }
        }
      ]
    });
    return await alert.present();
  }

  private getData(): Observable<TaskModel[]> {
    const params = this.prepareParams(this.filterForm.value);

    return this.taskService.fetchAll({ statusArr: TASK_STATUS.DONE, ...params }).pipe(
      tap(res => this.pageCount = getPageCountFromRes(res.headers)),
      map(res => {
        return res.body.map(task => new TaskModel(task));
      })
    );
  }

  private buildFilterForm(): void {
    this.filterForm = this.fb.group({
      title: '',
      startAt: '',
      endAt: '',
      limit: this.startLimit,
      page: this.startPage
    });
  }

  private deleteTask(id: number): void {
    this.taskService.drop(id).pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(() => {
      this.controls.page.setValue(0);
      this.updateTasks$.next(null);
    });
  }

  private prepareParams(form: any) {
    form.startAt = form.startAt
      ?
      Math.ceil(
        this.setDateHours(form.startAt).getTime() / 1000
      )
      :
      0;

    form.endAt = form.endAt
      ?
      Math.ceil(
        this.setDateHours(form.endAt, 'end').getTime() / 1000
      )
      :
      0;
    return form;
  }

  private setDateHours(dateStr: string, hours: 'start' | 'end' = 'start'): Date {
    const date = new Date(dateStr);

    if (hours === 'start') {
      date.setHours(0, 0, 0, 0);
    } else {
      date.setHours(23, 59, 59, 999);
    }

    return date;
  }

  // for infinite scroll testing
  private addItem() {
    const newItems: TaskModel[] = [
      new TaskModel({
        id: 1,
        title: 'asasd',
        start_at: 1,
        end_at: 2,
        priority: 4,
        status: TASK_STATUS.DONE
      }),
      new TaskModel({
        id: 1,
        title: 'asasd',
        start_at: 1,
        end_at: 2,
        priority: 4,
        status: TASK_STATUS.DONE
      }),
      new TaskModel({
        id: 1,
        title: 'asasd',
        start_at: 1,
        end_at: 2,
        priority: 4,
        status: TASK_STATUS.DONE
      })
    ];
    this.tasks = [...this.tasks, ...newItems];
  }
}
