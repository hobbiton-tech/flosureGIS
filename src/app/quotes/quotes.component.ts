import { Component, OnInit } from '@angular/core';
import { QuotesService } from './services/quotes.service';
import { MotorQuotationModel } from './models/quote.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-quotes',
    templateUrl: './quotes.component.html',
    styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {
    quotesList: MotorQuotationModel[];
    quotesCount = 0;

    constructor(private quoteServise: QuotesService, private router: Router) {}

    ngOnInit(): void {
        this.quoteServise.getQoutes().subscribe(quotes => {
            this.quotesList = quotes;
            this.quotesCount = quotes.length;
            console.log('======= Qoute List =======');
            console.log(this.quotesList);
        });
    }

    viewDetails(quotation: MotorQuotationModel): void {
        this.router.navigateByUrl(
            '/flosure/quotes/quote-details/' + quotation.quoteNumber
        );
    }
}
