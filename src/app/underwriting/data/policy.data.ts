import * as faker from 'faker';
import { Policy } from '../models/policy.model';

const createQuote = () => {
    const quote: Policy = {
        policyNumber: faker.random.alphaNumeric(10),
        endorsementNumber: faker.random.alphaNumeric(10),
        product: faker.random.word(),
        startDate: faker.date.past(),
        endDate: faker.date.future(),
        client: `${faker.name.firstName()} ${faker.name.lastName()}`,
        insuranceCompany: faker.company.companyName(),
        currency: faker.random.arrayElement(['ZMW', 'Dollar']),
        status: faker.random.arrayElement(['Lapsed', 'Active', 'Cancelled', 'Expired']),
        preparedBy: `${faker.name.firstName()} ${faker.name.lastName()}`
    };

    return quote;
};

export const generatePolicies = () => {
    const policies: Policy[] = [];
    for (let i = 0; i <= 230; i++) {
        policies.push(createQuote());
    }

    return policies;
};

