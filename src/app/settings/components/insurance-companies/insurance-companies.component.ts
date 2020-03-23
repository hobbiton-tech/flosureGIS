import { Component, OnInit } from '@angular/core';
import { AddInsuranceCompanyComponent } from './components/add-insurance-company/add-insurance-company.component'
import { InsuranceCompany } from '../insurance-companies/models/insurance-company.model'
import { InsuranceCompanyService } from '../insurance-companies/services/insurance-company.service'
@Component({
  selector: 'app-insurance-companies',
  templateUrl: './insurance-companies.component.html',
  styleUrls: ['./insurance-companies.component.scss']
})
export class InsuranceCompaniesComponent implements OnInit {
  insuranceCompaniesList: InsuranceCompany[];

  addInsuranceCompanyFormDrawerVisible = false;

  constructor(private readonly insuranceCompanyService: InsuranceCompanyService) { }

  ngOnInit(): void {
    this.insuranceCompanyService.getInsuranceCompanies().subscribe(insuranceCompanies => {
      this.insuranceCompaniesList = insuranceCompanies;
    })
  }

  openAddInsuranceCompanyFormDrawer() {
    this.addInsuranceCompanyFormDrawerVisible = true;
  }

}
