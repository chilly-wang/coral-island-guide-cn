import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { MailData } from '@ci/data-types';
import { TranslatePipe } from '@ngx-translate/core';

import { LocalizedEntityNamePipe } from '../../../shared/pipes/localized-display.pipe';

@Component({
    selector: 'app-mail',
    templateUrl: './mail.component.html',
    styles: [
        `
            :host {
                display: block;
            }
        `,
    ],

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [LocalizedEntityNamePipe, TranslatePipe],
})
export class MailComponent {
    mail = input.required<MailData>();

    parsedMail = computed(() => this._parseTexts(this.mail()));

    private _parseTexts(mail: MailData): MailData {
        const mailCopy = { ...mail };

        const keys = ['title', 'sender', 'content', 'greetCloseMessage'] as const;

        keys.forEach((key) => {
            let mailCopyElement: string | null = mailCopy[key];
            if (mailCopyElement) {
                mailCopyElement = mailCopyElement.replaceAll(
                    /<PlayerName>\$player<\/>/gim,
                    '<span class="text-[#69ac52]">Player</span>',
                );

                const replaceValue = key === 'content' ? '<span class="text-accent">$1</span>' : '$1';

                mailCopyElement = mailCopyElement.replaceAll(/<NPCName>(.*?)<\/>/gim, replaceValue);
                mailCopyElement = mailCopyElement.replaceAll(/<items>(.*?)<\/>/gim, replaceValue);
                mailCopyElement = mailCopyElement.replaceAll(/<RickText.Place>(.*?)<\/>/gim, replaceValue);
                mailCopyElement = mailCopyElement.replaceAll(/<Places>(.*?)<\/>/gim, replaceValue);

                mailCopy[key] = mailCopyElement;
            }
        });

        return mailCopy;
    }
}
