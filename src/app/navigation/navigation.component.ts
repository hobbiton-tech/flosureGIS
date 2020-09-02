import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { AuthenticationService } from '../users/services/authentication.service';
import { UsersService } from '../users/services/users.service';
import { UserModel } from '../users/models/users.model';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
    isCollapsed = false;
    loggedIn = localStorage.getItem('currentUser');
    user: UserModel;



    constructor(private router: Router, public authenticationService: AuthenticationService, private usersService: UsersService) {}

    ngOnInit(): void {
      const decodedJwtData = jwt_decode(this.loggedIn);
      console.log('Decoded>>>>>>', decodedJwtData);

      this.usersService.getUsers().subscribe((users) => {
        this.user = users.filter((x) => x.ID === decodedJwtData.user_id)[0];
      });
    }

    // logout(): void {
    //     this.router.navigateByUrl('/');
    // }
}
