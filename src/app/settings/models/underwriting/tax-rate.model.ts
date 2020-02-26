import * as faker from 'faker';


export interface ITaxRate {
    startRange: number;
    endRange: number;
    rateType: string;
    rate: number;
    revenueItem: string;
    isActive: boolean;
    isMandatory: boolean;
}


const createTaxRate = () => {
    const taxRate: ITaxRate = {
        startRange: faker.random.number(100),
        endRange: faker.random.number(100),
        rateType: faker.random.word(),
        rate: faker.random.number(100),
        revenueItem: faker.random.words(2),
        isActive: faker.random.boolean(),
        isMandatory: faker.random.boolean(),
    }

    return taxRate;
}


export const generateTaxRates = () => {
    let taxRates: ITaxRate[] = [];
    for (let i = 0; i <= 5; i++) {
        taxRates.push(createTaxRate());
    }
    return taxRates;
}