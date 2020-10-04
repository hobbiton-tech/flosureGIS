import { Component, OnInit, Input } from '@angular/core';
import { Policy } from 'src/app/underwriting/models/policy.model';
import {
    IIndividualClient,
    ICorporateClient
} from 'src/app/clients/models/clients.model';
import { IExtensions } from 'src/app/quotes/models/extensions.model';
import {
    IClause,
    IExccess
} from 'src/app/settings/models/underwriting/clause.model';

@Component({
    selector: 'app-marine-policy-schedule',
    templateUrl: './marine-policy-schedule.component.html',
    styleUrls: ['./marine-policy-schedule.component.scss']
})
export class MarinePolicyScheduleComponent implements OnInit {
    @Input()
    policy: Policy;

    @Input()
    client: IIndividualClient & ICorporateClient;

    @Input()
    extensions: IExtensions[];

    @Input()
    clauses: IClause[];

    @Input()
    excessList: IExccess[];

    constructor() {}

    ngOnInit(): void {}
}
