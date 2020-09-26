export class TaskDto {
  id?: number;
  title?: string;
  // tslint:disable-next-line:variable-name
  startAt?: number;
  // tslint:disable-next-line:variable-name
  endAt?: number;
  statusArr?: string;
  limit?: number;
  page?: number;
}
