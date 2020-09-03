import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Observer, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { VehicleBodyType } from '../../selection-options';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
    ValidationErrors
} from '@angular/forms';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { VehicleDetailsModel } from '../../models/vehicle-details.model';
import { BodyType } from '../../models/quote.model';
import { VehicleDetailsServiceService } from '../../services/vehicle-details-service.service';
import { PremiumComputationService } from '../../services/premium-computation.service';

@Component({
    selector: 'app-vehicle-details',
    templateUrl: './vehicle-details.component.html',
    styleUrls: ['./vehicle-details.component.scss']
})
export class VehicleDetailsComponent implements OnInit, OnDestroy {
    vehicleDetailsSubscription: Subscription;
    riskEditModeSubscription: Subscription;
    resetVehicleDetailsSubscription: Subscription;

    constructor(
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private policyService: PoliciesService,
        private vehicleDetailsService: VehicleDetailsServiceService,
        private premiumComputationService: PremiumComputationService
    ) {
        this.vehicleDetailsForm = this.formBuilder.group({
            vehicleMake: [
                { value: '', disabled: !this.isRiskEditMode },
                Validators.required
            ],
            vehicleModel: [
                { value: '', disabled: !this.isRiskEditMode },
                Validators.required
            ],
            yearOfManufacture: [
                { value: '', disabled: !this.isRiskEditMode },
                Validators.required
            ],
            regNumber: [
                { value: '', disabled: !this.isRiskEditMode },
                Validators.required,
                [this.regIDAsyncValidator]
            ],
            engineNumber: [
                { value: '', disabled: !this.isRiskEditMode },
                Validators.required,
                [this.engineIDAsyncValidator]
            ],
            chassisNumber: [
                { value: '', disabled: !this.isRiskEditMode },
                Validators.required,
                [this.chassisIDAsyncValidator]
            ],
            color: [
                { value: '', disabled: !this.isRiskEditMode },
                Validators.required
            ],
            cubicCapacity: [
                { value: '', disabled: !this.isRiskEditMode },
                Validators.required
            ],
            seatingCapacity: [
                { value: '', disabled: !this.isRiskEditMode },
                Validators.required
            ],
            bodyType: [
                { value: '', disabled: !this.isRiskEditMode },
                Validators.required
            ]
        });

        // this.vehicleDetailsSubscription = this.vehicleDetailsService.vehicleDetailsFormChanged$.subscribe(
        //     vehicleDetails => {
        //         this.vehicleDetailsForm.patchValue(vehicleDetails);
        //     }
        // );

        this.riskEditModeSubscription = this.premiumComputationService.riskEditModeChanged$.subscribe(
            riskEditMode => {
                this.isRiskEditMode = riskEditMode;
                this.changeToEditable();
            }
        );

        this.resetVehicleDetailsSubscription = this.premiumComputationService.resetVehicleDetailsChanged$.subscribe(
            vehicleDetailsReset => {
                this.resetVehicleDetails = vehicleDetailsReset;
                this.resetVehicleDetailsForm();
            }
        );
    }
    // vehicle details reset
    resetVehicleDetails: boolean = false;

    // editing mode
    isRiskEditMode: boolean = true;

    // vehicle details
    vehicleMake: string;
    vehicleModel: string;
    yearOfManufacture: string;
    regNumber: string;
    engineNumber: string;
    chassisNumber: string;
    color: string;
    cubicCapacity: string;
    seatingCapacity: string;
    bodyType: BodyType;

    // Vehicle body type
    vehicleBodyType = VehicleBodyType;

    //vehicle details form
    vehicleDetailsForm: FormGroup;

    //for vehicle details validation
    concRisks: any[] = [];

    // vehicle make drop down
    vehicleMakeUrl = 'https://api.randomuser.me/?results=5';
    searchChange$ = new BehaviorSubject('');
    vehicleMakeOptionList: string[] = [];
    selectedVehicleMake: string;
    isVehicleMakeLoading = false;

