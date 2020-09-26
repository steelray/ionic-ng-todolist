import { AbstractControl, FormControl } from '@angular/forms';

export class PasswordValidation {
  static matchPassword(AC: FormControl) {
    return new Promise(resolve => {
      const password = AC.parent.get('password').value; // to get value in input tag
      const confirmPassword = AC.value; // to get value in input tag
      if (password === confirmPassword) {
        return resolve(null); // All ok, passwords match!!!
      } else {
        return resolve({ matchPassword: true })
      }
    });

  }
}
