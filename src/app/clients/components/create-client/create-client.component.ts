import {
    Component,
    OnInit,
    AfterViewInit,
    ChangeDetectorRef
} from '@angular/core';
import { StepperService } from '../../common/services/stepper.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
    IIndividualClient,
    ICorporateClient
} from '../../models/clients.model';
import { ClientsService } from '../../services/clients.service';

@Component({
    selector: 'app-create-client',
    templateUrl: './create-client.component.html',
    styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit, AfterViewInit {
    clientTypeForm: FormGroup;
    individualClientForm: FormGroup;
    corporateClientForm: FormGroup;

    selectedClientType: string;

    constructor(
        private stepperService: StepperService,
        private router: Router,
        private formBuilder: FormBuilder,
        private clientsService: ClientsService,
        private cdr: ChangeDetectorRef
    ) {
        this.individualClientForm = this.formBuilder.group({
            title: ['', Validators.required],
            idType: ['', Validators.required],
            idNumber: ['', Validators.required],
            clientType: ['Individual'],
            maritalStatus: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
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
            sector: ['', Validators.required],
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
        // this.selectedClientType = 'Corporate';
        this.selectedClientType = 'Corporate';
        this.cdr.detectChanges();
        this.stepperService.toggleStepper(true);
        this.stepperService.changeIndex(0);
    }

    ngAfterViewInit(): void {
        this.selectedClientType = 'Corporate';
        // this.cdr.detectChanges();
    }

    changeClientType(event): void {
        console.log(event);
    }

    async addIndividualClient(client: IIndividualClient): Promise<void> {
        this.clientsService.addIndividualClient(client);
    }

    async addCorporateClient(client: ICorporateClient): Promise<void> {
        this.clientsService.addCorporateClient(client);
    }

    submitIndividualClient(): void {
        console.log('Submittingbbb');
        for (let i in this.individualClientForm.controls) {
            /// validation;
            this.individualClientForm.controls[i].markAsDirty();
            this.individualClientForm.controls[i].updateValueAndValidity();
        }

        if (
            this.individualClientForm.valid ||
            !this.individualClientForm.valid
        ) {
            this.addIndividualClient(this.individualClientForm.value).then(
                res => {
                    console.log('Added Individaul');
                    this.individualClientForm.reset();
                }
            );
        }
    }

    submitCorporateClient(): void {
        for (let i in this.corporateClientForm.controls) {
            /// validation;
            this.corporateClientForm.controls[i].markAsDirty();
            this.corporateClientForm.updateValueAndValidity();
        }

        if (this.corporateClientForm.valid) {
            this.addCorporateClient(this.corporateClientForm.value).then(
                res => {
                    console.log('Added Corporate.');
                    this.corporateClientForm.reset();
                }
            );
        }
    }
}
