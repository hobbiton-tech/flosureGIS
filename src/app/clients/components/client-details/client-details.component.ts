import {
    Component,
    OnInit,
    ChangeDetectorRef,
    AfterViewInit
} from '@angular/core';
import { IClient } from '../../models/clients.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountDetails } from '../../models/account-details.model';
import { ClientsService } from '../../services/clients.service';
import { filter, first } from 'rxjs/operators';

@Component({
    selector: 'app-client-details',
    templateUrl: './client-details.component.html',
    styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit, AfterViewInit {
    isEditmode = false;
    client: IClient;
    account: AccountDetails;
    clientId: string;

    constructor(
        private readonly route: Router,
        private cdr: ChangeDetectorRef,
        private router: ActivatedRoute,
        private clientsService: ClientsService
    ) {}

    ngOnInit(): void {
        this.router.params.subscribe(param => {
            this.clientId = param.id;
        });
    }

    ngAfterViewInit(): void {
        this.cdr.detectChanges();
    }

    goToClientsList(): void {
        this.route.navigateByUrl('/clients/clients-list');
    }

    viewPolicyDetails(): void {
        this.route.navigateByUrl('/underwriting/policy-details');
    }

    viewClaimDetails(): void {
        this.route.navigateByUrl('/claims/claim-details');
    }
}
