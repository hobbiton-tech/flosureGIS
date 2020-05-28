import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../../product-setups/models/product-setups-models.model';
import {
    IClause,
    IExtension,
    IWording,
    IPolicyClauses,
    IPolicyExtension,
    IPolicyWording,
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

    private clausePolicyCollection: AngularFirestoreCollection<IPolicyClauses>;
    clausesPolicy: Observable<IPolicyClauses[]>;

    private extensionPolicyCollection: AngularFirestoreCollection<
        IPolicyExtension
    >;
    extensionsPolicy: Observable<IPolicyExtension[]>;

    private wordingPolicyCollection: AngularFirestoreCollection<IPolicyWording>;
    wordingsPolicy: Observable<IPolicyWording[]>;

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

        // policy product
        this.clausePolicyCollection = firebase.collection<IPolicyClauses>(
            'policy_clauses'
        );

        this.clausesPolicy = this.clausePolicyCollection.valueChanges();

        this.extensionPolicyCollection = firebase.collection<IPolicyExtension>(
            'policy_extensions'
        );

        this.extensionsPolicy = this.extensionPolicyCollection.valueChanges();

        this.wordingPolicyCollection = firebase.collection<IPolicyWording>(
            'policy_wordings'
        );

        this.wordingsPolicy = this.wordingPolicyCollection.valueChanges();
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

    // Policy Clauses Methods
    async addPolicyClause(clause: IPolicyClauses): Promise<void> {
        await this.clausePolicyCollection
            .doc(clause.id)
            .set(clause)
            .then((mess) => {
                // this.message.success('Clause Successfully created');
                console.log(mess);
            })
            .catch((err) => {
                // this.message.warning('Clause Failed');
                console.log(err);
            });
    }

    async updatePolicyClause(clause: IPolicyClauses): Promise<void> {
        return this.clausePolicyCollection
            .doc(`${clause.id}`)
            .update(clause)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getPolicyClauses(): Observable<IPolicyClauses[]> {
        return this.clausesPolicy;
    }

    // Extesions Policy Methods
    async addPolicyExtension(extension: IPolicyExtension): Promise<void> {
        await this.extensionPolicyCollection
            .doc(extension.id)
            .set(extension)
            .then((mess) => {
                // this.message.success('Extension Successfully created');
                console.log(mess);
            })
            .catch((err) => {
                // this.message.warning('Extension Failed');
                console.log(err);
            });
    }

    async updatePolicyExtension(extension: IPolicyExtension): Promise<void> {
        return this.extensionPolicyCollection
            .doc(`${extension.id}`)
            .update(extension)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getPolicyExtensions(): Observable<IPolicyExtension[]> {
        return this.extensionsPolicy;
    }

    // Wording Methods
    async addPolicyWording(wording: IPolicyWording): Promise<void> {
        await this.wordingPolicyCollection
            .doc(wording.id)
            .set(wording)
            .then((mess) => {
                // this.message.success('Wording Successfully created');
                console.log(mess);
            })
            .catch((err) => {
                // this.message.warning('Extension Failed');
                console.log(err);
            });
    }

    async updatePolicyWording(wording: IPolicyWording): Promise<void> {
        return this.wordingPolicyCollection
            .doc(`${wording.id}`)
            .update(wording)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getPolicyWordings(): Observable<IPolicyWording[]> {
        return this.wordingsPolicy;
    }
}
