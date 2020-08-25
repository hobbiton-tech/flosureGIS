
export class AllocationReceipt {
  ID?: number;
  receipt_number: string;
  intermediary_id: string;
  amount: number;
  allocated_amount: number;
  intermediary_type: string;
  intermediary_name:string;
  status:string;
  remaining_amount: number;
}


export  class AllocationPolicy {
  ID?: number;
  policy_number: string;
  client_id: string;
  gross_amount: number;
  net_amount_due: number;
  intermediary_id: string;
  intermediary_name:string;
  client_name: string;
  settlements: number;
  balance: number;
  commission_due: number;
  commission_rate: number;
  commission_included?: string;
  status:string;
}


