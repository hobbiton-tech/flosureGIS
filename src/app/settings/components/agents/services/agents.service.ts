import { Injectable } from '@angular/core';
import { IAgent } from '../models/agents.model';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    DocumentReference,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { v4 } from 'uuid';
import { first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AgentsService {
    private agentsCollection: AngularFirestoreCollection<IAgent>;

    agents: Observable<IAgent[]>;
    constructor(private firebase: AngularFirestore) {
        this.agentsCollection = this.firebase.collection<IAgent>('agents');

        this.agents = this.agentsCollection.valueChanges();
    }

    async addAgent(agent: IAgent): Promise<void> {
        this.agents.pipe(first()).subscribe(async (agents) => {
            agent.id = v4(); // Generates UUID of version 4.
            agent.userType = 'Agent';
            agent.dateCreated = new Date();
            agent.dateUpdated = new Date();
            agent.agentID = this.generateAgentID(
                'Agent',
                'INS202000030',
                agents.length
            );

            await this.agentsCollection.add(agent);
        });
    }

    getAgents(): Observable<IAgent[]> {
        return this.agents;
    }

    countGenerator(numb: string | number) {
        if (numb <= 99999) {
            numb = ('0000' + numb).slice(-5);
        }
        return numb;
    }

    generateAgentID(
        userType: string,
        insuranceCompanyName: string,
        totalAgents: number
    ) {
        const userTyp = userType.substring(0, 3).toLocaleUpperCase();
        const insuranceCompanyNam = insuranceCompanyName
            .substring(0, 2)
            .toLocaleUpperCase();
        const count = this.countGenerator(totalAgents);

        return userTyp + insuranceCompanyNam + count;
    }
}
