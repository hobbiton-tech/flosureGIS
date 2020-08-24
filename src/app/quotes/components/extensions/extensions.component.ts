import { Component, OnInit, OnDestroy } from '@angular/core';
import { IExtension } from 'src/app/settings/models/underwriting/clause.model';
import { ClausesService } from 'src/app/settings/components/underwriting-setups/services/clauses.service';
import { LoadModel } from '../../models/quote.model';
import { PremiumComputationService } from '../../services/premium-computation.service';
import {
    ExtensionModel,
    IExtensionValueModel,
    IExtensions
} from '../../models/extensions.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-extensions',
    templateUrl: './extensions.component.html',
    styleUrls: ['./extensions.component.scss']
})
export class ExtensionsComponent implements OnInit, OnDestroy {
    extensionsTotalSubscription: Subscription;
    extensionsListChanges: Subscription;
    riskEditModeSubscription: Subscription;

    constructor(
        private productClauseService: ClausesService,
        private premiumComputationService: PremiumComputationService
    ) {
        this.extensionsTotalSubscription = this.premiumComputationService.extensionsTotalChanged$.subscribe(
            extensionsTotal => {
                this.extensionsTotal = extensionsTotal;
            }
        );
        this.extensionsListChanges = this.premiumComputationService.extensionsTotalChanged$.subscribe(
            extensions => {
                this.extensionList = this.premiumComputationService.getExtensions();
            }
        );
        this.riskEditModeSubscription = this.premiumComputationService.riskEditModeChanged$.subscribe(
            riskEditMode => {
                this.isRiskEditMode = riskEditMode;
            }
        );
    }

    // editing mode
    isRiskEditMode: boolean = true;

    // extension added to policy
    extensions: IExtensions[] = [];

    // extensions total
    extensionsTotal: number;

    // loading feedback
    computeExtensionIsLoading = false;

    // motor comprehensive loading options
    // motorComprehensiveloadingOptions = MotorComprehensiveLoadingOptions;
    motorComprehensiveloadingOptions = [];

    // motor third party loading options
    // motorThirdPartyloadingOptions = MotorThirdPartyLoadingOptions;
    motorThirdPartyloadingOptions = [];

    // selected value
    selectedValue = { label: 'Motor Comprehensive', value: 'Comprehensive' };

    // selected extension value
    selectedExtensionValue: IExtension;

    // extension list
    extensionList: IExtensions[] = [];

    // selected increase third party input type
    selectedIncreaseThirdPartyLimitInputTypeValue = 'amount';

    // increase third party amount
    increasedThirdPartyLimitAmount: number;

    // extension amount
    extensionAmount: number;

    // extension Rate
    extensionRate: number;

    // extension rate type
    extensionRateType: number;

    // extension value
    extensionValue: number;

    // extension input type (inititially amount. options: amount, rate)
    selectedExtensionInputTypeValue = 'amount';

    // extensions
    addingLoad: boolean;
    premiumLoadingTotal: number;

    increasedThirdPartyLimitsRate: number;
    increasedThirdPartyLimitsAmount: number;
    increasedThirdPartyLimitsRateType: string;
    increasedThirdPartyLimitValue: number;

    ngOnInit(): void {
        this.productClauseService.getExtensions().subscribe(res => {
            this.extensionList = res;
            this.motorComprehensiveloadingOptions = res;
            this.motorThirdPartyloadingOptions = res.filter(
                x => x.extensionType === 'increasedThirdPartyLimits'
            );
        });
    }

    computeIncreasedThirdPartyLimit() {}

    computeIncreasedThirdPartyLimitThirdParty() {}

    // computes extension and adds to extesions list
    computeExtension() {}

    // adds entered extesnion amount to extensions list
    addExtensionAmount() {
        this.computeExtensionIsLoading = true;

        setTimeout(() => {
            this.premiumComputationService.addExtension(
                this.selectedExtensionValue.heading,
                Number(this.extensionAmount)
            );

            this.computeExtensionIsLoading = false;
            this.selectedExtensionValue = null;
        }, 1000);
    }

    // changes the quote increase third party limit to inputed amount
    handleIncreasedThirdPartyLimitAmount() {
        // this.loads.push({
        //     loadType: this.selectedLoadingValue.description,
        //     amount: Number(this.increasedThirdPartyLimitAmount)
        // });
        // this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        // this.handleNetPremium();
    }

    // get extensions
    getExtensions() {
        const extensions: ExtensionModel = {
            selectedExtensionValue: this.selectedExtensionValue,
            extensions: this.extensionList,
            extensionsTotal: this.extensionsTotal
        };

        return extensions;
    }

    ngOnDestroy() {
        this.extensionsTotalSubscription.unsubscribe();
        this.extensionsListChanges.unsubscribe();
        this.riskEditModeSubscription.unsubscribe();
    }
}
