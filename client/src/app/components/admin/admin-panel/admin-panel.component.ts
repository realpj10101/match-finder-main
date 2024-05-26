import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { UserWithRole } from '../../../models/user-with-role.model';
import { Subscription, take } from 'rxjs';
import { ApiResponse } from '../../../models/helpers/apiResponse.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatTableModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);
  private deleteSubscription: Subscription | undefined;

  displayedColumns = ['no', 'username', 'active-roles', 'delete-user'];
  usersWithRoles: UserWithRole[] = [];

  ngOnInit(): void {
    this.showAllUsersWithRoles();
  }

  ngOnDestroy(): void {
    this.deleteSubscription?.unsubscribe();
  }

  showAllUsersWithRoles(): void {
    this.adminService.getUsersWithRoles()
      .pipe(
        take(1)
      ).subscribe({
        next: users => this.usersWithRoles = users
      });
  }

  deleteUser(i: number, userName: string): void {
    this.deleteSubscription = this.adminService.deleteUser(userName)
      .subscribe({
        next: (response: ApiResponse) => {
          this.snackBar.open(response.message, "Close", { horizontalPosition: "center", verticalPosition: "bottom", duration: 7000 });

          // this.usersWithRoles.splice(i, 1); Triggers when normal "for" loop is used in DOM. 

          // Slice and copy the array to trigger the change detection to update the mat-table
          if (this.usersWithRoles)
            this.usersWithRoles = [
              ...this.usersWithRoles.slice(0, i),
              ...this.usersWithRoles.slice(i + 1)
            ];
        }
      }
      );
  }
}
