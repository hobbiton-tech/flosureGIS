import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root',
})
export class SaveQuoteMutation extends Mutation {
    document = gql`
        mutation addQuote(
            $clientId: String!
            $quoteNumber: String!
            $quoteUrl: String!
        ) {
            insert_quote(
                objects: {
                    client_id: $clientId
                    quote_number: $quoteNumber
                    quote_url: $quoteUrl
                }
            ) {
                returning {
                    client_id
                    quote_number
                }
            }
        }
    `;
}
