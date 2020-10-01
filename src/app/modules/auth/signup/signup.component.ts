import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Self } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { NgOnDestroy } from 'src/app/core/services/destroy.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { onlyAlphanumberPattern } from 'src/app/core/const/only-alphanumber';
import { PasswordValidation } from 'src/app/core/models/password-valiadtion';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgOnDestroy]
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    @Self() private onDestroy$: NgOnDestroy,
    private snackbar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.snackbar.open('Fix the errors please', 'close');
      return;
    }

    this.isLoading = true;

    this.authService.saveUser(this.form.value).pipe(
      takeUntil(this.onDestroy$)
    ).subscribe((res: any) => {
      this.isLoading = false;
      if (res.err) {

        for (const key of Object.keys(res.err)) {
          this.controls[key].setErrors({ serverError: res.err[key] });
        }

        this.cdRef.detectChanges();

      } else {
        this.authService.saveToken(res.token);
        this.router.navigate(['/']);
      }
    });
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
