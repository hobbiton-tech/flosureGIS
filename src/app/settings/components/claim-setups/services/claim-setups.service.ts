import { Injectable } from '@angular/core';
import {
    AngularFirestoreCollection,
    AngularFirestore,
} from '@angular/fire/firestore';
import {
    IServiceProvider,
    ILossAdjustor,
    IIndividual,
    IClaimant,
    ISalvageBuyer,
} from 'src/app/settings/models/underwriting/claims.model';
import { Observable, combineLatest } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';

const BASE_URL = 'https://savenda.flosure-api.com';
@Injectable({
    providedIn: 'root',
})
export class ClaimSetupsService {
    private serviceProviderCollection: AngularFirestoreCollection<
        IServiceProvider
    >;
    serviceProviders: Observable<IServiceProvider[]>;

    private lossAdjustorCollection: AngularFirestoreCollection<ILossAdjustor>;
    lossAdjustors: Observable<ILossAdjustor[]>;

    private individualCollection: AngularFirestoreCollection<IIndividual>;
    individuals: Observable<IIndividual[]>;

    private claimantCollection: AngularFirestoreCollection<IClaimant>;
    claimants: Observable<IClaimant[]>;

    private salvageBuyerCollection: AngularFirestoreCollection<ISalvageBuyer>;
    salvageBuyers: Observable<ISalvageBuyer[]>;

    constructor(
        private firebase: AngularFirestore,
        private message: NzMessageService
    ) {
        this.serviceProviderCollection = firebase.collection<IServiceProvider>(
            'serviceProviders'
        );
        this.serviceProviders = this.serviceProviderCollection.valueChanges();

        this.lossAdjustorCollection = firebase.collection<ILossAdjustor>(
            'lossAdjustors'
        );
        this.lossAdjustors = this.lossAdjustorCollection.valueChanges();

        this.individualCollection = firebase.collection<IIndividual>(
            'individuals'
        );
        this.individuals = this.individualCollection.valueChanges();

        this.claimantCollection = firebase.collection<IClaimant>('claimants');
        this.claimants = this.claimantCollection.valueChanges();

        this.salvageBuyerCollection = firebase.collection<ISalvageBuyer>(
            'salvageBuyers'
        );
        this.salvageBuyers = this.salvageBuyerCollection.valueChanges();
    }

    // Service Provider Methods
    async addServiceProvider(serviceProvider: IServiceProvider): Promise<void> {
        await this.serviceProviderCollection
            .doc(serviceProvider.id)
            .set(serviceProvider)
            .then((msg) => {
                this.message.success('Service Provider Created');
            })
            .catch((err) => {
                this.message.warning('Creation Failed');
                console.log(err);
            });
    }

    async updateServiceProvider(
        serviceProvider: IServiceProvider
    ): Promise<void> {
        return this.serviceProviderCollection
            .doc(`${serviceProvider.id}`)
            .update(serviceProvider)
            .then((res) => {
                this.message.success('Service Provider Updated');
                console.log(res);
            })
            .catch((err) => {
                this.message.warning('Update Failed');
                console.log(err);
            });
    }

    getServiceProviders(): Observable<IServiceProvider[]> {
        return this.serviceProviders;
    }

    // Loss Adjustor Methods
    async addLossAdjustor(lossAdjustor: ILossAdjustor): Promise<void> {
        await this.lossAdjustorCollection
            .doc(lossAdjustor.id)
            .set(lossAdjustor)
            .then((msg) => {
                this.message.success('Loss Adjustor Created');
            })
            .catch((err) => {
                this.message.warning('Creation Failed');
                console.log(err);
            });
    }

    async updateLossAdjustor(lossAdjustor: ILossAdjustor): Promise<void> {
        return this.lossAdjustorCollection
            .doc(`${lossAdjustor.id}`)
            .update(lossAdjustor)
            .then((res) => {
                this.message.success('Loss Adjustor Updated');
                console.log(res);
            })
            .catch((err) => {
                this.message.warning('Update Failed');
                console.log(err);
            });
    }

    getLossAdjustors(): Observable<ILossAdjustor[]> {
        return this.lossAdjustors;
    }

    getAllLossAdjustors(): Observable<[IIndividual[], ILossAdjustor[]]> {
        // tslint:disable-next-line: deprecation
        return combineLatest(this.getIndividuals(), this.getLossAdjustors());
    }

    // Individuals Methods
    async addIndividual(individual: IIndividual): Promise<void> {
        await this.individualCollection
            .doc(individual.id)
            .set(individual)
            .then((msg) => {
                this.message.success('Individual was Created');
            })
            .catch((err) => {
                this.message.warning('Creation Failed');
                console.log(err);
            });
    }

    async updateIndividual(individual: IIndividual): Promise<void> {
        return this.individualCollection
            .doc(`${individual.id}`)
            .update(individual)
            .then((res) => {
                this.message.success('Individual was Updated');
                console.log(res);
            })
            .catch((err) => {
                this.message.warning('Update Failed');
                console.log(err);
            });
    }

    getIndividuals(): Observable<IIndividual[]> {
        return this.individuals;
    }

    // Claimant Methods
    async addClaimant(claimant: IClaimant): Promise<void> {
        await this.claimantCollection
            .doc(claimant.id)
            .set(claimant)
            .then((msg) => {
                this.message.success('Claimant Created');
            })
            .catch((err) => {
                this.message.warning('Creation Failed');
                console.log(err);
            });
    }

    async updateClaimant(claimant: IClaimant): Promise<void> {
        return this.claimantCollection
            .doc(`${claimant.id}`)
            .update(claimant)
            .then((res) => {
                this.message.success('Claimant Updated');
                console.log(res);
            })
            .catch((err) => {
                this.message.warning('Update Failed');
                console.log(err);
            });
    }

    getClaimants(): Observable<IClaimant[]> {
        return this.claimants;
    }

    // Salvage Buyer Methods
    async addSalvageBuyer(salvageBuyer: ISalvageBuyer): Promise<void> {
        await this.salvageBuyerCollection
            .doc(salvageBuyer.id)
            .set(salvageBuyer)
            .then((msg) => {
                this.message.success('Salvage Buyer Created');
            })
            .catch((err) => {
                this.message.warning('Creation Failed');
                console.log(err);
            });
    }

    async updateSalvageBuyer(salvageBuyer: ISalvageBuyer): Promise<void> {
        return this.salvageBuyerCollection
            .doc(`${salvageBuyer.id}`)
            .update(salvageBuyer)
            .then((res) => {
                this.message.success('Salvage Buyer Updated');
                console.log(res);
            })
            .catch((err) => {
                this.message.warning('Update Failed');
                console.log(err);
            });
    }

    getSalvageBuyers(): Observable<ISalvageBuyer[]> {
        return this.salvageBuyers;
    }
}
