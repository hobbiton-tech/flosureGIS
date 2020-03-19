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
}

export interface IIndividualClient extends IClient {
    title: string;
    gender: GenderType;
    idType: IDType;
    idNumber: string;
    dateOfBirth: Date;
    occupation: string;
}

export interface ICorporateClient extends IClient {
    companyName: string;
    taxPin: number;
}

export type CombinedClients = IIndividualClient & ICorporateClient;

export type ClientType = 'Individual' | 'Corporate';
export type OccupationType = 'Employed' | 'Unemployed' | 'Student';
export type GenderType = 'Male' | 'Female';
export type IDType = 'NRC' | 'Passport' | 'License';
export type ClientStatus = 'Active' | 'Inactive';
