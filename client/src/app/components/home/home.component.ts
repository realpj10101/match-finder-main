import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { AccountService } from '../../services/account.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, MatButtonModule],
})
export class HomeComponent {
  userService = inject(UserService);
  accountService = inject(AccountService);

  allUsers: User[] | null | undefined;
  allUsers$: Observable<User[] | null> | undefined;
  // subscription: Subscription | undefined;

  // ngOnDestroy(): void {
  //   this.subscription?.unsubscribe();

  //   console.log('This is OnDestroy');
  // }
}
