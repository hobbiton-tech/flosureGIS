import { Component, OnInit } from '@angular/core';
import { IServiceProviderQuote } from '../../models/service-provider-quote.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Claim } from '../../models/claim.model';

@Component({
    selector: 'app-service-provider-quotations',
    templateUrl: './service-provider-quotations.component.html',
    styleUrls: ['./service-provider-quotations.component.scss']
})
export class ServiceProviderQuotationsComponent implements OnInit {
    isAddServiceProviderQuoteModalVisible: boolean = false;

    claim: Claim;

    serviceProviderQuotations: IServiceProviderQuote[];
    displayServiceProviderQuotations: IServiceProviderQuote[];

    constructor(
        private readonly route: Router,
        private router: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.router.data.subscribe(data => {
            this.claim = data.claim;
            this.serviceProviderQuotations = this.claim.serviceProviderRepairsQuotations;
            this.displayServiceProviderQuotations = this.serviceProviderQuotations;

            console.log('Q>>', this.displayServiceProviderQuotations);
        });
    }

    openNewServiceProviderQuotation() {
        console.log('button clicked');
        this.isAddServiceProviderQuoteModalVisible = true;
    }

    viewDocument(quote: IServiceProviderQuote) {
        window.open(quote.documentUpload[0].storageLink);
    }
}
