import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatCheckbox } from '@angular/material/checkbox';
import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';
import { MinimalItem } from '@ci/data-types';
import { ListDetailContainerComponent } from '../../../shared/components/list-detail-container/list-detail-container.component';
import { ItemIconComponent } from '../../../shared/components/item-icon/item-icon.component';
import { DatabaseItemDetailsComponent } from '../../../shared/components/database-item-details/database-item-details.component';
import { StatusFilterComponent } from '../../../shared/components/status-filter/status-filter.component';
import { GachaChecklistService } from '../../../core/services/checklists/gacha-checklist.service';
import { BaseItemChecklistComponent } from '../base-item-checklist.component';

/** Same data as the Savannah gacha journal page; checking an item here checks it there too. */
@Component({
    selector: 'app-gacha-checklist',
    templateUrl: './gacha-checklist.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        StatusFilterComponent,
        MatTab,
        ReactiveFormsModule,
        MatTabGroup,
        ListDetailContainerComponent,
        ItemIconComponent,
        MatCheckbox,
        AsyncPipe,
        DatabaseItemDetailsComponent,
        KeyValuePipe,
        TranslatePipe,
    ],
})
export class GachaChecklistComponent extends BaseItemChecklistComponent {
    checklistService = inject(GachaChecklistService);
    checklistDefinition$ = this._database.fetchSavannahGacha$().pipe(
        map((machines) => Object.fromEntries(
            machines.map((machine) => [machine.key, machine.rewards.map((reward) => reward.item)]),
        ) as Record<string, MinimalItem[]>),
    );

    constructor() {
        super();
    }
}
