import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { InsuranceClassHandlerService } from 'src/app/underwriting/services/insurance-class-handler.service';
import { AccidentClassService } from 'src/app/quotes/services/accident-class.service';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import { MarineClassService } from 'src/app/quotes/services/marine-class.service';
import { IMarineRiskDetailsModel } from 'src/app/quotes/models/marine-class/marine-risk-details.model';
import { PremiumComputationService } from 'src/app/quotes/services/premium-computation.service';

@Component({
  selector: 'app-marine-product-details',
  templateUrl: './marine-product-details.component.html',
  styleUrls: ['./marine-product-details.component.scss']
})
export class MarineProductDetailsComponent implements OnInit, OnDestroy {
  classHandlerSubscription: Subscription;
  marineProductDetailsSubscription: Subscription;
  riskEditModeSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private classHandler: InsuranceClassHandlerService,
    private marineClassService: MarineClassService,
    private premiumComputationService: PremiumComputationService
  ) {
    this.marineProductDetailsForm = this.formBuilder.group({
      riskProductId: ['', Validators.required],
      riskDescription: ['', Validators.required],
      subClass: ['', Validators.required]
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

    this.riskEditModeSubscription = this.premiumComputationService.riskEditModeChanged$.subscribe(
      riskEditMode => {
        this.isRiskEditMode = riskEditMode;
      }
    );

    this.marineProductDetailsSubscription = this.marineClassService.marineProductDetailsChanged$.subscribe(
      details => {
        if (details) {
          this.marineProductDetailsForm.patchValue(details);
        }
      }
    );
  }

  currentClass: IClass;

// class products
  productOptions;

// editing mode
  isRiskEditMode: boolean = true;

  marineProductDetailsForm: FormGroup;

  ngOnInit(): void {
    this.marineProductDetailsForm.valueChanges.subscribe(res => {
      this.marineClassService.changeMarineForm(
        this.marineProductDetailsForm.value
      );
    });
  }

  setMarineProductDetails(productDetails: IMarineRiskDetailsModel) {
    this.marineClassService.changeMarineProductDetailsForm(productDetails);
    this.marineProductDetailsForm.patchValue(productDetails);
  }

// editable fields
  changeToEditable() {
    if (this.isRiskEditMode) {
      this.marineProductDetailsForm.get('riskId').disable();
      this.marineProductDetailsForm.get('riskDescription').disable();
      this.marineProductDetailsForm.get('subClass').disable();
    } else {
      this.marineProductDetailsForm.get('riskId').enable();
      this.marineProductDetailsForm.get('riskDescription').enable();
      this.marineProductDetailsForm.get('subClass').enable();
    }
  }

  ngOnDestroy() {
    this.classHandlerSubscription.unsubscribe();
    this.marineProductDetailsSubscription.unsubscribe();
    this.riskEditModeSubscription.unsubscribe();
  }
}
