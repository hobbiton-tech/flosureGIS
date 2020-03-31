export interface IAgent {
    id: string;
    agentID: string;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    dateCreated: Date;
    dateUpdated: Date;
    userType: UserType;
}

export type UserType = 'Agent' | 'Broker';
