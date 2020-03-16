import { Component, OnInit } from '@angular/core';
import { ClaimsService } from './services/claims-service.service';
import { Claim } from './models/claim.model'

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit {

  constructor(private readonly claimsService: ClaimsService) { }

  ngOnInit(): void {}

  addClaim(claim: Claim): void {
    this.claimsService.addClaim(claim);
  }

}
