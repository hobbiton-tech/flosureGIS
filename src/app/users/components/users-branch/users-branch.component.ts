import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-branch',
  templateUrl: './users-branch.component.html',
  styleUrls: ['./users-branch.component.scss']
})
export class UsersBranchComponent implements OnInit {

  displayBranch: string;
  displaySales: string;

  constructor() { }

  ngOnInit(): void {

  }

  onBack(): void {
    console.log('onBack');
  }
}
