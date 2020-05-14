import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IClass } from '../../models/product-setups-models.model';
import { ProductSetupsServiceService } from '../../services/product-setups-service.service';

@Component({
    selector: 'app-add-class',
    templateUrl: './add-class.component.html',
    styleUrls: ['./add-class.component.scss']
})
export class AddClassComponent implements OnInit {
    @Input()
    isAddClassFormDrawerVisible: boolean;

    @Output()
    closeAddClassFormDrawerVisible: EventEmitter<any> = new EventEmitter();

    //class details form
    classForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private productSetupsService: ProductSetupsServiceService
    ) {
        this.classForm = this.formBuilder.group({
            className: ['', Validators.required],
            classCode: ['', Validators.required],
            classDescription: ['', Validators.required],
            classPolicyNumberPrefix: ['', Validators.required],
            classClaimNumberPrefix: ['', Validators.required]
        });
    }

    ngOnInit(): void {}

    closeAddClassFormDrawer(): void {
        this.closeAddClassFormDrawerVisible.emit();
    }

    async addClass(classDto: IClass) {
        await this.productSetupsService.addClass(classDto).subscribe(res => {
            console.log(res);
        });
    }

    submitClass() {
        for (let i in this.classForm.controls) {
            this.classForm.controls[i].markAsDirty();
            this.classForm.controls[i].updateValueAndValidity();
        }

        if (this.classForm.valid || !this.classForm.valid) {
            this.addClass(this.classForm.value).then(res => {
                this.classForm.reset();
            });
        }
    }
}
