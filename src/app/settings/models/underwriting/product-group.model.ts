import * as faker from 'faker';

export interface IProductGroup {
    groupName: string;
    groupType: string;
}


const createProductGroup = () => {
    const productGroup: IProductGroup = {
        groupName: faker.random.word(),
        groupType: faker.random.words(3),
    }

    return productGroup;
}

export const generateProductGroups = () => {
    let productGroups: IProductGroup[] = [];
    for (let i = 0; i <= 123; i++){
        productGroups.push(createProductGroup());
    }

    return productGroups;
}

