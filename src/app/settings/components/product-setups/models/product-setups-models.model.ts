export interface IClass {
    id: string;
    name: string;
    code: string;
    description: string;
    policyNumberPrefix: string;
    claimNumberPrefix: string;
    Product: IProduct[];
}

export interface IProduct {
    id: string;
    name: string;
    code: string;
    description: string;
    policyNumberPrefix: string;
    claimNumberPrefix: string;
}

export interface ICoverType {}

export interface IPeril {}
