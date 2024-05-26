import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { Observable, map, take } from 'rxjs';
import { RegisterUser } from '../models/register-user.model';
import { LoginUser } from '../models/login-user.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { LoggedInUser } from '../models/logged-in-user.model';
import { ApiResponse } from '../models/helpers/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  //#region injects and variables
  http = inject(HttpClient);
  router = inject(Router);
  platformId = inject(PLATFORM_ID); // used to test if we are in the client(browser) or server. We must be on the client to access localStorage!

  private readonly baseApiUrl = environment.apiUrl + 'account/';

  // private currentUserSource = new BehaviorSubject<LoggedInUser | null>(null);
  // currentUser$ = this.currentUserSource.asObservable();

  loggedInUserSig = signal<LoggedInUser | null>(null);

  //#endregion injects and variables

  //#region methods
  registerUser(userInput: RegisterUser): Observable<LoggedInUser | null> {
    return this.http.post<LoggedInUser>(this.baseApiUrl + 'register', userInput).pipe(
      map(userResponse => {
        if (userResponse) {
          this.setCurrentUser(userResponse);

          this.navigateToReturnUrl(); // navigate to the url which user tried before log-in. esle: default

          return userResponse;
        } // false

        return null;
      })
    );
  }

  loginUser(userInput: LoginUser): Observable<LoggedInUser | null> {
    return this.http.post<LoggedInUser>(this.baseApiUrl + 'login', userInput).pipe(
      map(userResponse => {
        if (userResponse) {
          this.setCurrentUser(userResponse);

          this.navigateToReturnUrl(); // navigate to the url which user tried before log-in. esle: default

          return userResponse;
        }

        return null;
      })
    );
  }

  /**
   * Check if user's token is still valid or log them out. 
   * Called in app.component.ts
   * @returns Observable<LoggedInUser | null>
   */
  authorizeLoggedInUser(): void {
    this.http.get<ApiResponse>(this.baseApiUrl)
      .pipe(
        take(1))
      .subscribe({
        next: res => console.log(res.message),
        error: err => {
          console.log(err.error);
          this.logout()
        }
      });
  }

  setCurrentUser(loggedInUser: LoggedInUser): void {
    this.setLoggedInUserRoles(loggedInUser);

    this.loggedInUserSig.set(loggedInUser);

    if (isPlatformBrowser(this.platformId)) // we make sure this code is ran on the browser and NOT server
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
  }

  setLoggedInUserRoles(loggedInUser: LoggedInUser): void {
    loggedInUser.roles = []; // We have to initialize it before pushing. Otherwise, it's 'undefined' and push will not work. 

    const roles: string | string[] = JSON.parse(atob(loggedInUser.token.split('.')[1])).role; // get the token's 2nd part then select role

    Array.isArray(roles) ? loggedInUser.roles = roles : loggedInUser.roles.push(roles);
  }

  logout(): void {
    this.loggedInUserSig.set(null);

    if (isPlatformBrowser(this.platformId)) {
      // localStorage.removeItem('loggedInUser');
      // localStorage.removeItem('returnUrl');
      localStorage.clear(); // delete all browser's localStorage's items at once
    }

    this.router.navigateByUrl('account/login');
  }

  private navigateToReturnUrl(): void {
    if (isPlatformBrowser(this.platformId)) {
      const returnUrl = localStorage.getItem('returnUrl');
      if (returnUrl)
        this.router.navigate([returnUrl]);
      else
        this.router.navigate(['members']);

      if (isPlatformBrowser(this.platformId)) // we make sure this code is ran on the browser and NOT server
        localStorage.removeItem('returnUrl');
    }
  }
  //#endregion methods
}
