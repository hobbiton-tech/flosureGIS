import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { RiskModel } from '../../models/quote.model';
import { VehicleDetailsServiceService } from '../../services/vehicle-details-service.service';
import { VehicleDetailsComponent } from '../vehicle-details/vehicle-details.component';
import { VehicleDetailsModel } from '../../models/vehicle-details.model';
import { PremiumComputationService } from '../../services/premium-computation.service';

@Component({
    selector: 'app-view-risk',
    templateUrl: './view-risk.component.html',
    styleUrls: ['./view-risk.component.scss']
})
export class ViewRiskComponent implements OnInit {
    @Input()
    isViewRiskModalVisible: boolean;

    @Input()
    riskData: RiskModel;

    @Output()
    closeViewRiskModal: EventEmitter<any> = new EventEmitter();

    @Output()
    saveRiskEmitter: EventEmitter<any> = new EventEmitter();

    @Input()
    isQuoteApproved: boolean;

    @Input()
    isExtension: boolean = false;

    constructor(
        private vehicleDetailsService: VehicleDetailsServiceService,
        private premiumComputationService: PremiumComputationService,
        private vehicleDetailsComponent: VehicleDetailsComponent
    ) {}

    riskComprehensiveForm: FormGroup;
    riskThirdPartyForm: FormGroup;

    // selected insurance type value
    selectedValue = { label: 'Motor Comprehensive', value: 'Comprehensive' };

    // risk details modal
    riskDetailsModalVisible = false;

    // Edit risk details
    isRiskDetailsEditmode = true;

    ngOnInit(): void {}

    //close view risk modal
    closeRiskDetails() {
        this.closeViewRiskModal.emit(true);
        this.vehicleDetailsService.resetVehicleDetails();
        this.premiumComputationService.resetRiskDetails();
    }

    // save risks changes after editing
    saveRisk(): void {
        this.saveRiskEmitter.emit(true);
        this.riskEditModeOff();
        this.riskExtensionModeOn();
    }

    // change edit mode
    riskEditModeOn() {
        this.premiumComputationService.changeRiskEditMode(false);
        this.isRiskDetailsEditmode = false;
    }

    riskEditModeOff() {
        this.premiumComputationService.changeRiskEditMode(true);
        this.isRiskDetailsEditmode = true;
    }

    riskExtensionModeOn() {
        this.premiumComputationService.changeExtensionMode(false);
    }

    riskExtensionModeOff() {
        this.premiumComputationService.changeExtensionMode(true);
    }
}
