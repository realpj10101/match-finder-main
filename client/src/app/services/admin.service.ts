import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { UserWithRole } from '../models/user-with-role.model';
import { ApiResponse } from '../models/helpers/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private http = inject(HttpClient);
  private apiUrl: string = environment.apiUrl + 'admin/';

  getUsersWithRoles(): Observable<UserWithRole[]> {
    return this.http.get<UserWithRole[]>(this.apiUrl + 'users-with-roles')
  }

  deleteUser(userName: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.apiUrl + 'delete-member/' + userName);
  }
}
