import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IAgent } from './models/agents.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgentsService } from './services/agents.service';

@Component({
    selector: 'app-agents',
    templateUrl: './agents.component.html',
    styleUrls: ['./agents.component.scss'],
})
export class AgentsComponent implements OnInit {
    addAgentsFormDrawerVisible = false;
    agentsList: IAgent[];

    constructor(
        private formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private agentService: AgentsService
    ) {}

    ngOnInit(): void {
        this.agentService.getAgents().subscribe((agents) => {
            this.agentsList = agents;
            console.log('<=========Agent List=========>');
            console.log(this.agentsList);
        });
    }

    openAddAgentsFormDrawer() {
        this.addAgentsFormDrawerVisible = true;
    }
}
