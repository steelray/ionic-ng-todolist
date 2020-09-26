import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
  // tslint:disable-next-line:variable-name
  private __tokenKeyName = '__lnAuthToken';


  saveUser(data: any): Observable<any> {
    return this.post(
      this.isAuthed ? 'update-profile' : 'signup',
      data
    );
  }

  signin(username: string, password: string) {
    return this.post('signin', {
      username,
      password
    });
  }

  logout(): void {
    localStorage.removeItem(this.__tokenKeyName);
  }

  get authHeaders() {
    return new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
  }

  get isAuthed(): boolean {
    return !!this.authToken;
  }

  get authToken(): string | null {
    return localStorage.getItem(this.__tokenKeyName);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.__tokenKeyName, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.__tokenKeyName);
  }
}
