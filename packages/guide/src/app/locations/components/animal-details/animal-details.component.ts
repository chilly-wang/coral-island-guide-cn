import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { UiIcon } from '@ci/data-types';
import { MappedAnimalShopData } from '../../types/mapped-animal-shop-data.type';
import { ListDetailService } from '../../../shared/components/list-detail-container/list-detail.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { UiIconComponent } from '../../../shared/components/ui-icon/ui-icon.component';
import { ItemIconComponent } from '../../../shared/components/item-icon/item-icon.component';
import { MoneyComponent } from '../../../shared/components/money/money.component';
import { TownrankPipe } from '../../../shared/pipes/townrank.pipe';
import { KeyValuePipe } from '@angular/common';
import { IsMinimalItemPipe } from '../../../shared/pipes/is-minimal-item.pipe';
import { RequirementsListComponent } from '../../../shared/components/requirements-list/requirements-list.component';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTooltip } from '@angular/material/tooltip';
import { LocalizedDisplayPipe } from '../../../shared/pipes/localized-display.pipe';

import { LocalizedEntityNamePipe } from '../../../shared/pipes/localized-display.pipe';

@Component({
    selector: 'app-animal-details',
    templateUrl: './animal-details.component.html',

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        LocalizedEntityNamePipe,
        CardComponent,
        UiIconComponent,
        ItemIconComponent,
        MoneyComponent,
        TownrankPipe,
        KeyValuePipe,
        IsMinimalItemPipe,
        RequirementsListComponent,
        TranslatePipe,
        MatTooltip,
        LocalizedDisplayPipe,
    ],
})
export class AnimalDetailsComponent {
    mappedAnimalShopData = input.required<MappedAnimalShopData>();
    listDetails = inject(ListDetailService);
    protected readonly UiIcon = UiIcon;
    protected readonly uiIcon = UiIcon;
}
