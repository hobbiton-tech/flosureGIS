export interface IAccount {
    accountId: number;
    accountName: string;
    email: string;
    phone: string;
    pinNumber: number;
    bank: string;
    bankBranch: string;
    paymentMode: string;
    contactTitle: string;
    accountShortDescription: string;
    status: AccountStatus;
}

export type AccountStatus = "Active" | "Inactive"