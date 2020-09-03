import { BranchModel } from './branch.model';
import { PermissionsModel, RolesModel } from './roles.model';
import { DepartmentModel } from '../../settings/models/department/department.model';

export class UserModel {
  ID?: number;
  first_name: string;
  surname: string;
  email: string;
  department_id: number;
  branch_id: number;
  role?: string;
  phone_number: string;
  password: string;
  job_title: string;
  error?: string;
  Branch?: BranchModel;
  Role?: RolesModel[];
  Permission?: PermissionsModel[];
  Department?: DepartmentModel;
  token?: string;
}


export class UserRolePermissionModel {
  user_id: number;
  role_id: number;
  permission_id: number;
}
