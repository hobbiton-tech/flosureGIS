import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotesComponent } from './quotes.component';
import { CreateQuoteComponent } from './components/create-quote/create-quote.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { QuotesService } from './services/quotes.service';
import { QuoteDetailsComponent } from './components/quote-details/quote-details.component';

import 'firebase/firestore';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HttpClientModule } from '@angular/common/http';
import { RiskDetailsComponent } from './components/risk-details/risk-details.component';
import { QuoteComponent } from './documents/quote/quote.component';
import { QuoteDocumentComponent } from './documents/quote-document/quote-document.component';
import { DraftQuoteDocumentComponent } from './documents/draft-quote-document/draft-quote-document.component';
import { NgxPrintModule } from 'ngx-print';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { WarrantiesComponent } from './components/warranties/warranties.component';
import { ClausesComponent } from './components/clauses/clauses.component';
import { PerilsComponent } from './components/perils/perils.component';
import { LimitsOfLiabilityComponent } from './components/limits-of-liability/limits-of-liability.component';
import { VehicleDetailsComponent } from './components/vehicle-details/vehicle-details.component';
import { DiscountsComponent } from './components/discounts/discounts.component';
import { ExtensionsComponent } from './components/extensions/extensions.component';
import { ExcessesComponent } from './components/excesses/excesses.component';
import { PremiumComputationDetailsComponent } from './components/premium-computation-details/premium-computation-details.component';
import { ViewRiskComponent } from './components/view-risk/view-risk.component';
import { ExtensionsViewComponent } from './components/extensions-view/extensions-view.component';
import { PremiumComputationComponent } from './components/premium-computation/premium-computation.component';
import { TotalsViewComponent } from './components/totals-view/totals-view.component';
import { DiscountsViewComponent } from './components/discounts-view/discounts-view.component';
import { FleetUploadComponent } from './components/fleet-upload/fleet-upload.component';
import { PremiumComputationService } from './services/premium-computation.service';
import { VehicleDetailsServiceService } from './services/vehicle-details-service.service';
import { PropertyDetailsComponent } from './components/fire-class/property-details/property-details.component';
import { FirePremiumComputationDetailsComponent } from './components/fire-class/fire-premium-computation-details/fire-premium-computation-details.component';
import { FireClassService } from './services/fire-class.service';
import { FireQuotationsListComponent } from './components/fire-class/fire-quotations-list/fire-quotations-list.component';
import { AccidentQuotationsListComponent } from './components/accident-class/accident-quotations-list/accident-quotations-list.component';
import { AccidentPremiumComputationDetailsComponent } from './components/accident-class/accident-premium-computation-details/accident-premium-computation-details.component';
import { AccidentProductDetailsComponent } from './components/accident-class/accident-product-details/accident-product-details.component';
import { FireDraftQuoteDocumentComponent } from './documents/fire-class/fire-draft-quote-document/fire-draft-quote-document.component';
import { UsersRolesComponent } from '../users/components/users-roles/users-roles.component';
import { AuthGuard } from '../users/helpers/auth.guard';
import { PersonalAccidentComponent } from './components/accident-class/schedule-details/components/personal-accident/personal-accident.component';
import { ScheduleComponent } from './components/accident-class/schedule-details/schedule/schedule.component';
import { AccidentDraftQuotationComponent } from './documents/accident-class/accident-draft-quotation/accident-draft-quotation.component';
import { MarinePremiumComputationDetailsComponent } from './components/marine-class/marine-premium-computation-details/marine-premium-computation-details.component';
import { MarineProductDetailsComponent } from './components/marine-class/marine-product-details/marine-product-details.component';
import { MarineQuotationsListComponent } from './components/marine-class/marine-quotations-list/marine-quotations-list.component';
import { MarineScheduleComponent } from './components/marine-class/marine-schedule-details/marine-schedule/marine-schedule.component';
import { MarineCargoComponent } from './components/marine-class/marine-schedule-details/components/marine-cargo/marine-cargo.component';
import { EngineeringPremiumComputationDetailsComponent } from './components/engineering-class/engineering-premium-computation-details/engineering-premium-computation-details.component';
import { EngineeringProductDetailsComponent } from './components/engineering-class/engineering-product-details/engineering-product-details.component';
import { EngineeringQuotationsListComponent } from './components/engineering-class/engineering-quotations-list/engineering-quotations-list.component';
import { EngineeringScheduleDetailsComponent } from './components/engineering-class/engineering-schedule-details/engineering-schedule-details.component';
import { EngineeringItemComponent } from './components/engineering-class/engineering-schedule-details/components/engineering-item/engineering-item.component';
import { EngineeringDraftQuotationComponent } from './documents/engineering-class/engineering-draft-quotation/engineering-draft-quotation.component';
import { MarineDraftQuotationComponent } from './documents/marine-class/marine-draft-quotation/marine-draft-quotation.component';
import {
  NzBadgeModule,
  NzBreadCrumbModule, NzButtonModule,
  NzCardModule, NzCollapseModule, NzDescriptionsModule,
  NzDividerModule,
  NzFormModule,
  NzGridModule,
  NzInputModule, NzMessageModule,
  NzModalModule, NzPageHeaderModule,
  NzSelectModule, NzSpinModule,
  NzTableModule, NzTagModule, NzUploadModule
} from 'ng-zorro-antd';
const routes: Routes = [
    {
        path: 'create-quote',
        component: CreateQuoteComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'quotes-list',
        component: QuotesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'fire-quotes-list',
        component: FireQuotationsListComponent
    },
    {
        path: 'marine-quotes-list',
        component: MarineQuotationsListComponent
    },
    {
        path: 'engineering-quotes-list',
        component: EngineeringQuotationsListComponent
    },
    {
        path: 'accident-quotes-list',
        component: AccidentQuotationsListComponent
    },
    {
        path: 'quote-details/:quoteNumber',
        component: QuoteDetailsComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        QuotesComponent,
        CreateQuoteComponent,
        QuoteDetailsComponent,
        RiskDetailsComponent,
        QuoteComponent,
        QuoteDocumentComponent,
        DraftQuoteDocumentComponent,
        WarrantiesComponent,
        ClausesComponent,
        PerilsComponent,
        LimitsOfLiabilityComponent,
        VehicleDetailsComponent,
        DiscountsComponent,
        ExtensionsComponent,
        ExcessesComponent,
        PremiumComputationDetailsComponent,
        ViewRiskComponent,
        ExtensionsViewComponent,
        PremiumComputationComponent,
        TotalsViewComponent,
        DiscountsViewComponent,
        FleetUploadComponent,
        PropertyDetailsComponent,
        FirePremiumComputationDetailsComponent,
        FireQuotationsListComponent,
        AccidentQuotationsListComponent,
        AccidentPremiumComputationDetailsComponent,
        AccidentProductDetailsComponent,
        FireDraftQuoteDocumentComponent,
        PersonalAccidentComponent,
        ScheduleComponent,
        AccidentDraftQuotationComponent,
        MarinePremiumComputationDetailsComponent,
        MarineProductDetailsComponent,
        MarineQuotationsListComponent,
        MarineScheduleComponent,
        MarineCargoComponent,
        EngineeringPremiumComputationDetailsComponent,
        EngineeringProductDetailsComponent,
        EngineeringQuotationsListComponent,
        EngineeringScheduleDetailsComponent,
        EngineeringItemComponent,
        EngineeringDraftQuotationComponent,
        MarineDraftQuotationComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PdfViewerModule,
        HttpClientModule,
        RouterModule.forChild(routes),
        NgxPrintModule,
        NzDatePickerModule,
        NzFormModule,
        NzSelectModule,
        NzDividerModule,
        NzGridModule,
        NzCardModule,
        NzTableModule,
        NzModalModule,
        NzInputModule,
        NzCollapseModule,
        NzBreadCrumbModule,
        NzSpinModule,
        NzButtonModule,
        NzUploadModule,
        NzTagModule,
        NzPageHeaderModule,
        NzDescriptionsModule,
        NzBadgeModule,
      NzMessageModule
    ],
    exports: [
        QuotesComponent,
        CreateQuoteComponent,
        ViewRiskComponent,
        VehicleDetailsComponent,
        LimitsOfLiabilityComponent,
        DiscountsComponent,
        ExtensionsComponent,
        ExcessesComponent,
        PremiumComputationDetailsComponent,
        ExtensionsViewComponent,
        PremiumComputationComponent,
        TotalsViewComponent,
        DiscountsViewComponent,
        FleetUploadComponent
    ],
    providers: [
        QuotesService,
        VehicleDetailsComponent,
        PropertyDetailsComponent,
        PremiumComputationComponent,
        PremiumComputationDetailsComponent,
        TotalsViewComponent,
        ExtensionsComponent,
        DiscountsComponent,
        LimitsOfLiabilityComponent,
        ExcessesComponent,
        PremiumComputationService,
        VehicleDetailsServiceService,
        FireClassService,
        CreateQuoteComponent,
        PersonalAccidentComponent,
        AccidentProductDetailsComponent,
        MarineProductDetailsComponent,
        EngineeringProductDetailsComponent
    ]
})
export class QuotesModule {}
