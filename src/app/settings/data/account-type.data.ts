import * as faker from 'faker';
import { IAccountType } from '../models/organizational/account-type.model';

const createAccountType = () => {
    const accountType: IAccountType = {
        type: faker.random.words(1),
        shortDescription: faker.random.words(3),
        accountType: faker.finance.accountName(),
        commissionRate: faker.random.number(10),
        vatRate: faker.random.number(5),
        withholdingTaxRate: faker.random.number(15)
    };
    return accountType;
}

export const generateAccountTypes = () => {
    let accountTypes: IAccountType[] = [];
    for(let i = 0; i <= 250; i++) {
        accountTypes.push(createAccountType());
    }
    return accountTypes;
}