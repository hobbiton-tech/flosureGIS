import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductSetupsServiceService } from '../../services/product-setups-service.service';
import { IProduct } from '../../models/product-setups-models.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
    @Input()
    isAddProductFormDrawerVisible: boolean;

    @Output()
    closeAddProductFormDrawerVisible: EventEmitter<any> = new EventEmitter();

    //product details form
    productForm: FormGroup;

    //classId
    classId: string;

    //ProductId
    productId: string;

    constructor(
        private formBuilder: FormBuilder,
        private productSetupsService: ProductSetupsServiceService,
        private route: ActivatedRoute
    ) {
        this.productForm = this.formBuilder.group({
            productName: ['', Validators.required],
            productCode: ['', Validators.required],
            productDescription: ['', Validators.required],
            productPolicyNumberPrefix: ['', Validators.required],
            productClaimNumberPrefix: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(param => {
            this.classId = param.classId;
        });
    }

    closeAddProductFormDrawer(): void {
        this.closeAddProductFormDrawerVisible.emit();
    }

    async addProduct(productDto: IProduct) {
        await this.productSetupsService
            .addProduct(productDto, this.classId)
            .subscribe(res => {
                console.log(res);
            });
    }

    submitProduct() {
        for (let i in this.productForm.controls) {
            this.productForm.controls[i].markAsDirty();
            this.productForm.controls[i].updateValueAndValidity();
        }

        if (this.productForm.valid || !this.productForm.valid) {
            this.addProduct(this.productForm.value).then(res => {
                this.productForm.reset();
            });
        }
    }
}
