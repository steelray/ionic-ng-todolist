import { ChangeDetectionStrategy, Component, OnInit, Self } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { TASK_STATUS } from 'src/app/core/enums/task-status.enum';
import { TaskModel } from 'src/app/core/models/task.model';
import { NgOnDestroy } from 'src/app/core/services/destroy.service';
import { TaskService } from 'src/app/core/services/task.service';

@Component({
  selector: 'app-current-tasks',
  templateUrl: './current-tasks.component.html',
  styleUrls: ['./current-tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgOnDestroy]
})
export class CurrentTasksComponent implements OnInit {
  title = 'Current tasks';
  tasks$: Observable<TaskModel[]>; // tasks for current day
  updateTasks$ = new BehaviorSubject(null);
  firstView = true;

  constructor(
    private taskService: TaskService,
    @Self() private onDestroy$: NgOnDestroy,
    private alertController: AlertController
  ) { }

  ionViewDidEnter() {
    if (!this.firstView) {
      this.updateTasks$.next(null);
    }
  }

  ionViewDidLeave() {
    this.firstView = false;
  }

  ngOnInit() {
    this.tasks$ = this.updateTasks$.pipe(
      switchMap(() => this.taskService.fetchAll({
        statusArr: [TASK_STATUS.UNDONE, TASK_STATUS.IN_PROGRESS].join(','),
        limit: 100
      })),
      map(tasks => {
        return tasks.body.map(task => new TaskModel(task));
      })
    );
  }

  afterTaskEdited() {
    this.updateTasks$.next(null);
  }

  onTaskStart(task: TaskModel) {
    this.changeTaskStatus(task.id, TASK_STATUS.IN_PROGRESS);
  }

  async onTaskFinish(task: TaskModel) {
    const alert = await this.alertController.create({
      cssClass: 'default-alert',
      header: 'Do you really want to finish the task?',
      message: task.title,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Finish',
          role: 'finish',
          cssClass: 'danger',
          handler: () => {
            this.changeTaskStatus(task.id, TASK_STATUS.DONE);
          }
        }
      ]
    });
    return await alert.present();
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

  private deleteTask(id: number): void {
    this.taskService.drop(id).pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(() => this.updateTasks$.next(null));
  }

  private changeTaskStatus(id: number, status: TASK_STATUS): void {
    this.taskService.update(id, { status }).pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(() => {
      this.updateTasks$.next(null);
    });
  }



}
