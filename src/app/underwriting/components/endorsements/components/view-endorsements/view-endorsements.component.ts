import { Component, OnInit } from '@angular/core';
import { Endorsement } from 'src/app/underwriting/models/endorsement.model';
import { EndorsementService } from 'src/app/underwriting/services/endorsements.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-view-endorsements',
    templateUrl: './view-endorsements.component.html',
    styleUrls: ['./view-endorsements.component.scss'],
})
export class ViewEndorsementsComponent implements OnInit {
    endorsementsList: Endorsement[];
    displayEndorsementsList: Endorsement[];
    endorsementsCount: number = 0;

    searchString: string;

    constructor(
        private readonly route: Router,
        private endorsementsService: EndorsementService
    ) {}

    ngOnInit(): void {
        this.endorsementsService.getEndorsements().subscribe((endorsements) => {
            this.endorsementsList = endorsements;
            this.endorsementsCount = endorsements.length;

            this.displayEndorsementsList = this.endorsementsList;
        });
    }

    search(value: string): void {
        if (value === '' || !value) {
            this.displayEndorsementsList = this.endorsementsList;
        }

        this.displayEndorsementsList = this.endorsementsList.filter(
            (endorsement) => {
                return (
                    endorsement.endorsementType
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
