import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Claim } from '../models/claim.model';

@Injectable({
    providedIn: 'root'
})
export class ClaimsProcessingServiceService {
    claim = new BehaviorSubject<Claim>(null);
    documentType = new BehaviorSubject<string>('');
    photoSide = new BehaviorSubject<string>('');

    constructor() {}

    claimChanged$ = this.claim.asObservable();
    documentTypeChanged$ = this.documentType.asObservable();
    photoSideChanged$ = this.photoSide.asObservable();

    changeClaim(claim: Claim) {
        console.log('current claim: ', claim);
        this.claim.next(claim);
    }

    changeDocumentType(documentType: string) {
        console.log('doc type', documentType);
        this.documentType.next(documentType);
    }

    changePhotoSide(photoSide: string) {
        this.photoSide.next(photoSide);
    }
}
