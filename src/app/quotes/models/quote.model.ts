export class Quote {
    quoteNumber: number;
    revisionNumber: number;
    startDate: Date;
    endDate: Date;
    client: string;
    status: QuoteStatus;
    preparedBy: string;
}

export type QuoteStatus = 'Draft' | 'Confirmed';
