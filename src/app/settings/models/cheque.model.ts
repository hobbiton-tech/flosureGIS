import { IBankAccount } from './bank-account.model';

export interface IChequeModel {
    id?: string;
    bankAccount: IBankAccount;
    chequeFrom: number;
    chequeTo: number;
    chequeNextCount?: number;
    chequeNumber?: number;
    chequeLot: string;
}
