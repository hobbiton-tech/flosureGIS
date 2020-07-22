import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';
import { UsersService } from './services/users.service';
import { UserModel } from './models/users.model';
import { NzMessageService } from 'ng-zorro-antd';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    usersList: UserModel[] = [];
    displayUsersList: UserModel[] = [];

    userUpdate = new BehaviorSubject<boolean>(false);

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
        private msg: NzMessageService, private changeDetectorRefs: ChangeDetectorRef
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

        // this.userUpdate.subscribe(update =>
        //     update === true
        //         ? this.usersService.getUsers().subscribe(users => {
        //               this.usersList = users;
        //               this.displayUsersList = this.usersList;
        //           })
        //         : ''
        // );
    }

    showModal(): void {
        this.isVisible = true;
    }



    handleCancel(): void {
        console.log('Button cancel clicked!');
        this.isVisible = false;
    }

    // async addUser(userDto: UserModel) {


    //     //     ,
    //     //     () => {
    //     //         this.userUpdate.next(true);
    //     //     }
    //     // );
    // }

    async submitUser() {
        // for (const i in this.userDetailsForm.controls) {
        //     this.userDetailsForm.controls[i].markAsDirty();
        //     this.userDetailsForm.controls[i].updateValueAndValidity();
        // }

        if (this.userDetailsForm.valid || !this.userDetailsForm.valid) {
            // this.addUser(this.userDetailsForm.value).then(res => {
            //     this.userDetailsForm.reset();
            // });
            const details: UserModel = { ...this.userDetailsForm.value }


            await this.usersService.SignUp(details)
                .then(
                    (res) => {
                        this.isVisible = false;
                        this.refresh(details)
                        this.msg.success('User successfully Added');
                    }).catch((err) => {
                        this.msg.success('Failed to add User');
                    })
        }
    }

    // updateConfirmValidator(): void {
    //     /** wait for refresh value */
    //     Promise.resolve().then(() =>
    //         this.userDetailsForm.controls.checkPassword.updateValueAndValidity()
    //     );
    // }

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

    refresh(data: UserModel) {

        this.displayUsersList.push(data)
        const clone = this.displayUsersList.slice()
        this.displayUsersList = clone;

        console.log('DATATATA>>>>', this.displayUsersList);
    }
}
