import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
    IProduct,
    IClass,
} from '../product-setups/models/product-setups-models.model';
import { ProductSetupsServiceService } from '../product-setups/services/product-setups-service.service';
import {
    IExtension,
    ILimit,
    IExccess,
} from '../../models/underwriting/clause.model';
import { ClausesService } from '../underwriting-setups/services/clauses.service';
import { v4 } from 'uuid';

@Component({
    selector: 'app-extensions',
    templateUrl: './extensions.component.html',
    styleUrls: ['./extensions.component.scss'],
})
export class ExtensionsComponent implements OnInit {
    classesList: IClass[];
    productsList: IProduct[] = [];
    extensionList: IExtension[] = [];
    limitsList: ILimit[] = [];
    exccessesList: IExccess[] = [];

    productClass: any;

    extensionForm: FormGroup;
    limitForm: FormGroup;
    exccessForm: FormGroup;

    isExtensionsVisible: boolean = false;
    isLimitVisible: boolean = false;
    isExccessVisible: boolean = false;

    selectedProductId: any;

    constructor(
        private formBuilder: FormBuilder,
        private productsService: ProductSetupsServiceService,
        private productClausesService: ClausesService
    ) {
        this.extensionForm = formBuilder.group({
            heading: ['', Validators.required],
            description: ['', Validators.required],
        });

        this.limitForm = formBuilder.group({
            heading: ['', Validators.required],
            description: ['', Validators.required],
            amount: ['', Validators.required],
        });

        this.exccessForm = formBuilder.group({
            heading: ['', Validators.required],
            description: ['', Validators.required],
            amount: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.productsService.getClasses().subscribe((res) => {
            this.classesList = res;
        });

        this.productClausesService.getExtensions().subscribe((res) => {
            this.extensionList = res;
        });
        this.productClausesService.getLimits().subscribe((res) => {
            this.limitsList = res;
        });
        this.productClausesService.getExccesses().subscribe((res) => {
            this.exccessesList = res;
        });
    }

    onChange(value) {
        this.productsService.getProducts(value.id).subscribe((res) => {
            this.productsList = res;
        });
    }

    onSelectProduct(product) {
        this.selectedProductId = product.id;
    }

    openExtension(): void {
        this.isExtensionsVisible = true;
    }

    openLimit(): void {
        this.isLimitVisible = true;
    }

    openExccess(): void {
        this.isExccessVisible = true;
    }

    closeExtensions(): void {
        this.isExtensionsVisible = false;
    }

    closeLimit(): void {
        this.isLimitVisible = false;
    }

    closeExccess(): void {
        this.isExccessVisible = false;
    }

    submitExtensionForm() {
        const extension: IExtension = {
            ...this.extensionForm.value,
            id: v4(),
            productId: this.selectedProductId,
        };
        this.productClausesService.addExtension(extension);
        this.isExtensionsVisible = false;
    }
    resetExtensionForm(value) {}

    submitLimitForm() {
        const limit: ILimit = {
            ...this.limitForm.value,
            id: v4(),
            productId: this.selectedProductId,
        };
        this.productClausesService.addLimit(limit);
        this.isLimitVisible = false;
    }

    resetLimitForm(value) {}

    submitExccessForm() {
        const exccess: IExccess = {
            ...this.exccessForm.value,
            id: v4(),
            productId: this.selectedProductId,
        };
        this.productClausesService.addExccess(exccess);
        this.isExccessVisible = false;
    }

    resetExccessForm(value) {}
}
