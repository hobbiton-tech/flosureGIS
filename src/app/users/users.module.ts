import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { UsersRolesComponent } from './components/users-roles/users-roles.component';
import { UsersPermissionsComponent } from './components/users-permissions/users-permissions.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { UsersBranchComponent } from './components/users-branch/users-branch.component';
import { AuthGuard } from './helpers/auth.guard';
import {
  NzButtonModule,
  NzCardModule, NzDescriptionsModule,
  NzFormModule,
  NzGridModule, NzIconModule,
  NzInputModule, NzMessageModule,
  NzModalModule,
  NzPageHeaderModule,
  NzSelectModule,
  NzTableModule
} from 'ng-zorro-antd';

const routes: Routes = [
    {
        path: 'users-roles',
        component: UsersRolesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'roles-permissions',
        component: UsersPermissionsComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'users',
        component: UsersComponent,
      canActivate: [AuthGuard]
    },

    {
      path: 'users-branch',
      component: UsersBranchComponent,
      canActivate: [AuthGuard]
  },
    { path: 'forgot-password', component: ForgotPasswordComponent },
];



@NgModule({
  declarations: [UsersComponent, UsersRolesComponent, UsersPermissionsComponent, ForgotPasswordComponent, UsersBranchComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzGridModule,
    NzInputModule,
    NzPageHeaderModule,
    NzTableModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    NzDescriptionsModule,
    NzMessageModule,
    NzButtonModule,
    NzIconModule
  ]
})
export class UsersModule {}
