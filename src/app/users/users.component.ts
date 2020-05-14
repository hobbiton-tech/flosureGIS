import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';
import { UsersService } from './services/users.service';
import { User } from './models/users.model';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    usersList: User[] = [];
    displayUsersList: User[] = [];

    isVisible = false;
    // Declarations
    userDetailsForm: FormGroup;
    // role values
    listOfOption = ['Admin', 'Agent', 'Broker'];
    listOfSelectedValue: string[] = [];

    isNotSelected(value: string): boolean {
        return this.listOfSelectedValue.indexOf(value) === -1;
    }

    constructor(
        private formBuilder: FormBuilder,
        private readonly usersService: UsersService,
        private msg: NzMessageService
    ) {
        this.userDetailsForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            surname: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            role: ['', Validators.required],
            branch: ['', Validators.required],
            department: ['', Validators.required],
            jobTitle: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.usersService.getUsers().subscribe(users => {
            this.usersList = users;
            this.displayUsersList = this.usersList;
        });
    }

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

    async addUser(userDto: User) {
        await this.usersService.addUser(userDto).subscribe(res => {
            console.log(res);
            this.isVisible = false;
            this.msg.success('User successfully Added');
            this.usersList = this.displayUsersList;
            this.displayUsersList = this.usersList;
        });
    }

    submitUser(): void {
        for (const i in this.userDetailsForm.controls) {
            this.userDetailsForm.controls[i].markAsDirty();
            this.userDetailsForm.controls[i].updateValueAndValidity();
        }

        if (this.userDetailsForm.valid || !this.userDetailsForm.valid) {
            this.addUser(this.userDetailsForm.value).then(res => {
                this.userDetailsForm.reset();
            });
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
