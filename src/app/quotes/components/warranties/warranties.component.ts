import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClausesService } from 'src/app/settings/components/underwriting-setups/services/clauses.service';
import {
    IWarranty,
    IExclusion,
} from 'src/app/settings/models/underwriting/clause.model';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'app-warranties',
    templateUrl: './warranties.component.html',
    styleUrls: ['./warranties.component.scss'],
})
export class WarrantiesComponent implements OnInit {
    selectedWarrantyValue: any[] = [];
    warrantyList: any[] = [];
    warranties: any[] = [];
    isWarrantyEditVisible: boolean = false;
    editWarranty: any;
    warrantyForm: FormGroup;

    selectedExclusionValue: any[] = [];
    exclusionList: any[] = [];
    exclusions: any[] = [];
    isExclusionEditVisible: boolean = false;
    editExclusion: any;
    exclusionForm: FormGroup;

    @Output() onWarrantySelected: EventEmitter<any> = new EventEmitter();
    @Output() onExclusionSelected: EventEmitter<any> = new EventEmitter();

    constructor(
        private formBuilder: FormBuilder,
        private clausesWarrantyService: ClausesService
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
        this.clausesWarrantyService.getWarranty().subscribe((res) => {
            this.warrantyList = res;
        });
        this.clausesWarrantyService.getExclusions().subscribe((res) => {
            this.exclusionList = res;
        });
    }

    onEditWarranty(value) {
        this.editWarranty = value;
        this.warrantyForm.get('heading').setValue(this.editWarranty.heading);
        this.warrantyForm
            .get('description')
            .setValue(this.editWarranty.description);
        this.isWarrantyEditVisible = true;
    }

    handleEditWarrantyOk() {
        this.editWarranty.heading = this.warrantyForm.controls.heading.value;
        this.editWarranty.description = this.warrantyForm.controls.description.value;

        const index = this.selectedWarrantyValue.indexOf(this.editWarranty);
        this.selectedWarrantyValue[index] = this.editWarranty;

        const warranty: IWarranty = {
            ...this.warrantyForm.value,
            id: this.editWarranty.id,
            productId: this.editWarranty.productId,
        };
        this.clausesWarrantyService.updateWarranty(warranty);

        this.isWarrantyEditVisible = false;
    }

    handleEditWarrantyCancel() {
        this.isWarrantyEditVisible = false;
    }

    onEditExclusion(value) {
        this.editExclusion = value;
        this.exclusionForm.get('heading').setValue(this.editExclusion.heading);
        this.exclusionForm
            .get('description')
            .setValue(this.editExclusion.description);
        this.isExclusionEditVisible = true;
    }

    handleEditExclusionOk() {
        this.editExclusion.heading = this.exclusionForm.controls.heading.value;
        this.editExclusion.description = this.exclusionForm.controls.description.value;

        const index = this.selectedExclusionValue.indexOf(this.editExclusion);
        this.selectedExclusionValue[index] = this.editExclusion;

        const exclusion: IExclusion = {
            ...this.exclusionForm.value,
            id: this.editExclusion.id,
            productId: this.editExclusion.productId,
        };
        this.clausesWarrantyService.updateExclusion(exclusion);

        this.isExclusionEditVisible = false;
    }

    handleEditExclusionCancel() {
        this.isExclusionEditVisible = false;
    }

    selectWarranty() {
        this.onWarrantySelected.emit(this.selectedWarrantyValue);
    }

    selectExclusion() {
        this.onExclusionSelected.emit(this.selectedExclusionValue);
    }
}
