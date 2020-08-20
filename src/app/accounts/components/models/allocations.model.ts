
export class AllocationReceipt {
  ID?: number;
  receipt_number: string;
  intermediary_id: string;
  amount: number;
  allocated_amount: number;
  intermediary_type: string;
  status:string;
}


export  class AllocationPolicy {
  ID?: number;
  policy_number: string;
  client_id: string;
  gross_amount: number;
  net_amount_due: number;
  settlements: number;
  balance: number;
  commission_due: number;
  status:string;
}


