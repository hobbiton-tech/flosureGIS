import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { AuthenticationService } from '../users/services/authentication.service';
import { UsersService } from '../users/services/users.service';
import { UserModel } from '../users/models/users.model';
import { PermissionsModel, RolesModel } from '../users/models/roles.model';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
    isCollapsed = false;
    loggedIn = localStorage.getItem('currentUser');
    user: UserModel;
    underwriting = 'underwriting';
    claim = 'claim';
    finance: 'finance';
    admin = 'admin';
    allocation = 'allocation';
    paymentPlan = 'payment_plan';
    receipting = 'receipt';
  newCategory: string;
  isPresent: RolesModel;
  permission: PermissionsModel;
  isPresentPermission: PermissionsModel;



    constructor(private router: Router, public authenticationService: AuthenticationService, private usersService: UsersService) {}

    ngOnInit(): void {
      const decodedJwtData = jwt_decode(this.loggedIn);
      console.log('Decoded>>>>>>', decodedJwtData);

      this.usersService.getUsers().subscribe((users) => {
        this.user = users.filter((x) => x.ID === decodedJwtData.user_id)[0];

        this.isPresent = this.user.Role.find((el) => el.role_name === this.underwriting || el.role_name === this.claim ||
          el.role_name === this.finance || el.role_name === this.admin);


        this.isPresentPermission = this.user.Permission.find((el) => el.name === this.allocation || el.name === this.paymentPlan ||
          el.name === this.admin || el.name === this.receipting);

        console.log('USERS>>>', this.user, this.isPresent);
      });
    }

    // logout(): void {
    //     this.router.navigateByUrl('/');
    // }
}
