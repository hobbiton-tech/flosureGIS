import * as faker from 'faker';
import { ICurrency } from '../models/organizational/Currency.model'

const createCurrency = () => {
    const currency: ICurrency = {
        name: faker.finance.currencyName(),
        symbol: faker.finance.currencySymbol()
    };
    return currency;
}

export const generateCurrency = () => {
    let currencies: ICurrency[] = [];
    for (let i = 0; i <= 19; i++) {
        currencies.push(createCurrency());
    }

    return currencies;
}