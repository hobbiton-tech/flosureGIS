import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotesComponent } from './quotes.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CreateQuoteComponent } from './components/create-quote/create-quote.component';
import { QuotationDetailsComponent } from './components/create-quote/stepper/quotation-details/quotation-details.component';
import { QuotationProductDetailsComponent } from './components/create-quote/stepper/quotation-product-details/quotation-product-details.component';
import { RiskDetailsComponent } from './components/create-quote/stepper/risk-details/risk-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StepperService } from 'src/app/quotes/services/stepper.service'
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [QuotesComponent, CreateQuoteComponent, QuotationDetailsComponent, QuotationProductDetailsComponent, RiskDetailsComponent],
    imports: [CommonModule, NgZorroAntdModule, FormsModule, ReactiveFormsModule, RouterModule],
    exports: [QuotesComponent, CreateQuoteComponent],
    providers: [StepperService]
})
export class QuotesModule {}
