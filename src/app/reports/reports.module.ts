import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ClaimsComponent } from './components/claims/claims.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { UnderwritingComponent } from './components/underwriting/underwriting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path: 'claims',
        component: ClaimsComponent,
    },
    {
        path: 'policies',
        component: PoliciesComponent,
    },
    {
        path: 'underwriting',
        component: UnderwritingComponent,
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
