import {
    Component,
    OnInit,
    Input,
    ChangeDetectorRef,
    AfterViewInit
} from '@angular/core';
import { Client } from '../../models/clients.model';
import { generateClients } from '../../data/client.data';
import { Router, ActivatedRoute } from '@angular/router';
import { generatePolicies } from 'src/app/underwriting/data/policy.data';
import { generateClaimsList } from 'src/app/claims/models/claim.model';
import { AccountDetails } from '../../models/account-details.model';
import { ClientsService } from '../../services/clients.service';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-client-details',
    templateUrl: './client-details.component.html',
    styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit, AfterViewInit {
    isEditmode = false;
    client: Client;
    account: AccountDetails;

    clientPolicies = generatePolicies();
    clientsClaims = generateClaimsList();

    listOfData = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park'
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park'
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park'
        }
    ];
  id: any;
  clientData: any;
    constructor(
        private readonly route: Router,
        private cdr: ChangeDetectorRef,
        private router: ActivatedRoute,
        private readonly clientsService: ClientsService
    ) {}

    ngOnInit(): void {
        this.client = generateClients()[9];
        this.router.params.subscribe(param => {
          this.id = param.id;

        });

        this.clientsService.getClient(this.id).subscribe(cli => {
            this.clientData = cli;
            console.log('<======ID=====>');
            console.log(this.id);
            console.log('<======CLIENT=====>');
            console.log(this.clientData);
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
