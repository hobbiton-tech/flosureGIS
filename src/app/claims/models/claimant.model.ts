import { IDType, GenderType } from 'src/app/clients/models/clients.model';

export interface IClaimant {
  id?: string;
  firstName: string;
  lastName: string;
  idType: string;
  idNumber: string;
  phone: string;
  email: string;
  address: string;
  vehicleRegNumber: string;
  engineNumber: string;
  color: string;
  vehicleType: string;
}

export type ClaimantType = 'Insured' | 'Third Party' | 'Other';
