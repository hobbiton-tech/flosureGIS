import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductSetupsServiceService } from '../../services/product-setups-service.service';
import { IProduct, IClass } from '../../models/product-setups-models.model';
import { ActivatedRoute } from '@angular/router';
import { Class } from 'estree';
import { NzMessageService } from 'ng-zorro-antd';

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

    update: boolean = true;

    //product details form
    productForm: FormGroup;

    //classId
    classId: string;

    //ProductId
    productId: string;

    classesList: IClass[];

    selectedClass: IClass;

    constructor(
        private formBuilder: FormBuilder,
        private productSetupsService: ProductSetupsServiceService,
        private route: ActivatedRoute,
        private msg: NzMessageService
    ) {
        this.productForm = this.formBuilder.group({
            name: ['', Validators.required],
            code: ['', Validators.required],
            description: ['', Validators.required],
            policyNumberPrefix: ['', Validators.required],
            claimNumberPrefix: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(param => {
            this.classId = param.classId;
        });

        this.productSetupsService.getClasses().subscribe(classes => {
            this.classesList = classes;
        });
    }

    closeAddProductFormDrawer(): void {
        this.closeAddProductFormDrawerVisible.emit();
    }

    async addProduct(productDto: IProduct) {
        await this.productSetupsService
            .addProduct(productDto, this.selectedClass.id)
            .subscribe(
                res => {
                    this.msg.success('Product Added successfully');
                    this.closeAddProductFormDrawer();
                },
                err => {
                    this.msg.error('Failed to add product');
                }
            );
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

    reloadClasses() {
        this.productSetupsService.getClasses().subscribe(classes => {
            this.classesList = classes;
        });
    }
}
