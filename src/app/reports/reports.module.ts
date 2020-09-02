import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ClaimsComponent } from './components/claims/claims.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { UnderwritingComponent } from './components/underwriting/underwriting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersRolesComponent } from '../users/components/users-roles/users-roles.component';
import { AuthGuard } from '../users/helpers/auth.guard';

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
        NgZorroAntdModule,
        PdfViewerModule,
        RouterModule.forChild(routes),
    ],
})
export class ReportsModule {}
