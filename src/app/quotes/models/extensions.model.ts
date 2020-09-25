import { IExtension } from 'src/app/settings/models/underwriting/clause.model';

export class ExtensionModel {
    selectedExtensionValue: IExtension;
    selectedExtensionInputValue?: ExtensionInputType;
    extensionAmount?: number;
    extensionValue?: number;
    extensionRate?: number;
    extensions?: IExtensions[];
    extensionsTotal?: number;
}

export interface IExtensionValueModel {
    label: string;
    value: string;
}

export interface IExtensions {
    extensionType: string;
    amount: number;
    productId?: string;
}

export type ExtensionInputType = 'amount' | 'rate';
