import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Member } from '../models/member.model';
import { PaginatedResult } from "../models/helpers/paginatedResult";
import { MemberParams } from '../models/helpers/member-params';
import { PaginationHandler } from '../extensions/paginationHandler';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);

  private readonly baseApiUrl = environment.apiUrl + 'member/';
  private paginationHandler = new PaginationHandler();

  // Observable / Promise
  getAll(memberParams: MemberParams): Observable<PaginatedResult<Member[]>> {
    let params = new HttpParams();

    if (memberParams) {
      params = params.append('pageNumber', memberParams.pageNumber);
      params = params.append('pageSize', memberParams.pageSize);
    }

    // Use this generic method and make it reusable for all components. 
    return this.paginationHandler.getPaginatedResult<Member[]>(this.baseApiUrl, params);
  }

  getByEmail(emailInput: string): Observable<Member | null> {
    return this.http.get<Member>(this.baseApiUrl + 'get-by-email/' + emailInput); //localhost:5000/api/member/get-by-email/a2@a.com
  }
}

// PLACE AUTH IN REQUEST HEADER DIRECTLY. Used in getAllMembers()
//#region Create requestOptions like headers for each and every http-request
// let requestOptions; // Type is not declared since options can vary. see this page
// https://angular.io/api/common/http/HttpClient

// this.accountService.currentUser$.pipe(take(1)).subscribe({
//   next: (currentUser: User | null) => {
//     if (currentUser) {
//       requestOptions = {
//         headers: new HttpHeaders({ 'Authorization': `Bearer ${currentUser.token}` })
//       }
//     }
//   }
// });

// return this.http.get<User[]>('https://localhost:5001/api/user', requestOptions).pipe(
//#endregion