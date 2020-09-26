import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskDto } from '../dto/task.dto';
import { HttpObserve } from '../enums/http-observe.enum';
import { IResponseWithHeaders } from '../interfaces/response-with-headers.interface';
import { ITag } from '../interfaces/tag.interface';
import { ITask, ITaskCreate, ITaskUpdate } from '../interfaces/task.interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends ApiService {
  private readonly action = 'tasks';
  fetchAll(params: TaskDto = {}): Observable<IResponseWithHeaders<ITask>> {
    return this.get<IResponseWithHeaders<ITask>>(this.action, { params, observe: HttpObserve.RESPONSE });
  }

  fetchOne(id: number): Observable<ITask> {
    return this.get<ITask>(`${this.action}/${id}?expand=tags`);
  }

  create(body: ITaskCreate): Observable<ITask> {
    return this.post(this.action, body);
  }

  update(id: number, body: ITaskUpdate): Observable<ITask> {
    return this.put(`${this.action}/${id}`, body);
  }

  drop(id: number) {
    return this.delete(`${this.action}/${id}`);
  }

  getTags(title = ''): Observable<ITag[]> {
    const params: any = {};
    if (title) {
      params.title = title;
    }
    return this.get('tags', { params });
  }

}
