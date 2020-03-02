import * as faker from 'faker';

export interface ICoverType {
    id: number;
    coverTypeName: string;
    isDefault: boolean;
    minPremium: number;
}


const createCoverType = () => {
    let coverType: ICoverType = {
        id: faker.random.number(12),
        coverTypeName: faker.random.word(),
        isDefault: faker.random.boolean(),
        minPremium: faker.random.number(3000)
    }
    return coverType;
}


export const generateCoverTypes = () => {
    let coverTypes: ICoverType[] = [];
    for (let i = 0; i <= 5; i++) {
        coverTypes.push(createCoverType());
    }
    return coverTypes;
}