export class CPaymentModel {
  ID?: number;
  agent_id: string;
  agent_name: string;
  agent_type: string;
  commission_amount: number;
  paid_amount: number;
  remaining_amount:number;
  status: string;
}
