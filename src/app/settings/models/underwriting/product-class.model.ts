import * as faker from 'faker';

export interface ProductClass {
    classId: number;
    className: string;
}

const createProductClass = () => {
    const procuctClass: ProductClass = {
        classId: faker.random.number(100),
        className: faker.random.word()
    }

    return procuctClass;
}

export const generateProductClasses = () => {
    let productClassList: ProductClass[] = [];
    for (let i = 0; i <= 25; i++) {
        productClassList.push(createProductClass());
    }
    return productClassList;
}