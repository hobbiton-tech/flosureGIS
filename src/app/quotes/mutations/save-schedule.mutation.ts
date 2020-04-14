import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root',
})
export class SaveScheduleMutation extends Mutation {
    document = gql`
        mutation addSchedule(
            $clientId: String!
            $policyNumber: String!
            $scheduleUrl: String!
        ) {
            insert_policy_schedule(
                objects: {
                    client_id: $clientId
                    policy_number: $policyNumber
                    schedule_url: $scheduleUrl
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
