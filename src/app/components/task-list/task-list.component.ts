import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TASK_STATUS } from 'src/app/core/enums/task-status.enum';
import { TaskModel } from 'src/app/core/models/task.model';
import { CreateTaskComponent } from 'src/app/modules/tabs/create-task/create-task.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))  // final
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({
            transform: 'scale(0.5)', opacity: 0,
            height: '0px', margin: '0px'
          }))
      ])
    ])
  ]
})
export class TaskListComponent {
  @Input() tasks: TaskModel[];
  @Output() finishTask = new EventEmitter<TaskModel>();
  @Output() startTask = new EventEmitter<TaskModel>();
  @Output() deleteTask = new EventEmitter<TaskModel>();
  @Output() afterTaskEdited = new EventEmitter();
  selectedTask: TaskModel;

  constructor(
    private modalController: ModalController
  ) { }

  trackByFn(index: number, task: TaskModel): number {
    return task.id;
  }

  onFinish() {
    this.finishTask.emit(this.selectedTask);
  }

  onStart() {
    this.startTask.emit(this.selectedTask);
  }

  onDelete() {
    this.deleteTask.emit(this.selectedTask);
  }

  get statusList() {
    return TASK_STATUS;
  }

  async onEdit() {
    const modal = await this.modalController.create({
      component: CreateTaskComponent,
      cssClass: 'defeault-modal',
      componentProps: {
        id: this.selectedTask.id
      }
    });

    modal.onDidDismiss().then((res) => {
      if (res.data) {
        this.afterTaskEdited.emit();
      }
    });

    await modal.present();
  }

}
