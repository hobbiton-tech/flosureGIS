import { Component, OnInit, Input } from '@angular/core';
import { Policy } from 'src/app/underwriting/models/policy.model';
import {
    IIndividualClient,
    ICorporateClient
} from 'src/app/clients/models/clients.model';

@Component({
    selector: 'app-fire-policy-schedule',
    templateUrl: './fire-policy-schedule.component.html',
    styleUrls: ['./fire-policy-schedule.component.scss']
})
export class FirePolicyScheduleComponent implements OnInit {
    @Input()
    policy: Policy;

    @Input()
    client: IIndividualClient & ICorporateClient;

    constructor() {}

    ngOnInit(): void {}
}
