import { IProvince } from './province.model';

export interface ICity {
    id?: string;
    name: string;
    code: string;
    province?: IProvince;
}
