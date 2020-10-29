import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import { MotorQuotationModel } from 'src/app/quotes/models/quote.model';
import { QuotesService } from 'src/app/quotes/services/quotes.service';
import { Router } from '@angular/router';
import { InsuranceClassHandlerService } from 'src/app/underwriting/services/insurance-class-handler.service';

@Component({
    selector: 'app-marine-quotations-list',
    templateUrl: './marine-quotations-list.component.html',
    styleUrls: ['./marine-quotations-list.component.scss']
})
export class MarineQuotationsListComponent implements OnInit, OnDestroy {
    classHandlerSubscription: Subscription;

    currentClass: IClass;
    currentClassName: string;
    currentClassDisplay: string;

    quotesList: MotorQuotationModel[];
    displayQuotesList: MotorQuotationModel[];
    quotesCount = 0;
    isOkLoading = false;

    searchString: string;

    constructor(
        private quoteService: QuotesService,
        private router: Router,
        private classHandler: InsuranceClassHandlerService
    ) {
        this.classHandlerSubscription = this.classHandler.selectedClassChanged$.subscribe(
            currentClass => {
                this.currentClass = JSON.parse(
                    localStorage.getItem('classObject')
                );
                this.currentClassName = localStorage.getItem('class');

                if (currentClass) {
                    this.currentClassDisplay = currentClass.className;
                }
            }
        );
    }

    ngOnInit(): void {
        this.isOkLoading = true;
        // setTimeout(() => {
        //     this.isOkLoading = false;
        // }, 3000);

        this.quoteService.getMotorQuotations().subscribe(quotes => {
            this.quotesList = quotes;
            this.quotesCount = quotes.length;

            this.displayQuotesList = this.quotesList.filter(
                x => x.class.className == localStorage.getItem('class')
            );
            this.quotesCount = this.displayQuotesList.length;

            this.isOkLoading = false;
        });
    }

    viewDetails(quotation: MotorQuotationModel): void {
        this.router.navigateByUrl(
            '/flosure/quotes/quote-details/' +
                encodeURIComponent(quotation.quoteNumber)
        );
    }

    search(value: string): void {
        if (value === ' ' || !value) {
            this.displayQuotesList = this.quotesList;
        }

        this.displayQuotesList = this.quotesList.filter(quote => {
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

    ngOnDestroy() {
        this.classHandlerSubscription.unsubscribe();
    }
}