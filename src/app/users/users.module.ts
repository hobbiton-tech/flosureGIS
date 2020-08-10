import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { UsersRolesComponent } from './components/users-roles/users-roles.component';
import { UsersPermissionsComponent } from './components/users-permissions/users-permissions.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

const routes: Routes = [
    {
        path: 'users-roles',
        component: UsersRolesComponent
    },
    {
        path: 'roles-permissions',
        component: UsersPermissionsComponent
    },
    {
        path: 'users',
        component: UsersComponent
    },
    { path: "forgot-password", component: ForgotPasswordComponent },
];



@NgModule({
  declarations: [UsersComponent, UsersRolesComponent, UsersPermissionsComponent, ForgotPasswordComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsersModule {}
