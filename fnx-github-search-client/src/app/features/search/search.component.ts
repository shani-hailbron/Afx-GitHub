import { Component, OnInit, inject, signal } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Repo } from '../../../core/models/repo.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RepoCardComponent } from '../../../shared/components/repo-card/repo-card.component';
import { GithubService } from '../../../core/services/github.service';
import { BookmarksService } from '../../../core/services/bookmarks.service';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [CommonModule, FormsModule, RepoCardComponent],
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    private github = inject(GithubService);
    private bookmarksSvc = inject(BookmarksService);

    query = '';
    searching = false;
    error: string | null = null;

    results = signal<Repo[]>([]);
    bookmarks = this.bookmarksSvc.bookmarks;

    private query$ = new Subject<string>();

    //Cache for saving previous searches 
    private cache = new Map<string, Repo[]>();

    private lastQuery = '';

    ngOnInit(): void {
        this.query$
            .pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(q => this.doSearch(q));
    }

    // Called when user types in search input
    onInput() {
        this.query$.next(this.query.trim());
    }

    // Called when user clicks search button
    search() {
        this.query$.next(this.query.trim());
    }
    
    // Validates query, checks cache, performs search, handles success/error
    private doSearch(query: string) {
        this.error = null;
    
        if (!this.isValidQuery(query)) {
            this.clearResults();
            return;
        }
    
        if (this.isDuplicateQuery(query)) {
            return;
        }
    
        this.lastQuery = query;
    
        if (this.isCached(query)) {
            this.loadFromCache(query);
            return;
        }
    
        this.performSearch(query);
    }
    
    private isValidQuery(query: string): boolean {
        return !!query && query.length >= 2;
    }
    
    private clearResults() {
        this.results.set([]);
    }
    
    private isDuplicateQuery(query: string): boolean {
        return query === this.lastQuery;
    }
    
    private isCached(query: string): boolean {
        return this.cache.has(query);
    }
    
    private loadFromCache(query: string) {
        this.results.set(this.cache.get(query)!);
    }
    
    private performSearch(query: string) {
        this.searching = true;
    
        this.github.searchRepositories(query).subscribe({
            next: res => this.handleSearchSuccess(query, res.items),
            error: err => this.handleSearchError(err)
        });
    }
    
    private handleSearchSuccess(query: string, items: any[]) {
        this.cache.set(query, items);
        this.results.set(items);
        this.searching = false;
    }
    
    private handleSearchError(err: any) {
        if (err.status === 403) {
            this.error = 'The search quota (Rate Limit) has been exceeded. Try again in a few minutes.';
        } else {
            this.error = err?.error?.message || 'Search Error';
        }
        this.searching = false;
    }

    // Check if repository is bookmarked
    isBookmarked(id: number) {
        return this.bookmarksSvc.isBookmarked(id);
    }

    // Toggle bookmark state for a repository
    toggleBookmark(repo: Repo) {
        if (this.isBookmarked(repo.id)) {
            this.bookmarksSvc.remove(repo.id);
        } else {
            this.bookmarksSvc.add(repo);
        }
    }
}
