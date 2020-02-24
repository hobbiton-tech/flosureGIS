import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { QuotesComponent } from './quotes/quotes.component';
import { QuotesModule } from './quotes/quotes.module';
import { ClientsComponent } from './clients/clients.component';
import { ClientsModule } from './clients/clients.module';
import { CreateQuoteComponent } from './quotes/components/create-quote/create-quote.component';
import { QuotationDetailsComponent } from './quotes/components/create-quote/stepper/quotation-details/quotation-details.component';
import { QuotationProductDetailsComponent } from './quotes/components/create-quote/stepper/quotation-product-details/quotation-product-details.component';
import { RiskDetailsComponent } from './quotes/components/create-quote/stepper/risk-details/risk-details.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsModule } from './settings/settings.module';
import { OrganizationalSetupsComponent } from './settings/components/organizational-setups/organizational-setups.component';
import { UnderwritingSetupsComponent } from './settings/components/underwriting-setups/underwriting-setups.component';


const routes: Routes = [
    {
        path: '',
        component: NavigationComponent,
        children: [
            {
                path: '',
                component: QuotesComponent
            },
            {
                path: 'clients',
                component: ClientsComponent
            },
            {
                path: 'settings',
                component: SettingsComponent
            },
            {
                path: 'organizational-setups',
                component: OrganizationalSetupsComponent,
            },
            {
                path: 'underwriting-setups',
                component: UnderwritingSetupsComponent,
            },
            {
                path: 'create-quote',
                component: CreateQuoteComponent,
                children: [
                   { path:'quotation-details', pathMatch: "full", component: QuotationDetailsComponent},
                   { path:'quotation-product-details', pathMatch: "full", component: QuotationProductDetailsComponent},
                   { path:'risk-details', pathMatch: "full", component: RiskDetailsComponent}
                ]
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes), QuotesModule, ClientsModule, SettingsModule],
    exports: [RouterModule]
})
export class AppRoutingModule {}
