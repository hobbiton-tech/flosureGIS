import * as faker from 'faker';
import { Client } from '../models/clients.model';

const createClient = () => {
    const client: Client = {
        title: faker.random.word(),
        clientID: faker.random.number(500),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        dob: faker.date.past(),
        sectorID: faker.random.number(500),
        idType: faker.random.arrayElement(['NRC', 'Passport', 'License']),
        idNumber: faker.random.alphaNumeric(10),
        address: faker.address.secondaryAddress(),
        occupation:faker.random.arrayElement(['Employed', 'Unemployed', 'Student']),
        phone: faker.phone.phoneNumber('+260 9## ### ###'),
        type: faker.random.arrayElement(['Individual', 'Corporate']),
        gender: faker.random.arrayElement(['Male', 'Female']),
        status: faker.random.arrayElement(['Active', 'Inactive']),
        createdBy: `${faker.name.firstName()} ${faker.name.lastName()}`
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
