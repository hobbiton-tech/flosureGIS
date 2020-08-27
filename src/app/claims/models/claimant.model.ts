import { IDType, GenderType } from 'src/app/clients/models/clients.model';

export interface IClaimant {
    id?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    type: ClaimantType;
    idNumber: string;
    idType: IDType;
    physicalAddress?: string;
    postalAddress?: string;
    phone: string;
    email?: string;
    gender?: GenderType;
}

export type ClaimantType = 'Insured' | 'Third Party' | 'Other';
