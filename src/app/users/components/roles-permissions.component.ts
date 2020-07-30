import { Component, OnInit, ChangeDetectorRef, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';

import { NzModalModule } from 'ng-zorro-antd/modal';
import 'firebase/firestore';

import { RolesService } from '../services/roles.service';
import { IRole } from '../models/roles.model';
import { PermissionsService } from '../services/permissions.service';
import { IPermission } from '../models/permissions.model';
import { NzMessageService } from 'ng-zorro-antd';
import { Subject, BehaviorSubject, from } from 'rxjs';
import { IRolesPermissions } from '../models/roles-permissions.model';
import { v4 } from 'uuid';
import { EventEmitter } from '@angular/core';
import { IdType } from 'src/app/clients/models/client.model';
@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.scss'],
})
export class RolesPermissionsComponent implements OnInit {
  displayPermissionsList: IPermission[] = [];
  // cleanFun: Array<IRole & IRolesPermissions & IPermission>;
  roles: IRole[] = [];
  rolesList: IRole[] = [];
  permissions: IPermission[] = [];
  perm: IPermission[] = [];
  permissionsList: IPermission[] = [];
  rolesPermission: [] = [];
  rolesPermissionList: IRolesPermissions[] = [];


  @Output() onRoleSelected: EventEmitter<any> = new EventEmitter();
  @Output() onPermissionSelected: EventEmitter<any> = new EventEmitter();

  selectedRoleValue: any[] = [];
  seletedPermissionValue: any[] = [];

  isPopUpVisible = false;
  isRoleEidtVisible: boolean = false;
  isPermissionEditVisible: boolean = false;


  editRole: any;
  editPermission: any;

  role: any;
  permission: any;




  isRolesVisible = false;
  isPermissionsVisible = false;

  selectedRoleName: any;
  rolePermissionName: any;

  rolesForm: FormGroup;
  permissionsForm: FormGroup;

  roleName: any;
  description: any;
  name: any;
  selectedRole: string;
  selectedRoleId: string;

  // listOfOption = ['TeamLeader', 'Co-ordinator', 'Tester'];

  // listOfSelectedValue: string[] = [];
  // addRole: any;



  // isNotSelcted(value: string): boolean {
  //   return this.listOfSelectedValue.indexOf(value) === -1;
  // }

