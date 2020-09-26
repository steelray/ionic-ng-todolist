import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthPage } from './auth.page';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    path: '',
    component: AuthPage,

    children: [

      {
        path: 'sign-in',
        component: SigninComponent
      },
      {
        path: 'sign-up',
        component: SignupComponent
      },
      {
        path: '',
        redirectTo: '/auth/sign-in',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule { }
