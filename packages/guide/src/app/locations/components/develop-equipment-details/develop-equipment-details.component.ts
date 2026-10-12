import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DevelopEquipmentData, UiIcon } from '@ci/data-types';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ItemIconComponent } from '../../../shared/components/item-icon/item-icon.component';
import { ItemListComponent } from '../../../shared/components/item-list/item-list.component';
import { MoneyComponent } from '../../../shared/components/money/money.component';
import { UiIconComponent } from '../../../shared/components/ui-icon/ui-icon.component';
import { ListDetailService } from '../../../shared/components/list-detail-container/list-detail.service';
import { TownrankPipe } from '../../../shared/pipes/townrank.pipe';

@Component({
    selector: 'app-develop-equipment-details',
    templateUrl: './develop-equipment-details.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        CardComponent,
        ItemIconComponent,
        ItemListComponent,
        MoneyComponent,
        UiIconComponent,
        TownrankPipe,
        TranslatePipe,
        RouterLink,
        MatTooltip,
    ],
})
export class DevelopEquipmentDetailsComponent {
    developEquipment = input.required<DevelopEquipmentData>();

    protected readonly uiIcon = UiIcon;
    protected readonly listDetails = inject(ListDetailService);
}
