import { BodyType, RiskModel } from './quote.model';

export class VehicleDetailsModel {
    id?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    yearOfManufacture?: string;
    regNumber?: string;
    engineNumber?: string;
    chassisNumber?: string;
    color?: string;
    cubicCapacity?: string;
    seatingCapacity?: string;
    bodyType?: BodyType;
    risk?: RiskModel;
}
