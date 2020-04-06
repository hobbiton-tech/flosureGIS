import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliciesComponent } from './components/policies/policies.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { Routes, RouterModule } from '@angular/router';
import { EndorsementsComponent } from './components/endorsements/endorsements.component';
import { PolicyDetailsComponent } from './components/policy-details/policy-details.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PdfViewerModule } from 'ng2-pdf-viewer';

const routes: Routes = [
    {
        path: 'endorsements',
        component: EndorsementsComponent
    },
    {
        path: 'policies',
        component: PoliciesComponent
    },
    {
        path: 'policy-details',
        component: PolicyDetailsComponent
    },
    {
        path: 'policy-details/:policyNumber',
        component: PolicyDetailsComponent
    }
];

@NgModule({
    declarations: [
        EndorsementsComponent,
        PoliciesComponent,
        PolicyDetailsComponent
    ],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        PdfViewerModule
    ]
})
export class UnderWritingModule {}
