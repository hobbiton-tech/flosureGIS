import * as faker from 'faker';
import { Client } from '../models/clients.model';

const createClient = () => {
    const client: Client = {
        clientID: faker.random.number(500),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber('+260 9## ### ###'),
        type: faker.random.arrayElement(['Individual', 'Corporate']),
        status: faker.random.arrayElement(['Active', 'Inactive'])
    };
    return client;
};

export const generateClients = () => {
    let clients: Client[] = [];
    for (let i = 0; i <= 230; i++) {
        clients.push(createClient());
    }

    return clients;
};
