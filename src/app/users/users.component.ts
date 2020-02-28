import { Component, OnInit } from '@angular/core';
import { generateUsers } from './data/users.data';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    usersList = generateUsers();

    constructor() {}

    ngOnInit(): void {}
}
