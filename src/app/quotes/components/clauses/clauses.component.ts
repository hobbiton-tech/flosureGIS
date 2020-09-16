import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { ClausesService } from 'src/app/settings/components/underwriting-setups/services/clauses.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
    IWording,
    IClause
} from 'src/app/settings/models/underwriting/clause.model';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { PremiumComputationService } from '../../services/premium-computation.service';
import { InsuranceClassHandlerService } from 'src/app/underwriting/services/insurance-class-handler.service';
import {
    IClass,
    IProduct
} from 'src/app/settings/components/product-setups/models/product-setups-models.model';

@Component({
    selector: 'app-clauses',
    templateUrl: './clauses.component.html',
    styleUrls: ['./clauses.component.scss']
})
export class ClausesComponent implements OnInit, OnDestroy {
    currentProductSubscription: Subscription;
    classHandlerSubscription: Subscription;

    clauses: any[] = [];

    wordings: any[] = [];
    clauseList: any[] = [];

    selectedWordingValue: any[] = [];

    wordingList: any[] = [];

    selectedClauseValue: any[] = [];
    isWordingEditVisible: boolean = false;
    isClauseEditVisible: boolean = false;
    editWording: any;
    editClause: any;

    wordingForm: FormGroup;
    clauseForm: FormGroup;

    @Output() onClauseSelected: EventEmitter<any> = new EventEmitter();
    @Output() onWordingSelected: EventEmitter<any> = new EventEmitter();

    constructor(
        private formBuilder: FormBuilder,
        private clausesService: ClausesService,
        private premiumComputationService: PremiumComputationService,
        private classHandler: InsuranceClassHandlerService
    ) {
        this.wordingForm = formBuilder.group({
            heading: ['', Validators.required],
            description: ['', Validators.required]
        });
        this.clauseForm = formBuilder.group({
            heading: ['', Validators.required],
            clauseDetails: ['', Validators.required]
        });

        this.currentProductSubscription = this.premiumComputationService.currentProductChanges$.subscribe(
            currentProduct => {
                this.currentProduct = currentProduct;

                this.singleProduct = this.currentProducts.filter(
                    x => x.productName == this.currentProduct
                )[0];

                console.log('sp:=>', this.singleProduct);

                if (this.singleProduct) {
                    this.ngOnInit();
                }
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
            this.clausesService.getClauses().subscribe(res => {
                this.clauseList = res.filter(
                    x => x.productId == this.singleProduct.id
                );
            });

            this.clausesService.getWordings().subscribe(res => {
                this.wordingList = res.filter(
                    x => x.productId == this.singleProduct.id
                );
            });
        }
    }

    onEditWording(value) {
        this.editWording = value;
        this.wordingForm.get('heading').setValue(this.editWording.heading);
        this.wordingForm
            .get('description')
            .setValue(this.editWording.description);
        this.isWordingEditVisible = true;
    }

    handleEditWordingOk() {
        this.editWording.heading = this.wordingForm.controls.heading.value;
        this.editWording.description = this.wordingForm.controls.description.value;

        const index = this.selectedWordingValue.indexOf(this.editWording);
        this.selectedWordingValue[index] = this.editWording;

        const wording: IWording = {
            ...this.wordingForm.value,
            id: this.editWording.id,
            productId: this.editWording.productId
        };
        this.clausesService.updateWording(wording);

        this.isWordingEditVisible = false;
    }

    handleEditWordingCancel() {
        this.isWordingEditVisible = false;
    }

    onEditClause(value) {
        this.editClause = value;

        this.clauseForm.get('heading').setValue(this.editClause.heading);
        this.clauseForm
            .get('clauseDetails')
            .setValue(this.editClause.clauseDetails);
        this.isClauseEditVisible = true;
    }

    handleEditClauseOk() {
        this.editClause.heading = this.clauseForm.controls.heading.value;
        this.editClause.clauseDetails = this.clauseForm.controls.clauseDetails.value;

        const index = this.selectedClauseValue.indexOf(this.editClause);

        this.selectedClauseValue[index] = this.editClause;

        const clause: IClause = {
            ...this.clauseForm.value,
            id: this.editClause.id,
            productId: this.editClause.productId
        };

        this.clausesService.updateClause(clause);
        this.isClauseEditVisible = false;
    }

    handleEditClauseCancel() {
        this.isClauseEditVisible = false;
    }

    selectClause() {
        this.onClauseSelected.emit(this.selectedClauseValue);
    }

    selectWording() {
        this.onWordingSelected.emit(this.selectedWordingValue);
    }

    ngOnDestroy() {
        this.currentProductSubscription.unsubscribe();
        // this.classHandlerSubscription.unsubscribe();
    }
}
