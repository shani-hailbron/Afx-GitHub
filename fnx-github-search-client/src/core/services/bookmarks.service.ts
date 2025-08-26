import { Injectable, signal } from '@angular/core';
import { Repo } from '../models/repo.model';

const STORAGE_KEY = 'fnx_bookmarks';

@Injectable({ providedIn: 'root' })
export class BookmarksService {
    bookmarks = signal<Repo[]>([]);

    constructor() {
        // Load saved bookmarks from sessionStorage
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                this.bookmarks.set(JSON.parse(saved));
            } catch {
                this.bookmarks.set([]);
            }
        }
    }

    //Saves current bookmarks to sessionStorage
    private saveToStorage() {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.bookmarks()));
    }

    //Returns the current bookmarks
    load() {
        return this.bookmarks();
    }

    //Adds a repository to bookmarks and Prevents duplicates
    add(repo: Repo) {
        if (!this.bookmarks().some(r => r.id === repo.id)) {
            this.bookmarks.set([repo, ...this.bookmarks()]);
            this.saveToStorage();
        }
        return repo;
    }

    //Removes a repository from bookmarks by id
    remove(id: number) {
        this.bookmarks.set(this.bookmarks().filter(r => r.id !== id));
        this.saveToStorage();
    }

    //Checks if a repository is bookmarked
    isBookmarked(id: number) {
        return this.bookmarks().some(r => r.id === id);
    }
}