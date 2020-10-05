import { Component, OnInit } from '@angular/core';
import { ClaimsService } from '../../services/claims-service.service';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators, ValidationErrors
} from '@angular/forms';
import { Claim, Subrogation, ThirdPartyDetails } from '../../models/claim.model';
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
import { Observable, Observer, Subscription } from 'rxjs';
import { AddPerilService } from '../../../settings/components/product-setups/components/add-peril/services/add-peril.service';
import { PremiumComputationService } from '../../../quotes/services/premium-computation.service';
import { InsuranceClassHandlerService } from '../../../underwriting/services/insurance-class-handler.service';
import { AddThirdPartyDetailsComponent } from '../add-third-party-details/add-third-party-details.component';

@Component({
    selector: 'app-intimate-claim',
    templateUrl: './intimate-claim.component.html',
    styleUrls: ['./intimate-claim.component.scss']
})
export class IntimateClaimComponent implements OnInit {
    isAddClaimantModalVisible = false;
    claimIntimationIsLoading = false;
    intimatingClaimIsLoading = false;
   isAddThirdPartyDetailsModalVisible = false;

  thirdPartyDetailsState = false;

    intimateClaimForm: FormGroup;
  thirdPartyDetails: ThirdPartyDetails;


    perilsL: IPeril[] = [];
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
        { label: 'NONE', value: 'None' },
        { label: 'INSURED', value: 'Insured' },
       { label: 'THIRD PARTY', value: 'Third Party' }
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
        private classHandler: InsuranceClassHandlerService,
    ) {
        this.intimateClaimForm = this.formBuilder.group({
            client: ['', Validators.required],
            lossEstimate: ['', Validators.required],
            currency: [''],
          city: ['', Validators.required],
          road: ['', Validators.required],
          township: ['', Validators.required],
          country: ['', Validators.required, [this.territoryAsyncValidator]],
            thirdPartyFault: ['', Validators.required],
            causation: ['', Validators.required],
            claimant: ['', Validators.required],
            policy: ['', Validators.required],
            risk: ['', Validators.required],
            thirdPartyInsured: ['', Validators.required],
            lossDate: ['', Validators.required, [this.dateAsyncValidator]],
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
            console.log('What About You>>>', this.policiesList);
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


  dateAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {



              if (new Date(control.value).getTime() > new Date(this.intimateClaimForm.controls.policy.value.endDate).getTime()) {
                // you have to return `{error: true}` to mark it as an error event
                console.log('VALIDATOR>>>>', control.value, this.intimateClaimForm.controls.policy.value.endDate);
                observer.next({
                  error: true,
                  duplicated: true,
                });
              } else {
                observer.next(null);
              }
              observer.complete();
      }, 1000);
    })


  territoryAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {



        if (this.capitalize(control.value) !== 'Zambia') {
          // you have to return `{error: true}` to mark it as an error event
          const teritorialExt = this.intimateClaimForm.controls.risk.value.extensions.find((el) => el.extensionType === 'Territorial Extension');

          if (this.intimateClaimForm.controls.risk.value.extensions.length !== 0 && teritorialExt !== undefined) {
            observer.next(null);
          } else {
            observer.next({
              error: true,
              duplicated: true,
            });
          }
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    })


  capitalize(s) {
    return s.toLowerCase().replace( /\b./g, function(a) { return a.toUpperCase(); } );
  }

  getThirdPartyDetails(e) {
    this.thirdPartyDetails = {...e};
  }
  checkAll(ev) {
    this.perilList.forEach(x => x.checked = ev.target.checked);

    if (ev.target.checked) {
      this.perilsL = [...this.perilList];
    } else if (!ev.target.checked) {
      this.perilsL = [];
    }

    console.log('ALL CHECKED>>>>', this.perilsL, ev.target.checked);
  }

  isAllChecked() {
    return this.perilList.every(_ => _.checked);
  }

  updateChecked(e: IPeril, c): void {

      if (c) {
        this.perilsL = [...this.perilsL, ...[e]];
      } else if (!c) {
        this.perilsL = this.perilsL.filter((el) => el !== e);
      }
      console.log('WEWE>>>', this.perilsL);
  }


  handlePartyToBlame(e) {
    window.scroll(0, 0);
    if (e === 'Insured' || e === 'Third Party') {
      this.thirdPartyDetailsState = true;
    } else {
      this.thirdPartyDetailsState = false;
    }
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

    // handlePolicyChange() {
    //
    //   const policy = this.intimateClaimForm.get('policy').value;
    //   this.currentClass = policy.class;
    //   this.displayRisksList = this.intimateClaimForm.controls.policy.value.risks;
    //   this.intimateClaimForm.get('risk').setValue(this.displayRisksList[0]);
    //   this.selectedClient = this.clientList.filter((x) => x.id === policy.clientCode)[0];
    //
    //   this.intimateClaimForm.get('client').setValue(this.selectedClient);
    //
    //   console.log('policy:=>', policy, this.selectedClient, this.displayRisksList[0]);
    //   console.log('class:=>', this.currentClass);
    // }
    onPolicyChange() {
      const policy = this.intimateClaimForm.get('policy').value;
      this.currentClass = policy.class;
      this.displayRisksList = policy.risks;
      this.intimateClaimForm.get('risk').setValue(this.intimateClaimForm.controls.policy.value.risks[0]);
      this.selectedClient = this.clientList.find((x) => x.id === policy.clientCode);
      console.log('class:=>', this.selectedClient, policy);
      // this.intimateClaimForm.get('client').setValue(this.selectedClient);
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
        let subrogationState: Subrogation;

        if ( this.intimateClaimForm.controls.thirdPartyFault.value === 'Third Party') {
          subrogationState = 'Required';
        } else {
          subrogationState = 'NA';
        }

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
            isRequisitionRaised: false,
          claimPerils: this.perilsL,
          thirdPartyDetails: this.thirdPartyDetails,
          subrogation: subrogationState
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
