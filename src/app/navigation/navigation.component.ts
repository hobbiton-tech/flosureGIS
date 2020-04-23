import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
    isCollapsed = false;
    loggedIn = localStorage.getItem('user');

    constructor(private router: Router) {}

    ngOnInit(): void {}

    logout(): void {
        this.router.navigateByUrl('/');
    }
}
