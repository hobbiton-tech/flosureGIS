import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IClass } from '../../models/product-setups-models.model';
import { ProductSetupsServiceService } from '../../services/product-setups-service.service';
import { NzMessageService } from 'ng-zorro-antd';

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

    update: boolean = true;

    //class details form
    classForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private productSetupsService: ProductSetupsServiceService,
        private msg: NzMessageService
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
        this.closeAddClassFormDrawerVisible.emit(true);
    }

    async addClass(classDto: IClass) {
        await this.productSetupsService.addClass(classDto).subscribe(
            res => {
                this.msg.success('Class Added successfully');
                this.closeAddClassFormDrawer();
            },
            err => {
                this.msg.error('Failed to add class');
            }
        );
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
