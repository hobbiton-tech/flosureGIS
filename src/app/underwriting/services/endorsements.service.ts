import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { Endorsement } from '../models/endorsement.model';
import { Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { first, filter } from 'rxjs/operators';
import { v4 } from 'uuid';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const BASE_URL = 'https://www.flosure-api.com';

@Injectable({
    providedIn: 'root'
})
export class EndorsementService {
    private endorsementsCollection: AngularFirestoreCollection<Endorsement>;
    endorsements: Observable<Endorsement[]>;
    endorsement: any;

    constructor(private firebase: AngularFirestore, private http: HttpClient) {
        this.endorsementsCollection = firebase.collection<Endorsement>(
            'endorsements'
        );
        this.endorsements = this.endorsementsCollection.valueChanges();
    }

    async addEndorsement(endorsement: Endorsement) {
        this.endorsements.pipe(first()).subscribe(async endorsements => {
            endorsement.id = v4();
            this.endorsementsCollection.doc(endorsement.id).set(endorsement);
        });
    }

    // getEndorsement(endorsemenId: string): Promise<void> {
    //     this.firebase
    //         .collection('endorsements')
    //         .ref.where('endoresementId', '==', endorsemenId)
    //         .get()
    //         .then(querySnapshot => {
    //             querySnapshot.forEach(doc => {
    //                 console.log(doc.data());
    //                 this.endorsement = doc.data();
    //             });
    //         })
    //         .catch(error => {
    //             console.log('Error getting documents:', error);
    //         });
    //     return this.endorsement;
    // }

    // getEndorsementById(endorsemenId: string): Observable<Endorsement> {
    //     return this.endorsementsCollection.doc<Endorsement>(endorsemenId).valueChanges();
    // }

    // getEndorsements(): Observable<Endorsement[]> {
    //     return this.endorsements;
    // }

    //postgress db
    // createEndorsement(
    //     policyId: string,
    //     endorsement: Endorsement
    // ): Observable<Endorsement> {
    //     console.log('endorsement: ');
    //     console.log(endorsement);
    //     return this.http.post<Endorsement>(
    //         `${BASE_URL}/policies/endorsements`,
    //         {
    //             policyId: policyId,
    //             ...endorsement
    //         }
    //     );
    // }
    // getEndorsements(): Observable<Endorsement[]> {
    //     return this.http.get<Endorsement[]>(
    //         `${BASE_URL}/policies/endorsements`
    //     );
    // }

    createEndorsement(
        policyId: string,
        endorsement: Endorsement
    ): Observable<Endorsement> {
        console.log('endorsement: ');
        console.log(endorsement);
        return this.http.post<Endorsement>(
            `http://localhost:3000/endorsement/${policyId}`,

            endorsement
        );
    }
    getEndorsements(): Observable<Endorsement[]> {
        return this.http.get<Endorsement[]>(
            'https://www.flosure-api.com/endorsement'
        );
    }

    getEndorsementById(endorsementId: string): Observable<Endorsement> {
        return this.http.get<Endorsement>(
            `http://localhost:3000/endorsement/${endorsementId}`
        );
    }

    updateEndorsement(
        endorsement: Endorsement,
        endorsementId: string
    ): Observable<Endorsement> {
        return this.http.put<Endorsement>(
            `http://localhost:3000/endorsement/${endorsementId}`,

            endorsement
        );
    }
}
