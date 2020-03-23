export class Claim {
    id: string;
    claimId: string;
    policyNumber: string;
    clientName: string;
    lossDate: Date;
    status: ClaimStatus;
    notificationDate: Date;
    bookedBy: string;
    serviceProvider: string;
    serviceType: string;
    claimDescription: string;
    risk: string;
    activity: string;
<<<<<<< HEAD
    document?: IDocument; 
}

export interface IDocument {
    name: string;
    url: string
=======
>>>>>>> 06e7fbebfa4286c6af3a7e117103027e84398a08
}

export type ClaimStatus = 'Pending' | 'Resolved' | 'Cancelled';
export interface ITimestamp {
    seconds: string;
    milliseconds: string;
}
<<<<<<< HEAD

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
        lossDate: faker.date.past(),
        status: faker.random.arrayElement(['Pending', 'Resolved', 'Cancelled']),
        notificationDate: faker.date.past(),
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
=======
>>>>>>> 06e7fbebfa4286c6af3a7e117103027e84398a08
