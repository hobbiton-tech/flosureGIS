import { ICity } from './city.model';

export interface IProvince {
    id?: string;
    name: string;
    code: string;
    cities?: ICity[];
}
