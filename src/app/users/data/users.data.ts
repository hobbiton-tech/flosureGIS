import * as faker from 'faker';
import { User } from '../models/users.model';

const createUser = () => {
    const user: User = {
        userID: faker.random.number(10),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        roleID: faker.random.alphaNumeric(7)
    };

    return user;
};

export const generateUsers = () => {
    const users: User[] = [];
    for (let i = 0; i <= 230; i++) {
        users.push(createUser());
    }

    return users;
};
