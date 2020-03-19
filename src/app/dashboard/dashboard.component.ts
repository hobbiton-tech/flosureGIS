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


  clientsCount = 0;
  claimsCount = 0;
  policiesCount = 0;
  cancelledPoliciesCount: number;
  commissionEarned = 0;

  clientsLoading = true;
  claimsLoading = true;
  policiesLoading = true;

  constructor(
    private readonly dashboardService: DashboardService,
    private clientsService: ClientsService,
    private claimsService: ClaimsService,
    private policiesService: PoliciesService) { }

  ngOnInit(): void {
    this.clientsService.getClients().subscribe((clients) => {
      this.clientsCount = clients.length;
      this.clientsLoading = false;
    });

    this.claimsService.getClaims().subscribe((claims) => {
      this.claimsCount = claims.length;
      this.claimsLoading = false;
    });

    this.policiesService.getPolicies().subscribe((policies) => {
      this.policiesCount = policies.length;
      this.policiesLoading = false;
    });
  }
}

