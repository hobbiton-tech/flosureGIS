import { BodyType } from './quote.model';

export class VehicleDetailsModel {
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
}
