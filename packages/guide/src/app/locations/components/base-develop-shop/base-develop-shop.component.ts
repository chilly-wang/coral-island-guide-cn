import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DevelopEquipmentData, ItemProcessShopData, ItemUpgradeData, ShopItemData } from "@ci/data-types";
import { Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { BaseShopComponent } from "../base-shop/base-shop.component";
import { UiIconComponent } from "../../../shared/components/ui-icon/ui-icon.component";
import { ListDetailContainerComponent } from "../../../shared/components/list-detail-container/list-detail-container.component";
import { DataFilterComponent } from "../../../shared/components/data-filter/data-filter.component";
import { ItemIconComponent } from "../../../shared/components/item-icon/item-icon.component";
import { CardComponent } from "../../../shared/components/card/card.component";
import { ItemUpgradeDetailsComponent } from "../item-upgrade-details/item-upgrade-details.component";
import { ItemUpgradeTableComponent } from "../tables/item-upgrade-table/item-upgrade-table.component";
import { ShopItemProcessTableComponent } from "../tables/shop-item-process-table/shop-item-process-table.component";
import { ShopItemDataTableComponent } from "../tables/shop-item-data-table/shop-item-data-table.component";
import { OpeningHoursComponent } from "../opening-hours/opening-hours.component";
import { ShopItemDataDetailsComponent } from "../shop-item-data-details/shop-item-data-details.component";
import { ShopItemProcessDataDetailsComponent } from "../shop-item-process-data-details/shop-item-process-data-details.component";
import { DevelopEquipmentDetailsComponent } from "../develop-equipment-details/develop-equipment-details.component";
import { DevelopEquipmentTableComponent } from "../tables/develop-equipment-table/develop-equipment-table.component";

/** Everything the develop shop template uses; spread into the `imports` of each shop component. */
export const DEVELOP_SHOP_IMPORTS = [
    UiIconComponent,
    ListDetailContainerComponent,
    ItemUpgradeDetailsComponent,
    ItemUpgradeTableComponent,
    DataFilterComponent,
    ItemIconComponent,
    ShopItemProcessTableComponent,
    ShopItemDataTableComponent,
    OpeningHoursComponent,
    CardComponent,
    ShopItemDataDetailsComponent,
    ShopItemProcessDataDetailsComponent,
    DevelopEquipmentDetailsComponent,
    DevelopEquipmentTableComponent,
    AsyncPipe,
];

/**
 * Shop page with a "Develop equipment" section (lab, Oracle Chamber). Uses its own template, which is the
 * shared shop template plus an optional tail stock list and the develop equipment section.
 */
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    template: '',
})
export abstract class BaseDevelopShopComponent extends BaseShopComponent {

    protected developEquipmentHeaderText = 'APP.SHOP.DEVELOP_EQUIPMENT';
    protected developEquipment$?: Observable<DevelopEquipmentData[]>;
    protected selectedDevelopEquipment: DevelopEquipmentData | undefined;
    protected showDevelopEquipmentTable = false;

    protected tailShopItemData$?: Observable<ShopItemData[]>;
    protected showTailTable = false;

    override showDetails(selectedEntry?: ShopItemData) {
        this.selectedDevelopEquipment = undefined;
        super.showDetails(selectedEntry);
    }

    override showProcessDetails(selectedEntry?: ItemProcessShopData) {
        this.selectedDevelopEquipment = undefined;
        super.showProcessDetails(selectedEntry);
    }

    override showItemUpgradeDetails(selectedEntry?: ItemUpgradeData) {
        this.selectedDevelopEquipment = undefined;
        super.showItemUpgradeDetails(selectedEntry);
    }

    showDevelopEquipmentDetails(selectedEntry: DevelopEquipmentData) {
        this.selectedEntity = undefined;
        this.selectedProcessEntity = undefined;
        this.selectedItemUpgrade = undefined;
        this.selectedDevelopEquipment = selectedEntry;
        this.listDetail.open();
    }
}
