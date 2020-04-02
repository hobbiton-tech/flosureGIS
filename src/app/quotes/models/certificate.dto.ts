export interface ICertificateDTO {
    certificateNumber: string;
    policyNumber: string;
    clientName: string;
    nameOfInsured: string;
    address: string;
    phone: string;
    email: string;
    coverType: string;
    startDate: Date;
    expiryDate: Date;
    sumInsured: number;
    regMark: string;
    makeAndType: string;
    engine: string;
    chassisNumber: string;
    yearOfManufacture: string;
    color: string;
    branch: string;
    timeOfIssue: Date;
    dateOfIssue: Date;
    thirdPartyPropertyDamage: number;
    thirdPartyInuryAndDeath: number;
    thirdPartyBoodilyInjury_DeathPerEvent: number;
    town: string;
}
