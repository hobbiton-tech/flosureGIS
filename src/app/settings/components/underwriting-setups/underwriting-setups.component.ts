import { Component, OnInit } from '@angular/core';
import {
    IProduct,
    IClass,
} from '../product-setups/models/product-setups-models.model';
import { ProductSetupsServiceService } from '../product-setups/services/product-setups-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
    IClause,
    IExtension,
    IWording,
} from '../../models/underwriting/clause.model';
import { ClausesService } from './services/clauses.service';
import { v4 } from 'uuid';

@Component({
    selector: 'app-underwriting-setups',
    templateUrl: './underwriting-setups.component.html',
    styleUrls: ['./underwriting-setups.component.scss'],
})
export class UnderwritingSetupsComponent implements OnInit {
    classesList: IClass[];
    clausesList: IClause[] = [];
    extensionList: IExtension[] = [];
    wordingList: IWording[] = [];

    clauseForm: FormGroup;
    extensionForm: FormGroup;
    wordingForm: FormGroup;
    clauses;

    clauseSubClassList = [];

    coverTypePremiumsList = [];
    coverTypesList = [];

    perilsList = [];
    perilsSubclassList = [];

    productsList: IProduct[] = [];
    productClass: any;

    isClausesVisible = false;
    isExtensionsVisible = false;
    isWordingsVisible = false;
    selectedProductId: any;

    constructor(
        private productsService: ProductSetupsServiceService,
        private formBuilder: FormBuilder,
        private productClauseService: ClausesService
    ) {
        this.clauseForm = formBuilder.group({
            heading: ['', Validators.required],
            clauseDetails: ['', Validators.required],
        });

        this.extensionForm = formBuilder.group({
            heading: ['', Validators.required],
            description: ['', Validators.required],
        });

        this.wordingForm = formBuilder.group({
            heading: ['', Validators.required],
            description: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.productsService.getClasses().subscribe((res) => {
            this.classesList = res;
        });

        this.productClauseService.getProducts().subscribe((res) => {
            console.log('YEEEEEEEE>>>>', res);
        });

        this.productClauseService.getClauses().subscribe((res) => {
            this.clausesList = res;
        });
        this.productClauseService.getExtensions().subscribe((res) => {
            this.extensionList = res;
        });
        this.productClauseService.getWordings().subscribe((res) => {
            this.wordingList = res;
        });
    }

    onChange(value) {
        console.log('WWWWWWWWWWW>>>>>>>>', value);
        this.productsService.getProducts(value.id).subscribe((res) => {
            console.log('YEEEEEEEE>>>>', res);

            this.productsList = res;
        });
    }

    onSelectProduct(product) {
        console.log('PEEEEEEEE>>>>', product);
        this.selectedProductId = product.id;
    }

    openClauses(): void {
        this.isClausesVisible = true;
    }
    openExtension(): void {
        this.isExtensionsVisible = true;
    }
    openWording(): void {
        this.isWordingsVisible = true;
    }

    closeClauses(): void {
        this.isClausesVisible = false;
    }

    closeWordings(): void {
        this.isWordingsVisible = false;
    }
    closeExtensions(): void {
        this.isExtensionsVisible = false;
    }

    submitClauseForm() {
        const clause: IClause = {
            ...this.clauseForm.value,
            id: v4(),
            productId: this.selectedProductId,
        };
        this.productClauseService.addClause(clause);
        console.log('DDDDDDDDDD>>>>>>>', clause);
        this.isClausesVisible = false;
    }
    resetClauseForm(value) {}

    submitExtensionForm() {
        const extension: IExtension = {
            ...this.extensionForm.value,
            id: v4(),
            productId: this.selectedProductId,
        };
        this.productClauseService.addExtension(extension);
        console.log('DDDDDDDDDD>>>>>>>', extension);
        this.isExtensionsVisible = false;
    }
    resetExtensionForm(value) {}

    submitWordingForm() {
        const wording: IWording = {
            ...this.wordingForm.value,
            id: v4(),
            productId: this.selectedProductId,
        };
        this.productClauseService.addWording(wording);
        console.log('DDDDDDDDDD>>>>>>>', wording);
        this.isWordingsVisible = false;
    }
    resetWordingForm(value) {}
}
