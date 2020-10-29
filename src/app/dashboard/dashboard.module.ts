import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { DashboardService } from './services/dashboard.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UsersRolesComponent } from '../users/components/users-roles/users-roles.component';
import { AuthGuard } from '../users/helpers/auth.guard';
import {
  NzBadgeModule,
  NzCardModule,
  NzGridModule,
  NzInputModule, NzMessageModule,
  NzSpinModule,
  NzStatisticModule,
  NzTableModule,
  NzTabsModule
} from 'ng-zorro-antd';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
      canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [DashboardComponent],
  imports: [CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    NzGridModule,
    NzCardModule,
    NzStatisticModule,
    NzTabsModule,
    NzInputModule,
    NzTableModule,
    NzBadgeModule,
    NzSpinModule,
    NzMessageModule
  ],
    providers: [DashboardService],
    exports: [DashboardComponent]
})
export class DashboardModule {}
