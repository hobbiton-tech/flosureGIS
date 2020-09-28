import { Component, OnInit } from '@angular/core';
import { ClaimsService } from '../../services/claims-service.service';
import {
    FormGroup,
    FormControl,
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { Claim } from '../../models/claim.model';
import {
    ICorporateClient,
    IIndividualClient
} from 'src/app/clients/models/clients.model';
import { Router } from '@angular/router';
import { ClaimSetupsService } from 'src/app/settings/components/claim-setups/services/claim-setups.service';
import { ClientsService } from 'src/app/clients/services/clients.service';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import { IClaimant } from '../../models/claimant.model';
import { NzMessageService } from 'ng-zorro-antd';
import { IClass, IPeril } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import { Subscription } from 'rxjs';
import { AddPerilService } from '../../../settings/components/product-setups/components/add-peril/services/add-peril.service';
import { PremiumComputationService } from '../../../quotes/services/premium-computation.service';
import { InsuranceClassHandlerService } from '../../../underwriting/services/insurance-class-handler.service';

@Component({
    selector: 'app-intimate-claim',
    templateUrl: './intimate-claim.component.html',
    styleUrls: ['./intimate-claim.component.scss']
})
export class IntimateClaimComponent implements OnInit {
    isAddClaimantModalVisible = false;
    claimIntimationIsLoading = false;
    intimatingClaimIsLoading = false;

    intimateClaimForm: FormGroup;

    perilsList: any[] = [];
    serviceProvidersList: any[] = [];
    clientList: Array<IIndividualClient & ICorporateClient>;
    displayClientList: Array<IIndividualClient & ICorporateClient>;
    policiesList: Policy[];
    displayPoliciesList: Policy[];
    risksList: RiskModel[];
    displayRisksList: RiskModel[];
    claimantsList: IClaimant[];
    displayClaimantsList: IClaimant[];

    selectedClient: IIndividualClient & ICorporateClient;

    serviceProviderClass: any;
    selectedType: any;

    claimNumber: string;

    currentClass: IClass;

  currentProductSubscription: Subscription;
  classHandlerSubscription: Subscription;

  selectedPerilValue: any[] = [];
  perilList: IPeril[] = [];
  perils: IPeril[] = [];


  claimantTypeOptions = [
        { label: 'INSURED', value: 'Insured' },
        { label: 'THIRD PARTY', value: 'Third Party' }
    ];

    selectedClaimantType = 'Insured';

    thirdPartyFaultOptions = [
        { label: 'AT FAULT', value: 'At Fault' },
        { label: 'NOT AT FAULT', value: 'Not At Fault' }
    ];

    thirdPartyInsuredOptions = [
        { label: 'INSURED', value: 'Insured' },
        { label: 'NOT INSURED', value: 'Not Insured' }
    ];
  searchString: string;
  columnAlignment = 'center';
  allChecked = false;
  indeterminate = true;

    constructor(
        private readonly route: Router,
        private readonly claimService: ClaimsService,
        private claimSetupsService: ClaimSetupsService,
        private formBuilder: FormBuilder,
        private readonly clientsService: ClientsService,
        private readonly claimsService: ClaimsService,
        private readonly policiesService: PoliciesService,
        private msg: NzMessageService,
        private perilsService: AddPerilService,
        private premiumComputationService: PremiumComputationService,
        private classHandler: InsuranceClassHandlerService
    ) {
        this.intimateClaimForm = this.formBuilder.group({
            client: ['', Validators.required],
            lossEstimate: ['', Validators.required],
            currency: [''],
          city: ['', Validators.required],
          road: ['', Validators.required],
          township: ['', Validators.required],
          country: ['', Validators.required],
            thirdPartyFault: ['', Validators.required],
            causation: ['', Validators.required],
            claimant: ['', Validators.required],
            policy: ['', Validators.required],
            risk: ['', Validators.required],
            thirdPartyInsured: ['', Validators.required],
            lossDate: ['', Validators.required],
          lossTime: ['', Validators.required],
            notificationDate: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.claimIntimationIsLoading = true;
        setTimeout(() => {
            this.claimIntimationIsLoading = false;
        }, 3000);

        this.policiesService.getPolicies().subscribe(policies => {
            this.policiesList = policies;
            this.displayPoliciesList = this.policiesList;
            console.log(this.policiesList);
        });

        this.claimService.getClaimants().subscribe(claimants => {
            this.claimantsList = claimants;
            this.displayClaimantsList = this.claimantsList;
        });

        this.clientsService.getAllClients().subscribe(clients => {
            this.clientList = [...clients[0], ...clients[1]] as Array<
                ICorporateClient & IIndividualClient
            >;
            this.displayClientList = this.clientList;
        });

        this.claimService.getClaims().subscribe(claims => {
            this.claimNumber = this.claimService.generateCliamID(claims.length);
        });

        this.perilsService.getPerils().subscribe((perils) => {
          this.perils = perils;
          this.perilList = this.perils;
          console.log('PErils>>>', this.perilList);
        });
    }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.perilList = this.perilList.map(item => {
        return {
          ...item,
          checked: true
        };
      });
    } else {
      this.perilList = this.perilList.map(item => {
        return {
          ...item,
          checked: false
        };
      });
    }
  }

  updateSingleChecked(value: IPeril): void {
    // if (value.che) {
    //   this.allChecked = false;
    //   this.indeterminate = false;
    // } else if (this.perilList.every(item => item.checked)) {
    //   this.allChecked = true;
    //   this.indeterminate = false;
    // } else {
    //   this.indeterminate = true;
    // }
  }

  changeSelectedClaimant(event: string) {
        console.log(event);
        this.selectedClaimantType = event;
    }

    getClaimants() {
        this.claimService.getClaimants().subscribe(claimants => {
            this.claimantsList = claimants;
            this.displayClaimantsList = this.claimantsList;
        });
    }

    onSubmit() {
        console.log(this.intimateClaimForm.value);
        const claim = this.intimateClaimForm.value as Claim;
        // claim.document = { url: '', name: '' };
        // this.claimService.addClaim(claim);
        this.intimateClaimForm.reset();
    }

    resetForm(e: MouseEvent): void {
        e.preventDefault();
        this.intimateClaimForm.reset();
    }

    backToTransactions() {
        this.route.navigateByUrl('/flosure/claims/claim-transactions');
    }

    onChangeProvider(value) {
        console.log('type>>', value);

        if (typeof value !== 'undefined') {
            this.selectedType = value.serviceProviderType;
        }
    }

    handleClientChange() {
        const client: IIndividualClient &
            ICorporateClient = this.intimateClaimForm.get('client').value;

        this.selectedClient = client;

        this.displayPoliciesList = this.policiesList.filter(
            x => x.clientCode === client.id
        );
        const policy = this.displayPoliciesList[0];
        this.intimateClaimForm.get('policy').setValue(policy);
        this.intimateClaimForm.get('risk').setValue(policy.risks[0]);
    }

    handleClaimantChange() {}

    handlePolicyChange(e) {
      console.log('Policy Target>>>', e);
      const policy = this.intimateClaimForm.get('policy').value;
      this.currentClass = policy.class;
      this.displayRisksList = policy.risks;
      this.intimateClaimForm.get('risk').setValue(policy.risks[0]);
      this.selectedClient = this.clientList.filter((x) => x.id === policy.clientCode)[0];

      this.intimateClaimForm.get('client').setValue(this.selectedClient);

      console.log('policy:=>', policy, this.selectedClient);
      console.log('class:=>', this.currentClass);
    }

    reloadClaimants() {
        this.claimService.getClaimants().subscribe(claimants => {
            this.claimantsList = claimants;
            this.displayClaimantsList = this.claimantsList;
        });
    }

    handleRiskChange() {}

    intimateClaim() {
        this.intimatingClaimIsLoading = true;

        const InsuredClaimant: IClaimant = {
            firstName:
                this.selectedClient.clientType === 'Individual'
                    ? this.selectedClient.firstName
                    : this.selectedClient.companyName,
            lastName:
                this.selectedClient.clientType === 'Individual'
                    ? this.selectedClient.lastName
                    : '',
            type: 'Insured',
            idNumber: this.selectedClient.idNumber,
            idType: this.selectedClient.idType,
            physicalAddress: this.selectedClient.address,
            phone: this.selectedClient.phone,
            email: this.selectedClient.email,
            gender: this.selectedClient.gender
        };

        const claim: Claim = {
            ...this.intimateClaimForm.value,
            claimant:
                this.selectedClaimantType === 'Third Party'
                    ? this.intimateClaimForm.get('claimant').value
                    : InsuredClaimant,
            claimNumber: this.claimNumber,
            claimStatus: 'Pending',
            claimDescription: '---',
            serviceProviderRepairsQuotations: [],
            photoUploads: [],
            documentUploads: [],
            isRequisitionRaised: false
        };

        this.claimService.createClaim(claim).subscribe(
            res => {
                console.log(res);
                this.msg.success('Claim Intimated');
                this.intimatingClaimIsLoading = false;
                this.route.navigateByUrl('/flosure/claims/claim-transactions');
            },
            err => {
                console.log(err);
                this.msg.error('Failed to intimate claim');
                this.intimatingClaimIsLoading = false;
            }
        );
    }

  search(value: string): void {
    if (value === '' || !value) {
      this.perilList = this.perils.filter(
        x => x.name != null
      );
    }

    this.perilList = this.perils.filter(peril => {
      if (peril.name != null) {
        return (
          peril.name
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          peril.description
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          peril.type
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      }
    });
  }
}
