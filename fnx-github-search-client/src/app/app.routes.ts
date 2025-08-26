import { Routes } from '@angular/router';
import { SearchComponent } from './features/search/search.component';
import { BookmarksComponent } from './features/bookmarks/bookmarks.component';
import { authGuard } from '../core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'search', component: SearchComponent, canActivate: [authGuard] },
    { path: 'bookmarks', component: BookmarksComponent, canActivate: [authGuard] },
    { path: '', pathMatch: 'full', redirectTo: 'search' },
    { path: '**', redirectTo: 'search' }
];