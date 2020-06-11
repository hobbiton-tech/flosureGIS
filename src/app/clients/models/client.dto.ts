import { ITimestamp } from 'src/app/settings/components/insurance-companies/models/insurance-company.model';

export interface IIndividualClientDto {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phone: string;
    maritalStatus: string;
    nationality: string;
    clientID: string;
    gender: GenderType;
    address: string;
    idType: IDType;
    idNumber: string;
    dateOfBirth: Date | ITimestamp;
    dateCreated: Date | ITimestamp;
    dateUpdated: Date | ITimestamp;
    occupation: OccupationType;
    clientType: ClientType;
    status: ClientStatus;
    sector: string;
    accountName: string;
    accountNumber: number;
    bank: string;
    branch: string;
    accountType: string;
}

export interface ICorporateClientDto {
    id: string;
    phone: string;
    registrationNumber: string;
    address: string;
    clientID: string;
    contactFirstName: string;
    contactLastName: string;
    contactEmail: string;
    companyName: string;
    taxPin: number;
    dateCreated: Date | ITimestamp;
    dateUpdated: Date | ITimestamp;
    clientType: ClientType;
    status: ClientStatus;
    accountName: string;
    accountNumber: number;
    bank: string;
    branch: string;
    accountType: string;
}

export type ClientType = 'Individual' | 'Corporate';
export type OccupationType = 'Employed' | 'Unemployed' | 'Student';
export type GenderType = 'Male' | 'Female';
export type IDType = 'NRC' | 'Passport' | 'License';
export type ClientStatus = 'Active' | 'Inactive';
