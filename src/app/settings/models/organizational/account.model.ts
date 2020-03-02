export interface IAccount {
    accountId: string;
    accountName: string;
    email: string;
    phone: string;
    pinNumber: number;
    bank: string;
    bankBranch: string;
    paymentMode: paymentMode;
    contactTitle: string;
    accountShortDescription: string;
    status: AccountStatus;
}

export type AccountStatus = "Active" | "Inactive"
export type paymentMode = "Cash" | "Chaque"