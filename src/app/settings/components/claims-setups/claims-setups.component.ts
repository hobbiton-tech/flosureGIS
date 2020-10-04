import { Component, OnInit } from '@angular/core';
import { IInsuranceCompany } from 'src/app/claims/models/insurance-company.model';
import { ClaimsService } from 'src/app/claims/services/claims-service.service';
import { IServiceProvider } from 'src/app/claims/models/service-provider.model';

@Component({
    selector: 'app-claims-setups',
    templateUrl: './claims-setups.component.html',
    styleUrls: ['./claims-setups.component.scss']
})
export class ClaimsSetupsComponent implements OnInit {
    ClaimsSetupsIsLoading = false;

    // add service provider modal
    isAddServiceProviderModalVisible = false;

    // add insurance company modal
    isAddInsuranceCompanyModalVisible = false;

    serviceProvidersList: IServiceProvider[] = [];
    displayServiceProvidersList: IServiceProvider[] = [];

    insuranceCompaniesList: IInsuranceCompany[] = [];
    displayInsuranceCompaniesList: IInsuranceCompany[] = [];

    searchServiceProvidersString: string;
    searchInsuranceCompaniesString: string;

    constructor(private claimsService: ClaimsService) {}

    ngOnInit(): void {
        this.ClaimsSetupsIsLoading = true;
        // setTimeout(() => {
        //     this.ClaimsSetupsIsLoading = false;
        // }, 3000);

        this.claimsService.getServiceProviders().subscribe(serviceProviders => {
            this.serviceProvidersList = serviceProviders;
            this.displayServiceProvidersList = this.serviceProvidersList;

            this.ClaimsSetupsIsLoading = false;
        });

        this.claimsService
            .getInsuranceCompanies()
            .subscribe(insuranceCompanies => {
                this.insuranceCompaniesList = insuranceCompanies;
                this.displayInsuranceCompaniesList = this.insuranceCompaniesList;
            });
    }

    addServiceProvider() {
        this.isAddServiceProviderModalVisible = true;
    }

    addInsuranceCompany() {
        this.isAddInsuranceCompanyModalVisible = true;
    }

    searchServiceProviders(value: string) {}
    searchInsuranceCompanies(value: string) {}
}
