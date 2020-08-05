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

import { IBranch } from 'src/app/settings/models/finance/branch.model';
import { BranchService } from 'src/app/settings/components/finance-setups/services/branch.service'
import { RolesService } from 'src/app/users/services/roles.service';
import { IRole } from 'src/app/users/models/roles.model'

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    //testing Email and Name
    ////////////////////////
    isPopUpVisible = false;

    // branches: IBranch[] = [];
    branchList: IBranch[] = [];
    roles: IRole[] = [];
    rolesList: IRole[] = [];

    selectedBranchValue: any[] = [];
    usersList: UserModel[] = [];
    displayUsersList: UserModel[] = [];

    userUpdate = new BehaviorSubject<boolean>(false);
    role: any;
    branch: any;
    isVisible = false;
    // Declarations
    userDetailsForm: FormGroup;
    // role values
    listOfOption = ['Admin', 'Agent', 'Broker'];
    listOfSelectedValue: string[] = [];
    userId: any;
    firstName: any;
    surname: any;
    email: any;
    SelectedEmail: any;
    selectedUser: any;
    users: UserModel[] = [];

    isNotSelected(value: string): boolean {
        return this.listOfSelectedValue.indexOf(value) === -1;
    }

    constructor(
        private formBuilder: FormBuilder,
        private readonly usersService: UsersService,
        private msg: NzMessageService, private changeDetectorRefs: ChangeDetectorRef,
        private BranchService: BranchService,
        private rolesService: RolesService,
    ) {
        this.userDetailsForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            surname: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            roleName: ['', Validators.required],
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
        this.usersService.getUsers().subscribe((res) => {
            this.users = res;
            this.usersList = this.users;
        })
        this.BranchService.getBranch().subscribe((res) => {
            this.branchList = res;
        });
        this.rolesService.getRole().subscribe((res) => {
            this.roles = res;
            this.rolesList = this.roles;
        });
    }

    /////////////////////////////
    ///Email and Name //////
    //////////////////////////////
    onSelect(user) {

        this.isPopUpVisible = true

    }

    handleSelectCancel() {
        this.isPopUpVisible = false;
    }
    handleSelectOk() {
        this.isPopUpVisible = false;
    }
    ChangeEmail(user) {
        console.log('On Select>>>>', user);
        this.firstName = user.firstName;
        this.surname = user.surname;
        this.SelectedEmail = user.email;

        this.selectedUser = user;
        console.log(this.usersList)
        this.usersList = this.users.filter(
            (x) => x.email === user.email
        );
        console.log(this.usersList)
        console.log(
            "Filer>>>>",
            user.email,
            user.firstName,
            user.surname,
            this.usersList,

        );

    }

    showModal(): void {
        this.isVisible = true;
    }

    branchChange(value) {
        console.log('ON CHANGE>>>>', value);
        this.branch = value;
    }
    changeRoleName(value: any): void {
        this.rolesService.getRole().subscribe((res) => {
            console.log('rrroooo>>>>>', value)
        });
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
