import * as faker from 'faker';

export interface IClaimant {
    clientName: string;
    occuptation: string;
    identificationNumber: string;
    identificationType: IdentificationType;
    address: string;
    mobileNumber: string;
}

export type IdentificationType = 'NRC' | 'Passport';

const createClaimant = () => {
    const claimant: IClaimant = {
        clientName: `${faker.name.firstName()} ${faker.name.lastName()}`,
        occuptation: faker.name.jobTitle(),
        identificationNumber: faker.address.zipCode(),
        identificationType: faker.random.arrayElement(['NRC', 'Passport']),
        address: faker.name.jobArea(),
        mobileNumber: faker.phone.phoneNumber('+260 9## ### ###'),
    };

    return claimant;
};

const generateClaimants = () => {
    let claimants: IClaimant[] = [];
    for (let i = 0; i < 128; i++) {
        claimants.push(createClaimant());
    }
    return claimants;
};