    // vehicle model drop down
    vehicleModelUrl = 'https://api.randomuser.me/?results=5';
    // searchChange$ = new BehaviorSubject('');
    vehicleModelOptionList: string[] = [];
    selectedVehicleModel: string;
    isVehicleModelLoading = false;

    ngOnInit(): void {
        this.vehicleDetailsForm.valueChanges.subscribe(res => {
            this.changeVehicleDetails();
        });

        this.policyService.getPolicies().subscribe(res => {
            for (const policy of res) {
                this.concRisks = this.concRisks.concat(policy.risks);
            }
        });
    }

    // editable fields
    changeToEditable() {
        if (this.isRiskEditMode) {
            this.vehicleDetailsForm.get('vehicleMake').disable();
            this.vehicleDetailsForm.get('vehicleModel').disable();
            this.vehicleDetailsForm.get('yearOfManufacture').disable();
            this.vehicleDetailsForm.get('regNumber').disable();
            this.vehicleDetailsForm.get('engineNumber').disable();
            this.vehicleDetailsForm.get('chassisNumber').disable();
            this.vehicleDetailsForm.get('color').disable();
            this.vehicleDetailsForm.get('cubicCapacity').disable();
            this.vehicleDetailsForm.get('seatingCapacity').disable();
            this.vehicleDetailsForm.get('bodyType').disable();
        } else {
            this.vehicleDetailsForm.get('vehicleMake').enable();
            this.vehicleDetailsForm.get('vehicleModel').enable();
            this.vehicleDetailsForm.get('yearOfManufacture').enable();
            this.vehicleDetailsForm.get('regNumber').enable();
            this.vehicleDetailsForm.get('engineNumber').enable();
            this.vehicleDetailsForm.get('chassisNumber').enable();
            this.vehicleDetailsForm.get('color').enable();
            this.vehicleDetailsForm.get('cubicCapacity').enable();
            this.vehicleDetailsForm.get('seatingCapacity').enable();
            this.vehicleDetailsForm.get('bodyType').enable();
        }
    }

    // vehicle make loading
    getVehicleMakeList = (name: string) =>
        this.http
            .get(`${this.vehicleMakeUrl}`)
            .pipe(map((res: any) => res.results))
            .pipe(
                map((list: any) => {
                    return list.map(() => `${name}`);
                })
            );

    vehicleMakeOptionList$: Observable<string[]> = this.searchChange$
        .asObservable()
        .pipe(debounceTime(500))
        .pipe(switchMap(this.getVehicleMakeList));

    // vehicle model loading
    getVehicleModelList = (name: string) =>
        this.http
            .get(`${this.vehicleModelUrl}`)
            .pipe(map((res: any) => res.results))
            .pipe(
                map((list: any) => {
                    return list.map(() => `${name}`);
                })
            );

    vehicleModelOptionList$: Observable<string[]> = this.searchChange$
        .asObservable()
        .pipe(debounceTime(500))
        .pipe(switchMap(this.getVehicleModelList));

    // vehicle make loading
    onVehicleMakeSearch(value: string): void {
        this.isVehicleMakeLoading = true;
        this.searchChange$.next(value);
    }

    // vehicle model loading
    onVehicleModelSearch(value: string): void {
        this.isVehicleModelLoading = true;
        this.searchChange$.next(value);
    }

