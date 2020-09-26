import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';
import { IUser } from '../interfaces/user.interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {
  private cachedUser$: Observable<IUser>;

  getUser(): Observable<IUser> {
    if (!this.cachedUser$) {
      this.cachedUser$ = this.get<IUser>('user').pipe(
        publishReplay(1),
        refCount()
      );
    }
    return this.cachedUser$;
  }
}
