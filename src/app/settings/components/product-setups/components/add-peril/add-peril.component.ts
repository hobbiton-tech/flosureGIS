import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { IPeril } from '../../models/product-setups-models.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddPerilService } from './services/add-peril.service';
import { v4 } from 'uuid';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-add-peril',
    templateUrl: './add-peril.component.html',
    styleUrls: ['./add-peril.component.scss'],
})
export class AddPerilComponent implements OnInit {
    @Input()
    isAddPerilFormDrawerVisible: boolean;

    @Input()
    selectedProductId: any;

    @Input() productName: any;

    @Output()
    closeAddPerilFormDrawerVisible: EventEmitter<any> = new EventEmitter();

    perilForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private perilsService: AddPerilService,
        private message: NzMessageService,
    ) {
        this.perilForm = formBuilder.group({
            name: ['', Validators.required],
            type: ['', Validators.required],
            description: ['', Validators.required],
        });
    }

    ngOnInit(): void {}

    closeAddPerilFormDrawer(): void {
        this.closeAddPerilFormDrawerVisible.emit();
    }

    submitPerilForm() {
        const peril: IPeril = {
            ...this.perilForm.value,
            id: v4(),
            productId: this.selectedProductId,
        };
        this.perilsService.addPeril(peril).subscribe((mess) => {
          this.message.success('Peril Successfuly Created');
        },
          (err) => {
            this.message.warning('Peril Failed to Create');
            console.log(err);
          });

        this.closeAddPerilFormDrawerVisible.emit();
        this.perilForm.reset();
    }

    resetPerilForm() {
        this.perilForm.reset();
    }
}
