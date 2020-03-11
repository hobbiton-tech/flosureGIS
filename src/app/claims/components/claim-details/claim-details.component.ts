import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-claim-details',
    templateUrl: './claim-details.component.html',
    styleUrls: ['./claim-details.component.scss']
})
export class ClaimDetailsComponent implements OnInit {
    perilsList: any[] = [];
    isEditmode = false;

    constructor(private readonly router: Router) {}

    ngOnInit(): void {}

    intimateClaim(): void {
        this.router.navigateByUrl('/claims/claim-transactions');
    }
}
