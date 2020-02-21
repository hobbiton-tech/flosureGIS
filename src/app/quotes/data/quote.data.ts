import * as faker from 'faker';
import { Quote } from '../models/quote.model';

const createQuote = () => {
    const quote: Quote = {
        quoteNumber: faker.random.number(500),
        revisionNumber: faker.random.number(200),
        startDate: faker.date.past(),
        endDate: faker.date.future(),
        client: `${faker.name.firstName()} ${faker.name.lastName()}`,
        status: faker.random.arrayElement(['Draft', 'Confirmed']),
        preparedBy: `${faker.name.firstName()} ${faker.name.lastName()}`
    };

    return quote;
};

export const generateQuotes = () => {
    let quotes: Quote[] = [];
    for (let i = 0; i <= 230; i++) {
        quotes.push(createQuote());
    }

    return quotes;
};
