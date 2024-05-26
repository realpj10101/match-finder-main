import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterUser } from '../../../models/register-user.model';
import { AccountService } from '../../../services/account.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { AutoFocusDirective } from '../../../directives/auto-focus.directive';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSnackBarModule, MatRadioModule, 
    MatDatepickerModule, MatNativeDateModule,
    AutoFocusDirective
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {
  //#region injects and vars
  accountService = inject(AccountService);
  fb = inject(FormBuilder);

  minDate = new Date(); // yyyy/mm/dd/hh/mm/ss
  maxDate = new Date();

  passowrdsNotMatch: boolean | undefined;
  subscribedRegisterUser: Subscription | undefined;
  emailExistsError: string | undefined;
  //#endregion injects and vars

  //#region auto-run methods
  ngOnInit(): void {
    // set datePicker year limitations
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 99, 0, 1); // not older than 99 years
    this.maxDate = new Date(currentYear - 18, 0, 1); // not earlier than 18 years
  }

  ngOnDestroy(): void {
    this.subscribedRegisterUser?.unsubscribe();
  }
  //#endregion auto-run methods

  //#region FormGroup
  registerFg = this.fb.group({
    genderCtrl: ['female', [Validators.required]],
    emailCtrl: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,5})+)$/)]], // Use / instead of ' around RegEx
    userNameCtrl: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    passwordCtrl: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
    confirmPasswordCtrl: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
    knownAsCtrl: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    dateOfBirthCtrl: ['', [Validators.required]],
    cityCtrl: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    countryCtrl: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
  })

  get GenderCtrl(): FormControl {
    return this.registerFg.get('genderCtrl') as FormControl;
  }
  get EmailCtrl(): FormControl {
    return this.registerFg.get('emailCtrl') as FormControl;
  }
  get UserNameCtrl(): FormControl {
    return this.registerFg.get('userNameCtrl') as FormControl;
  }
  get PasswordCtrl(): FormControl {
    return this.registerFg.get('passwordCtrl') as FormControl;
  }
  get ConfirmPasswordCtrl(): FormControl {
    return this.registerFg.get('confirmPasswordCtrl') as FormControl;
  }
  get KnownAsCtrl(): FormControl {
    return this.registerFg.get('knownAsCtrl') as FormControl;
  }
  get DateOfBirthCtrl(): FormControl {
    return this.registerFg.get('dateOfBirthCtrl') as FormControl;
  }
  get CityCtrl(): FormControl {
    return this.registerFg.get('cityCtrl') as FormControl;
  }
  get CountryCtrl(): FormControl {
    return this.registerFg.get('countryCtrl') as FormControl;
  }
  //#endregion FormGroup

  //#region Methods

  /**
   * Create a RegisterUser object
   * call accountService.registerUser to send data to api
   */
  register(): void {
    const dob: string | undefined = this.getDateOnly(this.DateOfBirthCtrl.value);

    if (this.PasswordCtrl.value === this.ConfirmPasswordCtrl.value) {
      this.passowrdsNotMatch = false;

      let registerUser: RegisterUser = {
        gender: this.GenderCtrl.value,
        email: this.EmailCtrl.value,
        userName: this.UserNameCtrl.value,
        password: this.PasswordCtrl.value,
        confirmPassword: this.ConfirmPasswordCtrl.value,
        dateOfBirth: dob,
        knownAs: this.KnownAsCtrl.value,
        city: this.CityCtrl.value,
        country: this.CountryCtrl.value
      }

      // reutrn: Observable<User> | Promise ().then()
      this.subscribedRegisterUser = this.accountService.registerUser(registerUser).subscribe({
        next: user => console.log(user),
        error: err => this.emailExistsError = err.error
      });
    }
    else {
      this.passowrdsNotMatch = true;
    }
  }

  /**
   * convert Angular Date to C# DateOnly
   * @param dob // yyyy/mm/dd/hh/mm/ss. Takes DateOfBirth
   * @returns yyyy/mm/dd
   */
  private getDateOnly(dob: string | null): string | undefined {
    if (!dob) return undefined;

    let theDob: Date = new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset())).toISOString().slice(0, 10);
  }

  getState(): void {
    console.log(this.registerFg);
  }
  //#endregion Methods
}
