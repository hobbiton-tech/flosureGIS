import * as faker from 'faker';

export interface IProductSubclass {
    subClassId: number;
    subClassName: string;
    riskIdFormat: string;
    isUnique: boolean;
    activeIndicator: boolean;
}


const createProductSubclass = () => {
    const productSubclass: IProductSubclass = {
        subClassId: faker.random.number(100),
        subClassName: faker.random.word(),
        riskIdFormat: faker.random.alphaNumeric(5),
        isUnique: faker.random.boolean(),
        activeIndicator: faker.random.boolean(), 
    }

    return productSubclass;
}

export const generateProductSubclasses = () => {
    let productSubclasses: IProductSubclass[] = [];
    for (let i = 0; i <= 8; i++) {
        productSubclasses.push(createProductSubclass());
    }

    return productSubclasses;
}