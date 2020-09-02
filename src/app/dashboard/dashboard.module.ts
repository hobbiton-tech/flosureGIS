import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { Routes, RouterModule } from '@angular/router';
import { DashboardService } from './services/dashboard.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UsersRolesComponent } from '../users/components/users-roles/users-roles.component';
import { AuthGuard } from '../users/helpers/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
      canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, NgZorroAntdModule, RouterModule.forChild(routes),ReactiveFormsModule,FormsModule,],
    providers: [DashboardService],
    exports: [DashboardComponent]
})
export class DashboardModule {}
