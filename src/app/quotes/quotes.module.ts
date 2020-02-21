import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotesComponent } from './quotes.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CreateQuoteComponent } from './components/create-quote/create-quote.component';

@NgModule({
    declarations: [QuotesComponent, CreateQuoteComponent],
    imports: [CommonModule, NgZorroAntdModule],
    exports: [QuotesComponent, CreateQuoteComponent]
})
export class QuotesModule {}
