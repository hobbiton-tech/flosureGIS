import * as faker from 'faker';

export interface ICoverTypePremium {
    id: number;
    itemName: string;
    order: string;
    isMandatory: boolean;
    isIntegrated: boolean;
}


const createCoverTypePremium = () => {
    const coverTypePremium: ICoverTypePremium = {
        id: faker.random.number(10),
        itemName: faker.random.word(),
        order: faker.random.word(),
        isMandatory: faker.random.boolean(),
        isIntegrated: faker.random.boolean(),
    }
    return coverTypePremium;
}

export const generateCoverTypePremiums = () => {
    let coverTypePremiums: ICoverTypePremium[] = [];
    for (let i = 0; i <= 12; i++) {
        coverTypePremiums.push(createCoverTypePremium())
    }    
    return coverTypePremiums;
}