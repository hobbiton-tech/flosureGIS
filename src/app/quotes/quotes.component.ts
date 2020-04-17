import { Component, OnInit } from '@angular/core';
import { QuotesService } from './services/quotes.service';
import { MotorQuotationModel } from './models/quote.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-quotes',
    templateUrl: './quotes.component.html',
    styleUrls: ['./quotes.component.scss'],
})
export class QuotesComponent implements OnInit {
    quotesList: MotorQuotationModel[];
    displayQuotesList: MotorQuotationModel[];
    quotesCount = 0;

    searchString: string;

    constructor(private quoteServise: QuotesService, private router: Router) {}

    ngOnInit(): void {
        this.quoteServise.getQuotes().subscribe((quotes) => {
            this.quotesList = quotes;
            this.quotesCount = quotes.length;
            console.log('======= Quote List =======');
            console.log(this.quotesList);

            this.displayQuotesList = this.quotesList;
        });
    }

    viewDetails(quotation: MotorQuotationModel): void {
        this.router.navigateByUrl(
            '/flosure/quotes/quote-details/' + quotation.quoteNumber
        );
    }

    search(value: string): void {
        if (value === ' ' || !value) {
            this.displayQuotesList = this.quotesList;
        }

        this.displayQuotesList = this.quotesList.filter((quote) => {
            return (
                quote.quoteNumber.toLowerCase().includes(value.toLowerCase()) ||
                quote.clientCode.toLowerCase().includes(value.toLowerCase()) ||
                quote.startDate
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                quote.endDate
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                quote.status
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
            );
        });
    }

    onCreateQuoteClicked(): void {
        this.router.navigateByUrl('/flosure/quotes/create-quote');
    }
}
