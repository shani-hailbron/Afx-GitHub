import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    username = '';
    password = '';
    loading = false;
    error: string | null = null;

    constructor(private auth: AuthService, private router: Router) { }

    // Validates username/password and calls AuthService.login()
    submit() {
        this.error = null;
        if (!this.username || !this.password) {
            this.error = 'Please enter username and password';
            return;
        }
        this.loading = true;
        // If success Save auth token and Navigate to search page
        this.auth.login({ username: this.username, password: this.password }).subscribe({
            next: res => {
                this.auth.setToken(res.token);
                this.router.navigateByUrl('/search');
            },
            error: err => {
                this.error = err?.error?.message || 'Login Error';
                this.loading = false;
            }
        });
    }
}