export interface IVehicleType {
    id: string;
    vehicleType: string;
    description: string;
}
export interface IVehicleMake {
    id: string;
    vehicleMake: string;
    description: string;
    vehicleModels: IVehicleModel
}

export interface IVehicleModel {
    id: string;
    vehicleModel: string;
    vehicleMakeName: string;
    description: string;
}
