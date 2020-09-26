import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutButtonComponent implements OnInit {
  user$: Observable<IUser>;
  constructor(
    public authService: AuthService,
    public userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user$ = this.userService.getUser();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

}
