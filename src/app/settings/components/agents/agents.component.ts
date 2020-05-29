import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IAgent, IBroker, ISalesRepresentative } from './models/agents.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgentsService } from './services/agents.service';
import {
    IClass,
    IProduct
} from '../product-setups/models/product-setups-models.model';
import { ProductSetupsServiceService } from '../product-setups/services/product-setups-service.service';
import { CommisionSetupsService } from './services/commision-setups.service';
import { ICommissionSetup } from './models/commission-setup.model';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-agents',
    templateUrl: './agents.component.html',
    styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {
    addAgentsFormDrawerVisible = false;
    intermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;
    displayIntermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;

    selectedIntermediary: IAgent & IBroker & ISalesRepresentative;

    addProductCommissionFormDrawerVisible = false;

    intermediaryUpdate = new BehaviorSubject<boolean>(false);
    commissionUpdate = new BehaviorSubject<boolean>(false);

    //edit table commission setup form
    isEditmode = false;

    //commission setupsform
    commissionSetupForm: FormGroup;

    totalIntermediaries = 0;
    agents: IAgent[];
    totalAgents = 0;
    broker: IBroker[];
    totalBrokers = 0;
    salesRepesentertives: ISalesRepresentative[];
    totalSalesRepresentatives = 0;

    commissionsList: ICommissionSetup[] = [];
    displayCommissionList: ICommissionSetup[] = [];

    //filtered commission list based on intermediary name
    intermediaryNameCommissionList: ICommissionSetup[] = [];

    classesList: IClass[] = [];
    productsList: IProduct[] = [];

    //selected class
    selectedClass: IClass;

    //single class
    singleClass: IClass;

    //selected commission setup
    selectedCommissionSetup: ICommissionSetup;

    selectedProduct: IProduct;

    sourceOfBusinessOptions = [
        { label: 'Direct', value: 'Direct' },
        { label: 'Broker', value: 'Broker' },
        { label: 'Agent', value: 'Agent' },
        { label: 'Sales Representative', value: 'Sales Representative' }
    ];

    constructor(
        private readonly router: Router,
        private formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private productSetupsService: ProductSetupsServiceService,
        private commissionSetupsService: CommisionSetupsService,
        private agentService: AgentsService,
        private msg: NzMessageService
    ) {
        this.commissionSetupForm = this.formBuilder.group({
            intermediaryName: ['', Validators.required],
            intermediaryType: ['', Validators.required],
            productClass: ['', Validators.required],
            productName: ['', Validators.required],
            commission: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.agentService.getAllIntermediaries().subscribe(intermediaries => {
            this.totalAgents = intermediaries[0].length;
            this.totalBrokers = intermediaries[1].length;
            this.totalSalesRepresentatives = intermediaries[2].length;

            this.intermediariesList = [
                ...intermediaries[0],
                ...intermediaries[1],
                ...intermediaries[2]
            ] as Array<IAgent & IBroker & ISalesRepresentative>;
            this.displayIntermediariesList = this.intermediariesList;

            this.totalIntermediaries = this.intermediariesList.length;
        });

        this.intermediaryUpdate.subscribe(update =>
            update === true
                ? this.agentService
                      .getAllIntermediaries()
                      .subscribe(intermediaries => {
                          this.totalAgents = intermediaries[0].length;
                          this.totalBrokers = intermediaries[1].length;
                          this.totalSalesRepresentatives =
                              intermediaries[2].length;

                          this.intermediariesList = [
                              ...intermediaries[0],
                              ...intermediaries[1],
                              ...intermediaries[2]
                          ] as Array<IAgent & IBroker & ISalesRepresentative>;
                          this.displayIntermediariesList = this.intermediariesList;

                          this.totalIntermediaries = this.intermediariesList.length;
                      })
                : ''
        );

        this.productSetupsService.getClasses().subscribe(classes => {
            this.classesList = classes;
        });

        this.commissionSetupsService
            .getCommissionSetups()
            .subscribe(commissions => {
                this.commissionsList = commissions;
            });

        this.commissionUpdate.subscribe(update =>
            update === true
                ? this.commissionSetupsService
                      .getCommissionSetups()
                      .subscribe(commissions => {
                          this.commissionsList = commissions;
                          this.displayCommissionList = this.commissionsList.filter(
                              x =>
                                  x.intermediaryName ==
                                      this.selectedIntermediary.companyName ||
                                  x.intermediaryName ==
                                      this.selectedIntermediary
                                          .contactFirstName +
                                          ' ' +
                                          this.selectedIntermediary
                                              .contactLastName
                          );
                      })
                : ''
        );
    }

    changeSelectedIntermediary(
        intermediary: IAgent & IBroker & ISalesRepresentative
    ) {
        this.selectedIntermediary = intermediary;
        this.filterCommissionList();
        // this.loadProducts();

        this.commissionSetupForm
            .get('intermediaryName')
            .setValue(
                this.selectedIntermediary.companyName
                    ? this.selectedIntermediary.companyName
                    : this.selectedIntermediary.contactFirstName +
                          ' ' +
                          this.selectedIntermediary.contactLastName
            );
        this.commissionSetupForm
            .get('intermediaryType')
            .setValue(this.selectedIntermediary.intermediaryType);
        // this.commissionSetupForm.get('productClass').setValue(null);
        // this.commissionSetupForm.get('productName').setValue(null);
        this.commissionSetupForm.get('commission').setValue('');
    }

    changeSelectedCommission(commissionSetup: ICommissionSetup) {
        this.selectedCommissionSetup = commissionSetup;

        //fill commission form
        // this.commissionSetupForm
        //     .get('intermediaryName')
        //     .setValue(this.selectedCommissionSetup.intermediaryName);
        // this.commissionSetupForm
        //     .get('intermediaryType')
        //     .setValue(this.selectedCommissionSetup.intermediaryType);
        this.commissionSetupForm
            .get('productClass')
            .setValue(this.selectedCommissionSetup.productClass);
        this.commissionSetupForm
            .get('productName')
            .setValue(this.selectedCommissionSetup.productName);
        this.commissionSetupForm
            .get('commission')
            .setValue(this.selectedCommissionSetup.commission);
    }

    openAddAgentsFormDrawer() {
        this.addAgentsFormDrawerVisible = true;
    }

    openAddProductCommissionFormDrawer() {
        this.addProductCommissionFormDrawerVisible = true;
    }

    //filters commissions list based on selected intermediary and selected class
    filterCommissionList() {
        console.log('filter commission lost called here..');
        // this.loadProducts();
        this.commissionSetupsService
            .getCommissionSetups()
            .subscribe(commissions => {
                this.displayCommissionList = commissions.filter(
                    x =>
                        x.intermediaryName ==
                            this.selectedIntermediary.companyName ||
                        x.intermediaryName ==
                            this.selectedIntermediary.contactFirstName +
                                ' ' +
                                this.selectedIntermediary.contactLastName
                );

                console.log(this.displayCommissionList);
            });
    }

    //loads products based on selected class
    loadProducts() {
        this.productSetupsService.getClasses().subscribe(classes => {
            this.selectedClass = classes.filter(
                x =>
                    x.className ===
                    this.commissionSetupForm.get('productClass').value
            )[0];
            this.productsList = this.selectedClass.products;
        });
    }

    async addCommissionSetup(commission: ICommissionSetup) {
        await this.commissionSetupsService
            .addCommissionSetup(commission)
            .subscribe(
                res => {
                    this.msg.success('Commission successfully setup');
                },
                err => {
                    this.msg.error('Failed to add commission');
                },
                () => {
                    this.commissionUpdate.next(true);
                }
            );
    }

    submitCommissionSetup() {
        // for (let i in this.commissionSetupForm.controls) {
        //     this.commissionSetupForm[i].markAsDirty();
        //     this.commissionSetupForm[i].updateValueAndValidity();
        // }

        if (this.commissionSetupForm.valid || !this.commissionSetupForm.valid) {
            console.log(this.commissionSetupForm.value);
            this.addCommissionSetup(this.commissionSetupForm.value).then(
                res => {
                    //put some feedback here
                    this.isEditmode = false;
                }
            );
        }
    }

    //make commission setup form visible
    editCommissionSetupsForm() {
        this.isEditmode = true;
    }

    cancelEditCommissionForm() {
        this.isEditmode = false;
    }

    editViewIntermediary(agent: IAgent | IBroker | ISalesRepresentative): void {
        // this.router.navigateByUrl(
        //     '/flosure/underwriting/intermediary-view/' + agent.id
        // );
        console.log(agent);
        this.router.navigateByUrl(
            `/flosure/underwriting/intermediary-view/${agent.id}`
        );
    }

    recieveUpdate($event) {
        this.intermediaryUpdate.next($event);
    }
}
