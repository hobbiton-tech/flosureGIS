export interface IServiceProvider {
    id: string;
    companyName: string;
    serviceProvider: string;
    tpin: number;
    physicalAddress: string;
    postal: string;
    phoneNumber: string;
    email: string;
    repName: string;
    repNumber: string;
    repEmail: string;
}

export interface ILossAdjustor {
    id: string;
    name: string;
    physicalAddress: string;
    postal: string;
    phoneNumber: string;
    email: string;
    repName: string;
    repNumber: string;
    repEmail: string;
    lossAdjustorType: string;
}

export interface IIndividual {
    id: string;
    firstName: string;
    middleName: string;
    surname: string;
    idType: string;
    idNumber: string;
    gender: string;
    physicalAddress: string;
    postal: string;
    phoneNumber: string;
    email: string;
    qualifications: string;
    yearsExperience: number;
    lossAdjustorType: string;
}

export interface IClaimant {
    id: string;
    firstName: string;
    middleName: string;
    surname: string;
    idType: string;
    idNumber: string;
    gender: string;
    physicalAddress: string;
    postal: string;
    phoneNumber: string;
    email: string;
    claimantType: string;
}

export interface ISalvageBuyer {
    id: string;
    firstName: string;
    middleName: string;
    surname: string;
    idType: string;
    idNumber: string;
    gender: string;
    physicalAddress: string;
    postal: string;
    phoneNumber: string;
    email: string;
}
