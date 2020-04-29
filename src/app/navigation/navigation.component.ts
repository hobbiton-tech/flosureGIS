import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProgressTracker } from '../quotes/services/progress-tracker.service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
    isCollapsed = false;
    progress$: Observable<number>;
    loggedIn = localStorage.getItem('user');

    constructor(
        private router: Router,
        private progressTracker: ProgressTracker
    ) {}

    ngOnInit(): void {
        this.progress$ = this.progressTracker.currentValue;
    }

    logout(): void {
        this.router.navigateByUrl('/');
    }
}
