import { Component, input, output, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { GiftPreferences, MinimalItem, preferencesMap } from "@ci/data-types";
import { UiIconComponent } from "../../../shared/components/ui-icon/ui-icon.component";
import { InlineMinimalItemComponent } from "../../../shared/components/inline-minimal-item/inline-minimal-item.component";
import { LocalizedDisplayPipe } from "../../../shared/pipes/localized-display.pipe";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'app-gifting-grid',
    templateUrl: './gifting-grid.component.html',
    styleUrls: ['./gifting-grid.component.scss',],
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'gifting-preference-grid'
    },

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        UiIconComponent,
        InlineMinimalItemComponent,
        LocalizedDisplayPipe,
        TranslatePipe
    ]
})
export class GiftingGridComponent {

    readonly preferences = input.required<GiftPreferences>()
    readonly itemClicked = output<MinimalItem>();
    protected preferencesMap = preferencesMap
}
