import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ItemUpgradeData } from "@ci/data-types";
import { ItemListComponent } from "../../../shared/components/item-list/item-list.component";
import { MoneyComponent } from "../../../shared/components/money/money.component";
import { BaseItemCardComponent } from "../../../shared/components/base-item-card/base-item-card.component";
import { TownrankPipe } from "../../../shared/pipes/townrank.pipe";
import { TranslatePipe } from "@ngx-translate/core";
import { getBuildingAnimalCapacity } from '../../data/carpenter-building-upgrade-supplements';

@Component({
    selector: 'app-item-upgrade-details',
    templateUrl: './item-upgrade-details.component.html',

    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ItemListComponent,
        MoneyComponent,
        BaseItemCardComponent,
        TownrankPipe,
        TranslatePipe
    ]
})
export class ItemUpgradeDetailsComponent {

    itemUpgradeData = input.required<ItemUpgradeData>()
    protected animalCapacity = computed(() => getBuildingAnimalCapacity(this.itemUpgradeData().item.id));

}
