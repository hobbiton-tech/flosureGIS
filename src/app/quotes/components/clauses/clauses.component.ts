import { Component, OnInit } from '@angular/core';
import { ClausesService } from 'src/app/settings/components/underwriting-setups/services/clauses.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
    IWording,
    IClause,
} from 'src/app/settings/models/underwriting/clause.model';

@Component({
    selector: 'app-clauses',
    templateUrl: './clauses.component.html',
    styleUrls: ['./clauses.component.scss'],
})
export class ClausesComponent implements OnInit {
    clauses: any[] = [];

    wordings: any[] = [];
    clauseList: any[] = [];

    selectedWordingValue: any[] = [];

    wordingList: any[] = [];

    selectedClauseValue: any[] = [];
    isWordingEditVisible: boolean = false;
    isClauseEditVisible: boolean = false;
    editWording: any;
    editClause: any;

    wordingForm: FormGroup;
    clauseForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private clausesService: ClausesService
    ) {
        this.wordingForm = formBuilder.group({
            heading: ['', Validators.required],
            description: ['', Validators.required],
        });
        this.clauseForm = formBuilder.group({
            heading: ['', Validators.required],
            clauseDetails: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.clausesService.getClauses().subscribe((res) => {
            this.clauseList = res;
        });

        this.clausesService.getWordings().subscribe((res) => {
            this.wordingList = res;
        });
    }

    onEditWording(value) {
        this.editWording = value;
        this.wordingForm.get('heading').setValue(this.editWording.heading);
        this.wordingForm
            .get('description')
            .setValue(this.editWording.description);
        this.isWordingEditVisible = true;
    }

    handleEditWordingOk() {
        this.editWording.heading = this.wordingForm.controls.heading.value;
        this.editWording.description = this.wordingForm.controls.description.value;

        const index = this.selectedWordingValue.indexOf(this.editWording);
        this.selectedWordingValue[index] = this.editWording;

        const wording: IWording = {
            ...this.wordingForm.value,
            id: this.editWording.id,
            productId: this.editWording.productId,
        };
        this.clausesService.updateWording(wording);

        this.isWordingEditVisible = false;
    }

    handleEditWordingCancel() {
        this.isWordingEditVisible = false;
    }

    onEditClause(value) {
        this.editClause = value;
        console.log('Edit clause>>>>>', this.editClause);

        this.clauseForm.get('heading').setValue(this.editClause.heading);
        this.clauseForm
            .get('clauseDetails')
            .setValue(this.editClause.clauseDetails);
        this.isClauseEditVisible = true;
    }

    handleEditClauseOk() {
        this.editClause.heading = this.clauseForm.controls.heading.value;
        this.editClause.clauseDetails = this.clauseForm.controls.clauseDetails.value;

        const index = this.selectedClauseValue.indexOf(this.editClause);
        this.selectedClauseValue[index] = this.editClause;

        const clause: IClause = {
            ...this.clauseForm.value,
            id: this.editClause.id,
            productId: this.editClause.productId,
        };
        console.log('Clause update>>>> ', clause);

        this.clausesService.updateClause(clause);
        this.isClauseEditVisible = false;
    }

    handleEditClauseCancel() {
        this.isClauseEditVisible = false;
    }
}
