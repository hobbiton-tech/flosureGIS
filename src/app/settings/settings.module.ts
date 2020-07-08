import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { AgentsComponent } from './components/agents/agents.component';
import { AgentsService } from './components/agents/services/agents.service';
import { AddAgentComponent } from './components/agents/add-agent/add-agent.component';
import { AddTaxComponent } from './components/rates/components/add-tax/add-tax.component';
import { ProductSetupsComponent } from './components/product-setups/product-setups.component';
import { AddClassComponent } from './components/product-setups/components/add-class/add-class.component';
import { AddProductComponent } from './components/product-setups/components/add-product/add-product.component';
import { AddCoverTypeComponent } from './components/product-setups/components/add-cover-type/add-cover-type.component';
import { AddPerilComponent } from './components/product-setups/components/add-peril/add-peril.component';
import { AddProductCommissionComponent } from './components/agents/add-product-commission/add-product-commission.component';
import { ClausesService } from './components/underwriting-setups/services/clauses.service';
import { WarrantiesComponent } from './components/warranties/warranties.component';
import { ExtensionsComponent } from './components/extensions/extensions.component';
import { ClaimSetupsComponent } from './components/claim-setups/claim-setups.component';
import { ServiceProviderComponent } from './components/claim-setups/components/service-provider/service-provider.component';
import { LossAdjustorComponent } from './components/claim-setups/components/loss-adjustor/loss-adjustor.component';
import { IndividualComponent } from './components/claim-setups/components/individual/individual.component';
import { ClaimantComponent } from './components/claim-setups/components/claimant/claimant.component';
import { SalvageBuyerComponent } from './components/claim-setups/components/salvage-buyer/salvage-buyer.component';

const routes: Routes = [
    {
        path: 'insurance-companies',
        component: InsuranceCompaniesComponent,
    },
    {
        path: 'rates',
        component: RatesComponent,
    },
    {
        path: 'add-insurance-company',
        component: AddInsuranceCompanyComponent,
    },
    {
        path: 'clauses',
        component: UnderwritingSetupsComponent,
    },
    {
        path: 'accounts',
        component: AccountsComponent,
    },
    {
        path: 'organization-setups',
        component: OrganizationalSetupsComponent,
    },
    {
        path: 'agents-setups',
        component: AgentsComponent,
    },
    {
        path: 'add-agents',
        component: AddAgentComponent,
    },
    {
        path: 'product-setups',
        component: ProductSetupsComponent,
    },
    {
        path: 'warranties',
        component: WarrantiesComponent,
    },
    {
        path: 'extensions',
        component: ExtensionsComponent,
    },
    {
        path: 'claims',
        component: ClaimSetupsComponent,
    },
];

@NgModule({
    declarations: [
        AccountsComponent,
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
        AddRateComponent,
        AgentsComponent,
        AddAgentComponent,
        AddTaxComponent,
        ProductSetupsComponent,
        AddClassComponent,
        AddProductComponent,
        AddCoverTypeComponent,
        AddPerilComponent,
        AddProductCommissionComponent,
        WarrantiesComponent,
        ExtensionsComponent,
        ClaimSetupsComponent,
        ServiceProviderComponent,
        LossAdjustorComponent,
        IndividualComponent,
        ClaimantComponent,
        SalvageBuyerComponent,
    ],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
    ],
    providers: [AgentsService, ClausesService],
})
export class SettingsModule {}
