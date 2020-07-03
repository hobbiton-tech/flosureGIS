import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { v4 } from 'uuid';
import { AddCoverTypeService } from './services/add-cover-type.service';
import {ICoverType} from '../../models/product-setups-models.model';
                      

@Component({
    selector: 'app-add-cover-type',
    templateUrl: './add-cover-type.component.html',
    styleUrls: ['./add-cover-type.component.scss']
})
export class AddCoverTypeComponent implements OnInit {
    @Input()
    isAddCoverTypeFormDrawerVisible: boolean;

    @Input()
    selectedProductId: any;

    @Input() productName: any;

    @Output()
    closeAddCoverTypeFormDrawerVisible: EventEmitter<any> = new EventEmitter();
     
    coverTypeForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private addCoverTypeService: AddCoverTypeService
    ) {
        this.coverTypeForm = formBuilder.group({
                name: ['', Validators.required],
            description: ['', Validators.required],
        });   
    }

    ngOnInit(): void {}

    closeAddCoverTypeFormDrawer(): void {
        this.closeAddCoverTypeFormDrawerVisible.emit();
    }

    submitCoverTypeForm() {
        const coverType: ICoverType = {
            ...this.coverTypeForm.value,
            id: v4(),
            
        };
        this.addCoverTypeService.addCoverType(coverType);
        this.closeAddCoverTypeFormDrawerVisible.emit();
        this.coverTypeForm.reset();
    }
    
    resetCoverTypeForm() {
        this.coverTypeForm.reset();
    }

}
