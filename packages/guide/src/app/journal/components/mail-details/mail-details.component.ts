import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { MailData, UiIcon } from "@ci/data-types";
import { ListDetailService } from "../../../shared/components/list-detail-container/list-detail.service";
import { CardComponent } from "../../../shared/components/card/card.component";
import { UiIconComponent } from "../../../shared/components/ui-icon/ui-icon.component";
import { MailComponent } from "../mail/mail.component";
import { EffectComponent } from "../../../shared/components/effect/effect.component";
import { MatTooltip } from "@angular/material/tooltip";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'app-mail-details',
    templateUrl: './mail-details.component.html',

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        CardComponent,
        UiIconComponent,
        MailComponent,
        EffectComponent,
        MatTooltip,
        TranslatePipe
    ]
})
export class MailDetailsComponent {

    mail = input.required<MailData>()
    listDetails = inject(ListDetailService)
    protected readonly uiIcon = UiIcon;
}
