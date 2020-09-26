import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Self } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { NgOnDestroy } from 'src/app/core/services/destroy.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { onlyAlphanumberPattern } from 'src/app/core/const/only-alphanumber';
import { finalize, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgOnDestroy]
})
export class SigninComponent implements OnInit {
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

    const { username, password } = this.form.value;

    this.authService.signin(username, password).pipe(
      takeUntil(this.onDestroy$)
    ).subscribe((res: any) => {
      this.isLoading = false;
      if (res.token) {
        this.authService.saveToken(res.token);
        this.router.navigate(['/']);
      } else if (res.message && res.message.password) {
        this.controls.password.setErrors({ notFound: true });
        this.cdRef.detectChanges();
      }
    });
  }

  get controls() {
    return this.form.controls;
  }


  private buildForm(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(onlyAlphanumberPattern)]],
      password: ['', Validators.required]
    });
  }

}
