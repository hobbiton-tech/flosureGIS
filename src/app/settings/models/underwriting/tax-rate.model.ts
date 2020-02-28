export interface ITaxRate {
    startRange: number;
    endRange: number;
    rateType: string;
    rate: number;
    revenueItem: string;
    isActive: boolean;
    isMandatory: boolean;
}