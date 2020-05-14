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

@Injectable({
    providedIn: 'root'
})
export class EndorsementService {
    private endorsementsCollection: AngularFirestoreCollection<Endorsement>;
    endorsements: Observable<Endorsement[]>;
    endorsement: any;

    constructor(private firebase: AngularFirestore) {
        this.endorsementsCollection = firebase.collection<Endorsement>(
            'endorsements'
        );
        this.endorsements = this.endorsementsCollection.valueChanges();
    }

    async addEndorsement(endorsement: Endorsement) {
        this.endorsements.pipe(first()).subscribe(async endorsements => {
            endorsement.endorsementId = v4();
            this.endorsementsCollection
                .doc(endorsement.endorsementId)
                .set(endorsement);
        });
    }

    getEndorsement(endorsemenId: string): Promise<void> {
        this.firebase
            .collection('endorsements')
            .ref.where('endoresementId', '==', endorsemenId)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    console.log(doc.data());
                    this.endorsement = doc.data();
                });
            })
            .catch(error => {
                console.log('Error getting documents:', error);
            });
        return this.endorsement;
    }

    // getEndorsementById(endorsemenId: string): Observable<Endorsement> {
    //     return this.endorsementsCollection.doc<Endorsement>(endorsemenId).valueChanges();
    // }

    getEndorsements(): Observable<Endorsement[]> {
        return this.endorsements;
    }
}
