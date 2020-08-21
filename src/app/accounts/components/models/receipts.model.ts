export class IReceiptModel {
    ID?: number;
    receipt_number?: string;
    on_behalf_of: string;
    date_received?: Date;
    payment_method: string;
    today_date: Date;
    sum_in_digits: number;
    captured_by: string;
    received_from: string;
    narration: string;
    receipt_type: string;
    receipt_status: string;
    remarks?: string;
    source_of_business?: string;
    intermediary_name?: string;
    cheq_number?: string;
    invoice_number?: string;
    currency?: string;
}


export type SourceOfBusinessType =
    | 'Direct'
    | 'Broker'
    | 'Agent'
    | 'Sales Representative';
// export type ReceiptStatus = 'Receipted' | 'Cancelled' | 'Reinstated';
