import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root',
})
export class SaveCertificateMutation extends Mutation {
    document = gql`
        mutation addCerficate(
            $clientId: String!
            $policyNumber: String!
            $certificateUrl: String!
        ) {
            insert_certificate(
                objects: {
                    client_id: $clientId
                    policy_number: $policyNumber
                    certificate_url: $certificateUrl
                }
            ) {
                returning {
                    client_id
                    policy_number
                }
            }
        }
    `;
}
