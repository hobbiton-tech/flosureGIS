import * as faker from 'faker';
// import * as f from 'firebase'

export class Claim {
    claimId: string;
    //riskId: number;
    policyNumber: string;
    clientName: string;
    lossDate: string | ITimestamp;
    status: ClaimStatus;
    notificationDate: string | ITimestamp;
    bookedBy: string;
    serviceProvider: string;
    serviceType: string;
    claimDescription: string;
    risk: string;
    activity: string;
    
}

export type ClaimStatus = 'Pending' | 'Resolved' | 'Cancelled';
export interface ITimestamp {
    seconds: string;
    milliseconds: string;
}

const createClaim = () => {
    const claim: Claim = {
        serviceProvider: faker.random.words(2),
        serviceType: faker.random.word(),
        claimDescription: faker.random.words(2),
        activity: faker.random.word(),
        claimId: faker.random.number(100).toString(),
        //riskId: faker.random.number(100),
        policyNumber: faker.internet.ipv6(),
        clientName: `${faker.name.firstName()} ${faker.name.lastName()}`,
        lossDate: faker.date.past().toString(),
        status: faker.random.arrayElement(['Pending', 'Resolved', 'Cancelled']),
        notificationDate: faker.date.past().toString(),
        bookedBy: `${faker.name.firstName()} ${faker.name.lastName()}`,
        risk: faker.random.words(2)
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
