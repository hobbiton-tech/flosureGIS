import * as faker from 'faker';
import { IClientType } from '../models/organizational/client-type.model'

const createClient = () => {
    const client: IClientType = {
        type: faker.random.arrayElement(['Individual', 'Corporate']),
        description: faker.company.companyName()
    };
    return client;
}

export const generateClients = () => {
    let clients: IClientType[] = [];
    for(let i = 0; i <= 50; i++) {
        clients.push(createClient());
    }
    return clients;
}