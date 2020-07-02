import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { IPeril } from '../../models/product-setups-models.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddPerilService } from './services/add-peril.service';
import { v4 } from 'uuid';

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
        private perilsService: AddPerilService
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
        this.perilsService.addPeril(peril);
        this.closeAddPerilFormDrawerVisible.emit();
        this.perilForm.reset();
    }

    resetPerilForm() {
        this.perilForm.reset();
    }
}
