import { Component, OnInit, Signal, inject } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { LoggedInUser } from '../../models/logged-in-user.model';
import { environment } from '../../../environments/environment.development';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    CommonModule, RouterModule, HttpClientModule, NgOptimizedImage,
    MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule,
    MatDividerModule, MatListModule, MatTabsModule
  ]
})
export class NavbarComponent implements OnInit {
  //#region injects and vars
  private accountService = inject(AccountService);

  photoUrl: string = environment.apiPhotoUrl;

  // loggedInUser$: Observable<LoggedInUser | null> | undefined; OLD
  loggedInUserSig: Signal<LoggedInUser | null> | undefined;

  linksWithAdmin: string[] = ['members', 'friends', 'messages', 'admin'];
  links: string[] = ['members', 'friends', 'messages'];
  //#endregion

  ngOnInit(): void {
    // this.loggedInUser$ = this.accountService.currentUser$; // OLD
    this.loggedInUserSig = this.accountService.loggedInUserSig;

    // console.log('THE LOGGED-IN USER:', this.loggedInUserSig()?.knownAs);
  }

  logout(): void {
    this.accountService.logout();
  }
}
