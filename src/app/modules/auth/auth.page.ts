import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
