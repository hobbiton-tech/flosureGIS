import { RiskModel } from '../quote.model';
import { IProvince } from 'src/app/settings/components/location-setups/models/province.model';
import { ICity } from 'src/app/settings/components/location-setups/models/city.model';

export class PropertyDetailsModel {
    id?: string;
    propertyId?: string;
    propertyDescription?: string;
    subClass?: string;
    roofType?: string;
    city?: ICity;
    province?: IProvince;
    address?: string;
    propertyUse?: string;
    risk?: RiskModel;
}
