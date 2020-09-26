import { TASK_STATUS } from '../enums/task-status.enum';
import { ITag } from './tag.interface';

export interface ITask {
  id: number;
  title: string;
  start_at: number;
  end_at: number;
  status: TASK_STATUS;
  priority: number;
  tags?: ITag[];
}

export interface ITaskCreate {
  title: string;
  start_at: number;
  priority: number;
  tagValues: string[];
}

export interface ITaskUpdate {
  title?: string;
  priority?: number;
  status?: TASK_STATUS;
  endt_at?: number;
}
