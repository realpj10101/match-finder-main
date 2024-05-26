import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { Subscription, take } from 'rxjs';
import { MemberService } from '../../../services/member.service';
import { Member } from '../../../models/member.model';
import { PhotoEditorComponent } from '../photo-editor/photo-editor.component';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, AbstractControl, FormControl, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment.development';
import { UserService } from '../../../services/user.service';
import { UserUpdate } from '../../../models/user-update.model';
import { ApiResponse } from '../../../models/helpers/apiResponse.model';
import { LoggedInUser } from '../../../models/logged-in-user.model';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule, NgOptimizedImage, FormsModule, ReactiveFormsModule,
    PhotoEditorComponent,
    MatCardModule, MatTabsModule, MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit {
  private accountService = inject(AccountService);
  private memberService = inject(MemberService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private matSnak = inject(MatSnackBar);
  private platfromId = inject(PLATFORM_ID);

  apiPhotoUrl = environment.apiPhotoUrl;
  subscribedMember: Subscription | undefined;
  member: Member | undefined;

  readonly maxTextAreaChars: number = 1000;
  readonly minInputChars: number = 2;
  readonly maxInputChars: number = 30;

  ngOnInit(): void {
    this.getMember();
  }

  getMember(): void {
    if (isPlatformBrowser(this.platfromId)) {
      const loggedInUserStr: string | null = localStorage.getItem('loggedInUser');

      if (loggedInUserStr) {
        const loggedInUser: LoggedInUser = JSON.parse(loggedInUserStr);

        this.memberService.getByEmail(loggedInUser.email)?.pipe(take(1)).subscribe(member => {
          if (member) {
            this.member = member;

            this.initContollersValues(member);
          }
        });

      }
    }
  }

  userEditFg: FormGroup = this.fb.group({
    introductionCtrl: ['', [Validators.maxLength(this.maxTextAreaChars)]],
    lookingForCtrl: ['', [Validators.maxLength(this.maxTextAreaChars)]],
    interestsCtrl: ['', [Validators.maxLength(this.maxTextAreaChars)]],
    cityCtrl: ['', [Validators.minLength(this.minInputChars), Validators.maxLength(this.maxInputChars)]],
    countryCtrl: ['', [Validators.minLength(this.minInputChars), Validators.maxLength(this.maxInputChars)]]
  });

  get IntroductionCtrl(): AbstractControl {
    return this.userEditFg.get('introductionCtrl') as FormControl;
  }
  get LookingForCtrl(): AbstractControl {
    return this.userEditFg.get('lookingForCtrl') as FormControl;
  }
  get InterestsCtrl(): AbstractControl {
    return this.userEditFg.get('interestsCtrl') as FormControl;
  }
  get CityCtrl(): AbstractControl {
    return this.userEditFg.get('cityCtrl') as FormControl;
  }
  get CountryCtrl(): AbstractControl {
    return this.userEditFg.get('countryCtrl') as FormControl;
  }

  initContollersValues(member: Member) {
    this.IntroductionCtrl.setValue(member.introduction);
    this.LookingForCtrl.setValue(member.lookingFor);
    this.InterestsCtrl.setValue(member.interests);
    this.CityCtrl.setValue(member.city?.toUpperCase());
    this.CountryCtrl.setValue(member.country.toUpperCase());
  }

  updateUser(): void {
    if (this.member) {
      let updatedUser: UserUpdate = {
        introduction: this.IntroductionCtrl.value,
        lookingFor: this.LookingForCtrl.value,
        interests: this.InterestsCtrl.value,
        city: this.CityCtrl.value,
        country: this.CountryCtrl.value
      }

      this.userService.updateUser(updatedUser)
        .pipe(take(1))
        .subscribe({
          next: (response: ApiResponse) => {
            if (response.message) {
              this.matSnak.open(response.message, "Close", { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 10000 });
            }
          }
        });

      this.userEditFg.markAsPristine();
    }
  }

  // logForm() {
  //   console.log(this.LookingForCtrl)
  // }
}
