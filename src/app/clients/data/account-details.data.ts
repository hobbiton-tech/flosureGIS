import * as faker from 'faker';
import { AccountDetails} from '../models/account-details.model';

const accountDetail = () => {
	const account: AccountDetails = {
		accountName: faker.name.lastName(),
		accountNumber: faker.random.number(10),
		bank: faker.company.companyName(),
		branch: faker.company.companyName()
	};
	return account
};

export const generateAccountDetails = () => {
    let accountDetails: AccountDetails[] = [];
    for (let i = 0; i <= 230; i++) {
        accountDetails.push(accountDetail());
    }

    return accountDetails;
};
