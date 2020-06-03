import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgentsService } from '../services/agents.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IAgent, IBroker, ISalesRepresentative } from '../models/agents.model';

@Component({
    selector: 'app-add-agent',
    templateUrl: './add-agent.component.html',
    styleUrls: ['./add-agent.component.scss']
})
export class AddAgentComponent implements OnInit {
    //loading feedback
    addingIntermediary: boolean = false;

    @Input()
    isAddAgentsFormDrawerVisible: boolean;

    @Output()
    closeAddAgentsFormDrawerVisible: EventEmitter<any> = new EventEmitter();

    update: boolean = true;

    agentForm: FormGroup;
    brokerForm: FormGroup;
    salesRepresentativeForm: FormGroup;

    selectedIntermediaryType: string;

    constructor(
        private formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private agentService: AgentsService,
        private msg: NzMessageService
    ) {
        //agent form
        this.agentForm = this.formBuilder.group({
            intermediaryType: ['Agent'],
            companyName: ['', Validators.required],
            tPinNumber: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            address: ['', Validators.required],
            contactFirstName: ['', Validators.required],
            contactLastName: ['', Validators.required],
            contactEmail: ['', Validators.required],
            contactPhone: ['', Validators.required],
            contactAddress: ['', Validators.required],
            accountName: ['', Validators.required],
            accountNumber: ['', Validators.required],
            accountType: ['', Validators.required],
            bank: ['', Validators.required],
            branch: ['', Validators.required]
        });

        //broker form
        this.brokerForm = this.formBuilder.group({
            intermediaryType: ['Broker'],
            companyName: ['', Validators.required],
            tPinNumber: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            address: ['', Validators.required],
            contactFirstName: ['', Validators.required],
            contactLastName: ['', Validators.required],
            contactEmail: ['', Validators.required],
            contactPhone: ['', Validators.required],
            contactAddress: ['', Validators.required],
            accountName: ['', Validators.required],
            accountNumber: ['', Validators.required],
            accountType: ['', Validators.required],
            bank: ['', Validators.required],
            branch: ['', Validators.required]
        });

        //sales representative form
        this.salesRepresentativeForm = this.formBuilder.group({
            intermediaryType: ['Sales Representative'],
            contactFirstName: ['', Validators.required],
            contactLastName: ['', Validators.required],
            contactEmail: ['', Validators.required],
            contactPhone: ['', Validators.required],
            contactAddress: ['', Validators.required],
            accountName: ['', Validators.required],
            accountNumber: ['', Validators.required],
            accountType: ['', Validators.required],
            bank: ['', Validators.required],
            branch: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.selectedIntermediaryType = 'agent';
        this.cdr.detectChanges();
    }

    resetForm(e: MouseEvent): void {
        e.preventDefault();
        this.agentForm.reset();
    }

    closeDrawer(): void {
        this.closeAddAgentsFormDrawerVisible.emit(true);
    }

    changeIntermediaryType(event): void {
        console.log(event);
    }

    async addAgentIntermediary(agent: IAgent) {
        this.addingIntermediary = true;
        await this.agentService.addAgent(agent).subscribe(
            res => {
                this.msg.success('Agent added successfully')
                this.addingIntermediary = false;
                this.closeDrawer();
            },
            err => {
                this.msg.error('Failed to add Agent')
                this.addingIntermediary = false;
            }
        );
    }

    async addBrokerIntermediary(broker: IBroker) {
        this.addingIntermediary = true
        await this.agentService.addBroker(broker).subscribe(
            res => {
                this.msg.success('Broker added successfully')
                this.addingIntermediary = false;
                this.closeDrawer();
            },
            err => {
                this.msg.error('Failed to add Broker')
                this.addingIntermediary = false;
            }
        );
    }

    async addSalesRepresentativeIntermediary(
        salesRepresentative: ISalesRepresentative
    ) {
        this.addingIntermediary = true;
        await this.agentService.addSalesRepresentative(salesRepresentative).subscribe(
            res => {
                this.msg.success('Sales representative added successfully')
                this.addingIntermediary = false;
                this.closeDrawer();
            },
            err => {
                this.msg.error('Failed to add Sales representative')
                this.addingIntermediary = false;
            }
        );
    }

    submitAgentIntermediary() {
        for (let i in this.agentForm.controls) {
            /// validation;
            this.agentForm.controls[i].markAsDirty();
            this.agentForm.controls[i].updateValueAndValidity();
        }

        if (this.agentForm.valid || !this.agentForm.valid) {
            this.addAgentIntermediary(this.agentForm.value).then(res => {
                this.agentForm.reset();
            });
        }
    }

    submitBrokerIntermediary() {
        for (let i in this.brokerForm.controls) {
            /// validation;
            this.brokerForm.controls[i].markAsDirty();
            this.brokerForm.controls[i].updateValueAndValidity();
        }

        if (this.brokerForm.valid || !this.brokerForm.valid) {
            this.addBrokerIntermediary(this.brokerForm.value).then(res => {
                this.brokerForm.reset();
            });
        }
    }

    submitSalesRepresentativeIntermediary() {
        for (let i in this.salesRepresentativeForm.controls) {
            /// validation;
            this.salesRepresentativeForm.controls[i].markAsDirty();
            this.salesRepresentativeForm.controls[i].updateValueAndValidity();
        }

        if (
            this.salesRepresentativeForm.valid ||
            !this.salesRepresentativeForm.valid
        ) {
            this.addSalesRepresentativeIntermediary(
                this.salesRepresentativeForm.value
            ).then(res => {
                this.salesRepresentativeForm.reset();
            });
        }
    }
}