  constructor(
    private formBuilder: FormBuilder,
    private rolesService: RolesService,
    private permssionService: PermissionsService,
    private msg: NzMessageService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {

    this.rolesForm = formBuilder.group({
      roleName: ['', Validators.required],
      description: ['', Validators.required],
    });


    this.permissionsForm = formBuilder.group({
      rId: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  // showModal(value: any) {
  //   this.permissions === this.permissions.filter((x) => x.id === value.RoleId);
  //   console.log('popUp>>>>', value)

  //   this.isPopUpVisible = true;
  // }


  handleOk(): void {
    console.log('Button ok clicked!');
    this.isPopUpVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isPopUpVisible = false;
  }

  ngOnInit(): void {
    /// ROLES SERVICE //////
    this.rolesService.getRole().subscribe((res) => {
      this.roles = res;
      this.rolesList = this.roles;
    });

    /// PERMISSIONS SERVICE //////
    this.permssionService.getPermission().subscribe((res) => {
      this.permissions = res;
      this.permissionsList = this.permissions;

      this.displayPermissionsList = this.permissionsList;
    });
  }



  changeRoleName(value: any): void {
    this.rolesService.getRole().subscribe((res) => {
      console.log('rrroooo>>>>>', value)
    });
  }




  // ///EDIT  ROLES SERVICE //////

  // onEditRole(value) {
  //   this.editRole = value;
  //   this.rolesForm.get('roleName').setValue(this.editRole.roleName);
  //   this.rolesForm.get('Description').setValue(this.editRole.Description)
  //   this.isRoleEidtVisible = true;
  // }

  // handleEditRoleOk() {
  //   this.editRole.roleName = this.rolesForm.controls.roleName.value;
  //   this.editRole.Description = this.rolesForm.controls.Description.value;

  //   const index = this.selectedRoleValue.indexOf(this.editRole);
  //   this.selectedRoleValue[index] = this.editRole;

  //   const role: IRole = {
  //     ...this.rolesForm.value,
  //     id: this.editRole.id,
  //   };
  //   this.rolesService.updateRole(role);

  //   this.isRoleEidtVisible = false;
  // }

  // handleEditRoleCancel() {
  //   this.isRoleEidtVisible = false;
  // }
  handleRolesCancel() {
    this.isRolesVisible = false;
  }
  selectRole() {
    this.onRoleSelected.emit(this.selectedRoleValue);
  }

  ///EDIT  Permissions SERVICE //////

  // onEditPermission(value) {
  //   this.editPermission = value;
  //   this.permissionsForm.get('permissionName').setValue(this.editPermission.permissionName);
  //   this.permissionsForm.get('Description').setValue(this.editPermission.Description)
  //   this.isPermissionEditVisible = true;
  // }

  // handleEditPermissionOk() {
  //   this.editPermission.permissionName = this.permissionsForm.controls.permissionName.value;
  //   this.editPermission.Description = this.permissionsForm.controls.Description.value;

  //   const index = this.seletedPermissionValue.indexOf(this.editPermission);
  //   this.seletedPermissionValue[index] = this.editPermission;

  //   const permission: IPermission = {
  //     ...this.permissionsForm.value,
  //     id: this.editPermission.id,
  //   };
  //   this.permssionService.updatePermission(permission);

  //   this.isPermissionEditVisible = false;
  // }
  // handleEditPermissionCancel() {
  //   this.isPermissionEditVisible = false;
  // }

  handlePermissionCancel() {
    this.isPermissionsVisible = false;
  }

  selectPermission() {
    this.onPermissionSelected.emit(this.seletedPermissionValue);
  }


  onChange(value) {
    console.log('WWWWWWWWWWW>>>>>>>>', value);
    this.rolesService.getRole().subscribe((res) => {
      console.log('YEEEEEEEE>>>>', res);

      this.rolesList = res;
    });

    console.log('WWWWWWWWWWW>>>>>>>>', value);
    this.permssionService.getPermission().subscribe((res) => {
      console.log('YEEEEEEEE>>>>', res);

      this.permissionsList = res;
    });

  }
  onSelectRole(role) {
    this.selectedRoleId = role.rId;
    this.roleName = role.roleName;
    this.description = role.description;

    // rId.replace(/\s/g, "");
    this.selectedRole = role;
    this.permissionsList = this.permissions.filter((x) => x.rId === role.id);
    console.log('FIlt>>>>', role.id, this.permissions, this.permissionsList);

  }

  onSelectPermission(permission) {
    console.log('PEEEEEEEE>>>>', permission);
    this.name = permission.name;
    this.description = permission.description;


  }

  // cleanFunc(value: any) {
  //   this.permissions = this.permissions.filter((x) => x === value.roleId);
  //   this.permssionService.getPermission().subscribe((res) => {
  //     console.log('R>>>>', res)

  //   });

  // }
  // cleanFun(value: any) {
  //   this.permission = this.permissions.filter((x) => x.id === value.roleId)
  //   this.permssionService.getPermission().subscribe((res) => {
  //     console.log('R>>>>', res)

  //   });
  // }



  change(event): void {
    console.log(event);
  }

  openRoles(): void {
    this.isRolesVisible = true;
  }
  openPermissions(): void {
    this.isPermissionsVisible = true;
  }

  closeRoles(): void {
    this.isRolesVisible = false;
  }


  closePermissions(): void {
    this.isPermissionsVisible = false;
  }

  submitRoleForm() {
    const role: IRole = {
      ...this.rolesForm.value,
      id: v4(),
    };
    this.rolesService.addRole(role);
    console.log('DDDDDDDDDD>>>>>>>', role);
    this.isRolesVisible = false;
  }
  submitPermissionForm() {
    const permission: IPermission = {

      id: v4(),
      name: this.permissionsForm.controls.name.value,
      description: this.permissionsForm.controls.description.value,
      rId: this.permissionsForm.controls.rId.value.replace(/\s/g, ""),
    };

    this.permssionService.addPermission(permission);
    console.log('Permission>>>>>>>', permission);
    this.isPermissionsVisible = false;
  }
  // 

  resetpermissionsForm(value) { }

  resetrolesForm(value) { }



  //  this.roleUpdate.subscribe(update =>
  //           update === true
  //               ? this.roleUpdate.getRoles().subscribe(users => {
  //                     this.rolesList = users;
  //                     this.displayRolesList = this.rolesList;
  //                 })
  //               : ''
  //       );
  // }

  // showModal(): void {
  //   this.isRoleVisible = true;
  // }

  // handleCancel(): void {
  //   console.log('Button cancel clicked!');
  //   this.isRoleVisible = false;
  // }
  // async submitRole() {

  //   if (this.roleDetailsForm.valid || !this.roleDetailsForm.valid) {
  //     this.addRole(this.roleDetailsForm.value).then(res => {
  //       this.roleDetailsForm.reset();
  //     });
  //     const details: RolesModel = { ...this.roleDetailsForm.value }

  //   }
  // }
}