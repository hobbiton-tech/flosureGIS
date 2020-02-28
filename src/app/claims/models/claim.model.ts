import * as faker from 'faker';

export interface IClaim {
    claimId: number;
    riskId: number;
    policyNumber: string;
    clientName: string;
    lossDate: Date;
    status: ClaimStatus;
    notificationDate: Date;
    bookedBy: string;
}

export type ClaimStatus = '' | '' | '';


const createClaim = () => {
    const claim: IClaim = {
        claimId: faker.random.number(100),
        riskId: faker.random.number(100),
        policyNumber: faker.vehicle.vin(),
        clientName: `${faker.name.firstName()} ${faker.name.lastName()}`,
        lossDate: faker.date.past(),
        status: faker.random.arrayElement(['', '', '']),
        notificationDate: faker.date.past(),
        bookedBy: `${faker.name.firstName()} ${faker.name.lastName()}`
    }
    return claim;
}

export const generateClaimsList = () => {
    let claims: IClaim[] = [];
    for (let i = 0; i <= 122; i++){
        claims.push(createClaim());
    }
    return claims;
}