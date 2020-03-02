import * as faker from 'faker';
import { IAccount } from '../models/organizational/account.model';

export const createAccount = () => {
    const account: IAccount = {
        accountId: faker.finance.account(),
        accountName: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber('+260 9## ### ###'),
        pinNumber: faker.random.number(),
        bank: faker.company.companyName(),
        bankBranch: faker.address.county(),
        paymentMode: faker.random.arrayElement(['Cash', 'Chaque']),
        contactTitle: faker.name.title(),
        accountShortDescription: faker.finance.accountName(),
        status: faker.random.arrayElement(['Active', 'Inactive'])
    };
    return account;
}

export const generateAccounts = () => {
    let accounts: IAccount[] = [];
    for(let i = 0; i <= 250; i++) {
        accounts.push(createAccount());
    }
    return accounts;
}