import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ClaimsComponent } from './components/claims/claims.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { UnderwritingComponent } from './components/underwriting/underwriting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersRolesComponent } from '../users/components/users-roles/users-roles.component';
import { AuthGuard } from '../users/helpers/auth.guard';
import {
  NzBadgeModule,
  NzButtonModule,
  NzCardModule, NzDatePickerModule,
  NzFormModule,
  NzGridModule,
  NzInputModule,
  NzModalModule,
  NzSelectModule,
  NzTableModule
} from 'ng-zorro-antd';

const routes: Routes = [
    {
        path: 'claims',
        component: ClaimsComponent,
  canActivate: [AuthGuard]
    },
    {
        path: 'policies',
        component: PoliciesComponent,
  canActivate: [AuthGuard]
    },
    {
        path: 'underwriting',
        component: UnderwritingComponent,
  canActivate: [AuthGuard]
    },
];

@NgModule({
    declarations: [ClaimsComponent, PoliciesComponent, UnderwritingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PdfViewerModule,
    RouterModule.forChild(routes),
    NzGridModule,
    NzButtonModule,
    NzCardModule,
    NzTableModule,
    NzFormModule,
    NzModalModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzBadgeModule
  ]
})
export class ReportsModule {}
