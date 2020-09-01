import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-permissions',
  templateUrl: './users-permissions.component.html',
  styleUrls: ['./users-permissions.component.scss']
})
export class UsersPermissionsComponent implements OnInit {

  displayRoles: string;
  displayPermissions: string;

  constructor() { }

  ngOnInit(): void {
  }

  onBack(): void {
    console.log('onBack');
  }

}
