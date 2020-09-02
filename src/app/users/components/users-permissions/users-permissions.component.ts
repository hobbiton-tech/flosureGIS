import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { PermissionsModel, RolesModel } from '../../models/roles.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentModel } from '../../../settings/models/department/department.model';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-users-permissions',
  templateUrl: './users-permissions.component.html',
  styleUrls: ['./users-permissions.component.scss']
})
export class UsersPermissionsComponent implements OnInit {

  displayRoles: RolesModel[] = [];
  displayPermissions: PermissionsModel[] = [];
  roleForm: FormGroup;
  isRoleVisible = false;
  submittedRole = false;
  permissionForm: FormGroup;
  isPermissionVisible = false;
  submittedPermission = false;

  constructor(
    private message: NzMessageService,
    private fb: FormBuilder,
    private rolesService: RolesService,
    ) {
    this.roleForm = this.fb.group({
      role_name: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.permissionForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.rolesService.getRole().subscribe((res) => {
      this.displayRoles = res;
    });

    this.rolesService.getPermission().subscribe((resPermission) => {
      this.displayPermissions = resPermission;
    });
  }

  onBack(): void {
    console.log('onBack');
  }

  showRoleModal() {
    this.isRoleVisible = true;
  }

  handleRoleCancel() {
    this.isRoleVisible = false;
  }

  handleRoleOk() {
    this.submittedRole = true;
    if (this.roleForm.valid) {
      const role: RolesModel = {
        ...this.roleForm.value
      };

      this.rolesService.createRole(role).subscribe((resRole) => {
          this.message.success('Role Successfully Created');
          this.refresh();
        },
        (errROle) => {
          this.message.error(errROle);
        });
      this.isRoleVisible = false;
    }
  }


  get roleFormControl() {
    return this.roleForm.controls;
  }

  editRoleModal(role) {}



  showPermissionModal() {
    this.isPermissionVisible = true;
  }

  handlePermissionCancel() {
    this.isPermissionVisible = false;
  }

  handlePermissionOk() {
    this.submittedPermission = true;
    if (this.permissionForm.valid) {
      const permission: PermissionsModel = {
        ...this.permissionForm.value
      };

      this.rolesService.createPermission(permission).subscribe((Permission) => {
          this.message.success('Permission Successfully Created');
          this.refresh();
        },
        (errPermission) => {
          this.message.error(errPermission);
        });
      this.isPermissionVisible = false;
    }
  }


  get permissionFormControl() {
    return this.permissionForm.controls;
  }

  editPermissionModal(permission) {}

}
