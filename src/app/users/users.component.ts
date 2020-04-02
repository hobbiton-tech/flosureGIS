import { Component, OnInit } from '@angular/core';
import { generateUsers } from './data/users.data';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
} from '@angular/forms';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
    usersList = [];

    isVisible = false;
    // Declarations
    userDetailsForm: FormGroup;
    // role values
    listOfOption = ['Admin', 'Agent', 'Broker'];
    listOfSelectedValue: string[] = [];

    isNotSelected(value: string): boolean {
        return this.listOfSelectedValue.indexOf(value) === -1;
    }

    constructor(private formBuilder: FormBuilder) {
        this.userDetailsForm = this.formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            phone_number: ['', Validators.required],
            roleID: ['', Validators.required],
        });
    }

    ngOnInit(): void {}

    showModal(): void {
        this.isVisible = true;
    }

    handleOk(): void {
        console.log('Button ok clicked!');
        this.isVisible = false;
    }

    handleCancel(): void {
        console.log('Button cancel clicked!');
        this.isVisible = false;
    }

    onSubmitForm(): void {
        // tslint:disable-next-line: forin
        for (const i in this.userDetailsForm.controls) {
            this.userDetailsForm.controls[i].markAsDirty();
            this.userDetailsForm.controls[i].updateValueAndValidity();
        }
    }

    updateConfirmValidator(): void {
        /** wait for refresh value */
        Promise.resolve().then(() =>
            this.userDetailsForm.controls.checkPassword.updateValueAndValidity()
        );
    }

    confirmationValidator = (
        control: FormControl
    ): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (
            control.value !== this.userDetailsForm.controls.password.value
        ) {
            return { confirm: true, error: true };
        }
        return {};
    };

    onSubmit() {}
}
