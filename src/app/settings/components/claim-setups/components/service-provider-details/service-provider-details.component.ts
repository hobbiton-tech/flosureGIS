import { Component, OnInit } from '@angular/core';
import { IServiceProvider } from 'src/app/settings/models/underwriting/claims.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClaimSetupsService } from '../../services/claim-setups.service';

@Component({
    selector: 'app-service-provider-details',
    templateUrl: './service-provider-details.component.html',
    styleUrls: ['./service-provider-details.component.scss'],
})
export class ServiceProviderDetailsComponent implements OnInit {
    isEditMode: boolean = false;
    serviceProvider: IServiceProvider;
    serviceProviderForm: FormGroup;
    selectedType: string;
    name: string;
    id: string;

    constructor(
        private readonly route: Router,
        private router: ActivatedRoute,
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
        this.router.params.subscribe((param) => {
            this.id = param.id;
        });

        this.claimsService
            .getServiceProviders()
            .subscribe((serviceProviders) => {
                this.serviceProvider = serviceProviders.filter(
                    (x) => x.id === this.id
                )[0] as IServiceProvider;

                this.name = this.serviceProvider.companyName;
                this.serviceProviderForm.controls['companyName'].setValue(
                    this.serviceProvider.companyName
                );

                this.selectedType = this.serviceProvider.serviceProviderType;

                this.serviceProviderForm.controls['tpin'].setValue(
                    this.serviceProvider.tpin
                );
                this.serviceProviderForm.controls['physicalAddress'].setValue(
                    this.serviceProvider.physicalAddress
                );
                this.serviceProviderForm.controls['postal'].setValue(
                    this.serviceProvider.postal
                );
                this.serviceProviderForm.controls['phoneNumber'].setValue(
                    this.serviceProvider.phoneNumber
                );
                this.serviceProviderForm.controls['email'].setValue(
                    this.serviceProvider.email
                );
                this.serviceProviderForm.controls['repName'].setValue(
                    this.serviceProvider.repName
                );
                this.serviceProviderForm.controls['repNumber'].setValue(
                    this.serviceProvider.repNumber
                );
                this.serviceProviderForm.controls['repEmail'].setValue(
                    this.serviceProvider.repEmail
                );
            });
    }

    goBack() {
        this.route.navigateByUrl('/flosure/settings/claims');
    }

    updateDetails() {
        const newSP: IServiceProvider = {
            ...this.serviceProviderForm.value,
            id: this.serviceProvider.id,
        };
        this.claimsService.updateServiceProvider(newSP);
        this.isEditMode = false;
    }
}
