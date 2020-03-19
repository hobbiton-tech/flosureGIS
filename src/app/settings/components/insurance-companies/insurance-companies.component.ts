import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insurance-companies',
  templateUrl: './insurance-companies.component.html',
  styleUrls: ['./insurance-companies.component.scss']
})
export class InsuranceCompaniesComponent implements OnInit {

  addInsuranceCompanyFormDrawerVisible = false;

  constructor() { }

  ngOnInit(): void {
  }

  openAddInsuranceCompanyFormDrawer() {
    this.addInsuranceCompanyFormDrawerVisible = true;
  }

}
