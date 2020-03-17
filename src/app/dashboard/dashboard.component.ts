import { Component, OnInit } from '@angular/core';
import { DashboardService } from './services/dashboard.service';
import { ClientsService } from '../clients/services/clients.service';
import { ClaimsService } from '../claims/services/claims-service.service';
import { PoliciesService } from '../underwriting/services/policies.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
<<<<<<< HEAD

  clientsCount: number = 0;
  claimsCount: number = 0;
  policiesCount: number = 0;
  cancelledPoliciesCount : number;
  commissionEarned: number = 0;

  clientsLoading: boolean = true;
  claimsLoading: boolean = true;
  policiesLoading: boolean = true;

  constructor(
    private readonly dashboardService: DashboardService,
    private clientsService: ClientsService,
    private claimsService: ClaimsService,
    private policiesService: PoliciesService) { }

  ngOnInit(): void {
    this.clientsService.getClients().subscribe((clients) => {
      this.clientsCount = clients.length;
      this.clientsLoading = false;
    })

    this.claimsService.getClaims().subscribe((claims) => {
      this.claimsCount = claims.length;
      this.claimsLoading = false;
    })

    this.policiesService.getPolicies().subscribe((policies) => {
      this.policiesCount = policies.length;
      this.policiesLoading = false
    })
  }

=======
    clientsCount: number = 0;
    claimsCount: number = 0;
    policiesCount: number = 0;
    cancelledPoliciesCount: number;
    commissionEarned: number = 0;

    clientsLoading: boolean = true;
    claimsLoading: boolean = true;
    policiesLoading: boolean = true;

    constructor(
        private readonly dashboardService: DashboardService,
        private clientsService: ClientsService,
        private claimsService: ClaimsService,
        private policiesService: PoliciesService
    ) {}

    ngOnInit(): void {
        this.clientsService.getClients().subscribe(clients => {
            this.clientsCount = clients.length;
            this.clientsLoading = false;
        });

        this.claimsService.getClaims().subscribe(claims => {
            this.claimsCount = claims.length;
            this.claimsLoading = false;
        });

        this.policiesService.getPolicies().subscribe(policies => {
            this.policiesCount = policies.length;
            this.policiesLoading;
        });
    }

    // clientsCount = this.dashboardService.getClientsCount();
>>>>>>> b6021bc93485f138fdeef44b4267ceadfb5634a0
}
