import { Injectable } from '@angular/core';
import { SaveQuoteMutation } from '../mutations/save-quote.mutation';
import { SaveCertificateMutation } from '../mutations/save-certificate.mutation';
import { SaveScheduleMutation } from '../mutations/save-schedule.mutation';
import { SaveDebitNoteMutation } from '../mutations/save-debit-note.mutation';

export interface ICertififcateDocument {
    clientId: string;
    policyNumber: string;
    certificateUrl: string;
}

export interface IDebitNoteDocument {
    clientId: string;
    policyNumber: string;
    debitNoteUrl: string;
}

// There is another IQuotedocument somewhere.
export interface IQuoteDocument {
    clientId: string;
    quoteNumber: string;
    quoteUrl: string;
}

export interface IScheduleDocument {
    clientId: string;
    policyNumber: string;
    scheduleUrl: string;
}

@Injectable({
    providedIn: 'root',
})
export class QuotesGraphqlService {
    constructor(
        private saveQuote: SaveQuoteMutation,
        private saveCertificate: SaveCertificateMutation,
        private saveSchedule: SaveScheduleMutation,
        private saveDebitNote: SaveDebitNoteMutation
    ) {}

    async addQuote(doc: IQuoteDocument) {
        return this.saveQuote.mutate(doc);
    }

    async addCertificate(doc: ICertififcateDocument) {
        return this.saveCertificate.mutate(doc);
    }

    async addSchedule(doc: IScheduleDocument) {
        return this.saveSchedule.mutate(doc);
    }

    async addDebitNote(doc: IDebitNoteDocument) {
        return this.saveDebitNote.mutate(doc);
    }
}
