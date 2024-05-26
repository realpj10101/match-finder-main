import { Routes } from '@angular/router';
import { LoginComponent } from './components/account/login/login.component';
import { RegisterComponent } from './components/account/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { authLoggedInGuard } from './guards/auth-logged-in.guard';
import { MessagesComponent } from './components/messages/messages.component';
import { NoAccessComponent } from './components/errors/no-access/no-access.component';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { ServerErrorComponent } from './components/errors/server-error/server-error.component';
import { MemberListComponent } from './components/members/member-list/member-list.component';
import { MemberCardComponent } from './components/members/member-card/member-card.component';
import { MemberDetailsComponent } from './components/members/member-details/member-details.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';
import { FriendsComponent } from './components/friends/friends.component';
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: 'members', component: MemberListComponent },
            { path: 'member-card', component: MemberCardComponent },
            { path: 'member-details/:id', component: MemberDetailsComponent },
            { path: 'user/user-edit', component: UserEditComponent },
            { path: 'messages', component: MessagesComponent },
            { path: 'friends', component: FriendsComponent },
            { path: 'admin', component: AdminPanelComponent },
            { path: 'no-access', component: NoAccessComponent }
        ]
    },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authLoggedInGuard],
        children: [
            { path: 'account/login', component: LoginComponent },
            { path: 'account/register', component: RegisterComponent },
        ]
    },
    { path: 'server-error', component: ServerErrorComponent },
    { path: '**', component: NotFoundComponent, pathMatch: 'full' }
];

///// BASIC STYLE
// { path: '', component: HomeComponent },
// { path: 'home', component: HomeComponent },
// { path: 'members', component: MemberListComponent, canActivate: [authGuard] },
// { path: 'messages', component: MessagesComponent, canActivate: [authGuard] },
// { path: 'account/register', component: RegisterComponent, canActivate: [authLoggedInGuard] },
// { path: 'account/login', component: LoginComponent, canActivate: [authLoggedInGuard] },
// { path: 'no-access', component: NoAccessComponent, canActivate: [authGuard] },
// { path: 'server-error', component: ServerErrorComponent },
// { path: '**', component: NotFoundComponent },
