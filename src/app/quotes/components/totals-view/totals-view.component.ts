import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
    AfterViewInit
} from '@angular/core';
import { PremiumComputationService } from '../../services/premium-computation.service';
import { Subscription } from 'rxjs';
import { ITotalsModel } from '../../models/totals.model';

@Component({
    selector: 'app-totals-view',
    templateUrl: './totals-view.component.html',
    styleUrls: ['./totals-view.component.scss']
})
export class TotalsViewComponent implements OnInit, OnDestroy {
    basicPremiumSubscription: Subscription;
    extensionsTotalSubscription: Subscription;
    discountsTotalSubscription: Subscription;
    levySubscription: Subscription;
    netPremiumSubscription: Subscription;

    // Basic Premium
    basicPremium: number;

    //extensions total
    extensionsTotal: number;

    // discount total
    discountsTotal: number;

    // Levy
    levyAmount: number;

    // Net or total premium
    totalPremium: number;
    netPremium: number;

    constructor(private premiumComputationService: PremiumComputationService) {
        this.basicPremiumSubscription = this.premiumComputationService.basicPremiumChanged$.subscribe(
            basicPremium => {
                this.basicPremium = basicPremium;
            }
        );
        this.extensionsTotalSubscription = this.premiumComputationService.extensionsTotalChanged$.subscribe(
            extensionsTotal => {
                this.extensionsTotal = extensionsTotal;
                console.log('extensions changed, listening from totals comp');
            }
        );
        this.discountsTotalSubscription = this.premiumComputationService.discountsTotalChanged$.subscribe(
            discountsTotal => {
                this.discountsTotal = discountsTotal;
            }
        );
        this.levySubscription = this.premiumComputationService.premiumLevyChanged$.subscribe(
            levyAmount => {
                this.levyAmount = levyAmount;
            }
        );
        this.netPremiumSubscription = this.premiumComputationService.netPremiumChanged$.subscribe(
            netPremium => {
                this.netPremium = netPremium;
            }
        );
    }

    ngOnInit(): void {}

    getTotals() {
        const totals: ITotalsModel = {
            basicPremium: this.basicPremium,
            premiumLevy: this.levyAmount,
            netPremium: this.netPremium
        };

        return totals;
    }

    setTotals(totals: ITotalsModel) {
        this.premiumComputationService.changeBasicPremium(totals.basicPremium);
        this.premiumComputationService.changeLevyAmount(totals.premiumLevy);
        this.premiumComputationService.changeNetPremium(totals.netPremium);
    }

    ngOnDestroy() {
        this.basicPremiumSubscription.unsubscribe();
        this.extensionsTotalSubscription.unsubscribe();
        this.discountsTotalSubscription.unsubscribe();
        this.levySubscription.unsubscribe();
        this.netPremiumSubscription.unsubscribe();
    }
}
