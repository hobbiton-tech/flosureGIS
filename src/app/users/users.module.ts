import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { UsersRolesComponent } from './components/users-roles/users-roles.component';
import { UsersPermissionsComponent } from './components/users-permissions/users-permissions.component';
import { RolesPermissionsComponent } from 'src/app/users/components/roles-permissions.component';

const routes: Routes = [
  {
    path: 'users-roles',
    component: UsersRolesComponent
  },
  {
    path: 'roles-permissions',
    component: RolesPermissionsComponent
  },
  {
    path: 'users',
    component: UsersComponent
  }
];



@NgModule({
  declarations: [UsersComponent, UsersRolesComponent, UsersPermissionsComponent, RolesPermissionsComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
