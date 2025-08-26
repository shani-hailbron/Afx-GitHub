import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Repo } from '../../../core/models/repo.model';

@Component({
    selector: 'app-repo-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './repo-card.component.html',
    styleUrls: ['./repo-card.component.scss']
})
export class RepoCardComponent {
    @Input() repo!: Repo;
    @Input() bookmarked = false;
    @Output() toggleBookmark = new EventEmitter<Repo>();
}