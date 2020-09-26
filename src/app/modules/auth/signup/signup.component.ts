import { ChangeDetectionStrategy, Component, OnInit, Self } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { NgOnDestroy } from 'src/app/core/services/destroy.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { onlyAlphanumberPattern } from 'src/app/core/const/only-alphanumber';
import { PasswordValidation } from 'src/app/core/models/password-valiadtion';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgOnDestroy]
})
export class SignupComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    @Self() private onDestroy$: NgOnDestroy,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.snackbar.open('Fix the errors please', 'close');
      return;
    }
  }

  get controls() {
    return this.form.controls;
  }


  private buildForm(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(onlyAlphanumberPattern)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repeat_password: ['', Validators.required, PasswordValidation.matchPassword],
    });
  }
}
