import { Component, OnInit } from '@angular/core';
import { ClaimsService } from '../../services/claims-service.service';

@Component({
  selector: 'app-intimate-claim',
  templateUrl: './intimate-claim.component.html',
  styleUrls: ['./intimate-claim.component.scss']
})
export class IntimateClaimComponent implements OnInit {

  

  perilsList: any[] = [];
  constructor(
    private readonly claimService: ClaimsService
  ) { }

  ngOnInit(): void {
  }

  addClaim(): void {

  }

}
