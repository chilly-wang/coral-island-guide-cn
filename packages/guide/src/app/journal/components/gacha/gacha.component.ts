import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { GachaMachineData, GachaTier, MinimalItem } from '@ci/data-types';
import { BaseTabbedSelectableContainerComponent } from '../../../shared/components/base-tabbed-selectable-container/base-tabbed-selectable-container.component';
import { ListDetailContainerComponent } from '../../../shared/components/list-detail-container/list-detail-container.component';
import { DatabaseItemDetailsComponent } from '../../../shared/components/database-item-details/database-item-details.component';
import { ItemIconComponent } from '../../../shared/components/item-icon/item-icon.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { CaptureToggleComponent } from '../../../shared/components/capture-toggle/capture-toggle.component';
import { CollectionStatus, collectionStatusOptions, matchesCollectionStatus, StatusFilterComponent } from '../../../shared/components/status-filter/status-filter.component';
import { GachaChecklistService } from '../../../core/services/checklists/gacha-checklist.service';
import { DatabaseService } from '../../../shared/services/database.service';
import { LocalizedEntityNamePipe } from '../../../shared/pipes/localized-display.pipe';

type TierFilter = 'ALL' | GachaTier;

/** Savannah gacha machines (Treasure Bubbles): prize pools per machine, grouped by tier. */
@Component({
    selector: 'app-gacha',
    templateUrl: './gacha.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ListDetailContainerComponent,
        DatabaseItemDetailsComponent,
        MatTabGroup,
        MatTab,
        ItemIconComponent,
        CardComponent,
        CaptureToggleComponent,
        StatusFilterComponent,
        AsyncPipe,
        TranslatePipe,
        LocalizedEntityNamePipe,
    ],
})
export class GachaComponent extends BaseTabbedSelectableContainerComponent<MinimalItem> {
    protected readonly tiers: GachaTier[] = ['special', 'A', 'B', 'C'];
    protected tabKeys: string[] = [];

    readonly machines$ = inject(DatabaseService)
        .fetchSavannahGacha$()
        .pipe(
            tap((machines) => {
                this.tabKeys = machines.map((machine) => machine.key);
                this.activateTabFromRoute(this.tabKeys);
            }),
        );

    readonly obtained = inject(GachaChecklistService);
    readonly obtainedFilter = signal<CollectionStatus>('ALL');
    readonly obtainedFilters = collectionStatusOptions('APP.COLLECTION.OBTAINED_CAPTURED', 'APP.COLLECTION.OBTAINED_UNCAPTURED');
    readonly tierFilter = signal<TierFilter>('ALL');
    readonly tierFilters: { value: TierFilter, label: string }[] = [
        { value: 'ALL', label: 'APP.COLLECTION.ALL' },
        ...this.tiers.map((tier) => ({ value: tier, label: 'APP.GACHA.TIER.' + tier.toUpperCase() })),
    ];

    rewardsOfTier(machine: GachaMachineData, tier: GachaTier): MinimalItem[] {
        if (this.tierFilter() !== 'ALL' && this.tierFilter() !== tier) return [];
        return machine.rewards
            .filter((reward) => reward.tier === tier)
            .map((reward) => reward.item)
            .filter((item) => matchesCollectionStatus(this.obtainedFilter(), this.obtained.isChecked(item.id)));
    }
}
