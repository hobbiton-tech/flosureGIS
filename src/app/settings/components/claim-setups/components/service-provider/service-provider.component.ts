import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IServiceProvider } from 'src/app/settings/models/underwriting/claims.model';
import { ClaimSetupsService } from '../../services/claim-setups.service';
import { v4 } from 'uuid';

@Component({
    selector: 'app-service-provider',
    templateUrl: './service-provider.component.html',
    styleUrls: ['./service-provider.component.scss'],
})
export class ServiceProviderComponent implements OnInit {
    serviceProvidersList: IServiceProvider[] = [];
    typeClass: any;
    serviceProviderForm: FormGroup;
    isAddServiceProviderOpen: boolean = false;
    providerType: any;

    constructor(
        private formBuilder: FormBuilder,
        private claimsService: ClaimSetupsService
    ) {
        this.serviceProviderForm = formBuilder.group({
            companyName: ['', Validators.required],
            serviceProviderType: [null, Validators.required],
            tpin: ['', Validators.required],
            physicalAddress: ['', Validators.required],
            postal: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            email: ['', Validators.required],
            repName: ['', Validators.required],
            repNumber: ['', Validators.required],
            repEmail: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.claimsService.getServiceProviders().subscribe((res) => {
            this.serviceProvidersList = res;
        });
    }

    openAddServiceProvider() {
        this.isAddServiceProviderOpen = true;
    }

    submitForm() {
        const serviceProvider: IServiceProvider = {
            ...this.serviceProviderForm.value,
            id: v4(),
            serviceProviderType: this.providerType,
        };
        this.claimsService.addServiceProvider(serviceProvider);
        this.isAddServiceProviderOpen = false;
        this.serviceProviderForm.reset();
    }

    resetSPForm() {
        this.serviceProviderForm.reset();
    }

    onChange(value) {
        this.providerType = value;
    }
}
