export interface IServiceProvider {
    id: string;
    name: string;
    type: ServiceProviderType;
    tPin?: string;
    physicalAddress: string;
    postalAddress?: string;
    phone: string;
    emailAddress: string;
    representativeFirsName?: string;
    representativeLastName?: string;
    representativePhone: string;
    representativeEmail: string;
}

export type ServiceProviderType = 'Garage' | 'Repairers' | 'Panel Beaters';
