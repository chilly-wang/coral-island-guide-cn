import { Component, input, output, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { BirthdayDashboardEntry, MinimalItem, UiIcon } from '@ci/data-types';
import { UiIconComponent } from '../../../shared/components/ui-icon/ui-icon.component';
import { RouterLink } from '@angular/router';
import { ItemIconComponent } from '../../../shared/components/item-icon/item-icon.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizedDisplayPipe } from '../../../shared/pipes/localized-display.pipe';

import { LocalizedEntityNamePipe } from '../../../shared/pipes/localized-display.pipe';

@Component({
    selector: 'app-birthday-dashboard',
    imports: [
        LocalizedEntityNamePipe,
        UiIconComponent,
        RouterLink,
        ItemIconComponent,
        TranslatePipe,
        LocalizedDisplayPipe,
    ],
    templateUrl: './birthday-dashboard.component.html',
    styleUrl: './birthday-dashboard.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    host: {
        class: 'flex flex-col gap-3',
    },
})
export class BirthdayDashboardComponent {
    birthdays = input.required<BirthdayDashboardEntry[]>();
    itemClicked = output<MinimalItem>();
    protected readonly UiIcon = UiIcon;
    protected readonly uiIcon = UiIcon;
}
