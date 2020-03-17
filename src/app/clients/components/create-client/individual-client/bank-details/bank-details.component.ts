import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StepperService } from 'src/app/clients/common/services/stepper.service';
import { Router } from '@angular/router';
import { ClientsService } from 'src/app/clients/services/clients.service';
import { AccountDetails } from 'src/app/clients/models/account-details.model';

@Component({
    selector: 'app-bank-details',
    templateUrl: './bank-details.component.html',
    styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {
    // Declarations
    bankDetailsForm: FormGroup;
    id: any;

    // getting data from local storage
    public getFromLocalStrorage() {
        const users = JSON.parse(localStorage.getItem('personal'));
        return users;
    }

    constructor(
        private stepperService: StepperService,
        private router: Router,
        private formBuilder: FormBuilder,
        private readonly clientsService: ClientsService
    ) {}

    get f() {
        return this.bankDetailsForm.controls;
    }

    ngOnInit(): void {
        this.id = this.getFromLocalStrorage();
        this.bankDetailsForm = this.formBuilder.group({
            accountName: ['', Validators.required],
            accountNumber: ['', Validators.required],
            accountType: ['', Validators.required],
            bank: ['', Validators.required],
            branch: ['', Validators.required],
            clientID: [this.id.clientID]
        });
        this.stepperService.toggleStepper(true);
        this.stepperService.changeIndex(3);
    }

    onSubmit() {
        const some = this.bankDetailsForm.value;
        console.log(some);
        this.clientsService.addAccountDetails(some);
        this.stepperService.changeIndex(0);
        this.router.navigateByUrl('/clients/create-client');
    }
}
