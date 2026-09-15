import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { TornPageData, UiIcon } from "@ci/data-types";
import { ListDetailService } from "../../../shared/components/list-detail-container/list-detail.service";
import { TornPageComponent } from "../torn-page/torn-page.component";
import { UiIconComponent } from "../../../shared/components/ui-icon/ui-icon.component";
import { CardComponent } from "../../../shared/components/card/card.component";
import { MatTooltip } from "@angular/material/tooltip";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'app-torn-page-details',
    templateUrl: './torn-page-details.component.html',

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        TornPageComponent,
        UiIconComponent,
        CardComponent,
        MatTooltip,
        TranslatePipe
    ]
})
export class TornPageDetailsComponent {
    tornPage = input.required<TornPageData>()
    listDetails = inject(ListDetailService)
    protected readonly uiIcon = UiIcon;
}
