import * as faker from 'faker';

export class Claim {
    claimId: number;
    riskId: number;
    policyNumber: string;
    clientName: string;
    lossDate: Date;
    status: ClaimStatus;
    notificationDate: Date;
    bookedBy: string;
}

export type ClaimStatus = 'Pending' | 'Resolved' | 'Cancelled';

const createClaim = () => {
    const claim: Claim = {
        claimId: faker.random.number(100),
        riskId: faker.random.number(100),
        policyNumber: faker.internet.ipv6(),
        clientName: `${faker.name.firstName()} ${faker.name.lastName()}`,
        lossDate: faker.date.past(),
        status: faker.random.arrayElement(['Pending', 'Resolved', 'Cancelled']),
        notificationDate: faker.date.past(),
        bookedBy: `${faker.name.firstName()} ${faker.name.lastName()}`
    };
    return claim;
};

export const generateClaimsList = () => {
    const claims: Claim[] = [];
    for (let i = 0; i <= 122; i++) {
        claims.push(createClaim());
    }
    return claims;
};
