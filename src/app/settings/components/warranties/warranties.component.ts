import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
    IClass,
    IProduct,
} from '../product-setups/models/product-setups-models.model';
import { IWarranty, IExclusion } from '../../models/underwriting/clause.model';
import { ProductSetupsServiceService } from '../product-setups/services/product-setups-service.service';
import { ClausesService } from '../underwriting-setups/services/clauses.service';
import { v4 } from 'uuid';

@Component({
    selector: 'app-warranties',
    templateUrl: './warranties.component.html',
    styleUrls: ['./warranties.component.scss'],
})
export class WarrantiesComponent implements OnInit {
    classesList: IClass[];
    productsList: IProduct[] = [];
    warrantiesList: IWarranty[] = [];
    exclusionsList: IExclusion[] = [];

    productClass: any;

    warrantyForm: FormGroup;
    exclusionForm: FormGroup;

    isWarrantyVisible: boolean = false;
    isExclusionVisible: boolean = false;

    selectedProductId: any;

    constructor(
        private formBuilder: FormBuilder,
        private productsService: ProductSetupsServiceService,
        private productClausesService: ClausesService
    ) {
        this.warrantyForm = formBuilder.group({
            heading: ['', Validators.required],
            description: ['', Validators.required],
        });

        this.exclusionForm = formBuilder.group({
            heading: ['', Validators.required],
            description: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.productsService.getClasses().subscribe((res) => {
            this.classesList = res;
        });

        this.productClausesService.getWarranty().subscribe((res) => {
            console.log(res);
            this.warrantiesList = res;
        });

        this.productClausesService.getExclusions().subscribe((res) => {
            this.exclusionsList = res;
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

    openWarranty(): void {
        this.isWarrantyVisible = true;
    }

    openExclusion(): void {
        this.isExclusionVisible = true;
    }

    closeWarranty(): void {
        this.isWarrantyVisible = false;
    }

    closeExclusion(): void {
        this.isExclusionVisible = false;
    }

    submitWarrantyForm() {
        const warranty: IWarranty = {
            ...this.warrantyForm.value,
            id: v4(),
            productId: this.selectedProductId,
        };
        this.productClausesService.addWarranty(warranty);
        this.isWarrantyVisible = false;
        this.warrantyForm.reset();
    }

    resetWarrantyForm() {
        this.warrantyForm.reset();
    }

    submitExclusionForm() {
        const exclusion: IExclusion = {
            ...this.exclusionForm.value,
            id: v4(),
            productId: this.selectedProductId,
        };
        this.productClausesService.addExclusion(exclusion);
        this.isExclusionVisible = false;
        this.exclusionForm.reset();
    }

    resetExclusionForm() {
        this.exclusionForm.reset();
    }
}
