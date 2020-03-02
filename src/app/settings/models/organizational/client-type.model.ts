export interface IClientType {
    type: ClientType;
    description: string;
}

export type ClientType = 'Individual' | 'Corporate';