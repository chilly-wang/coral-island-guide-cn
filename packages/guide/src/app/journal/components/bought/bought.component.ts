import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
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
import { LocalizedDisplayPipe, LocalizedEntityNamePipe } from '../../../shared/pipes/localized-display.pipe';
import { BoughtChecklistService } from '../../../core/services/checklists/bought-checklist.service';
import { CaptureToggleComponent } from '../../../shared/components/capture-toggle/capture-toggle.component';
import { CollectionStatus, collectionStatusOptions, matchesCollectionStatus, StatusFilterComponent } from '../../../shared/components/status-filter/status-filter.component';

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
        LocalizedEntityNamePipe,
        CaptureToggleComponent,
        StatusFilterComponent,
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

    // Reads and writes the same checklist as "My Coral Guide > Clothing checklist".
    readonly bought = inject(BoughtChecklistService);
    readonly obtainedFilter = signal<CollectionStatus>('ALL');
    readonly obtainedFilters = collectionStatusOptions('APP.COLLECTION.OBTAINED_CAPTURED', 'APP.COLLECTION.OBTAINED_UNCAPTURED');

    filterObtained(entries: MinimalItem[]): MinimalItem[] {
        return entries.filter(entry => matchesCollectionStatus(this.obtainedFilter(), this.bought.isChecked(entry.id)));
    }
}
