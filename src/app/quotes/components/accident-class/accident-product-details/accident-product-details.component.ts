import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InsuranceClassHandlerService } from 'src/app/underwriting/services/insurance-class-handler.service';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import { Subscription } from 'rxjs';
import { AccidentClassService } from 'src/app/quotes/services/accident-class.service';

@Component({
    selector: 'app-accident-product-details',
    templateUrl: './accident-product-details.component.html',
    styleUrls: ['./accident-product-details.component.scss']
})
export class AccidentProductDetailsComponent implements OnInit, OnDestroy {
    classHandlerSubscription: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private classHandler: InsuranceClassHandlerService,
        private accidentClassService: AccidentClassService
    ) {
        this.accidentProductDetailsForm = this.formBuilder.group({
            riskId: [
                { value: '', disabled: !this.isRiskEditMode },
                Validators.required
            ],
            riskDescription: [
                { value: '', disabled: !this.isRiskEditMode },
                Validators.required
            ],
            subClass: [
                { value: '', disabled: !this.isRiskEditMode },
                Validators.required
            ]
        });

        this.classHandlerSubscription = this.classHandler.selectedClassChanged$.subscribe(
            currentClass => {
                // this.currentClass = currentClass;
                this.currentClass = JSON.parse(
                    localStorage.getItem('classObject')
                );
                this.productOptions = this.currentClass.products;
            }
        );
    }

    currentClass: IClass;

    // class products
    productOptions;

    // editing mode
    isRiskEditMode: boolean = true;

    accidentProductDetailsForm: FormGroup;

    ngOnInit(): void {
        this.accidentProductDetailsForm.valueChanges.subscribe(res => {
            this.accidentClassService.changeAccidentProductDetailsForm(
                this.accidentProductDetailsForm.value
            );
        });
    }

    // editable fields
    changeToEditable() {
        if (this.isRiskEditMode) {
            this.accidentProductDetailsForm.get('riskId').disable();
            this.accidentProductDetailsForm.get('riskDescription').disable();
            this.accidentProductDetailsForm.get('subClass').disable();
        } else {
            this.accidentProductDetailsForm.get('riskId').enable();
            this.accidentProductDetailsForm.get('riskDescription').enable();
            this.accidentProductDetailsForm.get('subClass').enable();
        }
    }

    ngOnDestroy() {
        this.classHandlerSubscription.unsubscribe();
    }
}
