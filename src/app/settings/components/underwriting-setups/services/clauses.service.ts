import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../../product-setups/models/product-setups-models.model';
import {
    IClause,
    IExtension,
    IWording,
} from 'src/app/settings/models/underwriting/clause.model';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { filter, first } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';

const BASE_URL = 'https://flosure-api.azurewebsites.net';
@Injectable({
    providedIn: 'root',
})
export class ClausesService {
    private clauseCollection: AngularFirestoreCollection<IClause>;
    clauses: Observable<IClause[]>;

    private extensionCollection: AngularFirestoreCollection<IExtension>;
    extensions: Observable<IExtension[]>;

    private wordingCollection: AngularFirestoreCollection<IWording>;
    wordings: Observable<IWording[]>;

    constructor(
        private http: HttpClient,
        private firebase: AngularFirestore,
        private message: NzMessageService
    ) {
        this.clauseCollection = firebase.collection<IClause>('clauses');

        this.clauses = this.clauseCollection.valueChanges();

        this.extensionCollection = firebase.collection<IExtension>(
            'extensions'
        );

        this.extensions = this.extensionCollection.valueChanges();

        this.wordingCollection = firebase.collection<IWording>('wordings');

        this.wordings = this.wordingCollection.valueChanges();
    }

    getProducts(): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(`${BASE_URL}/classes/products`);
    }

    // Clauses Methods
    async addClause(clause: IClause): Promise<void> {
        await this.clauseCollection
            .doc(clause.id)
            .set(clause)
            .then((mess) => {
                this.message.success('Clause Successfully created');
            })
            .catch((err) => {
                this.message.warning('Clause Failed');
                console.log(err);
            });
    }

    async updateClause(clause: IClause): Promise<void> {
        return this.clauseCollection
            .doc(`${clause.id}`)
            .update(clause)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getClauses(): Observable<IClause[]> {
        return this.clauses;
    }

    // Extesions Methods
    async addExtension(extension: IExtension): Promise<void> {
        await this.extensionCollection
            .doc(extension.id)
            .set(extension)
            .then((mess) => {
                this.message.success('Extension Successfully created');
            })
            .catch((err) => {
                this.message.warning('Extension Failed');
                console.log(err);
            });
    }

    async updateExtension(extension: IExtension): Promise<void> {
        return this.extensionCollection
            .doc(`${extension.id}`)
            .update(extension)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getExtensions(): Observable<IExtension[]> {
        return this.extensions;
    }

    // Wording Methods
    async addWording(wording: IWording): Promise<void> {
        await this.wordingCollection
            .doc(wording.id)
            .set(wording)
            .then((mess) => {
                this.message.success('Wording Successfully created');
            })
            .catch((err) => {
                this.message.warning('Extension Failed');
                console.log(err);
            });
    }

    async updateWording(wording: IWording): Promise<void> {
        return this.wordingCollection
            .doc(`${wording.id}`)
            .update(wording)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getWordings(): Observable<IWording[]> {
        return this.wordings;
    }
}
