import { Component, OnInit } from '@angular/core';
import { StepperService } from 'src/app/clients/common/services/stepper.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientsService } from 'src/app/clients/services/clients.service';

@Component({
    selector: 'app-personal-details',
    templateUrl: './personal-details.component.html',
    styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
    // Declarations
  personalDetailsForm: FormGroup;
  clientID = 200;
    // title values
    listOfOption = ['Mr', 'Mrs', 'Dr', 'Prof'];
    listOfSelectedValue: string[] = [];

    isNotSelected(value: string): boolean {
        return this.listOfSelectedValue.indexOf(value) === -1;
    }

    constructor(
        private stepperService: StepperService,
        private router: Router,
        private formBuilder: FormBuilder,
        // private readonly clientsService: ClientsService
    ) {
        this.personalDetailsForm = this.formBuilder.group({
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required],
            address: ['', Validators.required],
            phone: ['', Validators.required],
            gender: ['', Validators.required],
            dob: ['', Validators.required],
            clientID: [++this.clientID + 5],
            type: ['Individual'],
            status: ['Inactive']
        });
    }

    get f() {
        return this.personalDetailsForm.controls;
    }

    ResetForm() {
        this.personalDetailsForm.reset();
    }

    ngOnInit(): void {
        this.stepperService.toggleStepper(true);
        this.stepperService.changeIndex(1);
    }

    onSubmit() {
      // console.log(this.f.value);
      const some = this.personalDetailsForm.value;
      console.log(some);
      // this.clientsService.addClient(some);
      localStorage.setItem(
           'personal',
           JSON.stringify(some)
       );
      this.ResetForm();
      this.stepperService.changeIndex(2);
      this.router.navigateByUrl('/clients/employement-information');
    }
}
