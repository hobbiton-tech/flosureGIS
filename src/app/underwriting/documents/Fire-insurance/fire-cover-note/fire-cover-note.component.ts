import { Component, OnInit, Input } from '@angular/core';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import {
    IIndividualClient,
    ICorporateClient
} from 'src/app/clients/models/clients.model';

@Component({
    selector: 'app-fire-cover-note',
    templateUrl: './fire-cover-note.component.html',
    styleUrls: ['./fire-cover-note.component.scss']
})
export class FireCoverNoteComponent implements OnInit {
    @Input()
    policyRisk: RiskModel;

    @Input()
    policy: Policy;

    @Input()
    client: IIndividualClient & ICorporateClient;

    constructor() {}

    ngOnInit(): void {}
}
