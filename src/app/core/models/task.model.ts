import { TASK_STATUS } from '../enums/task-status.enum';
import { ITask } from '../interfaces/task.interface';

export class TaskModel implements ITask {
  id: number;
  title: string;
  // tslint:disable-next-line:variable-name
  start_at: number;
  // tslint:disable-next-line:variable-name
  end_at: number;
  status: number;
  priority: number;


  constructor(task: ITask) {
    for (const key of Object.keys(task)) {
      this[key] = task[key];
    }
  }

  get startAt(): Date {
    return this.tsToDate(this.start_at);
  }

  get endAt(): Date {
    return this.tsToDate(this.end_at);
  }

  get statusText() {
    return this.status === TASK_STATUS.DONE ? 'Done' : 'Undone';
  }

  get canEdit() {
    return this.status !== TASK_STATUS.DONE;
  }

  get canStart() {
    return this.status === TASK_STATUS.UNDONE;
  }

  get canFinish() {
    return this.status === TASK_STATUS.IN_PROGRESS;
  }


  private tsToDate(ts: number): Date {
    return new Date(ts * 1000);
  }

}
