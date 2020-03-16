import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StepperService } from 'src/app/clients/common/services/stepper.service';
import { Router } from '@angular/router';
import { ClientsService } from 'src/app/clients/services/clients.service';

@Component({
    selector: 'app-contact-person',
    templateUrl: './contact-person.component.html',
    styleUrls: ['./contact-person.component.scss']
})
export class ContactPersonComponent implements OnInit {
    // Declarations
    contactPersornForm: FormGroup;
  companyDetails: any;

    constructor(
        private stepperService: StepperService,
        private router: Router,
        private formBuilder: FormBuilder,
        private readonly clientsService: ClientsService
    ) {}

    get f() {
        return this.contactPersornForm.controls;
    }

    // getting data from local storage
    public getFromLocalStrorage() {
        const users = JSON.parse(localStorage.getItem('personal'));
        return users;
    }

    ngOnInit(): void {
        this.stepperService.toggleStepper(true);
        this.stepperService.changeIndex(2);
        this.companyDetails = this.getFromLocalStrorage();
        this.contactPersornForm = this.formBuilder.group({
            companyName: [this.companyDetails.companyName],
            tpinNumber: [this.companyDetails.tpinNumber],
            registrationNumber: [this.companyDetails.registrationNumber],
            email: [this.companyDetails.email],
            address: [this.companyDetails.address],
            phone: [this.companyDetails.phone],
            sector: [this.companyDetails.sector],
            clientID: [this.companyDetails.clientID],
            type: ['Corporate'],
            status: ['Inactive'],
            contactFirstName: ['', Validators.required],
            contactLastName: ['', Validators.required],
            contactEmail: ['', Validators.required]
        });
    }

    onSubmit() {
        const some = this.contactPersornForm.value;
        console.log(some);
        this.clientsService.addClient(some);
        this.stepperService.changeIndex(3);
        this.router.navigateByUrl('/clients/company-bank-details');
    }
}
