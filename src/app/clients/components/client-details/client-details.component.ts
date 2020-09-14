import {
    Component,
    OnInit,
    ChangeDetectorRef,
    AfterViewInit
} from '@angular/core';
import {
    ICorporateClient,
    IIndividualClient
} from '../../models/clients.model';
import { Router, ActivatedRoute } from '@angular/router';
// import { AccountDetails } from '../../models/account-details.model';
import { ClientsService } from '../../services/clients.service';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { Claim } from 'src/app/claims/models/claim.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { ClaimsService } from 'src/app/claims/services/claims-service.service';

import { getDate } from 'date-fns';
import { ITimestamp } from 'src/app/settings/components/insurance-companies/models/insurance-company.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-client-details',
    templateUrl: './client-details.component.html',
    styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit, AfterViewInit {
    isEditmode = false;

    client: IIndividualClient & ICorporateClient;
    clientPolicies: Policy[] = [];
    clientClaims: Claim[] = [];

    individualClientForm: FormGroup;
    corporateClientForm: FormGroup;
    policyList: Policy[] = [];

    // account: AccountDetails;
    id: string;

    constructor(
        private readonly route: Router,
        private cdr: ChangeDetectorRef,
        private router: ActivatedRoute,
        private clientsService: ClientsService,
        private formBuilder: FormBuilder,
        private policyService: PoliciesService,
        private claimsService: ClaimsService
    ) {
        this.individualClientForm = this.formBuilder.group({
            title: ['', Validators.required],
            idType: ['', Validators.required],
            idNumber: ['', Validators.required],
            clientType: ['Individual'],
            maritalStatus: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            middleName: ['', Validators.required],
            email: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            phone: ['', Validators.required],
            address: ['', Validators.required],
            gender: ['', Validators.required],
            sector: ['', Validators.required],
            nationality: ['', Validators.required],
            occupation: ['', Validators.required],
            accountName: ['', Validators.required],
            accountNumber: ['', Validators.required],
            accountType: ['', Validators.required],
            bank: ['', Validators.required],
            branch: ['', Validators.required]
        });

        this.corporateClientForm = this.formBuilder.group({
            companyName: ['', Validators.required],
            taxPin: ['', Validators.required],
            registrationNumber: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            address: ['', Validators.required],
            contactFirstName: ['', Validators.required],
            contactLastName: ['', Validators.required],
            contactEmail: ['', Validators.required],
            contactPhone: ['', Validators.required],
            contactAddress: ['', Validators.required],
            clientType: ['Corporate'],
            accountName: ['', Validators.required],
            accountNumber: ['', Validators.required],
            accountType: ['', Validators.required],
            bank: ['', Validators.required],
            branch: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.router.params.subscribe(param => {
            this.id = param.id;
        });

        this.clientsService.getAllClients().subscribe(clients => {
            console.log(clients);
            this.client = [...clients[1], ...clients[0]].filter(
                x => x.id === this.id
            )[0] as IIndividualClient & ICorporateClient;

            this.policyService.getPolicies().subscribe((res) => {
                this.policyList = res.filter((x) => x.clientCode === this.id)
            })

            console.log('CLIENTS', this.client);

            if (this.client.clientType == 'Individual') {
                this.individualClientForm
                    .get('title')
                    .setValue(this.client.title);
                this.individualClientForm
                    .get('idType')
                    .setValue(this.client.idType);
                this.individualClientForm
                    .get('idNumber')
                    .setValue(this.client.idNumber);
                this.individualClientForm
                    .get('maritalStatus')
                    .setValue(this.client.maritalStatus);
                this.individualClientForm
                    .get('firstName')
                    .setValue(this.client.firstName);
                this.individualClientForm
                    .get('lastName')
                    .setValue(this.client.lastName);
                this.individualClientForm
                    .get('middleName')
                    .setValue(this.client.middleName);
                this.individualClientForm
                    .get('email')
                    .setValue(this.client.email);
                this.individualClientForm
                    .get('dateOfBirth')
                    .setValue(this.client.dateOfBirth);
                this.individualClientForm
                    .get('phone')
                    .setValue(this.client.phone);
                this.individualClientForm
                    .get('address')
                    .setValue(this.client.address);
                this.individualClientForm
                    .get('gender')
                    .setValue(this.client.gender);
                this.individualClientForm
                    .get('sector')
                    .setValue(this.client.sector);
                this.individualClientForm
                    .get('nationality')
                    .setValue(this.client.nationality);
                this.individualClientForm
                    .get('occupation')
                    .setValue(this.client.occupation);
                this.individualClientForm
                    .get('accountName')
                    .setValue(this.client.accountName);
                this.individualClientForm
                    .get('accountNumber')
                    .setValue(this.client.accountNumber);
                this.individualClientForm
                    .get('accountType')
                    .setValue(this.client.accountType);
                this.individualClientForm
                    .get('bank')
                    .setValue(this.client.bank);
                this.individualClientForm
                    .get('branch')
                    .setValue(this.client.branch);
            }

            if (this.client.clientType == 'Corporate') {
                this.corporateClientForm
                    .get('companyName')
                    .setValue(this.client.companyName);
                this.corporateClientForm
                    .get('taxPin')
                    .setValue(this.client.taxPin);
                this.corporateClientForm
                    .get('registrationNumber')
                    .setValue(this.client.registrationNumber);
                this.corporateClientForm
                    .get('email')
                    .setValue(this.client.contactEmail);
                this.corporateClientForm
                    .get('phone')
                    .setValue(this.client.phone);
                this.corporateClientForm
                    .get('address')
                    .setValue(this.client.address);
                this.corporateClientForm
                    .get('contactFirstName')
                    .setValue(this.client.contactFirstName);
                this.corporateClientForm
                    .get('contactLastName')
                    .setValue(this.client.contactLastName);
                this.corporateClientForm
                    .get('contactEmail')
                    .setValue(this.client);
                // this.corporateClientForm
                //     .get('contactPhone')
                //     .setValue(this.client.contactPhone);
                // this.corporateClientForm
                //     .get('contactAddress')
                //     .setValue(this.client.contactAddress);

                this.corporateClientForm
                    .get('accountName')
                    .setValue(this.client.accountName);
                this.corporateClientForm
                    .get('accountNumber')
                    .setValue(this.client.accountNumber);
                this.corporateClientForm
                    .get('accountType')
                    .setValue(this.client.accountType);
                this.corporateClientForm.get('bank').setValue(this.client.bank);
                this.corporateClientForm
                    .get('branch')
                    .setValue(this.client.branch);
            }
        });

        // this.policyService.getClientsPolicies(this.id).subscribe(policies => {
        //     this.clientPolicies = policies;
        // });

        // this.claimsService.getClientsClaims(this.id).subscribe(claims => {
        //     this.clientClaims = claims;
        // });
    }

    updateIndividualClient() {
        console.log('agent clicked!!');

        const agent: IIndividualClient = {
            dateCreated: this.client.dateCreated,
            dateUpdated: new Date(),
            ...this.individualClientForm.value
        };

        this.clientsService
            .updateIndividualClient(agent, this.client.id)
            .subscribe(agent => {
                res => console.log(res);
            });
    }

    updateCorporateClient() {
        console.log('agent clicked!!');

        const agent: ICorporateClient = {
            dateCreated: this.client.dateCreated,
            dateUpdated: new Date(),
            ...this.corporateClientForm.value
        };

        this.clientsService
            .updateCorporateClient(agent, this.client.id)
            .subscribe(agent => {
                res => console.log(res);
            });
    }

    ngAfterViewInit(): void {
        this.cdr.detectChanges();
    }

    goToClientsList(): void {
        this.route.navigateByUrl('/flosure/clients/clients-list');
    }

    viewPolicyDetails(id): void {
        this.route.navigateByUrl('/flosure/underwriting/policy-details/' + id);
    }

    viewClaimDetails(): void {
        this.route.navigateByUrl('/flosure/claims/claim-details');
    }

  viewClientStatement(id): void {
    this.route.navigateByUrl('/flosure/accounts/client-statement/'  + id );
  }
  viewAgeAnalysis(id): void {
    this.route.navigateByUrl('/flosure/accounts/age-analysis/'  + id );
  }
}
