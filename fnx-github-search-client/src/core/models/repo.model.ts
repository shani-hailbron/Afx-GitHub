import { Owner } from './owner.model';

export interface Repo {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    stargazers_count: number;
    language: string | null;
    owner: Owner;
}

export interface GithubSearchResponse {
    total_count: number;
    items: Repo[];
}