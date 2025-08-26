import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepoCardComponent } from '../../../shared/components/repo-card/repo-card.component';
import { BookmarksService } from '../../../core/services/bookmarks.service';
import { Repo } from '../../../core/models/repo.model';

@Component({
    selector: 'app-bookmarks',
    standalone: true,
    imports: [CommonModule, RepoCardComponent],
    templateUrl: './bookmarks.component.html',
    styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {
    private bookmarksSvc = inject(BookmarksService);
    list: Repo[] = [];

    // On component init, load bookmarked repositories
    ngOnInit(): void {
        this.list = this.bookmarksSvc.load();
    }

    // Remove repository from bookmarks and refresh displayed list
    remove(r: Repo) {
        this.bookmarksSvc.remove(r.id);
        this.list = this.bookmarksSvc.load();
    }
}