    // Validate registration Number
    regIDAsyncValidator = (control: FormControl) =>
        new Observable((observer: Observer<ValidationErrors | null>) => {
            setTimeout(() => {
                this.policyService.getPolicies().subscribe(res => {
                    const activePolicy = res.filter(x => x.status === 'Active');

                    for (const policy of activePolicy) {
                        this.concRisks = this.concRisks.concat(policy.risks);
                    }

                    if (this.concRisks.length > 0) {
                        for (const reg of this.concRisks) {
                            if (control.value === reg.regNumber) {
                                observer.next({
                                    error: true,
                                    duplicated: true
                                });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }
                    } else {
                        observer.next(null);
                    }
                    observer.complete();
                });
            }, 1000);
        });

    // Validate Chassis Number
    chassisIDAsyncValidator = (control: FormControl) =>
        new Observable((observer: Observer<ValidationErrors | null>) => {
            setTimeout(() => {
                this.policyService.getPolicies().subscribe(res => {
                    const activePolicy = res.filter(x => x.status === 'Active');

                    for (const policy of activePolicy) {
                        this.concRisks = this.concRisks.concat(policy.risks);
                    }

                    if (this.concRisks.length > 0) {
                        for (const reg of this.concRisks) {
                            if (control.value === reg.chassisNumber) {
                                observer.next({
                                    error: true,
                                    duplicated: true
                                });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }
                    } else {
                        observer.next(null);
                    }
                    observer.complete();
                });
            }, 1000);
        });

    // Validate Engine Number
    engineIDAsyncValidator = (control: FormControl) =>
        new Observable((observer: Observer<ValidationErrors | null>) => {
            setTimeout(() => {
                this.policyService.getPolicies().subscribe(res => {
                    const activePolicy = res.filter(x => x.status === 'Active');

                    for (const policy of activePolicy) {
                        this.concRisks = this.concRisks.concat(policy.risks);
                    }

                    if (this.concRisks.length > 0) {
                        for (const reg of this.concRisks) {
                            if (control.value === reg.engineNumber) {
                                observer.next({
                                    error: true,
                                    duplicated: true
                                });
                                break;
                            } else {
                                observer.next(null);
                            }
                        }
                    } else {
                        observer.next(null);
                    }
                    observer.complete();
                });
            }, 1000);
        });

    changeVehicleMake() {
        this.vehicleDetailsService.changeVehicleMake(this.vehicleMake);
    }
    changeVehicleModel() {
        this.vehicleDetailsService.changeVehicleModel(this.vehicleModel);
    }
    changeYearOfManufacture() {
        this.vehicleDetailsService.changeYearOfManufacture(
            this.yearOfManufacture
        );
    }
    changeRegNumber() {
        this.vehicleDetailsService.changeRegNumber(this.regNumber);
    }
    changeEngineNumber() {
        this.vehicleDetailsService.changeEngineNumber(this.engineNumber);
    }
    changeChassisNumber() {
        this.vehicleDetailsService.changeChassisNumber(this.chassisNumber);
    }
    changeColor() {
        this.vehicleDetailsService.changeColor(this.color);
    }
    changeCubicCapacity() {
        this.vehicleDetailsService.changeCubicCapacity(this.cubicCapacity);
    }
    changeSeatingCapacity() {
        this.vehicleDetailsService.changeSeatingCapacity(this.seatingCapacity);
    }
    changeBodyType() {
        this.vehicleDetailsService.changeBodyType(this.bodyType);
    }

    changeVehicleDetails() {
        this.vehicleDetailsService.changeVehicleDetails(
            this.vehicleDetailsForm.value
        );
    }

    setVehicleDetails(vehicleDetails: VehicleDetailsModel) {
        this.vehicleDetailsService.changeVehicleDetails(vehicleDetails);
        this.vehicleDetailsForm.patchValue(vehicleDetails);
    }

    getVehicleDetailFormValidity() {
        return this.vehicleDetailsForm.valid;
    }

    resetVehicleDetailsForm() {
        if (this.resetVehicleDetails) {
            this.vehicleDetailsForm.get('vehicleMake').reset();
            this.vehicleDetailsForm.get('vehicleModel').reset();
            this.vehicleDetailsForm.get('yearOfManufacture').reset();
            this.vehicleDetailsForm.get('regNumber').reset();
            this.vehicleDetailsForm.get('engineNumber').reset();
            this.vehicleDetailsForm.get('chassisNumber').reset();
            this.vehicleDetailsForm.get('color').reset();
            this.vehicleDetailsForm.get('cubicCapacity').reset();
            this.vehicleDetailsForm.get('seatingCapacity').reset();
            this.vehicleDetailsForm.get('bodyType').reset();

            this.premiumComputationService.changeVehicleDetailsReset(false);
        }
    }

    ngOnDestroy() {
        // this.vehicleDetailsSubscription.unsubscribe();
        this.riskEditModeSubscription.unsubscribe();
        this.resetVehicleDetailsSubscription.unsubscribe();
    }
}
