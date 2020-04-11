export class IReceiptModel {
    id: string;
    receiptNumber: string;
    tpinNumber: number;
    onBehalfOf: string;
    address: string;
    sumInWords: string;
    dateRecieved: string;
    paymentMethod: string;
    policyNumber: string;
    todayDate: string;
    sumInDigits: number;
    capturedBy: string;
    receivedFrom: string;
    receiptType: string;
}
