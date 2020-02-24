export class Client {
    clientID: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    type: ClientType;
    status: ClientStatus;
    createdBy: string;
}

export type ClientType = 'Individual' | 'Corporate';
export type ClientStatus = 'Active' | 'Inactive';
