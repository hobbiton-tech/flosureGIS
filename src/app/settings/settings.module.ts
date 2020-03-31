import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { OrganizationalSetupsComponent } from './components/organizational-setups/organizational-setups.component';
import { UnderwritingSetupsComponent } from './components/underwriting-setups/underwriting-setups.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CreateAccountTypeComponent } from './components/organizational-setups/organizational-components/create-account-type/create-account-type.component';
import { CreateAccountComponent } from './components/organizational-setups/organizational-components/create-account/create-account.component';
import { CreateClientTypeComponent } from './components/organizational-setups/organizational-components/create-client-type/create-client-type.component';
import { CreateCurrencyComponent } from './components/organizational-setups/organizational-components/create-currency/create-currency.component';
import { CreatePaymentModeComponent } from './components/organizational-setups/organizational-components/create-payment-mode/create-payment-mode.component';
import { CreateRelationshipTypeComponent } from './components/organizational-setups/organizational-components/create-relationship-type/create-relationship-type.component';
import { CreateSectorComponent } from './components/organizational-setups/organizational-components/create-sector/create-sector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AccountsComponent } from './components/accounts/accounts.component';
import { InsuranceCompaniesComponent } from './components/insurance-companies/insurance-companies.component';
import { AddInsuranceCompanyComponent } from './components/insurance-companies/components/add-insurance-company/add-insurance-company.component';
import { RatesComponent } from './components/rates/rates.component';
import { AddRateComponent } from './components/rates/components/add-rate/add-rate.component';

const routes: Routes = [
    {
        path: 'insurance-companies',
        component: InsuranceCompaniesComponent
    },
    {
        path: 'rates',
        component: RatesComponent
    },
    {
        path: 'add-insurance-company',
        component: AddInsuranceCompanyComponent
    },
    {
        path: 'underwriting',
        component: UnderwritingSetupsComponent
    },
    {
        path: 'accounts',
        component: AccountsComponent
    },
    {
        path: 'organization-setups',
        component: OrganizationalSetupsComponent
    }
];

@NgModule({
    declarations: [
        AccountsComponent,
        SettingsComponent,
        OrganizationalSetupsComponent,
        UnderwritingSetupsComponent,
        CreateAccountTypeComponent,
        CreateAccountComponent,
        CreateClientTypeComponent,
        CreateCurrencyComponent,
        CreatePaymentModeComponent,
        CreateRelationshipTypeComponent,
        CreateSectorComponent,
        AccountsComponent,
        InsuranceCompaniesComponent,
        AddInsuranceCompanyComponent,
        RatesComponent,
        AddRateComponent
    ],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    exports: [SettingsComponent]
})
export class SettingsModule {}
