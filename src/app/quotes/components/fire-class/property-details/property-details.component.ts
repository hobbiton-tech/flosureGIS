import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FireClassService } from 'src/app/quotes/services/fire-class.service';
import { PropertyDetailsModel } from 'src/app/quotes/models/fire-class/property-details.model';
import {
  RoofTypeOptions,
  CoverTypeOptions,
  RiskCategoryOptions,
  RiskSubClassOptions
} from 'src/app/quotes/selection-options';
import { Subscription } from 'rxjs';
import { InsuranceClassHandlerService } from 'src/app/underwriting/services/insurance-class-handler.service';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import { LocationService } from 'src/app/settings/components/location-setups/services/location.service';
import { IProvince } from 'src/app/settings/components/location-setups/models/province.model';
import { ICity } from 'src/app/settings/components/location-setups/models/city.model';
import { PremiumComputationService } from 'src/app/quotes/services/premium-computation.service';
import { ClausesService } from 'src/app/settings/components/underwriting-setups/services/clauses.service';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss']
})
export class PropertyDetailsComponent implements OnInit, OnDestroy {
  classHandlerSubscription: Subscription;
  propertyDetailsSubscription: Subscription;
  riskEditModeSubscription: Subscription;

  roofTypes = RoofTypeOptions;
  coverTypes = CoverTypeOptions;
  riskCategories = RiskCategoryOptions;
  riskSubClasses = RiskSubClassOptions;

  constructor(
    private formBuilder: FormBuilder,
    private fireClassService: FireClassService,
    private classHandler: InsuranceClassHandlerService,
    private locationService: LocationService,
    private premiumComputationService: PremiumComputationService,
    private productClausesService: ClausesService
  ) {
    this.propertyDetailsForm = this.formBuilder.group({
      propertyId: ['', Validators.required],
      propertyDescription: ['', Validators.required],
      subClass: ['', Validators.required],
      roofType: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      address: ['', Validators.required],
      propertyUse: ['', Validators.required]
    });

    this.classHandlerSubscription = this.classHandler.selectedClassChanged$.subscribe(
      currentClass => {
// this.currentClass = currentClass;
        this.currentClass = JSON.parse(
          localStorage.getItem('classObject')
        );
        this.productOptions = this.currentClass.products;

        console.log('CURRENT CLASS:=> ', this.currentClass.products);
      }
    );

    this.propertyDetailsSubscription = this.fireClassService.propertyDetailsChanged$.subscribe(
      property => {
        if (property) {
          this.propertyDetials = property;
          this.propertyDetailsForm.patchValue(property);
        }
      }
    );

    this.riskEditModeSubscription = this.premiumComputationService.riskEditModeChanged$.subscribe(
      riskEditMode => {
        this.isRiskEditMode = riskEditMode;
      }
    );
  }

  currentClass: IClass;

// class products
  productOptions;

// editing mode
  isRiskEditMode: boolean = true;

// property details form
  propertyDetailsForm: FormGroup;

  propertyDetials: PropertyDetailsModel;

  provinces: IProvince[] = [];
  cities: ICity[] = [];

  currentProvince: IProvince;

  currentProduct: string;

  ngOnInit(): void {
    this.propertyDetailsForm.valueChanges.subscribe(res => {
// console.log('form :=> ', this.propertyDetailsForm.value);
// this.propertyDetailsForm.patchValue(this.propertyDetials);
      this.fireClassService.changePropertyForm(
        this.propertyDetailsForm.value
      );
    });

    this.locationService.getProvinces().subscribe(provinces => {
      this.provinces = provinces;
      console.log('PROVINCES:=> ', provinces);
    });

    this.productClausesService.getExtensions().subscribe(extensions => {
      console.log('extensions :=> ', extensions);
    });
  }

// editable fields
  changeToEditable() {
    if (this.isRiskEditMode) {
      this.propertyDetailsForm.get('propertyId').disable();
      this.propertyDetailsForm.get('propertyDescription').disable();
      this.propertyDetailsForm.get('subClass').disable();
      this.propertyDetailsForm.get('roofType').disable();
      this.propertyDetailsForm.get('city').disable();
      this.propertyDetailsForm.get('province').disable();
      this.propertyDetailsForm.get('address').disable();
      this.propertyDetailsForm.get('propertyUse').disable();
    } else {
      this.propertyDetailsForm.get('propertyId').enable();
      this.propertyDetailsForm.get('propertyDescription').enable();
      this.propertyDetailsForm.get('subClass').enable();
      this.propertyDetailsForm.get('roofType').enable();
      this.propertyDetailsForm.get('city').enable();
      this.propertyDetailsForm.get('province').enable();
      this.propertyDetailsForm.get('address').enable();
      this.propertyDetailsForm.get('propertyUse').enable();
    }
  }

  handleProductChange() {
    this.currentProduct = this.propertyDetailsForm.get('subClass').value;
    this.premiumComputationService.changeCurrentProduct(
      this.propertyDetailsForm.get('subClass').value
    );
  }

  changeCities() {
    this.currentProvince = this.propertyDetailsForm.get('province').value;
    this.cities = this.currentProvince.cities;
    this.propertyDetailsForm.get('city').setValue(this.cities[0]);
  }

  setPropertyDetails(propertyDetails: PropertyDetailsModel) {
    this.fireClassService.changePropertyDetails(propertyDetails);
    this.propertyDetailsForm.patchValue(propertyDetails);
  }

  ngOnDestroy() {
    this.classHandlerSubscription.unsubscribe();
    this.propertyDetailsSubscription.unsubscribe();
    this.riskEditModeSubscription.unsubscribe();
  }
}
