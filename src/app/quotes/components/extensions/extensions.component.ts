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
import {
    IClass,
    IProduct
} from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import { InsuranceClassHandlerService } from 'src/app/underwriting/services/insurance-class-handler.service';

@Component({
    selector: 'app-extensions',
    templateUrl: './extensions.component.html',
    styleUrls: ['./extensions.component.scss']
})
export class ExtensionsComponent implements OnInit, OnDestroy {
    extensionsTotalSubscription: Subscription;
    extensionsListChanges: Subscription;
    riskEditModeSubscription: Subscription;
    classHandlerSubscription: Subscription;
    currentProductSubscription: Subscription;

    constructor(
        private productClauseService: ClausesService,
        private premiumComputationService: PremiumComputationService,
        private classHandler: InsuranceClassHandlerService
    ) {
        this.extensionsTotalSubscription = this.premiumComputationService.extensionsTotalChanged$.subscribe(
            extensionsTotal => {
                this.extensionsTotal = extensionsTotal;
                // this.ngOnInit();
            }
        );
        this.extensionsListChanges = this.premiumComputationService.extensionsTotalChanged$.subscribe(
            extensions => {
                this.extensionList = this.premiumComputationService.getExtensions();

                // this.ngOnInit();
            }
        );
        this.riskEditModeSubscription = this.premiumComputationService.riskEditModeChanged$.subscribe(
            riskEditMode => {
                this.isRiskEditMode = riskEditMode;
            }
        );

        this.classHandlerSubscription = this.classHandler.selectedClassChanged$.subscribe(
            currentClass => {
                this.currentClass = JSON.parse(
                    localStorage.getItem('classObject')
                );
                this.currentProducts = this.currentClass.products;

                this.ngOnInit();
            }
        );

        this.currentProductSubscription = this.premiumComputationService.currentProductChanges$.subscribe(
            currentProduct => {
                this.currentProduct = currentProduct;

                this.singleProduct = this.currentProducts.filter(
                    x => x.productName == this.currentProduct
                )[0];

                console.log('sp:=>', this.singleProduct);

                this.ngOnInit();
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
    extensionList = [];

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

    currentClass: IClass;
    currentClassName: string;
    currentProducts: IProduct[] = [];
    currentProduct: string;
    singleProduct: IProduct;

    ngOnInit(): void {
        // this.productClauseService.getExtensions().subscribe(res => {
        //     this.extensionList = res;
        //     console.log('there:=> ', res);
        //     this.motorComprehensiveloadingOptions = res;
        //     this.motorThirdPartyloadingOptions = res.filter(
        //         x => x.extensionType === 'increasedThirdPartyLimits'
        //     );
        // });

        if (this.singleProduct) {
            this.productClauseService.getExtensions().subscribe(ext => {
                this.extensionList = ext.filter(
                    x => x.productId === this.singleProduct.id
                );
            });
        }
    }

    loadExtensions() {
        if (this.singleProduct) {
            this.productClauseService.getExtensions().subscribe(ext => {
                this.extensionList = ext.filter(
                    x => x.productId === this.singleProduct.id
                );
            });
           console.log('AKAK',  this.extensionList);
        }
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
        this.currentProductSubscription.unsubscribe();
        this.classHandlerSubscription.unsubscribe();
    }
}
