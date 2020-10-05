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
import { Claim, Subrogations } from '../../models/claim.model';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import { IServiceProviderQuote } from '../../models/service-provider-quote.model';
import { ISalvage } from '../../models/salvage.model';

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
    selectedRepairers: IServiceProviderQuote;
    subrogations: Subrogations;

    documentTitle = 'Loss Quantum Processing';

    lossQuantumForm: FormGroup;

    lossTypeOptions = [
        { label: 'Total Loss', value: 'Total Loss' },
        { label: 'Partial Loss', value: 'Partial Loss' }
    ];


  settlementTypeOptions = [
    { label: 'Repair', value: 'Repair' },
    { label: 'Reimbursement', value: 'Reimbursement' }
  ];


    selectedLossType = '';

    currentClaim: Claim;
    selectedSettlementType: any;
    salvage: ISalvage;
  claimUpdate: Claim;

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

        this.lossQuantumForm = this.formBuilder.group({
        lossType: [''],
        lossEstimate: ['', Validators.required],
        adjustedQuantum: ['', Validators.required],
        recommendation: ['', Validators.required],
        salvageReserve: [''],
        settlementType: ['', Validators.required],
        dischargeAmount: ['', Validators.required],
          selectedRepairer: [''],
      });
    }

    ngOnInit(): void {
      console.log('CLAIM><><><>', this.currentClaim);
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

        if (this.lossQuantumForm.get('lossType').value === 'Total Loss') {
          this.salvage = {
            bidStatus: 'Not Open',
            reserve: this.lossQuantumForm.controls.salvageReserve.value,
            salvageName: '',
            salvageNumber:  'etertre'
          };
        }

        if( this.currentClaim.subrogation ===  'Required') {
          this.subrogations = {
            status: 'Pending Invoice',
            amount: this.lossQuantumForm.get('dischargeAmount').value
          }
        }

        const lossQuantum: ILossQuantum = {
            ...this.lossQuantumForm.value,
            insuranceCompanies: this.insuranceCompanies,
            salvageReserve:
                this.lossQuantumForm.get('lossType').value === 'Total Loss'
                    ? this.lossQuantumForm.get('salvageReserve').value
                    : 0,
           selectedRepairer: this.lossQuantumForm.get('settlementType').value === 'Repair'
             ? this.lossQuantumForm.get('selectedRepairer').value
             : [],
          salvages:
            this.lossQuantumForm.get('lossType').value === 'Total Loss'
              ? this.salvage
              : {},
        };

        console.log('LQ:', lossQuantum);

      if( this.currentClaim.subrogation ===  'Required') {
        this.subrogations = {
          status: 'Pending Invoice',
          amount: this.lossQuantumForm.get('dischargeAmount').value
        }

        this.claimUpdate = {
          ...this.currentClaim,
          claimStatus: 'Processed',
          lossQuantum: lossQuantum,
          subrogations: this.subrogations
        };
      } else {
        this.claimUpdate = {
          ...this.currentClaim,
          claimStatus: 'Processed',
          lossQuantum: lossQuantum,
        };
      }

        // const claimUpdate: Claim = {
        //     ...this.currentClaim,
        //     claimStatus: 'Processed',
        //     lossQuantum: lossQuantum,
        //   subrogations: this.subrogations
        // };

        this.claimsService
            .updateClaim(this.currentClaim.id, this.claimUpdate)
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


  changeSelectedSettlementType(e) {
      this.selectedSettlementType = e;
  }

    ngOnDestroy() {
        this.claimSubscription.unsubscribe();
    }
}
