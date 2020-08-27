export interface IInsuranceCompany {
    id: string;
    companyName: string;
    registrationNumber?: string;
    tPin?: string;
    physicalAddress: string;
    postalAddress?: string;
    phone: string;
    email: string;
}
