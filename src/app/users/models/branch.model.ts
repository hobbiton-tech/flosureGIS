export class BranchModel {

  ID?: number;
  name: string;
  branch_code: number;
  description: string;
  SalesPoint?: SalesPoint[];

}

export class SalesPoint {

  ID?: number;
  name: string;
  sop_code: number;
  description: string;
  branch_id: number;
}
