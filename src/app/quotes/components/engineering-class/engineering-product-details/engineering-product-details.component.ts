import { Component, OnInit, OnDestroy } from '@angular/core';
import { IEngineeringRiskDetailsModel } from 'src/app/quotes/models/engineering-class/engineering-risk-details.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import { InsuranceClassHandlerService } from 'src/app/underwriting/services/insurance-class-handler.service';
import { Subscription } from 'rxjs';
import { EngineeringClassService } from 'src/app/quotes/services/engineering-class.service';
import { PremiumComputationService } from 'src/app/quotes/services/premium-computation.service';

@Component({
  selector: 'app-engineering-product-details',
  templateUrl: './engineering-product-details.component.html',
  styleUrls: ['./engineering-product-details.component.scss']
})
export class EngineeringProductDetailsComponent implements OnInit, OnDestroy {
  classHandlerSubscription: Subscription;
  riskEditModeSubscription: Subscription;
  engineeringProductDetailSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private classHandler: InsuranceClassHandlerService,
    private engineeringClassService: EngineeringClassService,
    private premiumComputationService: PremiumComputationService
  ) {
    this.engineeringProductDetailsForm = this.formBuilder.group({
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

    this.engineeringProductDetailSubscription = this.engineeringClassService.engineeringProductDetailsChanged$.subscribe(
      details => {
        if (details) {
          this.engineeringProductDetailsForm.patchValue(details);
        }
      }
    );
  }

  currentClass: IClass;

// class products
  productOptions;

// editing mode
  isRiskEditMode = true;

  engineeringProductDetailsForm: FormGroup;

  ngOnInit(): void {
    this.engineeringProductDetailsForm.valueChanges.subscribe(res => {
      this.engineeringClassService.changeEngineeringForm(
        this.engineeringProductDetailsForm.value
      );
    });
  }

  setEngineeringProductDetails(productDetails: IEngineeringRiskDetailsModel) {
    this.engineeringClassService.changeEngineeringProductDetailsForm(
      productDetails
    );
    this.engineeringProductDetailsForm.patchValue(productDetails);
  }

// editable fields
  changeToEditable() {
    if (this.isRiskEditMode) {
      this.engineeringProductDetailsForm.get('riskId').disable();
      this.engineeringProductDetailsForm.get('riskDescription').disable();
      this.engineeringProductDetailsForm.get('subClass').disable();
    } else {
      this.engineeringProductDetailsForm.get('riskId').enable();
      this.engineeringProductDetailsForm.get('riskDescription').enable();
      this.engineeringProductDetailsForm.get('subClass').enable();
    }
  }

  ngOnDestroy() {
    this.classHandlerSubscription.unsubscribe();
    this.engineeringProductDetailSubscription.unsubscribe();
    this.riskEditModeSubscription.unsubscribe();
  }
}
