import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseTableComponent } from '../../../../shared/components/base-table/base-table.component';
import { ItemUpgradeData } from '@ci/data-types';
import { MoneyComponent } from '../../../../shared/components/money/money.component';
import { MatTableModule } from '@angular/material/table';
import { TableItemListComponent } from '../../../../shared/components/table-item-list/table-item-list.component';
import { TownrankPipe } from '../../../../shared/pipes/townrank.pipe';
import { RouterLink } from '@angular/router';
import { ItemIconComponent } from '../../../../shared/components/item-icon/item-icon.component';
import { ResponsiveTableComponent } from '../../../../shared/components/responsive-table/responsive-table.component';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizedDisplayPipe } from '../../../../shared/pipes/localized-display.pipe';

import { LocalizedEntityNamePipe } from '../../../../shared/pipes/localized-display.pipe';
import { getBuildingAnimalCapacity } from '../../../data/carpenter-building-upgrade-supplements';

@Component({
    selector: 'app-item-upgrade-table',
    templateUrl: './item-upgrade-table.component.html',

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        LocalizedEntityNamePipe,
        MoneyComponent,
        TableItemListComponent,
        TownrankPipe,
        RouterLink,
        ItemIconComponent,
        MatTableModule,
        ResponsiveTableComponent,
        MatSort,
        MatSortHeader,
        TranslatePipe,
        LocalizedDisplayPipe,
    ],
})
export class ItemUpgradeTableComponent extends BaseTableComponent<
    ItemUpgradeData & {
        shop?: { url: string; displayName: string };
    }
> {
    protected readonly BASE_DISPLAY_COLUMNS: string[] = [
        'icon',
        'displayName',
        'townRank',
        'unlockRequirements',
        'daysDelay',
        'requirements',
    ];

    protected override setupDataSource(dataSource: (ItemUpgradeData & { shop?: { url: string; displayName: string } })[]) {
        super.setupDataSource(dataSource);
        if (dataSource.some((entry) => entry.shop)) {
            this.displayedColumns.splice(2, 0, 'shop');
        }
        if (dataSource.some((entry) => getBuildingAnimalCapacity(entry.item.id) !== undefined)) {
            this.displayedColumns.splice(this.displayedColumns.indexOf('daysDelay') + 1, 0, 'animalCapacity');
        }
        this.displayHeaderColumns = this.displayedColumns.filter((column) => column !== 'icon');
    }

    protected readonly getAnimalCapacity = getBuildingAnimalCapacity;
}
