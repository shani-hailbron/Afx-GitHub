import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'fnx_token';

@Injectable({ providedIn: 'root' })
export class AuthService {

    // Reactive token storage, initialized from localStorage and Computed property to know if the user is authenticated
    private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
    isAuthenticated = computed(() => !!this._token());

    constructor(private http: HttpClient) { }

    //Call login request to the server
    login(payload: LoginRequest) {
        return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/auth/login`, payload);
    }

    //Sets token both in localStorage and reactive signal
    setToken(token: string) {
        localStorage.setItem(TOKEN_KEY, token);
        this._token.set(token);
    }

    //Returns current token value
    get token(): string | null { return this._token(); }

    //Logout: removes token from storage and reactive state
    logout() {
        localStorage.removeItem(TOKEN_KEY);
        this._token.set(null);
    }
}