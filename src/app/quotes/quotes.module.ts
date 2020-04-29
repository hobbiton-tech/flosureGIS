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
import { QuotesGraphqlService } from './services/quotes.graphql.service';
import { QuoteComponent } from './documents/quote/quote.component';
import { QuoteDocumentComponent } from './documents/quote-document/quote-document.component';
import { QuoteCreationComponent } from './quote-creation/quote-creation.component';
import { PolicyDetailsComponent } from './components/policy-details/policy-details.component';
import { PolicyRiskDetailsComponent } from './components/policy-risk-details/policy-risk-details.component';
import { PolicyPremiumComputationComponent } from './components/policy-premium-computation/policy-premium-computation.component';
import { PolicyClausesComponent } from './components/policy-clauses/policy-clauses.component';
import { PolicyReviewComponent } from './components/policy-review/policy-review.component';
import { ProgressTracker } from './services/progress-tracker.service';

const routes: Routes = [
    {
        path: 'create-quote',
        component: QuoteCreationComponent,
        children: [
            {
                path: 'details',
                component: PolicyDetailsComponent,
                children: [
                    {
                        path: 'risks',
                        component: PolicyRiskDetailsComponent,
                        children: [
                            {
                                path: 'compute-premium',
                                component: PolicyPremiumComputationComponent,
                                children: [
                                    {
                                        path: 'clauses',
                                        component: PolicyClausesComponent,
                                        children: [
                                            {
                                                path: 'review',
                                                component: PolicyReviewComponent
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: 'quotes-list',
        component: QuotesComponent,
    },
    {
        path: 'quote-details/:quoteNumber',
        component: QuoteDetailsComponent,
    },
];

@NgModule({
    declarations: [
        QuotesComponent,
        CreateQuoteComponent,
        QuoteDetailsComponent,
        RiskDetailsComponent,
        QuoteComponent,
        QuoteDocumentComponent,
        QuoteCreationComponent,
        PolicyDetailsComponent,
        PolicyRiskDetailsComponent,
        PolicyPremiumComputationComponent,
        PolicyClausesComponent,
        PolicyReviewComponent,
    ],
    imports: [
        CommonModule,
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        PdfViewerModule,
        HttpClientModule,
        RouterModule.forChild(routes),
    ],
    exports: [QuotesComponent, CreateQuoteComponent],
    providers: [QuotesService, QuotesGraphqlService, ProgressTracker],
})
export class QuotesModule {}
