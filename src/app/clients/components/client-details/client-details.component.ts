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
import { IBank } from "../../../settings/models/finance/bank.model";
import { IBranch } from "../../../settings/models/finance/branch.model";
import { BankService } from "../../../settings/components/finance-setups/components/bank-setups/services/bank.service";
import { BranchService } from "../../../settings/components/finance-setups/services/branch.service";
import { Router, ActivatedRoute } from '@angular/router';
// import { AccountDetails } from '../../models/account-details.model';
import { ClientsService } from '../../services/clients.service';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { Claim } from 'src/app/claims/models/claim.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { ClaimsService } from 'src/app/claims/services/claims-service.service';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { getDate } from 'date-fns';
import { ITimestamp } from 'src/app/settings/components/insurance-companies/models/insurance-company.model';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { Agent } from 'http';
import { floor } from 'lodash';

@Component({
    selector: 'app-client-details',
    templateUrl: './client-details.component.html',
    styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit, AfterViewInit {
    isEditmode = false;

    bankList: IBank[] = [];
    banks: IBank[] = [];
    branches: IBranch[] = [];
    branchList: IBranch[] = [];

    client: IIndividualClient & ICorporateClient;
    clientPolicies: Policy[] = [];
    clientClaims: Claim[] = [];
    individualClients: IIndividualClient[] = [];
    corporateClients: ICorporateClient[] = [];

    data: any;
    dateOfBirth: any;

    individualClientForm: FormGroup;
    corporateClientForm: FormGroup;
    bankDetailsForm: FormGroup;
    occupationDetailsForm: FormGroup;
    ploicyList: Policy[] = [];

    editDetail: any;
    // account: AccountDetails;
    id: string;
    selectedClientValue: any;


    constructor(
        private readonly route: Router,
        private cdr: ChangeDetectorRef,
        private router: ActivatedRoute,
        private clientsService: ClientsService,
        private formBuilder: FormBuilder,
        private policyService: PoliciesService,
        private claimsService: ClaimsService,
        private BankService: BankService,
        private BranchService: BranchService
    ) {
        this.individualClientForm = this.formBuilder.group({
            title: ['', Validators.required],
            idType: ['', Validators.required],
            idNumber: ['', Validators.required, [this.clientIDAsyncValidator]],
            clientType: ['Individual'],
            maritalStatus: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            middleName: [''],
            email: [''],
            dateOfBirth: ['', Validators.required],
            phone: ['', Validators.required,
                [Validators.pattern("^[0-9]*$"),
                Validators.minLength(10), Validators.maxLength(10)]],
            address: ['', Validators.required],
            gender: [''],
            sector: ['', Validators.required],
            nationality: ['', Validators.required],
            occupation: [''],
            accountName: [''],
            accountNumber: [''],
            accountType: [''],
            bank: [''],
            branch: ['']
        });
        this.occupationDetailsForm = this.formBuilder.group({
            occupation: ['', Validators.required],
        });
        this.bankDetailsForm = this.formBuilder.group({
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
            email: ['', Validators.required,],
            phone: ['', Validators.required, Validators.pattern("^[0-9]*$"),
                Validators.minLength(10), Validators.maxLength(13)],
            address: ['', Validators.required],
            contactFirstName: ['', Validators.required],
            contactLastName: ['', Validators.required],
            contactEmail: ['', Validators.required],
            contactPhone: ['', Validators.required, [Validators.required,
            Validators.pattern("^[0-9]*$"),
            Validators.minLength(10), Validators.maxLength(13)]],
            contactAddress: [''],
            clientType: ['Corporate'],
            accountName: [''],
            accountNumber: [''],
            accountType: [''],
            bank: [''],
            branch: ['']
        });

        this.data = {};
        this.data.age = '';
        this.dateOfBirth = this.dateOfBirth;
    }

    //age Validation
    public getAge() {
        console.log(this.dateOfBirth);
        const timeDiff = Math.abs(Date.now() - this.dateOfBirth);
        console.log(timeDiff);
        this.data.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
        console.log(this.data.age);
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
                this.ploicyList = res.filter((x) => x.clientCode === this.id)
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
                this.occupationDetailsForm
                    .get('occupation')
                    .setValue(this.client.occupation);
                // this.bankDetailsForm
                //     .get('accountName')
                //     .setValue(this.client.accountName);
                // this.bankDetailsForm
                //     .get('accountNumber')
                //     .setValue(this.client.accountNumber);
                // this.bankDetailsForm
                //     .get('accountType')
                //     .setValue(this.client.accountType);
                // this.bankDetailsForm
                //     .get('bank')
                //     .setValue(this.client.bank);
                // this.bankDetailsForm
                //     .get('branch')
                //     .setValue(this.client.branch);
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

                this.bankDetailsForm
                    .get('accountName')
                    .setValue(this.client.accountName);
                this.bankDetailsForm
                    .get('accountNumber')
                    .setValue(this.client.accountNumber);
                this.bankDetailsForm
                    .get('accountType')
                    .setValue(this.client.accountType);
                this.bankDetailsForm.get('bank').setValue(this.client.bank);
                this.bankDetailsForm
                    .get('branch')
                    .setValue(this.client.branch);
            }
            ///////////////////////////////
            /// BANK SERVICE //////
            //////////////////////////////
            this.BankService.getBanks().subscribe((res) => {
                this.banks = res;
                this.bankList = this.banks;
            });
            //////////////////////////////////
            /////////// Branches ///////////////
            ////////////////////////////////

            this.BranchService.getBranch().subscribe((res) => {
                this.branches = res;
                this.branchList = this.branches;
            });


        });


        // this.policyService.getClientsPolicies(this.id).subscribe(policies => {
        //     this.clientPolicies = policies;
        // });

        // this.claimsService.getClientsClaims(this.id).subscribe(claims => {
        //     this.clientClaims = claims;
        // });
    }
    bankChange(value) {
        console.log("value....", value);

        console.log("BankPick>>>>", value.id, this.banks, this.bankList);
    }
    branchChange(value) {
        console.log("value....", value);

        console.log("BranchPick>>>>", value.id, this.branches, this.branchList);
    }


    /////// ///////
    //VALIDATORS////
    ////////////// 
    clientIDAsyncValidator = (control: FormControl) =>
        new Observable((observer: Observer<ValidationErrors | null>) => {
            setTimeout(() => {
                this.clientsService.getIndividualClients().subscribe((res) => {
                    this.individualClients = res;
                    if (this.individualClients.length > 0) {
                        console.log("ARRAY>>", this.individualClients);

                        for (const ind of this.individualClients) {
                            console.log("ERROR>>>", control.value, ind.idNumber);
                            if (control.value === ind.idNumber) {
                                // you have to return `{error: true}` to mark it as an error event
                                observer.next({ error: true, duplicated: true });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }
                        for (const ind of this.individualClients) {
                            console.log("ERROR>>>", control.value, ind.address);
                            if (control.value === ind.address) {
                                // you have to return `{error: true}` to mark it as an error event
                                observer.next({ error: true, duplicated: true });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }
                        for (const ind of this.individualClients) {
                            console.log("ERROR>>>", control.value, ind.firstName);
                            if (control.value === ind.firstName) {
                                // you have to return `{error: true}` to mark it as an error event
                                observer.next({ error: true, duplicated: true });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }
                        for (const ind of this.individualClients) {
                            console.log("ERROR>>>", control.value, ind.lastName);
                            if (control.value === ind.lastName) {
                                // you have to return `{error: true}` to mark it as an error event
                                observer.next({ error: true, duplicated: true });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }
                        for (const ind of this.individualClients) {
                            console.log("ERROR>>>", control.value, ind.occupation);
                            if (control.value === ind.occupation) {
                                // you have to return `{error: true}` to mark it as an error event
                                observer.next({ error: true, duplicated: true });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }
                        for (const ind of this.individualClients) {
                            console.log("ERROR>>>", control.value, ind.sector);
                            if (control.value === ind.sector) {
                                // you have to return `{error: true}` to mark it as an error event
                                observer.next({ error: true, duplicated: true });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }
                        for (const ind of this.individualClients) {
                            console.log("ERROR>>>", control.value, ind.email);
                            if (control.value === ind.email) {
                                // you have to return `{error: true}` to mark it as an error event
                                observer.next({ error: true, duplicated: true });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }
                    } else {
                        observer.next(null);
                    }
                    observer.complete();
                })

            }, 1000);
        });




    companyRegAsyncValidator = (control: FormControl) =>
        new Observable((observer: Observer<ValidationErrors | null>) => {
            setTimeout(() => {
                this.clientsService.getCorporateClients().subscribe((res) => {
                    this.corporateClients = res;
                    if (this.corporateClients.length > 0) {
                        for (const cor of this.corporateClients) {
                            console.log("ERROR>>>", cor.registrationNumber);

                            if (control.value === cor.registrationNumber) {
                                // you have to return `{error: true}` to mark it as an error event
                                observer.next({ error: true, duplicated: true });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }
                        for (const cor of this.corporateClients) {
                            console.log("ERROR>>>", cor.companyName);

                            if (control.value === cor.companyName) {
                                // you have to return `{error: true}` to mark it as an error event
                                observer.next({ error: true, duplicated: true });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }
                        for (const cor of this.corporateClients) {
                            console.log("ERROR>>>", cor.registrationNumber);

                            if (control.value === cor.registrationNumber) {
                                // you have to return `{error: true}` to mark it as an error event
                                observer.next({ error: true, duplicated: true });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }
                        for (const cor of this.corporateClients) {
                            console.log("ERROR>>>", cor.taxPin);

                            if (control.value === cor.taxPin) {
                                // you have to return `{error: true}` to mark it as an error event
                                observer.next({ error: true, duplicated: true });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }
                        for (const cor of this.corporateClients) {
                            console.log("ERROR>>>", cor.phone);

                            if (control.value === cor.phone) {
                                // you have to return `{error: true}` to mark it as an error event
                                observer.next({ error: true, duplicated: true });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }
                        for (const cor of this.corporateClients) {
                            console.log("ERROR>>>", cor.email);

                            if (control.value === cor.email) {
                                // you have to return `{error: true}` to mark it as an error event
                                observer.next({ error: true, duplicated: true });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }
                        for (const cor of this.corporateClients) {
                            console.log("ERROR>>>", cor.address);

                            if (control.value === cor.address) {
                                // you have to return `{error: true}` to mark it as an error event
                                observer.next({ error: true, duplicated: true });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }

                        for (const cor of this.corporateClients) {
                            console.log("ERROR>>>", cor.contactFirstName);

                            if (control.value === cor.contactLastName) {
                                // you have to return `{error: true}` to mark it as an error event
                                observer.next({ error: true, duplicated: true });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }

                        for (const cor of this.corporateClients) {
                            console.log("ERROR>>>", cor.contactEmail);

                            if (control.value === cor.contactEmail) {
                                // you have to return `{error: true}` to mark it as an error event
                                observer.next({ error: true, duplicated: true });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }
                    } else {
                        observer.next(null);
                    }
                    observer.complete();
                })

            }, 1000);
        });







    saveDetails() {
        if (this.client.clientType === 'Individual') {



            //const index = this.selectedClientValue.indexOf(this.client);
            //  this.selectedClientValue[index] = this.client;

            const client: IIndividualClient = {
                ...this.individualClientForm.value,
                ...this.bankDetailsForm.value,
                ...this.occupationDetailsForm.value,
                id: this.client.id,
                phone: '260' + this.individualClientForm.get('phone').value
            };
            this.clientsService.updateIndividualClient(client, client.id).subscribe(x => {
                console.log(x)
            })
            console.log(client)
            // console.log('individual>>', value);
        }

        if (this.client.clientType === 'Corporate') {


            //   const index = this.selectedClientValue.indexOf(this.client);
            //   this.selectedClientValue[index] = this.client;

            const client: ICorporateClient = {
                ...this.corporateClientForm.value,
                ...this.bankDetailsForm.value,
                ...this.occupationDetailsForm.value,
                id: this.client.id,
            };
            this.clientsService.updateCorporateClient
            console.log('save button', client);
        }


    }



    updateIndividualClient() {
        console.log('agent clicked!!');

        const agent: IIndividualClient = {
            dateCreated: this.client.dateCreated,
            dateUpdated: new Date(),
            ...this.individualClientForm.value,
            ...this.bankDetailsForm.value,
            ...this.occupationDetailsForm.value,
        };


        this.clientsService
            .updateIndividualClient(agent, this.client.id)
            .subscribe(agent => {
                res => console.log(res);
            });

        if (this.individualClientForm.invalid) {
            return
        }
    }


    updateCorporateClient() {
        console.log('agent clicked!!');

        const agent: ICorporateClient = {
            dateCreated: this.client.dateCreated,
            dateUpdated: new Date(),
            ...this.corporateClientForm.value,
            ...this.bankDetailsForm.value,
            ...this.occupationDetailsForm.value,
        };
        if (this.corporateClientForm.invalid) {
            return
        }

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

    getTimeStamp(client: ICorporateClient & IIndividualClient): number {
        const date = client.dateCreated as ITimestamp;
        return date.seconds;
    }

    getDateOfBirthTimeStamp(client: IIndividualClient): number {
        const date = client.dateOfBirth as ITimestamp;
        return date.seconds * 1000;
    }
    get f() { return this.individualClientForm.controls }

    get g() { return this.corporateClientForm.controls }






}

function getAge(dob) {
    alert(new Date().getFullYear() - new Date(dob).getFullYear())
}
getAge