export interface IClient {
    id: string;
    clientID: string;
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    status: ClientStatus;
    phone: string;
    dateCreated: Date;
    dateUpdated: Date;
    clientType: ClientType;
    individualDetails: IIndividualDetails;
    corporateDetails: ICorporateDetails;
}

export interface IIndividualDetails {
    title: string;
    gender: GenderType;
    idType: IDType;
    idNumber: string;
    dateOfBirth: Date;
    occupation: string;
}

export interface ICorporateDetails {
    companyName: string;
    taxPin: number;
}

export type ClientType = 'Individual' | 'Corporate';
export type OccupationType = 'Employed' | 'Unemployed' | 'Student';
export type GenderType = 'Male' | 'Female';
export type IDType = 'NRC' | 'Passport' | 'License';
export type ClientStatus = 'Active' | 'Inactive';
