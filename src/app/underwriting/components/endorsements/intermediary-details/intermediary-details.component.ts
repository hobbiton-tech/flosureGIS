import { Component, OnInit } from '@angular/core';
import {
    IAgent,
    IBroker,
    ISalesRepresentative
} from 'src/app/settings/components/agents/models/agents.model';
import { ActivatedRoute } from '@angular/router';
import { AgentsService } from 'src/app/settings/components/agents/services/agents.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-intermediary-details',
    templateUrl: './intermediary-details.component.html',
    styleUrls: ['./intermediary-details.component.scss']
})
export class IntermediaryDetailsComponent implements OnInit {
    isEditmode = false;

    client: IAgent & IBroker & ISalesRepresentative;

    agentForm: FormGroup;
    brokerForm: FormGroup;
    salesRepresentativeForm: FormGroup;

    selectedIntermediaryType: string;

    id: string;

    constructor(
        private router: ActivatedRoute,
        private agentService: AgentsService,
        private formBuilder: FormBuilder
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
        console.log('intermediary detail component opened');
        this.router.params.subscribe(param => {
            this.id = param.id;
        });

        this.agentService.getAllIntermediaries().subscribe(intermedieries => {
            // console.log(intermedieries);
            this.client = [
                ...intermedieries[2],
                ...intermedieries[1],
                ...intermedieries[0]
            ].filter(x => x.id === this.id)[0] as IAgent &
                IBroker &
                ISalesRepresentative;

            if (this.client.intermediaryType == 'Agent') {
                this.agentForm
                    .get('contactFirstName')
                    .setValue(this.client.contactFirstName);
                this.agentForm
                    .get('contactLastName')
                    .setValue(this.client.contactLastName);
                this.agentForm
                    .get('contactPhone')
                    .setValue(this.client.contactPhone);
                this.agentForm.get('email').setValue(this.client.email);
                this.agentForm.get('phone').setValue(this.client.phone);
                this.agentForm
                    .get('tPinNumber')
                    .setValue(this.client.tPinNumber);
                this.agentForm
                    .get('contactEmail')
                    .setValue(this.client.contactEmail);
                this.agentForm
                    .get('contactAddress')
                    .setValue(this.client.contactAddress);
                this.agentForm.get('address').setValue(this.client.address);
                this.agentForm
                    .get('companyName')
                    .setValue(this.client.companyName);
                this.agentForm.get('branch').setValue(this.client.branch);
                this.agentForm.get('bank').setValue(this.client.bank);
                this.agentForm
                    .get('accountType')
                    .setValue(this.client.accountType);
                this.agentForm
                    .get('accountNumber')
                    .setValue(this.client.accountNumber);
                this.agentForm
                    .get('accountName')
                    .setValue(this.client.accountName);
                console.log(this.client);
            }
            if (this.client.intermediaryType == 'Broker') {
                this.brokerForm
                    .get('contactFirstName')
                    .setValue(this.client.contactFirstName);
                this.brokerForm
                    .get('contactLastName')
                    .setValue(this.client.contactLastName);
                this.brokerForm
                    .get('contactPhone')
                    .setValue(this.client.contactPhone);
                this.brokerForm.get('email').setValue(this.client.email);
                this.agentForm.get('phone').setValue(this.client.phone);
                this.brokerForm
                    .get('tPinNumber')
                    .setValue(this.client.tPinNumber);
                this.brokerForm
                    .get('contactEmail')
                    .setValue(this.client.contactEmail);
                this.brokerForm
                    .get('contactAddress')
                    .setValue(this.client.contactAddress);
                this.brokerForm.get('address').setValue(this.client.address);
                this.brokerForm
                    .get('companyName')
                    .setValue(this.client.companyName);
                this.brokerForm.get('branch').setValue(this.client.branch);
                this.brokerForm.get('bank').setValue(this.client.bank);
                this.brokerForm
                    .get('accountType')
                    .setValue(this.client.accountType);
                this.brokerForm
                    .get('accountNumber')
                    .setValue(this.client.accountNumber);
                this.brokerForm
                    .get('accountName')
                    .setValue(this.client.accountName);
            }
            if (this.client.intermediaryType == 'Sales Representative') {
                this.salesRepresentativeForm
                    .get('contactFirstName')
                    .setValue(this.client.contactFirstName);
                this.salesRepresentativeForm
                    .get('contactLastName')
                    .setValue(this.client.contactLastName);
                this.salesRepresentativeForm
                    .get('contactEmail')
                    .setValue(this.client.contactEmail);
                this.salesRepresentativeForm
                    .get('contactPhone')
                    .setValue(this.client.contactPhone);
                this.salesRepresentativeForm
                    .get('contactAddress')
                    .setValue(this.client.contactAddress);
                this.salesRepresentativeForm
                    .get('accountName')
                    .setValue(this.client.accountName);
                this.salesRepresentativeForm
                    .get('accountNumber')
                    .setValue(this.client.accountNumber);
                this.salesRepresentativeForm
                    .get('accountType')
                    .setValue(this.client.accountType);
                this.salesRepresentativeForm
                    .get('bank')
                    .setValue(this.client.bank);
                this.salesRepresentativeForm
                    .get('branch')
                    .setValue(this.client.branch);
            }
        });

        console.log('Intermedieris', this.client);

        // if (this.quoteData.sourceOfBusiness == 'Broker') {
        //     this.quoteDetailsForm
        //         .get('intermediaryName')
        //         .setValue(thentis.quoteData.intermediaryName);
        // }
        // if (this.quoteData.sourceOfBusiness == 'Sales Representative') {
        //     this.quoteDetailsForm
        //         .get('intermediaryName')
        //         .setValue(this.quoteData.intermediaryName);
        // }

        // this.agentService.getAllIntermediaries().subscribe((agents) =>{
        //   console.log(agents);
        //   this.client = agents.filter(
        //     (x) => x.id === this.id
        //   )[0] as IAgent & IBroker & ISalesRepresentative;
        //   console.log('AGENTS', this.client)
        /// });
    }

    updateAgent() {
        console.log('agent clicked!!');

        const agent: IAgent = {
            dateCreated: this.client.dateCreated,
            ...this.agentForm.value
        };

        this.agentService
            .updateAgent(agent, this.client.id)
            .subscribe(agent => {
                res => console.log(res);
            });
    }

    updateBroker() {
        console.log('agent clicked!!');

        const agent: IBroker = {
            dateCreated: this.client.dateCreated,
            ...this.brokerForm.value
        };

        this.agentService
            .updateBroker(agent, this.client.id)
            .subscribe(agent => {
                res => console.log(res);
            });
    }

    updateSalesRespresentative() {
        console.log('agent clicked!!');

        const agent: ISalesRepresentative = {
            dateCreated: this.client.dateCreated,
            ...this.salesRepresentativeForm.value
        };

        this.agentService
            .updateSalesRepresentatives(agent, this.client.id)
            .subscribe(agent => {
                res => console.log(res);
            });
    }
}
