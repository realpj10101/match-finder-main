import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ApiResponse } from '../models/helpers/apiResponse.model';
import { UserUpdate } from '../models/user-update.model';
import { Member } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl + 'user/';
  members: Member[] = [];

    updateUser(userUpdate: UserUpdate): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.apiUrl, userUpdate);
      // .pipe(
      //   finalize(() => {
      //     const user = this.members.find(user => user.id === userUpdate.id);

      //     if (user) {
      //       const index = this.members.indexOf(user);
      //       this.members[index] = { ...this.members[index], ...userUpdate } // copy userUpdate to the list's user
      //     }
      //   })
      // );
  }

  setMainPhoto(url_165In: string): Observable<ApiResponse> {
    let queryParams = new HttpParams().set('photoUrlIn', url_165In);

    return this.http.put<ApiResponse>(this.apiUrl + 'set-main-photo', null, { params: queryParams });
  }

  deletePhoto(url_165In: string): Observable<ApiResponse> {
    let queryParams = new HttpParams().set('photoUrlIn', url_165In);

    return this.http.put<ApiResponse>(this.apiUrl + 'delete-photo', null, { params: queryParams });
  }
}
