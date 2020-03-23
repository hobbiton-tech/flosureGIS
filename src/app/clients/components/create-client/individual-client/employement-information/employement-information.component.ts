import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StepperService } from 'src/app/clients/common/services/stepper.service';
import { Router } from '@angular/router';
import { ClientsService } from 'src/app/clients/services/clients.service';

@Component({
    selector: 'app-employement-information',
    templateUrl: './employement-information.component.html',
    styleUrls: ['./employement-information.component.scss']
})
export class EmployementInformationComponent implements OnInit {
    // Declarations
    employementInformationForm: FormGroup;

    // Sector values
    listOfOption = ['Finance', 'Agriculture', 'Energy'];
    listOfSelectedValue: string[] = [];
    personal: any;

    isNotSelected(value: string): boolean {
        return this.listOfSelectedValue.indexOf(value) === -1;
    }

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
        return this.employementInformationForm.controls;
    }

    onSubmit() {
        const some = this.employementInformationForm.value;
        console.log(some);
        // this.clientsService.addClient(some);
        this.stepperService.changeIndex(3);
        this.router.navigateByUrl('/flosure/clients/bank-details');
    }

    ngOnInit(): void {
        this.personal = this.getFromLocalStrorage();
        console.log(this.personal);
        this.employementInformationForm = this.formBuilder.group({
            title: [this.personal.title],
            firstName: [this.personal.firstName],
            lastName: [this.personal.lastName],
            email: [this.personal.email],
            address: [this.personal.address],
            phone: [this.personal.phone],
            gender: [this.personal.gender],
            dob: [this.personal.dob],
            clientID: [this.personal.clientID],
            type: ['Individual'],
            status: ['Inactive'],
            sector: ['', Validators.required],
            occupation: ['', Validators.required]
        });
        this.stepperService.toggleStepper(true);
        this.stepperService.changeIndex(2);
    }
}
