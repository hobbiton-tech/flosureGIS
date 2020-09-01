export class RolesModel{
  ID?: number;
  name: string;
  description: string;
}

export class PermissionsModel{
  ID?: number;
  name: string;
  description: string;
  role_id: number;
}
