
export interface IDiscountType {
    type: DiscountType;
    description: string;
}

export type DiscountType = 'No_Claims' | 'Loyalty' | 'Valued_Client' | 'Low_Term_Agreement';
