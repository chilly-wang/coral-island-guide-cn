import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DevelopEquipmentData } from '@ci/data-types';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseTableComponent } from '../../../../shared/components/base-table/base-table.component';
import { ItemIconComponent } from '../../../../shared/components/item-icon/item-icon.component';
import { MoneyComponent } from '../../../../shared/components/money/money.component';
import { ResponsiveTableComponent } from '../../../../shared/components/responsive-table/responsive-table.component';
import { TableItemListComponent } from '../../../../shared/components/table-item-list/table-item-list.component';
import { TownrankPipe } from '../../../../shared/pipes/townrank.pipe';

@Component({
    selector: 'app-develop-equipment-table',
    templateUrl: './develop-equipment-table.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ItemIconComponent,
        MatTableModule,
        MatSort,
        MatSortHeader,
        MoneyComponent,
        ResponsiveTableComponent,
        TableItemListComponent,
        TownrankPipe,
        TranslatePipe,
    ],
})
export class DevelopEquipmentTableComponent extends BaseTableComponent<DevelopEquipmentData> {
    protected readonly BASE_DISPLAY_COLUMNS: string[] = [
        'icon',
        'displayName',
        'townRank',
        'appliesTo',
        'dependencies',
        'price',
    ];

    protected override setupDataSource(dataSource: DevelopEquipmentData[]) {
        super.setupDataSource(dataSource);
        if (dataSource.every((entry) => entry.townRank === null)) {
            this.displayedColumns = this.displayedColumns.filter((column) => column !== 'townRank');
        }
        this.displayHeaderColumns = this.displayedColumns.filter((column) => column !== 'icon');
    }
}
