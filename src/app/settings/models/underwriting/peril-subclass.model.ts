import * as faker from 'faker';

export interface IPerilSubclass {
    perilId: number;
    perilType: string;
    isDepOnLossType: boolean;
    limitDescription: string;
    deprecitPercent: number;
    isMandatory: boolean;
    excess: string;
    excessMax: number;
    claimExcessMax: number;
    perilSILimit: number;
    isExpireOnClaim: boolean;
    personLimit: number;
    amountLimit: number;
    excessType: string;
    excessMin: number;
    claimExcessType: string;
    claimExcessMin: number;
}


const createPerilSubclass = () => {
    const perilSubclass: IPerilSubclass = {
       perilId: faker.random.number(13),
       perilType: faker.random.word(),
       isDepOnLossType: faker.random.boolean(),
       limitDescription: faker.random.words(10),
       deprecitPercent: faker.random.number(100),
       isMandatory: faker.random.boolean(),
       excess: faker.random.words(10),
       excessMax: faker.random.number(100),
       perilSILimit: faker.random.number(100),
       isExpireOnClaim: faker.random.boolean(),
       personLimit: faker.random.number(100),
       amountLimit: faker.random.number(100),
       excessType: faker.random.word(),
       excessMin: faker.random.number(100),
       claimExcessType: faker.random.word(),
       claimExcessMax: faker.random.number(100),
       claimExcessMin: faker.random.number(100)
    }

    return perilSubclass;
}


export const generatePerilSubclasses = () => {
    let perilSubclasses: IPerilSubclass[] = [];
    for (let i = 0; i <= 34; i++) {
        perilSubclasses.push(createPerilSubclass());
    }

    return perilSubclasses;
}