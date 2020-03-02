import * as faker from 'faker';


export interface IProduct {
    productId: number;
    productName: string;
    policyPrefix: string;
    claimPrefix: string;
    minPremium: number;
    interfaceType: string;
    riskNote: string;
    isMultiSubClass: boolean;
    isRenewable: boolean;
    isMotorProduct: boolean;
    isInstallmentAllowed: boolean;
    isMidnightExpiry: boolean;
    isAgeApplicable: boolean;
    isActiveIndicator: boolean;
}


const createProduct = () => {
    const product: IProduct = {
       productId: faker.random.number(100),
       productName: faker.random.word(),
       policyPrefix: faker.random.alphaNumeric(3),
       claimPrefix: faker.random.alphaNumeric(3),
       minPremium: faker.random.number(3000),
       interfaceType: faker.random.word(),
       riskNote: faker.random.words(13),
       isMultiSubClass: faker.random.boolean(),
       isRenewable: faker.random.boolean(),
       isInstallmentAllowed: faker.random.boolean(),
       isMidnightExpiry: faker.random.boolean(),
       isAgeApplicable: faker.random.boolean(),
       isActiveIndicator: faker.random.boolean(),
       isMotorProduct: faker.random.boolean(),
    }

    return product;
}


export const generateProducts = () => {
    let productsList: IProduct[] = [];
    for (let i = 0; i <= 18; i++) {
        productsList.push(createProduct());
    }

    return productsList;
}