import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnDestroy
} from '@angular/core';
import { IInsuranceCompany } from '../../models/insurance-company.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimsService } from '../../services/claims-service.service';
import { ILossQuantum } from '../../models/loss-quantum.model';
import { Subscription } from 'rxjs';
import { Claim } from '../../models/claim.model';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-loss-quantum-modal',
    templateUrl: './loss-quantum-modal.component.html',
    styleUrls: ['./loss-quantum-modal.component.scss']
})
export class LossQuantumModalComponent implements OnInit, OnDestroy {
    isProcessing: boolean = false;

    claimSubscription: Subscription;

    @Input()
    isLossQuantumModalVisible: boolean;

    @Input()
    lossEstimate: number;

    @Output()
    closeLossQuantumModalEmitter: EventEmitter<any> = new EventEmitter();

    insuranceCompanies: IInsuranceCompany[] = [];
    selectedInsuranceCompanies: IInsuranceCompany[] = [];

    documentTitle: string = 'Loss Quantum Processing';

    lossQuantumForm: FormGroup;

    lossTypeOptions = [
        { label: 'Total Loss', value: 'Total Loss' },
        { label: 'Partial Loss', value: 'Partial Loss' }
    ];

    selectedLossType = '';

    currentClaim: Claim;

    constructor(
        private msg: NzMessageService,
        private formBuilder: FormBuilder,
        private claimsService: ClaimsService,
        private claimProcessingService: ClaimsProcessingServiceService
    ) {
        this.claimSubscription = this.claimProcessingService.claimChanged$.subscribe(
            claim => {
                this.currentClaim = claim;
            }
        );
    }

    ngOnInit(): void {
        this.lossQuantumForm = this.formBuilder.group({
            lossType: [''],
            lossEstimate: ['', Validators.required],
            adjustedQuantum: ['', Validators.required],
            recommendation: ['', Validators.required],
            salvageReserve: ['']
        });

        this.lossQuantumForm
            .get('lossEstimate')
            .setValue(this.currentClaim.lossEstimate);

        this.claimsService
            .getInsuranceCompanies()
            .subscribe(insuranceCompanies => {
                this.insuranceCompanies = insuranceCompanies;
            });
    }

    changeSelectedLossType(value) {
        console.log(value);
        this.selectedLossType = value;
    }

    closeLossQuantumModal() {
        this.closeLossQuantumModalEmitter.emit(true);
    }

    changeSelectedCompaniesList() {
        console.log('selected companies', this.selectedInsuranceCompanies);
    }

    processClaim() {
        this.isProcessing = true;

        const lossQuantum: ILossQuantum = {
            ...this.lossQuantumForm.value,
            insuranceCompanies: this.insuranceCompanies,
            salvageReserve:
                this.lossQuantumForm.get('lossType').value == 'Total Loss'
                    ? this.lossQuantumForm.get('salvageReserve').value
                    : 0
        };

        console.log('LQ:', lossQuantum);

        const claimUpdate: Claim = {
            ...this.currentClaim,
            claimStatus: 'Processed',
            lossQuantum: lossQuantum
        };

        this.claimsService
            .updateClaim(this.currentClaim.id, claimUpdate)
            .subscribe(
                res => {
                    console.log('res:', res);
                    this.isProcessing = false;
                    this.closeLossQuantumModal();
                    this.isLossQuantumModalVisible = false;
                    this.msg.success('Claim Processed');
                },
                err => {
                    console.log(err);
                    this.isProcessing = false;
                    this.isLossQuantumModalVisible = false;
                    this.msg.error('Failed to Process Claim');
                }
            );
    }

    ngOnDestroy() {
        this.claimSubscription.unsubscribe();
    }
}
