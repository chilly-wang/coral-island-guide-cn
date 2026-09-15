import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { type MinimalItem, UiIcon } from '@ci/data-types';
import { ListDetailContainerComponent } from '../../../shared/components/list-detail-container/list-detail-container.component';
import { DatabaseItemDetailsComponent } from '../../../shared/components/database-item-details/database-item-details.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ItemIconComponent } from '../../../shared/components/item-icon/item-icon.component';
import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { BuyAtComponent } from '../../../shared/components/database-item-details/buy-at/buy-at.component';
import { DatabaseItemDetailsDirective } from '../../../shared/directives/database-item-details.directive';
import { BaseTabbedSelectableContainerComponent } from '../../../shared/components/base-tabbed-selectable-container/base-tabbed-selectable-container.component';
import { DatabaseService } from '../../../shared/services/database.service';
import { tap } from 'rxjs';
import { LocalizedDisplayPipe } from '../../../shared/pipes/localized-display.pipe';

@Component({
    selector: 'app-bought',
    templateUrl: './bought.component.html',

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ListDetailContainerComponent,
        DatabaseItemDetailsComponent,
        MatTab,
        MatTabGroup,
        ItemIconComponent,
        AsyncPipe,
        BuyAtComponent,
        DatabaseItemDetailsDirective,
        KeyValuePipe,
        LocalizedDisplayPipe,
    ],
})
export class BoughtComponent extends BaseTabbedSelectableContainerComponent<MinimalItem> {
    protected tabKeys: string[] = [];
    checklistDefinition$ = inject(DatabaseService)
        .fetchBoughtChecklist$()
        .pipe(
            tap((checklist) => {
                const keys = Object.keys(checklist);
                this.tabKeys = keys;
                this.activateTabFromRoute(keys);
            }),
        );

    protected readonly uiIcon = UiIcon;
}
