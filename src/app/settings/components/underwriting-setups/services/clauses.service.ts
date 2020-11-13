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
    ILimit,
    IExccess,
    IWarranty,
    IExclusion
} from 'src/app/settings/models/underwriting/clause.model';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { filter, first } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import {
    IExtensionValueModel,
    IExtensions
} from 'src/app/quotes/models/extensions.model';

const BASE_URL = 'http://test-main.flosure-api.com';
@Injectable({
    providedIn: 'root'
})
export class ClausesService {
    private clauseCollection: AngularFirestoreCollection<IClause>;
    clauses: Observable<IClause[]>;

    private extensionCollection: AngularFirestoreCollection<IExtensions>;
    extensions: Observable<IExtensions[]>;

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

    private limitsCollection: AngularFirestoreCollection<ILimit>;
    limits: Observable<ILimit[]>;

    private exccessesCollection: AngularFirestoreCollection<IExccess>;
    exccesses: Observable<IExccess[]>;

    private warrantiesCollection: AngularFirestoreCollection<IWarranty>;
    warranties: Observable<IWarranty[]>;

    private exclusionsCollection: AngularFirestoreCollection<IExclusion>;
    exclusions: Observable<IExclusion[]>;

    constructor(
        private http: HttpClient,
        private firebase: AngularFirestore,
        private message: NzMessageService
    ) {
        this.clauseCollection = firebase.collection<IClause>('clauses');
        this.clauses = this.clauseCollection.valueChanges();

        this.extensionCollection = firebase.collection<IExtensions>(
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

        this.limitsCollection = firebase.collection<ILimit>('limits');
        this.limits = this.limitsCollection.valueChanges();

        this.exccessesCollection = firebase.collection<IExccess>('exccesses');
        this.exccesses = this.exccessesCollection.valueChanges();

        this.warrantiesCollection = firebase.collection<IWarranty>(
            'warranties'
        );
        this.warranties = this.warrantiesCollection.valueChanges();

        this.exclusionsCollection = firebase.collection<IExclusion>(
            'exclusions'
        );
        this.exclusions = this.exclusionsCollection.valueChanges();
    }

    getProducts(): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(`${BASE_URL}/classes/products`);
    }

    // Clauses Methods
    async addClause(clause: IClause): Promise<void> {
        await this.clauseCollection
            .doc(clause.id)
            .set(clause)
            .then(mess => {
                this.message.success('Clause Successfully created');
            })
            .catch(err => {
                this.message.warning('Clause Failed');
                console.log(err);
            });
    }

    async updateClause(clause: IClause): Promise<void> {
        return this.clauseCollection
            .doc(`${clause.id}`)
            .update(clause)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
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
            .then(mess => {
                this.message.success('Extension Successfully created');
            })
            .catch(err => {
                this.message.warning('Extension Failed');
                console.log(err);
            });
    }

    async updateExtension(extension: IExtension): Promise<void> {
        return this.extensionCollection
            .doc(`${extension.id}`)
            .update(extension)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    getExtensions(): Observable<IExtensions[]> {
        return this.extensions;
    }

    // Limits Methods
    async addLimit(limit: ILimit): Promise<void> {
        await this.limitsCollection
            .doc(limit.id)
            .set(limit)
            .then(mess => {
                this.message.success(
                    'Limits & Liabilities Successfuly Created'
                );
            })
            .catch(err => {
                this.message.warning('Failed to Create');
                console.log(err);
            });
    }

    async updateLimit(limit: ILimit): Promise<void> {
        return this.limitsCollection
            .doc(`${limit.id}`)
            .update(limit)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    getLimits(): Observable<ILimit[]> {
        return this.limits;
    }

    // Warranties Methods
    async addWarranty(warranty: IWarranty): Promise<void> {
        await this.warrantiesCollection
            .doc(warranty.id)
            .set(warranty)
            .then(mess => {
                this.message.success('Warranty Successfuly Created');
            })
            .catch(err => {
                this.message.warning('Failed to Create Warranty');
                console.log(err);
            });
    }

    async updateWarranty(warranty: IWarranty): Promise<void> {
        return this.warrantiesCollection
            .doc(`${warranty.id}`)
            .update(warranty)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    getWarranty(): Observable<IWarranty[]> {
        return this.warranties;
    }

    // Wording Methods
    async addWording(wording: IWording): Promise<void> {
        await this.wordingCollection
            .doc(wording.id)
            .set(wording)
            .then(mess => {
                this.message.success('Wording Successfully created');
            })
            .catch(err => {
                this.message.warning('Extension Failed');
                console.log(err);
            });
    }

    async updateWording(wording: IWording): Promise<void> {
        return this.wordingCollection
            .doc(`${wording.id}`)
            .update(wording)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
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
            .then(mess => {
                // this.message.success('Clause Successfully created');
                console.log(mess);
            })
            .catch(err => {
                // this.message.warning('Clause Failed');
                console.log(err);
            });
    }

    async updatePolicyClause(clause: IPolicyClauses): Promise<void> {
        return this.clausePolicyCollection
            .doc(`${clause.id}`)
            .update(clause)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
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
            .then(mess => {
                // this.message.success('Extension Successfully created');
                console.log(mess);
            })
            .catch(err => {
                // this.message.warning('Extension Failed');
                console.log(err);
            });
    }

    async updatePolicyExtension(extension: IPolicyExtension): Promise<void> {
        return this.extensionPolicyCollection
            .doc(`${extension.id}`)
            .update(extension)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
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
            .then(mess => {
                // this.message.success('Wording Successfully created');
                console.log(mess);
            })
            .catch(err => {
                // this.message.warning('Extension Failed');
                console.log(err);
            });
    }

    async updatePolicyWording(wording: IPolicyWording): Promise<void> {
        return this.wordingPolicyCollection
            .doc(`${wording.id}`)
            .update(wording)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    getPolicyWordings(): Observable<IPolicyWording[]> {
        return this.wordingsPolicy;
    }

    // Exccesses Methods
    async addExccess(exccess: IExccess): Promise<void> {
        await this.exccessesCollection
            .doc(exccess.id)
            .set(exccess)
            .then(mess => {
                this.message.success('Exccesses Successfuly Created');
                console.log(mess);
            })
            .catch(err => {
                this.message.warning('Failed to Create Exccesses');
                console.log(err);
            });
    }

    async updateExccesses(exccess: IExccess): Promise<void> {
        return this.exccessesCollection
            .doc(`${exccess.id}`)
            .update(exccess)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    getExccesses(): Observable<IExccess[]> {
        return this.exccesses;
    }

    // Exclusions Methods
    async addExclusion(exclusion: IExclusion): Promise<void> {
        await this.exclusionsCollection
            .doc(exclusion.id)
            .set(exclusion)
            .then(mess => {
                this.message.success('Exclusion Successfuly Created');
            })
            .catch(err => {
                this.message.warning('Failed to Create Exclusion');
                console.log(err);
            });
    }

    async updateExclusion(exclusion: IExclusion): Promise<void> {
        return this.exclusionsCollection
            .doc(`${exclusion.id}`)
            .update(exclusion)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    getExclusions(): Observable<IExclusion[]> {
        return this.exclusions;
    }
}
