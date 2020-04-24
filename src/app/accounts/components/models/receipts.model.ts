export class IReceiptModel {
    id: string;
    receiptNumber?: string;
    tpinNumber?: number;
    onBehalfOf: string;
    address?: string;
    sumInWords?: string;
    dateRecieved?: Date;
    paymentMethod: string;
    policyNumber: string;
    todayDate: Date;
    sumInDigits: number;
    capturedBy: string;
    receivedFrom: string;
    narration: string;
    receiptType: string;
    receiptStatus: ReceiptStatus;
    remarks?: string;
}

export type ReceiptStatus = 'Receipted' | 'Cancelled';
