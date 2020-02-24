export interface IProduct {
    productId: number;
    productName: string;
    policyPrefix: string;
    claimPrefix: string;
    minPremium: number;
    interfaceType: string;
    riskNote: string;
    isMultiSubClass: boolean;
    isRenewable: boolean;
    isMotorProduct: boolean;
    isInstallmentAllowed: boolean;
    isMidnightExpiry: boolean;
    isAgeApplicable: boolean;
    isActiveIndicator: boolean;
}