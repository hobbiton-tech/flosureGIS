import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';
import { UsersService } from './services/users.service';
import { UserModel, UserRolePermissionModel } from './models/users.model';
import { NzMessageService } from 'ng-zorro-antd';
import { Subject, BehaviorSubject } from 'rxjs';
import { RolesService } from './services/roles.service';
import { PermissionsModel, RolesModel } from './models/roles.model';
import { DepartmentService } from '../settings/components/organizational-setups/services/department.service';
import { DepartmentModel } from '../settings/models/department/department.model';
import { BranchService } from './services/branch.service';
import { BranchModel } from './models/branch.model';

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
    roles: RolesModel[] = [];
    permissions: PermissionsModel[] = [];
    departments: DepartmentModel[] = [];
    branches: BranchModel[] = [];
  multipleValue = [];


    constructor(
        private formBuilder: FormBuilder,
        private readonly usersService: UsersService,
        private rolesService: RolesService,
        private  departmentService: DepartmentService,
        private branchService: BranchService,
        private msg: NzMessageService, private changeDetectorRefs: ChangeDetectorRef
    ) {
        this.userDetailsForm = this.formBuilder.group({
            first_name: ['', Validators.required],
            surname: ['', Validators.required],
            email: ['', Validators.required],
            phone_number: ['', Validators.required],
            role: ['', Validators.required],
            branch_id: ['', Validators.required],
            department_id: ['', Validators.required],
            job_title: ['', Validators.required],
            permission_id: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.usersService.getUsers().subscribe(users => {
            this.usersList = users;
            this.displayUsersList = this.usersList;
            console.log('Users', users);
        });
        this.rolesService.getRole().subscribe((roles) => {
          this.roles = roles;
        });

        this.rolesService.getPermission().subscribe((permissions) => {
          this.permissions = permissions;
        });

        this.departmentService.getDepartment().subscribe((departments) => {
          this.departments = departments;
        });

        this.branchService.getBranch().subscribe((branches) => {
          this.branches = branches;
        });
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
            const details: UserModel = {...this.userDetailsForm.value};


            await this.usersService.SignUp(details)
            .then(
                (res) => {
                     this.isVisible = false;
                     this.refresh(details);
                     this.msg.success('User successfully Added');
                 }).catch((err) => {
                     this.msg.success('Failed to add User');
                 });
        }
    }

    createUser() {
      if (this.userDetailsForm.valid || !this.userDetailsForm.valid) {
        const randomstring = Math.random()
          .toString(36)
          .slice(-8);


        const details: UserModel = {
          branch_id: Number(this.userDetailsForm.controls.branch_id.value),
          department_id: Number(this.userDetailsForm.controls.department_id.value),
          email: this.userDetailsForm.controls.email.value,
          job_title: this.userDetailsForm.controls.job_title.value,
          password: randomstring,
          phone_number: this.userDetailsForm.controls.phone_number.value,
          surname: this.userDetailsForm.controls.surname.value,
          first_name: this.userDetailsForm.controls.first_name.value,
        };

        const emailDetails = {
          username: details.email,
          text: 'Dear ' + details.first_name + ' ' + details.surname + ', ' + ' your username is '
            + details.email + ' and your password is ' +
            details.password + ' for https://savenda-flosure.com/ (flosure General Insurance System)',
          subject: 'Flosure General insurance System Credentials',
          receiver: details.email,
          sender: 'Flosure General Insurance System',
          password: details.password,
          url: 'https://savenda-flosure.com/'
        };
        console.log('USERS', details);
        this.usersService.createUser(details).subscribe((userRes) => {
          console.log('USERS', userRes);

          if (userRes.error) {
            this.msg.error(userRes.error);
          } else {
            for (const p of this.userDetailsForm.controls.permission_id.value) {
              const urp: UserRolePermissionModel = {
                user_id: Number(userRes.ID),
                role_id: Number(this.userDetailsForm.controls.role.value),
                permission_id: Number(p)
              };
              this.usersService.createUserRolePermission(urp).subscribe((urpRes) => {
                console.log('URP', urp, urpRes);
              }, (errUrp) => {
                this.msg.error(errUrp);
              });
          }
            this.usersService.sendEmail(emailDetails).subscribe((emailRe) => {});
            this.refresh(details);
            this.isVisible = false;
            this.msg.success('User Created Successfully');
          }

        });
      }
    }

    refresh(data: UserModel) {

            this.displayUsersList.push(data);
            const clone = this.displayUsersList.slice();
            this.displayUsersList = clone;

            console.log('DATATATA>>>>', this.displayUsersList);
      }
}
