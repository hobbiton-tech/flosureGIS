export class DiscountModel {
    selectedDiscountValue: IDiscountValueModel;
    selectedDiscountInputValue: DiscountInputType;
    discountAmount?: number;
    discountRate?: number;
    discounts?: IDiscounts[];
    discountsTotal: number;
}

export interface IDiscountValueModel {
    label: string;
    value: string;
}

export interface IDiscounts {
    discountType: string;
    amount: number;
}

export type DiscountInputType = 'amount' | 'rate';
