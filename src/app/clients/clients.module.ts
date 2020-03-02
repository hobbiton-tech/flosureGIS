import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CreateClientComponent } from './components/create-client/create-client.component';
import { Routes, RouterModule } from '@angular/router';
import { ClientsListComponent } from './components/clients-list/clients-list.component';
import { PersonalDetailsComponent } from './components/create-client/individual-client/personal-details/personal-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployementInformationComponent } from './components/create-client/individual-client/employement-information/employement-information.component';
import { BankDetailsComponent } from './components/create-client/individual-client/bank-details/bank-details.component';
import { CompanyDetailsComponent } from './components/create-client/corporate-client/company-details/company-details.component';
import { ContactPersonComponent } from './components/create-client/corporate-client/contact-person/contact-person.component';
import { CompanyBankDetailsComponent } from './components/create-client/corporate-client/company-bank-details/company-bank-details.component';


const routes: Routes = [
    {
        path: 'create-client',
        component: CreateClientComponent
    },
    {
        path: 'clients-list',
        component: ClientsListComponent
    },
    {
        path: 'personal-details',
        component: PersonalDetailsComponent
    },
    {
        path: 'employement-information',
        component: EmployementInformationComponent
    },
    {
        path: 'bank-details',
        component: BankDetailsComponent
    },
    {
        path: 'company-details',
        component: CompanyDetailsComponent
    },
    {
        path: 'contact-person',
        component: ContactPersonComponent
    },
    {
        path: 'company-bank-details',
        component: CompanyBankDetailsComponent
    }
];


@NgModule({
    declarations: [
        ClientsComponent,
        CreateClientComponent,
        PersonalDetailsComponent,
        EmployementInformationComponent,
        BankDetailsComponent,
        CompanyDetailsComponent,
        ContactPersonComponent,
        CompanyBankDetailsComponent,
        ClientsListComponent
    ],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    exports: [ClientsComponent]
})
export class ClientsModule {}
