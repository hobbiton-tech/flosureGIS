import { Component, OnInit } from '@angular/core';
import { Endorsement } from 'src/app/underwriting/models/endorsement.model';
import { EndorsementService } from 'src/app/underwriting/services/endorsements.service';
import { Router } from '@angular/router';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';

@Component({
    selector: 'app-view-endorsements',
    templateUrl: './view-endorsements.component.html',
    styleUrls: ['./view-endorsements.component.scss']
})
export class ViewEndorsementsComponent implements OnInit {
    endorsementsList: Endorsement[];
    displayEndorsementsList: Endorsement[];
    endorsementsCount: number = 0;

    searchString: string;

    retrievedEndorsement: Endorsement;
    backupPolicy: Policy;
    endorsedPolicy: Policy;

    constructor(
        private readonly route: Router,
        private endorsementsService: EndorsementService,
        private policiesService: PoliciesService
    ) {}

    ngOnInit(): void {
        this.endorsementsService.getEndorsements().subscribe(endorsements => {
            this.endorsementsList = endorsements;
            this.endorsementsCount = endorsements.length;

            this.displayEndorsementsList = this.endorsementsList;
            console.log(this.displayEndorsementsList);
            console.log(this.endorsementsList);
        });
    }

    viewPolicyBackup(endorsementId: string): void {
        this.endorsementsService
            .getEndorsementById(endorsementId)
            .subscribe(endorsement => {
                console.log(endorsement.policy);
                this.policiesService
                    .getPolicyById(endorsement.policy.id)
                    .subscribe(policy => {
                        // this.endorsedPolicy = policy;
                        this.route.navigateByUrl(
                            '/flosure/underwriting/backup-policy-details/' +
                                policy.id
                        );
                    });
            });

        // this.policiesService
        //     .getPolicyById(this.retrievedEndorsement.policy.id)
        //     .subscribe(policy => {
        //         this.endorsedPolicy = policy;
        //     });

        // this.policiesService
        //     .getBackupPolicyById(this.retrievedEndorsement.policy.id)
        //     .subscribe(policyBackup => {
        //         this.backupPolicy = policyBackup;
        //     });

        // this.route.navigateByUrl(
        //     '/flosure/underwriting/backup-policy-details/' +
        //         this.endorsedPolicy.id
        // );
    }

    search(value: string): void {
        if (value === '' || !value) {
            this.displayEndorsementsList = this.endorsementsList;
        }

        this.displayEndorsementsList = this.endorsementsList.filter(
            endorsement => {
                return (
                    endorsement.type
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    endorsement.status
                        .toLocaleLowerCase()
                        .includes(value.toLowerCase())
                );
            }
        );
    }
}
