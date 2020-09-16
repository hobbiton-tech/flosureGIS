export interface IBankAccount {
    id?: string;
    bank: string;
    branch: string;
    accountName: string;
    accountNumber: string;
    accountType: BankAccountType;
}

export type BankAccountType = 'ZMW' | 'USD';
