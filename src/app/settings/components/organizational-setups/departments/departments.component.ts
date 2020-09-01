import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {

  displayDepartment: string;

  constructor() { }

  ngOnInit(): void {

  }

  onBack(): void {
    console.log('onBack');
  }

}
