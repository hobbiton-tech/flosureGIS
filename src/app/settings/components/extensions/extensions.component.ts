import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
    IProduct,
    IClass
} from '../product-setups/models/product-setups-models.model';
import { ProductSetupsServiceService } from '../product-setups/services/product-setups-service.service';
import {
    IExtension,
    ILimit,
    IExccess
} from '../../models/underwriting/clause.model';
import { ClausesService } from '../underwriting-setups/services/clauses.service';
import { v4 } from 'uuid';
import { IExtensions } from 'src/app/quotes/models/extensions.model';

@Component({
    selector: 'app-extensions',
    templateUrl: './extensions.component.html',
    styleUrls: ['./extensions.component.scss']
})
export class ExtensionsComponent implements OnInit {
    classesList: IClass[];
    currentClass: IClass;
    productsList: IProduct[] = [];
    extensionList: IExtensions[] = [];
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
    selectedProduct: IProduct;
    vehicleType: any;

    constructor(
        private formBuilder: FormBuilder,
        private productsService: ProductSetupsServiceService,
        private productClausesService: ClausesService
    ) {
        this.extensionForm = formBuilder.group({
            heading: ['', Validators.required],
            description: ['', Validators.required]
        });

        this.limitForm = formBuilder.group({
            heading: ['', Validators.required],
            description: ['', Validators.required],
            amount: ['', Validators.required]
        });

        this.exccessForm = formBuilder.group({
            heading: ['', Validators.required],
            description: ['', Validators.required],
            amount: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.productsService.getClasses().subscribe(res => {
            this.classesList = res;
        });

        this.productClausesService.getExtensions().subscribe(res => {
            this.extensionList = res;
        });
        this.productClausesService.getLimits().subscribe(res => {
            this.limitsList = res;
        });
        this.productClausesService.getExccesses().subscribe(res => {
            this.exccessesList = res;
        });
    }

    onChange(value: IClass) {
        this.productsService.getClasses().subscribe(res => {
            this.classesList = res;
            this.currentClass = this.classesList.filter(
                x => x.className == value.className
            )[0];
            this.productsList = this.currentClass.products;
        });
    }

    vtypeChanged(value) {
        this.vehicleType = value;
    }

    onSelectProduct(product: IProduct) {
        console.log(product);
        this.selectedProduct = product;
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
            productId: this.selectedProductId
        };
        this.productClausesService.addExtension(extension);
        this.isExtensionsVisible = false;
        this.extensionForm.reset();
    }
    resetExtensionForm() {
        this.extensionForm.reset();
    }

    submitLimitForm() {
        const limit: ILimit = {
            ...this.limitForm.value,
            id: v4(),
            productId: this.selectedProductId
        };
        this.productClausesService.addLimit(limit);
        this.isLimitVisible = false;
        this.limitForm.reset();
    }

    resetLimitForm() {
        this.limitForm.reset();
    }

    submitExccessForm() {
        const exccess: IExccess = {
            ...this.exccessForm.value,
            id: v4(),
            product: this.selectedProduct,
            vehicleType: this.vehicleType
        };
        this.productClausesService.addExccess(exccess);
        this.isExccessVisible = false;
        this.exccessForm.reset();
    }

    resetExccessForm() {
        this.exccessForm.reset();
    }
}
