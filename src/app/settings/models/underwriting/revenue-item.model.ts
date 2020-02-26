import * as faker from 'faker';

export interface IRevenueItem {
    itemId: number;
    itemDescription: string;
    debitAmount: number;
    creditAmount: number;
}


const createRevenueItem = () => {
    const item: IRevenueItem = {
        itemId: faker.random.number(100),
        itemDescription: faker.random.words(10),
        debitAmount: faker.random.number(200000),
        creditAmount: faker.random.number(200000),
    }
    return item;
}

export const generateRevenueItems = () => {
    let items: IRevenueItem[] = [];
    for (let i = 0; i <= 4; i++) {
        items.push(createRevenueItem())
    }
    return items;
}