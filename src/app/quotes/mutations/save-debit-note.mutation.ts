import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root',
})
export class SaveDebitNoteMutation extends Mutation {
    document = gql`
        mutation addDebitNote(
            $clientId: String!
            $policyNumber: String!
            $debitNoteUrl: String!
        ) {
            insert_debit_note(
                objects: {
                    client_id: $clientId
                    policy_number: $policyNumber
                    debit_note_url: $debitNoteUrl
                }
            ) {
                returning {
                    client_id
                    debit_note_url
                }
            }
        }
    `;
}
