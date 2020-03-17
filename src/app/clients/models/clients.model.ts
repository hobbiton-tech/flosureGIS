export class Client {
  title?: string;
  companyName?: string;
  tpinNumber?: string;
  registrationNumber?: string;
  id?: string;
  clientID?: number;
  sectorID?: number;
  occupation?: OccupationType;
  address?: string;
  firstName?: string;
  idType?: IDType;
  idNumber?: string;
  lastName?: string;
  email?: string;
  dob?: Date;
  phone?: string;
  type?: ClientType;
  gender?: GenderType;
  status?: ClientStatus;
  contactFirstName?: string;
  contactLastName?: string;
  contactEmail?: string;
  createdBy?: string;
}

export type ClientType = 'Individual' | 'Corporate';
export type OccupationType = 'Employed' | 'Unemployed' | 'Student';
export type GenderType = 'Male' | 'Female';
export type IDType = 'NRC' | 'Passport' | 'License';
export type ClientStatus = 'Active' | 'Inactive';
