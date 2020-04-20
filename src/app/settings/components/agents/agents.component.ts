import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IAgent, IBroker, ISalesRepresentative } from './models/agents.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgentsService } from './services/agents.service';

@Component({
    selector: 'app-agents',
    templateUrl: './agents.component.html',
    styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {
    addAgentsFormDrawerVisible = false;
    intermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;
    displayIntermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;

    totalIntermediaries = 0;
    agents: IAgent[];
    totalAgents = 0;
    broker: IBroker[];
    totalBrokers = 0;
    salesRepesentertives: ISalesRepresentative[];
    totalSalesRepresentatives = 0;

    constructor(
        private formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private agentService: AgentsService
    ) {}

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
    }

    openAddAgentsFormDrawer() {
        this.addAgentsFormDrawerVisible = true;
    }
}
