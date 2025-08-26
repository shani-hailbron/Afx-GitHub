import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GithubSearchResponse } from '../models/repo.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GithubService {
    constructor(private http: HttpClient) { }

    //Calls backend API to search repositories on GitHub
    searchRepositories(query: string) {
        const params = new HttpParams().set('query', query);
        return this.http.get<GithubSearchResponse>(`${environment.apiBaseUrl}/api/github/search`, { params });
    }
}