import { Component, OnInit, Input } from '@angular/core';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import { Policy } from 'src/app/underwriting/models/policy.model';
import {
    IIndividualClient,
    ICorporateClient
} from 'src/app/clients/models/clients.model';

@Component({
    selector: 'app-marine-cover-note',
    templateUrl: './marine-cover-note.component.html',
    styleUrls: ['./marine-cover-note.component.scss']
})
export class MarineCoverNoteComponent implements OnInit {
    @Input()
    policyRisk: RiskModel;

    @Input()
    policy: Policy;

    @Input()
    client: IIndividualClient & ICorporateClient;

    constructor() {}

    ngOnInit(): void {}
}
