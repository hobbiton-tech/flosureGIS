import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClausesService } from 'src/app/settings/components/underwriting-setups/services/clauses.service';
import { IExccess } from 'src/app/settings/models/underwriting/clause.model';
import { Excess, InsuranceType } from '../../models/quote.model';
import { ISelectedInsuranceType } from '../../models/premium-computations.model';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import { Subscription } from 'rxjs';
import { PremiumComputationService } from '../../services/premium-computation.service';
import { IExtensions } from '../../models/extensions.model';
import _ from 'lodash';

@Component({
    selector: 'app-excesses',
    templateUrl: './excesses.component.html',
    styleUrls: ['./excesses.component.scss']
})
export class ExcessesComponent implements OnInit, OnDestroy {
    insuranceTypeSubscription: Subscription;
    extensionsListChanges: Subscription;

    isEditExcessAmountModalVisible = false;

    constructor(
        private productClauseService: ClausesService,
        private premiumComputationService: PremiumComputationService
    ) {
        this.insuranceTypeSubscription = this.premiumComputationService.selectedInsuranceTypeChanged$.subscribe(
            insuranceType => {
                this.selectedInsuranceType = insuranceType;
                this.ngOnInit();
            }
        );

        this.extensionsListChanges = premiumComputationService.extensionsTotalChanged$.subscribe(
            extensions => {
                this.extensions = premiumComputationService.getExtensions();
                this.ngOnInit();
            }
        );
    }

    //  added extensions
    extensions: IExtensions[] = [];

    // selected insurance type value
    selectedInsuranceType = '';

    //Excess Variable
    tempExcessList: IExccess[] = [];
    excessList: IExccess[] = [];

    // current excess edit
    currentExcess: IExccess;

    newExcessAmount: string;
    newExcessDescription: string;

    // Current class
    currentClass: IClass;

    //excesses
    excesses: IExccess[] = [];

    excessTHP: IExccess[] = [];
    excessAct: IExccess[] = [];
    excessFT: IExccess[] = [];

    ngOnInit(): void {
        this.currentClass = JSON.parse(localStorage.getItem('classObject'));

        if (this.currentClass.className == 'Motor') {
            this.productClauseService.getExccesses().subscribe(res => {
                if (this.selectedInsuranceType) {
                    this.excessList = res.filter(
                        x => x.product.productName == this.selectedInsuranceType
                    );
                }
            });
        }

        if (this.currentClass.className == 'Fire') {
            this.extensions.forEach(extension => {
                const excess: IExccess = {
                    heading: extension.extensionType,
                    description: extension.extensionType,
                    amount: extension.amount.toString()
                };

                this.tempExcessList.push(excess);
                this.excessList = _.uniqBy(this.tempExcessList, 'heading');
            });
        }

        if (this.currentClass.className == 'Accident') {
            this.extensions.forEach(extension => {
                const excess: IExccess = {
                    heading: extension.extensionType,
                    description: extension.extensionType,
                    amount: extension.amount.toString()
                };

                this.tempExcessList.push(excess);
                this.excessList = _.uniqBy(this.tempExcessList, 'heading');
            });
        }
    }

    editExcess(ex: IExccess) {
        this.newExcessAmount = ex.amount;
        this.newExcessDescription = ex.description;

        this.isEditExcessAmountModalVisible = true;
        this.currentExcess = ex;
    }

    handleExcessEditOk() {
        const index = _.findIndex(this.excessList, {
            heading: this.currentExcess.heading
        });
        this.currentExcess.amount = this.newExcessAmount;
        this.currentExcess.description = this.newExcessDescription;

        this.excessList.splice(index, 1, this.currentExcess);
        this.excessList = this.excessList;
        this.isEditExcessAmountModalVisible = false;
    }

    getExcesses(selectedValue: string) {
        if (this.currentClass.className == 'Motor') {
            if (selectedValue === 'Comprehensive') {
                for (const ex of this.excessList) {
                    this.excesses.push({
                        heading: ex.heading,
                        description: ex.description,
                        amount: ex.amount
                    });
                }
                return this.excesses;
            } else {
                for (const exTHP of this.excessTHP) {
                    this.excesses.push({
                        heading: exTHP.heading,
                        description: exTHP.description,
                        amount: exTHP.amount
                    });
                }
                return this.excesses;
            }
        }
        if (this.currentClass.className == 'Fire') {
            for (const ex of this.excessList) {
                this.excesses.push({
                    heading: ex.heading,
                    description: ex.description,
                    amount: ex.amount
                });
            }

            return this.excesses;
        }

        if (this.currentClass.className == 'Accident') {
            for (const ex of this.excessList) {
                this.excesses.push({
                    heading: ex.heading,
                    description: ex.description,
                    amount: ex.amount
                });
            }

            return this.excesses;
        }
    }

    ngOnDestroy() {
        this.insuranceTypeSubscription.unsubscribe();
        this.extensionsListChanges.unsubscribe();
    }
}
