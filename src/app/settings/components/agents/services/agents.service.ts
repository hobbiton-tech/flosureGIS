import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    DocumentReference,
} from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { IAgent, IBroker, ISalesRepresentative } from '../models/agents.model';
import { v4 } from 'uuid';
import { first, combineAll } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class AgentsService {
    private agentsCollection: AngularFirestoreCollection<IAgent>;
    private brokersCollection: AngularFirestoreCollection<IBroker>;
    private salesRepresentativesCollection: AngularFirestoreCollection<
        ISalesRepresentative
    >;

    agents: IAgent[];
    brokers: IBroker[];
    salesRepresentatives: ISalesRepresentative[];

    constructor(private firebase: AngularFirestore, private http: HttpClient) {
        // this.agentsCollection = this.firebase.collection<IAgent>('agents');
        // this.agents = this.agentsCollection.valueChanges();

        // this.brokersCollection = this.firebase.collection<IBroker>('brokers');
        // this.brokers = this.brokersCollection.valueChanges();

        // this.salesRepresentativesCollection = this.firebase.collection<
        //     ISalesRepresentative
        // >('sales_representatives');
        // this.salesRepresentatives = this.salesRepresentativesCollection.valueChanges();

        this.getAgents().subscribe((totalAgents) => {
            this.agents = totalAgents;
        });

        this.getBrokers().subscribe((totalBrokers) => {
            this.brokers = totalBrokers;
        });

        this.getSalesRepresentatives().subscribe(
            (totalSalesRepresentatives) => {
                this.salesRepresentatives = totalSalesRepresentatives;
            }
        );
    }

    // async addAgent(agent: IAgent): Promise<void> {
    //     this.agents.pipe(first()).subscribe(async agents => {
    //         agent.id = v4();
    //         agent.dateCreated = new Date();
    //         agent.intermediaryId = this.generateIntermediaryID(
    //             'Agent',
    //             'GL',
    //             agents.length
    //         );

    //         await this.agentsCollection.doc(agent.id).set(agent);
    //     });
    // }

    // getAgents(): Observable<IAgent[]> {
    //     return this.agents;
    // }

    // async addBroker(broker: IBroker): Promise<void> {
    //     this.brokers.pipe(first()).subscribe(async brokers => {
    //         broker.id = v4();
    //         broker.dateCreated = new Date();
    //         broker.intermediaryId = this.generateIntermediaryID(
    //             'Broker',
    //             'GL',
    //             brokers.length
    //         );

    //         await this.brokersCollection.doc(broker.id).set(broker);
    //     });
    // }

    // getBrokers(): Observable<IBroker[]> {
    //     return this.brokers;
    // }

    // async addSalesRepresentative(
    //     salesRepresentative: ISalesRepresentative
    // ): Promise<void> {
    //     this.salesRepresentatives
    //         .pipe(first())
    //         .subscribe(async salesRepresentatives => {
    //             salesRepresentative.id = v4();
    //             salesRepresentative.dateCreated = new Date();
    //             salesRepresentative.intermediaryId = this.generateIntermediaryID(
    //                 'Sales Representative',
    //                 'GL',
    //                 salesRepresentatives.length
    //             );

    //             await this.salesRepresentativesCollection
    //                 .doc(salesRepresentative.id)
    //                 .set(salesRepresentative);
    //         });
    // }

    // getSalesRepresentatives(): Observable<ISalesRepresentative[]> {
    //     return this.salesRepresentatives;
    // }

    // getAllIntermediaries(): Observable<
    //     [IAgent[], IBroker[], ISalesRepresentative[]]
    // > {
    //     // return combineLatest(this.agents, this.brokers, this.salesRepresentatives);
    //     return combineLatest(
    //         this.agents,
    //         this.brokers,
    //         this.salesRepresentatives
    //     );
    // }

    countGenerator(numb: string | number) {
        if (numb <= 99999) {
            numb = ('0000' + numb).slice(-5);
        }
        return numb;
    }

    generateIntermediaryID(
        intermediaryType: string,
        insuranceCompanyName: string,
        totalAgents: number
    ) {
        const intermediaryTyp = intermediaryType
            .substring(0, 3)
            .toLocaleUpperCase();
        const insuranceCompanyNam = insuranceCompanyName
            .substring(0, 3)
            .toLocaleUpperCase();
        const count = this.countGenerator(totalAgents);

        return intermediaryTyp + insuranceCompanyNam + count;
    }

    //postgres
    addSalesRepresentative(
        salesRepresentatives: ISalesRepresentative
    ): Observable<ISalesRepresentative> {
        salesRepresentatives.dateCreated = new Date();
        salesRepresentatives.intermediaryType = 'Sales Representative';
        salesRepresentatives.intermediaryId = this.generateIntermediaryID(
            'Sales Representative',
            'SGI',
            this.salesRepresentatives.length
        );
        return this.http.post<ISalesRepresentative>(

            'http://localhost:3000/intermediary/sales-representative',

            salesRepresentatives
        );
    }
    // getSalesRepresentatives(): Observable<ISalesRepresentative[]> {
    //     return this.http.get<ISalesRepresentative[]>(

    //         'http://localhost:3000/intermediary/sales-representative'

    //     );
    // }

    getSalesRepresentative(id: string): Observable<ISalesRepresentative> {
        return this.http.get<ISalesRepresentative>(

            `http://localhost:3000/intermediary/sales-representative/${id}`

        );
    }

    updateSalesRepresentatives(
        agent: ISalesRepresentative,
        id: string
    ): Observable<ISalesRepresentative> {
        return this.http.put<ISalesRepresentative>(

            `http://localhost:3000/intermediary/sales-representative/${id}`,

            agent
        );
    }

    updateBroker(agent: IBroker, id: string): Observable<IBroker> {
        return this.http.put<IBroker>(

            `http://localhost:3000/intermediary/broker/${id}`,

            agent
        );
    }

    addBroker(broker: IBroker): Observable<IBroker> {
        broker.dateCreated = new Date();
        broker.intermediaryType = 'Broker';
        broker.intermediaryId = this.generateIntermediaryID(
            'Broker',
            'SGI',
            this.brokers.length
        );
        return this.http.post<IBroker>(

            'http://localhost:3000/intermediary/broker',

            broker
        );
    }

    getBroker(id: string): Observable<IBroker> {
        return this.http.get<IBroker>(

            `http://localhost:3000/intermediary/broker/${id}`

        );
    }

    // getBrokers(): Observable<IBroker[]> {
    //     return this.http.get<IBroker[]>(

    //         'http://localhost:3000/intermediary/broker'

    //     );
    // }

    addAgent(agent: IAgent): Observable<IAgent> {
        agent.dateCreated = new Date();
        agent.intermediaryType = 'Agent';
        agent.intermediaryId = this.generateIntermediaryID(
            'Agent',
            'AP',
            this.agents.length
        );
        return this.http.post<IAgent>(

            'http://localhost:3000/intermediary/agent',

            agent
        );
    }

    // getAgent(id: string): Observable<IAgent> {
    //     return this.http.get<IAgent>(

    //         `http://localhost:3000/intermediary/agent/${id}`

    //     );
    // }

    // getAgents(): Observable<IAgent[]> {
    //     return this.http.get<IAgent[]>(

    //         'http://localhost:3000/intermediary/agent'

    //     );
    // }

    updateAgent(agent: IAgent, id: string): Observable<IAgent> {
        return this.http.put<IAgent>(

            `http://localhost:3000/intermediary/agent/${id}`,

            agent
        );
    }

    // getAllIntermediaries(): Observable<
    //     [IAgent[], IBroker[], ISalesRepresentative[]]
    // > {
    //     return combineLatest(
    //         this.getAgents(),
    //         this.getBrokers(),
    //         this.getSalesRepresentatives()
    //     );
    // }

    //postgres
    getAgents(): Observable<IAgent[]> {
        return this.http.get<IAgent[]>(

            'http://localhost:3000/intermediary/agent'

        );
    }

    getBrokers(): Observable<IBroker[]> {
        return this.http.get<IBroker[]>(

            'http://localhost:3000/intermediary/broker'

        );
    }

    getSalesRepresentatives(): Observable<ISalesRepresentative[]> {
        return this.http.get<ISalesRepresentative[]>(

            'http://localhost:3000/intermediary/sales-representative'

        );
    }

    getAllIntermediaries(): Observable<
        [IAgent[], IBroker[], ISalesRepresentative[]]
    > {
        return combineLatest(
            this.getAgents(),
            this.getBrokers(),
            this.getSalesRepresentatives()
        );
    }
}
