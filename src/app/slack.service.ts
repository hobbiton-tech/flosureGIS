import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type PortalEvent =
    | 'Portal Access Event'
    | 'Login Event'
    | 'Error Event'
    | 'Quote Event'
    | 'Receipt Event';

const colors: Record<PortalEvent, string> = {
    'Portal Access Event': '#0D4f8B',
    'Login Event': '#228B22',
    'Error Event': 'some',
    'Quote Event': 'some',
    'Receipt Event': 'some',
};

interface ISlackMessage {
    event: PortalEvent;
    title: string;
    text: string;
}

@Injectable({
    providedIn: 'root',
})
export class SlackService {
    constructor(private http: HttpClient) {}

    sendToSlack(msg: ISlackMessage): Promise<string> {
        return this.http
            .post(
                'https://hooks.slack.com/services/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',
                {
                    // tslint:disable-next-line: deprecation
                    text: event,
                    attachments: [
                        {
                            author_name: window.location.href,
                            color: colors[msg.event],
                            title: msg.title,
                            text: msg.text,
                        },
                    ],
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    responseType: 'text',
                }
            )
            .toPromise();
    }
}
