import { IBankAccount } from './bank-account.model';
import { ApprovalStatus } from 'src/app/accounts/components/models/requisition.model';

export interface IRequisitionPayment {
    id?: string;
    voucherNumber: string;
    date: Date;
    bankAccount: IBankAccount;
    currency?: string;
    amount: number;
    payee: string;
    authorizedBy?: string;
    authorizationDate?: Date;
    preparedBy: string;
    requestDate: Date;
    paymentType: string;
    narrative: string;
    chequeNumber?: string;
    approvalSatus: ApprovalStatus;
    specialInstructions?: string;
}
