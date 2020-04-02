export interface IDebitNoteDTO {
    companyTelephone: string;
    companyEmail: string;
    vat: string;
    pin: string;
    todayDate: Date;
    agency: string;
    nameOfInsured: string;
    addressOfInsured: string;
    ref: string;
    policyNumber: string;
    endorsementNumber: string;
    regarding: string;
    classOfBusiness: string;
    brokerRef: string;
    fromDate: Date;
    toDate: Date;
    currency: string;
    basicPremium: number;
    insuredPremiumLevy: number;
    netPremium: number;
    processedBy: string;
}
