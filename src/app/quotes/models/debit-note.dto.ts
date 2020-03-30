export interface IDebitNoteDTO {
    companyTelephone: number;
    companyEmail: string;
    vat: number;
    pin: number;
    todayDate: string;
    agency: string;
    nameOfInsured: string;
    addressOfInsured: string;
    ref: string;
    policyNumber: string;
    endorsementNumber: string;
    regarding: string;
    classOfBusiness: string;
    brokerRef: string;
    fromDate: string;
    toDate: string;
    currency: string;
    basicPremium: number;
    insuredPremiumLevy: number;
    netPremium: number;
    processedBy: string;
}
