import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotesComponent } from './quotes.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
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
const routes: Routes = [
    {
        path: 'create-quote',
        component: CreateQuoteComponent
    },
    {
        path: 'quotes-list',
        component: QuotesComponent
    },
    {
        path: 'quote-details/:quoteNumber',
        component: QuoteDetailsComponent
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
    ],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        PdfViewerModule,
        HttpClientModule,
        RouterModule.forChild(routes),
        NgxPrintModule,
        NzDatePickerModule
    ],
    exports: [QuotesComponent, CreateQuoteComponent],
    providers: [QuotesService]
})
export class QuotesModule {}
