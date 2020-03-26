import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ClaimsComponent } from './components/claims/claims.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

const routes: Routes = [
    {
        path: 'claims',
        component: ClaimsComponent
    },
    {
        path: 'policies',
        component: PoliciesComponent
    }
];

@NgModule({
    declarations: [ReportsComponent, ClaimsComponent, PoliciesComponent],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        PdfViewerModule,
        RouterModule.forChild(routes)
    ]
})
export class ReportsModule {}
