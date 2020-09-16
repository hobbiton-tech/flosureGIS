import { Component, OnInit, OnDestroy } from '@angular/core';
import { AddPerilService } from 'src/app/settings/components/product-setups/components/add-peril/services/add-peril.service';
import { Subscription } from 'rxjs';
import { PremiumComputationService } from '../../services/premium-computation.service';
import { InsuranceClassHandlerService } from 'src/app/underwriting/services/insurance-class-handler.service';
import {
    IClass,
    IProduct
} from 'src/app/settings/components/product-setups/models/product-setups-models.model';

@Component({
    selector: 'app-perils',
    templateUrl: './perils.component.html',
    styleUrls: ['./perils.component.scss']
})
export class PerilsComponent implements OnInit, OnDestroy {
    currentProductSubscription: Subscription;
    classHandlerSubscription: Subscription;

    selectedPerilValue: any[] = [];
    perilList: any[] = [];

    constructor(
        private perilsService: AddPerilService,
        private premiumComputationService: PremiumComputationService,
        private classHandler: InsuranceClassHandlerService
    ) {
        // this.classHandlerSubscription = this.classHandler.selectedClassChanged$.subscribe(
        //     currentClass => {
        //         this.currentClass = JSON.parse(
        //             localStorage.getItem('classObject')
        //         );
        //         this.currentProducts = this.currentClass.products;
        //     }
        // );

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

    currentClass: IClass;
    currentClassName: string;
    currentProducts: IProduct[] = [];
    currentProduct: string;
    singleProduct: IProduct;

    ngOnInit(): void {
        this.currentClass = JSON.parse(localStorage.getItem('classObject'));
        this.currentProducts = this.currentClass.products;

        if (this.singleProduct) {
            this.perilsService.getPerils().subscribe(res => {
                console.log('perils:=>', res);
                this.perilList = res.filter(
                    x => x.productId == this.singleProduct.id
                );
                console.log('per:=>', this.perilList);
            });
        }
    }

    onEditPeril(value) {}

    ngOnDestroy() {
        // this.classHandlerSubscription.unsubscribe();
        this.currentProductSubscription.unsubscribe();
    }
}
