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


const BASE_URL = 'https://flosure-postgres-db.herokuapp.com';

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

    createEndorsement(
        policyId: string,
        endorsement: Endorsement
    ): Observable<Endorsement> {
        return this.http.post<Endorsement>(
            `${BASE_URL}/endorsement/${policyId}`,

            endorsement
        );
    }
    getEndorsements(): Observable<Endorsement[]> {
        return this.http.get<Endorsement[]>(`${BASE_URL}/endorsement`);
    }

    getEndorsementById(endorsementId: string): Observable<Endorsement> {
        return this.http.get<Endorsement>(
            `${BASE_URL}/endorsement/${endorsementId}`
        );
    }

    updateEndorsement(
        endorsement: Endorsement,
        endorsementId: string
    ): Observable<Endorsement> {
        return this.http.put<Endorsement>(
            `${BASE_URL}/endorsement/${endorsementId}`,

            endorsement
        );
    }
}
