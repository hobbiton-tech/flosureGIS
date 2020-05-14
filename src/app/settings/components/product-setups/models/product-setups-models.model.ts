export interface IClass {
    id: string;
    className: string;
    classCode: number;
    classDescription: string;
    classPolicyNumberPrefix: string;
    classClaimNumberPrefix: string;
    products: IProduct[];
}

export interface IProduct {
    id: string;
    productName: string;
    productCode: number;
    productDescription: string;
    productPolicyNumberPrefix: string;
    productClaimNumberPrefix: string;
}

export interface ICoverType {}

export interface IPeril {}
