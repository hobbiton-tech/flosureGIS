import { Quote } from 'src/app/quotes/models/quote.model';
import { Claim } from 'src/app/claims/models/claim.model';
import { AccountDetails } from './account-details.model';

export interface IIndividualClient {
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
    dateOfBirth: Date;
    dateCreated: Date;
    dateUpdated: Date;
    occupation: OccupationType;
    clientType: ClientType;
    status: ClientStatus;
    // accountDetails: AccountDetails;
    sector: string;
    accountName: string;
    accountNumber: number;
    bank: string;
    branch: string;
    accountType: string;
    // quotes: Quote[];
    // claims: Claim[];
}

export interface ICorporateClient {
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
    dateCreated: Date;
    dateUpdated: Date;
    clientType: ClientType;
    status: ClientStatus;
    accountName: string;
    accountNumber: number;
    bank: string;
    branch: string;
    accountType: string;
    // accountDetails: AccountDetails;
    // quotes: Quote[];
    // claims: Claim[];
}

export type ClientType = 'Individual' | 'Corporate';
export type OccupationType = 'Employed' | 'Unemployed' | 'Student';
export type GenderType = 'Male' | 'Female';
export type IDType = 'NRC' | 'Passport' | 'License';
export type ClientStatus = 'Active' | 'Inactive';
