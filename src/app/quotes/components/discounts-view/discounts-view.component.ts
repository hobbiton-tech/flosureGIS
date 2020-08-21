import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiscountModel } from '../../models/quote.model';
import { Subscription } from 'rxjs';
import { PremiumComputationService } from '../../services/premium-computation.service';
import { IDiscounts } from '../../models/discounts.model';

@Component({
    selector: 'app-discounts-view',
    templateUrl: './discounts-view.component.html',
    styleUrls: ['./discounts-view.component.scss']
})
export class DiscountsViewComponent implements OnInit, OnDestroy {
    discountsListChanges: Subscription;

    constructor(private premiumComputationService: PremiumComputationService) {}

    // dicounts added
    discounts: IDiscounts[] = [];

    ngOnInit(): void {
        this.discountsListChanges = this.premiumComputationService.discountsTotalChanged$.subscribe(
            discounts => {
                this.discounts = this.premiumComputationService.getDiscounts();
            }
        );

        this.discounts = this.premiumComputationService.getDiscounts();
    }

    // removes selected discount
    removeDiscount(i: DiscountModel, e: MouseEvent): void {
        e.preventDefault();
        this.premiumComputationService.removeDiscount(i);
    }

    ngOnDestroy() {
        this.discountsListChanges.unsubscribe();
    }
}
