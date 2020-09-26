import {HttpHeaders} from '@angular/common/http';

export interface IResponseWithHeaders<T> {
  body: T[];
  headers: HttpHeaders;
  ok: boolean;
  status: number;
  statusText: string;
  type: number;
  url: string;
}
